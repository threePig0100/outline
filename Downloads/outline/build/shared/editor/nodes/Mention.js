"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prosemirrorState = require("prosemirror-state");
var _Extension = _interopRequireDefault(require("../lib/Extension"));
var _mention = _interopRequireDefault(require("../rules/mention"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class Mention extends _Extension.default {
  get type() {
    return "node";
  }
  get name() {
    return "mention";
  }
  get schema() {
    return {
      attrs: {
        type: {},
        label: {},
        modelId: {},
        actorId: {
          default: undefined
        },
        id: {}
      },
      inline: true,
      content: "text*",
      marks: "",
      group: "inline",
      atom: true,
      parseDOM: [{
        tag: "span.".concat(this.name),
        preserveWhitespace: "full",
        getAttrs: dom => ({
          type: dom.dataset.type,
          modelId: dom.dataset.id,
          actorId: dom.dataset.actorId,
          label: dom.innerText,
          id: dom.id
        })
      }],
      toDOM: node => ["span", {
        class: "".concat(node.type.name, " use-hover-preview"),
        id: node.attrs.id,
        "data-type": node.attrs.type,
        "data-id": node.attrs.modelId,
        "data-actorId": node.attrs.actorId,
        "data-url": "mention://".concat(node.attrs.id, "/").concat(node.attrs.type, "/").concat(node.attrs.modelId)
      }, node.attrs.label],
      toPlainText: node => "@".concat(node.attrs.label)
    };
  }
  get rulePlugins() {
    return [_mention.default];
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
    const mType = node.attrs.type;
    const mId = node.attrs.modelId;
    const label = node.attrs.label;
    const id = node.attrs.id;
    state.write("@[".concat(label, "](mention://").concat(id, "/").concat(mType, "/").concat(mId, ")"));
  }
  parseMarkdown() {
    return {
      node: "mention",
      getAttrs: tok => ({
        id: tok.attrGet("id"),
        type: tok.attrGet("type"),
        modelId: tok.attrGet("modelId"),
        label: tok.content
      })
    };
  }
}
exports.default = Mention;