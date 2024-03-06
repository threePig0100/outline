"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = presentUser;
var _env = _interopRequireDefault(require("./../env"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function presentUser(user) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const userData = {
    id: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl,
    color: user.color,
    isAdmin: user.isAdmin,
    isSuspended: user.isSuspended,
    isViewer: user.isViewer,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    lastActiveAt: user.lastActiveAt
  };
  if (options.includeDetails) {
    userData.email = user.email;
    userData.language = user.language || _env.default.DEFAULT_LANGUAGE;
    userData.preferences = user.preferences;
    userData.notificationSettings = user.notificationSettings;
  }
  return userData;
}