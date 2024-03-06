"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _jszip = _interopRequireDefault(require("jszip"));
var _omit = _interopRequireDefault(require("lodash/omit"));
var _editor = require("./../../editor");
var _env = _interopRequireDefault(require("./../../env"));
var _Logger = _interopRequireDefault(require("./../../logging/Logger"));
var _models = require("./../../models");
var _DocumentHelper = _interopRequireDefault(require("./../../models/helpers/DocumentHelper"));
var _presenters = require("./../../presenters");
var _ZipHelper = _interopRequireDefault(require("./../../utils/ZipHelper"));
var _fs = require("./../../utils/fs");
var _parseAttachmentIds = _interopRequireDefault(require("./../../utils/parseAttachmentIds"));
var _package = _interopRequireDefault(require("../../../package.json"));
var _ExportTask = _interopRequireDefault(require("./ExportTask"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class ExportJSONTask extends _ExportTask.default {
  async export(collections, fileOperation) {
    const zip = new _jszip.default();

    // serial to avoid overloading, slow and steady wins the race
    for (const collection of collections) {
      await this.addCollectionToArchive(zip, collection, fileOperation.includeAttachments);
    }
    await this.addMetadataToArchive(zip, fileOperation);
    return _ZipHelper.default.toTmpFile(zip);
  }
  async addMetadataToArchive(zip, fileOperation) {
    var _user$email;
    const user = await fileOperation.$get("user");
    const metadata = {
      exportVersion: 1,
      version: _package.default.version,
      createdAt: new Date().toISOString(),
      createdById: fileOperation.userId,
      createdByEmail: (_user$email = user === null || user === void 0 ? void 0 : user.email) !== null && _user$email !== void 0 ? _user$email : null
    };
    zip.file("metadata.json", _env.default.isDevelopment ? JSON.stringify(metadata, null, 2) : JSON.stringify(metadata));
  }
  async addCollectionToArchive(zip, collection, includeAttachments) {
    const output = {
      collection: {
        ...(0, _omit.default)((0, _presenters.presentCollection)(collection), ["url"]),
        description: collection.description ? _editor.parser.parse(collection.description) : null,
        documentStructure: collection.documentStructure
      },
      documents: {},
      attachments: {}
    };
    async function addDocumentTree(nodes) {
      for (const node of nodes) {
        var _node$children;
        const document = await _models.Document.findByPk(node.id, {
          includeState: true
        });
        if (!document) {
          continue;
        }
        const attachments = includeAttachments ? await _models.Attachment.findAll({
          where: {
            teamId: document.teamId,
            id: (0, _parseAttachmentIds.default)(document.text)
          }
        }) : [];
        await Promise.all(attachments.map(async attachment => {
          zip.file(attachment.key, new Promise(resolve => {
            attachment.buffer.then(resolve).catch(err => {
              _Logger.default.warn("Failed to read attachment from storage", {
                attachmentId: attachment.id,
                teamId: attachment.teamId,
                error: err.message
              });
              resolve(Buffer.from(""));
            });
          }), {
            date: attachment.updatedAt,
            createFolders: true
          });
          output.attachments[attachment.id] = {
            ...(0, _omit.default)((0, _presenters.presentAttachment)(attachment), "url"),
            key: attachment.key
          };
        }));
        output.documents[document.id] = {
          id: document.id,
          urlId: document.urlId,
          title: document.title,
          data: _DocumentHelper.default.toProsemirror(document),
          createdById: document.createdById,
          createdByEmail: document.createdBy.email,
          createdAt: document.createdAt.toISOString(),
          updatedAt: document.updatedAt.toISOString(),
          publishedAt: document.publishedAt ? document.publishedAt.toISOString() : null,
          fullWidth: document.fullWidth,
          template: document.template,
          parentDocumentId: document.parentDocumentId
        };
        if (((_node$children = node.children) === null || _node$children === void 0 ? void 0 : _node$children.length) > 0) {
          await addDocumentTree(node.children);
        }
      }
    }
    if (collection.documentStructure) {
      await addDocumentTree(collection.documentStructure);
    }
    zip.file("".concat((0, _fs.serializeFilename)(collection.name), ".json"), _env.default.isDevelopment ? JSON.stringify(output, null, 2) : JSON.stringify(output));
  }
}
exports.default = ExportJSONTask;