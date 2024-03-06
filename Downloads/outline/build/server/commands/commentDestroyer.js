"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = commentDestroyer;
var _models = require("./../models");
/**
 * This command destroys a document comment. This just removes the comment itself and
 * does not touch the document
 *
 * @param Props The properties of the comment to destroy
 * @returns void
 */
async function commentDestroyer(_ref) {
  let {
    user,
    comment,
    ip,
    transaction
  } = _ref;
  const document = await comment.$get("document", {
    transaction
  });
  await comment.destroy({
    transaction
  });

  // Also destroy any child comments
  const childComments = await _models.Comment.findAll({
    where: {
      parentCommentId: comment.id
    },
    transaction
  });
  await Promise.all(childComments.map(childComment => childComment.destroy({
    transaction
  })));
  await _models.Event.create({
    name: "comments.delete",
    modelId: comment.id,
    teamId: user.teamId,
    actorId: user.id,
    documentId: comment.documentId,
    collectionId: document === null || document === void 0 ? void 0 : document.collectionId,
    ip
  }, {
    transaction
  });
  return comment;
}