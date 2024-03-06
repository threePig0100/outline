"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = presentCollectionGroupMembership;
function presentCollectionGroupMembership(membership) {
  return {
    id: membership.id,
    groupId: membership.groupId,
    collectionId: membership.collectionId,
    permission: membership.permission
  };
}