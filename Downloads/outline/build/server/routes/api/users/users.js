"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _koaRouter = _interopRequireDefault(require("koa-router"));
var _sequelize = require("sequelize");
var _validations = require("./../../../../shared/validations");
var _userDemoter = _interopRequireDefault(require("./../../../commands/userDemoter"));
var _userDestroyer = _interopRequireDefault(require("./../../../commands/userDestroyer"));
var _userInviter = _interopRequireDefault(require("./../../../commands/userInviter"));
var _userSuspender = _interopRequireDefault(require("./../../../commands/userSuspender"));
var _userUnsuspender = _interopRequireDefault(require("./../../../commands/userUnsuspender"));
var _ConfirmUserDeleteEmail = _interopRequireDefault(require("./../../../emails/templates/ConfirmUserDeleteEmail"));
var _InviteEmail = _interopRequireDefault(require("./../../../emails/templates/InviteEmail"));
var _env = _interopRequireDefault(require("./../../../env"));
var _errors = require("./../../../errors");
var _Logger = _interopRequireDefault(require("./../../../logging/Logger"));
var _authentication = _interopRequireDefault(require("./../../../middlewares/authentication"));
var _rateLimiter = require("./../../../middlewares/rateLimiter");
var _transaction = require("./../../../middlewares/transaction");
var _validate = _interopRequireDefault(require("./../../../middlewares/validate"));
var _models = require("./../../../models");
var _User = require("./../../../models/User");
var _policies = require("./../../../policies");
var _presenters = require("./../../../presenters");
var _RateLimiter = require("./../../../utils/RateLimiter");
var _crypto = require("./../../../utils/crypto");
var _pagination = _interopRequireDefault(require("../middlewares/pagination"));
var T = _interopRequireWildcard(require("./schema"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = new _koaRouter.default();
const emailEnabled = !!(_env.default.SMTP_HOST || _env.default.isDevelopment);
router.post("users.list", (0, _authentication.default)(), (0, _pagination.default)(), (0, _validate.default)(T.UsersListSchema), async ctx => {
  const {
    sort,
    direction,
    query,
    filter,
    ids,
    emails
  } = ctx.input.body;
  const actor = ctx.state.auth.user;
  let where = {
    teamId: actor.teamId
  };

  // Filter out suspended users if we're not an admin
  if (!actor.isAdmin) {
    where = {
      ...where,
      suspendedAt: {
        [_sequelize.Op.eq]: null
      }
    };
  }
  switch (filter) {
    case "invited":
      {
        where = {
          ...where,
          lastActiveAt: null
        };
        break;
      }
    case "viewers":
      {
        where = {
          ...where,
          isViewer: true
        };
        break;
      }
    case "admins":
      {
        where = {
          ...where,
          isAdmin: true
        };
        break;
      }
    case "members":
      {
        where = {
          ...where,
          isAdmin: false,
          isViewer: false
        };
        break;
      }
    case "suspended":
      {
        if (actor.isAdmin) {
          where = {
            ...where,
            suspendedAt: {
              [_sequelize.Op.ne]: null
            }
          };
        }
        break;
      }
    case "active":
      {
        where = {
          ...where,
          lastActiveAt: {
            [_sequelize.Op.ne]: null
          },
          suspendedAt: {
            [_sequelize.Op.is]: null
          }
        };
        break;
      }
    case "all":
      {
        break;
      }
    default:
      {
        where = {
          ...where,
          suspendedAt: {
            [_sequelize.Op.is]: null
          }
        };
        break;
      }
  }
  if (query) {
    where = {
      ...where,
      name: {
        [_sequelize.Op.iLike]: "%".concat(query, "%")
      }
    };
  }
  if (ids) {
    where = {
      ...where,
      id: ids
    };
  }
  if (emails) {
    where = {
      ...where,
      email: emails
    };
  }
  const [users, total] = await Promise.all([_models.User.findAll({
    where,
    order: [[sort, direction]],
    offset: ctx.state.pagination.offset,
    limit: ctx.state.pagination.limit
  }), _models.User.count({
    where
  })]);
  ctx.body = {
    pagination: {
      ...ctx.state.pagination,
      total
    },
    data: users.map(user => (0, _presenters.presentUser)(user, {
      includeDetails: (0, _policies.can)(actor, "readDetails", user)
    })),
    policies: (0, _presenters.presentPolicies)(actor, users)
  };
});
router.post("users.count", (0, _authentication.default)(), async ctx => {
  const {
    user
  } = ctx.state.auth;
  const counts = await _models.User.getCounts(user.teamId);
  ctx.body = {
    data: {
      counts
    }
  };
});
router.post("users.info", (0, _authentication.default)(), (0, _validate.default)(T.UsersInfoSchema), async ctx => {
  const {
    id
  } = ctx.input.body;
  const actor = ctx.state.auth.user;
  const user = id ? await _models.User.findByPk(id) : actor;
  (0, _policies.authorize)(actor, "read", user);
  const includeDetails = (0, _policies.can)(actor, "readDetails", user);
  ctx.body = {
    data: (0, _presenters.presentUser)(user, {
      includeDetails
    }),
    policies: (0, _presenters.presentPolicies)(actor, [user])
  };
});
router.post("users.update", (0, _authentication.default)(), (0, _validate.default)(T.UsersUpdateSchema), (0, _transaction.transaction)(), async ctx => {
  const {
    auth,
    transaction
  } = ctx.state;
  const actor = auth.user;
  const {
    id,
    name,
    avatarUrl,
    language,
    preferences
  } = ctx.input.body;
  let user = actor;
  if (id) {
    user = await _models.User.findByPk(id, {
      rejectOnEmpty: true,
      transaction,
      lock: transaction.LOCK.UPDATE
    });
  }
  (0, _policies.authorize)(actor, "update", user);
  const includeDetails = (0, _policies.can)(actor, "readDetails", user);
  if (name) {
    user.name = name;
  }
  if (avatarUrl) {
    user.avatarUrl = avatarUrl;
  }
  if (language) {
    user.language = language;
  }
  if (preferences) {
    for (const key of Object.keys(preferences)) {
      user.setPreference(key, preferences[key]);
    }
  }
  await _models.Event.createFromContext(ctx, {
    name: "users.update",
    userId: user.id,
    changes: user.changeset
  }, {
    transaction
  });
  await user.save({
    transaction
  });
  ctx.body = {
    data: (0, _presenters.presentUser)(user, {
      includeDetails
    })
  };
});

// Admin specific
router.post("users.promote", (0, _authentication.default)(), (0, _validate.default)(T.UsersPromoteSchema), (0, _transaction.transaction)(), async ctx => {
  const {
    transaction
  } = ctx.state;
  const userId = ctx.input.body.id;
  const actor = ctx.state.auth.user;
  const teamId = actor.teamId;
  const user = await _models.User.findByPk(userId, {
    rejectOnEmpty: true,
    transaction,
    lock: transaction.LOCK.UPDATE
  });
  (0, _policies.authorize)(actor, "promote", user);
  await user.promote({
    transaction
  });
  await _models.Event.create({
    name: "users.promote",
    actorId: actor.id,
    userId,
    teamId,
    data: {
      name: user.name
    },
    ip: ctx.request.ip
  }, {
    transaction
  });
  const includeDetails = (0, _policies.can)(actor, "readDetails", user);
  ctx.body = {
    data: (0, _presenters.presentUser)(user, {
      includeDetails
    }),
    policies: (0, _presenters.presentPolicies)(actor, [user])
  };
});
router.post("users.demote", (0, _authentication.default)(), (0, _validate.default)(T.UsersDemoteSchema), (0, _transaction.transaction)(), async ctx => {
  const {
    transaction
  } = ctx.state;
  const {
    to,
    id: userId
  } = ctx.input.body;
  const actor = ctx.state.auth.user;
  const user = await _models.User.findByPk(userId, {
    rejectOnEmpty: true,
    transaction,
    lock: transaction.LOCK.UPDATE
  });
  (0, _policies.authorize)(actor, "demote", user);
  await _models.Team.findByPk(user.teamId, {
    transaction,
    lock: transaction.LOCK.UPDATE
  });
  await (0, _userDemoter.default)({
    to,
    user,
    actorId: actor.id,
    transaction,
    ip: ctx.request.ip
  });
  const includeDetails = (0, _policies.can)(actor, "readDetails", user);
  ctx.body = {
    data: (0, _presenters.presentUser)(user, {
      includeDetails
    }),
    policies: (0, _presenters.presentPolicies)(actor, [user])
  };
});
router.post("users.suspend", (0, _authentication.default)(), (0, _validate.default)(T.UsersSuspendSchema), (0, _transaction.transaction)(), async ctx => {
  const {
    transaction
  } = ctx.state;
  const userId = ctx.input.body.id;
  const actor = ctx.state.auth.user;
  const user = await _models.User.findByPk(userId, {
    rejectOnEmpty: true,
    transaction,
    lock: transaction.LOCK.UPDATE
  });
  (0, _policies.authorize)(actor, "suspend", user);
  await (0, _userSuspender.default)({
    user,
    actorId: actor.id,
    ip: ctx.request.ip,
    transaction
  });
  const includeDetails = (0, _policies.can)(actor, "readDetails", user);
  ctx.body = {
    data: (0, _presenters.presentUser)(user, {
      includeDetails
    }),
    policies: (0, _presenters.presentPolicies)(actor, [user])
  };
});
router.post("users.activate", (0, _authentication.default)(), (0, _validate.default)(T.UsersActivateSchema), (0, _transaction.transaction)(), async ctx => {
  const {
    transaction
  } = ctx.state;
  const userId = ctx.input.body.id;
  const actor = ctx.state.auth.user;
  const user = await _models.User.findByPk(userId, {
    rejectOnEmpty: true,
    transaction,
    lock: transaction.LOCK.UPDATE
  });
  (0, _policies.authorize)(actor, "activate", user);
  await (0, _userUnsuspender.default)({
    user,
    actorId: actor.id,
    transaction,
    ip: ctx.request.ip
  });
  const includeDetails = (0, _policies.can)(actor, "readDetails", user);
  ctx.body = {
    data: (0, _presenters.presentUser)(user, {
      includeDetails
    }),
    policies: (0, _presenters.presentPolicies)(actor, [user])
  };
});
router.post("users.invite", (0, _rateLimiter.rateLimiter)(_RateLimiter.RateLimiterStrategy.TenPerHour), (0, _authentication.default)(), (0, _validate.default)(T.UsersInviteSchema), async ctx => {
  const {
    invites
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const team = await _models.Team.findByPk(user.teamId);
  (0, _policies.authorize)(user, "inviteUser", team);
  const response = await (0, _userInviter.default)({
    user,
    invites: invites.slice(0, _validations.UserValidation.maxInvitesPerRequest),
    ip: ctx.request.ip
  });
  ctx.body = {
    data: {
      sent: response.sent,
      users: response.users.map(user => (0, _presenters.presentUser)(user))
    }
  };
});
router.post("users.resendInvite", (0, _authentication.default)(), (0, _validate.default)(T.UsersResendInviteSchema), (0, _transaction.transaction)(), async ctx => {
  const {
    id
  } = ctx.input.body;
  const {
    auth,
    transaction
  } = ctx.state;
  const actor = auth.user;
  const user = await _models.User.findByPk(id, {
    lock: transaction.LOCK.UPDATE,
    transaction
  });
  (0, _policies.authorize)(actor, "resendInvite", user);
  if (user.getFlag(_User.UserFlag.InviteSent) > 2) {
    throw (0, _errors.ValidationError)("This invite has been sent too many times");
  }
  await new _InviteEmail.default({
    to: user.email,
    name: user.name,
    actorName: actor.name,
    actorEmail: actor.email,
    teamName: actor.team.name,
    teamUrl: actor.team.url
  }).schedule();
  user.incrementFlag(_User.UserFlag.InviteSent);
  await user.save({
    transaction
  });
  if (_env.default.isDevelopment) {
    _Logger.default.info("email", "Sign in immediately: ".concat(_env.default.URL, "/auth/email.callback?token=").concat(user.getEmailSigninToken()));
  }
  ctx.body = {
    success: true
  };
});
router.post("users.requestDelete", (0, _rateLimiter.rateLimiter)(_RateLimiter.RateLimiterStrategy.FivePerHour), (0, _authentication.default)(), async ctx => {
  const {
    user
  } = ctx.state.auth;
  (0, _policies.authorize)(user, "delete", user);
  if (emailEnabled) {
    await new _ConfirmUserDeleteEmail.default({
      to: user.email,
      deleteConfirmationCode: user.deleteConfirmationCode
    }).schedule();
  }
  ctx.body = {
    success: true
  };
});
router.post("users.delete", (0, _rateLimiter.rateLimiter)(_RateLimiter.RateLimiterStrategy.TenPerHour), (0, _authentication.default)(), (0, _validate.default)(T.UsersDeleteSchema), (0, _transaction.transaction)(), async ctx => {
  const {
    transaction
  } = ctx.state;
  const {
    id,
    code
  } = ctx.input.body;
  const actor = ctx.state.auth.user;
  let user;
  if (id) {
    user = await _models.User.findByPk(id, {
      rejectOnEmpty: true,
      transaction,
      lock: transaction.LOCK.UPDATE
    });
  } else {
    user = actor;
  }
  (0, _policies.authorize)(actor, "delete", user);

  // If we're attempting to delete our own account then a confirmation code
  // is required. This acts as CSRF protection.
  if ((!id || id === actor.id) && emailEnabled) {
    const deleteConfirmationCode = user.deleteConfirmationCode;
    if (!(0, _crypto.safeEqual)(code, deleteConfirmationCode)) {
      throw (0, _errors.ValidationError)("The confirmation code was incorrect");
    }
  }
  await (0, _userDestroyer.default)({
    user,
    actor,
    ip: ctx.request.ip,
    transaction
  });
  ctx.body = {
    success: true
  };
});
router.post("users.notificationsSubscribe", (0, _authentication.default)(), (0, _validate.default)(T.UsersNotificationsSubscribeSchema), (0, _transaction.transaction)(), async ctx => {
  const {
    eventType
  } = ctx.input.body;
  const {
    transaction
  } = ctx.state;
  const {
    user
  } = ctx.state.auth;
  user.setNotificationEventType(eventType, true);
  await _models.Event.createFromContext(ctx, {
    name: "users.update",
    userId: user.id,
    changes: user.changeset
  }, {
    transaction
  });
  await user.save({
    transaction
  });
  ctx.body = {
    data: (0, _presenters.presentUser)(user, {
      includeDetails: true
    })
  };
});
router.post("users.notificationsUnsubscribe", (0, _authentication.default)(), (0, _validate.default)(T.UsersNotificationsUnsubscribeSchema), (0, _transaction.transaction)(), async ctx => {
  const {
    eventType
  } = ctx.input.body;
  const {
    transaction
  } = ctx.state;
  const {
    user
  } = ctx.state.auth;
  user.setNotificationEventType(eventType, false);
  await _models.Event.createFromContext(ctx, {
    name: "users.update",
    userId: user.id,
    changes: user.changeset
  }, {
    transaction
  });
  await user.save({
    transaction
  });
  ctx.body = {
    data: (0, _presenters.presentUser)(user, {
      includeDetails: true
    })
  };
});
var _default = exports.default = router;