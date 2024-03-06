"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = findCollapsedNodes;
var _findChildren = require("./findChildren");
function findCollapsedNodes(doc) {
  const blocks = (0, _findChildren.findBlockNodes)(doc);
  const nodes = [];
  let withinCollapsedHeading;
  for (const block of blocks) {
    if (block.node.type.name === "heading") {
      if (!withinCollapsedHeading || block.node.attrs.level <= withinCollapsedHeading) {
        if (block.node.attrs.collapsed) {
          if (!withinCollapsedHeading) {
            withinCollapsedHeading = block.node.attrs.level;
          }
        } else {
          withinCollapsedHeading = undefined;
        }
        continue;
      }
    }
    if (withinCollapsedHeading) {
      nodes.push(block);
    }
  }
  return nodes;
}