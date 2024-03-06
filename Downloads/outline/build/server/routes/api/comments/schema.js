"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CommentsUpdateSchema = exports.CommentsListSchema = exports.CommentsInfoSchema = exports.CommentsDeleteSchema = exports.CommentsCreateSchema = void 0;
var _zod = require("zod");
var _schema = require("./../schema");
const BaseIdSchema = _zod.z.object({
  /** Comment Id */
  id: _zod.z.string().uuid()
});
const CommentsSortParamsSchema = _zod.z.object({
  /** Specifies the attributes by which comments will be sorted in the list */
  sort: _zod.z.string().refine(val => ["createdAt", "updatedAt"].includes(val)).default("createdAt"),
  /** Specifies the sort order with respect to sort field */
  direction: _zod.z.string().optional().transform(val => val !== "ASC" ? "DESC" : val)
});
const CommentsCreateSchema = exports.CommentsCreateSchema = _schema.BaseSchema.extend({
  body: _zod.z.object({
    /** Allow creation with a specific ID */
    id: _zod.z.string().uuid().optional(),
    /** Create comment for this document */
    documentId: _zod.z.string(),
    /** Create comment under this parent */
    parentCommentId: _zod.z.string().uuid().optional(),
    /** Create comment with this data */
    data: _schema.ProsemirrorSchema
  })
});
const CommentsUpdateSchema = exports.CommentsUpdateSchema = _schema.BaseSchema.extend({
  body: BaseIdSchema.extend({
    /** Update comment with this data */
    data: _schema.ProsemirrorSchema
  })
});
const CommentsDeleteSchema = exports.CommentsDeleteSchema = _schema.BaseSchema.extend({
  body: BaseIdSchema
});
const CommentsListSchema = exports.CommentsListSchema = _schema.BaseSchema.extend({
  body: CommentsSortParamsSchema.extend({
    /** Id of a document to list comments for */
    documentId: _zod.z.string().optional(),
    collectionId: _zod.z.string().uuid().optional()
  })
});
const CommentsInfoSchema = exports.CommentsInfoSchema = _zod.z.object({
  body: BaseIdSchema
});