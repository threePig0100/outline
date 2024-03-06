"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _koaRouter = _interopRequireDefault(require("koa-router"));
var _sequelize = require("sequelize");
var _constants = require("./../../../../shared/constants");
var _authentication = _interopRequireDefault(require("./../../../middlewares/authentication"));
var _rateLimiter = require("./../../../middlewares/rateLimiter");
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
router.post("groups.list", (0, _authentication.default)(), (0, _pagination.default)(), (0, _validate.default)(T.GroupsListSchema), async ctx => {
  const {
    direction,
    sort,
    userId,
    name
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  let where = {
    teamId: user.teamId
  };
  if (name) {
    where = {
      ...where,
      name: {
        [_sequelize.Op.eq]: name
      }
    };
  }
  const groups = await _models.Group.filterByMember(userId).findAll({
    where,
    order: [[sort, direction]],
    offset: ctx.state.pagination.offset,
    limit: ctx.state.pagination.limit
  });
  ctx.body = {
    pagination: ctx.state.pagination,
    data: {
      groups: groups.map(_presenters.presentGroup),
      groupMemberships: groups.map(g => g.groupMemberships.filter(membership => !!membership.user).slice(0, _constants.MAX_AVATAR_DISPLAY)).flat().map(membership => (0, _presenters.presentGroupMembership)(membership, {
        includeUser: true
      }))
    },
    policies: (0, _presenters.presentPolicies)(user, groups)
  };
});
router.post("groups.info", (0, _authentication.default)(), (0, _validate.default)(T.GroupsInfoSchema), async ctx => {
  const {
    id
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const group = await _models.Group.findByPk(id);
  (0, _policies.authorize)(user, "read", group);
  ctx.body = {
    data: (0, _presenters.presentGroup)(group),
    policies: (0, _presenters.presentPolicies)(user, [group])
  };
});
router.post("groups.create", (0, _rateLimiter.rateLimiter)(_RateLimiter.RateLimiterStrategy.TenPerHour), (0, _authentication.default)(), (0, _validate.default)(T.GroupsCreateSchema), async ctx => {
  const {
    name
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  (0, _policies.authorize)(user, "createGroup", user.team);
  const g = await _models.Group.create({
    name,
    teamId: user.teamId,
    createdById: user.id
  });

  // reload to get default scope
  const group = await _models.Group.findByPk(g.id, {
    rejectOnEmpty: true
  });
  await _models.Event.create({
    name: "groups.create",
    actorId: user.id,
    teamId: user.teamId,
    modelId: group.id,
    data: {
      name: group.name
    },
    ip: ctx.request.ip
  });
  ctx.body = {
    data: (0, _presenters.presentGroup)(group),
    policies: (0, _presenters.presentPolicies)(user, [group])
  };
});
router.post("groups.update", (0, _authentication.default)(), (0, _validate.default)(T.GroupsUpdateSchema), async ctx => {
  const {
    id,
    name
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const group = await _models.Group.findByPk(id);
  (0, _policies.authorize)(user, "update", group);
  group.name = name;
  if (group.changed()) {
    await group.save();
    await _models.Event.create({
      name: "groups.update",
      teamId: user.teamId,
      actorId: user.id,
      modelId: group.id,
      data: {
        name
      },
      ip: ctx.request.ip
    });
  }
  ctx.body = {
    data: (0, _presenters.presentGroup)(group),
    policies: (0, _presenters.presentPolicies)(user, [group])
  };
});
router.post("groups.delete", (0, _authentication.default)(), (0, _validate.default)(T.GroupsDeleteSchema), async ctx => {
  const {
    id
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const group = await _models.Group.findByPk(id);
  (0, _policies.authorize)(user, "delete", group);
  await group.destroy();
  await _models.Event.create({
    name: "groups.delete",
    actorId: user.id,
    modelId: group.id,
    teamId: group.teamId,
    data: {
      name: group.name
    },
    ip: ctx.request.ip
  });
  ctx.body = {
    success: true
  };
});
router.post("groups.memberships", (0, _authentication.default)(), (0, _pagination.default)(), (0, _validate.default)(T.GroupsMembershipsSchema), async ctx => {
  const {
    id,
    query
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const group = await _models.Group.findByPk(id);
  (0, _policies.authorize)(user, "read", group);
  let userWhere;
  if (query) {
    userWhere = {
      name: {
        [_sequelize.Op.iLike]: "%".concat(query, "%")
      }
    };
  }
  const memberships = await _models.GroupUser.findAll({
    where: {
      groupId: id
    },
    order: [["createdAt", "DESC"]],
    offset: ctx.state.pagination.offset,
    limit: ctx.state.pagination.limit,
    include: [{
      model: _models.User,
      as: "user",
      where: userWhere,
      required: true
    }]
  });
  ctx.body = {
    pagination: ctx.state.pagination,
    data: {
      groupMemberships: memberships.map(membership => (0, _presenters.presentGroupMembership)(membership, {
        includeUser: true
      })),
      users: memberships.map(membership => (0, _presenters.presentUser)(membership.user))
    }
  };
});
router.post("groups.add_user", (0, _authentication.default)(), (0, _validate.default)(T.GroupsAddUserSchema), async ctx => {
  const {
    id,
    userId
  } = ctx.input.body;
  const actor = ctx.state.auth.user;
  const user = await _models.User.findByPk(userId);
  (0, _policies.authorize)(actor, "read", user);
  let group = await _models.Group.findByPk(id);
  (0, _policies.authorize)(actor, "update", group);
  let membership = await _models.GroupUser.findOne({
    where: {
      groupId: id,
      userId
    }
  });
  if (!membership) {
    await group.$add("user", user, {
      through: {
        createdById: actor.id
      }
    });
    // reload to get default scope
    membership = await _models.GroupUser.findOne({
      where: {
        groupId: id,
        userId
      },
      rejectOnEmpty: true
    });

    // reload to get default scope
    group = await _models.Group.findByPk(id, {
      rejectOnEmpty: true
    });
    await _models.Event.create({
      name: "groups.add_user",
      userId,
      teamId: user.teamId,
      modelId: group.id,
      actorId: actor.id,
      data: {
        name: user.name
      },
      ip: ctx.request.ip
    });
  }
  ctx.body = {
    data: {
      users: [(0, _presenters.presentUser)(user)],
      groupMemberships: [(0, _presenters.presentGroupMembership)(membership, {
        includeUser: true
      })],
      groups: [(0, _presenters.presentGroup)(group)]
    }
  };
});
router.post("groups.remove_user", (0, _authentication.default)(), (0, _validate.default)(T.GroupsRemoveUserSchema), async ctx => {
  const {
    id,
    userId
  } = ctx.input.body;
  const actor = ctx.state.auth.user;
  let group = await _models.Group.findByPk(id);
  (0, _policies.authorize)(actor, "update", group);
  const user = await _models.User.findByPk(userId);
  (0, _policies.authorize)(actor, "read", user);
  await group.$remove("user", user);
  await _models.Event.create({
    name: "groups.remove_user",
    userId,
    modelId: group.id,
    teamId: user.teamId,
    actorId: actor.id,
    data: {
      name: user.name
    },
    ip: ctx.request.ip
  });

  // reload to get default scope
  group = await _models.Group.findByPk(id, {
    rejectOnEmpty: true
  });
  ctx.body = {
    data: {
      groups: [(0, _presenters.presentGroup)(group)]
    }
  };
});
var _default = exports.default = router;