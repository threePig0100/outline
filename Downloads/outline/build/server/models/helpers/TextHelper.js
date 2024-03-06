"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _escapeRegExp = _interopRequireDefault(require("lodash/escapeRegExp"));
var _startCase = _interopRequireDefault(require("lodash/startCase"));
var _types = require("./../../../shared/types");
var _date = require("./../../../shared/utils/date");
var _attachmentCreator = _interopRequireDefault(require("./../../commands/attachmentCreator"));
var _tracing = require("./../../logging/tracing");
var _ = require("./..");
var _files = _interopRequireDefault(require("./../../storage/files"));
var _parseAttachmentIds = _interopRequireDefault(require("./../../utils/parseAttachmentIds"));
var _parseImages = _interopRequireDefault(require("./../../utils/parseImages"));
var _dec, _class;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let TextHelper = exports.default = (_dec = (0, _tracing.trace)(), _dec(_class = class TextHelper {
  /**
   * Replaces template variables in the given text with the current date and time.
   *
   * @param text The text to replace the variables in
   * @param user The user to get the language/locale from
   * @returns The text with the variables replaced
   */
  static replaceTemplateVariables(text, user) {
    const locales = user.language ? (0, _date.unicodeCLDRtoBCP47)(user.language) : undefined;
    return text.replace(/{date}/g, (0, _startCase.default)((0, _date.getCurrentDateAsString)(locales))).replace(/{time}/g, (0, _startCase.default)((0, _date.getCurrentTimeAsString)(locales))).replace(/{datetime}/g, (0, _startCase.default)((0, _date.getCurrentDateTimeAsString)(locales)));
  }

  /**
   * Converts attachment urls in documents to signed equivalents that allow
   * direct access without a session cookie
   *
   * @param text The text either html or markdown which contains urls to be converted
   * @param teamId The team context
   * @param expiresIn The time that signed urls should expire (in seconds)
   * @returns The replaced text
   */
  static async attachmentsToSignedUrls(text, teamId) {
    let expiresIn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3000;
    const attachmentIds = (0, _parseAttachmentIds.default)(text);
    await Promise.all(attachmentIds.map(async id => {
      const attachment = await _.Attachment.findOne({
        where: {
          id,
          teamId
        }
      });
      if (attachment) {
        const signedUrl = await _files.default.getSignedUrl(attachment.key, expiresIn);
        text = text.replace(new RegExp((0, _escapeRegExp.default)(attachment.redirectUrl), "g"), signedUrl);
      }
    }));
    return text;
  }

  /**
   * Replaces remote and base64 encoded images in the given text with attachment
   * urls and uploads the images to the storage provider.
   *
   * @param markdown The text to replace the images in
   * @param user The user context
   * @param ip The IP address of the user
   * @param transaction The transaction to use for the database operations
   * @returns The text with the images replaced
   */
  static async replaceImagesWithAttachments(markdown, user, ip, transaction) {
    let output = markdown;
    const images = (0, _parseImages.default)(markdown);
    await Promise.all(images.map(async image => {
      var _image$alt;
      // Skip attempting to fetch images that are not valid urls
      try {
        new URL(image.src);
      } catch (_e) {
        return;
      }
      const attachment = await (0, _attachmentCreator.default)({
        name: (_image$alt = image.alt) !== null && _image$alt !== void 0 ? _image$alt : "image",
        url: image.src,
        preset: _types.AttachmentPreset.DocumentAttachment,
        user,
        ip,
        transaction
      });
      if (attachment) {
        output = output.replace(new RegExp((0, _escapeRegExp.default)(image.src), "g"), attachment.redirectUrl);
      }
    }));
    return output;
  }
}) || _class);