"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _CollectionAddUserNotificationsTask = _interopRequireDefault(require("../tasks/CollectionAddUserNotificationsTask"));
var _CollectionCreatedNotificationsTask = _interopRequireDefault(require("../tasks/CollectionCreatedNotificationsTask"));
var _CommentCreatedNotificationsTask = _interopRequireDefault(require("../tasks/CommentCreatedNotificationsTask"));
var _CommentUpdatedNotificationsTask = _interopRequireDefault(require("../tasks/CommentUpdatedNotificationsTask"));
var _DocumentAddUserNotificationsTask = _interopRequireDefault(require("../tasks/DocumentAddUserNotificationsTask"));
var _DocumentPublishedNotificationsTask = _interopRequireDefault(require("../tasks/DocumentPublishedNotificationsTask"));
var _RevisionCreatedNotificationsTask = _interopRequireDefault(require("../tasks/RevisionCreatedNotificationsTask"));
var _BaseProcessor = _interopRequireDefault(require("./BaseProcessor"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class NotificationsProcessor extends _BaseProcessor.default {
  async perform(event) {
    switch (event.name) {
      case "documents.publish":
        return this.documentPublished(event);
      case "documents.add_user":
        return this.documentAddUser(event);
      case "revisions.create":
        return this.revisionCreated(event);
      case "collections.create":
        return this.collectionCreated(event);
      case "collections.add_user":
        return this.collectionAddUser(event);
      case "comments.create":
        return this.commentCreated(event);
      case "comments.update":
        return this.commentUpdated(event);
      default:
    }
  }
  async documentPublished(event) {
    // never send notifications when batch importing
    if ("data" in event && "source" in event.data && event.data.source === "import") {
      return;
    }
    await _DocumentPublishedNotificationsTask.default.schedule(event);
  }
  async documentAddUser(event) {
    if (!event.data.isNew || event.userId === event.actorId) {
      return;
    }
    await _DocumentAddUserNotificationsTask.default.schedule(event);
  }
  async revisionCreated(event) {
    await _RevisionCreatedNotificationsTask.default.schedule(event);
  }
  async collectionCreated(event) {
    // never send notifications when batch importing
    if ("data" in event && "source" in event.data && event.data.source === "import") {
      return;
    }
    await _CollectionCreatedNotificationsTask.default.schedule(event);
  }
  async collectionAddUser(event) {
    if (!event.data.isNew || event.userId === event.actorId) {
      return;
    }
    await _CollectionAddUserNotificationsTask.default.schedule(event);
  }
  async commentCreated(event) {
    await _CommentCreatedNotificationsTask.default.schedule(event);
  }
  async commentUpdated(event) {
    await _CommentUpdatedNotificationsTask.default.schedule(event);
  }
}
exports.default = NotificationsProcessor;
_defineProperty(NotificationsProcessor, "applicableEvents", ["documents.publish", "documents.add_user", "revisions.create", "collections.create", "collections.add_user", "comments.create", "comments.update"]);