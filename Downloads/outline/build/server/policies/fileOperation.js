"use strict";

var _types = require("./../../shared/types");
var _models = require("./../models");
var _cancan = require("./cancan");
(0, _cancan.allow)(_models.User, ["createFileOperation", "createImport", "createExport"], _models.Team, (user, team) => {
  if (!team || user.isViewer || user.teamId !== team.id) {
    return false;
  }
  return user.isAdmin;
});
(0, _cancan.allow)(_models.User, "read", _models.FileOperation, (user, fileOperation) => {
  if (!fileOperation || user.isViewer || user.teamId !== fileOperation.teamId) {
    return false;
  }
  return user.isAdmin;
});
(0, _cancan.allow)(_models.User, "delete", _models.FileOperation, (user, fileOperation) => {
  if (!fileOperation || user.isViewer || user.teamId !== fileOperation.teamId) {
    return false;
  }
  if (fileOperation.type === _types.FileOperationType.Export && fileOperation.state !== _types.FileOperationState.Complete) {
    return false;
  }
  return user.isAdmin;
});