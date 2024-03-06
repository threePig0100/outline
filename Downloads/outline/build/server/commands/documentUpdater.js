"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = documentUpdater;
var _models = require("./../models");
var _DocumentHelper = _interopRequireDefault(require("./../models/helpers/DocumentHelper"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * This command updates document properties. To update collaborative text state
 * use documentCollaborativeUpdater.
 *
 * @param Props The properties of the document to update
 * @returns Document The updated document
 */
async function documentUpdater(_ref) {
  let {
    user,
    document,
    title,
    emoji,
    text,
    editorVersion,
    templateId,
    fullWidth,
    insightsEnabled,
    append,
    publish,
    collectionId,
    done,
    transaction,
    ip
  } = _ref;
  const previousTitle = document.title;
  const cId = collectionId || document.collectionId;
  if (title !== undefined) {
    document.title = title.trim();
  }
  if (emoji !== undefined) {
    document.emoji = emoji;
  }
  if (editorVersion) {
    document.editorVersion = editorVersion;
  }
  if (templateId) {
    document.templateId = templateId;
  }
  if (fullWidth !== undefined) {
    document.fullWidth = fullWidth;
  }
  if (insightsEnabled !== undefined) {
    document.insightsEnabled = insightsEnabled;
  }
  if (text !== undefined) {
    document = _DocumentHelper.default.applyMarkdownToDocument(document, text, append);
  }
  const changed = document.changed();
  const event = {
    name: "documents.update",
    documentId: document.id,
    collectionId: cId,
    teamId: document.teamId,
    actorId: user.id,
    data: {
      done,
      title: document.title
    },
    ip
  };
  if (publish && cId) {
    if (!document.collectionId) {
      document.collectionId = cId;
    }
    await document.publish(user.id, cId, {
      transaction
    });
    await _models.Event.create({
      ...event,
      name: "documents.publish"
    }, {
      transaction
    });
  } else if (changed) {
    document.lastModifiedById = user.id;
    await document.save({
      transaction
    });
    await _models.Event.create(event, {
      transaction
    });
  } else if (done) {
    await _models.Event.schedule(event);
  }
  if (document.title !== previousTitle) {
    await _models.Event.schedule({
      name: "documents.title_change",
      documentId: document.id,
      collectionId: cId,
      teamId: document.teamId,
      actorId: user.id,
      data: {
        previousTitle,
        title: document.title
      },
      ip
    });
  }
  return document;
}