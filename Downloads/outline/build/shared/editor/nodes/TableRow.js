"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Node = _interopRequireDefault(require("./Node"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class TableRow extends _Node.default {
  get name() {
    return "tr";
  }
  get schema() {
    return {
      content: "(th | td)*",
      tableRole: "row",
      parseDOM: [{
        tag: "tr"
      }],
      toDOM() {
        return ["tr", 0];
      }
    };
  }
  parseMarkdown() {
    return {
      block: "tr"
    };
  }
}
exports.default = TableRow;