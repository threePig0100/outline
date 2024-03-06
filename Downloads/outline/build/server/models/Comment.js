"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _sequelizeTypescript = require("sequelize-typescript");
var _validations = require("./../../shared/validations");
var _Document = _interopRequireDefault(require("./Document"));
var _User = _interopRequireDefault(require("./User"));
var _ParanoidModel = _interopRequireDefault(require("./base/ParanoidModel"));
var _Fix = _interopRequireDefault(require("./decorators/Fix"));
var _TextLength = _interopRequireDefault(require("./validators/TextLength"));
var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }
function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }
let Comment = (_dec = (0, _sequelizeTypescript.DefaultScope)(() => ({
  include: [{
    model: _User.default,
    as: "createdBy",
    paranoid: false
  }]
})), _dec2 = (0, _sequelizeTypescript.Table)({
  tableName: "comments",
  modelName: "comment"
}), _dec3 = (0, _TextLength.default)({
  max: _validations.CommentValidation.maxLength,
  msg: "Comment must be less than ".concat(_validations.CommentValidation.maxLength, " characters")
}), _dec4 = (0, _sequelizeTypescript.Length)({
  max: _validations.CommentValidation.maxLength * 10,
  msg: "Comment data is too large"
}), _dec5 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.JSONB), _dec6 = Reflect.metadata("design:type", typeof ProsemirrorData === "undefined" ? Object : ProsemirrorData), _dec7 = (0, _sequelizeTypescript.BelongsTo)(() => _User.default, "createdById"), _dec8 = Reflect.metadata("design:type", typeof _User.default === "undefined" ? Object : _User.default), _dec9 = (0, _sequelizeTypescript.ForeignKey)(() => _User.default), _dec10 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec11 = Reflect.metadata("design:type", String), _dec12 = (0, _sequelizeTypescript.BelongsTo)(() => _User.default, "resolvedById"), _dec13 = Reflect.metadata("design:type", typeof _User.default === "undefined" ? Object : _User.default), _dec14 = (0, _sequelizeTypescript.ForeignKey)(() => _User.default), _dec15 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec16 = Reflect.metadata("design:type", String), _dec17 = (0, _sequelizeTypescript.BelongsTo)(() => _Document.default, "documentId"), _dec18 = Reflect.metadata("design:type", typeof _Document.default === "undefined" ? Object : _Document.default), _dec19 = (0, _sequelizeTypescript.ForeignKey)(() => _Document.default), _dec20 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec21 = Reflect.metadata("design:type", String), _dec22 = (0, _sequelizeTypescript.BelongsTo)(() => Comment, "parentCommentId"), _dec23 = Reflect.metadata("design:type", Object), _dec24 = (0, _sequelizeTypescript.ForeignKey)(() => Comment), _dec25 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec26 = Reflect.metadata("design:type", String), _dec(_class = _dec2(_class = (0, _Fix.default)(_class = (_class2 = class Comment extends _ParanoidModel.default {
  constructor() {
    super(...arguments);
    _initializerDefineProperty(this, "data", _descriptor, this);
    // associations
    _initializerDefineProperty(this, "createdBy", _descriptor2, this);
    _initializerDefineProperty(this, "createdById", _descriptor3, this);
    _initializerDefineProperty(this, "resolvedBy", _descriptor4, this);
    _initializerDefineProperty(this, "resolvedById", _descriptor5, this);
    _initializerDefineProperty(this, "document", _descriptor6, this);
    _initializerDefineProperty(this, "documentId", _descriptor7, this);
    _initializerDefineProperty(this, "parentComment", _descriptor8, this);
    _initializerDefineProperty(this, "parentCommentId", _descriptor9, this);
  }
}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "data", [_dec3, _dec4, _dec5, _dec6], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "createdBy", [_dec7, _dec8], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "createdById", [_dec9, _dec10, _dec11], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "resolvedBy", [_dec12, _dec13], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "resolvedById", [_dec14, _dec15, _dec16], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "document", [_dec17, _dec18], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "documentId", [_dec19, _dec20, _dec21], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "parentComment", [_dec22, _dec23], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "parentCommentId", [_dec24, _dec25, _dec26], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
})), _class2)) || _class) || _class) || _class);
var _default = exports.default = Comment;