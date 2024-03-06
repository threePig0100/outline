"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = findLinkNodes;
var _findChildren = require("./findChildren");
function findLinkNodes(doc) {
  const textNodes = (0, _findChildren.findChildren)(doc, child => child.isText);
  const nodes = [];
  for (const nodeWithPos of textNodes) {
    const hasLinkMark = nodeWithPos.node.marks.find(mark => mark.type.name === "link");
    if (hasLinkMark) {
      nodes.push(nodeWithPos);
    }
  }
  return nodes;
}