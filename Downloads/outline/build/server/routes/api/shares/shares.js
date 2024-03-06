"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _koaRouter = _interopRequireDefault(require("koa-router"));
var _isUndefined = _interopRequireDefault(require("lodash/isUndefined"));
var _sequelize = require("sequelize");
var _errors = require("./../../../errors");
var _authentication = _interopRequireDefault(require("./../../../middlewares/authentication"));
var _validate = _interopRequireDefault(require("./../../../middlewares/validate"));
var _models = require("./../../../models");
var _policies = require("./../../../policies");
var _presenters = require("./../../../presenters");
var _pagination = _interopRequireDefault(require("../middlewares/pagination"));
var T = _interopRequireWildcard(require("./schema"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = new _koaRouter.default();
router.post("shares.info", (0, _authentication.default)(), (0, _validate.default)(T.SharesInfoSchema), async ctx => {
  const {
    id,
    documentId
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const shares = [];
  const share = await _models.Share.scope({
    method: ["withCollectionPermissions", user.id]
  }).findOne({
    where: id ? {
      id,
      revokedAt: {
        [_sequelize.Op.is]: null
      }
    } : {
      documentId,
      teamId: user.teamId,
      revokedAt: {
        [_sequelize.Op.is]: null
      }
    }
  });

  // We return the response for the current documentId and any parent documents
  // that are publicly shared and accessible to the user
  if (share && share.document) {
    (0, _policies.authorize)(user, "read", share);
    shares.push(share);
  }
  if (documentId) {
    const document = await _models.Document.findByPk(documentId, {
      userId: user.id
    });
    (0, _policies.authorize)(user, "read", document);
    const collection = await document.$get("collection");
    const parentIds = collection === null || collection === void 0 ? void 0 : collection.getDocumentParents(documentId);
    const parentShare = parentIds ? await _models.Share.scope({
      method: ["withCollectionPermissions", user.id]
    }).findOne({
      where: {
        documentId: parentIds,
        teamId: user.teamId,
        revokedAt: {
          [_sequelize.Op.is]: null
        },
        includeChildDocuments: true,
        published: true
      }
    }) : undefined;
    if (parentShare && parentShare.document) {
      (0, _policies.authorize)(user, "read", parentShare);
      shares.push(parentShare);
    }
  }
  if (!shares.length) {
    ctx.response.status = 204;
    return;
  }
  ctx.body = {
    data: {
      shares: shares.map(share => (0, _presenters.presentShare)(share, user.isAdmin))
    },
    policies: (0, _presenters.presentPolicies)(user, shares)
  };
});
router.post("shares.list", (0, _authentication.default)(), (0, _pagination.default)(), (0, _validate.default)(T.SharesListSchema), async ctx => {
  const {
    sort,
    direction
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const where = {
    teamId: user.teamId,
    userId: user.id,
    published: true,
    revokedAt: {
      [_sequelize.Op.is]: null
    }
  };
  if (user.isAdmin) {
    delete where.userId;
  }
  const collectionIds = await user.collectionIds();
  const [shares, total] = await Promise.all([_models.Share.findAll({
    where,
    order: [[sort, direction]],
    include: [{
      model: _models.Document,
      required: true,
      paranoid: true,
      as: "document",
      where: {
        collectionId: collectionIds
      },
      include: [{
        model: _models.Collection.scope({
          method: ["withMembership", user.id]
        }),
        as: "collection"
      }]
    }, {
      model: _models.User,
      required: true,
      as: "user"
    }, {
      model: _models.Team,
      required: true,
      as: "team"
    }],
    offset: ctx.state.pagination.offset,
    limit: ctx.state.pagination.limit
  }), _models.Share.count({
    where
  })]);
  ctx.body = {
    pagination: {
      ...ctx.state.pagination,
      total
    },
    data: shares.map(share => (0, _presenters.presentShare)(share, user.isAdmin)),
    policies: (0, _presenters.presentPolicies)(user, shares)
  };
});
router.post("shares.create", (0, _authentication.default)(), (0, _validate.default)(T.SharesCreateSchema), async ctx => {
  const {
    documentId,
    published,
    urlId,
    includeChildDocuments
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const document = await _models.Document.findByPk(documentId, {
    userId: user.id
  });

  // user could be creating the share link to share with team members
  (0, _policies.authorize)(user, "read", document);
  if (published) {
    (0, _policies.authorize)(user, "share", user.team);
    (0, _policies.authorize)(user, "share", document);
  }
  const [share, isCreated] = await _models.Share.findOrCreate({
    where: {
      documentId,
      teamId: user.teamId,
      revokedAt: null
    },
    defaults: {
      userId: user.id,
      published,
      includeChildDocuments,
      urlId
    }
  });
  if (isCreated) {
    await _models.Event.create({
      name: "shares.create",
      documentId,
      collectionId: document.collectionId,
      modelId: share.id,
      teamId: user.teamId,
      actorId: user.id,
      data: {
        name: document.title,
        published,
        includeChildDocuments,
        urlId
      },
      ip: ctx.request.ip
    });
  }
  share.team = user.team;
  share.user = user;
  share.document = document;
  ctx.body = {
    data: (0, _presenters.presentShare)(share),
    policies: (0, _presenters.presentPolicies)(user, [share])
  };
});
router.post("shares.update", (0, _authentication.default)(), (0, _validate.default)(T.SharesUpdateSchema), async ctx => {
  const {
    id,
    includeChildDocuments,
    published,
    urlId
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  (0, _policies.authorize)(user, "share", user.team);

  // fetch the share with document and collection.
  const share = await _models.Share.scope({
    method: ["withCollectionPermissions", user.id]
  }).findByPk(id);
  (0, _policies.authorize)(user, "update", share);
  if (published !== undefined) {
    share.published = published;
    if (published) {
      share.includeChildDocuments = true;
    }
  }
  if (includeChildDocuments !== undefined) {
    share.includeChildDocuments = includeChildDocuments;
  }
  if (!(0, _isUndefined.default)(urlId)) {
    share.urlId = urlId;
  }
  await share.save();
  await _models.Event.create({
    name: "shares.update",
    documentId: share.documentId,
    modelId: share.id,
    teamId: user.teamId,
    actorId: user.id,
    data: {
      published
    },
    ip: ctx.request.ip
  });
  ctx.body = {
    data: (0, _presenters.presentShare)(share, user.isAdmin),
    policies: (0, _presenters.presentPolicies)(user, [share])
  };
});
router.post("shares.revoke", (0, _authentication.default)(), (0, _validate.default)(T.SharesRevokeSchema), async ctx => {
  const {
    id
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const share = await _models.Share.findByPk(id);
  if (!(share !== null && share !== void 0 && share.document)) {
    throw (0, _errors.NotFoundError)();
  }
  (0, _policies.authorize)(user, "revoke", share);
  const {
    document
  } = share;
  await share.revoke(user.id);
  await _models.Event.create({
    name: "shares.revoke",
    documentId: document.id,
    collectionId: document.collectionId,
    modelId: share.id,
    teamId: user.teamId,
    actorId: user.id,
    data: {
      name: document.title
    },
    ip: ctx.request.ip
  });
  ctx.body = {
    success: true
  };
});
var _default = exports.default = router;