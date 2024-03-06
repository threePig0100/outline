"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _sequelizeTypescript = require("sequelize-typescript");
var _types = require("./../../shared/types");
var _Collection = _interopRequireDefault(require("./Collection"));
var _IntegrationAuthentication = _interopRequireDefault(require("./IntegrationAuthentication"));
var _Team = _interopRequireDefault(require("./Team"));
var _User = _interopRequireDefault(require("./User"));
var _IdModel = _interopRequireDefault(require("./base/IdModel"));
var _Fix = _interopRequireDefault(require("./decorators/Fix"));
var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }
function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }
let Integration = (_dec = (0, _sequelizeTypescript.Scopes)(() => ({
  withAuthentication: {
    include: [{
      model: _IntegrationAuthentication.default,
      as: "authentication",
      required: true
    }]
  }
})), _dec2 = (0, _sequelizeTypescript.Table)({
  tableName: "integrations",
  modelName: "integration"
}), _dec3 = (0, _sequelizeTypescript.IsIn)([Object.values(_types.IntegrationType)]), _dec4 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.STRING), _dec5 = Reflect.metadata("design:type", typeof _types.IntegrationType === "undefined" ? Object : _types.IntegrationType), _dec6 = (0, _sequelizeTypescript.IsIn)([Object.values(_types.IntegrationService)]), _dec7 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.STRING), _dec8 = Reflect.metadata("design:type", Object), _dec9 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.JSONB), _dec10 = Reflect.metadata("design:type", typeof IntegrationSettings === "undefined" ? Object : IntegrationSettings), _dec11 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.ARRAY(_sequelizeTypescript.DataType.STRING)), _dec12 = Reflect.metadata("design:type", Array), _dec13 = (0, _sequelizeTypescript.BelongsTo)(() => _User.default, "userId"), _dec14 = Reflect.metadata("design:type", typeof _User.default === "undefined" ? Object : _User.default), _dec15 = (0, _sequelizeTypescript.ForeignKey)(() => _User.default), _dec16 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec17 = Reflect.metadata("design:type", String), _dec18 = (0, _sequelizeTypescript.BelongsTo)(() => _Team.default, "teamId"), _dec19 = Reflect.metadata("design:type", typeof _Team.default === "undefined" ? Object : _Team.default), _dec20 = (0, _sequelizeTypescript.ForeignKey)(() => _Team.default), _dec21 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec22 = Reflect.metadata("design:type", String), _dec23 = (0, _sequelizeTypescript.BelongsTo)(() => _Collection.default, "collectionId"), _dec24 = Reflect.metadata("design:type", typeof _Collection.default === "undefined" ? Object : _Collection.default), _dec25 = (0, _sequelizeTypescript.ForeignKey)(() => _Collection.default), _dec26 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec27 = Reflect.metadata("design:type", String), _dec28 = (0, _sequelizeTypescript.BelongsTo)(() => _IntegrationAuthentication.default, "authenticationId"), _dec29 = Reflect.metadata("design:type", typeof _IntegrationAuthentication.default === "undefined" ? Object : _IntegrationAuthentication.default), _dec30 = (0, _sequelizeTypescript.ForeignKey)(() => _IntegrationAuthentication.default), _dec31 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec32 = Reflect.metadata("design:type", String), _dec(_class = _dec2(_class = (0, _Fix.default)(_class = (_class2 = class Integration extends _IdModel.default {
  constructor() {
    super(...arguments);
    _initializerDefineProperty(this, "type", _descriptor, this);
    _initializerDefineProperty(this, "service", _descriptor2, this);
    _initializerDefineProperty(this, "settings", _descriptor3, this);
    _initializerDefineProperty(this, "events", _descriptor4, this);
    // associations
    _initializerDefineProperty(this, "user", _descriptor5, this);
    _initializerDefineProperty(this, "userId", _descriptor6, this);
    _initializerDefineProperty(this, "team", _descriptor7, this);
    _initializerDefineProperty(this, "teamId", _descriptor8, this);
    _initializerDefineProperty(this, "collection", _descriptor9, this);
    _initializerDefineProperty(this, "collectionId", _descriptor10, this);
    _initializerDefineProperty(this, "authentication", _descriptor11, this);
    _initializerDefineProperty(this, "authenticationId", _descriptor12, this);
  }
}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "type", [_dec3, _dec4, _dec5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "service", [_dec6, _dec7, _dec8], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "settings", [_dec9, _dec10], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "events", [_dec11, _dec12], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "user", [_dec13, _dec14], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "userId", [_dec15, _dec16, _dec17], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "team", [_dec18, _dec19], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "teamId", [_dec20, _dec21, _dec22], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "collection", [_dec23, _dec24], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "collectionId", [_dec25, _dec26, _dec27], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "authentication", [_dec28, _dec29], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "authenticationId", [_dec30, _dec31, _dec32], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
})), _class2)) || _class) || _class) || _class);
var _default = exports.default = Integration;