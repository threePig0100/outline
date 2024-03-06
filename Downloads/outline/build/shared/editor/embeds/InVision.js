"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _Frame = _interopRequireDefault(require("../components/Frame"));
var _ImageZoom = _interopRequireDefault(require("../components/ImageZoom"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function InVision(_ref) {
  let {
    matches,
    ...props
  } = _ref;
  if (/opal\.invisionapp\.com/.test(props.attrs.href)) {
    return /*#__PURE__*/React.createElement("div", {
      className: props.isSelected ? "ProseMirror-selectednode" : ""
    }, /*#__PURE__*/React.createElement(_ImageZoom.default, {
      zoomMargin: 24
    }, /*#__PURE__*/React.createElement("img", {
      src: props.attrs.href,
      alt: "InVision Embed",
      style: {
        maxWidth: "100%",
        maxHeight: "75vh"
      }
    })));
  }
  return /*#__PURE__*/React.createElement(_Frame.default, _extends({}, props, {
    src: props.attrs.href,
    title: "InVision Embed"
  }));
}
var _default = exports.default = InVision;