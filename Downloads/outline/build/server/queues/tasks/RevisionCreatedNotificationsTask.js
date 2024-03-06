"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _dateFns = require("date-fns");
var _differenceBy = _interopRequireDefault(require("lodash/differenceBy"));
var _sequelize = require("sequelize");
var _types = require("./../../../shared/types");
var _subscriptionCreator = require("./../../commands/subscriptionCreator");
var _env = _interopRequireDefault(require("./../../env"));
var _Logger = _interopRequireDefault(require("./../../logging/Logger"));
var _models = require("./../../models");
var _DocumentHelper = _interopRequireDefault(require("./../../models/helpers/DocumentHelper"));
var _NotificationHelper = _interopRequireDefault(require("./../../models/helpers/NotificationHelper"));
var _BaseTask = _interopRequireWildcard(require("./BaseTask"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class RevisionCreatedNotificationsTask extends _BaseTask.default {
  constructor() {
    super(...arguments);
    _defineProperty(this, "shouldNotify", async (document, user) => {
      // Create only a single notification in a 6 hour window
      const notification = await _models.Notification.findOne({
        order: [["createdAt", "DESC"]],
        where: {
          userId: user.id,
          documentId: document.id,
          emailedAt: {
            [_sequelize.Op.not]: null,
            [_sequelize.Op.gte]: (0, _dateFns.subHours)(new Date(), 6)
          }
        }
      });
      if (notification) {
        if (_env.default.isDevelopment) {
          _Logger.default.info("processor", "would have suppressed notification to ".concat(user.id, ", but not in development"));
        } else {
          _Logger.default.info("processor", "suppressing notification to ".concat(user.id, " as recently notified"));
          return false;
        }
      }

      // If this recipient has viewed the document since the last update was made
      // then we can avoid sending them a useless notification, yay.
      const view = await _models.View.findOne({
        where: {
          userId: user.id,
          documentId: document.id,
          updatedAt: {
            [_sequelize.Op.gt]: document.updatedAt
          }
        }
      });
      if (view) {
        _Logger.default.info("processor", "suppressing notification to ".concat(user.id, " because update viewed"));
        return false;
      }
      return true;
    });
  }
  async perform(event) {
    const [document, revision] = await Promise.all([_models.Document.findByPk(event.documentId, {
      includeState: true
    }), _models.Revision.findByPk(event.modelId)]);
    if (!document || !revision) {
      return;
    }
    await (0, _subscriptionCreator.createSubscriptionsForDocument)(document, event);

    // Send notifications to mentioned users first
    const before = await revision.before();
    const oldMentions = before ? _DocumentHelper.default.parseMentions(before) : [];
    const newMentions = _DocumentHelper.default.parseMentions(document);
    const mentions = (0, _differenceBy.default)(newMentions, oldMentions, "id");
    const userIdsMentioned = [];
    for (const mention of mentions) {
      if (userIdsMentioned.includes(mention.modelId)) {
        continue;
      }
      const recipient = await _models.User.findByPk(mention.modelId);
      if (recipient && recipient.id !== mention.actorId && recipient.subscribedToEventType(_types.NotificationEventType.MentionedInDocument)) {
        await _models.Notification.create({
          event: _types.NotificationEventType.MentionedInDocument,
          userId: recipient.id,
          revisionId: event.modelId,
          actorId: document.updatedBy.id,
          teamId: document.teamId,
          documentId: document.id
        });
        userIdsMentioned.push(recipient.id);
      }
    }
    const recipients = (await _NotificationHelper.default.getDocumentNotificationRecipients(document, _types.NotificationEventType.UpdateDocument, document.lastModifiedById, true)).filter(recipient => !userIdsMentioned.includes(recipient.id));
    if (!recipients.length) {
      return;
    }
    for (const recipient of recipients) {
      const notify = await this.shouldNotify(document, recipient);
      if (notify) {
        await _models.Notification.create({
          event: _types.NotificationEventType.UpdateDocument,
          userId: recipient.id,
          revisionId: event.modelId,
          actorId: document.updatedBy.id,
          teamId: document.teamId,
          documentId: document.id
        });
      }
    }
  }
  get options() {
    return {
      priority: _BaseTask.TaskPriority.Background
    };
  }
}
exports.default = RevisionCreatedNotificationsTask;