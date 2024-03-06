"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
class MarkdownHelper {
  /**
   * Returns the document as cleaned Markdown for export.
   *
   * @param document The document or revision to convert
   * @returns The document title and content as a Markdown string
   */
  static toMarkdown(document) {
    const text = document.text.replace(/\n\\\n/g, "\n\n").replace(/“/g, '"').replace(/”/g, '"').replace(/‘/g, "'").replace(/’/g, "'").trim();
    const title = "".concat(document.emoji ? document.emoji + " " : "").concat(document.title);
    return "# ".concat(title, "\n\n").concat(text);
  }
}
exports.default = MarkdownHelper;