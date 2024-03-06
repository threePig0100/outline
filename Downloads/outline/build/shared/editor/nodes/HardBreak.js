"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prosemirrorTables = require("prosemirror-tables");
var _isNodeActive = _interopRequireDefault(require("../queries/isNodeActive"));
var _breaks = _interopRequireDefault(require("../rules/breaks"));
var _Node = _interopRequireDefault(require("./Node"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class HardBreak extends _Node.default {
  get name() {
    return "br";
  }
  get schema() {
    return {
      inline: true,
      group: "inline",
      selectable: false,
      parseDOM: [{
        tag: "br"
      }],
      toDOM: () => ["br"],
      toPlainText: () => "\n"
    };
  }
  get rulePlugins() {
    return [_breaks.default];
  }
  commands(_ref) {
    let {
      type
    } = _ref;
    return () => (state, dispatch) => {
      dispatch === null || dispatch === void 0 ? void 0 : dispatch(state.tr.replaceSelectionWith(type.create()).scrollIntoView());
      return true;
    };
  }
  keys(_ref2) {
    let {
      type
    } = _ref2;
    return {
      "Shift-Enter": (state, dispatch) => {
        if (!(0, _prosemirrorTables.isInTable)(state) && !(0, _isNodeActive.default)(state.schema.nodes.paragraph)(state)) {
          return false;
        }
        dispatch === null || dispatch === void 0 ? void 0 : dispatch(state.tr.replaceSelectionWith(type.create()).scrollIntoView());
        return true;
      }
    };
  }
  toMarkdown(state) {
    state.write("\\n");
  }
  parseMarkdown() {
    return {
      node: "br"
    };
  }
}
exports.default = HardBreak;