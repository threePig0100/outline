"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = commentUpdater;
var _models = require("./../models");
var _ProsemirrorHelper = _interopRequireDefault(require("./../models/helpers/ProsemirrorHelper"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * This command updates a comment.
 *
 * @param Props The properties of the comment to update
 * @returns Comment The updated comment
 */
async function commentUpdater(_ref) {
  let {
    user,
    comment,
    data,
    resolvedBy,
    ip,
    transaction
  } = _ref;
  const mentionIdsBefore = _ProsemirrorHelper.default.parseMentions(_ProsemirrorHelper.default.toProsemirror(comment.data)).map(mention => mention.id);
  if (resolvedBy !== undefined) {
    comment.resolvedBy = resolvedBy;
  }
  if (data !== undefined) {
    comment.data = data;
  }
  const mentionsAfter = _ProsemirrorHelper.default.parseMentions(_ProsemirrorHelper.default.toProsemirror(comment.data));
  const newMentionIds = mentionsAfter.filter(mention => !mentionIdsBefore.includes(mention.id)).map(mention => mention.id);
  await comment.save({
    transaction
  });
  await _models.Event.create({
    name: "comments.update",
    modelId: comment.id,
    teamId: user.teamId,
    actorId: user.id,
    documentId: comment.documentId,
    ip,
    data: {
      newMentionIds
    }
  }, {
    transaction
  });
  return comment;
}