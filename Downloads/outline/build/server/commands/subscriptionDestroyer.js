"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = subscriptionDestroyer;
var _models = require("./../models");
/**
 * This command destroys a user subscription to a document so they will no
 * longer receive notifications.
 *
 * @returns The subscription that was destroyed
 */
async function subscriptionDestroyer(_ref) {
  let {
    user,
    subscription,
    ip,
    transaction
  } = _ref;
  await subscription.destroy({
    transaction
  });
  await _models.Event.create({
    name: "subscriptions.delete",
    teamId: user.teamId,
    modelId: subscription.id,
    actorId: user.id,
    userId: user.id,
    documentId: subscription.documentId,
    ip
  }, {
    transaction
  });
  return subscription;
}