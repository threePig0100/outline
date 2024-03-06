"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _sequelizeTypescript = require("sequelize-typescript");
var _urlHelpers = require("./../../shared/utils/urlHelpers");
var _env = _interopRequireDefault(require("./../env"));
var _errors = require("./../errors");
var _Collection = _interopRequireDefault(require("./Collection"));
var _Document = _interopRequireDefault(require("./Document"));
var _Team = _interopRequireDefault(require("./Team"));
var _User = _interopRequireDefault(require("./User"));
var _IdModel = _interopRequireDefault(require("./base/IdModel"));
var _Fix = _interopRequireDefault(require("./decorators/Fix"));
var _IsFQDN = _interopRequireDefault(require("./validators/IsFQDN"));
var _Length = _interopRequireDefault(require("./validators/Length"));
var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _dec34, _dec35, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }
function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }
let Share = (_dec = (0, _sequelizeTypescript.DefaultScope)(() => ({
  include: [{
    association: "user",
    paranoid: false
  }, {
    association: "document",
    required: false
  }, {
    association: "team"
  }]
})), _dec2 = (0, _sequelizeTypescript.Scopes)(() => ({
  withCollectionPermissions: userId => ({
    include: [{
      model: _Document.default.scope("withDrafts"),
      paranoid: true,
      as: "document",
      include: [{
        attributes: ["id", "permission", "sharing", "teamId", "deletedAt"],
        model: _Collection.default.scope({
          method: ["withMembership", userId]
        }),
        as: "collection"
      }]
    }, {
      association: "user",
      paranoid: false
    }, {
      association: "team"
    }]
  })
})), _dec3 = (0, _sequelizeTypescript.Table)({
  tableName: "shares",
  modelName: "share"
}), _dec4 = Reflect.metadata("design:type", Boolean), _dec5 = Reflect.metadata("design:type", Boolean), _dec6 = Reflect.metadata("design:type", typeof Date === "undefined" ? Object : Date), _dec7 = Reflect.metadata("design:type", typeof Date === "undefined" ? Object : Date), _dec8 = (0, _sequelizeTypescript.Default)(0), _dec9 = Reflect.metadata("design:type", Number), _dec10 = (0, _sequelizeTypescript.Is)({
  args: _urlHelpers.SHARE_URL_SLUG_REGEX,
  msg: "Must be only alphanumeric and dashes"
}), _dec11 = Reflect.metadata("design:type", String), _dec12 = (0, _Length.default)({
  max: 255,
  msg: "domain must be 255 characters or less"
}), _dec13 = Reflect.metadata("design:type", String), _dec14 = Reflect.metadata("design:type", Function), _dec15 = Reflect.metadata("design:paramtypes", [Object, typeof SaveOptions === "undefined" ? Object : SaveOptions]), _dec16 = (0, _sequelizeTypescript.BelongsTo)(() => _User.default, "revokedById"), _dec17 = Reflect.metadata("design:type", typeof _User.default === "undefined" ? Object : _User.default), _dec18 = (0, _sequelizeTypescript.ForeignKey)(() => _User.default), _dec19 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec20 = Reflect.metadata("design:type", String), _dec21 = (0, _sequelizeTypescript.BelongsTo)(() => _User.default, "userId"), _dec22 = Reflect.metadata("design:type", typeof _User.default === "undefined" ? Object : _User.default), _dec23 = (0, _sequelizeTypescript.ForeignKey)(() => _User.default), _dec24 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec25 = Reflect.metadata("design:type", String), _dec26 = (0, _sequelizeTypescript.BelongsTo)(() => _Team.default, "teamId"), _dec27 = Reflect.metadata("design:type", typeof _Team.default === "undefined" ? Object : _Team.default), _dec28 = (0, _sequelizeTypescript.ForeignKey)(() => _Team.default), _dec29 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec30 = Reflect.metadata("design:type", String), _dec31 = (0, _sequelizeTypescript.BelongsTo)(() => _Document.default, "documentId"), _dec32 = Reflect.metadata("design:type", typeof _Document.default === "undefined" ? Object : _Document.default), _dec33 = (0, _sequelizeTypescript.ForeignKey)(() => _Document.default), _dec34 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec35 = Reflect.metadata("design:type", String), _dec(_class = _dec2(_class = _dec3(_class = (0, _Fix.default)(_class = (_class2 = class Share extends _IdModel.default {
  constructor() {
    super(...arguments);
    _initializerDefineProperty(this, "published", _descriptor, this);
    _initializerDefineProperty(this, "includeChildDocuments", _descriptor2, this);
    _initializerDefineProperty(this, "revokedAt", _descriptor3, this);
    _initializerDefineProperty(this, "lastAccessedAt", _descriptor4, this);
    /** Total count of times the shared link has been accessed */
    _initializerDefineProperty(this, "views", _descriptor5, this);
    _initializerDefineProperty(this, "urlId", _descriptor6, this);
    _initializerDefineProperty(this, "domain", _descriptor7, this);
    // associations
    _initializerDefineProperty(this, "revokedBy", _descriptor8, this);
    _initializerDefineProperty(this, "revokedById", _descriptor9, this);
    _initializerDefineProperty(this, "user", _descriptor10, this);
    _initializerDefineProperty(this, "userId", _descriptor11, this);
    _initializerDefineProperty(this, "team", _descriptor12, this);
    _initializerDefineProperty(this, "teamId", _descriptor13, this);
    _initializerDefineProperty(this, "document", _descriptor14, this);
    _initializerDefineProperty(this, "documentId", _descriptor15, this);
  }
  // hooks

  static async checkDomain(model, options) {
    if (!model.domain) {
      return model;
    }
    model.domain = model.domain.toLowerCase();
    const count = await _Team.default.count({
      ...options,
      where: {
        domain: model.domain
      }
    });
    if (count > 0) {
      throw (0, _errors.ValidationError)("Domain is already in use");
    }
    return model;
  }

  // getters

  get isRevoked() {
    return !!this.revokedAt;
  }
  get canonicalUrl() {
    if (this.domain) {
      const url = new URL(_env.default.URL);
      return "".concat(url.protocol, "//").concat(this.domain).concat(url.port ? ":".concat(url.port) : "");
    }
    return this.urlId ? "".concat(this.team.url, "/s/").concat(this.urlId) : "".concat(this.team.url, "/s/").concat(this.id);
  }
  revoke(userId) {
    this.revokedAt = new Date();
    this.revokedById = userId;
    return this.save();
  }
}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "published", [_sequelizeTypescript.Column, _dec4], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "includeChildDocuments", [_sequelizeTypescript.Column, _dec5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "revokedAt", [_sequelizeTypescript.Column, _dec6], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "lastAccessedAt", [_sequelizeTypescript.Column, _dec7], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "views", [_dec8, _sequelizeTypescript.Column, _dec9], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "urlId", [_sequelizeTypescript.AllowNull, _dec10, _sequelizeTypescript.Column, _dec11], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "domain", [_sequelizeTypescript.Unique, _dec12, _IsFQDN.default, _sequelizeTypescript.Column, _dec13], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class2, "checkDomain", [_sequelizeTypescript.BeforeUpdate, _dec14, _dec15], Object.getOwnPropertyDescriptor(_class2, "checkDomain"), _class2), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "revokedBy", [_dec16, _dec17], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "revokedById", [_dec18, _dec19, _dec20], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "user", [_dec21, _dec22], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "userId", [_dec23, _dec24, _dec25], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "team", [_dec26, _dec27], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "teamId", [_dec28, _dec29, _dec30], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "document", [_dec31, _dec32], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "documentId", [_dec33, _dec34, _dec35], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
})), _class2)) || _class) || _class) || _class) || _class);
var _default = exports.default = Share;