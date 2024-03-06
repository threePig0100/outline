"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prosemirrorCommands = require("prosemirror-commands");
var _markInputRule = _interopRequireDefault(require("../lib/markInputRule"));
var _underlines = _interopRequireDefault(require("../rules/underlines"));
var _Mark = _interopRequireDefault(require("./Mark"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class Underline extends _Mark.default {
  get name() {
    return "underline";
  }
  get schema() {
    return {
      parseDOM: [{
        tag: "u"
      }, {
        consuming: false,
        tag: ":not(a)",
        getAttrs: node => node.style.textDecoration.includes("underline") || node.style.textDecorationLine.includes("underline") ? null : false
      }],
      toDOM: () => ["u", 0]
    };
  }
  get rulePlugins() {
    return [_underlines.default];
  }
  inputRules(_ref) {
    let {
      type
    } = _ref;
    return [(0, _markInputRule.default)(/(?:__)([^_]+)(?:__)$/, type)];
  }
  keys(_ref2) {
    let {
      type
    } = _ref2;
    return {
      "Mod-u": (0, _prosemirrorCommands.toggleMark)(type)
    };
  }
  toMarkdown() {
    return {
      open: "__",
      close: "__",
      mixable: true,
      expelEnclosingWhitespace: true
    };
  }
  parseMarkdown() {
    return {
      mark: "underline"
    };
  }
}
exports.default = Underline;