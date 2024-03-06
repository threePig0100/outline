"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = headingToSlug;
exports.headingToPersistenceKey = headingToPersistenceKey;
var _escape = _interopRequireDefault(require("lodash/escape"));
var _slugify = _interopRequireDefault(require("slugify"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const cache = new Map();

// Slugify, escape, and remove periods from headings so that they are
// compatible with both url hashes AND dom ID's (querySelector does not like
// ID's that begin with a number or a period, for example).
function safeSlugify(text) {
  if (cache.has(text)) {
    return cache.get(text);
  }
  const slug = "h-".concat((0, _escape.default)((0, _slugify.default)(text, {
    remove: /[!"#$%&'\.()*+,\/:;<=>?@\[\]\\^_`{|}~]/g,
    lower: true
  })));
  cache.set(text, slug);
  return slug;
}

// calculates a unique slug for this heading based on it's text and position
// in the document that is as stable as possible
function headingToSlug(node) {
  let index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  const slugified = safeSlugify(node.textContent);
  if (index === 0) {
    return slugified;
  }
  return "".concat(slugified, "-").concat(index);
}
function headingToPersistenceKey(node, id) {
  var _window;
  const slug = headingToSlug(node);
  return "rme-".concat(id || ((_window = window) === null || _window === void 0 ? void 0 : _window.location.pathname), "\u2013").concat(slug);
}