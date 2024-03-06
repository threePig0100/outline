"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = attachmentCreator;
var _uuid = require("uuid");
var _models = require("./../models");
var _AttachmentHelper = _interopRequireDefault(require("./../models/helpers/AttachmentHelper"));
var _files = _interopRequireDefault(require("./../storage/files"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
async function attachmentCreator(_ref) {
  let {
    id,
    name,
    user,
    source,
    preset,
    ip,
    transaction,
    ...rest
  } = _ref;
  const acl = _AttachmentHelper.default.presetToAcl(preset);
  const key = _AttachmentHelper.default.getKey({
    acl,
    id: (0, _uuid.v4)(),
    name,
    userId: user.id
  });
  let attachment;
  if ("url" in rest) {
    const {
      url
    } = rest;
    const res = await _files.default.storeFromUrl(url, key, acl);
    if (!res) {
      return;
    }
    attachment = await _models.Attachment.create({
      id,
      key,
      acl,
      size: res.contentLength,
      contentType: res.contentType,
      teamId: user.teamId,
      userId: user.id
    }, {
      transaction
    });
  } else {
    const {
      buffer,
      type
    } = rest;
    await _files.default.store({
      body: buffer,
      contentType: type,
      contentLength: buffer.length,
      key,
      acl
    });
    attachment = await _models.Attachment.create({
      id,
      key,
      acl,
      size: buffer.length,
      contentType: type,
      teamId: user.teamId,
      userId: user.id
    }, {
      transaction
    });
  }
  await _models.Event.create({
    name: "attachments.create",
    data: {
      name,
      source
    },
    modelId: attachment.id,
    teamId: user.teamId,
    actorId: user.id,
    ip
  }, {
    transaction
  });
  return attachment;
}