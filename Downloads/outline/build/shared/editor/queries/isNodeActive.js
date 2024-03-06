"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _findParentNode = require("./findParentNode");
const isNodeActive = function (type) {
  let attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return state => {
    if (!type) {
      return false;
    }
    const nodeAfter = state.selection.$from.nodeAfter;
    let node = (nodeAfter === null || nodeAfter === void 0 ? void 0 : nodeAfter.type) === type ? nodeAfter : undefined;
    if (!node) {
      const parent = (0, _findParentNode.findParentNode)(node => node.type === type)(state.selection);
      node = parent === null || parent === void 0 ? void 0 : parent.node;
    }
    if (!Object.keys(attrs).length || !node) {
      return !!node;
    }
    return node.hasMarkup(type, {
      ...node.attrs,
      ...attrs
    });
  };
};
var _default = exports.default = isNodeActive;