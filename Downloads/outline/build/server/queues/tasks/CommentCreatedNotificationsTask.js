"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _types = require("./../../../shared/types");
var _subscriptionCreator = _interopRequireDefault(require("./../../commands/subscriptionCreator"));
var _models = require("./../../models");
var _NotificationHelper = _interopRequireDefault(require("./../../models/helpers/NotificationHelper"));
var _ProsemirrorHelper = _interopRequireDefault(require("./../../models/helpers/ProsemirrorHelper"));
var _database = require("./../../storage/database");
var _BaseTask = _interopRequireWildcard(require("./BaseTask"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class CommentCreatedNotificationsTask extends _BaseTask.default {
  async perform(event) {
    const [document, comment] = await Promise.all([_models.Document.scope("withCollection").findOne({
      where: {
        id: event.documentId
      }
    }), _models.Comment.findByPk(event.modelId)]);
    if (!document || !comment) {
      return;
    }

    // Commenting on a doc automatically creates a subscription to the doc
    // if they haven't previously had one.
    await _database.sequelize.transaction(async transaction => {
      await (0, _subscriptionCreator.default)({
        user: comment.createdBy,
        documentId: document.id,
        event: "documents.update",
        resubscribe: false,
        transaction,
        ip: event.ip
      });
    });
    const mentions = _ProsemirrorHelper.default.parseMentions(_ProsemirrorHelper.default.toProsemirror(comment.data));
    const userIdsMentioned = [];
    for (const mention of mentions) {
      if (userIdsMentioned.includes(mention.modelId)) {
        continue;
      }
      const recipient = await _models.User.findByPk(mention.modelId);
      if (recipient && recipient.id !== mention.actorId && recipient.subscribedToEventType(_types.NotificationEventType.MentionedInComment)) {
        await _models.Notification.create({
          event: _types.NotificationEventType.MentionedInComment,
          userId: recipient.id,
          actorId: mention.actorId,
          teamId: document.teamId,
          commentId: comment.id,
          documentId: document.id
        });
        userIdsMentioned.push(recipient.id);
      }
    }
    const recipients = (await _NotificationHelper.default.getCommentNotificationRecipients(document, comment, comment.createdById)).filter(recipient => !userIdsMentioned.includes(recipient.id));
    for (const recipient of recipients) {
      await _models.Notification.create({
        event: _types.NotificationEventType.CreateComment,
        userId: recipient.id,
        actorId: comment.createdById,
        teamId: document.teamId,
        commentId: comment.id,
        documentId: document.id
      });
    }
  }
  get options() {
    return {
      priority: _BaseTask.TaskPriority.Background
    };
  }
}
exports.default = CommentCreatedNotificationsTask;