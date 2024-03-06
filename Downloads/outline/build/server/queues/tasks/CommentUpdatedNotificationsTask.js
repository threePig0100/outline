"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _types = require("./../../../shared/types");
var _models = require("./../../models");
var _ProsemirrorHelper = _interopRequireDefault(require("./../../models/helpers/ProsemirrorHelper"));
var _BaseTask = _interopRequireWildcard(require("./BaseTask"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class CommentUpdatedNotificationsTask extends _BaseTask.default {
  async perform(event) {
    const [document, comment] = await Promise.all([_models.Document.scope("withCollection").findOne({
      where: {
        id: event.documentId
      }
    }), _models.Comment.findByPk(event.modelId)]);
    if (!document || !comment) {
      return;
    }
    const mentions = _ProsemirrorHelper.default.parseMentions(_ProsemirrorHelper.default.toProsemirror(comment.data)).filter(mention => event.data.newMentionIds.includes(mention.id));
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
          documentId: document.id
        });
      }
    }
  }
  get options() {
    return {
      attempts: 1,
      priority: _BaseTask.TaskPriority.Background
    };
  }
}
exports.default = CommentUpdatedNotificationsTask;