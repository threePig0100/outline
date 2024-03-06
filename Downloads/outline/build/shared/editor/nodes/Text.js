"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Node = _interopRequireDefault(require("./Node"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class Text extends _Node.default {
  get name() {
    return "text";
  }
  get schema() {
    return {
      group: "inline"
    };
  }
  toMarkdown(state, node) {
    state.text(node.text || "", undefined);
  }
}
exports.default = Text;