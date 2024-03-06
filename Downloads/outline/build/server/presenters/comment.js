"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = present;
var _user = _interopRequireDefault(require("./user"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function present(comment) {
  return {
    id: comment.id,
    data: comment.data,
    documentId: comment.documentId,
    parentCommentId: comment.parentCommentId,
    createdBy: (0, _user.default)(comment.createdBy),
    createdById: comment.createdById,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt
  };
}