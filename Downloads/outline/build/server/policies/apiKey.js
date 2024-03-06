"use strict";

var _models = require("./../models");
var _cancan = require("./cancan");
(0, _cancan.allow)(_models.User, "createApiKey", _models.Team, (user, team) => {
  if (!team || user.isViewer || user.teamId !== team.id) {
    return false;
  }
  return true;
});
(0, _cancan.allow)(_models.User, ["read", "update", "delete"], _models.ApiKey, (user, apiKey) => {
  if (!apiKey) {
    return false;
  }
  if (user.isViewer) {
    return false;
  }
  return user && user.id === apiKey.userId;
});