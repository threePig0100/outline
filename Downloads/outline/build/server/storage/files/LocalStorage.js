"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _buffer = require("buffer");
var _promises = require("fs/promises");
var _path = _interopRequireDefault(require("path"));
var _stream = require("stream");
var _fsExtra = _interopRequireDefault(require("fs-extra"));
var _invariant = _interopRequireDefault(require("invariant"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _resolvePath = _interopRequireDefault(require("resolve-path"));
var _env = _interopRequireDefault(require("./../../env"));
var _errors = require("./../../errors");
var _Logger = _interopRequireDefault(require("./../../logging/Logger"));
var _BaseStorage = _interopRequireDefault(require("./BaseStorage"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class LocalStorage extends _BaseStorage.default {
  constructor() {
    super(...arguments);
    _defineProperty(this, "store", async _ref => {
      let {
        body,
        key
      } = _ref;
      const exists = await _fsExtra.default.pathExists(this.getFilePath(key));
      if (exists) {
        throw (0, _errors.ValidationError)("File already exists at ".concat(key));
      }
      await (0, _promises.mkdir)(this.getFilePath(_path.default.dirname(key)), {
        recursive: true
      });
      let src;
      if (body instanceof _fsExtra.default.ReadStream) {
        src = body;
      } else if (body instanceof _buffer.Blob) {
        src = _stream.Readable.from(Buffer.from(await body.arrayBuffer()));
      } else {
        src = _stream.Readable.from(body);
      }
      const filePath = this.getFilePath(key);

      // Create the file on disk first
      await _fsExtra.default.createFile(filePath);
      return new Promise((resolve, reject) => {
        const dest = _fsExtra.default.createWriteStream(filePath).on("error", reject).on("finish", () => resolve(this.getUrlForKey(key)));
        src.on("error", err => {
          dest.end();
          reject(err);
        }).pipe(dest);
      });
    });
    _defineProperty(this, "getSignedUrl", async function (key) {
      let expiresIn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : LocalStorage.defaultSignedUrlExpires;
      const sig = _jsonwebtoken.default.sign({
        key,
        type: "attachment"
      }, _env.default.SECRET_KEY, {
        expiresIn
      });
      return Promise.resolve("".concat(_env.default.URL.replace("https://121.41.58.48:3002", "https://121.41.58.48:3000"), "/api/files.get?sig=").concat(sig));
    });
  }
  async getPresignedPost(key, acl, maxUploadSize) {
    let contentType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "image";
    return Promise.resolve({
      url: this.getUrlForKey(key),
      fields: {
        key,
        acl,
        maxUploadSize,
        contentType
      }
    });
  }
  getUploadUrl() {
    return "/api/files.create";
  }
  getUrlForKey(key) {
    return "/api/files.get?key=".concat(key);
  }
  async deleteFile(key) {
    const filePath = this.getFilePath(key);
    try {
      await (0, _promises.unlink)(filePath);
    } catch (err) {
      _Logger.default.warn("Couldn't delete ".concat(filePath), err);
      return;
    }
    const directory = _path.default.dirname(filePath);
    try {
      await (0, _promises.rmdir)(directory);
    } catch (err) {
      if (err.code === "ENOTEMPTY") {
        return;
      }
      _Logger.default.warn("Couldn't delete directory ".concat(directory), err);
    }
  }
  async getFileHandle(key) {
    return {
      path: this.getFilePath(key),
      cleanup: async () => {
        // no-op, as we're reading the canonical file directly
      }
    };
  }
  getFileStream(key) {
    return _fsExtra.default.createReadStream(this.getFilePath(key));
  }
  getFilePath(key) {
    (0, _invariant.default)(_env.default.FILE_STORAGE_LOCAL_ROOT_DIR, "FILE_STORAGE_LOCAL_ROOT_DIR is required");
    return (0, _resolvePath.default)(_env.default.FILE_STORAGE_LOCAL_ROOT_DIR, key);
  }
}
exports.default = LocalStorage;