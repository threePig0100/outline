"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _koaRouter = _interopRequireDefault(require("koa-router"));
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
router.post("apiKeys.create", (0, _authentication.default)({
  member: true
}), (0, _validate.default)(T.APIKeysCreateSchema), async ctx => {
  const {
    name
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  (0, _policies.authorize)(user, "createApiKey", user.team);
  const key = await _models.ApiKey.create({
    name,
    userId: user.id
  });
  await _models.Event.create({
    name: "api_keys.create",
    modelId: key.id,
    teamId: user.teamId,
    actorId: user.id,
    data: {
      name
    },
    ip: ctx.request.ip
  });
  ctx.body = {
    data: (0, _presenters.presentApiKey)(key)
  };
});
router.post("apiKeys.list", (0, _authentication.default)({
  member: true
}), (0, _pagination.default)(), async ctx => {
  const {
    user
  } = ctx.state.auth;
  const keys = await _models.ApiKey.findAll({
    where: {
      userId: user.id
    },
    order: [["createdAt", "DESC"]],
    offset: ctx.state.pagination.offset,
    limit: ctx.state.pagination.limit
  });
  ctx.body = {
    pagination: ctx.state.pagination,
    data: keys.map(_presenters.presentApiKey)
  };
});
router.post("apiKeys.delete", (0, _authentication.default)({
  member: true
}), (0, _validate.default)(T.APIKeysDeleteSchema), async ctx => {
  const {
    id
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const key = await _models.ApiKey.findByPk(id);
  (0, _policies.authorize)(user, "delete", key);
  await key.destroy();
  await _models.Event.create({
    name: "api_keys.delete",
    modelId: key.id,
    teamId: user.teamId,
    actorId: user.id,
    data: {
      name: key.name
    },
    ip: ctx.request.ip
  });
  ctx.body = {
    success: true
  };
});
var _default = exports.default = router;