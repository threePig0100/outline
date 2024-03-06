"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Buckets = void 0;
var _dateFns = require("date-fns");
var _types = require("./../../../shared/types");
var _env = _interopRequireDefault(require("./../../env"));
var _validation = require("./../../validation");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let Buckets = exports.Buckets = /*#__PURE__*/function (Buckets) {
  Buckets["public"] = "public";
  Buckets["uploads"] = "uploads";
  Buckets["avatars"] = "avatars";
  return Buckets;
}({});
class AttachmentHelper {
  /**
   * Get the upload location for the given upload details
   *
   * @param acl The ACL to use
   * @param id The ID of the attachment
   * @param name The name of the attachment
   * @param userId The ID of the user uploading the attachment
   */
  static getKey(_ref) {
    let {
      acl,
      id,
      name,
      userId
    } = _ref;
    const bucket = acl === "public-read" ? Buckets.public : Buckets.uploads;
    const keyPrefix = "".concat(bucket, "/").concat(userId, "/").concat(id);
    return _validation.ValidateKey.sanitize("".concat(keyPrefix, "/").concat(name));
  }

  /**
   * Parse a key into its constituent parts
   *
   * @param key The key to parse
   * @returns The constituent parts
   */
  static parseKey(key) {
    const parts = key.split("/");
    const bucket = parts[0];
    const userId = parts[1];
    const id = parts[2];
    const [fileName] = parts.length > 3 ? parts.slice(-1) : [];
    return {
      bucket,
      userId,
      id,
      fileName,
      isPublicBucket: bucket === Buckets.avatars || bucket === Buckets.public
    };
  }

  /**
   * Get the ACL to use for a given attachment preset
   *
   * @param preset The preset to use
   * @returns A valid S3 ACL
   */
  static presetToAcl(preset) {
    switch (preset) {
      case _types.AttachmentPreset.Avatar:
        return "public-read";
      default:
        return _env.default.AWS_S3_ACL;
    }
  }

  /**
   * Get the expiration time for a given attachment preset
   *
   * @param preset The preset to use
   * @returns An expiration time
   */
  static presetToExpiry(preset) {
    switch (preset) {
      case _types.AttachmentPreset.Import:
        return (0, _dateFns.addHours)(new Date(), 24);
      default:
        return undefined;
    }
  }

  /**
   * Get the maximum upload size for a given attachment preset
   *
   * @param preset The preset to use
   * @returns The maximum upload size in bytes
   */
  static presetToMaxUploadSize(preset) {
    switch (preset) {
      case _types.AttachmentPreset.Import:
        return _env.default.MAXIMUM_IMPORT_SIZE;
      case _types.AttachmentPreset.Avatar:
      case _types.AttachmentPreset.DocumentAttachment:
      default:
        return _env.default.FILE_STORAGE_UPLOAD_MAX_SIZE;
    }
  }
}
exports.default = AttachmentHelper;