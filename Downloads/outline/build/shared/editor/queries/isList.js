"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isList;
function isList(node, schema) {
  return node.type === schema.nodes.bullet_list || node.type === schema.nodes.ordered_list || node.type === schema.nodes.checkbox_list;
}