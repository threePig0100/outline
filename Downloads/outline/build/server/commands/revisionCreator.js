"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = revisionCreator;
var _models = require("./../models");
var _database = require("./../storage/database");
async function revisionCreator(_ref) {
  let {
    document,
    user,
    ip
  } = _ref;
  return _database.sequelize.transaction(async transaction => {
    const revision = await _models.Revision.createFromDocument(document, {
      transaction
    });
    await _models.Event.create({
      name: "revisions.create",
      documentId: document.id,
      collectionId: document.collectionId,
      modelId: revision.id,
      teamId: document.teamId,
      actorId: user.id,
      createdAt: document.updatedAt,
      ip: ip || user.lastActiveIp
    }, {
      transaction
    });
    return revision;
  });
}