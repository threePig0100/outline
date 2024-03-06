"use strict";

var _env = _interopRequireDefault(require("./../env"));
var _errors = require("./../errors");
var _models = require("./../models");
var _cancan = require("./cancan");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
(0, _cancan.allow)(_models.User, "read", _models.Team, (user, team) => user.teamId === (team === null || team === void 0 ? void 0 : team.id));
(0, _cancan.allow)(_models.User, "share", _models.Team, (user, team) => {
  if (!team || user.isViewer || user.teamId !== team.id) {
    return false;
  }
  return team.sharing;
});
(0, _cancan.allow)(_models.User, "createTeam", _models.Team, () => {
  if (!_env.default.isCloudHosted) {
    throw (0, _errors.IncorrectEditionError)("Functionality is not available in this edition");
  }
  return true;
});
(0, _cancan.allow)(_models.User, "update", _models.Team, (user, team) => {
  if (!team || user.isViewer || user.teamId !== team.id) {
    return false;
  }
  return user.isAdmin;
});
(0, _cancan.allow)(_models.User, ["delete", "audit"], _models.Team, (user, team) => {
  if (!_env.default.isCloudHosted) {
    throw (0, _errors.IncorrectEditionError)("Functionality is not available in this edition");
  }
  if (!team || user.isViewer || user.teamId !== team.id) {
    return false;
  }
  return user.isAdmin;
});