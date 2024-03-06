"use strict";

var _models = require("./../models");
var _cancan = require("./cancan");
(0, _cancan.allow)(_models.User, ["read", "update", "delete"], _models.Subscription, (user, subscription) => {
  if (!subscription) {
    return false;
  }

  // If `user` is an admin, early exit with allow.
  if (user.isAdmin) {
    return true;
  }

  // User should be able to read their subscriptions.
  return user.id === subscription.userId;
});