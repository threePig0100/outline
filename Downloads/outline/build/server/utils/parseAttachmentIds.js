"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseAttachmentIds;
var _compact = _interopRequireDefault(require("lodash/compact"));
var _uniq = _interopRequireDefault(require("lodash/uniq"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const attachmentRedirectRegex = /\/api\/attachments\.redirect\?id=(?<id>[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/gi;
const attachmentPublicRegex = /public\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/(?<id>[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/gi;
function parseAttachmentIds(text) {
  let includePublic = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return (0, _uniq.default)((0, _compact.default)([...text.matchAll(attachmentRedirectRegex), ...(includePublic ? text.matchAll(attachmentPublicRegex) : [])].map(match => match.groups && match.groups.id)));
}