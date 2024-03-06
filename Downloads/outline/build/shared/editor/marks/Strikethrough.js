"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prosemirrorCommands = require("prosemirror-commands");
var _markInputRule = _interopRequireDefault(require("../lib/markInputRule"));
var _Mark = _interopRequireDefault(require("./Mark"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class Strikethrough extends _Mark.default {
  get name() {
    return "strikethrough";
  }
  get schema() {
    return {
      parseDOM: [{
        tag: "s"
      }, {
        tag: "del"
      }, {
        tag: "strike"
      }, {
        style: "text-decoration",
        getAttrs: value => value === "line-through" ? null : false
      }],
      toDOM: () => ["del", 0]
    };
  }
  keys(_ref) {
    let {
      type
    } = _ref;
    return {
      "Mod-d": (0, _prosemirrorCommands.toggleMark)(type)
    };
  }
  inputRules(_ref2) {
    let {
      type
    } = _ref2;
    return [(0, _markInputRule.default)(/~([^~]+)~$/, type)];
  }
  toMarkdown() {
    return {
      open: "~~",
      close: "~~",
      mixable: true,
      expelEnclosingWhitespace: true
    };
  }
  get markdownToken() {
    return "s";
  }
  parseMarkdown() {
    return {
      mark: "strikethrough"
    };
  }
}
exports.default = Strikethrough;