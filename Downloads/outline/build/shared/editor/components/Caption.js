"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _styledComponentsBreakpoint = _interopRequireDefault(require("styled-components-breakpoint"));
var _styles = require("../../styles");
var _templateObject, _templateObject2;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
/**
 * A component that renders a caption for an image or video.
 */
function Caption(_ref) {
  let {
    placeholder,
    children,
    isSelected,
    ...rest
  } = _ref;
  const handlePaste = event => {
    event.preventDefault();
    const text = event.clipboardData.getData("text/plain");
    window.document.execCommand("insertText", false, text);
  };
  const handleMouseDown = ev => {
    // always prevent clicks in caption from bubbling to the editor
    ev.stopPropagation();
  };
  return /*#__PURE__*/React.createElement(Content, _extends({
    $isSelected: isSelected,
    onMouseDown: handleMouseDown,
    onPaste: handlePaste,
    className: "caption",
    tabIndex: -1,
    role: "textbox",
    contentEditable: true,
    suppressContentEditableWarning: true,
    "data-caption": placeholder
  }, rest), children);
}
const Content = _styledComponents.default.p(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  border: 0;\n  display: block;\n  font-style: italic;\n  font-weight: normal;\n  color: ", ";\n  padding: 8px 0 4px;\n  line-height: 16px;\n  text-align: center;\n  min-height: 1em;\n  outline: none;\n  background: none;\n  resize: none;\n  user-select: text;\n  margin: 0 !important;\n  cursor: text;\n\n  ", ";\n\n  &:empty:not(:focus) {\n    display: ", "};\n  }\n\n  &:empty:before {\n    color: ", ";\n    content: attr(data-caption);\n    pointer-events: none;\n  }\n"])), (0, _styles.s)("textSecondary"), (0, _styledComponentsBreakpoint.default)("tablet")(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    font-size: 13px;\n  "]))), props => props.$isSelected ? "block" : "none", (0, _styles.s)("placeholder"));
var _default = exports.default = Caption;