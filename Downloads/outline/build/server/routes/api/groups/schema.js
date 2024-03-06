"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GroupsUpdateSchema = exports.GroupsRemoveUserSchema = exports.GroupsMembershipsSchema = exports.GroupsListSchema = exports.GroupsInfoSchema = exports.GroupsDeleteSchema = exports.GroupsCreateSchema = exports.GroupsAddUserSchema = void 0;
var _zod = require("zod");
var _models = require("./../../../models");
const BaseIdSchema = _zod.z.object({
  /** Group Id */
  id: _zod.z.string().uuid()
});
const GroupsListSchema = exports.GroupsListSchema = _zod.z.object({
  body: _zod.z.object({
    /** Groups sorting direction */
    direction: _zod.z.string().optional().transform(val => val !== "ASC" ? "DESC" : val),
    /** Groups sorting column */
    sort: _zod.z.string().refine(val => Object.keys(_models.Group.getAttributes()).includes(val), {
      message: "Invalid sort parameter"
    }).default("updatedAt"),
    /** Only list groups where this user is a member */
    userId: _zod.z.string().uuid().optional(),
    /** Find group with matching name */
    name: _zod.z.string().optional()
  })
});
const GroupsInfoSchema = exports.GroupsInfoSchema = _zod.z.object({
  body: BaseIdSchema
});
const GroupsCreateSchema = exports.GroupsCreateSchema = _zod.z.object({
  body: _zod.z.object({
    /** Group name */
    name: _zod.z.string()
  })
});
const GroupsUpdateSchema = exports.GroupsUpdateSchema = _zod.z.object({
  body: BaseIdSchema.extend({
    /** Group name */
    name: _zod.z.string()
  })
});
const GroupsDeleteSchema = exports.GroupsDeleteSchema = _zod.z.object({
  body: BaseIdSchema
});
const GroupsMembershipsSchema = exports.GroupsMembershipsSchema = _zod.z.object({
  body: BaseIdSchema.extend({
    /** Group name search query */
    query: _zod.z.string().optional()
  })
});
const GroupsAddUserSchema = exports.GroupsAddUserSchema = _zod.z.object({
  body: BaseIdSchema.extend({
    /** User Id */
    userId: _zod.z.string().uuid()
  })
});
const GroupsRemoveUserSchema = exports.GroupsRemoveUserSchema = _zod.z.object({
  body: BaseIdSchema.extend({
    /** User Id */
    userId: _zod.z.string().uuid()
  })
});