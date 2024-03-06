"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _crypto = _interopRequireDefault(require("crypto"));
var _env = _interopRequireDefault(require("./../../env"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * Helper class for working with subscription settings
 */
class SubscriptionHelper {
  /**
   * Get the unsubscribe URL for a user and document. This url allows the user
   * to unsubscribe from a specific document without being signed in, for one-click
   * links in emails.
   *
   * @param userId The user ID to unsubscribe
   * @param documentId The document ID to unsubscribe from
   * @returns The unsubscribe URL
   */
  static unsubscribeUrl(userId, documentId) {
    return "".concat(_env.default.URL, "/api/subscriptions.delete?token=").concat(this.unsubscribeToken(userId, documentId), "&userId=").concat(userId, "&documentId=").concat(documentId);
  }
  static unsubscribeToken(userId, documentId) {
    const hash = _crypto.default.createHash("sha256");
    hash.update("".concat(userId, "-").concat(_env.default.SECRET_KEY, "-").concat(documentId));
    return hash.digest("hex");
  }
}
exports.default = SubscriptionHelper;