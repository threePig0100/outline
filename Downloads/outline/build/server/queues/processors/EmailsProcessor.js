"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _types = require("./../../../shared/types");
var _time = require("./../../../shared/utils/time");
var _CollectionCreatedEmail = _interopRequireDefault(require("./../../emails/templates/CollectionCreatedEmail"));
var _CollectionSharedEmail = _interopRequireDefault(require("./../../emails/templates/CollectionSharedEmail"));
var _CommentCreatedEmail = _interopRequireDefault(require("./../../emails/templates/CommentCreatedEmail"));
var _CommentMentionedEmail = _interopRequireDefault(require("./../../emails/templates/CommentMentionedEmail"));
var _DocumentMentionedEmail = _interopRequireDefault(require("./../../emails/templates/DocumentMentionedEmail"));
var _DocumentPublishedOrUpdatedEmail = _interopRequireDefault(require("./../../emails/templates/DocumentPublishedOrUpdatedEmail"));
var _DocumentSharedEmail = _interopRequireDefault(require("./../../emails/templates/DocumentSharedEmail"));
var _models = require("./../../models");
var _BaseProcessor = _interopRequireDefault(require("./BaseProcessor"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class EmailsProcessor extends _BaseProcessor.default {
  async perform(event) {
    const notification = await _models.Notification.scope(["withTeam", "withUser", "withActor"]).findByPk(event.modelId);
    if (!notification) {
      return;
    }
    const notificationId = notification.id;
    if (notification.user.isSuspended) {
      return;
    }
    switch (notification.event) {
      case _types.NotificationEventType.UpdateDocument:
      case _types.NotificationEventType.PublishDocument:
        {
          // No need to delay email here as the notification itself is already delayed
          await new _DocumentPublishedOrUpdatedEmail.default({
            to: notification.user.email,
            userId: notification.userId,
            eventType: notification.event,
            revisionId: notification.revisionId,
            documentId: notification.documentId,
            teamUrl: notification.team.url,
            actorName: notification.actor.name
          }, {
            notificationId
          }).schedule();
          return;
        }
      case _types.NotificationEventType.AddUserToDocument:
        {
          await new _DocumentSharedEmail.default({
            to: notification.user.email,
            userId: notification.userId,
            documentId: notification.documentId,
            teamUrl: notification.team.url,
            actorName: notification.actor.name
          }, {
            notificationId
          }).schedule({
            delay: _time.Minute
          });
          return;
        }
      case _types.NotificationEventType.AddUserToCollection:
        {
          await new _CollectionSharedEmail.default({
            to: notification.user.email,
            userId: notification.userId,
            collectionId: notification.collectionId,
            teamUrl: notification.team.url,
            actorName: notification.actor.name
          }, {
            notificationId
          }).schedule({
            delay: _time.Minute
          });
          return;
        }
      case _types.NotificationEventType.MentionedInDocument:
        {
          // No need to delay email here as the notification itself is already delayed
          await new _DocumentMentionedEmail.default({
            to: notification.user.email,
            documentId: notification.documentId,
            teamUrl: notification.team.url,
            actorName: notification.actor.name
          }, {
            notificationId
          }).schedule();
          return;
        }
      case _types.NotificationEventType.MentionedInComment:
        {
          await new _CommentMentionedEmail.default({
            to: notification.user.email,
            userId: notification.userId,
            documentId: notification.documentId,
            teamUrl: notification.team.url,
            actorName: notification.actor.name,
            commentId: notification.commentId
          }, {
            notificationId: notification.id
          }).schedule({
            delay: _time.Minute
          });
          return;
        }
      case _types.NotificationEventType.CreateCollection:
        {
          await new _CollectionCreatedEmail.default({
            to: notification.user.email,
            userId: notification.userId,
            collectionId: notification.collectionId,
            teamUrl: notification.team.url
          }, {
            notificationId: notification.id
          }).schedule({
            delay: _time.Minute
          });
          return;
        }
      case _types.NotificationEventType.CreateComment:
        {
          await new _CommentCreatedEmail.default({
            to: notification.user.email,
            userId: notification.userId,
            documentId: notification.documentId,
            teamUrl: notification.team.url,
            actorName: notification.actor.name,
            commentId: notification.commentId
          }, {
            notificationId: notification.id
          }).schedule({
            delay: _time.Minute
          });
        }
    }
  }
}
exports.default = EmailsProcessor;
_defineProperty(EmailsProcessor, "applicableEvents", ["notifications.create"]);