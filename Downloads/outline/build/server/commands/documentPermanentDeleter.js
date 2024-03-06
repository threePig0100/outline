"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = documentPermanentDeleter;
var _uniq = _interopRequireDefault(require("lodash/uniq"));
var _sequelize = require("sequelize");
var _Logger = _interopRequireDefault(require("./../logging/Logger"));
var _models = require("./../models");
var _DeleteAttachmentTask = _interopRequireDefault(require("./../queues/tasks/DeleteAttachmentTask"));
var _database = require("./../storage/database");
var _parseAttachmentIds = _interopRequireDefault(require("./../utils/parseAttachmentIds"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
async function documentPermanentDeleter(documents) {
  const activeDocument = documents.find(doc => !doc.deletedAt);
  if (activeDocument) {
    throw new Error("Cannot permanently delete ".concat(activeDocument.id, " document. Please delete it and try again."));
  }
  const query = "\n    SELECT COUNT(id)\n    FROM documents\n    WHERE \"searchVector\" @@ to_tsquery('english', :query) AND\n    \"teamId\" = :teamId AND\n    \"id\" != :documentId\n  ";
  for (const document of documents) {
    // Find any attachments that are referenced in the text content
    const attachmentIdsInText = (0, _parseAttachmentIds.default)(document.text);

    // Find any attachments that were originally uploaded to this document
    const attachmentIdsForDocument = (await _models.Attachment.findAll({
      attributes: ["id"],
      where: {
        teamId: document.teamId,
        documentId: document.id
      }
    })).map(attachment => attachment.id);
    const attachmentIds = (0, _uniq.default)([...attachmentIdsInText, ...attachmentIdsForDocument]);
    await Promise.all(attachmentIds.map(async attachmentId => {
      // Check if the attachment is referenced in any other documents – this
      // is needed as it's easy to copy and paste content between documents.
      // An uploaded attachment may end up referenced in multiple documents.
      const [{
        count
      }] = await _database.sequelize.query(query, {
        type: _sequelize.QueryTypes.SELECT,
        replacements: {
          documentId: document.id,
          teamId: document.teamId,
          query: attachmentId
        }
      });

      // If the attachment is not referenced in any other documents then
      // delete it from the database and the storage provider.
      if (parseInt(count) === 0) {
        _Logger.default.info("commands", "Attachment ".concat(attachmentId, " scheduled for deletion"));
        await _DeleteAttachmentTask.default.schedule({
          attachmentId,
          teamId: document.teamId
        });
      }
    }));
  }
  return _models.Document.scope("withDrafts").destroy({
    where: {
      id: documents.map(document => document.id)
    },
    force: true
  });
}