"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _fs = require("fs");
var _path = _interopRequireDefault(require("path"));
var _sequelize = require("sequelize");
var _sequelizeTypescript = require("sequelize-typescript");
var _files = _interopRequireDefault(require("./../storage/files"));
var _validation = require("./../validation");
var _Document = _interopRequireDefault(require("./Document"));
var _Team = _interopRequireDefault(require("./Team"));
var _User = _interopRequireDefault(require("./User"));
var _IdModel = _interopRequireDefault(require("./base/IdModel"));
var _Fix = _interopRequireDefault(require("./decorators/Fix"));
var _Length = _interopRequireDefault(require("./validators/Length"));
var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }
function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }
let Attachment = (_dec = (0, _sequelizeTypescript.Table)({
  tableName: "attachments",
  modelName: "attachment"
}), _dec2 = (0, _Length.default)({
  max: 4096,
  msg: "key must be 4096 characters or less"
}), _dec3 = Reflect.metadata("design:type", String), _dec4 = (0, _Length.default)({
  max: 255,
  msg: "contentType must be 255 characters or less"
}), _dec5 = Reflect.metadata("design:type", String), _dec6 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.BIGINT), _dec7 = Reflect.metadata("design:type", Number), _dec8 = (0, _sequelizeTypescript.Default)("public-read"), _dec9 = (0, _sequelizeTypescript.IsIn)([["private", "public-read"]]), _dec10 = Reflect.metadata("design:type", String), _dec11 = Reflect.metadata("design:type", typeof Date === "undefined" ? Object : Date), _dec12 = Reflect.metadata("design:type", typeof Date === "undefined" ? Object : Date), _dec13 = Reflect.metadata("design:type", Function), _dec14 = Reflect.metadata("design:paramtypes", [Object]), _dec15 = Reflect.metadata("design:type", Function), _dec16 = Reflect.metadata("design:paramtypes", [Object]), _dec17 = (0, _sequelizeTypescript.BelongsTo)(() => _Team.default, "teamId"), _dec18 = Reflect.metadata("design:type", typeof _Team.default === "undefined" ? Object : _Team.default), _dec19 = (0, _sequelizeTypescript.ForeignKey)(() => _Team.default), _dec20 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec21 = Reflect.metadata("design:type", String), _dec22 = (0, _sequelizeTypescript.BelongsTo)(() => _Document.default, "documentId"), _dec23 = Reflect.metadata("design:type", typeof _Document.default === "undefined" ? Object : _Document.default), _dec24 = (0, _sequelizeTypescript.ForeignKey)(() => _Document.default), _dec25 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec26 = Reflect.metadata("design:type", String), _dec27 = (0, _sequelizeTypescript.BelongsTo)(() => _User.default, "userId"), _dec28 = Reflect.metadata("design:type", typeof _User.default === "undefined" ? Object : _User.default), _dec29 = (0, _sequelizeTypescript.ForeignKey)(() => _User.default), _dec30 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec31 = Reflect.metadata("design:type", String), _dec(_class = (0, _Fix.default)(_class = (_class2 = class Attachment extends _IdModel.default {
  constructor() {
    super(...arguments);
    _initializerDefineProperty(this, "key", _descriptor, this);
    _initializerDefineProperty(this, "contentType", _descriptor2, this);
    _initializerDefineProperty(this, "size", _descriptor3, this);
    _initializerDefineProperty(this, "acl", _descriptor4, this);
    _initializerDefineProperty(this, "lastAccessedAt", _descriptor5, this);
    _initializerDefineProperty(this, "expiresAt", _descriptor6, this);
    // associations
    _initializerDefineProperty(this, "team", _descriptor7, this);
    _initializerDefineProperty(this, "teamId", _descriptor8, this);
    _initializerDefineProperty(this, "document", _descriptor9, this);
    _initializerDefineProperty(this, "documentId", _descriptor10, this);
    _initializerDefineProperty(this, "user", _descriptor11, this);
    _initializerDefineProperty(this, "userId", _descriptor12, this);
  }
  // getters

  /**
   * Get the original uploaded file name.
   */
  get name() {
    return _path.default.parse(this.key).base;
  }

  /**
   * Whether the attachment is private or not.
   */
  get isPrivate() {
    return this.acl === "private";
  }

  /**
   * Get the contents of this attachment as a readable stream.
   */
  get stream() {
    return _files.default.getFileStream(this.key);
  }

  /**
   * Get the contents of this attachment as a buffer.
   */
  get buffer() {
    return _files.default.getFileBuffer(this.key);
  }

  /**
   * Get a url that can be used to download the attachment if the user has a valid session.
   */
  get url() {
    return this.isPrivate ? this.redirectUrl : this.canonicalUrl;
  }

  /**
   * Get a url that can be used to download a private attachment if the user has a valid session.
   */
  get redirectUrl() {
    return Attachment.getRedirectUrl(this.id);
  }

  /**
   * Get a direct URL to the attachment in storage. Note that this will not work
   * for private attachments, a signed URL must be used.
   */
  get canonicalUrl() {
    return encodeURI(_files.default.getUrlForKey(this.key));
  }

  /**
   * Get a signed URL with the default expiry to download the attachment from storage.
   */
  get signedUrl() {
    return _files.default.getSignedUrl(this.key);
  }

  /**
   * Store the given file in storage at the location specified by the attachment key.
   * If the attachment already exists, an error will be thrown.
   *
   * @param file The file to store
   * @returns A promise resolving to the attachment
   */
  async writeFile(file) {
    return _files.default.store({
      body: (0, _fs.createReadStream)(file.filepath),
      contentLength: file.size,
      contentType: this.contentType,
      key: this.key,
      acl: this.acl
    });
  }

  // hooks

  static async sanitizeKey(model) {
    model.key = _validation.ValidateKey.sanitize(model.key);
    return model;
  }
  static async deleteAttachmentFromS3(model) {
    await _files.default.deleteFile(model.key);
  }

  // static methods

  /**
   * Get the total size of all attachments for a given team.
   *
   * @param teamId - The ID of the team to get the total size for.
   * @returns A promise resolving to the total size of all attachments for the given team in bytes.
   */
  static async getTotalSizeForTeam(teamId) {
    var _result$0$total, _result$;
    const result = await this.sequelize.query("\n      SELECT SUM(size) as total\n      FROM attachments\n      WHERE \"teamId\" = :teamId\n    ", {
      replacements: {
        teamId
      },
      type: _sequelize.QueryTypes.SELECT
    });
    return parseInt((_result$0$total = result === null || result === void 0 ? void 0 : (_result$ = result[0]) === null || _result$ === void 0 ? void 0 : _result$.total) !== null && _result$0$total !== void 0 ? _result$0$total : "0", 10);
  }

  /**
   * Get the redirect URL for a private attachment. Use `attachment.redirectUrl` if you already have
   * an instance of the attachment.
   *
   * @param id The ID of the attachment to get the redirect URL for.
   * @returns The redirect URL for the attachment.
   */
  static getRedirectUrl(id) {
    return "/api/attachments.redirect?id=".concat(id);
  }
}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "key", [_dec2, _sequelizeTypescript.Column, _dec3], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "contentType", [_dec4, _sequelizeTypescript.Column, _dec5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "size", [_sequelizeTypescript.IsNumeric, _dec6, _dec7], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "acl", [_dec8, _dec9, _sequelizeTypescript.Column, _dec10], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "lastAccessedAt", [_sequelizeTypescript.Column, _dec11], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "expiresAt", [_sequelizeTypescript.Column, _dec12], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class2, "sanitizeKey", [_sequelizeTypescript.BeforeUpdate, _dec13, _dec14], Object.getOwnPropertyDescriptor(_class2, "sanitizeKey"), _class2), _applyDecoratedDescriptor(_class2, "deleteAttachmentFromS3", [_sequelizeTypescript.BeforeDestroy, _dec15, _dec16], Object.getOwnPropertyDescriptor(_class2, "deleteAttachmentFromS3"), _class2), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "team", [_dec17, _dec18], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "teamId", [_dec19, _dec20, _dec21], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "document", [_dec22, _dec23], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "documentId", [_dec24, _dec25, _dec26], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "user", [_dec27, _dec28], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "userId", [_dec29, _dec30, _dec31], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
})), _class2)) || _class) || _class);
var _default = exports.default = Attachment;