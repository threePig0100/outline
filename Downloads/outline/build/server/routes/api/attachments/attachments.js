"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _koaRouter = _interopRequireDefault(require("koa-router"));
var _uuid = require("uuid");
var _types = require("./../../../../shared/types");
var _files = require("./../../../../shared/utils/files");
var _validations = require("./../../../../shared/validations");
var _errors = require("./../../../errors");
var _authentication = _interopRequireDefault(require("./../../../middlewares/authentication"));
var _rateLimiter = require("./../../../middlewares/rateLimiter");
var _transaction = require("./../../../middlewares/transaction");
var _validate = _interopRequireDefault(require("./../../../middlewares/validate"));
var _models = require("./../../../models");
var _AttachmentHelper = _interopRequireDefault(require("./../../../models/helpers/AttachmentHelper"));
var _policies = require("./../../../policies");
var _presenters = require("./../../../presenters");
var _files2 = _interopRequireDefault(require("./../../../storage/files"));
var _BaseStorage = _interopRequireDefault(require("./../../../storage/files/BaseStorage"));
var _RateLimiter = require("./../../../utils/RateLimiter");
var _validation = require("./../../../validation");
var T = _interopRequireWildcard(require("./schema"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = new _koaRouter.default();
router.post("attachments.create", (0, _rateLimiter.rateLimiter)(_RateLimiter.RateLimiterStrategy.TenPerMinute), (0, _authentication.default)(), (0, _validate.default)(T.AttachmentsCreateSchema), (0, _transaction.transaction)(), async ctx => {
  const {
    name,
    documentId,
    contentType,
    size,
    preset
  } = ctx.input.body;
  const {
    auth,
    transaction
  } = ctx.state;
  const {
    user
  } = auth;

  // All user types can upload an avatar so no additional authorization is needed.
  if (preset === _types.AttachmentPreset.Avatar) {
    (0, _validation.assertIn)(contentType, _validations.AttachmentValidation.avatarContentTypes);
  } else if (preset === _types.AttachmentPreset.DocumentAttachment && documentId) {
    const document = await _models.Document.findByPk(documentId, {
      userId: user.id,
      transaction
    });
    (0, _policies.authorize)(user, "update", document);
  } else {
    (0, _policies.authorize)(user, "createAttachment", user.team);
  }
  const maxUploadSize = _AttachmentHelper.default.presetToMaxUploadSize(preset);
  if (size > maxUploadSize) {
    throw (0, _errors.ValidationError)("Sorry, this file is too large \u2013 the maximum size is ".concat((0, _files.bytesToHumanReadable)(maxUploadSize)));
  }
  const modelId = (0, _uuid.v4)();
  const acl = _AttachmentHelper.default.presetToAcl(preset);
  const key = _AttachmentHelper.default.getKey({
    acl,
    id: modelId,
    name,
    userId: user.id
  });
  const attachment = await _models.Attachment.create({
    id: modelId,
    key,
    acl,
    size,
    expiresAt: _AttachmentHelper.default.presetToExpiry(preset),
    contentType,
    documentId,
    teamId: user.teamId,
    userId: user.id
  }, {
    transaction
  });
  await _models.Event.create({
    name: "attachments.create",
    data: {
      name
    },
    modelId,
    teamId: user.teamId,
    actorId: user.id,
    ip: ctx.request.ip
  }, {
    transaction
  });
  const presignedPost = await _files2.default.getPresignedPost(key, acl, maxUploadSize, contentType);
  ctx.body = {
    data: {
      uploadUrl: _files2.default.getUploadUrl(),
      form: {
        "Cache-Control": "max-age=31557600",
        "Content-Type": contentType,
        ...presignedPost.fields
      },
      attachment: {
        ...(0, _presenters.presentAttachment)(attachment),
        // always use the redirect url for document attachments, as the serializer
        // depends on it to detect attachment vs link
        url: preset === _types.AttachmentPreset.DocumentAttachment ? attachment.redirectUrl : attachment.url
      }
    }
  };
});
router.post("attachments.delete", (0, _authentication.default)(), (0, _validate.default)(T.AttachmentDeleteSchema), async ctx => {
  const {
    id
  } = ctx.input.body;
  const {
    user
  } = ctx.state.auth;
  const attachment = await _models.Attachment.findByPk(id, {
    rejectOnEmpty: true
  });
  if (attachment.documentId) {
    const document = await _models.Document.findByPk(attachment.documentId, {
      userId: user.id
    });
    (0, _policies.authorize)(user, "update", document);
  }
  (0, _policies.authorize)(user, "delete", attachment);
  await attachment.destroy();
  await _models.Event.create({
    name: "attachments.delete",
    teamId: user.teamId,
    actorId: user.id,
    ip: ctx.request.ip
  });
  ctx.body = {
    success: true
  };
});
const handleAttachmentsRedirect = async ctx => {
  var _ctx$input$body$id;
  const id = (_ctx$input$body$id = ctx.input.body.id) !== null && _ctx$input$body$id !== void 0 ? _ctx$input$body$id : ctx.input.query.id;
  const {
    user
  } = ctx.state.auth;
  const attachment = await _models.Attachment.findByPk(id, {
    rejectOnEmpty: true
  });
  if (attachment.isPrivate && attachment.teamId !== user.teamId) {
    throw (0, _errors.AuthorizationError)();
  }
  await attachment.update({
    lastAccessedAt: new Date()
  });
  if (attachment.isPrivate) {
    ctx.set("Cache-Control", "max-age=".concat(_BaseStorage.default.defaultSignedUrlExpires, ", immutable"));
    ctx.redirect(await attachment.signedUrl);
  } else {
    ctx.set("Cache-Control", "max-age=604800, immutable");
    ctx.redirect(attachment.canonicalUrl);
  }
};
router.get("attachments.redirect", (0, _authentication.default)(), (0, _validate.default)(T.AttachmentsRedirectSchema), handleAttachmentsRedirect);
router.post("attachments.redirect", (0, _authentication.default)(), (0, _validate.default)(T.AttachmentsRedirectSchema), handleAttachmentsRedirect);
var _default = exports.default = router;