"use strict";

var _models = require("./../models");
var _cancan = require("./cancan");
(0, _cancan.allow)(_models.User, "createComment", _models.Team, (user, team) => {
  if (!team || user.teamId !== team.id) {
    return false;
  }
  return true;
});
(0, _cancan.allow)(_models.User, "read", _models.Comment, (user, comment) => {
  if (!comment) {
    return false;
  }
  return user.teamId === comment.createdBy.teamId;
});
(0, _cancan.allow)(_models.User, ["update", "delete"], _models.Comment, (user, comment) => {
  if (!comment) {
    return false;
  }
  if (user.teamId !== comment.createdBy.teamId) {
    return false;
  }
  return user.isAdmin || (user === null || user === void 0 ? void 0 : user.id) === comment.createdById;
});