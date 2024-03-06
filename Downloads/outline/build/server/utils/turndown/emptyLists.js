"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = emptyLists;
/**
 * A turndown plugin for unwrapping top-level empty list items.
 *
 * @param turndownService The TurndownService instance.
 */
function emptyLists(turndownService) {
  turndownService.addRule("empty-lists", {
    filter(node) {
      var _node$firstChild, _node$firstChild2;
      return node.nodeName === "LI" && node.childNodes.length === 1 && (((_node$firstChild = node.firstChild) === null || _node$firstChild === void 0 ? void 0 : _node$firstChild.nodeName) === "OL" || ((_node$firstChild2 = node.firstChild) === null || _node$firstChild2 === void 0 ? void 0 : _node$firstChild2.nodeName) === "UL");
    },
    replacement(content) {
      return content;
    }
  });
}