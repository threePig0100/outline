"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "breakpoints", {
  enumerable: true,
  get: function () {
    return _breakpoints.default;
  }
});
Object.defineProperty(exports, "depths", {
  enumerable: true,
  get: function () {
    return _depths.default;
  }
});
exports.s = exports.hideScrollbars = exports.extraArea = exports.ellipsis = void 0;
var _depths = _interopRequireDefault(require("./depths"));
var _breakpoints = _interopRequireDefault(require("./breakpoints"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * Mixin to make text ellipse when it overflows.
 *
 * @returns string of CSS
 */
const ellipsis = () => "\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n";

/**
 * Mixin to return a theme value.
 *
 * @returns a theme value
 */
exports.ellipsis = ellipsis;
const s = key => props => String(props.theme[key]);

/**
 * Mixin to hide scrollbars.
 *
 * @returns string of CSS
 */
exports.s = s;
const hideScrollbars = () => "\n  -ms-overflow-style: none;\n  overflow: -moz-scrollbars-none;\n  scrollbar-width: none;\n  &::-webkit-scrollbar {\n    display: none;\n  }\n";

/**
 * Mixin on any component with relative positioning to add additional hidden clickable/hoverable area
 *
 * @param pixels
 * @returns
 */
exports.hideScrollbars = hideScrollbars;
const extraArea = pixels => "\n  &::before {\n    position: absolute;\n    content: \"\";\n    top: -".concat(pixels, "px;\n    right: -").concat(pixels, "px;\n    left: -").concat(pixels, "px;\n    bottom: -").concat(pixels, "px;\n  }\n");
exports.extraArea = extraArea;