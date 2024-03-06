"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _sequelizeTypescript = require("sequelize-typescript");
var _WebhookSubscription = _interopRequireDefault(require("./WebhookSubscription"));
var _IdModel = _interopRequireDefault(require("./base/IdModel"));
var _Fix = _interopRequireDefault(require("./decorators/Fix"));
var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }
function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }
let WebhookDelivery = (_dec = (0, _sequelizeTypescript.Table)({
  tableName: "webhook_deliveries",
  modelName: "webhook_delivery"
}), _dec2 = (0, _sequelizeTypescript.IsIn)([["pending", "success", "failed"]]), _dec3 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.STRING), _dec4 = Reflect.metadata("design:type", typeof WebhookDeliveryStatus === "undefined" ? Object : WebhookDeliveryStatus), _dec5 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.INTEGER), _dec6 = Reflect.metadata("design:type", Number), _dec7 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.JSONB), _dec8 = Reflect.metadata("design:type", Object), _dec9 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.JSONB), _dec10 = Reflect.metadata("design:type", typeof Record === "undefined" ? Object : Record), _dec11 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.TEXT), _dec12 = Reflect.metadata("design:type", String), _dec13 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.JSONB), _dec14 = Reflect.metadata("design:type", typeof Record === "undefined" ? Object : Record), _dec15 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.DATE), _dec16 = Reflect.metadata("design:type", typeof Date === "undefined" ? Object : Date), _dec17 = (0, _sequelizeTypescript.BelongsTo)(() => _WebhookSubscription.default, "webhookSubscriptionId"), _dec18 = Reflect.metadata("design:type", typeof _WebhookSubscription.default === "undefined" ? Object : _WebhookSubscription.default), _dec19 = (0, _sequelizeTypescript.ForeignKey)(() => _WebhookSubscription.default), _dec20 = Reflect.metadata("design:type", String), _dec(_class = (0, _Fix.default)(_class = (_class2 = class WebhookDelivery extends _IdModel.default {
  constructor() {
    super(...arguments);
    _initializerDefineProperty(this, "status", _descriptor, this);
    _initializerDefineProperty(this, "statusCode", _descriptor2, this);
    _initializerDefineProperty(this, "requestBody", _descriptor3, this);
    _initializerDefineProperty(this, "requestHeaders", _descriptor4, this);
    _initializerDefineProperty(this, "responseBody", _descriptor5, this);
    _initializerDefineProperty(this, "responseHeaders", _descriptor6, this);
    _initializerDefineProperty(this, "createdAt", _descriptor7, this);
    // associations
    _initializerDefineProperty(this, "webhookSubscription", _descriptor8, this);
    _initializerDefineProperty(this, "webhookSubscriptionId", _descriptor9, this);
  }
}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "status", [_sequelizeTypescript.NotEmpty, _dec2, _dec3, _dec4], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "statusCode", [_dec5, _dec6], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "requestBody", [_dec7, _dec8], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "requestHeaders", [_dec9, _dec10], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "responseBody", [_dec11, _dec12], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "responseHeaders", [_dec13, _dec14], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "createdAt", [_dec15, _dec16], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "webhookSubscription", [_dec17, _dec18], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "webhookSubscriptionId", [_dec19, _sequelizeTypescript.Column, _dec20], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
})), _class2)) || _class) || _class);
var _default = exports.default = WebhookDelivery;