"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _Frame = _interopRequireDefault(require("../components/Frame"));
var _templateObject;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function Spotify(_ref) {
  let {
    matches,
    ...props
  } = _ref;
  let pathname = "";
  try {
    const parsed = new URL(props.attrs.href);
    pathname = parsed.pathname;
  } catch (err) {
    pathname = "";
  }
  const normalizedPath = pathname.replace(/^\/embed/, "/");
  let height;
  if (normalizedPath.includes("episode") || normalizedPath.includes("show")) {
    height = 232;
  } else if (normalizedPath.includes("track")) {
    height = 80;
  } else {
    height = 380;
  }
  return /*#__PURE__*/React.createElement(SpotifyFrame, _extends({}, props, {
    width: "100%",
    height: "".concat(height, "px"),
    src: "https://open.spotify.com/embed".concat(normalizedPath),
    title: "Spotify Embed",
    allow: "encrypted-media"
  }));
}
const SpotifyFrame = (0, _styledComponents.default)(_Frame.default)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  border-radius: 13px;\n"])));
var _default = exports.default = Spotify;