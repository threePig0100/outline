"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSubscriptionsForDocument = void 0;
exports.default = subscriptionCreator;
var _models = require("./../models");
var _database = require("./../storage/database");
/**
 * This command creates a subscription of a user to a document.
 *
 * @returns The subscription that was created
 */
async function subscriptionCreator(_ref) {
  let {
    user,
    documentId,
    event,
    ip,
    resubscribe = true,
    transaction
  } = _ref;
  const [subscription, created] = await _models.Subscription.findOrCreate({
    where: {
      userId: user.id,
      documentId,
      event
    },
    transaction,
    // Previous subscriptions are soft-deleted, we want to know about them here
    paranoid: false
  });

  // If the subscription was deleted, then just restore the existing row.
  if (subscription.deletedAt && resubscribe) {
    await subscription.restore({
      transaction
    });
    await _models.Event.create({
      name: "subscriptions.create",
      teamId: user.teamId,
      modelId: subscription.id,
      actorId: user.id,
      userId: user.id,
      documentId,
      ip
    }, {
      transaction
    });
  }
  if (created) {
    await _models.Event.create({
      name: "subscriptions.create",
      teamId: user.teamId,
      modelId: subscription.id,
      actorId: user.id,
      userId: user.id,
      documentId,
      ip
    }, {
      transaction
    });
  }
  return subscription;
}

/**
 * Create any new subscriptions that might be missing for collaborators in the
 * document on publish and revision creation. This does mean that there is a
 * short period of time where the user is not subscribed after editing until a
 * revision is created.
 *
 * @param document The document to create subscriptions for
 * @param event The event that triggered the subscription creation
 */
const createSubscriptionsForDocument = async (document, event) => {
  await _database.sequelize.transaction(async transaction => {
    const users = await document.collaborators({
      transaction
    });
    for (const user of users) {
      await subscriptionCreator({
        user,
        documentId: document.id,
        event: "documents.update",
        resubscribe: false,
        transaction,
        ip: event.ip
      });
    }
  });
};
exports.createSubscriptionsForDocument = createSubscriptionsForDocument;