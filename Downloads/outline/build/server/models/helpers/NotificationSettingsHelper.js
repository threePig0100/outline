"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _crypto = _interopRequireDefault(require("crypto"));
var _types = require("./../../../shared/types");
var _env = _interopRequireDefault(require("./../../env"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * Helper class for working with notification settings
 */
class NotificationSettingsHelper {
  /**
   * Get the default notification settings for a user
   *
   * @returns The default notification settings
   */
  static getDefaults() {
    return _types.NotificationEventDefaults;
  }

  /**
   * Get the unsubscribe URL for a user and event type. This url allows the user
   * to unsubscribe from a specific event without being signed in, for one-click
   * links in emails.
   *
   * @param userId The user ID to unsubscribe
   * @param eventType The event type to unsubscribe from
   * @returns The unsubscribe URL
   */
  static unsubscribeUrl(userId, eventType) {
    return "".concat(_env.default.URL, "/api/notifications.unsubscribe?token=").concat(this.unsubscribeToken(userId, eventType), "&userId=").concat(userId, "&eventType=").concat(eventType);
  }
  static unsubscribeToken(userId, eventType) {
    const hash = _crypto.default.createHash("sha256");
    hash.update("".concat(userId, "-").concat(_env.default.SECRET_KEY, "-").concat(eventType));
    return hash.digest("hex");
  }
}
exports.default = NotificationSettingsHelper;