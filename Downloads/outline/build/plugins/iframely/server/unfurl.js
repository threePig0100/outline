"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unfurl = void 0;
var _iframely = _interopRequireDefault(require("./iframely"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const unfurl = async url => _iframely.default.get(url);
exports.unfurl = unfurl;