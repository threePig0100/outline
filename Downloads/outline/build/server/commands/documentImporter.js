"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _emojiRegex = _interopRequireDefault(require("emoji-regex"));
var _escapeRegExp = _interopRequireDefault(require("lodash/escapeRegExp"));
var _truncate = _interopRequireDefault(require("lodash/truncate"));
var _parseTitle = _interopRequireDefault(require("./../../shared/utils/parseTitle"));
var _validations = require("./../../shared/validations");
var _tracing = require("./../logging/tracing");
var _ProsemirrorHelper = _interopRequireDefault(require("./../models/helpers/ProsemirrorHelper"));
var _TextHelper = _interopRequireDefault(require("./../models/helpers/TextHelper"));
var _DocumentConverter = require("./../utils/DocumentConverter");
var _errors = require("../errors");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
async function documentImporter(_ref) {
  let {
    mimeType,
    fileName,
    content,
    user,
    ip,
    transaction
  } = _ref;
  let text = await _DocumentConverter.DocumentConverter.convertToMarkdown(content, fileName, mimeType);
  let title = fileName.replace(/\.[^/.]+$/, "");

  // find and extract emoji near the beginning of the document.
  const regex = (0, _emojiRegex.default)();
  const matches = regex.exec(text.slice(0, 10));
  const emoji = matches ? matches[0] : undefined;
  if (emoji) {
    text = text.replace(emoji, "");
  }

  // If the first line of the imported text looks like a markdown heading
  // then we can use this as the document title rather than the file name.
  if (text.trim().startsWith("# ")) {
    const result = (0, _parseTitle.default)(text);
    title = result.title;
    text = text.trim().replace(new RegExp("#\\s+".concat((0, _escapeRegExp.default)(title))), "").trimStart();
  }

  // Replace any <br> generated by the turndown plugin with escaped newlines
  // to match our hardbreak parser.
  text = text.trim().replace(/<br>/gi, "\\n");

  // Escape any dollar signs in the text to prevent them being interpreted as
  // math blocks
  text = text.replace(/\$/g, "\\$");

  // Remove any closed and immediately reopened formatting marks
  text = text.replace(/\*\*\*\*/gi, "").replace(/____/gi, "");
  text = await _TextHelper.default.replaceImagesWithAttachments(text, user, ip, transaction);

  // Sanity check – text cannot possibly be longer than state so if it is, we can short-circuit here
  if (text.length > _validations.DocumentValidation.maxStateLength) {
    throw (0, _errors.InvalidRequestError)("The document \"".concat(title, "\" is too large to import, please reduce the length and try again"));
  }

  // It's better to truncate particularly long titles than fail the import
  title = (0, _truncate.default)(title, {
    length: _validations.DocumentValidation.maxTitleLength
  });
  const ydoc = _ProsemirrorHelper.default.toYDoc(text);
  const state = _ProsemirrorHelper.default.toState(ydoc);
  if (state.length > _validations.DocumentValidation.maxStateLength) {
    throw (0, _errors.InvalidRequestError)("The document \"".concat(title, "\" is too large to import, please reduce the length and try again"));
  }
  return {
    text,
    state,
    title,
    emoji
  };
}
var _default = exports.default = (0, _tracing.traceFunction)({
  spanName: "documentImporter"
})(documentImporter);