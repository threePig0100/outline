"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseDocumentIds;
var _parseDocumentSlug = _interopRequireDefault(require("./../../shared/utils/parseDocumentSlug"));
var _editor = require("./../editor");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * Parse a list of unique document identifiers contained in links in markdown
 * text.
 *
 * @param text The text to parse in Markdown format
 * @returns An array of document identifiers
 */
function parseDocumentIds(text) {
  const doc = _editor.parser.parse(text);
  const identifiers = [];
  if (!doc) {
    return identifiers;
  }
  doc.descendants(node => {
    // get text nodes
    if (node.type.name === "text") {
      // get marks for text nodes
      node.marks.forEach(mark => {
        // any of the marks identifiers?
        if (mark.type.name === "link") {
          const slug = (0, _parseDocumentSlug.default)(mark.attrs.href);

          // don't return the same link more than once
          if (slug && !identifiers.includes(slug)) {
            identifiers.push(slug);
          }
        }
      });
      return false;
    }
    return true;
  });
  return identifiers;
}