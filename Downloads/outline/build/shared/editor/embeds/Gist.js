"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _templateObject;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }
const Iframe = _styledComponents.default.iframe(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  margin-top: 8px;\n"])));
function Gist(props) {
  const gistUrl = new URL(props.attrs.href);
  const id = gistUrl.pathname.split("/")[2];
  const gistLink = "https://gist.github.com/".concat(id, ".js");
  const gistScript = "<script type=\"text/javascript\" src=\"".concat(gistLink, "\"></script>");
  const styles = "<style>*{ font-size:12px; } body { margin: 0; } .gist .blob-wrapper.data { max-height:150px; overflow:auto; }</style>";
  const iframeHtml = "<html><head><base target=\"_parent\">".concat(styles, "</head><body>").concat(gistScript, "</body></html>");
  return /*#__PURE__*/React.createElement(Iframe, {
    src: "data:text/html;base64,".concat(btoa(iframeHtml)),
    className: props.isSelected ? "ProseMirror-selectednode" : "",
    frameBorder: "0",
    width: "100%",
    height: "200px",
    scrolling: "no",
    id: "gist-".concat(id),
    title: "Github Gist"
  });
}
var _default = exports.default = Gist;