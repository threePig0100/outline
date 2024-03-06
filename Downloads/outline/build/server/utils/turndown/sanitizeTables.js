"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sanitizeTables;
/**
 * A turndown plugin for removing incompatible nodes from tables.
 *
 * @param turndownService The TurndownService instance.
 */
function sanitizeTables(turndownService) {
  function inHtmlContext(node, selector) {
    let currentNode = node;
    // start at the closest element
    while (currentNode !== null && currentNode.nodeType !== 1) {
      currentNode = currentNode.parentElement || currentNode.parentNode;
    }
    return currentNode !== null && currentNode.nodeType === 1 && currentNode.closest(selector) !== null;
  }
  turndownService.addRule("headingsInTables", {
    filter(node) {
      return ["H1", "H2", "H3", "H4", "H5", "H6"].includes(node.nodeName) && inHtmlContext(node, "table");
    },
    replacement(content) {
      return "**".concat(content.trim(), "**");
    }
  });
  turndownService.addRule("paragraphsInCells", {
    filter(node) {
      return node.nodeName === "P" && inHtmlContext(node, "table");
    },
    replacement(content) {
      return content.trim();
    }
  });
}