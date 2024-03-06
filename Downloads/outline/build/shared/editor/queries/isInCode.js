"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isInCode;
var _isMarkActive = _interopRequireDefault(require("./isMarkActive"));
var _isNodeActive = _interopRequireDefault(require("./isNodeActive"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * Returns true if the selection is inside a code block or code mark.
 *
 * @param state The editor state.
 * @param options The options.
 * @returns True if the selection is inside a code block or code mark.
 */
function isInCode(state, options) {
  const {
    nodes,
    marks
  } = state.schema;
  if (!(options !== null && options !== void 0 && options.onlyMark)) {
    if (nodes.code_block && (0, _isNodeActive.default)(nodes.code_block)(state)) {
      return true;
    }
    if (nodes.code_fence && (0, _isNodeActive.default)(nodes.code_fence)(state)) {
      return true;
    }
  }
  if (!(options !== null && options !== void 0 && options.onlyBlock)) {
    if (marks.code_inline) {
      return (0, _isMarkActive.default)(marks.code_inline)(state);
    }
  }
  return false;
}