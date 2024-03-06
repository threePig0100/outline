"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cdnPath = cdnPath;
exports.creatingUrlPrefix = void 0;
exports.isBase64Url = isBase64Url;
exports.isDocumentUrl = isDocumentUrl;
exports.isExternalUrl = isExternalUrl;
exports.isInternalUrl = isInternalUrl;
exports.isUrl = isUrl;
exports.sanitizeUrl = sanitizeUrl;
exports.urlRegex = urlRegex;
var _escapeRegExp = _interopRequireDefault(require("lodash/escapeRegExp"));
var _env = _interopRequireDefault(require("../env"));
var _domains = require("./domains");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * Prepends the CDN url to the given path (If a CDN is configured).
 *
 * @param path The path to prepend the CDN url to.
 * @returns The path with the CDN url prepended.
 */
function cdnPath(path) {
  return "".concat(_env.default.CDN_URL).concat(path);
}

/**
 * Returns true if the given string is a link to inside the application.
 *
 * @param url The url to check.
 * @returns True if the url is internal, false otherwise.
 */
function isInternalUrl(href) {
  // empty strings are never internal
  if (href === "") {
    return false;
  }

  // relative paths are always internal
  if (href[0] === "/") {
    return true;
  }
  const outline = typeof window !== "undefined" ? (0, _domains.parseDomain)(window.location.href) : (0, _domains.parseDomain)(_env.default.URL);
  const domain = (0, _domains.parseDomain)(href);
  return outline.host === domain.host || domain.host.endsWith((0, _domains.getBaseDomain)()) && !_domains.RESERVED_SUBDOMAINS.find(reserved => domain.host.startsWith(reserved));
}

/**
 * Returns true if the given string is a link to a documement.
 *
 * @param options Parsing options.
 * @returns True if a document, false otherwise.
 */
function isDocumentUrl(url) {
  try {
    const parsed = new URL(url);
    return isInternalUrl(url) && (parsed.pathname.startsWith("/doc/") || parsed.pathname.startsWith("/d/"));
  } catch (err) {
    return false;
  }
}

/**
 * Returns true if the given string is a url.
 *
 * @param text The url to check.
 * @param options Parsing options.
 * @returns True if a url, false otherwise.
 */
function isUrl(text, options) {
  if (text.match(/\n/)) {
    return false;
  }
  try {
    const url = new URL(text);
    const blockedProtocols = ["javascript:", "file:", "vbscript:", "data:"];
    if (blockedProtocols.includes(url.protocol)) {
      return false;
    }
    if (url.hostname) {
      return true;
    }
    return url.protocol !== "" && (url.pathname.startsWith("//") || url.pathname.startsWith("http")) && !(options !== null && options !== void 0 && options.requireHostname);
  } catch (err) {
    return false;
  }
}

/**
 * Temporary prefix applied to links in document that are not yet persisted.
 */
const creatingUrlPrefix = exports.creatingUrlPrefix = "creating#";

/**
 * Returns true if the given string is a link to outside the application.
 *
 * @param url The url to check.
 * @returns True if the url is external, false otherwise.
 */
function isExternalUrl(url) {
  return !!url && !isInternalUrl(url) && !url.startsWith(creatingUrlPrefix);
}

/**
 * Returns match if the given string is a base64 encoded url.
 *
 * @param url The url to check.
 * @returns A RegExp match if the url is base64, false otherwise.
 */
function isBase64Url(url) {
  const match = url.match(/^data:([a-z]+\/[^;]+);base64,(.*)/i);
  return match ? match : false;
}

/**
 * For use in the editor, this function will ensure that a url is
 * potentially valid, and filter out unsupported and malicious protocols.
 *
 * @param url The url to sanitize
 * @returns The sanitized href
 */
function sanitizeUrl(url) {
  if (!url) {
    return undefined;
  }
  if (!isUrl(url, {
    requireHostname: false
  }) && !url.startsWith("/") && !url.startsWith("#") && !url.startsWith("mailto:") && !url.startsWith("sms:") && !url.startsWith("fax:") && !url.startsWith("tel:")) {
    return "https://".concat(url);
  }
  return url;
}
function urlRegex(url) {
  if (!url || !isUrl(url)) {
    return undefined;
  }
  const urlObj = new URL(sanitizeUrl(url));
  return new RegExp((0, _escapeRegExp.default)("".concat(urlObj.protocol, "//").concat(urlObj.host)));
}