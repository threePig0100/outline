"use strict";

var _invariant = _interopRequireDefault(require("invariant"));
var _some = _interopRequireDefault(require("lodash/some"));
var _types = require("./../../shared/types");
var _models = require("./../models");
var _errors = require("../errors");
var _cancan = require("./cancan");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
(0, _cancan.allow)(_models.User, "createCollection", _models.Team, (user, team) => {
  if (!team || user.isViewer || user.teamId !== team.id) {
    return false;
  }
  if (user.isAdmin || team.memberCollectionCreate) {
    return true;
  }
  return false;
});
(0, _cancan.allow)(_models.User, "importCollection", _models.Team, (actor, team) => {
  if (!team || actor.teamId !== team.id) {
    return false;
  }
  if (actor.isAdmin) {
    return true;
  }
  throw (0, _errors.AdminRequiredError)();
});
(0, _cancan.allow)(_models.User, "move", _models.Collection, (user, collection) => {
  if (!collection || user.teamId !== collection.teamId) {
    return false;
  }
  if (collection.deletedAt) {
    return false;
  }
  if (user.isAdmin) {
    return true;
  }
  throw (0, _errors.AdminRequiredError)();
});
(0, _cancan.allow)(_models.User, "read", _models.Collection, (user, collection) => {
  if (!collection || user.teamId !== collection.teamId) {
    return false;
  }
  if (collection.isPrivate) {
    return includesMembership(collection, Object.values(_types.CollectionPermission));
  }
  return true;
});
(0, _cancan.allow)(_models.User, ["star", "unstar"], _models.Collection, (user, collection) => {
  if (!collection || user.teamId !== collection.teamId) {
    return false;
  }
  if (collection.isPrivate) {
    return includesMembership(collection, Object.values(_types.CollectionPermission));
  }
  return true;
});
(0, _cancan.allow)(_models.User, "share", _models.Collection, (user, collection) => {
  if (!collection || user.teamId !== collection.teamId) {
    return false;
  }
  if (!collection.sharing) {
    return false;
  }
  if (!collection.isPrivate && user.isAdmin) {
    return true;
  }
  if (collection.permission !== _types.CollectionPermission.ReadWrite || user.isViewer) {
    return includesMembership(collection, [_types.CollectionPermission.ReadWrite, _types.CollectionPermission.Admin]);
  }
  return true;
});
(0, _cancan.allow)(_models.User, ["readDocument", "export"], _models.Collection, (user, collection) => {
  if (!collection || user.teamId !== collection.teamId) {
    return false;
  }
  if (collection.isPrivate) {
    return includesMembership(collection, Object.values(_types.CollectionPermission));
  }
  return true;
});
(0, _cancan.allow)(_models.User, ["updateDocument", "createDocument", "deleteDocument"], _models.Collection, (user, collection) => {
  if (!collection || user.teamId !== collection.teamId) {
    return false;
  }
  if (!collection.isPrivate && user.isAdmin) {
    return true;
  }
  if (collection.permission !== _types.CollectionPermission.ReadWrite || user.isViewer) {
    return includesMembership(collection, [_types.CollectionPermission.ReadWrite, _types.CollectionPermission.Admin]);
  }
  return true;
});
(0, _cancan.allow)(_models.User, ["update", "delete"], _models.Collection, (user, collection) => {
  if (!collection || user.teamId !== collection.teamId) {
    return false;
  }
  if (user.isAdmin) {
    return true;
  }
  return includesMembership(collection, [_types.CollectionPermission.Admin]);
});
function includesMembership(collection, permissions) {
  (0, _invariant.default)(collection.memberships, "collection memberships should be preloaded, did you forget withMembership scope?");
  return (0, _some.default)([...collection.memberships, ...collection.collectionGroupMemberships], m => permissions.includes(m.permission));
}