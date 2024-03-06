"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.robotsResponse = void 0;
var _env = _interopRequireDefault(require("./../env"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const robotsResponse = () => {
  if (_env.default.isCloudHosted) {
    return "\nUser-agent: *\nAllow: /\n";
  }
  return "\nUser-agent: *\nDisallow: /\n";
};
exports.robotsResponse = robotsResponse;