"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = notificationUpdater;
var _isUndefined = _interopRequireDefault(require("lodash/isUndefined"));
var _models = require("./../models");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * This command updates notification properties.
 *
 * @param Props The properties of the notification to update
 * @returns Notification The updated notification
 */
async function notificationUpdater(_ref) {
  let {
    notification,
    viewedAt,
    archivedAt,
    ip,
    transaction
  } = _ref;
  if (!(0, _isUndefined.default)(viewedAt)) {
    notification.viewedAt = viewedAt;
  }
  if (!(0, _isUndefined.default)(archivedAt)) {
    notification.archivedAt = archivedAt;
  }
  const changed = notification.changed();
  if (changed) {
    await notification.save({
      transaction
    });
    await _models.Event.create({
      name: "notifications.update",
      userId: notification.userId,
      modelId: notification.id,
      teamId: notification.teamId,
      documentId: notification.documentId,
      actorId: notification.actorId,
      ip
    }, {
      transaction
    });
  }
  return notification;
}