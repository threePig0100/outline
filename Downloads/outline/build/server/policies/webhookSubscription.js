"use strict";

var _models = require("./../models");
var _cancan = require("./cancan");
(0, _cancan.allow)(_models.User, "listWebhookSubscription", _models.Team, (user, team) => {
  if (!team || user.isViewer || user.teamId !== team.id) {
    return false;
  }
  return user.isAdmin;
});
(0, _cancan.allow)(_models.User, "createWebhookSubscription", _models.Team, (user, team) => {
  if (!team || user.isViewer || user.teamId !== team.id) {
    return false;
  }
  return user.isAdmin;
});
(0, _cancan.allow)(_models.User, ["read", "update", "delete"], _models.WebhookSubscription, (user, webhook) => {
  if (!user || !webhook) {
    return false;
  }
  if (!user.isAdmin) {
    return false;
  }
  return user.teamId === webhook.teamId;
});