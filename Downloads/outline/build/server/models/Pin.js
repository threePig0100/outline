"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _sequelizeTypescript = require("sequelize-typescript");
var _Collection = _interopRequireDefault(require("./Collection"));
var _Document = _interopRequireDefault(require("./Document"));
var _Team = _interopRequireDefault(require("./Team"));
var _User = _interopRequireDefault(require("./User"));
var _IdModel = _interopRequireDefault(require("./base/IdModel"));
var _Fix = _interopRequireDefault(require("./decorators/Fix"));
var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }
function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }
let Pin = (_dec = (0, _sequelizeTypescript.Table)({
  tableName: "pins",
  modelName: "pin"
}), _dec2 = Reflect.metadata("design:type", String), _dec3 = (0, _sequelizeTypescript.BelongsTo)(() => _User.default, "createdById"), _dec4 = Reflect.metadata("design:type", typeof _User.default === "undefined" ? Object : _User.default), _dec5 = (0, _sequelizeTypescript.ForeignKey)(() => _User.default), _dec6 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec7 = Reflect.metadata("design:type", String), _dec8 = (0, _sequelizeTypescript.BelongsTo)(() => _Collection.default, "collectionId"), _dec9 = Reflect.metadata("design:type", typeof _Collection.default === "undefined" ? Object : _Collection.default), _dec10 = (0, _sequelizeTypescript.ForeignKey)(() => _Collection.default), _dec11 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec12 = Reflect.metadata("design:type", String), _dec13 = (0, _sequelizeTypescript.BelongsTo)(() => _Document.default, "documentId"), _dec14 = Reflect.metadata("design:type", typeof _Document.default === "undefined" ? Object : _Document.default), _dec15 = (0, _sequelizeTypescript.ForeignKey)(() => _Document.default), _dec16 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec17 = Reflect.metadata("design:type", String), _dec18 = (0, _sequelizeTypescript.BelongsTo)(() => _Team.default, "teamId"), _dec19 = Reflect.metadata("design:type", typeof _Team.default === "undefined" ? Object : _Team.default), _dec20 = (0, _sequelizeTypescript.ForeignKey)(() => _Team.default), _dec21 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec22 = Reflect.metadata("design:type", String), _dec(_class = (0, _Fix.default)(_class = (_class2 = class Pin extends _IdModel.default {
  constructor() {
    super(...arguments);
    _initializerDefineProperty(this, "index", _descriptor, this);
    // associations
    _initializerDefineProperty(this, "createdBy", _descriptor2, this);
    _initializerDefineProperty(this, "createdById", _descriptor3, this);
    _initializerDefineProperty(this, "collection", _descriptor4, this);
    _initializerDefineProperty(this, "collectionId", _descriptor5, this);
    _initializerDefineProperty(this, "document", _descriptor6, this);
    _initializerDefineProperty(this, "documentId", _descriptor7, this);
    _initializerDefineProperty(this, "team", _descriptor8, this);
    _initializerDefineProperty(this, "teamId", _descriptor9, this);
  }
}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "index", [_sequelizeTypescript.Column, _dec2], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "createdBy", [_dec3, _dec4], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "createdById", [_dec5, _dec6, _dec7], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "collection", [_dec8, _dec9], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "collectionId", [_dec10, _dec11, _dec12], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "document", [_dec13, _dec14], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "documentId", [_dec15, _dec16, _dec17], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "team", [_dec18, _dec19], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "teamId", [_dec20, _dec21, _dec22], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
})), _class2)) || _class) || _class);
var _default = exports.default = Pin;