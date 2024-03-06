"use strict";

var _models = require("./../models");
var _errors = require("../errors");
var _cancan = require("./cancan");
(0, _cancan.allow)(_models.User, "createIntegration", _models.Team, (actor, team) => {
  if (!team || actor.isViewer || actor.teamId !== team.id) {
    return false;
  }
  if (actor.isAdmin) {
    return true;
  }
  throw (0, _errors.AdminRequiredError)();
});
(0, _cancan.allow)(_models.User, "read", _models.Integration, (user, integration) => user.teamId === (integration === null || integration === void 0 ? void 0 : integration.teamId));
(0, _cancan.allow)(_models.User, ["update", "delete"], _models.Integration, (user, integration) => {
  if (user.isViewer) {
    return false;
  }
  if (!integration || user.teamId !== integration.teamId) {
    return false;
  }
  if (user.isAdmin) {
    return true;
  }
  throw (0, _errors.AdminRequiredError)();
});