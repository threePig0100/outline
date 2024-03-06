"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UsersUpdateSchema = exports.UsersSuspendSchema = exports.UsersResendInviteSchema = exports.UsersPromoteSchema = exports.UsersNotificationsUnsubscribeSchema = exports.UsersNotificationsSubscribeSchema = exports.UsersListSchema = exports.UsersInviteSchema = exports.UsersInfoSchema = exports.UsersDemoteSchema = exports.UsersDeleteSchema = exports.UsersActivateSchema = void 0;
var _zod = require("zod");
var _types = require("./../../../../shared/types");
var _User = _interopRequireDefault(require("./../../../models/User"));
var _schema = require("../schema");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const BaseIdSchema = _zod.z.object({
  id: _zod.z.string().uuid()
});
const UsersListSchema = exports.UsersListSchema = _zod.z.object({
  body: _zod.z.object({
    /** Groups sorting direction */
    direction: _zod.z.string().optional().transform(val => val !== "ASC" ? "DESC" : val),
    /** Groups sorting column */
    sort: _zod.z.string().refine(val => Object.keys(_User.default.getAttributes()).includes(val), {
      message: "Invalid sort parameter"
    }).default("createdAt"),
    ids: _zod.z.array(_zod.z.string().uuid()).optional(),
    emails: _zod.z.array(_zod.z.string().email()).optional(),
    query: _zod.z.string().optional(),
    filter: _zod.z.enum(["invited", "viewers", "admins", "members", "active", "all", "suspended"]).optional()
  })
});
const UsersNotificationsSubscribeSchema = exports.UsersNotificationsSubscribeSchema = _zod.z.object({
  body: _zod.z.object({
    eventType: _zod.z.nativeEnum(_types.NotificationEventType)
  })
});
const UsersNotificationsUnsubscribeSchema = exports.UsersNotificationsUnsubscribeSchema = _zod.z.object({
  body: _zod.z.object({
    eventType: _zod.z.nativeEnum(_types.NotificationEventType)
  })
});
const UsersUpdateSchema = exports.UsersUpdateSchema = _schema.BaseSchema.extend({
  body: _zod.z.object({
    id: _zod.z.string().uuid().optional(),
    name: _zod.z.string().optional(),
    avatarUrl: _zod.z.string().nullish(),
    language: _zod.z.string().optional(),
    preferences: _zod.z.record(_zod.z.nativeEnum(_types.UserPreference), _zod.z.boolean()).optional()
  })
});
const UsersDeleteSchema = exports.UsersDeleteSchema = _schema.BaseSchema.extend({
  body: _zod.z.object({
    code: _zod.z.string().optional(),
    id: _zod.z.string().uuid().optional()
  })
});
const UsersInfoSchema = exports.UsersInfoSchema = _schema.BaseSchema.extend({
  body: _zod.z.object({
    id: _zod.z.string().uuid().optional()
  })
});
const UsersActivateSchema = exports.UsersActivateSchema = _schema.BaseSchema.extend({
  body: BaseIdSchema
});
const UsersPromoteSchema = exports.UsersPromoteSchema = _schema.BaseSchema.extend({
  body: BaseIdSchema
});
const UsersDemoteSchema = exports.UsersDemoteSchema = _schema.BaseSchema.extend({
  body: _zod.z.object({
    id: _zod.z.string().uuid(),
    to: _zod.z.nativeEnum(_types.UserRole).default(_types.UserRole.Member)
  })
});
const UsersSuspendSchema = exports.UsersSuspendSchema = _schema.BaseSchema.extend({
  body: BaseIdSchema
});
const UsersResendInviteSchema = exports.UsersResendInviteSchema = _schema.BaseSchema.extend({
  body: BaseIdSchema
});
const UsersInviteSchema = exports.UsersInviteSchema = _zod.z.object({
  body: _zod.z.object({
    invites: _zod.z.array(_zod.z.object({
      email: _zod.z.string().email(),
      name: _zod.z.string(),
      role: _zod.z.nativeEnum(_types.UserRole)
    }))
  })
});