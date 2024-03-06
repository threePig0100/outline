"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _koaRouter = _interopRequireDefault(require("koa-router"));
var _compact = _interopRequireDefault(require("lodash/compact"));
var _isEmpty = _interopRequireDefault(require("lodash/isEmpty"));
var _authentication = _interopRequireDefault(require("./../../../../server/middlewares/authentication"));
var _validate = _interopRequireDefault(require("./../../../../server/middlewares/validate"));
var _models = require("./../../../../server/models");
var _policies = require("./../../../../server/policies");
var _pagination = _interopRequireDefault(require("./../../../../server/routes/api/middlewares/pagination"));
var _webhookSubscription = _interopRequireDefault(require("../presenters/webhookSubscription"));
var T = _interopRequireWildcard(require("./schema"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = new _koaRouter.default();
router.post("webhookSubscriptions.list", (0, _authentication.default)({
  admin: true
}), (0, _pagination.default)(), async ctx => {
  const {
    user
  } = ctx.state.auth;
  (0, _policies.authorize)(user, "listWebhookSubscription", user.team);
  const webhooks = await _models.WebhookSubscription.findAll({
    where: {
      teamId: user.teamId
    },
    order: [["createdAt", "DESC"]],
    offset: ctx.state.pagination.offset,
    limit: ctx.state.pagination.limit
  });
  ctx.body = {
    pagination: ctx.state.pagination,
    data: webhooks.map(_webhookSubscription.default)
  };
});
router.post("webhookSubscriptions.create", (0, _authentication.default)({
  admin: true
}), (0, _validate.default)(T.WebhookSubscriptionsCreateSchema), async ctx => {
  const {
    user
  } = ctx.state.auth;
  (0, _policies.authorize)(user, "createWebhookSubscription", user.team);
  const {
    name,
    url,
    secret
  } = ctx.input.body;
  const events = (0, _compact.default)(ctx.input.body.events);
  const webhookSubscription = await _models.WebhookSubscription.create({
    name,
    events,
    createdById: user.id,
    teamId: user.teamId,
    url,
    enabled: true,
    secret: (0, _isEmpty.default)(secret) ? undefined : secret
  });
  const event = {
    name: "webhookSubscriptions.create",
    modelId: webhookSubscription.id,
    teamId: user.teamId,
    actorId: user.id,
    data: {
      name,
      url,
      events
    },
    ip: ctx.request.ip
  };
  await _models.Event.create(event);
  ctx.body = {
    data: (0, _webhookSubscription.default)(webhookSubscription)
  };
});
router.post("webhookSubscriptions.delete", (0, _authentication.default)({
  admin: true
}), (0, _validate.default)(T.WebhookSubscriptionsDeleteSchema), async ctx => {
  const {
    id
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const webhookSubscription = await _models.WebhookSubscription.findByPk(id);
  (0, _policies.authorize)(user, "delete", webhookSubscription);
  await webhookSubscription.destroy();
  const event = {
    name: "webhookSubscriptions.delete",
    modelId: webhookSubscription.id,
    teamId: user.teamId,
    actorId: user.id,
    data: {
      name: webhookSubscription.name,
      url: webhookSubscription.url,
      events: webhookSubscription.events
    },
    ip: ctx.request.ip
  };
  await _models.Event.create(event);
  ctx.body = {
    success: true
  };
});
router.post("webhookSubscriptions.update", (0, _authentication.default)({
  admin: true
}), (0, _validate.default)(T.WebhookSubscriptionsUpdateSchema), async ctx => {
  const {
    id,
    name,
    url,
    secret
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const events = (0, _compact.default)(ctx.input.body.events);
  const webhookSubscription = await _models.WebhookSubscription.findByPk(id, {
    rejectOnEmpty: true
  });
  (0, _policies.authorize)(user, "update", webhookSubscription);
  await webhookSubscription.update({
    name,
    url,
    events,
    enabled: true,
    secret: (0, _isEmpty.default)(secret) ? undefined : secret
  });
  const event = {
    name: "webhookSubscriptions.update",
    modelId: webhookSubscription.id,
    teamId: user.teamId,
    actorId: user.id,
    data: {
      name: webhookSubscription.name,
      url: webhookSubscription.url,
      events: webhookSubscription.events
    },
    ip: ctx.request.ip
  };
  await _models.Event.create(event);
  ctx.body = {
    data: (0, _webhookSubscription.default)(webhookSubscription)
  };
});
var _default = exports.default = router;