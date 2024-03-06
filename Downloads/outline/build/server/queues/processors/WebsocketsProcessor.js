"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _dateFns = require("date-fns");
var _sequelize = require("sequelize");
var _models = require("./../../models");
var _presenters = require("./../../presenters");
var _notification = _interopRequireDefault(require("./../../presenters/notification"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class WebsocketsProcessor {
  async perform(event, socketio) {
    switch (event.name) {
      case "documents.publish":
      case "documents.unpublish":
      case "documents.restore":
      case "documents.unarchive":
        {
          const document = await _models.Document.findByPk(event.documentId, {
            paranoid: false
          });
          if (!document) {
            return;
          }
          const channels = await this.getDocumentEventChannels(event, document);
          return socketio.to(channels).emit("entities", {
            event: event.name,
            documentIds: [{
              id: document.id,
              updatedAt: document.updatedAt
            }],
            collectionIds: [{
              id: document.collectionId
            }]
          });
        }
      case "documents.permanent_delete":
        {
          return socketio.to("collection-".concat(event.collectionId)).emit(event.name, {
            modelId: event.documentId
          });
        }
      case "documents.archive":
      case "documents.delete":
      case "documents.update":
        {
          const document = await _models.Document.findByPk(event.documentId, {
            paranoid: false
          });
          if (!document) {
            return;
          }
          const data = await (0, _presenters.presentDocument)(document);
          const channels = await this.getDocumentEventChannels(event, document);
          return socketio.to(channels).emit(event.name, data);
        }
      case "documents.create":
        {
          const document = await _models.Document.findByPk(event.documentId);
          if (!document) {
            return;
          }
          const channels = await this.getDocumentEventChannels(event, document);
          return socketio.to(channels).emit("entities", {
            event: event.name,
            documentIds: [{
              id: document.id,
              updatedAt: document.updatedAt
            }],
            collectionIds: [{
              id: document.collectionId
            }]
          });
        }
      case "documents.move":
        {
          const documents = await _models.Document.findAll({
            where: {
              id: event.data.documentIds
            },
            paranoid: false
          });
          documents.forEach(document => {
            socketio.to("collection-".concat(document.collectionId)).emit("entities", {
              event: event.name,
              documentIds: [{
                id: document.id,
                updatedAt: document.updatedAt
              }]
            });
          });
          event.data.collectionIds.forEach(collectionId => {
            socketio.to("collection-".concat(collectionId)).emit("entities", {
              event: event.name,
              collectionIds: [{
                id: collectionId
              }]
            });
          });
          return;
        }
      case "documents.add_user":
        {
          const [document, membership] = await Promise.all([_models.Document.findByPk(event.documentId), _models.UserMembership.findByPk(event.modelId)]);
          if (!document || !membership) {
            return;
          }
          const channels = await this.getDocumentEventChannels(event, document);
          socketio.to(channels).emit(event.name, (0, _presenters.presentMembership)(membership));
          return;
        }
      case "documents.remove_user":
        {
          const document = await _models.Document.findByPk(event.documentId);
          if (!document) {
            return;
          }
          const channels = await this.getDocumentEventChannels(event, document);
          socketio.to([...channels, "user-".concat(event.userId)]).emit(event.name, {
            id: event.modelId,
            userId: event.userId,
            documentId: event.documentId
          });
          return;
        }
      case "collections.create":
        {
          const collection = await _models.Collection.findByPk(event.collectionId, {
            paranoid: false
          });
          if (!collection) {
            return;
          }
          socketio.to(collection.permission ? "team-".concat(collection.teamId) : "user-".concat(collection.createdById)).emit(event.name, (0, _presenters.presentCollection)(collection));
          return socketio.to(collection.permission ? "team-".concat(collection.teamId) : "user-".concat(collection.createdById)).emit("join", {
            event: event.name,
            collectionId: collection.id
          });
        }
      case "collections.update":
        {
          const collection = await _models.Collection.findByPk(event.collectionId, {
            paranoid: false
          });
          if (!collection) {
            return;
          }
          return socketio.to(collection.permission ? "collection-".concat(event.collectionId) : "team-".concat(collection.teamId)).emit(event.name, (0, _presenters.presentCollection)(collection));
        }
      case "collections.delete":
        {
          const collection = await _models.Collection.findByPk(event.collectionId, {
            paranoid: false
          });
          if (!collection) {
            return;
          }
          return socketio.to(collection.permission ? "collection-".concat(event.collectionId) : "team-".concat(collection.teamId)).emit(event.name, {
            modelId: event.collectionId
          });
        }
      case "collections.move":
        {
          return socketio.to("collection-".concat(event.collectionId)).emit("collections.update_index", {
            collectionId: event.collectionId,
            index: event.data.index
          });
        }
      case "collections.add_user":
        {
          // the user being added isn't yet in the websocket channel for the collection
          // so they need to be notified separately
          socketio.to("user-".concat(event.userId)).emit(event.name, {
            event: event.name,
            userId: event.userId,
            collectionId: event.collectionId
          });
          // let everyone with access to the collection know a user was added
          socketio.to("collection-".concat(event.collectionId)).emit(event.name, {
            event: event.name,
            userId: event.userId,
            collectionId: event.collectionId
          });
          // tell any user clients to connect to the websocket channel for the collection
          return socketio.to("user-".concat(event.userId)).emit("join", {
            event: event.name,
            collectionId: event.collectionId
          });
        }
      case "collections.remove_user":
        {
          const membershipUserIds = await _models.Collection.membershipUserIds(event.collectionId);
          if (membershipUserIds.includes(event.userId)) {
            // Even though we just removed a user from the collection
            // the user still has access through some means
            // treat this like an add, so that the client re-syncs policies
            socketio.to("user-".concat(event.userId)).emit("collections.add_user", {
              event: "collections.add_user",
              userId: event.userId,
              collectionId: event.collectionId
            });
          } else {
            // let everyone with access to the collection know a user was removed
            socketio.to("collection-".concat(event.collectionId)).emit("collections.remove_user", {
              event: event.name,
              userId: event.userId,
              collectionId: event.collectionId
            });
            // tell any user clients to disconnect from the websocket channel for the collection
            socketio.to("user-".concat(event.userId)).emit("leave", {
              event: event.name,
              collectionId: event.collectionId
            });
          }
          return;
        }
      case "collections.add_group":
        {
          const group = await _models.Group.findByPk(event.modelId);
          if (!group) {
            return;
          }

          // the users being added are not yet in the websocket channel for the collection
          // so they need to be notified separately
          for (const groupMembership of group.groupMemberships) {
            socketio.to("user-".concat(groupMembership.userId)).emit("collections.add_user", {
              event: event.name,
              userId: groupMembership.userId,
              collectionId: event.collectionId
            });
            // tell any user clients to connect to the websocket channel for the collection
            socketio.to("user-".concat(groupMembership.userId)).emit("join", {
              event: event.name,
              collectionId: event.collectionId
            });
          }
          return;
        }
      case "collections.remove_group":
        {
          const group = await _models.Group.findByPk(event.modelId);
          if (!group) {
            return;
          }
          const membershipUserIds = await _models.Collection.membershipUserIds(event.collectionId);
          for (const groupMembership of group.groupMemberships) {
            if (membershipUserIds.includes(groupMembership.userId)) {
              // the user still has access through some means...
              // treat this like an add, so that the client re-syncs policies
              socketio.to("user-".concat(groupMembership.userId)).emit("collections.add_user", {
                event: event.name,
                userId: groupMembership.userId,
                collectionId: event.collectionId
              });
            } else {
              // let users in the channel know they were removed
              socketio.to("user-".concat(groupMembership.userId)).emit("collections.remove_user", {
                event: event.name,
                userId: groupMembership.userId,
                collectionId: event.collectionId
              });
              // tell any user clients to disconnect to the websocket channel for the collection
              socketio.to("user-".concat(groupMembership.userId)).emit("leave", {
                event: event.name,
                collectionId: event.collectionId
              });
            }
          }
          return;
        }
      case "fileOperations.create":
      case "fileOperations.update":
        {
          const fileOperation = await _models.FileOperation.findByPk(event.modelId);
          if (!fileOperation) {
            return;
          }
          return socketio.to("user-".concat(event.actorId)).emit(event.name, (0, _presenters.presentFileOperation)(fileOperation));
        }
      case "pins.create":
      case "pins.update":
        {
          const pin = await _models.Pin.findByPk(event.modelId);
          if (!pin) {
            return;
          }
          return socketio.to(pin.collectionId ? "collection-".concat(pin.collectionId) : "team-".concat(pin.teamId)).emit(event.name, (0, _presenters.presentPin)(pin));
        }
      case "pins.delete":
        {
          return socketio.to(event.collectionId ? "collection-".concat(event.collectionId) : "team-".concat(event.teamId)).emit(event.name, {
            modelId: event.modelId
          });
        }
      case "comments.create":
      case "comments.update":
        {
          const comment = await _models.Comment.findByPk(event.modelId, {
            include: [{
              model: _models.Document.scope(["withoutState", "withDrafts"]),
              as: "document",
              required: true
            }]
          });
          if (!comment) {
            return;
          }
          const channels = await this.getDocumentEventChannels(event, comment.document);
          return socketio.to(channels).emit(event.name, (0, _presenters.presentComment)(comment));
        }
      case "comments.delete":
        {
          const comment = await _models.Comment.findByPk(event.modelId, {
            include: [{
              model: _models.Document.scope(["withoutState", "withDrafts"]),
              as: "document",
              required: true
            }]
          });
          if (!comment) {
            return;
          }
          const channels = await this.getDocumentEventChannels(event, comment.document);
          return socketio.to(channels).emit(event.name, {
            modelId: event.modelId
          });
        }
      case "notifications.create":
      case "notifications.update":
        {
          const notification = await _models.Notification.findByPk(event.modelId);
          if (!notification) {
            return;
          }
          const data = await (0, _notification.default)(notification);
          return socketio.to("user-".concat(event.userId)).emit(event.name, data);
        }
      case "stars.create":
      case "stars.update":
        {
          const star = await _models.Star.findByPk(event.modelId);
          if (!star) {
            return;
          }
          return socketio.to("user-".concat(event.userId)).emit(event.name, (0, _presenters.presentStar)(star));
        }
      case "stars.delete":
        {
          return socketio.to("user-".concat(event.userId)).emit(event.name, {
            modelId: event.modelId
          });
        }
      case "groups.create":
      case "groups.update":
        {
          const group = await _models.Group.findByPk(event.modelId, {
            paranoid: false
          });
          if (!group) {
            return;
          }
          return socketio.to("team-".concat(group.teamId)).emit(event.name, (0, _presenters.presentGroup)(group));
        }
      case "groups.add_user":
        {
          // do an add user for every collection that the group is a part of
          const collectionGroupMemberships = await _models.GroupPermission.scope("withCollection").findAll({
            where: {
              groupId: event.modelId
            }
          });
          for (const collectionGroup of collectionGroupMemberships) {
            // the user being added isn't yet in the websocket channel for the collection
            // so they need to be notified separately
            socketio.to("user-".concat(event.userId)).emit("collections.add_user", {
              event: event.name,
              userId: event.userId,
              collectionId: collectionGroup.collectionId
            });
            // let everyone with access to the collection know a user was added
            socketio.to("collection-".concat(collectionGroup.collectionId)).emit("collections.add_user", {
              event: event.name,
              userId: event.userId,
              collectionId: collectionGroup.collectionId
            });
            // tell any user clients to connect to the websocket channel for the collection
            return socketio.to("user-".concat(event.userId)).emit("join", {
              event: event.name,
              collectionId: collectionGroup.collectionId
            });
          }
          return;
        }
      case "groups.remove_user":
        {
          const collectionGroupMemberships = await _models.GroupPermission.scope("withCollection").findAll({
            where: {
              groupId: event.modelId
            }
          });
          for (const collectionGroup of collectionGroupMemberships) {
            // if the user has any memberships remaining on the collection
            // we need to emit add instead of remove
            const collection = collectionGroup.collectionId ? await _models.Collection.scope({
              method: ["withMembership", event.userId]
            }).findByPk(collectionGroup.collectionId) : null;
            if (!collection) {
              continue;
            }
            const hasMemberships = collection.memberships.length > 0 || collection.collectionGroupMemberships.length > 0;
            if (hasMemberships) {
              // the user still has access through some means...
              // treat this like an add, so that the client re-syncs policies
              socketio.to("user-".concat(event.userId)).emit("collections.add_user", {
                event: event.name,
                userId: event.userId,
                collectionId: collectionGroup.collectionId
              });
            } else {
              // let everyone with access to the collection know a user was removed
              socketio.to("collection-".concat(collectionGroup.collectionId)).emit("collections.remove_user", {
                event: event.name,
                userId: event.userId,
                collectionId: collectionGroup.collectionId
              });
              // tell any user clients to disconnect from the websocket channel for the collection
              socketio.to("user-".concat(event.userId)).emit("leave", {
                event: event.name,
                collectionId: collectionGroup.collectionId
              });
            }
          }
          return;
        }
      case "groups.delete":
        {
          socketio.to("team-".concat(event.teamId)).emit(event.name, {
            modelId: event.modelId
          });

          // we get users and collection relations that were just severed as a
          // result of the group deletion since there are cascading deletes, we
          // approximate this by looking for the recently deleted items in the
          // GroupUser and CollectionGroup tables
          const groupUsers = await _models.GroupUser.findAll({
            paranoid: false,
            where: {
              groupId: event.modelId,
              deletedAt: {
                [_sequelize.Op.gt]: (0, _dateFns.subHours)(new Date(), 1)
              }
            }
          });
          const collectionGroupMemberships = await _models.GroupPermission.scope("withCollection").findAll({
            paranoid: false,
            where: {
              groupId: event.modelId,
              deletedAt: {
                [_sequelize.Op.gt]: (0, _dateFns.subHours)(new Date(), 1)
              }
            }
          });
          for (const collectionGroup of collectionGroupMemberships) {
            const membershipUserIds = collectionGroup.collectionId ? await _models.Collection.membershipUserIds(collectionGroup.collectionId) : [];
            for (const groupUser of groupUsers) {
              if (membershipUserIds.includes(groupUser.userId)) {
                // the user still has access through some means...
                // treat this like an add, so that the client re-syncs policies
                socketio.to("user-".concat(groupUser.userId)).emit("collections.add_user", {
                  event: event.name,
                  userId: groupUser.userId,
                  collectionId: collectionGroup.collectionId
                });
              } else {
                // let everyone with access to the collection know a user was removed
                socketio.to("collection-".concat(collectionGroup.collectionId)).emit("collections.remove_user", {
                  event: event.name,
                  userId: groupUser.userId,
                  collectionId: collectionGroup.collectionId
                });
                // tell any user clients to disconnect from the websocket channel for the collection
                socketio.to("user-".concat(groupUser.userId)).emit("leave", {
                  event: event.name,
                  collectionId: collectionGroup.collectionId
                });
              }
            }
          }
          return;
        }
      case "subscriptions.create":
        {
          const subscription = await _models.Subscription.findByPk(event.modelId);
          if (!subscription) {
            return;
          }
          return socketio.to("user-".concat(event.userId)).emit(event.name, (0, _presenters.presentSubscription)(subscription));
        }
      case "subscriptions.delete":
        {
          return socketio.to("user-".concat(event.userId)).emit(event.name, {
            modelId: event.modelId
          });
        }
      case "teams.update":
        {
          const team = await _models.Team.scope("withDomains").findByPk(event.teamId);
          if (!team) {
            return;
          }
          return socketio.to("team-".concat(event.teamId)).emit(event.name, (0, _presenters.presentTeam)(team));
        }
      case "users.update":
        {
          const user = await _models.User.findByPk(event.userId);
          if (!user) {
            return;
          }
          socketio.to("user-".concat(event.userId)).emit(event.name, (0, _presenters.presentUser)(user, {
            includeDetails: true
          }));
          socketio.to("team-".concat(user.teamId)).emit(event.name, (0, _presenters.presentUser)(user));
          return;
        }
      case "users.demote":
        {
          return socketio.to("user-".concat(event.userId)).emit(event.name, {
            id: event.userId
          });
        }
      case "userMemberships.update":
        {
          return socketio.to("user-".concat(event.userId)).emit(event.name, {
            id: event.modelId,
            ...event.data
          });
        }
      default:
        return;
    }
  }
  async getDocumentEventChannels(event, document) {
    const channels = [];
    if (event.actorId) {
      channels.push("user-".concat(event.actorId));
    }
    if (document.publishedAt) {
      channels.push("collection-".concat(document.collectionId));
    }
    const memberships = await _models.UserMembership.findAll({
      where: {
        documentId: document.id
      }
    });
    for (const membership of memberships) {
      channels.push("user-".concat(membership.userId));
    }
    return channels;
  }
}
exports.default = WebsocketsProcessor;