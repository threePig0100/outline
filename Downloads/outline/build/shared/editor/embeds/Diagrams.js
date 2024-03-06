"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _Frame = _interopRequireDefault(require("../components/Frame"));
var _Img = _interopRequireDefault(require("../components/Img"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function Diagrams(_ref) {
  var _embed$settings;
  let {
    matches,
    ...props
  } = _ref;
  const {
    embed
  } = props;
  const embedUrl = matches[0];
  const params = new URL(embedUrl).searchParams;
  const titlePrefix = (_embed$settings = embed.settings) !== null && _embed$settings !== void 0 && _embed$settings.url ? "Draw.io" : "Diagrams.net";
  const title = params.get("title") ? "".concat(titlePrefix, " (").concat(params.get("title"), ")") : titlePrefix;
  return /*#__PURE__*/React.createElement(_Frame.default, _extends({}, props, {
    src: embedUrl,
    icon: /*#__PURE__*/React.createElement(_Img.default, {
      src: "/images/diagrams.png",
      alt: "Diagrams.net",
      width: 16,
      height: 16
    }),
    canonicalUrl: props.attrs.href,
    title: title,
    border: true
  }));
}
var _default = exports.default = Diagrams;