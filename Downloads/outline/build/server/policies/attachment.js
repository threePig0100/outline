"use strict";

var _models = require("./../models");
var _cancan = require("./cancan");
(0, _cancan.allow)(_models.User, "createAttachment", _models.Team, (user, team) => {
  if (!team || user.isViewer || user.teamId !== team.id) {
    return false;
  }
  return true;
});
(0, _cancan.allow)(_models.User, "read", _models.Attachment, (actor, attachment) => {
  if (!attachment || !actor || attachment.teamId !== actor.teamId) {
    return false;
  }
  if (actor.isAdmin) {
    return true;
  }
  if (actor.id === attachment.userId) {
    return true;
  }
  return false;
});
(0, _cancan.allow)(_models.User, "delete", _models.Attachment, (actor, attachment) => {
  if (actor.isViewer) {
    return false;
  }
  if (!attachment || attachment.teamId !== actor.teamId) {
    return false;
  }
  if (actor.isAdmin) {
    return true;
  }
  if (actor.id === attachment.userId) {
    return true;
  }
  return false;
});