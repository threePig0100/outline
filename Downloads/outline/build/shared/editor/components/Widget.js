"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Widget;
var React = _interopRequireWildcard(require("react"));
var _styledComponents = _interopRequireWildcard(require("styled-components"));
var _styles = require("../../styles");
var _urls = require("../../utils/urls");
var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6;
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }
function Widget(props) {
  return /*#__PURE__*/React.createElement(Wrapper, {
    className: props.isSelected ? "ProseMirror-selectednode widget" : "widget",
    href: (0, _urls.sanitizeUrl)(props.href),
    rel: "noreferrer nofollow",
    onMouseDown: props.onMouseDown,
    onClick: props.onClick
  }, props.icon, /*#__PURE__*/React.createElement(Preview, null, /*#__PURE__*/React.createElement(Title, null, props.title), /*#__PURE__*/React.createElement(Subtitle, null, props.context), /*#__PURE__*/React.createElement(Children, null, props.children)));
}
const Children = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  margin-left: auto;\n  height: 20px;\n  opacity: 0;\n\n  &:hover {\n    color: ", ";\n  }\n"])), (0, _styles.s)("text"));
const Title = _styledComponents.default.strong(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  font-weight: 500;\n  font-size: 14px;\n  color: ", ";\n"])), (0, _styles.s)("text"));
const Preview = _styledComponents.default.div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  gap: 8px;\n  display: flex;\n  flex-direction: row;\n  flex-grow: 1;\n  align-items: center;\n  color: ", ";\n"])), (0, _styles.s)("textTertiary"));
const Subtitle = _styledComponents.default.span(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  font-size: 13px;\n  color: ", " !important;\n  line-height: 0;\n"])), (0, _styles.s)("textTertiary"));
const Wrapper = _styledComponents.default.a(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  background: ", ";\n  color: ", " !important;\n  box-shadow: 0 0 0 1px ", ";\n  white-space: nowrap;\n  border-radius: 8px;\n  padding: 6px 8px;\n  max-width: 840px;\n  cursor: default;\n\n  user-select: none;\n  text-overflow: ellipsis;\n  overflow: hidden;\n\n  ", "\n"])), (0, _styles.s)("background"), (0, _styles.s)("text"), (0, _styles.s)("divider"), props => props.href && (0, _styledComponents.css)(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n      &:hover,\n      &:active {\n        cursor: pointer !important;\n        text-decoration: none !important;\n        background: ", ";\n\n        ", " {\n          opacity: 1;\n        }\n      }\n    "])), (0, _styles.s)("secondaryBackground"), Children));