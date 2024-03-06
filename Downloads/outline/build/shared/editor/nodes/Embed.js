"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _urls = require("../../utils/urls");
var _Embed = _interopRequireDefault(require("../components/Embed"));
var _embeds = _interopRequireDefault(require("../embeds"));
var _embeds2 = require("../lib/embeds");
var _embeds3 = _interopRequireDefault(require("../rules/embeds"));
var _Node = _interopRequireDefault(require("./Node"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
class Embed extends _Node.default {
  get name() {
    return "embed";
  }
  get schema() {
    return {
      content: "inline*",
      group: "block",
      atom: true,
      attrs: {
        href: {}
      },
      parseDOM: [{
        tag: "iframe",
        getAttrs: dom => {
          var _this$editor$props$em, _this$editor;
          const embeds = (_this$editor$props$em = (_this$editor = this.editor) === null || _this$editor === void 0 ? void 0 : _this$editor.props.embeds) !== null && _this$editor$props$em !== void 0 ? _this$editor$props$em : _embeds.default;
          const href = dom.getAttribute("data-canonical-url") || "";
          const response = (0, _embeds2.getMatchingEmbed)(embeds, href);
          if (response) {
            return {
              href
            };
          }
          return false;
        }
      }, {
        tag: "a.embed",
        getAttrs: dom => ({
          href: dom.getAttribute("href")
        })
      }],
      toDOM: node => {
        var _this$editor$props$em2, _this$editor2, _response$embed$trans, _response$embed;
        const embeds = (_this$editor$props$em2 = (_this$editor2 = this.editor) === null || _this$editor2 === void 0 ? void 0 : _this$editor2.props.embeds) !== null && _this$editor$props$em2 !== void 0 ? _this$editor$props$em2 : _embeds.default;
        const response = (0, _embeds2.getMatchingEmbed)(embeds, node.attrs.href);
        const src = response === null || response === void 0 ? void 0 : (_response$embed$trans = (_response$embed = response.embed).transformMatch) === null || _response$embed$trans === void 0 ? void 0 : _response$embed$trans.call(_response$embed, response.matches);
        if (src) {
          return ["iframe", {
            class: "embed",
            frameborder: "0",
            src: (0, _urls.sanitizeUrl)(src),
            contentEditable: "false",
            allowfullscreen: "true",
            "data-canonical-url": (0, _urls.sanitizeUrl)(node.attrs.href)
          }];
        } else {
          var _response$embed$title;
          return ["a", {
            class: "embed",
            href: (0, _urls.sanitizeUrl)(node.attrs.href),
            contentEditable: "false",
            "data-canonical-url": (0, _urls.sanitizeUrl)(node.attrs.href)
          }, (_response$embed$title = response === null || response === void 0 ? void 0 : response.embed.title) !== null && _response$embed$title !== void 0 ? _response$embed$title : node.attrs.href];
        }
      },
      toPlainText: node => node.attrs.href
    };
  }
  get rulePlugins() {
    return [(0, _embeds3.default)(this.options.embeds)];
  }
  component(props) {
    const {
      embeds,
      embedsDisabled
    } = this.editor.props;
    return /*#__PURE__*/React.createElement(_Embed.default, _extends({}, props, {
      embeds: embeds,
      embedsDisabled: embedsDisabled
    }));
  }
  commands(_ref) {
    let {
      type
    } = _ref;
    return attrs => (state, dispatch) => {
      dispatch === null || dispatch === void 0 ? void 0 : dispatch(state.tr.replaceSelectionWith(type.create(attrs)).scrollIntoView());
      return true;
    };
  }
  toMarkdown(state, node) {
    if (!state.inTable) {
      state.ensureNewLine();
    }
    const href = node.attrs.href.replace(/_/g, "%5F");
    state.write("[" + state.esc(href, false) + "](" + state.esc(href, false) + ")");
    if (!state.inTable) {
      state.write("\n\n");
    }
  }
  parseMarkdown() {
    return {
      node: "embed",
      getAttrs: token => ({
        href: token.attrGet("href")
      })
    };
  }
}
exports.default = Embed;