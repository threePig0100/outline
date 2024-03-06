"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _sequelize = require("sequelize");
var _sequelizeTypescript = require("sequelize-typescript");
var _env = _interopRequireDefault(require("./../env"));
var _Model = _interopRequireDefault(require("./base/Model"));
var _azure = _interopRequireDefault(require("./../utils/azure"));
var _google = _interopRequireDefault(require("./../utils/google"));
var _oidc = _interopRequireDefault(require("./../utils/oidc"));
var _errors = require("../errors");
var _Team = _interopRequireDefault(require("./Team"));
var _UserAuthentication = _interopRequireDefault(require("./UserAuthentication"));
var _Fix = _interopRequireDefault(require("./decorators/Fix"));
var _Length = _interopRequireDefault(require("./validators/Length"));
var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }
function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }
let AuthenticationProvider = (_dec = (0, _sequelizeTypescript.Table)({
  tableName: "authentication_providers",
  modelName: "authentication_provider",
  updatedAt: false
}), _dec2 = (0, _sequelizeTypescript.IsUUID)(4), _dec3 = (0, _sequelizeTypescript.Default)(_sequelizeTypescript.DataType.UUIDV4), _dec4 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec5 = Reflect.metadata("design:type", String), _dec6 = (0, _Length.default)({
  max: 255,
  msg: "name must be 255 characters or less"
}), _dec7 = Reflect.metadata("design:type", String), _dec8 = (0, _sequelizeTypescript.Default)(true), _dec9 = Reflect.metadata("design:type", Boolean), _dec10 = (0, _Length.default)({
  max: 255,
  msg: "providerId must be 255 characters or less"
}), _dec11 = Reflect.metadata("design:type", String), _dec12 = Reflect.metadata("design:type", typeof Date === "undefined" ? Object : Date), _dec13 = (0, _sequelizeTypescript.BelongsTo)(() => _Team.default, "teamId"), _dec14 = Reflect.metadata("design:type", typeof _Team.default === "undefined" ? Object : _Team.default), _dec15 = (0, _sequelizeTypescript.ForeignKey)(() => _Team.default), _dec16 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec17 = Reflect.metadata("design:type", String), _dec18 = (0, _sequelizeTypescript.HasMany)(() => _UserAuthentication.default, "providerId"), _dec19 = Reflect.metadata("design:type", Array), _dec(_class = (0, _Fix.default)(_class = (_class2 = class AuthenticationProvider extends _Model.default {
  constructor() {
    super(...arguments);
    _initializerDefineProperty(this, "id", _descriptor, this);
    _initializerDefineProperty(this, "name", _descriptor2, this);
    _initializerDefineProperty(this, "enabled", _descriptor3, this);
    _initializerDefineProperty(this, "providerId", _descriptor4, this);
    _initializerDefineProperty(this, "createdAt", _descriptor5, this);
    // associations
    _initializerDefineProperty(this, "team", _descriptor6, this);
    _initializerDefineProperty(this, "teamId", _descriptor7, this);
    _initializerDefineProperty(this, "userAuthentications", _descriptor8, this);
    _defineProperty(this, "disable", async options => {
      const res = await this.constructor.findAndCountAll({
        ...options,
        where: {
          teamId: this.teamId,
          enabled: true,
          id: {
            [_sequelize.Op.ne]: this.id
          }
        },
        limit: 1
      });
      if (res.count >= 1) {
        return this.update({
          enabled: false
        }, options);
      } else {
        throw (0, _errors.ValidationError)("At least one authentication provider is required");
      }
    });
    _defineProperty(this, "enable", options => this.update({
      enabled: true
    }, options));
  }
  // instance methods

  /**
   * Create an OAuthClient for this provider, if possible.
   *
   * @returns A configured OAuthClient instance
   */
  get oauthClient() {
    switch (this.name) {
      case "google":
        return new _google.default(_env.default.GOOGLE_CLIENT_ID || "", _env.default.GOOGLE_CLIENT_SECRET || "");
      case "azure":
        return new _azure.default(_env.default.AZURE_CLIENT_ID || "", _env.default.AZURE_CLIENT_SECRET || "");
      case "oidc":
        return new _oidc.default(_env.default.OIDC_CLIENT_ID || "", _env.default.OIDC_CLIENT_SECRET || "");
      default:
        return undefined;
    }
  }
}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "id", [_dec2, _sequelizeTypescript.PrimaryKey, _dec3, _dec4, _dec5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "name", [_dec6, _sequelizeTypescript.Column, _dec7], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "enabled", [_dec8, _sequelizeTypescript.Column, _dec9], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "providerId", [_dec10, _sequelizeTypescript.Column, _dec11], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "createdAt", [_sequelizeTypescript.CreatedAt, _dec12], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "team", [_dec13, _dec14], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "teamId", [_dec15, _dec16, _dec17], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "userAuthentications", [_dec18, _dec19], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
})), _class2)) || _class) || _class);
var _default = exports.default = AuthenticationProvider;