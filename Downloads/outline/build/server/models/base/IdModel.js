"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _sequelizeTypescript = require("sequelize-typescript");
var _Model = _interopRequireDefault(require("./Model"));
var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _descriptor, _descriptor2, _descriptor3;
/* eslint-disable @typescript-eslint/ban-types */
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }
function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }
let IdModel = (_dec = (0, _sequelizeTypescript.IsUUID)(4), _dec2 = (0, _sequelizeTypescript.Default)(_sequelizeTypescript.DataType.UUIDV4), _dec3 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec4 = Reflect.metadata("design:type", String), _dec5 = Reflect.metadata("design:type", typeof Date === "undefined" ? Object : Date), _dec6 = Reflect.metadata("design:type", typeof Date === "undefined" ? Object : Date), (_class = class IdModel extends _Model.default {
  constructor() {
    super(...arguments);
    _initializerDefineProperty(this, "id", _descriptor, this);
    _initializerDefineProperty(this, "createdAt", _descriptor2, this);
    _initializerDefineProperty(this, "updatedAt", _descriptor3, this);
  }
}, (_descriptor = _applyDecoratedDescriptor(_class.prototype, "id", [_dec, _sequelizeTypescript.PrimaryKey, _dec2, _dec3, _dec4], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "createdAt", [_sequelizeTypescript.CreatedAt, _dec5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "updatedAt", [_sequelizeTypescript.UpdatedAt, _dec6], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
})), _class));
var _default = exports.default = IdModel;