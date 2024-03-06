"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _path = _interopRequireDefault(require("path"));
var _util = _interopRequireDefault(require("util"));
var _awsSdk = _interopRequireDefault(require("aws-sdk"));
var _fsExtra = _interopRequireDefault(require("fs-extra"));
var _invariant = _interopRequireDefault(require("invariant"));
var _compact = _interopRequireDefault(require("lodash/compact"));
var _tmp = _interopRequireDefault(require("tmp"));
var _env = _interopRequireDefault(require("./../../env"));
var _Logger = _interopRequireDefault(require("./../../logging/Logger"));
var _BaseStorage = _interopRequireDefault(require("./BaseStorage"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class S3Storage extends _BaseStorage.default {
  constructor() {
    var _this;
    super();
    _this = this;
    _defineProperty(this, "store", async _ref => {
      let {
        body,
        contentLength,
        contentType,
        key,
        acl
      } = _ref;
      (0, _invariant.default)(_env.default.AWS_S3_UPLOAD_BUCKET_NAME, "AWS_S3_UPLOAD_BUCKET_NAME is required");
      await this.client.putObject({
        ACL: acl,
        Bucket: _env.default.AWS_S3_UPLOAD_BUCKET_NAME,
        Key: key,
        ContentType: contentType,
        ContentLength: contentLength,
        ContentDisposition: "attachment",
        Body: body
      }).promise();
      const endpoint = this.getPublicEndpoint(true);
      return "".concat(endpoint, "/").concat(key);
    });
    _defineProperty(this, "getSignedUrl", async function (key) {
      let expiresIn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : S3Storage.defaultSignedUrlExpires;
      const isDocker = _env.default.AWS_S3_UPLOAD_BUCKET_URL.match(/http:\/\/s3:/);
      const params = {
        Bucket: _env.default.AWS_S3_UPLOAD_BUCKET_NAME,
        Key: key,
        Expires: expiresIn,
        ResponseContentDisposition: "attachment"
      };
      const url = isDocker ? "".concat(_this.getPublicEndpoint(), "/").concat(key) : await _this.client.getSignedUrlPromise("getObject", params);
      if (_env.default.AWS_S3_ACCELERATE_URL) {
        return url.replace(_env.default.AWS_S3_UPLOAD_BUCKET_URL, _env.default.AWS_S3_ACCELERATE_URL);
      }
      return url;
    });
    _defineProperty(this, "client", void 0);
    this.client = new _awsSdk.default.S3({
      s3BucketEndpoint: _env.default.AWS_S3_ACCELERATE_URL ? true : undefined,
      s3ForcePathStyle: _env.default.AWS_S3_FORCE_PATH_STYLE,
      accessKeyId: _env.default.AWS_ACCESS_KEY_ID,
      secretAccessKey: _env.default.AWS_SECRET_ACCESS_KEY,
      region: _env.default.AWS_REGION,
      endpoint: this.getEndpoint(),
      signatureVersion: "v4"
    });
  }
  async getPresignedPost(key, acl, maxUploadSize) {
    let contentType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "image";
    const params = {
      Bucket: _env.default.AWS_S3_UPLOAD_BUCKET_NAME,
      Conditions: (0, _compact.default)([["content-length-range", 0, maxUploadSize], ["starts-with", "$Content-Type", contentType], ["starts-with", "$Cache-Control", ""]]),
      Fields: {
        "Content-Disposition": "attachment",
        key,
        acl
      },
      Expires: 3600
    };
    return _util.default.promisify(this.client.createPresignedPost).bind(this.client)(params);
  }
  getPublicEndpoint(isServerUpload) {
    if (_env.default.AWS_S3_ACCELERATE_URL) {
      return _env.default.AWS_S3_ACCELERATE_URL;
    }
    (0, _invariant.default)(_env.default.AWS_S3_UPLOAD_BUCKET_NAME, "AWS_S3_UPLOAD_BUCKET_NAME is required");

    // lose trailing slash if there is one and convert fake-s3 url to localhost
    // for access outside of docker containers in local development
    const isDocker = _env.default.AWS_S3_UPLOAD_BUCKET_URL.match(/http:\/\/s3:/);
    const host = _env.default.AWS_S3_UPLOAD_BUCKET_URL.replace("s3:", "localhost:").replace(/\/$/, "");

    // support old path-style S3 uploads and new virtual host uploads by checking
    // for the bucket name in the endpoint url before appending.
    const isVirtualHost = host.includes(_env.default.AWS_S3_UPLOAD_BUCKET_NAME);
    if (isVirtualHost) {
      return host;
    }
    return "".concat(host, "/").concat(isServerUpload && isDocker ? "s3/" : "").concat(_env.default.AWS_S3_UPLOAD_BUCKET_NAME);
  }
  getUploadUrl(isServerUpload) {
    return this.getPublicEndpoint(isServerUpload);
  }
  getUrlForKey(key) {
    return "".concat(this.getPublicEndpoint(), "/").concat(key);
  }
  async deleteFile(key) {
    (0, _invariant.default)(_env.default.AWS_S3_UPLOAD_BUCKET_NAME, "AWS_S3_UPLOAD_BUCKET_NAME is required");
    await this.client.deleteObject({
      Bucket: _env.default.AWS_S3_UPLOAD_BUCKET_NAME,
      Key: key
    }).promise();
  }
  getFileHandle(key) {
    return new Promise((resolve, reject) => {
      _tmp.default.dir((err, tmpDir) => {
        if (err) {
          return reject(err);
        }
        const tmpFile = _path.default.join(tmpDir, "tmp");
        const dest = _fsExtra.default.createWriteStream(tmpFile);
        dest.on("error", reject);
        dest.on("finish", () => resolve({
          path: tmpFile,
          cleanup: () => _fsExtra.default.rm(tmpFile)
        }));
        const stream = this.getFileStream(key);
        if (!stream) {
          return reject(new Error("No stream available"));
        }
        stream.on("error", err => {
          dest.end();
          reject(err);
        }).pipe(dest);
      });
    });
  }
  getFileStream(key) {
    (0, _invariant.default)(_env.default.AWS_S3_UPLOAD_BUCKET_NAME, "AWS_S3_UPLOAD_BUCKET_NAME is required");
    try {
      return this.client.getObject({
        Bucket: _env.default.AWS_S3_UPLOAD_BUCKET_NAME,
        Key: key
      }).createReadStream();
    } catch (err) {
      _Logger.default.error("Error getting file stream from S3 ", err, {
        key
      });
    }
    return null;
  }
  getEndpoint() {
    if (_env.default.AWS_S3_ACCELERATE_URL) {
      return _env.default.AWS_S3_ACCELERATE_URL;
    }

    // support old path-style S3 uploads and new virtual host uploads by
    // checking for the bucket name in the endpoint url.
    if (_env.default.AWS_S3_UPLOAD_BUCKET_NAME) {
      const url = new URL(_env.default.AWS_S3_UPLOAD_BUCKET_URL);
      if (url.hostname.startsWith(_env.default.AWS_S3_UPLOAD_BUCKET_NAME + ".")) {
        return undefined;
      }
    }
    return new _awsSdk.default.Endpoint(_env.default.AWS_S3_UPLOAD_BUCKET_URL);
  }
}
exports.default = S3Storage;