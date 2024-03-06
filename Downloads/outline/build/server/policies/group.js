"use strict";

var _models = require("./../models");
var _errors = require("../errors");
var _cancan = require("./cancan");
(0, _cancan.allow)(_models.User, "createGroup", _models.Team, (actor, team) => {
  if (!team || actor.isViewer || actor.teamId !== team.id) {
    return false;
  }
  if (actor.isAdmin) {
    return true;
  }
  throw (0, _errors.AdminRequiredError)();
});
(0, _cancan.allow)(_models.User, "read", _models.Group, (actor, group) => {
  // for the time being, we're going to let everyone on the team see every group
  // we may need to make this more granular in the future
  if (!group || actor.teamId !== group.teamId) {
    return false;
  }
  return true;
});
(0, _cancan.allow)(_models.User, ["update", "delete"], _models.Group, (actor, group) => {
  if (!group || actor.isViewer || actor.teamId !== group.teamId) {
    return false;
  }
  if (actor.isAdmin) {
    return true;
  }
  throw (0, _errors.AdminRequiredError)();
});