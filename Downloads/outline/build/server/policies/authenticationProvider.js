"use strict";

var _models = require("./../models");
var _errors = require("../errors");
var _cancan = require("./cancan");
(0, _cancan.allow)(_models.User, "createAuthenticationProvider", _models.Team, (actor, team) => {
  if (!team || actor.teamId !== team.id) {
    return false;
  }
  if (actor.isAdmin) {
    return true;
  }
  throw (0, _errors.AdminRequiredError)();
});
(0, _cancan.allow)(_models.User, "read", _models.AuthenticationProvider, (actor, authenticationProvider) => actor && actor.teamId === (authenticationProvider === null || authenticationProvider === void 0 ? void 0 : authenticationProvider.teamId));
(0, _cancan.allow)(_models.User, ["update", "delete"], _models.AuthenticationProvider, (actor, authenticationProvider) => {
  if (actor.teamId !== (authenticationProvider === null || authenticationProvider === void 0 ? void 0 : authenticationProvider.teamId)) {
    return false;
  }
  if (actor.isAdmin) {
    return true;
  }
  throw (0, _errors.AdminRequiredError)();
});