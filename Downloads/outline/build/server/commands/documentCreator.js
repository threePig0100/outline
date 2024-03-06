"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = documentCreator;
var _models = require("./../models");
var _TextHelper = _interopRequireDefault(require("./../models/helpers/TextHelper"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
async function documentCreator(_ref) {
  let {
    title = "",
    text = "",
    emoji,
    state,
    id,
    urlId,
    publish,
    collectionId,
    parentDocumentId,
    template,
    templateDocument,
    fullWidth,
    importId,
    createdAt,
    // allows override for import
    updatedAt,
    user,
    editorVersion,
    publishedAt,
    sourceMetadata,
    ip,
    transaction
  } = _ref;
  const templateId = templateDocument ? templateDocument.id : undefined;
  if (urlId) {
    const existing = await _models.Document.unscoped().findOne({
      attributes: ["id"],
      transaction,
      where: {
        urlId
      }
    });
    if (existing) {
      urlId = undefined;
    }
  }
  const document = await _models.Document.create({
    id,
    urlId,
    parentDocumentId,
    editorVersion,
    collectionId,
    teamId: user.teamId,
    createdAt,
    updatedAt: updatedAt !== null && updatedAt !== void 0 ? updatedAt : createdAt,
    lastModifiedById: user.id,
    createdById: user.id,
    template,
    templateId,
    publishedAt,
    importId,
    sourceMetadata,
    fullWidth: templateDocument ? templateDocument.fullWidth : fullWidth,
    emoji: templateDocument ? templateDocument.emoji : emoji,
    title: _TextHelper.default.replaceTemplateVariables(templateDocument ? templateDocument.title : title, user),
    text: await _TextHelper.default.replaceImagesWithAttachments(_TextHelper.default.replaceTemplateVariables(templateDocument ? templateDocument.text : text, user), user, ip, transaction),
    state
  }, {
    silent: !!createdAt,
    transaction
  });
  await _models.Event.create({
    name: "documents.create",
    documentId: document.id,
    collectionId: document.collectionId,
    teamId: document.teamId,
    actorId: user.id,
    data: {
      source: importId ? "import" : undefined,
      title: document.title,
      templateId
    },
    ip
  }, {
    transaction
  });
  if (publish) {
    if (!collectionId) {
      throw new Error("Collection ID is required to publish");
    }
    await document.publish(user.id, collectionId, {
      transaction
    });
    await _models.Event.create({
      name: "documents.publish",
      documentId: document.id,
      collectionId: document.collectionId,
      teamId: document.teamId,
      actorId: user.id,
      data: {
        source: importId ? "import" : undefined,
        title: document.title
      },
      ip
    }, {
      transaction
    });
  }

  // reload to get all of the data needed to present (user, collection etc)
  // we need to specify publishedAt to bypass default scope that only returns
  // published documents
  return await _models.Document.scope(["withDrafts", {
    method: ["withMembership", user.id]
  }]).findOne({
    where: {
      id: document.id,
      publishedAt: document.publishedAt
    },
    rejectOnEmpty: true,
    transaction
  });
}