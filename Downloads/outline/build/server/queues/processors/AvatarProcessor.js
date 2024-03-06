"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _models = require("./../../models");
var _UploadTeamAvatarTask = _interopRequireDefault(require("../tasks/UploadTeamAvatarTask"));
var _UploadUserAvatarTask = _interopRequireDefault(require("../tasks/UploadUserAvatarTask"));
var _BaseProcessor = _interopRequireDefault(require("./BaseProcessor"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class AvatarProcessor extends _BaseProcessor.default {
  async perform(event) {
    // The uploads are performed in a separate task to allow for retrying in the
    // case of failures as it involves network calls to third party services.

    if (event.name === "users.create") {
      const user = await _models.User.findByPk(event.userId, {
        rejectOnEmpty: true
      });
      if (user.avatarUrl) {
        await _UploadUserAvatarTask.default.schedule({
          userId: event.userId,
          avatarUrl: user.avatarUrl
        });
      }
    }
    if (event.name === "teams.create") {
      const team = await _models.Team.findByPk(event.teamId, {
        rejectOnEmpty: true
      });
      if (team.avatarUrl) {
        await _UploadTeamAvatarTask.default.schedule({
          teamId: event.teamId,
          avatarUrl: team.avatarUrl
        });
      }
    }
  }
}
exports.default = AvatarProcessor;
_defineProperty(AvatarProcessor, "applicableEvents", ["users.create", "teams.create"]);