"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DocumentsViewedSchema = exports.DocumentsUsersSchema = exports.DocumentsUpdateSchema = exports.DocumentsUnpublishSchema = exports.DocumentsTemplatizeSchema = exports.DocumentsSharedWithUserSchema = exports.DocumentsSearchSchema = exports.DocumentsRestoreSchema = exports.DocumentsRemoveUserSchema = exports.DocumentsMoveSchema = exports.DocumentsMembershipsSchema = exports.DocumentsListSchema = exports.DocumentsInfoSchema = exports.DocumentsImportSchema = exports.DocumentsExportSchema = exports.DocumentsDuplicateSchema = exports.DocumentsDraftsSchema = exports.DocumentsDeletedSchema = exports.DocumentsDeleteSchema = exports.DocumentsCreateSchema = exports.DocumentsArchivedSchema = exports.DocumentsArchiveSchema = exports.DocumentsAddUserSchema = void 0;
var _emojiRegex = _interopRequireDefault(require("emoji-regex"));
var _isEmpty = _interopRequireDefault(require("lodash/isEmpty"));
var _isUUID = _interopRequireDefault(require("validator/lib/isUUID"));
var _zod = require("zod");
var _types = require("./../../../../shared/types");
var _urlHelpers = require("./../../../../shared/utils/urlHelpers");
var _schema = require("./../schema");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const DocumentsSortParamsSchema = _zod.z.object({
  /** Specifies the attributes by which documents will be sorted in the list */
  sort: _zod.z.string().refine(val => ["createdAt", "updatedAt", "publishedAt", "index", "title"].includes(val)).default("updatedAt"),
  /** Specifies the sort order with respect to sort field */
  direction: _zod.z.string().optional().transform(val => val !== "ASC" ? "DESC" : val)
});
const DateFilterSchema = _zod.z.object({
  /** Date filter */
  dateFilter: _zod.z.union([_zod.z.literal("day"), _zod.z.literal("week"), _zod.z.literal("month"), _zod.z.literal("year")]).optional()
});
const SearchQuerySchema = _zod.z.object({
  /** Query for search */
  query: _zod.z.string().refine(v => v.trim() !== "")
});
const BaseIdSchema = _zod.z.object({
  /** Id of the document to be updated */
  id: _zod.z.string()
});
const DocumentsListSchema = exports.DocumentsListSchema = _schema.BaseSchema.extend({
  body: DocumentsSortParamsSchema.extend({
    /** Id of the user who created the doc */
    userId: _zod.z.string().uuid().optional(),
    /** Alias for userId - kept for backwards compatibility */
    user: _zod.z.string().uuid().optional(),
    /** Id of the collection to which the document belongs */
    collectionId: _zod.z.string().uuid().optional(),
    /** Alias for collectionId - kept for backwards compatibility */
    collection: _zod.z.string().uuid().optional(),
    /** Id of the backlinked document */
    backlinkDocumentId: _zod.z.string().uuid().optional(),
    /** Id of the parent document to which the document belongs */
    parentDocumentId: _zod.z.string().uuid().nullish(),
    /** Boolean which denotes whether the document is a template */
    template: _zod.z.boolean().optional()
  })
  // Maintains backwards compatibility
}).transform(req => {
  req.body.collectionId = req.body.collectionId || req.body.collection;
  req.body.userId = req.body.userId || req.body.user;
  delete req.body.collection;
  delete req.body.user;
  return req;
});
const DocumentsArchivedSchema = exports.DocumentsArchivedSchema = _schema.BaseSchema.extend({
  body: DocumentsSortParamsSchema.extend({})
});
const DocumentsDeletedSchema = exports.DocumentsDeletedSchema = _schema.BaseSchema.extend({
  body: DocumentsSortParamsSchema.extend({})
});
const DocumentsViewedSchema = exports.DocumentsViewedSchema = _schema.BaseSchema.extend({
  body: DocumentsSortParamsSchema.extend({})
});
const DocumentsDraftsSchema = exports.DocumentsDraftsSchema = _schema.BaseSchema.extend({
  body: DocumentsSortParamsSchema.merge(DateFilterSchema).extend({
    /** Id of the collection to which the document belongs */
    collectionId: _zod.z.string().uuid().optional()
  })
});
const DocumentsInfoSchema = exports.DocumentsInfoSchema = _schema.BaseSchema.extend({
  body: _zod.z.object({
    /** Id of the document to be retrieved */
    id: _zod.z.string().optional(),
    /** Share Id, if available */
    shareId: _zod.z.string().refine(val => (0, _isUUID.default)(val) || _urlHelpers.SHARE_URL_SLUG_REGEX.test(val)).optional(),
    /** Version of the API to be used */
    apiVersion: _zod.z.number().optional()
  })
}).refine(req => !((0, _isEmpty.default)(req.body.id) && (0, _isEmpty.default)(req.body.shareId)), {
  message: "one of id or shareId is required"
});
const DocumentsExportSchema = exports.DocumentsExportSchema = _schema.BaseSchema.extend({
  body: BaseIdSchema
});
const DocumentsRestoreSchema = exports.DocumentsRestoreSchema = _schema.BaseSchema.extend({
  body: BaseIdSchema.extend({
    /** Id of the collection to which the document belongs */
    collectionId: _zod.z.string().uuid().optional(),
    /** Id of document revision */
    revisionId: _zod.z.string().uuid().optional()
  })
});
const DocumentsSearchSchema = exports.DocumentsSearchSchema = _schema.BaseSchema.extend({
  body: SearchQuerySchema.merge(DateFilterSchema).extend({
    /** Whether to include archived docs in results */
    includeArchived: _zod.z.boolean().optional(),
    /** Whether to include drafts in results */
    includeDrafts: _zod.z.boolean().optional(),
    /** Filter results for team based on the collection */
    collectionId: _zod.z.string().uuid().optional(),
    /** Filter results based on user */
    userId: _zod.z.string().uuid().optional(),
    /** Filter results for the team derived from shareId */
    shareId: _zod.z.string().refine(val => (0, _isUUID.default)(val) || _urlHelpers.SHARE_URL_SLUG_REGEX.test(val)).optional(),
    /** Min words to be shown in the results snippets */
    snippetMinWords: _zod.z.number().default(20),
    /** Max words to be accomodated in the results snippets */
    snippetMaxWords: _zod.z.number().default(30)
  })
});
const DocumentsDuplicateSchema = exports.DocumentsDuplicateSchema = _schema.BaseSchema.extend({
  body: BaseIdSchema.extend({
    /** New document title */
    title: _zod.z.string().optional(),
    /** Whether child documents should also be duplicated */
    recursive: _zod.z.boolean().optional(),
    /** Whether the new document should be published */
    publish: _zod.z.boolean().optional(),
    /** Id of the collection to which the document should be copied */
    collectionId: _zod.z.string().uuid().optional(),
    /** Id of the parent document to which the document should be copied */
    parentDocumentId: _zod.z.string().uuid().optional()
  })
});
const DocumentsTemplatizeSchema = exports.DocumentsTemplatizeSchema = _schema.BaseSchema.extend({
  body: BaseIdSchema
});
const DocumentsUpdateSchema = exports.DocumentsUpdateSchema = _schema.BaseSchema.extend({
  body: BaseIdSchema.extend({
    /** Doc title to be updated */
    title: _zod.z.string().optional(),
    /** Doc text to be updated */
    text: _zod.z.string().optional(),
    /** Emoji displayed alongside doc title */
    emoji: _zod.z.string().regex((0, _emojiRegex.default)()).nullish(),
    /** Boolean to denote if the doc should occupy full width */
    fullWidth: _zod.z.boolean().optional(),
    /** Boolean to denote if insights should be visible on the doc */
    insightsEnabled: _zod.z.boolean().optional(),
    /** Boolean to denote if the doc should be published */
    publish: _zod.z.boolean().optional(),
    /** Doc template Id */
    templateId: _zod.z.string().uuid().nullish(),
    /** Doc collection Id */
    collectionId: _zod.z.string().uuid().nullish(),
    /** Boolean to denote if text should be appended */
    append: _zod.z.boolean().optional(),
    /** Version of the API to be used */
    apiVersion: _zod.z.number().optional(),
    /** Whether the editing session is complete */
    done: _zod.z.boolean().optional()
  })
}).refine(req => !(req.body.append && !req.body.text), {
  message: "text is required while appending"
});
const DocumentsMoveSchema = exports.DocumentsMoveSchema = _schema.BaseSchema.extend({
  body: BaseIdSchema.extend({
    /** Id of collection to which the doc is supposed to be moved */
    collectionId: _zod.z.string().uuid(),
    /** Parent Id, in case if the doc is moved to a new parent */
    parentDocumentId: _zod.z.string().uuid().nullish(),
    /** Helps evaluate the new index in collection structure upon move */
    index: _zod.z.number().gte(0).optional()
  })
}).refine(req => !(req.body.parentDocumentId === req.body.id), {
  message: "infinite loop detected, cannot nest a document inside itself"
});
const DocumentsArchiveSchema = exports.DocumentsArchiveSchema = _schema.BaseSchema.extend({
  body: BaseIdSchema
});
const DocumentsDeleteSchema = exports.DocumentsDeleteSchema = _schema.BaseSchema.extend({
  body: BaseIdSchema.extend({
    /** Whether to permanently delete the doc as opposed to soft-delete */
    permanent: _zod.z.boolean().optional()
  })
});
const DocumentsUnpublishSchema = exports.DocumentsUnpublishSchema = _schema.BaseSchema.extend({
  body: BaseIdSchema.extend({
    /** Version of the API to be used */
    apiVersion: _zod.z.number().optional()
  })
});
const DocumentsImportSchema = exports.DocumentsImportSchema = _schema.BaseSchema.extend({
  body: _zod.z.object({
    /** Whether to publish the imported docs. String as this is always multipart/form-data */
    publish: _zod.z.preprocess(val => val === "true", _zod.z.boolean()).optional(),
    /** Import docs to this collection */
    collectionId: _zod.z.string().uuid(),
    /** Import under this parent doc */
    parentDocumentId: _zod.z.string().uuid().nullish()
  }),
  file: _zod.z.custom()
});
const DocumentsCreateSchema = exports.DocumentsCreateSchema = _schema.BaseSchema.extend({
  body: _zod.z.object({
    /** Document title */
    title: _zod.z.string().default(""),
    /** Document text */
    text: _zod.z.string().default(""),
    /** Emoji displayed alongside doc title */
    emoji: _zod.z.string().regex((0, _emojiRegex.default)()).optional(),
    /** Boolean to denote if the doc should be published */
    publish: _zod.z.boolean().optional(),
    /** Collection to create document within  */
    collectionId: _zod.z.string().uuid().nullish(),
    /** Parent document to create within */
    parentDocumentId: _zod.z.string().uuid().nullish(),
    /** A template to create the document from */
    templateId: _zod.z.string().uuid().optional(),
    /** Optionally set the created date in the past */
    createdAt: _zod.z.coerce.date().optional().refine(data => !data || data < new Date(), {
      message: "createdAt must be in the past"
    }),
    /** Boolean to denote if the document should occupy full width */
    fullWidth: _zod.z.boolean().optional(),
    /** Whether this should be considered a template */
    template: _zod.z.boolean().optional()
  })
}).refine(req => !(req.body.parentDocumentId && !req.body.collectionId), {
  message: "collectionId is required to create a nested document"
}).refine(req => !(req.body.template && !req.body.collectionId), {
  message: "collectionId is required to create a template document"
}).refine(req => !(req.body.publish && !req.body.collectionId), {
  message: "collectionId is required to publish"
});
const DocumentsUsersSchema = exports.DocumentsUsersSchema = _schema.BaseSchema.extend({
  body: BaseIdSchema.extend({
    /** Query term to search users by name */
    query: _zod.z.string().optional()
  })
});
const DocumentsAddUserSchema = exports.DocumentsAddUserSchema = _schema.BaseSchema.extend({
  body: _zod.z.object({
    /** Id of the document to which the user is supposed to be added */
    id: _zod.z.string().uuid(),
    /** Id of the user who is to be added*/
    userId: _zod.z.string().uuid(),
    /** Permission to be granted to the added user  */
    permission: _zod.z.nativeEnum(_types.DocumentPermission).optional()
  })
});
const DocumentsRemoveUserSchema = exports.DocumentsRemoveUserSchema = _schema.BaseSchema.extend({
  body: _zod.z.object({
    /** Id of the document from which to remove the user */
    id: _zod.z.string().uuid(),
    /** Id of the user who is to be removed */
    userId: _zod.z.string().uuid()
  })
});
const DocumentsSharedWithUserSchema = exports.DocumentsSharedWithUserSchema = _schema.BaseSchema.extend({
  body: DocumentsSortParamsSchema
});
const DocumentsMembershipsSchema = exports.DocumentsMembershipsSchema = _schema.BaseSchema.extend({
  body: _zod.z.object({
    id: _zod.z.string().uuid(),
    query: _zod.z.string().optional(),
    permission: _zod.z.nativeEnum(_types.DocumentPermission).optional()
  })
});