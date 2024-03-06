"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = emptyParagraphs;
/**
 * A turndown plugin for converting paragraphs with only breaks to newlines.
 *
 * @param turndownService The TurndownService instance.
 */
function emptyParagraphs(turndownService) {
  turndownService.addRule("emptyParagraphs", {
    filter(node) {
      var _node$textContent;
      return node.nodeName === "P" && node.children.length === 1 && ((_node$textContent = node.textContent) === null || _node$textContent === void 0 ? void 0 : _node$textContent.trim()) === "" && node.children[0].nodeName === "BR";
    },
    replacement() {
      return "\n\n\\\n";
    }
  });
}