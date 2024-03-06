"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _crypto = _interopRequireDefault(require("crypto"));
var _isEmpty = _interopRequireDefault(require("lodash/isEmpty"));
var _sequelizeTypescript = require("sequelize-typescript");
var _validations = require("./../../shared/validations");
var _errors = require("./../errors");
var _Team = _interopRequireDefault(require("./Team"));
var _User = _interopRequireDefault(require("./User"));
var _ParanoidModel = _interopRequireDefault(require("./base/ParanoidModel"));
var _Encrypted = _interopRequireWildcard(require("./decorators/Encrypted"));
var _Fix = _interopRequireDefault(require("./decorators/Fix"));
var _Length = _interopRequireDefault(require("./validators/Length"));
var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8;
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }
function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }
let WebhookSubscription = (_dec = (0, _sequelizeTypescript.DefaultScope)(() => ({
  include: [{
    association: "team",
    required: true
  }]
})), _dec2 = (0, _sequelizeTypescript.Table)({
  tableName: "webhook_subscriptions",
  modelName: "webhook_subscription"
}), _dec3 = (0, _Length.default)({
  max: 255,
  msg: "Webhook name be less than 255 characters"
}), _dec4 = Reflect.metadata("design:type", String), _dec5 = (0, _Length.default)({
  max: 255,
  msg: "Webhook url be less than 255 characters"
}), _dec6 = Reflect.metadata("design:type", String), _dec7 = Reflect.metadata("design:type", Boolean), _dec8 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.ARRAY(_sequelizeTypescript.DataType.STRING)), _dec9 = Reflect.metadata("design:type", Array), _dec10 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.BLOB), _dec11 = Reflect.metadata("design:type", Function), _dec12 = Reflect.metadata("design:paramtypes", []), _dec13 = (0, _sequelizeTypescript.BelongsTo)(() => _User.default, "createdById"), _dec14 = Reflect.metadata("design:type", typeof _User.default === "undefined" ? Object : _User.default), _dec15 = (0, _sequelizeTypescript.ForeignKey)(() => _User.default), _dec16 = Reflect.metadata("design:type", String), _dec17 = (0, _sequelizeTypescript.BelongsTo)(() => _Team.default, "teamId"), _dec18 = Reflect.metadata("design:type", typeof _Team.default === "undefined" ? Object : _Team.default), _dec19 = (0, _sequelizeTypescript.ForeignKey)(() => _Team.default), _dec20 = Reflect.metadata("design:type", String), _dec21 = Reflect.metadata("design:type", Function), _dec22 = Reflect.metadata("design:paramtypes", [Object]), _dec(_class = _dec2(_class = (0, _Fix.default)(_class = (_class2 = class WebhookSubscription extends _ParanoidModel.default {
  constructor() {
    super(...arguments);
    _initializerDefineProperty(this, "name", _descriptor, this);
    _initializerDefineProperty(this, "url", _descriptor2, this);
    _initializerDefineProperty(this, "enabled", _descriptor3, this);
    _initializerDefineProperty(this, "events", _descriptor4, this);
    // associations
    _initializerDefineProperty(this, "createdBy", _descriptor5, this);
    _initializerDefineProperty(this, "createdById", _descriptor6, this);
    _initializerDefineProperty(this, "team", _descriptor7, this);
    _initializerDefineProperty(this, "teamId", _descriptor8, this);
    /**
     * Determines if an event should be processed for this webhook subscription
     * based on the event configuration.
     *
     * @param event Event to ceck
     * @returns true if event is valid
     */
    _defineProperty(this, "validForEvent", event => {
      if (this.events.length === 1 && this.events[0] === "*") {
        return true;
      }
      for (const e of this.events) {
        if (e === event.name || event.name.startsWith(e + ".")) {
          return true;
        }
      }
      return false;
    });
    /**
     * Calculates the signature for a webhook payload if the webhook subscription
     * has an associated secret stored.
     *
     * @param payload The text payload of a webhook delivery
     * @returns the signature as a string
     */
    _defineProperty(this, "signature", payload => {
      if ((0, _isEmpty.default)(this.secret)) {
        return;
      }
      const signTimestamp = Date.now();
      const signature = _crypto.default.createHmac("sha256", this.secret).update("".concat(signTimestamp, ".").concat(payload)).digest("hex");
      return "t=".concat(signTimestamp, ",s=").concat(signature);
    });
  }
  get secret() {
    const val = (0, _Encrypted.getEncryptedColumn)(this, "secret");
    // Turns out that `val` evals to `{}` instead
    // of `null` even if secret's value in db is `null`.
    // https://github.com/defunctzombie/sequelize-encrypted/blob/c3854e76ae4b80318c8f10f94e6c898c67659ca6/index.js#L30-L33 explains it possibly.
    return (0, _isEmpty.default)(val) ? "" : val;
  }
  set secret(value) {
    (0, _Encrypted.setEncryptedColumn)(this, "secret", value);
  }
  // hooks

  static async checkLimit(model) {
    const count = await this.count({
      where: {
        teamId: model.teamId
      }
    });
    if (count >= _validations.WebhookSubscriptionValidation.maxSubscriptions) {
      throw (0, _errors.ValidationError)("You have reached the limit of ".concat(_validations.WebhookSubscriptionValidation.maxSubscriptions, " webhooks"));
    }
  }

  // methods

  /**
   * Disables the webhook subscription
   *
   * @param options Save options
   * @returns Promise<WebhookSubscription>
   */
  async disable(options) {
    return this.update({
      enabled: false
    }, options);
  }
}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "name", [_sequelizeTypescript.NotEmpty, _dec3, _sequelizeTypescript.Column, _dec4], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "url", [_sequelizeTypescript.IsUrl, _sequelizeTypescript.NotEmpty, _dec5, _sequelizeTypescript.Column, _dec6], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "enabled", [_sequelizeTypescript.Column, _dec7], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "events", [_dec8, _dec9], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class2.prototype, "secret", [_sequelizeTypescript.AllowNull, _Encrypted.default, _dec10, _dec11, _dec12], Object.getOwnPropertyDescriptor(_class2.prototype, "secret"), _class2.prototype), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "createdBy", [_dec13, _dec14], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "createdById", [_dec15, _sequelizeTypescript.Column, _dec16], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "team", [_dec17, _dec18], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "teamId", [_dec19, _sequelizeTypescript.Column, _dec20], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class2, "checkLimit", [_sequelizeTypescript.BeforeCreate, _dec21, _dec22], Object.getOwnPropertyDescriptor(_class2, "checkLimit"), _class2)), _class2)) || _class) || _class) || _class);
var _default = exports.default = WebhookSubscription;