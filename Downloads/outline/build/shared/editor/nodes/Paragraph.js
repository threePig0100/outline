"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prosemirrorCommands = require("prosemirror-commands");
var _deleteEmptyFirstParagraph = _interopRequireDefault(require("../commands/deleteEmptyFirstParagraph"));
var _Node = _interopRequireDefault(require("./Node"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class Paragraph extends _Node.default {
  get name() {
    return "paragraph";
  }
  get schema() {
    return {
      content: "inline*",
      group: "block",
      parseDOM: [{
        tag: "p"
      }],
      toDOM: () => ["p", 0]
    };
  }
  keys(_ref) {
    let {
      type
    } = _ref;
    return {
      "Shift-Ctrl-0": (0, _prosemirrorCommands.setBlockType)(type),
      Backspace: _deleteEmptyFirstParagraph.default
    };
  }
  commands(_ref2) {
    let {
      type
    } = _ref2;
    return () => (0, _prosemirrorCommands.setBlockType)(type);
  }
  toMarkdown(state, node) {
    // render empty paragraphs as hard breaks to ensure that newlines are
    // persisted between reloads (this breaks from markdown tradition)
    if (node.textContent.trim() === "" && node.childCount === 0 && !state.inTable) {
      state.write("\\\n");
    } else {
      state.renderInline(node);
      state.closeBlock(node);
    }
  }
  parseMarkdown() {
    return {
      block: "paragraph"
    };
  }
}
exports.default = Paragraph;