"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sanitizeLists;
/**
 * A turndown plugin for removing incompatible nodes from lists.
 *
 * @param turndownService The TurndownService instance.
 */
function sanitizeLists(turndownService) {
  function inHtmlContext(node, selector) {
    let currentNode = node;
    // start at the closest element
    while (currentNode !== null && currentNode.nodeType !== 1) {
      currentNode = currentNode.parentElement || currentNode.parentNode;
    }
    return currentNode !== null && currentNode.nodeType === 1 && currentNode.closest(selector) !== null;
  }
  turndownService.addRule("headingsInLists", {
    filter(node) {
      return ["H1", "H2", "H3", "H4", "H5", "H6"].includes(node.nodeName) && inHtmlContext(node, "LI");
    },
    replacement(content, node, options) {
      if (!content.trim()) {
        return "";
      }
      return options.strongDelimiter + content + options.strongDelimiter;
    }
  });
  turndownService.addRule("strongInHeadings", {
    filter(node) {
      return (node.nodeName === "STRONG" || node.nodeName === "B") && ["H1", "H2", "H3", "H4", "H5", "H6"].some(tag => inHtmlContext(node, tag));
    },
    replacement(content) {
      return content;
    }
  });
}