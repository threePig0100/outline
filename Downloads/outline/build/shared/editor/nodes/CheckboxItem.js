"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prosemirrorSchemaList = require("prosemirror-schema-list");
var _toggleCheckboxItem = _interopRequireDefault(require("../commands/toggleCheckboxItem"));
var _checkboxes = _interopRequireDefault(require("../rules/checkboxes"));
var _Node = _interopRequireDefault(require("./Node"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class CheckboxItem extends _Node.default {
  constructor() {
    super(...arguments);
    _defineProperty(this, "handleClick", event => {
      if (!(event.target instanceof HTMLSpanElement)) {
        return;
      }
      const {
        view
      } = this.editor;
      const {
        tr
      } = view.state;
      const {
        top,
        left
      } = event.target.getBoundingClientRect();
      const result = view.posAtCoords({
        top,
        left
      });
      if (result) {
        const transaction = tr.setNodeMarkup(result.inside, undefined, {
          checked: event.target.getAttribute("aria-checked") !== "true"
        });
        view.dispatch(transaction);
      }
    });
  }
  get name() {
    return "checkbox_item";
  }
  get schema() {
    return {
      attrs: {
        checked: {
          default: false
        }
      },
      content: "paragraph block*",
      defining: true,
      draggable: true,
      parseDOM: [{
        tag: "li[data-type=\"".concat(this.name, "\"]"),
        getAttrs: dom => ({
          checked: dom.className.includes("checked")
        })
      }],
      toDOM: node => {
        const checked = node.attrs.checked.toString();
        let input;
        if (typeof document !== "undefined") {
          input = document.createElement("span");
          input.tabIndex = -1;
          input.className = "checkbox";
          input.setAttribute("aria-checked", checked);
          input.setAttribute("role", "checkbox");
          input.addEventListener("click", this.handleClick);
        }
        return ["li", {
          "data-type": this.name,
          class: node.attrs.checked ? "checked" : undefined
        }, ["span", {
          contentEditable: "false"
        }, ...(input ? [input] : [["span", {
          class: "checkbox",
          "aria-checked": checked
        }]])], ["div", 0]];
      }
    };
  }
  get rulePlugins() {
    return [_checkboxes.default];
  }
  keys(_ref) {
    let {
      type
    } = _ref;
    return {
      Enter: (0, _prosemirrorSchemaList.splitListItem)(type, {
        checked: false
      }),
      Tab: (0, _prosemirrorSchemaList.sinkListItem)(type),
      "Mod-Enter": (0, _toggleCheckboxItem.default)(),
      "Shift-Tab": (0, _prosemirrorSchemaList.liftListItem)(type),
      "Mod-]": (0, _prosemirrorSchemaList.sinkListItem)(type),
      "Mod-[": (0, _prosemirrorSchemaList.liftListItem)(type)
    };
  }
  toMarkdown(state, node) {
    state.write(node.attrs.checked ? "[x] " : "[ ] ");
    state.renderContent(node);
  }
  parseMarkdown() {
    return {
      block: "checkbox_item",
      getAttrs: tok => ({
        checked: tok.attrGet("checked") ? true : undefined
      })
    };
  }
}
exports.default = CheckboxItem;