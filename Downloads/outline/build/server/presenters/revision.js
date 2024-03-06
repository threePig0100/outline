"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _parseTitle = _interopRequireDefault(require("./../../shared/utils/parseTitle"));
var _tracing = require("./../logging/tracing");
var _DocumentHelper = _interopRequireDefault(require("./../models/helpers/DocumentHelper"));
var _user = _interopRequireDefault(require("./user"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
async function presentRevision(revision, diff) {
  var _revision$emoji;
  // TODO: Remove this fallback once all revisions have been migrated
  const {
    emoji,
    strippedTitle
  } = (0, _parseTitle.default)(revision.title);
  return {
    id: revision.id,
    documentId: revision.documentId,
    title: strippedTitle,
    text: _DocumentHelper.default.toMarkdown(revision),
    emoji: (_revision$emoji = revision.emoji) !== null && _revision$emoji !== void 0 ? _revision$emoji : emoji,
    html: diff,
    createdAt: revision.createdAt,
    createdBy: (0, _user.default)(revision.user)
  };
}
var _default = exports.default = (0, _tracing.traceFunction)({
  spanName: "presenters"
})(presentRevision);