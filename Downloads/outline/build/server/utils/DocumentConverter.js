"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DocumentConverter = void 0;
var _escapeRegExp = _interopRequireDefault(require("lodash/escapeRegExp"));
var _mailparser = require("mailparser");
var _mammoth = _interopRequireDefault(require("mammoth"));
var _errors = require("./../errors");
var _tracing = require("./../logging/tracing");
var _turndown = _interopRequireDefault(require("./turndown"));
var _dec, _class;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let DocumentConverter = exports.DocumentConverter = (_dec = (0, _tracing.trace)(), _dec(_class = class DocumentConverter {
  /**
   * Convert an incoming file to markdown.
   * @param content The content of the file.
   * @param fileName The name of the file, including extension.
   * @param mimeType The mime type of the file.
   * @returns The markdown representation of the file.
   */
  static async convertToMarkdown(content, fileName, mimeType) {
    // First try to convert the file based on the mime type.
    switch (mimeType) {
      case "application/msword":
        return this.confluenceToMarkdown(content);
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return this.docXToMarkdown(content);
      case "text/html":
        return this.htmlToMarkdown(content);
      case "text/plain":
      case "text/markdown":
        return this.fileToMarkdown(content);
      default:
        break;
    }

    // If the mime type doesn't work, try to convert based on the file extension.
    const extension = fileName.split(".").pop();
    switch (extension) {
      case "docx":
        return this.docXToMarkdown(content);
      case "html":
        return this.htmlToMarkdown(content);
      case "md":
      case "markdown":
        return this.fileToMarkdown(content);
      default:
        throw (0, _errors.FileImportError)("File type ".concat(mimeType, " not supported"));
    }
  }
  static async docXToMarkdown(content) {
    if (content instanceof Buffer) {
      const {
        value
      } = await (0, _tracing.traceFunction)({
        spanName: "convertToHtml"
      })(_mammoth.default.convertToHtml)({
        buffer: content
      });
      return _turndown.default.turndown(value);
    }
    throw (0, _errors.FileImportError)("Unsupported Word file");
  }
  static async htmlToMarkdown(content) {
    if (content instanceof Buffer) {
      content = content.toString("utf8");
    }
    return _turndown.default.turndown(content);
  }
  static async fileToMarkdown(content) {
    if (content instanceof Buffer) {
      content = content.toString("utf8");
    }
    return content;
  }
  static async confluenceToMarkdown(value) {
    if (value instanceof Buffer) {
      value = value.toString("utf8");
    }

    // We're only supporting the output from Confluence here, regular Word documents should call
    // into the docxToMarkdown importer. See: https://jira.atlassian.com/browse/CONFSERVER-38237
    if (!value.includes("Content-Type: multipart/related")) {
      throw (0, _errors.FileImportError)("Unsupported Word file");
    }

    // Confluence "Word" documents are actually just multi-part email messages, so we can use
    // mailparser to parse the content.
    const parsed = await (0, _mailparser.simpleParser)(value);
    if (!parsed.html) {
      throw (0, _errors.FileImportError)("Unsupported Word file (No content found)");
    }

    // Replace the content-location with a data URI for each attachment.
    for (const attachment of parsed.attachments) {
      var _attachment$headers$g;
      const contentLocation = String((_attachment$headers$g = attachment.headers.get("content-location")) !== null && _attachment$headers$g !== void 0 ? _attachment$headers$g : "");
      const id = contentLocation.split("/").pop();
      if (!id) {
        continue;
      }
      parsed.html = parsed.html.replace(new RegExp((0, _escapeRegExp.default)(id), "g"), "data:image/png;base64,".concat(attachment.content.toString("base64")));
    }

    // If we don't remove the title here it becomes printed in the document
    // body by turndown
    _turndown.default.remove(["style", "title"]);

    // Now we should have something that looks like HTML
    const html = _turndown.default.turndown(parsed.html);
    return html.replace(/<br>/g, " \\n ");
  }
}) || _class);