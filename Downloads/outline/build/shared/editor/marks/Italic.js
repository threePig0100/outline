"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prosemirrorCommands = require("prosemirror-commands");
var _markInputRule = _interopRequireDefault(require("../lib/markInputRule"));
var _Mark = _interopRequireDefault(require("./Mark"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class Italic extends _Mark.default {
  get name() {
    return "em";
  }
  get schema() {
    return {
      parseDOM: [{
        tag: "i"
      }, {
        tag: "em"
      }, {
        style: "font-style",
        getAttrs: value => value === "italic" ? null : false
      }],
      toDOM: () => ["em"]
    };
  }
  inputRules(_ref) {
    let {
      type
    } = _ref;
    /**
     * Due to use of snake_case strings common in docs the matching conditions
     * are a bit more strict than e.g. the ** bold syntax to help prevent
     * false positives.
     *
     * Matches:
     * _1_
     * _123_
     * (_one_
     * [_one_
     *
     * No match:
     * __
     * __123_
     * __123__
     * _123
     * one_123_
     * ONE_123_
     * 1_123_
     */
    return [(0, _markInputRule.default)(/(?:^|[^_a-zA-Z0-9])(_([^_]+)_)$/, type), (0, _markInputRule.default)(/(?:^|[^*a-zA-Z0-9])(\*([^*]+)\*)$/, type)];
  }
  keys(_ref2) {
    let {
      type
    } = _ref2;
    return {
      "Mod-i": (0, _prosemirrorCommands.toggleMark)(type),
      "Mod-I": (0, _prosemirrorCommands.toggleMark)(type)
    };
  }
  toMarkdown() {
    return {
      open: "*",
      close: "*",
      mixable: true,
      expelEnclosingWhitespace: true
    };
  }
  parseMarkdown() {
    return {
      mark: "em"
    };
  }
}
exports.default = Italic;