"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _sequelize = require("sequelize");
var _sequelizeTypescript = require("sequelize-typescript");
var _validations = require("./../../shared/validations");
var _Document = _interopRequireDefault(require("./Document"));
var _User = _interopRequireDefault(require("./User"));
var _IdModel = _interopRequireDefault(require("./base/IdModel"));
var _Fix = _interopRequireDefault(require("./decorators/Fix"));
var _Length = _interopRequireDefault(require("./validators/Length"));
var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }
function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }
let Revision = (_dec = (0, _sequelizeTypescript.DefaultScope)(() => ({
  include: [{
    model: _User.default,
    as: "user",
    paranoid: false
  }]
})), _dec2 = (0, _sequelizeTypescript.Table)({
  tableName: "revisions",
  modelName: "revision"
}), _dec3 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.SMALLINT), _dec4 = Reflect.metadata("design:type", Number), _dec5 = (0, _sequelizeTypescript.Length)({
  max: 255,
  msg: "editorVersion must be 255 characters or less"
}), _dec6 = Reflect.metadata("design:type", String), _dec7 = (0, _Length.default)({
  max: _validations.DocumentValidation.maxTitleLength,
  msg: "Revision title must be ".concat(_validations.DocumentValidation.maxTitleLength, " characters or less")
}), _dec8 = Reflect.metadata("design:type", String), _dec9 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.TEXT), _dec10 = Reflect.metadata("design:type", String), _dec11 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.JSONB), _dec12 = Reflect.metadata("design:type", typeof ProsemirrorData === "undefined" ? Object : ProsemirrorData), _dec13 = (0, _Length.default)({
  max: 1,
  msg: "Emoji must be a single character"
}), _dec14 = Reflect.metadata("design:type", String), _dec15 = (0, _sequelizeTypescript.BelongsTo)(() => _Document.default, "documentId"), _dec16 = Reflect.metadata("design:type", typeof _Document.default === "undefined" ? Object : _Document.default), _dec17 = (0, _sequelizeTypescript.ForeignKey)(() => _Document.default), _dec18 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec19 = Reflect.metadata("design:type", String), _dec20 = (0, _sequelizeTypescript.BelongsTo)(() => _User.default, "userId"), _dec21 = Reflect.metadata("design:type", typeof _User.default === "undefined" ? Object : _User.default), _dec22 = (0, _sequelizeTypescript.ForeignKey)(() => _User.default), _dec23 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec24 = Reflect.metadata("design:type", String), _dec(_class = _dec2(_class = (0, _Fix.default)(_class = (_class2 = class Revision extends _IdModel.default {
  constructor() {
    super(...arguments);
    _initializerDefineProperty(this, "version", _descriptor, this);
    _initializerDefineProperty(this, "editorVersion", _descriptor2, this);
    _initializerDefineProperty(this, "title", _descriptor3, this);
    /**
     * The content of the revision as Markdown.
     *
     * @deprecated Use `content` instead, or `DocumentHelper.toMarkdown` if exporting lossy markdown.
     * This column will be removed in a future migration.
     */
    _initializerDefineProperty(this, "text", _descriptor4, this);
    /**
     * The content of the revision as JSON.
     */
    _initializerDefineProperty(this, "content", _descriptor5, this);
    _initializerDefineProperty(this, "emoji", _descriptor6, this);
    // associations
    _initializerDefineProperty(this, "document", _descriptor7, this);
    _initializerDefineProperty(this, "documentId", _descriptor8, this);
    _initializerDefineProperty(this, "user", _descriptor9, this);
    _initializerDefineProperty(this, "userId", _descriptor10, this);
  }
  // static methods

  /**
   * Find the latest revision for a given document
   *
   * @param documentId The document id to find the latest revision for
   * @returns A Promise that resolves to a Revision model
   */
  static findLatest(documentId) {
    return this.findOne({
      where: {
        documentId
      },
      order: [["createdAt", "DESC"]]
    });
  }

  /**
   * Build a Revision model from a Document model
   *
   * @param document The document to build from
   * @returns A Revision model
   */
  static buildFromDocument(document) {
    return this.build({
      title: document.title,
      text: document.text,
      emoji: document.emoji,
      content: document.content,
      userId: document.lastModifiedById,
      editorVersion: document.editorVersion,
      version: document.version,
      documentId: document.id,
      // revision time is set to the last time document was touched as this
      // handler can be debounced in the case of an update
      createdAt: document.updatedAt
    });
  }

  /**
   * Create a Revision model from a Document model and save it to the database
   *
   * @param document The document to create from
   * @param options Options passed to the save method
   * @returns A Promise that resolves when saved
   */
  static createFromDocument(document, options) {
    const revision = this.buildFromDocument(document);
    return revision.save(options);
  }

  // instance methods

  /**
   * Find the revision for the document before this one.
   *
   * @returns A Promise that resolves to a Revision, or null if this is the first revision.
   */
  before() {
    return this.constructor.findOne({
      where: {
        documentId: this.documentId,
        createdAt: {
          [_sequelize.Op.lt]: this.createdAt
        }
      },
      order: [["createdAt", "DESC"]]
    });
  }
}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "version", [_sequelizeTypescript.IsNumeric, _dec3, _dec4], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "editorVersion", [_dec5, _sequelizeTypescript.Column, _dec6], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "title", [_dec7, _sequelizeTypescript.Column, _dec8], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "text", [_dec9, _dec10], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "content", [_dec11, _dec12], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "emoji", [_dec13, _sequelizeTypescript.Column, _dec14], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "document", [_dec15, _dec16], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "documentId", [_dec17, _dec18, _dec19], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "user", [_dec20, _dec21], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "userId", [_dec22, _dec23, _dec24], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
})), _class2)) || _class) || _class) || _class);
var _default = exports.default = Revision;