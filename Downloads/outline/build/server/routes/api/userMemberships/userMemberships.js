"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _koaRouter = _interopRequireDefault(require("koa-router"));
var _sequelize = require("sequelize");
var _authentication = _interopRequireDefault(require("./../../../middlewares/authentication"));
var _transaction = require("./../../../middlewares/transaction");
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
router.post("userMemberships.list", (0, _authentication.default)(), (0, _pagination.default)(), (0, _validate.default)(T.UserMembershipsListSchema), async ctx => {
  const {
    user
  } = ctx.state.auth;
  const memberships = await _models.UserMembership.findAll({
    where: {
      userId: user.id,
      documentId: {
        [_sequelize.Op.ne]: null
      },
      sourceId: {
        [_sequelize.Op.eq]: null
      }
    },
    order: [_sequelize.Sequelize.literal('"user_permission"."index" collate "C"'), ["updatedAt", "DESC"]],
    offset: ctx.state.pagination.offset,
    limit: ctx.state.pagination.limit
  });
  const documentIds = memberships.map(p => p.documentId).filter(Boolean);
  const documents = await _models.Document.scope(["withDrafts", {
    method: ["withMembership", user.id]
  }, {
    method: ["withCollectionPermissions", user.id]
  }]).findAll({
    where: {
      id: documentIds
    }
  });
  const policies = (0, _presenters.presentPolicies)(user, [...documents, ...memberships]);
  ctx.body = {
    pagination: ctx.state.pagination,
    data: {
      memberships: memberships.map(_presenters.presentMembership),
      documents: await Promise.all(documents.map(document => (0, _presenters.presentDocument)(document)))
    },
    policies
  };
});
router.post("userMemberships.update", (0, _authentication.default)(), (0, _validate.default)(T.UserMembershipsUpdateSchema), (0, _transaction.transaction)(), async ctx => {
  const {
    id,
    index
  } = ctx.input.body;
  const {
    transaction
  } = ctx.state;
  const {
    user
  } = ctx.state.auth;
  const membership = await _models.UserMembership.findByPk(id, {
    transaction,
    rejectOnEmpty: true
  });
  (0, _policies.authorize)(user, "update", membership);
  membership.index = index;
  await membership.save({
    transaction
  });
  await _models.Event.create({
    name: "userMemberships.update",
    modelId: membership.id,
    userId: membership.userId,
    teamId: user.teamId,
    actorId: user.id,
    documentId: membership.documentId,
    ip: ctx.request.ip,
    data: {
      index: membership.index
    }
  }, {
    transaction
  });
  ctx.body = {
    data: (0, _presenters.presentMembership)(membership),
    policies: (0, _presenters.presentPolicies)(user, [membership])
  };
});
var _default = exports.default = router;