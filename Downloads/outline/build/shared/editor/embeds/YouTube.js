"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _Frame = _interopRequireDefault(require("../components/Frame"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function YouTube(_ref) {
  let {
    matches,
    ...props
  } = _ref;
  const videoId = matches[1];
  let start;
  try {
    var _searchParams$get;
    const url = new URL(props.attrs.href);
    const searchParams = new URLSearchParams(url.search);
    start = (_searchParams$get = searchParams.get("t")) === null || _searchParams$get === void 0 ? void 0 : _searchParams$get.replace(/s$/, "");
  } catch (_e) {
    // noop
  }
  return /*#__PURE__*/React.createElement(_Frame.default, _extends({}, props, {
    src: "https://www.youtube.com/embed/".concat(videoId, "?modestbranding=1").concat(start ? "&start=".concat(start) : ""),
    title: "YouTube (".concat(videoId, ")")
  }));
}
var _default = exports.default = YouTube;