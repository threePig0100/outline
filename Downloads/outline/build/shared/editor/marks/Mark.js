"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prosemirrorCommands = require("prosemirror-commands");
var _Extension = _interopRequireDefault(require("../lib/Extension"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class Mark extends _Extension.default {
  get type() {
    return "mark";
  }
  get schema() {
    return {};
  }
  get markdownToken() {
    return "";
  }
  keys(_options) {
    return {};
  }
  inputRules(_options) {
    return [];
  }
  toMarkdown(_state, _node) {
    throw new Error("toMarkdown not implemented");
  }
  parseMarkdown() {
    return undefined;
  }
  commands(_ref) {
    let {
      type
    } = _ref;
    return attrs => (0, _prosemirrorCommands.toggleMark)(type, attrs);
  }
}
exports.default = Mark;