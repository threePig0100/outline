"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = presentShare;
var _ = require(".");
function presentShare(share) {
  var _share$document, _share$document2;
  let isAdmin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  const data = {
    id: share.id,
    documentId: share.documentId,
    documentTitle: (_share$document = share.document) === null || _share$document === void 0 ? void 0 : _share$document.title,
    documentUrl: (_share$document2 = share.document) === null || _share$document2 === void 0 ? void 0 : _share$document2.url,
    published: share.published,
    url: share.canonicalUrl,
    urlId: share.urlId,
    createdBy: (0, _.presentUser)(share.user),
    includeChildDocuments: share.includeChildDocuments,
    lastAccessedAt: share.lastAccessedAt || undefined,
    views: share.views || 0,
    domain: share.domain,
    createdAt: share.createdAt,
    updatedAt: share.updatedAt
  };
  if (!isAdmin) {
    delete data.lastAccessedAt;
  }
  return data;
}