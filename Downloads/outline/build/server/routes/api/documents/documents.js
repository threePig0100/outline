"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _path = _interopRequireDefault(require("path"));
var _fractionalIndex = _interopRequireDefault(require("fractional-index"));
var _fsExtra = _interopRequireDefault(require("fs-extra"));
var _invariant = _interopRequireDefault(require("invariant"));
var _jszip = _interopRequireDefault(require("jszip"));
var _koaRouter = _interopRequireDefault(require("koa-router"));
var _escapeRegExp = _interopRequireDefault(require("lodash/escapeRegExp"));
var _mimeTypes = _interopRequireDefault(require("mime-types"));
var _sequelize = require("sequelize");
var _types = require("./../../../../shared/types");
var _date = require("./../../../../shared/utils/date");
var _slugify = _interopRequireDefault(require("./../../../../shared/utils/slugify"));
var _documentCreator = _interopRequireDefault(require("./../../../commands/documentCreator"));
var _documentDuplicator = _interopRequireDefault(require("./../../../commands/documentDuplicator"));
var _documentImporter = _interopRequireDefault(require("./../../../commands/documentImporter"));
var _documentLoader = _interopRequireDefault(require("./../../../commands/documentLoader"));
var _documentMover = _interopRequireDefault(require("./../../../commands/documentMover"));
var _documentPermanentDeleter = _interopRequireDefault(require("./../../../commands/documentPermanentDeleter"));
var _documentUpdater = _interopRequireDefault(require("./../../../commands/documentUpdater"));
var _env = _interopRequireDefault(require("./../../../env"));
var _errors = require("./../../../errors");
var _Logger = _interopRequireDefault(require("./../../../logging/Logger"));
var _authentication = _interopRequireDefault(require("./../../../middlewares/authentication"));
var _multipart = _interopRequireDefault(require("./../../../middlewares/multipart"));
var _rateLimiter = require("./../../../middlewares/rateLimiter");
var _transaction = require("./../../../middlewares/transaction");
var _validate = _interopRequireDefault(require("./../../../middlewares/validate"));
var _models = require("./../../../models");
var _DocumentHelper = _interopRequireDefault(require("./../../../models/helpers/DocumentHelper"));
var _SearchHelper = _interopRequireDefault(require("./../../../models/helpers/SearchHelper"));
var _policies = require("./../../../policies");
var _presenters = require("./../../../presenters");
var _RateLimiter = require("./../../../utils/RateLimiter");
var _ZipHelper = _interopRequireDefault(require("./../../../utils/ZipHelper"));
var _parseAttachmentIds = _interopRequireDefault(require("./../../../utils/parseAttachmentIds"));
var _passport = require("./../../../utils/passport");
var _validation = require("./../../../validation");
var _pagination = _interopRequireDefault(require("../middlewares/pagination"));
var T = _interopRequireWildcard(require("./schema"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = new _koaRouter.default();
router.post("documents.list", (0, _authentication.default)(), (0, _pagination.default)(), (0, _validate.default)(T.DocumentsListSchema), async ctx => {
  let {
    sort
  } = ctx.input.body;
  const {
    direction,
    template,
    collectionId,
    backlinkDocumentId,
    parentDocumentId,
    userId: createdById
  } = ctx.input.body;

  // always filter by the current team
  const {
    user
  } = ctx.state.auth;
  let where = {
    teamId: user.teamId,
    archivedAt: {
      [_sequelize.Op.is]: null
    }
  };
  if (template) {
    where = {
      ...where,
      template: true
    };
  }

  // if a specific user is passed then add to filters. If the user doesn't
  // exist in the team then nothing will be returned, so no need to check auth
  if (createdById) {
    where = {
      ...where,
      createdById
    };
  }
  let documentIds = [];

  // if a specific collection is passed then we need to check auth to view it
  if (collectionId) {
    where = {
      ...where,
      collectionId
    };
    const collection = await _models.Collection.scope({
      method: ["withMembership", user.id]
    }).findByPk(collectionId);
    (0, _policies.authorize)(user, "readDocument", collection);

    // index sort is special because it uses the order of the documents in the
    // collection.documentStructure rather than a database column
    if (sort === "index") {
      documentIds = ((collection === null || collection === void 0 ? void 0 : collection.documentStructure) || []).map(node => node.id).slice(ctx.state.pagination.offset, ctx.state.pagination.limit);
      where = {
        ...where,
        id: documentIds
      };
    } // otherwise, filter by all collections the user has access to
  } else {
    const collectionIds = await user.collectionIds();
    where = {
      ...where,
      collectionId: collectionIds
    };
  }
  if (parentDocumentId) {
    const membership = await _models.UserMembership.findOne({
      where: {
        userId: user.id,
        documentId: parentDocumentId
      }
    });
    if (membership) {
      delete where.collectionId;
    }
    where = {
      ...where,
      parentDocumentId
    };
  }

  // Explicitly passing 'null' as the parentDocumentId allows listing documents
  // that have no parent document (aka they are at the root of the collection)
  if (parentDocumentId === null) {
    where = {
      ...where,
      parentDocumentId: {
        [_sequelize.Op.is]: null
      }
    };
  }
  if (backlinkDocumentId) {
    const backlinks = await _models.Backlink.findAll({
      attributes: ["reverseDocumentId"],
      where: {
        documentId: backlinkDocumentId
      }
    });
    where = {
      ...where,
      id: backlinks.map(backlink => backlink.reverseDocumentId)
    };
  }
  if (sort === "index") {
    sort = "updatedAt";
  }
  const [documents, total] = await Promise.all([_models.Document.defaultScopeWithUser(user.id).findAll({
    where,
    order: [[sort, direction]],
    offset: ctx.state.pagination.offset,
    limit: ctx.state.pagination.limit
  }), _models.Document.count({
    where
  })]);

  // index sort is special because it uses the order of the documents in the
  // collection.documentStructure rather than a database column
  if (documentIds.length) {
    documents.sort((a, b) => documentIds.indexOf(a.id) - documentIds.indexOf(b.id));
  }
  const data = await Promise.all(documents.map(document => (0, _presenters.presentDocument)(document)));
  const policies = (0, _presenters.presentPolicies)(user, documents);
  ctx.body = {
    pagination: {
      ...ctx.state.pagination,
      total
    },
    data,
    policies
  };
});
router.post("documents.archived", (0, _authentication.default)({
  member: true
}), (0, _pagination.default)(), (0, _validate.default)(T.DocumentsArchivedSchema), async ctx => {
  const {
    sort,
    direction
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const collectionIds = await user.collectionIds();
  const collectionScope = {
    method: ["withCollectionPermissions", user.id]
  };
  const viewScope = {
    method: ["withViews", user.id]
  };
  const documents = await _models.Document.scope(["defaultScope", collectionScope, viewScope]).findAll({
    where: {
      teamId: user.teamId,
      collectionId: collectionIds,
      archivedAt: {
        [_sequelize.Op.ne]: null
      }
    },
    order: [[sort, direction]],
    offset: ctx.state.pagination.offset,
    limit: ctx.state.pagination.limit
  });
  const data = await Promise.all(documents.map(document => (0, _presenters.presentDocument)(document)));
  const policies = (0, _presenters.presentPolicies)(user, documents);
  ctx.body = {
    pagination: ctx.state.pagination,
    data,
    policies
  };
});
router.post("documents.deleted", (0, _authentication.default)({
  member: true
}), (0, _pagination.default)(), (0, _validate.default)(T.DocumentsDeletedSchema), async ctx => {
  const {
    sort,
    direction
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const collectionIds = await user.collectionIds({
    paranoid: false
  });
  const collectionScope = {
    method: ["withCollectionPermissions", user.id]
  };
  const viewScope = {
    method: ["withViews", user.id]
  };
  const documents = await _models.Document.scope([collectionScope, viewScope, "withDrafts"]).findAll({
    where: {
      teamId: user.teamId,
      deletedAt: {
        [_sequelize.Op.ne]: null
      },
      [_sequelize.Op.or]: [{
        collectionId: {
          [_sequelize.Op.in]: collectionIds
        }
      }, {
        createdById: user.id,
        collectionId: {
          [_sequelize.Op.is]: null
        }
      }]
    },
    paranoid: false,
    order: [[sort, direction]],
    offset: ctx.state.pagination.offset,
    limit: ctx.state.pagination.limit
  });
  const data = await Promise.all(documents.map(document => (0, _presenters.presentDocument)(document)));
  const policies = (0, _presenters.presentPolicies)(user, documents);
  ctx.body = {
    pagination: ctx.state.pagination,
    data,
    policies
  };
});
router.post("documents.viewed", (0, _authentication.default)(), (0, _pagination.default)(), (0, _validate.default)(T.DocumentsViewedSchema), async ctx => {
  const {
    sort,
    direction
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const collectionIds = await user.collectionIds();
  const userId = user.id;
  const views = await _models.View.findAll({
    where: {
      userId
    },
    order: [[sort, direction]],
    include: [{
      model: _models.Document.scope(["withDrafts", {
        method: ["withMembership", userId]
      }]),
      required: true,
      where: {
        collectionId: collectionIds
      },
      include: [{
        model: _models.Collection.scope({
          method: ["withMembership", userId]
        }),
        as: "collection"
      }]
    }],
    offset: ctx.state.pagination.offset,
    limit: ctx.state.pagination.limit
  });
  const documents = views.map(view => {
    const document = view.document;
    document.views = [view];
    return document;
  });
  const data = await Promise.all(documents.map(document => (0, _presenters.presentDocument)(document)));
  const policies = (0, _presenters.presentPolicies)(user, documents);
  ctx.body = {
    pagination: ctx.state.pagination,
    data,
    policies
  };
});
router.post("documents.drafts", (0, _authentication.default)(), (0, _pagination.default)(), (0, _validate.default)(T.DocumentsDraftsSchema), async ctx => {
  const {
    collectionId,
    dateFilter,
    direction,
    sort
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  if (collectionId) {
    const collection = await _models.Collection.scope({
      method: ["withMembership", user.id]
    }).findByPk(collectionId);
    (0, _policies.authorize)(user, "readDocument", collection);
  }
  const collectionIds = collectionId ? [collectionId] : await user.collectionIds();
  const where = {
    createdById: user.id,
    collectionId: {
      [_sequelize.Op.or]: [{
        [_sequelize.Op.in]: collectionIds
      }, {
        [_sequelize.Op.is]: null
      }]
    },
    publishedAt: {
      [_sequelize.Op.is]: null
    }
  };
  if (dateFilter) {
    where.updatedAt = {
      [_sequelize.Op.gte]: (0, _date.subtractDate)(new Date(), dateFilter)
    };
  } else {
    delete where.updatedAt;
  }
  const documents = await _models.Document.defaultScopeWithUser(user.id).findAll({
    where,
    order: [[sort, direction]],
    offset: ctx.state.pagination.offset,
    limit: ctx.state.pagination.limit
  });
  const data = await Promise.all(documents.map(document => (0, _presenters.presentDocument)(document)));
  const policies = (0, _presenters.presentPolicies)(user, documents);
  ctx.body = {
    pagination: ctx.state.pagination,
    data,
    policies
  };
});
router.post("documents.info", (0, _authentication.default)({
  optional: true
}), (0, _validate.default)(T.DocumentsInfoSchema), async ctx => {
  const {
    id,
    shareId,
    apiVersion
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const teamFromCtx = await (0, _passport.getTeamFromContext)(ctx);
  const {
    document,
    share,
    collection
  } = await (0, _documentLoader.default)({
    id,
    shareId,
    user,
    teamId: teamFromCtx === null || teamFromCtx === void 0 ? void 0 : teamFromCtx.id
  });
  const isPublic = (0, _policies.cannot)(user, "read", document);
  const serializedDocument = await (0, _presenters.presentDocument)(document, {
    isPublic
  });
  const team = await document.$get("team");

  // Passing apiVersion=2 has a single effect, to change the response payload to
  // include top level keys for document, sharedTree, and team.
  const data = apiVersion === 2 ? {
    document: serializedDocument,
    team: team !== null && team !== void 0 && team.getPreference(_types.TeamPreference.PublicBranding) ? (0, _presenters.presentPublicTeam)(team) : undefined,
    sharedTree: share && share.includeChildDocuments ? collection === null || collection === void 0 ? void 0 : collection.getDocumentTree(share.documentId) : undefined
  } : serializedDocument;
  ctx.body = {
    data,
    policies: isPublic ? undefined : (0, _presenters.presentPolicies)(user, [document])
  };
});
router.post("documents.users", (0, _authentication.default)(), (0, _pagination.default)(), (0, _validate.default)(T.DocumentsUsersSchema), async ctx => {
  const {
    id,
    query
  } = ctx.input.body;
  const actor = ctx.state.auth.user;
  const {
    offset,
    limit
  } = ctx.state.pagination;
  const document = await _models.Document.findByPk(id, {
    userId: actor.id
  });
  (0, _policies.authorize)(actor, "read", document);
  let users = [];
  let total = 0;
  let where = {
    teamId: document.teamId,
    suspendedAt: {
      [_sequelize.Op.is]: null
    }
  };
  if (document.collectionId) {
    const collection = await document.$get("collection");
    if (!(collection !== null && collection !== void 0 && collection.permission)) {
      const memberIds = await _models.Collection.membershipUserIds(document.collectionId);
      where = {
        ...where,
        id: {
          [_sequelize.Op.in]: memberIds
        }
      };
    }
    if (query) {
      where = {
        ...where,
        name: {
          [_sequelize.Op.iLike]: "%".concat(query, "%")
        }
      };
    }
    [users, total] = await Promise.all([_models.User.findAll({
      where,
      offset,
      limit
    }), _models.User.count({
      where
    })]);
  }
  ctx.body = {
    pagination: {
      ...ctx.state.pagination,
      total
    },
    data: users.map(user => (0, _presenters.presentUser)(user)),
    policies: (0, _presenters.presentPolicies)(actor, users)
  };
});
router.post("documents.export", (0, _rateLimiter.rateLimiter)(_RateLimiter.RateLimiterStrategy.TwentyFivePerMinute), (0, _authentication.default)({
  optional: true
}), (0, _validate.default)(T.DocumentsExportSchema), async ctx => {
  const {
    id
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const accept = ctx.request.headers["accept"];
  const {
    document
  } = await (0, _documentLoader.default)({
    id,
    user,
    // We need the collaborative state to generate HTML.
    includeState: !(accept !== null && accept !== void 0 && accept.includes("text/markdown"))
  });
  let contentType;
  let content;
  if (accept !== null && accept !== void 0 && accept.includes("text/html")) {
    contentType = "text/html";
    content = await _DocumentHelper.default.toHTML(document, {
      signedUrls: true,
      centered: true,
      includeMermaid: true
    });
  } else if (accept !== null && accept !== void 0 && accept.includes("application/pdf")) {
    throw (0, _errors.IncorrectEditionError)("PDF export is not available in the community edition");
  } else if (accept !== null && accept !== void 0 && accept.includes("text/markdown")) {
    contentType = "text/markdown";
    content = _DocumentHelper.default.toMarkdown(document);
  } else {
    ctx.body = {
      data: _DocumentHelper.default.toMarkdown(document)
    };
    return;
  }

  // Override the extension for Markdown as it's incorrect in the mime-types
  // library until a new release > 2.1.35
  const extension = contentType === "text/markdown" ? "md" : _mimeTypes.default.extension(contentType);
  const fileName = (0, _slugify.default)(document.titleWithDefault);
  const attachmentIds = (0, _parseAttachmentIds.default)(document.text);
  const attachments = attachmentIds.length ? await _models.Attachment.findAll({
    where: {
      teamId: document.teamId,
      id: attachmentIds
    }
  }) : [];
  if (attachments.length === 0) {
    ctx.set("Content-Type", contentType);
    ctx.attachment("".concat(fileName, ".").concat(extension));
    ctx.body = content;
    return;
  }
  const zip = new _jszip.default();
  await Promise.all(attachments.map(async attachment => {
    const location = _path.default.join("attachments", "".concat(attachment.id, ".").concat(_mimeTypes.default.extension(attachment.contentType)));
    zip.file(location, new Promise(resolve => {
      attachment.buffer.then(resolve).catch(err => {
        _Logger.default.warn("Failed to read attachment from storage", {
          attachmentId: attachment.id,
          teamId: attachment.teamId,
          error: err.message
        });
        resolve(Buffer.from(""));
      });
    }), {
      date: attachment.updatedAt,
      createFolders: true
    });
    content = content.replace(new RegExp((0, _escapeRegExp.default)(attachment.redirectUrl), "g"), location);
  }));
  zip.file("".concat(fileName, ".").concat(extension), content, {
    date: document.updatedAt
  });
  ctx.set("Content-Type", "application/zip");
  ctx.attachment("".concat(fileName, ".zip"));
  ctx.body = zip.generateNodeStream(_ZipHelper.default.defaultStreamOptions);
});
router.post("documents.restore", (0, _authentication.default)({
  member: true
}), (0, _validate.default)(T.DocumentsRestoreSchema), async ctx => {
  const {
    id,
    collectionId,
    revisionId
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const document = await _models.Document.findByPk(id, {
    userId: user.id,
    paranoid: false
  });
  if (!document) {
    throw (0, _errors.NotFoundError)();
  }

  // Passing collectionId allows restoring to a different collection than the
  // document was originally within
  if (collectionId) {
    document.collectionId = collectionId;
  }
  const collection = document.collectionId ? await _models.Collection.scope({
    method: ["withMembership", user.id]
  }).findByPk(document.collectionId) : undefined;

  // if the collectionId was provided in the request and isn't valid then it will
  // be caught as a 403 on the authorize call below. Otherwise we're checking here
  // that the original collection still exists and advising to pass collectionId
  // if not.
  if (document.collection && !collectionId && !collection) {
    throw (0, _errors.ValidationError)("Unable to restore to original collection, it may have been deleted");
  }
  if (document.collection) {
    (0, _policies.authorize)(user, "updateDocument", collection);
  }
  if (document.deletedAt) {
    (0, _policies.authorize)(user, "restore", document);
    // restore a previously deleted document
    await document.unarchive(user.id);
    await _models.Event.create({
      name: "documents.restore",
      documentId: document.id,
      collectionId: document.collectionId,
      teamId: document.teamId,
      actorId: user.id,
      data: {
        title: document.title
      },
      ip: ctx.request.ip
    });
  } else if (document.archivedAt) {
    (0, _policies.authorize)(user, "unarchive", document);
    // restore a previously archived document
    await document.unarchive(user.id);
    await _models.Event.create({
      name: "documents.unarchive",
      documentId: document.id,
      collectionId: document.collectionId,
      teamId: document.teamId,
      actorId: user.id,
      data: {
        title: document.title
      },
      ip: ctx.request.ip
    });
  } else if (revisionId) {
    // restore a document to a specific revision
    (0, _policies.authorize)(user, "update", document);
    const revision = await _models.Revision.findByPk(revisionId);
    (0, _policies.authorize)(document, "restore", revision);
    document.restoreFromRevision(revision);
    await document.save();
    await _models.Event.create({
      name: "documents.restore",
      documentId: document.id,
      collectionId: document.collectionId,
      teamId: document.teamId,
      actorId: user.id,
      data: {
        title: document.title
      },
      ip: ctx.request.ip
    });
  } else {
    (0, _validation.assertPresent)(revisionId, "revisionId is required");
  }
  ctx.body = {
    data: await (0, _presenters.presentDocument)(document),
    policies: (0, _presenters.presentPolicies)(user, [document])
  };
});
router.post("documents.search_titles", (0, _authentication.default)(), (0, _pagination.default)(), (0, _rateLimiter.rateLimiter)(_RateLimiter.RateLimiterStrategy.OneHundredPerMinute), (0, _validate.default)(T.DocumentsSearchSchema), async ctx => {
  const {
    query,
    includeArchived,
    includeDrafts,
    dateFilter,
    collectionId,
    userId
  } = ctx.input.body;
  const {
    offset,
    limit
  } = ctx.state.pagination;
  const {
    user
  } = ctx.state.auth;
  let collaboratorIds = undefined;
  if (collectionId) {
    const collection = await _models.Collection.scope({
      method: ["withMembership", user.id]
    }).findByPk(collectionId);
    (0, _policies.authorize)(user, "readDocument", collection);
  }
  if (userId) {
    collaboratorIds = [userId];
  }
  const documents = await _SearchHelper.default.searchTitlesForUser(user, query, {
    includeArchived,
    includeDrafts,
    dateFilter,
    collectionId,
    collaboratorIds,
    offset,
    limit
  });
  const policies = (0, _presenters.presentPolicies)(user, documents);
  const data = await Promise.all(documents.map(document => (0, _presenters.presentDocument)(document)));
  ctx.body = {
    pagination: ctx.state.pagination,
    data,
    policies
  };
});
router.post("documents.search", (0, _authentication.default)({
  optional: true
}), (0, _pagination.default)(), (0, _rateLimiter.rateLimiter)(_RateLimiter.RateLimiterStrategy.OneHundredPerMinute), (0, _validate.default)(T.DocumentsSearchSchema), async ctx => {
  const {
    query,
    includeArchived,
    includeDrafts,
    collectionId,
    userId,
    dateFilter,
    shareId,
    snippetMinWords,
    snippetMaxWords
  } = ctx.input.body;
  const {
    offset,
    limit
  } = ctx.state.pagination;

  // Unfortunately, this still doesn't adequately handle cases when auth is optional
  const {
    user
  } = ctx.state.auth;
  let teamId;
  let response;
  let share;
  if (shareId) {
    var _share;
    const teamFromCtx = await (0, _passport.getTeamFromContext)(ctx);
    const {
      document,
      ...loaded
    } = await (0, _documentLoader.default)({
      teamId: teamFromCtx === null || teamFromCtx === void 0 ? void 0 : teamFromCtx.id,
      shareId,
      user
    });
    share = loaded.share;
    if (!((_share = share) !== null && _share !== void 0 && _share.includeChildDocuments)) {
      throw (0, _errors.InvalidRequestError)("Child documents cannot be searched");
    }
    teamId = share.teamId;
    const team = await share.$get("team");
    (0, _invariant.default)(team, "Share must belong to a team");
    response = await _SearchHelper.default.searchForTeam(team, query, {
      includeArchived,
      includeDrafts,
      collectionId: document.collectionId,
      share,
      dateFilter,
      offset,
      limit,
      snippetMinWords,
      snippetMaxWords
    });
  } else {
    if (!user) {
      throw (0, _errors.AuthenticationError)("Authentication error");
    }
    teamId = user.teamId;
    if (collectionId) {
      const collection = await _models.Collection.scope({
        method: ["withMembership", user.id]
      }).findByPk(collectionId);
      (0, _policies.authorize)(user, "readDocument", collection);
    }
    let collaboratorIds = undefined;
    if (userId) {
      collaboratorIds = [userId];
    }
    response = await _SearchHelper.default.searchForUser(user, query, {
      includeArchived,
      includeDrafts,
      collaboratorIds,
      collectionId,
      dateFilter,
      offset,
      limit,
      snippetMinWords,
      snippetMaxWords
    });
  }
  const {
    results,
    totalCount
  } = response;
  const documents = results.map(result => result.document);
  const data = await Promise.all(results.map(async result => {
    const document = await (0, _presenters.presentDocument)(result.document);
    return {
      ...result,
      document
    };
  }));

  // When requesting subsequent pages of search results we don't want to record
  // duplicate search query records
  if (offset === 0) {
    var _share2;
    await _models.SearchQuery.create({
      userId: user === null || user === void 0 ? void 0 : user.id,
      teamId,
      shareId: (_share2 = share) === null || _share2 === void 0 ? void 0 : _share2.id,
      source: ctx.state.auth.type || "app",
      // we'll consider anything that isn't "api" to be "app"
      query,
      results: totalCount
    });
  }
  ctx.body = {
    pagination: ctx.state.pagination,
    data,
    policies: user ? (0, _presenters.presentPolicies)(user, documents) : null
  };
});
router.post("documents.templatize", (0, _authentication.default)({
  member: true
}), (0, _rateLimiter.rateLimiter)(_RateLimiter.RateLimiterStrategy.TwentyFivePerMinute), (0, _validate.default)(T.DocumentsTemplatizeSchema), (0, _transaction.transaction)(), async ctx => {
  const {
    id
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const {
    transaction
  } = ctx.state;
  const original = await _models.Document.findByPk(id, {
    userId: user.id,
    transaction
  });
  (0, _policies.authorize)(user, "update", original);
  const document = await _models.Document.create({
    editorVersion: original.editorVersion,
    collectionId: original.collectionId,
    teamId: original.teamId,
    publishedAt: new Date(),
    lastModifiedById: user.id,
    createdById: user.id,
    template: true,
    emoji: original.emoji,
    title: original.title,
    text: original.text
  }, {
    transaction
  });
  await _models.Event.create({
    name: "documents.create",
    documentId: document.id,
    collectionId: document.collectionId,
    teamId: document.teamId,
    actorId: user.id,
    data: {
      title: document.title,
      template: true
    },
    ip: ctx.request.ip
  }, {
    transaction
  });

  // reload to get all of the data needed to present (user, collection etc)
  const reloaded = await _models.Document.findByPk(document.id, {
    userId: user.id,
    transaction
  });
  (0, _invariant.default)(reloaded, "document not found");
  ctx.body = {
    data: await (0, _presenters.presentDocument)(reloaded),
    policies: (0, _presenters.presentPolicies)(user, [reloaded])
  };
});
router.post("documents.update", (0, _authentication.default)(), (0, _validate.default)(T.DocumentsUpdateSchema), (0, _transaction.transaction)(), async ctx => {
  const {
    transaction
  } = ctx.state;
  const {
    id,
    apiVersion,
    insightsEnabled,
    publish,
    collectionId,
    ...input
  } = ctx.input.body;
  const editorVersion = ctx.headers["x-editor-version"];
  const {
    user
  } = ctx.state.auth;
  let collection;
  const document = await _models.Document.findByPk(id, {
    userId: user.id,
    includeState: true,
    transaction
  });
  collection = document === null || document === void 0 ? void 0 : document.collection;
  (0, _policies.authorize)(user, "update", document);
  if (collection && insightsEnabled !== undefined) {
    (0, _policies.authorize)(user, "updateInsights", document);
  }
  if (publish) {
    (0, _policies.authorize)(user, "publish", document);
    if (!document.collectionId) {
      (0, _validation.assertPresent)(collectionId, "collectionId is required to publish a draft without collection");
      collection = await _models.Collection.scope({
        method: ["withMembership", user.id]
      }).findByPk(collectionId, {
        transaction
      });
    }
    (0, _policies.authorize)(user, "createDocument", collection);
  }
  await (0, _documentUpdater.default)({
    document,
    user,
    ...input,
    publish,
    collectionId,
    insightsEnabled,
    editorVersion,
    transaction,
    ip: ctx.request.ip
  });
  collection = document.collectionId ? await _models.Collection.scope({
    method: ["withMembership", user.id]
  }).findByPk(document.collectionId, {
    transaction
  }) : null;
  document.updatedBy = user;
  document.collection = collection;
  ctx.body = {
    data: apiVersion === 2 ? {
      document: await (0, _presenters.presentDocument)(document),
      collection: collection ? (0, _presenters.presentCollection)(collection) : undefined
    } : await (0, _presenters.presentDocument)(document),
    policies: (0, _presenters.presentPolicies)(user, [document, collection])
  };
});
router.post("documents.duplicate", (0, _authentication.default)(), (0, _validate.default)(T.DocumentsDuplicateSchema), (0, _transaction.transaction)(), async ctx => {
  const {
    transaction
  } = ctx.state;
  const {
    id,
    title,
    publish,
    recursive,
    collectionId,
    parentDocumentId
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const document = await _models.Document.findByPk(id, {
    userId: user.id,
    transaction
  });
  (0, _policies.authorize)(user, "read", document);
  const collection = collectionId ? await _models.Collection.scope({
    method: ["withMembership", user.id]
  }).findByPk(collectionId, {
    transaction
  }) : document === null || document === void 0 ? void 0 : document.collection;
  if (collection) {
    (0, _policies.authorize)(user, "updateDocument", collection);
  }
  if (parentDocumentId) {
    const parent = await _models.Document.findByPk(parentDocumentId, {
      userId: user.id,
      transaction
    });
    (0, _policies.authorize)(user, "update", parent);
    if (!parent.publishedAt) {
      throw (0, _errors.InvalidRequestError)("Cannot duplicate document inside a draft");
    }
  }
  const response = await (0, _documentDuplicator.default)({
    user,
    collection,
    document,
    title,
    publish,
    transaction,
    recursive,
    parentDocumentId,
    ip: ctx.request.ip
  });
  ctx.body = {
    data: {
      documents: await Promise.all(response.map(document => (0, _presenters.presentDocument)(document)))
    },
    policies: (0, _presenters.presentPolicies)(user, response)
  };
});
router.post("documents.move", (0, _authentication.default)(), (0, _validate.default)(T.DocumentsMoveSchema), (0, _transaction.transaction)(), async ctx => {
  const {
    transaction
  } = ctx.state;
  const {
    id,
    collectionId,
    parentDocumentId,
    index
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const document = await _models.Document.findByPk(id, {
    userId: user.id,
    transaction
  });
  (0, _policies.authorize)(user, "move", document);
  const collection = await _models.Collection.scope({
    method: ["withMembership", user.id]
  }).findByPk(collectionId, {
    transaction
  });
  (0, _policies.authorize)(user, "updateDocument", collection);
  if (parentDocumentId) {
    const parent = await _models.Document.findByPk(parentDocumentId, {
      userId: user.id,
      transaction
    });
    (0, _policies.authorize)(user, "update", parent);
    if (!parent.publishedAt) {
      throw (0, _errors.InvalidRequestError)("Cannot move document inside a draft");
    }
  }
  const {
    documents,
    collections,
    collectionChanged
  } = await (0, _documentMover.default)({
    user,
    document,
    collectionId,
    parentDocumentId,
    index,
    ip: ctx.request.ip,
    transaction
  });
  ctx.body = {
    data: {
      documents: await Promise.all(documents.map(document => (0, _presenters.presentDocument)(document))),
      collections: await Promise.all(collections.map(collection => (0, _presenters.presentCollection)(collection)))
    },
    policies: collectionChanged ? (0, _presenters.presentPolicies)(user, documents) : []
  };
});
router.post("documents.archive", (0, _authentication.default)(), (0, _validate.default)(T.DocumentsArchiveSchema), async ctx => {
  const {
    id
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const document = await _models.Document.findByPk(id, {
    userId: user.id
  });
  (0, _policies.authorize)(user, "archive", document);
  await document.archive(user.id);
  await _models.Event.create({
    name: "documents.archive",
    documentId: document.id,
    collectionId: document.collectionId,
    teamId: document.teamId,
    actorId: user.id,
    data: {
      title: document.title
    },
    ip: ctx.request.ip
  });
  ctx.body = {
    data: await (0, _presenters.presentDocument)(document),
    policies: (0, _presenters.presentPolicies)(user, [document])
  };
});
router.post("documents.delete", (0, _authentication.default)(), (0, _validate.default)(T.DocumentsDeleteSchema), async ctx => {
  const {
    id,
    permanent
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  if (permanent) {
    const document = await _models.Document.findByPk(id, {
      userId: user.id,
      paranoid: false
    });
    (0, _policies.authorize)(user, "permanentDelete", document);
    await _models.Document.update({
      parentDocumentId: null
    }, {
      where: {
        parentDocumentId: document.id
      },
      paranoid: false
    });
    await (0, _documentPermanentDeleter.default)([document]);
    await _models.Event.create({
      name: "documents.permanent_delete",
      documentId: document.id,
      collectionId: document.collectionId,
      teamId: document.teamId,
      actorId: user.id,
      data: {
        title: document.title
      },
      ip: ctx.request.ip
    });
  } else {
    const document = await _models.Document.findByPk(id, {
      userId: user.id
    });
    (0, _policies.authorize)(user, "delete", document);
    await document.delete(user.id);
    await _models.Event.create({
      name: "documents.delete",
      documentId: document.id,
      collectionId: document.collectionId,
      teamId: document.teamId,
      actorId: user.id,
      data: {
        title: document.title
      },
      ip: ctx.request.ip
    });
  }
  ctx.body = {
    success: true
  };
});
router.post("documents.unpublish", (0, _authentication.default)(), (0, _validate.default)(T.DocumentsUnpublishSchema), async ctx => {
  const {
    id,
    apiVersion
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const document = await _models.Document.findByPk(id, {
    userId: user.id
  });
  (0, _policies.authorize)(user, "unpublish", document);
  const childDocumentIds = await document.findAllChildDocumentIds({
    archivedAt: {
      [_sequelize.Op.eq]: null
    }
  });
  if (childDocumentIds.length > 0) {
    throw (0, _errors.InvalidRequestError)("Cannot unpublish document with child documents");
  }
  await document.unpublish(user.id);
  await _models.Event.create({
    name: "documents.unpublish",
    documentId: document.id,
    collectionId: document.collectionId,
    teamId: document.teamId,
    actorId: user.id,
    data: {
      title: document.title
    },
    ip: ctx.request.ip
  });
  ctx.body = {
    data: apiVersion === 2 ? {
      document: await (0, _presenters.presentDocument)(document),
      collection: document.collection ? (0, _presenters.presentCollection)(document.collection) : undefined
    } : await (0, _presenters.presentDocument)(document),
    policies: (0, _presenters.presentPolicies)(user, [document])
  };
});
router.post("documents.import", (0, _authentication.default)(), (0, _rateLimiter.rateLimiter)(_RateLimiter.RateLimiterStrategy.TwentyFivePerMinute), (0, _validate.default)(T.DocumentsImportSchema), (0, _multipart.default)({
  maximumFileSize: _env.default.MAXIMUM_IMPORT_SIZE
}), (0, _transaction.transaction)(), async ctx => {
  var _file$originalFilenam, _file$mimetype;
  const {
    collectionId,
    parentDocumentId,
    publish
  } = ctx.input.body;
  const file = ctx.input.file;
  const {
    transaction
  } = ctx.state;
  const {
    user
  } = ctx.state.auth;
  const collection = await _models.Collection.scope({
    method: ["withMembership", user.id]
  }).findOne({
    where: {
      id: collectionId,
      teamId: user.teamId
    },
    transaction
  });
  (0, _policies.authorize)(user, "createDocument", collection);
  let parentDocument;
  if (parentDocumentId) {
    parentDocument = await _models.Document.findByPk(parentDocumentId, {
      userId: user.id,
      transaction
    });
    (0, _policies.authorize)(user, "read", parentDocument);
  }
  const content = await _fsExtra.default.readFile(file.filepath);
  const fileName = (_file$originalFilenam = file.originalFilename) !== null && _file$originalFilenam !== void 0 ? _file$originalFilenam : file.newFilename;
  const mimeType = (_file$mimetype = file.mimetype) !== null && _file$mimetype !== void 0 ? _file$mimetype : "";
  const {
    text,
    state,
    title,
    emoji
  } = await (0, _documentImporter.default)({
    user,
    fileName,
    mimeType,
    content,
    ip: ctx.request.ip,
    transaction
  });
  const document = await (0, _documentCreator.default)({
    sourceMetadata: {
      fileName,
      mimeType
    },
    title,
    emoji,
    text,
    state,
    publish,
    collectionId,
    parentDocumentId,
    user,
    ip: ctx.request.ip,
    transaction
  });
  document.collection = collection;
  ctx.body = {
    data: await (0, _presenters.presentDocument)(document),
    policies: (0, _presenters.presentPolicies)(user, [document])
  };
});
router.post("documents.create", (0, _authentication.default)(), (0, _rateLimiter.rateLimiter)(_RateLimiter.RateLimiterStrategy.TwentyFivePerMinute), (0, _validate.default)(T.DocumentsCreateSchema), (0, _transaction.transaction)(), async ctx => {
  const {
    title,
    text,
    emoji,
    publish,
    collectionId,
    parentDocumentId,
    fullWidth,
    templateId,
    template,
    createdAt
  } = ctx.input.body;
  const editorVersion = ctx.headers["x-editor-version"];
  const {
    transaction
  } = ctx.state;
  const {
    user
  } = ctx.state.auth;
  let collection;
  if (collectionId) {
    collection = await _models.Collection.scope({
      method: ["withMembership", user.id]
    }).findOne({
      where: {
        id: collectionId,
        teamId: user.teamId
      },
      transaction
    });
    (0, _policies.authorize)(user, "createDocument", collection);
  }
  let parentDocument;
  if (parentDocumentId) {
    parentDocument = await _models.Document.findByPk(parentDocumentId, {
      userId: user.id
    });
    (0, _policies.authorize)(user, "read", parentDocument, {
      collection
    });
  }
  let templateDocument;
  if (templateId) {
    templateDocument = await _models.Document.findByPk(templateId, {
      userId: user.id,
      transaction
    });
    (0, _policies.authorize)(user, "read", templateDocument);
  }
  const document = await (0, _documentCreator.default)({
    title,
    text,
    emoji,
    createdAt,
    publish,
    collectionId,
    parentDocumentId,
    templateDocument,
    template,
    fullWidth,
    user,
    editorVersion,
    ip: ctx.request.ip,
    transaction
  });
  document.collection = collection;
  ctx.body = {
    data: await (0, _presenters.presentDocument)(document),
    policies: (0, _presenters.presentPolicies)(user, [document])
  };
});
router.post("documents.add_user", (0, _authentication.default)(), (0, _validate.default)(T.DocumentsAddUserSchema), (0, _rateLimiter.rateLimiter)(_RateLimiter.RateLimiterStrategy.OneHundredPerHour), (0, _transaction.transaction)(), async ctx => {
  const {
    auth,
    transaction
  } = ctx.state;
  const actor = auth.user;
  const {
    id,
    userId,
    permission
  } = ctx.input.body;
  if (userId === actor.id) {
    throw (0, _errors.ValidationError)("You cannot invite yourself");
  }
  const [document, user] = await Promise.all([_models.Document.findByPk(id, {
    userId: actor.id,
    rejectOnEmpty: true,
    transaction
  }), _models.User.findByPk(userId, {
    rejectOnEmpty: true,
    transaction
  })]);
  (0, _policies.authorize)(actor, "read", user);
  (0, _policies.authorize)(actor, "manageUsers", document);
  const UserMemberships = await _models.UserMembership.findAll({
    where: {
      userId
    },
    attributes: ["id", "index", "updatedAt"],
    limit: 1,
    order: [
    // using LC_COLLATE:"C" because we need byte order to drive the sorting
    // find only the first star so we can create an index before it
    _sequelize.Sequelize.literal('"user_permission"."index" collate "C"'), ["updatedAt", "DESC"]],
    transaction
  });

  // create membership at the beginning of their "Shared with me" section
  const index = (0, _fractionalIndex.default)(null, UserMemberships.length ? UserMemberships[0].index : null);
  const [membership, isNew] = await _models.UserMembership.findOrCreate({
    where: {
      documentId: id,
      userId
    },
    defaults: {
      index,
      permission: permission || user.defaultDocumentPermission,
      createdById: actor.id
    },
    transaction,
    lock: transaction.LOCK.UPDATE
  });
  if (permission) {
    membership.permission = permission;

    // disconnect from the source if the permission is manually updated
    membership.sourceId = null;
    await membership.save({
      transaction
    });
  }
  await _models.Event.create({
    name: "documents.add_user",
    userId,
    modelId: membership.id,
    documentId: document.id,
    teamId: document.teamId,
    actorId: actor.id,
    ip: ctx.request.ip,
    data: {
      title: document.title,
      isNew,
      permission: membership.permission
    }
  }, {
    transaction
  });
  ctx.body = {
    data: {
      users: [(0, _presenters.presentUser)(user)],
      memberships: [(0, _presenters.presentMembership)(membership)]
    }
  };
});
router.post("documents.remove_user", (0, _authentication.default)(), (0, _validate.default)(T.DocumentsRemoveUserSchema), (0, _transaction.transaction)(), async ctx => {
  const {
    auth,
    transaction
  } = ctx.state;
  const actor = auth.user;
  const {
    id,
    userId
  } = ctx.input.body;
  const [document, user] = await Promise.all([_models.Document.findByPk(id, {
    userId: actor.id,
    rejectOnEmpty: true,
    transaction
  }), _models.User.findByPk(userId, {
    rejectOnEmpty: true,
    transaction
  })]);
  if (actor.id !== userId) {
    (0, _policies.authorize)(actor, "manageUsers", document);
    (0, _policies.authorize)(actor, "read", user);
  }
  const membership = await _models.UserMembership.findOne({
    where: {
      documentId: id,
      userId
    },
    transaction,
    lock: transaction.LOCK.UPDATE,
    rejectOnEmpty: true
  });
  await membership.destroy({
    transaction
  });
  await _models.Event.create({
    name: "documents.remove_user",
    userId,
    modelId: membership.id,
    documentId: document.id,
    teamId: document.teamId,
    actorId: actor.id,
    ip: ctx.request.ip
  }, {
    transaction
  });
  ctx.body = {
    success: true
  };
});
router.post("documents.memberships", (0, _authentication.default)(), (0, _pagination.default)(), (0, _validate.default)(T.DocumentsMembershipsSchema), async ctx => {
  const {
    id,
    query,
    permission
  } = ctx.input.body;
  const {
    user: actor
  } = ctx.state.auth;
  const document = await _models.Document.findByPk(id, {
    userId: actor.id
  });
  (0, _policies.authorize)(actor, "update", document);
  let where = {
    documentId: id
  };
  let userWhere;
  if (query) {
    userWhere = {
      name: {
        [_sequelize.Op.iLike]: "%".concat(query, "%")
      }
    };
  }
  if (permission) {
    where = {
      ...where,
      permission
    };
  }
  const options = {
    where,
    include: [{
      model: _models.User,
      as: "user",
      where: userWhere,
      required: true
    }]
  };
  const [total, memberships] = await Promise.all([_models.UserMembership.count(options), _models.UserMembership.findAll({
    ...options,
    order: [["createdAt", "DESC"]],
    offset: ctx.state.pagination.offset,
    limit: ctx.state.pagination.limit
  })]);
  ctx.body = {
    pagination: {
      ...ctx.state.pagination,
      total
    },
    data: {
      memberships: memberships.map(_presenters.presentMembership),
      users: memberships.map(membership => (0, _presenters.presentUser)(membership.user))
    }
  };
});
var _default = exports.default = router;