"use strict";

var _types = require("./../../shared/types");
var _models = require("./../models");
var _errors = require("../errors");
var _cancan = require("./cancan");
(0, _cancan.allow)(_models.User, "read", _models.User, (actor, user) => user && user.teamId === actor.teamId);
(0, _cancan.allow)(_models.User, "inviteUser", _models.Team, (actor, team) => {
  if (!team || actor.teamId !== team.id || actor.isViewer) {
    return false;
  }
  if (actor.isAdmin || team.getPreference(_types.TeamPreference.MembersCanInvite)) {
    return true;
  }
  throw (0, _errors.AdminRequiredError)();
});
(0, _cancan.allow)(_models.User, "update", _models.User, (actor, user) => {
  if (!user || user.teamId !== actor.teamId) {
    return false;
  }
  if (user.id === actor.id) {
    return true;
  }
  if (actor.isAdmin) {
    return true;
  }
  return false;
});
(0, _cancan.allow)(_models.User, "delete", _models.User, (actor, user) => {
  if (!user || user.teamId !== actor.teamId) {
    return false;
  }
  if (user.id === actor.id) {
    return true;
  }
  if (actor.isAdmin) {
    return true;
  }
  throw (0, _errors.AdminRequiredError)();
});
(0, _cancan.allow)(_models.User, ["activate", "suspend"], _models.User, (actor, user) => {
  if (!user || user.teamId !== actor.teamId) {
    return false;
  }
  if (actor.isAdmin) {
    return true;
  }
  throw (0, _errors.AdminRequiredError)();
});
(0, _cancan.allow)(_models.User, "readDetails", _models.User, (actor, user) => {
  if (!user || user.teamId !== actor.teamId) {
    return false;
  }
  if (user === actor) {
    return true;
  }
  return actor.isAdmin;
});
(0, _cancan.allow)(_models.User, "promote", _models.User, (actor, user) => {
  if (!user || user.teamId !== actor.teamId) {
    return false;
  }
  if (user.isAdmin || user.isSuspended) {
    return false;
  }
  if (actor.isAdmin) {
    return true;
  }
  throw (0, _errors.AdminRequiredError)();
});
(0, _cancan.allow)(_models.User, "resendInvite", _models.User, (actor, user) => {
  if (!user || user.teamId !== actor.teamId) {
    return false;
  }
  if (!user.isInvited) {
    return false;
  }
  if (actor.isAdmin) {
    return true;
  }
  throw (0, _errors.AdminRequiredError)();
});
(0, _cancan.allow)(_models.User, "demote", _models.User, (actor, user) => {
  if (!user || user.teamId !== actor.teamId) {
    return false;
  }
  if (user.isSuspended) {
    return false;
  }
  if (actor.isAdmin) {
    return true;
  }
  throw (0, _errors.AdminRequiredError)();
});