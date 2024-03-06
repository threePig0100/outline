"use strict";

var _models = require("./../models");
var _cancan = require("./cancan");
(0, _cancan.allow)(_models.User, ["read", "update"], _models.Notification, (user, notification) => {
  if (!notification) {
    return false;
  }
  return (user === null || user === void 0 ? void 0 : user.id) === notification.userId;
});