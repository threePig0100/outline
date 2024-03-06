"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = commentCreator;
var _models = require("./../models");
/**
 * This command creates a comment inside a document.
 *
 * @param Props The properties of the comment to create
 * @returns Comment The comment that was created
 */
async function commentCreator(_ref) {
  let {
    id,
    user,
    data,
    documentId,
    parentCommentId,
    ip,
    transaction
  } = _ref;
  // TODO: Parse data to validate

  const comment = await _models.Comment.create({
    id,
    createdById: user.id,
    documentId,
    parentCommentId,
    data
  }, {
    transaction
  });
  comment.createdBy = user;
  await _models.Event.create({
    name: "comments.create",
    modelId: comment.id,
    teamId: user.teamId,
    actorId: user.id,
    documentId,
    ip
  }, {
    transaction
  });
  return comment;
}