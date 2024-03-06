"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _dateFns = require("date-fns");
var _invariant = _interopRequireDefault(require("invariant"));
var _sequelizeTypescript = require("sequelize-typescript");
var _Logger = _interopRequireDefault(require("./../logging/Logger"));
var _AuthenticationProvider = _interopRequireDefault(require("./AuthenticationProvider"));
var _User = _interopRequireDefault(require("./User"));
var _IdModel = _interopRequireDefault(require("./base/IdModel"));
var _Encrypted = _interopRequireWildcard(require("./decorators/Encrypted"));
var _Fix = _interopRequireDefault(require("./decorators/Fix"));
var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8;
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }
function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }
let UserAuthentication = (_dec = (0, _sequelizeTypescript.Table)({
  tableName: "user_authentications",
  modelName: "user_authentication"
}), _dec2 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.ARRAY(_sequelizeTypescript.DataType.STRING)), _dec3 = Reflect.metadata("design:type", Array), _dec4 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.BLOB), _dec5 = Reflect.metadata("design:type", Function), _dec6 = Reflect.metadata("design:paramtypes", []), _dec7 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.BLOB), _dec8 = Reflect.metadata("design:type", Function), _dec9 = Reflect.metadata("design:paramtypes", []), _dec10 = Reflect.metadata("design:type", String), _dec11 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.DATE), _dec12 = Reflect.metadata("design:type", typeof Date === "undefined" ? Object : Date), _dec13 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.DATE), _dec14 = Reflect.metadata("design:type", typeof Date === "undefined" ? Object : Date), _dec15 = (0, _sequelizeTypescript.BelongsTo)(() => _User.default, "userId"), _dec16 = Reflect.metadata("design:type", typeof _User.default === "undefined" ? Object : _User.default), _dec17 = (0, _sequelizeTypescript.ForeignKey)(() => _User.default), _dec18 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec19 = Reflect.metadata("design:type", String), _dec20 = (0, _sequelizeTypescript.BelongsTo)(() => _AuthenticationProvider.default, "authenticationProviderId"), _dec21 = Reflect.metadata("design:type", typeof _AuthenticationProvider.default === "undefined" ? Object : _AuthenticationProvider.default), _dec22 = (0, _sequelizeTypescript.ForeignKey)(() => _AuthenticationProvider.default), _dec23 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec24 = Reflect.metadata("design:type", String), _dec25 = Reflect.metadata("design:type", Function), _dec26 = Reflect.metadata("design:paramtypes", [Object]), _dec(_class = (0, _Fix.default)(_class = (_class2 = class UserAuthentication extends _IdModel.default {
  constructor() {
    super(...arguments);
    _initializerDefineProperty(this, "scopes", _descriptor, this);
    _initializerDefineProperty(this, "providerId", _descriptor2, this);
    _initializerDefineProperty(this, "expiresAt", _descriptor3, this);
    _initializerDefineProperty(this, "lastValidatedAt", _descriptor4, this);
    // associations
    _initializerDefineProperty(this, "user", _descriptor5, this);
    _initializerDefineProperty(this, "userId", _descriptor6, this);
    _initializerDefineProperty(this, "authenticationProvider", _descriptor7, this);
    _initializerDefineProperty(this, "authenticationProviderId", _descriptor8, this);
  }
  get accessToken() {
    return (0, _Encrypted.getEncryptedColumn)(this, "accessToken");
  }
  set accessToken(value) {
    (0, _Encrypted.setEncryptedColumn)(this, "accessToken", value);
  }
  get refreshToken() {
    return (0, _Encrypted.getEncryptedColumn)(this, "refreshToken");
  }
  set refreshToken(value) {
    (0, _Encrypted.setEncryptedColumn)(this, "refreshToken", value);
  }
  static setValidated(model) {
    model.lastValidatedAt = new Date();
  }

  // instance methods

  /**
   * Validates that the tokens within this authentication record are still
   * valid. Will update the record with a new access token if it is expired.
   *
   * @param options SaveOptions
   * @param force Force validation to occur with third party provider
   * @returns true if the accessToken or refreshToken is still valid
   */
  async validateAccess(options) {
    let force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    // Check a maximum of once every 5 minutes
    if (this.lastValidatedAt > (0, _dateFns.subMinutes)(Date.now(), 5) && !force) {
      _Logger.default.debug("authentication", "Recently validated, skipping access token validation");
      return true;
    }
    const authenticationProvider = await this.$get("authenticationProvider", {
      transaction: options.transaction
    });
    (0, _invariant.default)(authenticationProvider, "authenticationProvider must exist for user authentication");
    try {
      await this.refreshAccessTokenIfNeeded(authenticationProvider, options);
      const client = authenticationProvider.oauthClient;
      if (client) {
        await client.userInfo(this.accessToken);
      }

      // write to db when we last checked
      this.lastValidatedAt = new Date();
      await this.save({
        transaction: options.transaction
      });
      return true;
    } catch (error) {
      if (error.id === "authentication_required") {
        return false;
      }

      // Throw unknown errors to trigger a retry of the task.
      throw error;
    }
  }

  /**
   * Updates the accessToken and refreshToken in the database if expiring. If the
   * accessToken is still valid or the AuthenticationProvider does not support
   * refreshTokens then no work is done.
   *
   * @param options SaveOptions
   * @returns true if the tokens were updated
   */
  async refreshAccessTokenIfNeeded(authenticationProvider, options) {
    if (this.expiresAt > (0, _dateFns.addMinutes)(Date.now(), 5)) {
      _Logger.default.debug("authentication", "Existing token is still valid, skipping refresh");
      return false;
    }
    if (!this.refreshToken) {
      _Logger.default.debug("authentication", "No refresh token found, skipping refresh");
      return false;
    }

    // Some providers send no expiry depending on setup, in this case we can't
    // refresh and assume the session is valid until logged out.
    if (!this.expiresAt) {
      _Logger.default.debug("authentication", "No expiry found, skipping refresh");
      return false;
    }
    _Logger.default.info("authentication", "Refreshing expiring access token", {
      id: this.id,
      userId: this.userId
    });
    const client = authenticationProvider.oauthClient;
    if (client) {
      const response = await client.rotateToken(this.accessToken, this.refreshToken);

      // Not all OAuth providers return a new refreshToken so we need to guard
      // against setting to an empty value.
      if (response.refreshToken) {
        this.refreshToken = response.refreshToken;
      }
      this.accessToken = response.accessToken;
      this.expiresAt = response.expiresAt;
      await this.save(options);
    }
    _Logger.default.info("authentication", "Successfully refreshed expired access token", {
      id: this.id,
      userId: this.userId
    });
    return true;
  }
}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "scopes", [_dec2, _dec3], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class2.prototype, "accessToken", [_dec4, _Encrypted.default, _dec5, _dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "accessToken"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "refreshToken", [_dec7, _Encrypted.default, _dec8, _dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "refreshToken"), _class2.prototype), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "providerId", [_sequelizeTypescript.Column, _dec10], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "expiresAt", [_dec11, _dec12], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "lastValidatedAt", [_dec13, _dec14], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "user", [_dec15, _dec16], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "userId", [_dec17, _dec18, _dec19], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "authenticationProvider", [_dec20, _dec21], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "authenticationProviderId", [_dec22, _sequelizeTypescript.Unique, _dec23, _dec24], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class2, "setValidated", [_sequelizeTypescript.BeforeCreate, _dec25, _dec26], Object.getOwnPropertyDescriptor(_class2, "setValidated"), _class2)), _class2)) || _class) || _class);
var _default = exports.default = UserAuthentication;