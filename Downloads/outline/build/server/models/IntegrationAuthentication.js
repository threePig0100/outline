"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _sequelizeTypescript = require("sequelize-typescript");
var _types = require("./../../shared/types");
var _Team = _interopRequireDefault(require("./Team"));
var _User = _interopRequireDefault(require("./User"));
var _IdModel = _interopRequireDefault(require("./base/IdModel"));
var _Encrypted = _interopRequireWildcard(require("./decorators/Encrypted"));
var _Fix = _interopRequireDefault(require("./decorators/Fix"));
var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6;
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }
function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }
let IntegrationAuthentication = (_dec = (0, _sequelizeTypescript.Table)({
  tableName: "authentications",
  modelName: "authentication"
}), _dec2 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.STRING), _dec3 = Reflect.metadata("design:type", typeof _types.IntegrationService === "undefined" ? Object : _types.IntegrationService), _dec4 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.ARRAY(_sequelizeTypescript.DataType.STRING)), _dec5 = Reflect.metadata("design:type", Array), _dec6 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.BLOB), _dec7 = Reflect.metadata("design:type", Function), _dec8 = Reflect.metadata("design:paramtypes", []), _dec9 = (0, _sequelizeTypescript.BelongsTo)(() => _User.default, "userId"), _dec10 = Reflect.metadata("design:type", typeof _User.default === "undefined" ? Object : _User.default), _dec11 = (0, _sequelizeTypescript.ForeignKey)(() => _User.default), _dec12 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec13 = Reflect.metadata("design:type", String), _dec14 = (0, _sequelizeTypescript.BelongsTo)(() => _Team.default, "teamId"), _dec15 = Reflect.metadata("design:type", typeof _Team.default === "undefined" ? Object : _Team.default), _dec16 = (0, _sequelizeTypescript.ForeignKey)(() => _Team.default), _dec17 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec18 = Reflect.metadata("design:type", String), _dec(_class = (0, _Fix.default)(_class = (_class2 = class IntegrationAuthentication extends _IdModel.default {
  constructor() {
    super(...arguments);
    _initializerDefineProperty(this, "service", _descriptor, this);
    _initializerDefineProperty(this, "scopes", _descriptor2, this);
    // associations
    _initializerDefineProperty(this, "user", _descriptor3, this);
    _initializerDefineProperty(this, "userId", _descriptor4, this);
    _initializerDefineProperty(this, "team", _descriptor5, this);
    _initializerDefineProperty(this, "teamId", _descriptor6, this);
  }
  get token() {
    return (0, _Encrypted.getEncryptedColumn)(this, "token");
  }
  set token(value) {
    (0, _Encrypted.setEncryptedColumn)(this, "token", value);
  }
}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "service", [_dec2, _dec3], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "scopes", [_dec4, _dec5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class2.prototype, "token", [_dec6, _Encrypted.default, _dec7, _dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "token"), _class2.prototype), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "user", [_dec9, _dec10], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "userId", [_dec11, _dec12, _dec13], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "team", [_dec14, _dec15], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "teamId", [_dec16, _dec17, _dec18], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
})), _class2)) || _class) || _class);
var _default = exports.default = IntegrationAuthentication;