"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CollectionsUpdateSchema = exports.CollectionsRemoveUserSchema = exports.CollectionsRemoveGroupSchema = exports.CollectionsMoveSchema = exports.CollectionsMembershipsSchema = exports.CollectionsListSchema = exports.CollectionsInfoSchema = exports.CollectionsImportSchema = exports.CollectionsGroupMembershipsSchema = exports.CollectionsExportSchema = exports.CollectionsExportAllSchema = exports.CollectionsDocumentsSchema = exports.CollectionsDeleteSchema = exports.CollectionsCreateSchema = exports.CollectionsAddUserSchema = exports.CollectionsAddGroupSchema = void 0;
var _isUndefined = _interopRequireDefault(require("lodash/isUndefined"));
var _zod = require("zod");
var _random = require("./../../../../shared/random");
var _types = require("./../../../../shared/types");
var _collections = require("./../../../../shared/utils/collections");
var _models = require("./../../../models");
var _validation = require("./../../../validation");
var _schema = require("../schema");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const CollectionsCreateSchema = exports.CollectionsCreateSchema = _schema.BaseSchema.extend({
  body: _zod.z.object({
    name: _zod.z.string(),
    color: _zod.z.string().regex(_validation.ValidateColor.regex, {
      message: _validation.ValidateColor.message
    }).default((0, _random.randomElement)(_collections.colorPalette)),
    description: _zod.z.string().nullish(),
    permission: _zod.z.nativeEnum(_types.CollectionPermission).nullish().transform(val => (0, _isUndefined.default)(val) ? null : val),
    sharing: _zod.z.boolean().default(true),
    icon: _zod.z.string().max(_validation.ValidateIcon.maxLength, {
      message: "Must be ".concat(_validation.ValidateIcon.maxLength, " or fewer characters long")
    }).optional(),
    sort: _zod.z.object({
      field: _zod.z.union([_zod.z.literal("title"), _zod.z.literal("index")]),
      direction: _zod.z.union([_zod.z.literal("asc"), _zod.z.literal("desc")])
    }).default(_models.Collection.DEFAULT_SORT),
    index: _zod.z.string().regex(_validation.ValidateIndex.regex, {
      message: _validation.ValidateIndex.message
    }).max(_validation.ValidateIndex.maxLength, {
      message: "Must be ".concat(_validation.ValidateIndex.maxLength, " or fewer characters long")
    }).optional()
  })
});
const CollectionsInfoSchema = exports.CollectionsInfoSchema = _schema.BaseSchema.extend({
  body: _zod.z.object({
    id: _zod.z.string().uuid()
  })
});
const CollectionsDocumentsSchema = exports.CollectionsDocumentsSchema = _schema.BaseSchema.extend({
  body: _zod.z.object({
    id: _zod.z.string().uuid()
  })
});
const CollectionsImportSchema = exports.CollectionsImportSchema = _schema.BaseSchema.extend({
  body: _zod.z.object({
    attachmentId: _zod.z.string().uuid(),
    format: _zod.z.nativeEnum(_types.FileOperationFormat).default(_types.FileOperationFormat.MarkdownZip)
  })
});
const CollectionsAddGroupSchema = exports.CollectionsAddGroupSchema = _schema.BaseSchema.extend({
  body: _zod.z.object({
    id: _zod.z.string().uuid(),
    groupId: _zod.z.string().uuid(),
    permission: _zod.z.nativeEnum(_types.CollectionPermission).default(_types.CollectionPermission.ReadWrite)
  })
});
const CollectionsRemoveGroupSchema = exports.CollectionsRemoveGroupSchema = _schema.BaseSchema.extend({
  body: _zod.z.object({
    id: _zod.z.string().uuid(),
    groupId: _zod.z.string().uuid()
  })
});
const CollectionsGroupMembershipsSchema = exports.CollectionsGroupMembershipsSchema = _schema.BaseSchema.extend({
  body: _zod.z.object({
    id: _zod.z.string().uuid(),
    query: _zod.z.string().optional(),
    permission: _zod.z.nativeEnum(_types.CollectionPermission).optional()
  })
});
const CollectionsAddUserSchema = exports.CollectionsAddUserSchema = _schema.BaseSchema.extend({
  body: _zod.z.object({
    id: _zod.z.string().uuid(),
    userId: _zod.z.string().uuid(),
    permission: _zod.z.nativeEnum(_types.CollectionPermission).optional()
  })
});
const CollectionsRemoveUserSchema = exports.CollectionsRemoveUserSchema = _schema.BaseSchema.extend({
  body: _zod.z.object({
    id: _zod.z.string().uuid(),
    userId: _zod.z.string().uuid()
  })
});
const CollectionsMembershipsSchema = exports.CollectionsMembershipsSchema = _schema.BaseSchema.extend({
  body: _zod.z.object({
    id: _zod.z.string().uuid(),
    query: _zod.z.string().optional(),
    permission: _zod.z.nativeEnum(_types.CollectionPermission).optional()
  })
});
const CollectionsExportSchema = exports.CollectionsExportSchema = _schema.BaseSchema.extend({
  body: _zod.z.object({
    id: _zod.z.string().uuid(),
    format: _zod.z.nativeEnum(_types.FileOperationFormat).default(_types.FileOperationFormat.MarkdownZip),
    includeAttachments: _zod.z.boolean().default(true)
  })
});
const CollectionsExportAllSchema = exports.CollectionsExportAllSchema = _schema.BaseSchema.extend({
  body: _zod.z.object({
    format: _zod.z.nativeEnum(_types.FileOperationFormat).default(_types.FileOperationFormat.MarkdownZip),
    includeAttachments: _zod.z.boolean().default(true)
  })
});
const CollectionsUpdateSchema = exports.CollectionsUpdateSchema = _schema.BaseSchema.extend({
  body: _zod.z.object({
    id: _zod.z.string().uuid(),
    name: _zod.z.string().optional(),
    description: _zod.z.string().nullish(),
    icon: _zod.z.string().max(_validation.ValidateIcon.maxLength, {
      message: "Must be ".concat(_validation.ValidateIcon.maxLength, " or fewer characters long")
    }).nullish(),
    permission: _zod.z.nativeEnum(_types.CollectionPermission).nullish(),
    color: _zod.z.string().regex(_validation.ValidateColor.regex, {
      message: _validation.ValidateColor.message
    }).nullish(),
    sort: _zod.z.object({
      field: _zod.z.union([_zod.z.literal("title"), _zod.z.literal("index")]),
      direction: _zod.z.union([_zod.z.literal("asc"), _zod.z.literal("desc")])
    }).optional(),
    sharing: _zod.z.boolean().optional()
  })
});
const CollectionsListSchema = exports.CollectionsListSchema = _schema.BaseSchema.extend({
  body: _zod.z.object({
    includeListOnly: _zod.z.boolean().default(false)
  })
});
const CollectionsDeleteSchema = exports.CollectionsDeleteSchema = _schema.BaseSchema.extend({
  body: _zod.z.object({
    id: _zod.z.string().uuid()
  })
});
const CollectionsMoveSchema = exports.CollectionsMoveSchema = _schema.BaseSchema.extend({
  body: _zod.z.object({
    id: _zod.z.string().uuid(),
    index: _zod.z.string().regex(_validation.ValidateIndex.regex, {
      message: _validation.ValidateIndex.message
    }).max(_validation.ValidateIndex.maxLength, {
      message: "Must be ".concat(_validation.ValidateIndex.maxLength, " or fewer characters long")
    })
  })
});