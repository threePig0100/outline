"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _outlineIcons = require("outline-icons");
var _prosemirrorCommands = require("prosemirror-commands");
var _prosemirrorInputrules = require("prosemirror-inputrules");
var _prosemirrorState = require("prosemirror-state");
var _prosemirrorView = require("prosemirror-view");
var React = _interopRequireWildcard(require("react"));
var _reactDom = _interopRequireDefault(require("react-dom"));
var _sonner = require("sonner");
var _urls = require("../../utils/urls");
var _findLinkNodes = _interopRequireDefault(require("../queries/findLinkNodes"));
var _getMarkRange = _interopRequireDefault(require("../queries/getMarkRange"));
var _isMarkActive = _interopRequireDefault(require("../queries/isMarkActive"));
var _types = require("../types");
var _Mark = _interopRequireDefault(require("./Mark"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const LINK_INPUT_REGEX = /\[([^[]+)]\((\S+)\)$/;
let icon;
if (typeof window !== "undefined") {
  const component = /*#__PURE__*/React.createElement(_outlineIcons.OpenIcon, {
    size: 16
  });
  icon = document.createElement("span");
  icon.className = "external-link";
  _reactDom.default.render(component, icon);
}
function isPlainURL(link, parent, index, side) {
  if (link.attrs.title || !/^\w+:/.test(link.attrs.href)) {
    return false;
  }
  const content = parent.child(index + (side < 0 ? -1 : 0));
  if (!content.isText || content.text !== link.attrs.href || content.marks[content.marks.length - 1] !== link) {
    return false;
  }
  if (index === (side < 0 ? 1 : parent.childCount - 1)) {
    return true;
  }
  const next = parent.child(index + (side < 0 ? -2 : 1));
  return !link.isInSet(next.marks);
}
class Link extends _Mark.default {
  get name() {
    return "link";
  }
  get schema() {
    return {
      attrs: {
        href: {
          default: ""
        },
        title: {
          default: null
        }
      },
      inclusive: false,
      parseDOM: [{
        tag: "a[href]",
        getAttrs: dom => ({
          href: dom.getAttribute("href"),
          title: dom.getAttribute("title")
        })
      }],
      toDOM: node => ["a", {
        title: node.attrs.title,
        href: (0, _urls.sanitizeUrl)(node.attrs.href),
        class: "use-hover-preview",
        rel: "noopener noreferrer nofollow"
      }, 0]
    };
  }
  inputRules(_ref) {
    let {
      type
    } = _ref;
    return [new _prosemirrorInputrules.InputRule(LINK_INPUT_REGEX, (state, match, start, end) => {
      const [okay, alt, href] = match;
      const {
        tr
      } = state;
      if (okay) {
        tr.replaceWith(start, end, this.editor.schema.text(alt)).addMark(start, start + alt.length, type.create({
          href
        }));
      }
      return tr;
    })];
  }
  keys(_ref2) {
    let {
      type
    } = _ref2;
    return {
      "Mod-k": (state, dispatch) => {
        if (state.selection.empty) {
          this.editor.events.emit(_types.EventType.LinkToolbarOpen);
          return true;
        }
        return (0, _prosemirrorCommands.toggleMark)(type, {
          href: ""
        })(state, dispatch);
      },
      "Mod-Enter": state => {
        if ((0, _isMarkActive.default)(type)(state)) {
          const range = (0, _getMarkRange.default)(state.selection.$from, state.schema.marks.link);
          if (range && range.mark && this.options.onClickLink) {
            try {
              const event = new KeyboardEvent("keydown", {
                metaKey: false
              });
              this.options.onClickLink((0, _urls.sanitizeUrl)(range.mark.attrs.href), event);
            } catch (err) {
              _sonner.toast.error(this.options.dictionary.openLinkError);
            }
            return true;
          }
        }
        return false;
      }
    };
  }
  get plugins() {
    const getLinkDecorations = state => {
      const decorations = [];
      const links = (0, _findLinkNodes.default)(state.doc);
      links.forEach(nodeWithPos => {
        const linkMark = nodeWithPos.node.marks.find(mark => mark.type.name === "link");
        if (linkMark && (0, _urls.isExternalUrl)(linkMark.attrs.href)) {
          decorations.push(_prosemirrorView.Decoration.widget(
          // place the decoration at the end of the link
          nodeWithPos.pos + nodeWithPos.node.nodeSize, () => {
            const cloned = icon.cloneNode(true);
            cloned.addEventListener("click", event => {
              try {
                if (this.options.onClickLink) {
                  event.stopPropagation();
                  event.preventDefault();
                  this.options.onClickLink((0, _urls.sanitizeUrl)(linkMark.attrs.href), event);
                }
              } catch (err) {
                _sonner.toast.error(this.options.dictionary.openLinkError);
              }
            });
            return cloned;
          }, {
            // position on the right side of the position
            side: 1,
            key: "external-link"
          }));
        }
      });
      return _prosemirrorView.DecorationSet.create(state.doc, decorations);
    };
    const handleClick = (view, pos) => {
      const {
        doc,
        tr
      } = view.state;
      const range = (0, _getMarkRange.default)(doc.resolve(pos), this.editor.schema.marks.link);
      if (!range || range.from === pos || range.to === pos) {
        return false;
      }
      try {
        const $start = doc.resolve(range.from);
        const $end = doc.resolve(range.to);
        tr.setSelection(new _prosemirrorState.TextSelection($start, $end));
        view.dispatch(tr);
        return true;
      } catch (err) {
        // Failed to set selection
      }
      return false;
    };
    const plugin = new _prosemirrorState.Plugin({
      state: {
        init: (_config, state) => getLinkDecorations(state),
        apply: (tr, decorationSet, _oldState, newState) => tr.docChanged ? getLinkDecorations(newState) : decorationSet
      },
      props: {
        decorations: state => plugin.getState(state),
        handleDOMEvents: {
          contextmenu: (view, event) => {
            const result = view.posAtCoords({
              left: event.clientX,
              top: event.clientY
            });
            if (result) {
              return handleClick(view, result.pos);
            }
            return false;
          },
          mousedown: (view, event) => {
            var _event$target;
            const target = (_event$target = event.target) === null || _event$target === void 0 ? void 0 : _event$target.closest("a");
            if (!(target instanceof HTMLAnchorElement) || event.button !== 0) {
              return false;
            }
            if (target.matches(".component-attachment *")) {
              return false;
            }

            // clicking a link while editing should show the link toolbar,
            // clicking in read-only will navigate
            if (!view.editable || view.editable && !view.hasFocus()) {
              const href = target.href || (target.parentNode instanceof HTMLAnchorElement ? target.parentNode.href : "");
              try {
                if (this.options.onClickLink) {
                  event.stopPropagation();
                  event.preventDefault();
                  this.options.onClickLink((0, _urls.sanitizeUrl)(href), event);
                }
              } catch (err) {
                _sonner.toast.error(this.options.dictionary.openLinkError);
              }
              return true;
            }
            const result = view.posAtCoords({
              left: event.clientX,
              top: event.clientY
            });
            if (result && handleClick(view, result.pos)) {
              event.preventDefault();
              return true;
            }
            return false;
          },
          click: (view, event) => {
            if (!(event.target instanceof HTMLAnchorElement) || event.button !== 0) {
              return false;
            }
            if (event.target.matches(".component-attachment *")) {
              return false;
            }

            // Prevent all default click behavior of links, see mousedown above
            // for custom link handling.
            if (this.options.onClickLink) {
              event.stopPropagation();
              event.preventDefault();
            }
            return false;
          }
        }
      }
    });
    return [plugin];
  }
  toMarkdown() {
    return {
      open: (_state, mark, parent, index) => isPlainURL(mark, parent, index, 1) ? "<" : "[",
      close: (state, mark, parent, index) => isPlainURL(mark, parent, index, -1) ? ">" : "](" + state.esc(mark.attrs.href) + (mark.attrs.title ? " " + quote(mark.attrs.title) : "") + ")"
    };
  }
  parseMarkdown() {
    return {
      mark: "link",
      getAttrs: token => ({
        href: token.attrGet("href"),
        title: token.attrGet("title") || null
      })
    };
  }
}
exports.default = Link;
function quote(str) {
  const wrap = str.indexOf('"') === -1 ? '""' : str.indexOf("'") === -1 ? "''" : "()";
  return wrap[0] + str + wrap[1];
}