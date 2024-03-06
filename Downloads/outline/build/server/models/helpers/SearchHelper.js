"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _removeMarkdown = _interopRequireDefault(require("@tommoor/remove-markdown"));
var _invariant = _interopRequireDefault(require("invariant"));
var _find = _interopRequireDefault(require("lodash/find"));
var _map = _interopRequireDefault(require("lodash/map"));
var _pgTsquery = _interopRequireDefault(require("pg-tsquery"));
var _sequelize = require("sequelize");
var _Collection = _interopRequireDefault(require("./../Collection"));
var _Document = _interopRequireDefault(require("./../Document"));
var _Team = _interopRequireDefault(require("./../Team"));
var _User = _interopRequireDefault(require("./../User"));
var _database = require("./../../storage/database");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class SearchHelper {
  static async searchForTeam(team, query) {
    var _options$share;
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    const {
      snippetMinWords = 20,
      snippetMaxWords = 30,
      limit = 15,
      offset = 0
    } = options;
    const where = await this.buildWhere(team, options);
    if ((_options$share = options.share) !== null && _options$share !== void 0 && _options$share.includeChildDocuments) {
      const sharedDocument = await options.share.$get("document");
      (0, _invariant.default)(sharedDocument, "Cannot find document for share");
      const childDocumentIds = await sharedDocument.findAllChildDocumentIds({
        archivedAt: {
          [_sequelize.Op.is]: null
        }
      });
      where[_sequelize.Op.and].push({
        id: [sharedDocument.id, ...childDocumentIds]
      });
    }
    where[_sequelize.Op.and].push(_sequelize.Sequelize.fn("\"searchVector\" @@ to_tsquery", "english", _sequelize.Sequelize.literal(":query")));
    const queryReplacements = {
      query: this.webSearchQuery(query),
      headlineOptions: "MaxFragments=1, MinWords=".concat(snippetMinWords, ", MaxWords=").concat(snippetMaxWords)
    };
    const resultsQuery = _Document.default.unscoped().findAll({
      attributes: ["id", [_sequelize.Sequelize.literal("ts_rank(\"searchVector\", to_tsquery('english', :query))"), "searchRanking"], [_sequelize.Sequelize.literal("ts_headline('english', \"text\", to_tsquery('english', :query), :headlineOptions)"), "searchContext"]],
      replacements: queryReplacements,
      where,
      order: [["searchRanking", "DESC"], ["updatedAt", "DESC"]],
      limit,
      offset
    });
    const countQuery = _Document.default.unscoped().count({
      // @ts-expect-error Types are incorrect for count
      replacements: queryReplacements,
      where
    });
    const [results, count] = await Promise.all([resultsQuery, countQuery]);

    // Final query to get associated document data
    const documents = await _Document.default.findAll({
      where: {
        id: (0, _map.default)(results, "id"),
        teamId: team.id
      },
      include: [{
        model: _Collection.default,
        as: "collection"
      }]
    });
    return this.buildResponse(results, documents, count);
  }
  static async searchTitlesForUser(user, query) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    const {
      limit = 15,
      offset = 0
    } = options;
    const where = await this.buildWhere(user, options);
    where[_sequelize.Op.and].push({
      title: {
        [_sequelize.Op.iLike]: "%".concat(query, "%")
      }
    });
    const include = [{
      association: "memberships",
      where: {
        userId: user.id
      },
      required: false,
      separate: false
    }, {
      model: _User.default,
      as: "createdBy",
      paranoid: false
    }, {
      model: _User.default,
      as: "updatedBy",
      paranoid: false
    }];
    return _Document.default.scope(["withoutState", "withDrafts", {
      method: ["withViews", user.id]
    }, {
      method: ["withCollectionPermissions", user.id]
    }, {
      method: ["withMembership", user.id]
    }]).findAll({
      where,
      subQuery: false,
      order: [["updatedAt", "DESC"]],
      include,
      offset,
      limit
    });
  }
  static async searchForUser(user, query) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    const {
      snippetMinWords = 20,
      snippetMaxWords = 30,
      limit = 15,
      offset = 0
    } = options;
    const where = await this.buildWhere(user, options);
    where[_sequelize.Op.and].push(_sequelize.Sequelize.fn("\"searchVector\" @@ to_tsquery", "english", _sequelize.Sequelize.literal(":query")));
    const queryReplacements = {
      query: this.webSearchQuery(query),
      headlineOptions: "MaxFragments=1, MinWords=".concat(snippetMinWords, ", MaxWords=").concat(snippetMaxWords)
    };
    const include = [{
      association: "memberships",
      where: {
        userId: user.id
      },
      required: false,
      separate: false
    }];
    const resultsQuery = _Document.default.unscoped().findAll({
      attributes: ["id", [_sequelize.Sequelize.literal("ts_rank(\"searchVector\", to_tsquery('english', :query))"), "searchRanking"], [_sequelize.Sequelize.literal("ts_headline('english', \"text\", to_tsquery('english', :query), :headlineOptions)"), "searchContext"]],
      subQuery: false,
      include,
      replacements: queryReplacements,
      where,
      order: [["searchRanking", "DESC"], ["updatedAt", "DESC"]],
      limit,
      offset
    });
    const countQuery = _Document.default.unscoped().count({
      // @ts-expect-error Types are incorrect for count
      subQuery: false,
      include,
      replacements: queryReplacements,
      where
    });
    const [results, count] = await Promise.all([resultsQuery, countQuery]);

    // Final query to get associated document data
    const documents = await _Document.default.scope(["withoutState", "withDrafts", {
      method: ["withViews", user.id]
    }, {
      method: ["withCollectionPermissions", user.id]
    }, {
      method: ["withMembership", user.id]
    }]).findAll({
      where: {
        teamId: user.teamId,
        id: (0, _map.default)(results, "id")
      }
    });
    return this.buildResponse(results, documents, count);
  }
  static async buildWhere(model, options) {
    const teamId = model instanceof _Team.default ? model.id : model.teamId;
    const where = {
      teamId,
      [_sequelize.Op.or]: [],
      [_sequelize.Op.and]: [{
        deletedAt: {
          [_sequelize.Op.eq]: null
        }
      }]
    };
    if (model instanceof _User.default) {
      where[_sequelize.Op.or].push({
        "$memberships.id$": {
          [_sequelize.Op.ne]: null
        }
      });
    }

    // Ensure we're filtering by the users accessible collections. If
    // collectionId is passed as an option it is assumed that the authorization
    // has already been done in the router
    const collectionIds = options.collectionId ? [options.collectionId] : await model.collectionIds();
    if (collectionIds.length) {
      where[_sequelize.Op.or].push({
        collectionId: collectionIds
      });
    }
    if (options.dateFilter) {
      where[_sequelize.Op.and].push({
        updatedAt: {
          [_sequelize.Op.gt]: _database.sequelize.literal("now() - interval '1 ".concat(options.dateFilter, "'"))
        }
      });
    }
    if (options.collaboratorIds) {
      where[_sequelize.Op.and].push({
        collaboratorIds: {
          [_sequelize.Op.contains]: options.collaboratorIds
        }
      });
    }
    if (!options.includeArchived) {
      where[_sequelize.Op.and].push({
        archivedAt: {
          [_sequelize.Op.eq]: null
        }
      });
    }
    if (options.includeDrafts && model instanceof _User.default) {
      where[_sequelize.Op.and].push({
        [_sequelize.Op.or]: [{
          publishedAt: {
            [_sequelize.Op.ne]: null
          }
        }, {
          createdById: model.id
        }, {
          "$memberships.id$": {
            [_sequelize.Op.ne]: null
          }
        }]
      });
    } else {
      where[_sequelize.Op.and].push({
        publishedAt: {
          [_sequelize.Op.ne]: null
        }
      });
    }
    return where;
  }
  static buildResponse(results, documents, count) {
    return {
      results: (0, _map.default)(results, result => ({
        ranking: result.searchRanking,
        context: (0, _removeMarkdown.default)(result.searchContext, {
          stripHTML: false
        }),
        document: (0, _find.default)(documents, {
          id: result.id
        })
      })),
      totalCount: count
    };
  }

  /**
   * Convert a user search query into a format that can be used by Postgres
   *
   * @param query The user search query
   * @returns The query formatted for Postgres ts_query
   */
  static webSearchQuery(query) {
    // limit length of search queries as we're using regex against untrusted input
    let limitedQuery = this.escapeQuery(query.slice(0, this.maxQueryLength));
    const quotedSearch = limitedQuery.startsWith('"') && limitedQuery.endsWith('"');

    // Replace single quote characters with &.
    const singleQuotes = limitedQuery.matchAll(/'+/g);
    for (const match of singleQuotes) {
      if (match.index && match.index > 0 && match.index < limitedQuery.length - 1) {
        limitedQuery = limitedQuery.substring(0, match.index) + "&" + limitedQuery.substring(match.index + 1);
      }
    }
    return (0, _pgTsquery.default)()(quotedSearch ? limitedQuery : "".concat(limitedQuery, "*"))
    // Remove any trailing join characters
    .replace(/&$/, "");
  }
  static escapeQuery(query) {
    // replace "\" with escaped "\\" because sequelize.escape doesn't do it
    // https://github.com/sequelize/sequelize/issues/2950
    return query.replace(/\\/g, "\\\\");
  }
}
exports.default = SearchHelper;
/**
 * The maximum length of a search query.
 */
_defineProperty(SearchHelper, "maxQueryLength", 1000);