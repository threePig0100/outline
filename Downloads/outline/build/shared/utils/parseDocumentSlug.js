"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseDocumentSlug;
var _env = _interopRequireDefault(require("../env"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * Parse the likely document identifier from a given url.
 *
 * @param url The url to parse.
 * @returns A document identifier or undefined if not found.
 */
function parseDocumentSlug(url) {
  var _split;
  let parsed;
  if (url[0] === "/") {
    url = "".concat(_env.default.URL).concat(url);
  }
  try {
    parsed = new URL(url).pathname;
  } catch (err) {
    return;
  }
  const split = parsed.split("/");
  const indexOfDoc = split.indexOf("doc");
  return (_split = split[indexOfDoc + 1]) !== null && _split !== void 0 ? _split : undefined;
}