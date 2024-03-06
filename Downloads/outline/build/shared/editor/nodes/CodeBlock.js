"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _selectAll = require("../commands/selectAll");
var _CodeFence = _interopRequireDefault(require("./CodeFence"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class CodeBlock extends _CodeFence.default {
  get name() {
    return "code_block";
  }
  get markdownToken() {
    return "code_block";
  }
  keys(_ref) {
    let {
      type
    } = _ref;
    return {
      "Mod-a": (0, _selectAll.selectAll)(type)
    };
  }
}
exports.default = CodeBlock;