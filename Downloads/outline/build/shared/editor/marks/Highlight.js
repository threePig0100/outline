"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prosemirrorCommands = require("prosemirror-commands");
var _markInputRule = _interopRequireDefault(require("../lib/markInputRule"));
var _mark = _interopRequireDefault(require("../rules/mark"));
var _Mark = _interopRequireDefault(require("./Mark"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class Highlight extends _Mark.default {
  get name() {
    return "highlight";
  }
  get schema() {
    return {
      parseDOM: [{
        tag: "mark"
      }],
      toDOM: () => ["mark"]
    };
  }
  inputRules(_ref) {
    let {
      type
    } = _ref;
    return [(0, _markInputRule.default)(/(?:==)([^=]+)(?:==)$/, type)];
  }
  keys(_ref2) {
    let {
      type
    } = _ref2;
    return {
      "Mod-Ctrl-h": (0, _prosemirrorCommands.toggleMark)(type)
    };
  }
  get rulePlugins() {
    return [(0, _mark.default)({
      delim: "==",
      mark: "highlight"
    })];
  }
  toMarkdown() {
    return {
      open: "==",
      close: "==",
      mixable: true,
      expelEnclosingWhitespace: true
    };
  }
  parseMarkdown() {
    return {
      mark: "highlight"
    };
  }
}
exports.default = Highlight;