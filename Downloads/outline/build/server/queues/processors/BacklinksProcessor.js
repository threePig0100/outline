"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _sequelize = require("sequelize");
var _models = require("./../../models");
var _parseDocumentIds = _interopRequireDefault(require("./../../utils/parseDocumentIds"));
var _BaseProcessor = _interopRequireDefault(require("./BaseProcessor"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class BacklinksProcessor extends _BaseProcessor.default {
  async perform(event) {
    switch (event.name) {
      case "documents.publish":
        {
          const document = await _models.Document.findByPk(event.documentId);
          if (!document) {
            return;
          }
          const linkIds = (0, _parseDocumentIds.default)(document.text);
          await Promise.all(linkIds.map(async linkId => {
            const linkedDocument = await _models.Document.findByPk(linkId);
            if (!linkedDocument || linkedDocument.id === event.documentId) {
              return;
            }
            await _models.Backlink.findOrCreate({
              where: {
                documentId: linkedDocument.id,
                reverseDocumentId: event.documentId
              },
              defaults: {
                userId: document.lastModifiedById
              }
            });
          }));
          break;
        }
      case "documents.update":
        {
          const document = await _models.Document.findByPk(event.documentId);
          if (!document) {
            return;
          }

          // backlinks are only created for published documents
          if (!document.publishedAt) {
            return;
          }
          const linkIds = (0, _parseDocumentIds.default)(document.text);
          const linkedDocumentIds = [];

          // create or find existing backlink records for referenced docs
          await Promise.all(linkIds.map(async linkId => {
            const linkedDocument = await _models.Document.findByPk(linkId);
            if (!linkedDocument || linkedDocument.id === event.documentId) {
              return;
            }
            await _models.Backlink.findOrCreate({
              where: {
                documentId: linkedDocument.id,
                reverseDocumentId: event.documentId
              },
              defaults: {
                userId: document.lastModifiedById
              }
            });
            linkedDocumentIds.push(linkedDocument.id);
          }));

          // delete any backlinks that no longer exist
          await _models.Backlink.destroy({
            where: {
              documentId: {
                [_sequelize.Op.notIn]: linkedDocumentIds
              },
              reverseDocumentId: event.documentId
            }
          });
          break;
        }
      case "documents.delete":
        {
          await _models.Backlink.destroy({
            where: {
              [_sequelize.Op.or]: [{
                reverseDocumentId: event.documentId
              }, {
                documentId: event.documentId
              }]
            }
          });
          break;
        }
      default:
    }
  }
}
exports.default = BacklinksProcessor;
_defineProperty(BacklinksProcessor, "applicableEvents", ["documents.publish", "documents.update", "documents.delete"]);