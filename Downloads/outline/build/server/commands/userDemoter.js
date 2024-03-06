"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = userDemoter;
var _errors = require("./../errors");
var _models = require("./../models");
var _CleanupDemotedUserTask = _interopRequireDefault(require("./../queues/tasks/CleanupDemotedUserTask"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
async function userDemoter(_ref) {
  let {
    user,
    actorId,
    to,
    transaction,
    ip
  } = _ref;
  if (user.id === actorId) {
    throw (0, _errors.ValidationError)("Unable to demote the current user");
  }
  await user.demote(to, {
    transaction
  });
  await _models.Event.create({
    name: "users.demote",
    actorId,
    userId: user.id,
    teamId: user.teamId,
    data: {
      name: user.name
    },
    ip
  }, {
    transaction
  });
  await _CleanupDemotedUserTask.default.schedule({
    userId: user.id
  });
}