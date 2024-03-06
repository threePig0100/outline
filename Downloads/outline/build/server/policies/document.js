"use strict";

var _invariant = _interopRequireDefault(require("invariant"));
var _some = _interopRequireDefault(require("lodash/some"));
var _types = require("./../../shared/types");
var _models = require("./../models");
var _cancan = require("./cancan");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
(0, _cancan.allow)(_models.User, "createDocument", _models.Team, (user, team) => {
  if (!team || user.isViewer || user.teamId !== team.id) {
    return false;
  }
  return true;
});
(0, _cancan.allow)(_models.User, "read", _models.Document, (user, document) => {
  if (!document) {
    return false;
  }
  if (includesMembership(document, [_types.DocumentPermission.Read, _types.DocumentPermission.ReadWrite])) {
    return true;
  }

  // existence of collection option is not required here to account for share tokens
  if (document.collection && (0, _cancan._cannot)(user, "readDocument", document.collection)) {
    return false;
  }
  if (document.isDraft) {
    return user.id === document.createdById;
  }
  return user.teamId === document.teamId;
});
(0, _cancan.allow)(_models.User, "download", _models.Document, (user, document) => {
  if (!document) {
    return false;
  }
  if (user.isViewer && !user.team.getPreference(_types.TeamPreference.ViewersCanExport)) {
    return false;
  }
  if (includesMembership(document, [_types.DocumentPermission.Read, _types.DocumentPermission.ReadWrite])) {
    return true;
  }

  // existence of collection option is not required here to account for share tokens
  if (document.collection && (0, _cancan._cannot)(user, "readDocument", document.collection)) {
    return false;
  }
  if (document.isDraft) {
    return user.id === document.createdById;
  }
  return user.teamId === document.teamId;
});
(0, _cancan.allow)(_models.User, "comment", _models.Document, (user, document) => {
  if (!document || !document.isActive || document.template) {
    return false;
  }
  if (includesMembership(document, [_types.DocumentPermission.Read, _types.DocumentPermission.ReadWrite])) {
    return true;
  }
  if (document.collectionId) {
    (0, _invariant.default)(document.collection, "collection is missing, did you forget to include in the query scope?");
    if ((0, _cancan._can)(user, "readDocument", document.collection)) {
      return true;
    }
  }
  return user.id === document.createdById;
});
(0, _cancan.allow)(_models.User, ["star", "unstar"], _models.Document, (user, document) => {
  if (!document || !document.isActive || document.template) {
    return false;
  }
  if (includesMembership(document, [_types.DocumentPermission.Read, _types.DocumentPermission.ReadWrite])) {
    return true;
  }
  if (document.collectionId) {
    (0, _invariant.default)(document.collection, "collection is missing, did you forget to include in the query scope?");
    if ((0, _cancan._cannot)(user, "readDocument", document.collection)) {
      return false;
    }
  }
  return user.teamId === document.teamId;
});
(0, _cancan.allow)(_models.User, "share", _models.Document, (user, document) => {
  if (!document || document.archivedAt || document.deletedAt || document.template) {
    return false;
  }
  if (document.collectionId) {
    (0, _invariant.default)(document.collection, "collection is missing, did you forget to include in the query scope?");
    if ((0, _cancan._cannot)(user, "share", document.collection)) {
      return false;
    }
  }
  if (document.isDraft) {
    return user.id === document.createdById;
  }
  return user.teamId === document.teamId;
});
(0, _cancan.allow)(_models.User, "update", _models.Document, (user, document) => {
  if (!document || !document.isActive) {
    return false;
  }
  if (includesMembership(document, [_types.DocumentPermission.ReadWrite])) {
    return true;
  }
  if (document.collectionId) {
    (0, _invariant.default)(document.collection, "collection is missing, did you forget to include in the query scope?");
    if ((0, _cancan._cannot)(user, "updateDocument", document.collection)) {
      return false;
    }
  }
  if (document.isDraft) {
    return user.id === document.createdById;
  }
  return user.teamId === document.teamId;
});
(0, _cancan.allow)(_models.User, "publish", _models.Document, (user, document) => {
  if (!document || !document.isActive || !document.isDraft) {
    return false;
  }
  if (document.collectionId) {
    (0, _invariant.default)(document.collection, "collection is missing, did you forget to include in the query scope?");
    if ((0, _cancan._can)(user, "updateDocument", document.collection)) {
      return true;
    }
  }
  return user.id === document.createdById;
});
(0, _cancan.allow)(_models.User, ["manageUsers", "duplicate"], _models.Document, (user, document) => {
  if (!document || !document.isActive) {
    return false;
  }
  if (document.collectionId) {
    (0, _invariant.default)(document.collection, "collection is missing, did you forget to include in the query scope?");
    if ((0, _cancan._can)(user, "updateDocument", document.collection)) {
      return true;
    }
  }
  return user.id === document.createdById;
});
(0, _cancan.allow)(_models.User, "updateInsights", _models.Document, (user, document) => {
  if (!document || !document.isActive) {
    return false;
  }
  if (document.collectionId) {
    (0, _invariant.default)(document.collection, "collection is missing, did you forget to include in the query scope?");
    if ((0, _cancan._can)(user, "update", document.collection)) {
      return true;
    }
  }
  return user.id === document.createdById;
});
(0, _cancan.allow)(_models.User, "createChildDocument", _models.Document, (user, document) => {
  if (!document || !document.isActive || document.isDraft || document.template) {
    return false;
  }
  (0, _invariant.default)(document.collection, "collection is missing, did you forget to include in the query scope?");
  if ((0, _cancan._can)(user, "updateDocument", document.collection)) {
    return true;
  }
  return user.id === document.createdById;
});
(0, _cancan.allow)(_models.User, "move", _models.Document, (user, document) => {
  if (!document || !document.isActive) {
    return false;
  }
  if (document.collection && (0, _cancan._can)(user, "updateDocument", document.collection)) {
    return true;
  }
  return user.id === document.createdById;
});
(0, _cancan.allow)(_models.User, "pin", _models.Document, (user, document) => {
  if (!document || !document.isActive || document.isDraft || document.template) {
    return false;
  }
  (0, _invariant.default)(document.collection, "collection is missing, did you forget to include in the query scope?");
  if ((0, _cancan._can)(user, "update", document.collection)) {
    return true;
  }
  return user.id === document.createdById;
});
(0, _cancan.allow)(_models.User, "unpin", _models.Document, (user, document) => {
  if (!document || document.isDraft || document.template) {
    return false;
  }
  (0, _invariant.default)(document.collection, "collection is missing, did you forget to include in the query scope?");
  if ((0, _cancan._can)(user, "update", document.collection)) {
    return true;
  }
  return user.id === document.createdById;
});
(0, _cancan.allow)(_models.User, ["subscribe", "unsubscribe"], _models.Document, (user, document) => {
  if (!document || !document.isActive || document.isDraft || document.template) {
    return false;
  }
  if (includesMembership(document, [_types.DocumentPermission.Read, _types.DocumentPermission.ReadWrite])) {
    return true;
  }
  (0, _invariant.default)(document.collection, "collection is missing, did you forget to include in the query scope?");
  if ((0, _cancan._can)(user, "readDocument", document.collection)) {
    return true;
  }
  return user.id === document.createdById;
});
(0, _cancan.allow)(_models.User, "pinToHome", _models.Document, (user, document) => {
  if (!document || !document.isActive || document.isDraft || document.template) {
    return false;
  }
  return user.teamId === document.teamId && user.isAdmin;
});
(0, _cancan.allow)(_models.User, "delete", _models.Document, (user, document) => {
  if (!document || document.deletedAt || user.isViewer) {
    return false;
  }

  // allow deleting document without a collection
  if (document.collection && (0, _cancan._cannot)(user, "deleteDocument", document.collection)) {
    return false;
  }

  // unpublished drafts can always be deleted by their owner
  if (document.isDraft) {
    return user.id === document.createdById;
  }
  return user.teamId === document.teamId;
});
(0, _cancan.allow)(_models.User, "permanentDelete", _models.Document, (user, document) => {
  if (!document || !document.deletedAt || user.isViewer) {
    return false;
  }

  // allow deleting document without a collection
  if (document.collection && (0, _cancan._cannot)(user, "updateDocument", document.collection)) {
    return false;
  }

  // unpublished drafts can always be deleted by their owner
  if (document.isDraft && user.id === document.createdById) {
    return true;
  }
  return user.teamId === document.teamId && user.isAdmin;
});
(0, _cancan.allow)(_models.User, "restore", _models.Document, (user, document) => {
  if (!document || !document.deletedAt) {
    return false;
  }
  if (document.collection && (0, _cancan._cannot)(user, "updateDocument", document.collection)) {
    return false;
  }

  // unpublished drafts can always be restored by their owner
  if (document.isDraft && user.id === document.createdById) {
    return true;
  }
  return user.teamId === document.teamId;
});
(0, _cancan.allow)(_models.User, "archive", _models.Document, (user, document) => {
  if (!document || !document.isActive || document.isDraft || document.template) {
    return false;
  }
  (0, _invariant.default)(document.collection, "collection is missing, did you forget to include in the query scope?");
  if ((0, _cancan._cannot)(user, "updateDocument", document.collection)) {
    return false;
  }
  return user.teamId === document.teamId;
});
(0, _cancan.allow)(_models.User, "unarchive", _models.Document, (user, document) => {
  if (!document || !document.archivedAt || document.deletedAt) {
    return false;
  }
  (0, _invariant.default)(document.collection, "collection is missing, did you forget to include in the query scope?");
  if ((0, _cancan._cannot)(user, "updateDocument", document.collection)) {
    return false;
  }
  if (document.isDraft) {
    return user.id === document.createdById;
  }
  return user.teamId === document.teamId;
});
(0, _cancan.allow)(_models.Document, "restore", _models.Revision, (document, revision) => document.id === (revision === null || revision === void 0 ? void 0 : revision.documentId));
(0, _cancan.allow)(_models.User, "unpublish", _models.Document, (user, document) => {
  if (!document || !document.isActive || document.isDraft || user.isViewer) {
    return false;
  }
  (0, _invariant.default)(document.collection, "collection is missing, did you forget to include in the query scope?");
  if ((0, _cancan._cannot)(user, "updateDocument", document.collection)) {
    return false;
  }
  return user.teamId === document.teamId;
});
function includesMembership(document, permissions) {
  (0, _invariant.default)(document.memberships, "document memberships should be preloaded, did you forget withMembership scope?");
  return (0, _some.default)(document.memberships, m => permissions.includes(m.permission));
}