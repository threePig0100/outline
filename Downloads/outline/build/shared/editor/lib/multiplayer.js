"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isRemoteTransaction = isRemoteTransaction;
var _yProsemirror = require("@getoutline/y-prosemirror");
/**
 * Checks if a transaction is a remote transaction
 *
 * @param tr The Prosemirror transaction
 * @returns true if the transaction is a remote transaction
 */
function isRemoteTransaction(tr) {
  const meta = tr.getMeta(_yProsemirror.ySyncPluginKey);

  // This logic seems to be flipped? But it's correct.
  return !!(meta !== null && meta !== void 0 && meta.isChangeOrigin);
}