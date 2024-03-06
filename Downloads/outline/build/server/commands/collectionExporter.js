"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _uuid = require("uuid");
var _types = require("./../../shared/types");
var _tracing = require("./../logging/tracing");
var _models = require("./../models");
var _AttachmentHelper = require("./../models/helpers/AttachmentHelper");
function getKeyForFileOp(teamId, name) {
  return "".concat(_AttachmentHelper.Buckets.uploads, "/").concat(teamId, "/").concat((0, _uuid.v4)(), "/").concat(name, "-export.zip");
}
async function collectionExporter(_ref) {
  let {
    collection,
    team,
    user,
    format = _types.FileOperationFormat.MarkdownZip,
    includeAttachments = true,
    ip,
    transaction
  } = _ref;
  const collectionId = collection === null || collection === void 0 ? void 0 : collection.id;
  const key = getKeyForFileOp(user.teamId, (collection === null || collection === void 0 ? void 0 : collection.name) || team.name);
  const fileOperation = await _models.FileOperation.create({
    type: _types.FileOperationType.Export,
    state: _types.FileOperationState.Creating,
    format,
    key,
    url: null,
    size: 0,
    collectionId,
    includeAttachments,
    userId: user.id,
    teamId: user.teamId
  }, {
    transaction
  });
  await _models.Event.create({
    name: "fileOperations.create",
    teamId: user.teamId,
    actorId: user.id,
    modelId: fileOperation.id,
    collectionId,
    ip,
    data: {
      type: _types.FileOperationType.Export,
      format
    }
  }, {
    transaction
  });
  fileOperation.user = user;
  if (collection) {
    fileOperation.collection = collection;
  }
  return fileOperation;
}
var _default = exports.default = (0, _tracing.traceFunction)({
  spanName: "collectionExporter"
})(collectionExporter);