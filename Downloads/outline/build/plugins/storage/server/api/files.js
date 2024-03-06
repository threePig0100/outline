"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _koaRouter = _interopRequireDefault(require("koa-router"));
var _mimeTypes = _interopRequireDefault(require("mime-types"));
var _env = _interopRequireDefault(require("./../../../../server/env"));
var _errors = require("./../../../../server/errors");
var _authentication = _interopRequireDefault(require("./../../../../server/middlewares/authentication"));
var _multipart = _interopRequireDefault(require("./../../../../server/middlewares/multipart"));
var _rateLimiter = require("./../../../../server/middlewares/rateLimiter");
var _validate = _interopRequireDefault(require("./../../../../server/middlewares/validate"));
var _models = require("./../../../../server/models");
var _AttachmentHelper = _interopRequireDefault(require("./../../../../server/models/helpers/AttachmentHelper"));
var _policies = require("./../../../../server/policies");
var _files = _interopRequireDefault(require("./../../../../server/storage/files"));
var _RateLimiter = require("./../../../../server/utils/RateLimiter");
var _jwt = require("./../../../../server/utils/jwt");
var _utils = require("../utils");
var T = _interopRequireWildcard(require("./schema"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
(0, _utils.createRootDirForLocalStorage)();
const router = new _koaRouter.default();
router.post("files.create", (0, _rateLimiter.rateLimiter)(_RateLimiter.RateLimiterStrategy.TenPerMinute), (0, _authentication.default)(), (0, _validate.default)(T.FilesCreateSchema), (0, _multipart.default)({
  maximumFileSize: Math.max(_env.default.FILE_STORAGE_UPLOAD_MAX_SIZE, _env.default.MAXIMUM_IMPORT_SIZE)
}), async ctx => {
  const actor = ctx.state.auth.user;
  const {
    key
  } = ctx.input.body;
  const file = ctx.input.file;
  const attachment = await _models.Attachment.findOne({
    where: {
      key
    },
    rejectOnEmpty: true
  });
  if (attachment.userId !== actor.id) {
    throw (0, _errors.AuthorizationError)("Invalid key");
  }
  await attachment.writeFile(file);
  ctx.body = {
    success: true
  };
});
router.get("files.get", (0, _authentication.default)({
  optional: true
}), (0, _validate.default)(T.FilesGetSchema), async ctx => {
  const actor = ctx.state.auth.user;
  const key = getKeyFromContext(ctx);
  const isSignedRequest = !!ctx.input.query.sig;
  const {
    isPublicBucket,
    fileName
  } = _AttachmentHelper.default.parseKey(key);
  const skipAuthorize = isPublicBucket || isSignedRequest;
  const cacheHeader = "max-age=604800, immutable";
  if (skipAuthorize) {
    ctx.set("Cache-Control", cacheHeader);
    ctx.set("Content-Type", (fileName ? _mimeTypes.default.lookup(fileName) : undefined) || "application/octet-stream");
    ctx.attachment(fileName);
    ctx.body = _files.default.getFileStream(key);
  } else {
    const attachment = await _models.Attachment.findOne({
      where: {
        key
      },
      rejectOnEmpty: true
    });
    (0, _policies.authorize)(actor, "read", attachment);
    ctx.set("Cache-Control", cacheHeader);
    ctx.set("Content-Type", attachment.contentType);
    ctx.attachment(attachment.name);
    ctx.body = attachment.stream;
  }
});
function getKeyFromContext(ctx) {
  const {
    key,
    sig
  } = ctx.input.query;
  if (sig) {
    const payload = (0, _jwt.getJWTPayload)(sig);
    if (payload.type !== "attachment") {
      throw (0, _errors.AuthenticationError)("Invalid signature");
    }
    try {
      _jsonwebtoken.default.verify(sig, _env.default.SECRET_KEY);
    } catch (err) {
      throw (0, _errors.AuthenticationError)("Invalid signature");
    }
    return payload.key;
  }
  if (key) {
    return key;
  }
  throw (0, _errors.ValidationError)("Must provide either key or sig parameter");
}
var _default = exports.default = router;