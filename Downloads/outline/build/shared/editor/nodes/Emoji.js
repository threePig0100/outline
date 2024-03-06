"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prosemirrorState = require("prosemirror-state");
var _Extension = _interopRequireDefault(require("../lib/Extension"));
var _emoji = require("../lib/emoji");
var _emoji2 = _interopRequireDefault(require("../rules/emoji"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class Emoji extends _Extension.default {
  get type() {
    return "node";
  }
  get name() {
    return "emoji";
  }
  get schema() {
    return {
      attrs: {
        style: {
          default: ""
        },
        "data-name": {
          default: undefined
        }
      },
      inline: true,
      content: "text*",
      marks: "",
      group: "inline",
      selectable: false,
      parseDOM: [{
        tag: "strong.emoji",
        preserveWhitespace: "full",
        getAttrs: dom => ({
          "data-name": dom.dataset.name
        })
      }],
      toDOM: node => {
        if ((0, _emoji.getEmojiFromName)(node.attrs["data-name"])) {
          return ["strong", {
            class: "emoji ".concat(node.attrs["data-name"]),
            "data-name": node.attrs["data-name"]
          }, (0, _emoji.getEmojiFromName)(node.attrs["data-name"])];
        }
        return ["strong", {
          class: "emoji"
        }, ":".concat(node.attrs["data-name"], ":")];
      },
      toPlainText: node => (0, _emoji.getEmojiFromName)(node.attrs["data-name"])
    };
  }
  get rulePlugins() {
    return [_emoji2.default];
  }
  commands(_ref) {
    let {
      type
    } = _ref;
    return attrs => (state, dispatch) => {
      var _selection$$cursor;
      const {
        selection
      } = state;
      const position = selection instanceof _prosemirrorState.TextSelection ? (_selection$$cursor = selection.$cursor) === null || _selection$$cursor === void 0 ? void 0 : _selection$$cursor.pos : selection.$to.pos;
      if (position === undefined) {
        return false;
      }
      const node = type.create(attrs);
      const transaction = state.tr.insert(position, node);
      dispatch === null || dispatch === void 0 ? void 0 : dispatch(transaction);
      return true;
    };
  }
  toMarkdown(state, node) {
    const name = node.attrs["data-name"];
    if (name) {
      state.write(":".concat(name, ":"));
    }
  }
  parseMarkdown() {
    return {
      node: "emoji",
      getAttrs: tok => ({
        "data-name": tok.markup.trim()
      })
    };
  }
}
exports.default = Emoji;