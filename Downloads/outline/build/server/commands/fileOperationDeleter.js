"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fileOperationDeleter;
var _models = require("./../models");
async function fileOperationDeleter(_ref) {
  let {
    fileOperation,
    user,
    ip,
    transaction
  } = _ref;
  await fileOperation.destroy({
    transaction
  });
  await _models.Event.create({
    name: "fileOperations.delete",
    teamId: user.teamId,
    actorId: user.id,
    modelId: fileOperation.id,
    ip
  }, {
    transaction
  });
}