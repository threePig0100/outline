"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _types = require("./../../../shared/types");
var _models = require("./../../models");
var _ExportHTMLZipTask = _interopRequireDefault(require("../tasks/ExportHTMLZipTask"));
var _ExportJSONTask = _interopRequireDefault(require("../tasks/ExportJSONTask"));
var _ExportMarkdownZipTask = _interopRequireDefault(require("../tasks/ExportMarkdownZipTask"));
var _ImportJSONTask = _interopRequireDefault(require("../tasks/ImportJSONTask"));
var _ImportMarkdownZipTask = _interopRequireDefault(require("../tasks/ImportMarkdownZipTask"));
var _ImportNotionTask = _interopRequireDefault(require("../tasks/ImportNotionTask"));
var _BaseProcessor = _interopRequireDefault(require("./BaseProcessor"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class FileOperationCreatedProcessor extends _BaseProcessor.default {
  async perform(event) {
    const fileOperation = await _models.FileOperation.findByPk(event.modelId, {
      rejectOnEmpty: true
    });

    // map file operation type and format to the appropriate task
    if (fileOperation.type === _types.FileOperationType.Import) {
      switch (fileOperation.format) {
        case _types.FileOperationFormat.MarkdownZip:
          await _ImportMarkdownZipTask.default.schedule({
            fileOperationId: event.modelId
          });
          break;
        case _types.FileOperationFormat.Notion:
          await _ImportNotionTask.default.schedule({
            fileOperationId: event.modelId
          });
          break;
        case _types.FileOperationFormat.JSON:
          await _ImportJSONTask.default.schedule({
            fileOperationId: event.modelId
          });
          break;
        default:
      }
    }
    if (fileOperation.type === _types.FileOperationType.Export) {
      switch (fileOperation.format) {
        case _types.FileOperationFormat.HTMLZip:
          await _ExportHTMLZipTask.default.schedule({
            fileOperationId: event.modelId
          });
          break;
        case _types.FileOperationFormat.MarkdownZip:
          await _ExportMarkdownZipTask.default.schedule({
            fileOperationId: event.modelId
          });
          break;
        case _types.FileOperationFormat.JSON:
          await _ExportJSONTask.default.schedule({
            fileOperationId: event.modelId
          });
          break;
        default:
      }
    }
  }
}
exports.default = FileOperationCreatedProcessor;
_defineProperty(FileOperationCreatedProcessor, "applicableEvents", ["fileOperations.create"]);