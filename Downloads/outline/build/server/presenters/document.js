"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _tracing = require("./../logging/tracing");
var _TextHelper = _interopRequireDefault(require("./../models/helpers/TextHelper"));
var _user = _interopRequireDefault(require("./user"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
async function presentDocument(document) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  options = {
    isPublic: false,
    ...options
  };
  const text = options.isPublic ? await _TextHelper.default.attachmentsToSignedUrls(document.text, document.teamId) : document.text;
  const data = {
    id: document.id,
    url: document.url,
    urlId: document.urlId,
    title: document.title,
    emoji: document.emoji,
    text,
    tasks: document.tasks,
    createdAt: document.createdAt,
    createdBy: undefined,
    updatedAt: document.updatedAt,
    updatedBy: undefined,
    publishedAt: document.publishedAt,
    archivedAt: document.archivedAt,
    deletedAt: document.deletedAt,
    teamId: document.teamId,
    collaboratorIds: [],
    revision: document.revisionCount,
    fullWidth: document.fullWidth,
    collectionId: undefined,
    parentDocumentId: undefined,
    lastViewedAt: undefined,
    isCollectionDeleted: await document.isCollectionDeleted()
  };
  if (!!document.views && document.views.length > 0) {
    data.lastViewedAt = document.views[0].updatedAt;
  }
  if (!options.isPublic) {
    data.collectionId = document.collectionId;
    data.parentDocumentId = document.parentDocumentId;
    data.createdBy = (0, _user.default)(document.createdBy);
    data.updatedBy = (0, _user.default)(document.updatedBy);
    data.collaboratorIds = document.collaboratorIds;
    data.templateId = document.templateId;
    data.template = document.template;
    data.insightsEnabled = document.insightsEnabled;
  }
  return data;
}
var _default = exports.default = (0, _tracing.traceFunction)({
  spanName: "presenters"
})(presentDocument);