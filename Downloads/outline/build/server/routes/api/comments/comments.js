"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _koaRouter = _interopRequireDefault(require("koa-router"));
var _sequelize = require("sequelize");
var _types = require("./../../../../shared/types");
var _commentCreator = _interopRequireDefault(require("./../../../commands/commentCreator"));
var _commentDestroyer = _interopRequireDefault(require("./../../../commands/commentDestroyer"));
var _commentUpdater = _interopRequireDefault(require("./../../../commands/commentUpdater"));
var _errors = require("./../../../errors");
var _authentication = _interopRequireDefault(require("./../../../middlewares/authentication"));
var _rateLimiter = require("./../../../middlewares/rateLimiter");
var _transaction = require("./../../../middlewares/transaction");
var _validate = _interopRequireDefault(require("./../../../middlewares/validate"));
var _models = require("./../../../models");
var _policies = require("./../../../policies");
var _presenters = require("./../../../presenters");
var _RateLimiter = require("./../../../utils/RateLimiter");
var _pagination = _interopRequireDefault(require("../middlewares/pagination"));
var T = _interopRequireWildcard(require("./schema"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = new _koaRouter.default();
router.post("comments.create", (0, _rateLimiter.rateLimiter)(_RateLimiter.RateLimiterStrategy.TenPerMinute), (0, _authentication.default)(), checkCommentingEnabled(), (0, _validate.default)(T.CommentsCreateSchema), (0, _transaction.transaction)(), async ctx => {
  const {
    id,
    documentId,
    parentCommentId,
    data
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const {
    transaction
  } = ctx.state;
  const document = await _models.Document.findByPk(documentId, {
    userId: user.id,
    transaction
  });
  (0, _policies.authorize)(user, "comment", document);
  const comment = await (0, _commentCreator.default)({
    id,
    data,
    parentCommentId,
    documentId,
    user,
    ip: ctx.request.ip,
    transaction
  });
  ctx.body = {
    data: (0, _presenters.presentComment)(comment),
    policies: (0, _presenters.presentPolicies)(user, [comment])
  };
});
router.post("comments.info", (0, _authentication.default)(), checkCommentingEnabled(), (0, _validate.default)(T.CommentsInfoSchema), async ctx => {
  const {
    id
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const comment = await _models.Comment.findByPk(id, {
    rejectOnEmpty: true
  });
  (0, _policies.authorize)(user, "read", comment);
  if (comment.documentId) {
    const document = await _models.Document.findByPk(comment.documentId, {
      userId: user.id
    });
    (0, _policies.authorize)(user, "read", document);
  }
  ctx.body = {
    data: (0, _presenters.presentComment)(comment),
    policies: (0, _presenters.presentPolicies)(user, [comment])
  };
});
router.post("comments.list", (0, _authentication.default)(), (0, _pagination.default)(), checkCommentingEnabled(), (0, _validate.default)(T.CommentsListSchema), async ctx => {
  const {
    sort,
    direction,
    documentId,
    collectionId
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const params = {
    order: [[sort, direction]],
    offset: ctx.state.pagination.offset,
    limit: ctx.state.pagination.limit
  };
  let comments;
  if (documentId) {
    const document = await _models.Document.findByPk(documentId, {
      userId: user.id
    });
    (0, _policies.authorize)(user, "read", document);
    comments = await _models.Comment.findAll({
      where: {
        documentId: document.id
      },
      ...params
    });
  } else if (collectionId) {
    const collection = await _models.Collection.findByPk(collectionId);
    (0, _policies.authorize)(user, "read", collection);
    comments = await _models.Comment.findAll({
      include: [{
        model: _models.Document,
        required: true,
        where: {
          teamId: user.teamId,
          collectionId
        }
      }],
      ...params
    });
  } else {
    const accessibleCollectionIds = await user.collectionIds();
    comments = await _models.Comment.findAll({
      include: [{
        model: _models.Document,
        required: true,
        where: {
          teamId: user.teamId,
          collectionId: {
            [_sequelize.Op.in]: accessibleCollectionIds
          }
        }
      }],
      ...params
    });
  }
  ctx.body = {
    pagination: ctx.state.pagination,
    data: comments.map(_presenters.presentComment),
    policies: (0, _presenters.presentPolicies)(user, comments)
  };
});
router.post("comments.update", (0, _authentication.default)(), checkCommentingEnabled(), (0, _validate.default)(T.CommentsUpdateSchema), (0, _transaction.transaction)(), async ctx => {
  const {
    id,
    data
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const {
    transaction
  } = ctx.state;
  const comment = await _models.Comment.findByPk(id, {
    transaction,
    rejectOnEmpty: true,
    lock: {
      level: transaction.LOCK.UPDATE,
      of: _models.Comment
    }
  });
  const document = await _models.Document.findByPk(comment.documentId, {
    userId: user.id,
    transaction
  });
  (0, _policies.authorize)(user, "comment", document);
  (0, _policies.authorize)(user, "update", comment);
  await (0, _commentUpdater.default)({
    user,
    comment,
    data,
    ip: ctx.request.ip,
    transaction
  });
  ctx.body = {
    data: (0, _presenters.presentComment)(comment),
    policies: (0, _presenters.presentPolicies)(user, [comment])
  };
});
router.post("comments.delete", (0, _authentication.default)(), checkCommentingEnabled(), (0, _validate.default)(T.CommentsDeleteSchema), (0, _transaction.transaction)(), async ctx => {
  const {
    id
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const {
    transaction
  } = ctx.state;
  const comment = await _models.Comment.findByPk(id, {
    transaction,
    rejectOnEmpty: true
  });
  const document = await _models.Document.findByPk(comment.documentId, {
    userId: user.id,
    transaction
  });
  (0, _policies.authorize)(user, "comment", document);
  (0, _policies.authorize)(user, "delete", comment);
  await (0, _commentDestroyer.default)({
    user,
    comment,
    ip: ctx.request.ip,
    transaction
  });
  ctx.body = {
    success: true
  };
});
function checkCommentingEnabled() {
  return async function checkCommentingEnabledMiddleware(ctx, next) {
    if (!ctx.state.auth.user.team.getPreference(_types.TeamPreference.Commenting)) {
      throw (0, _errors.ValidationError)("Commenting is currently disabled");
    }
    return next();
  };
}

// router.post("comments.resolve", auth(), async (ctx) => {
// router.post("comments.unresolve", auth(), async (ctx) => {
var _default = exports.default = router;