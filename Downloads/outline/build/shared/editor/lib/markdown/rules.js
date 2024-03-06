"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rules;
var _markdownIt = _interopRequireDefault(require("markdown-it"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function rules(_ref) {
  let {
    rules = {},
    plugins = []
  } = _ref;
  const markdownIt = (0, _markdownIt.default)("default", {
    breaks: false,
    html: false,
    linkify: false,
    ...rules
  });
  plugins.forEach(plugin => markdownIt.use(plugin));
  return markdownIt;
}