"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = presentGroupMembership;
var _ = require(".");
function presentGroupMembership(membership, options) {
  return {
    id: "".concat(membership.userId, "-").concat(membership.groupId),
    userId: membership.userId,
    groupId: membership.groupId,
    user: options !== null && options !== void 0 && options.includeUser ? (0, _.presentUser)(membership.user) : undefined
  };
}