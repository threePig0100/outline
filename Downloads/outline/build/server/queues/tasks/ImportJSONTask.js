"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _path = _interopRequireDefault(require("path"));
var _fsExtra = _interopRequireDefault(require("fs-extra"));
var _escapeRegExp = _interopRequireDefault(require("lodash/escapeRegExp"));
var _find2 = _interopRequireDefault(require("lodash/find"));
var _mimeTypes = _interopRequireDefault(require("mime-types"));
var _prosemirrorModel = require("prosemirror-model");
var _uuid = require("uuid");
var _editor = require("./../../editor");
var _Logger = _interopRequireDefault(require("./../../logging/Logger"));
var _ImportHelper = _interopRequireDefault(require("./../../utils/ImportHelper"));
var _ImportTask = _interopRequireDefault(require("./ImportTask"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class ImportJSONTask extends _ImportTask.default {
  async parseData(dirPath, _) {
    const tree = await _ImportHelper.default.toFileTree(dirPath);
    if (!tree) {
      throw new Error("Could not find valid content in zip file");
    }
    return this.parseFileTree(tree.children);
  }

  /**
   * Converts the file structure from zipAsFileTree into documents,
   * collections, and attachments.
   *
   * @param tree An array of FileTreeNode representing root files in the zip
   * @returns A StructuredImportData object
   */
  async parseFileTree(tree) {
    let rootPath = "";
    const output = {
      collections: [],
      documents: [],
      attachments: []
    };

    // Load metadata
    let metadata = undefined;
    for (const node of tree) {
      if (!rootPath) {
        rootPath = _path.default.dirname(node.path);
      }
      if (node.path === "metadata.json") {
        try {
          metadata = JSON.parse(await _fsExtra.default.readFile(node.path, "utf8"));
        } catch (err) {
          throw new Error("Could not parse metadata.json. ".concat(err.message));
        }
      }
    }
    if (!rootPath) {
      throw new Error("Could not find root path");
    }
    _Logger.default.debug("task", "Importing JSON metadata", {
      metadata
    });
    function mapDocuments(documents, collectionId) {
      Object.values(documents).forEach(node => {
        var _find;
        const id = (0, _uuid.v4)();
        output.documents.push({
          ...node,
          path: "",
          // TODO: This is kind of temporary, we can import the document
          // structure directly in the future.
          text: _editor.serializer.serialize(_prosemirrorModel.Node.fromJSON(_editor.schema, node.data)),
          createdAt: node.createdAt ? new Date(node.createdAt) : undefined,
          updatedAt: node.updatedAt ? new Date(node.updatedAt) : undefined,
          publishedAt: node.publishedAt ? new Date(node.publishedAt) : null,
          collectionId,
          externalId: node.id,
          mimeType: "application/json",
          parentDocumentId: node.parentDocumentId ? (_find = (0, _find2.default)(output.documents, d => d.externalId === node.parentDocumentId)) === null || _find === void 0 ? void 0 : _find.id : null,
          id
        });
      });
    }
    async function mapAttachments(attachments) {
      Object.values(attachments).forEach(node => {
        const id = (0, _uuid.v4)();
        const mimeType = _mimeTypes.default.lookup(node.key) || "application/octet-stream";
        output.attachments.push({
          id,
          name: node.name,
          buffer: () => _fsExtra.default.readFile(_path.default.join(rootPath, node.key)),
          mimeType,
          path: node.key,
          externalId: node.id
        });
      });
    }

    // All nodes in the root level should be collections as JSON + metadata
    for (const node of tree) {
      if (node.children.length > 0 || node.path.endsWith("metadata.json")) {
        continue;
      }
      let item;
      try {
        item = JSON.parse(await _fsExtra.default.readFile(node.path, "utf8"));
      } catch (err) {
        throw new Error("Could not parse ".concat(node.path, ". ").concat(err.message));
      }
      const collectionId = (0, _uuid.v4)();
      output.collections.push({
        ...item.collection,
        description: item.collection.description && typeof item.collection.description === "object" ? _editor.serializer.serialize(_prosemirrorModel.Node.fromJSON(_editor.schema, item.collection.description)) : item.collection.description,
        id: collectionId,
        externalId: item.collection.id
      });
      if (Object.values(item.documents).length) {
        mapDocuments(item.documents, collectionId);
      }
      if (Object.values(item.attachments).length) {
        await mapAttachments(item.attachments);
      }
    }

    // Check all of the attachments we've created against urls in the text
    // and replace them out with attachment redirect urls before continuing.
    for (const document of output.documents) {
      for (const attachment of output.attachments) {
        const encodedPath = encodeURI("/api/attachments.redirect?id=".concat(attachment.externalId));
        document.text = document.text.replace(new RegExp((0, _escapeRegExp.default)(encodedPath), "g"), "<<".concat(attachment.id, ">>"));
      }
    }
    return output;
  }
}
exports.default = ImportJSONTask;