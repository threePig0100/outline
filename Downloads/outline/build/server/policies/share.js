"use strict";

var _models = require("./../models");
var _errors = require("../errors");
var _cancan = require("./cancan");
(0, _cancan.allow)(_models.User, "read", _models.Share, (user, share) => user.teamId === (share === null || share === void 0 ? void 0 : share.teamId));
(0, _cancan.allow)(_models.User, "update", _models.Share, (user, share) => {
  if (!share) {
    return false;
  }
  if (user.isViewer) {
    return false;
  }

  // only the user who can share the document publicly can update the share.
  if ((0, _cancan._cannot)(user, "share", share.document)) {
    return false;
  }
  return user.teamId === share.teamId;
});
(0, _cancan.allow)(_models.User, "revoke", _models.Share, (user, share) => {
  if (!share) {
    return false;
  }
  if (user.isViewer) {
    return false;
  }
  if (user.teamId !== share.teamId) {
    return false;
  }
  if (user.id === share.userId) {
    return true;
  }
  if (user.isAdmin) {
    return true;
  }
  throw (0, _errors.AdminRequiredError)();
});