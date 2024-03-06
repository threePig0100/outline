"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResizeRight = exports.ResizeLeft = void 0;
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _styles = require("../../styles");
var _templateObject, _templateObject2;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }
const ResizeLeft = exports.ResizeLeft = _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  cursor: ew-resize;\n  position: absolute;\n  left: -4px;\n  top: 0;\n  bottom: 0;\n  width: 8px;\n  user-select: none;\n  opacity: ", ";\n  transition: opacity 150ms ease-in-out;\n\n  &:after {\n    content: \"\";\n    position: absolute;\n    left: 8px;\n    top: 50%;\n    transform: translateY(-50%);\n    width: 6px;\n    height: 15%;\n    min-height: 20px;\n    border-radius: 4px;\n    background: ", ";\n    box-shadow: 0 0 0 1px ", ";\n    opacity: 0.75;\n  }\n"])), props => props.$dragging ? 1 : 0, (0, _styles.s)("menuBackground"), (0, _styles.s)("textSecondary"));
const ResizeRight = exports.ResizeRight = (0, _styledComponents.default)(ResizeLeft)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  left: initial;\n  right: -4px;\n\n  &:after {\n    left: initial;\n    right: 8px;\n  }\n"])));