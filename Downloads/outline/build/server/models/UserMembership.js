"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _sequelize = require("sequelize");
var _sequelizeTypescript = require("sequelize-typescript");
var _types = require("./../../shared/types");
var _Collection = _interopRequireDefault(require("./Collection"));
var _Document = _interopRequireDefault(require("./Document"));
var _User = _interopRequireDefault(require("./User"));
var _IdModel = _interopRequireDefault(require("./base/IdModel"));
var _Fix = _interopRequireDefault(require("./decorators/Fix"));
var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _dec34, _dec35, _dec36, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }
function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }
let UserMembership = (_dec = (0, _sequelizeTypescript.Scopes)(() => ({
  withUser: {
    include: [{
      association: "user"
    }]
  },
  withCollection: {
    where: {
      collectionId: {
        [_sequelize.Op.ne]: null
      }
    },
    include: [{
      association: "collection"
    }]
  },
  withDocument: {
    where: {
      documentId: {
        [_sequelize.Op.ne]: null
      }
    },
    include: [{
      association: "document"
    }]
  }
})), _dec2 = (0, _sequelizeTypescript.Table)({
  tableName: "user_permissions",
  modelName: "user_permission"
}), _dec3 = (0, _sequelizeTypescript.Default)(_types.CollectionPermission.ReadWrite), _dec4 = (0, _sequelizeTypescript.IsIn)([Object.values(_types.CollectionPermission)]), _dec5 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.STRING), _dec6 = Reflect.metadata("design:type", Object), _dec7 = Reflect.metadata("design:type", String), _dec8 = (0, _sequelizeTypescript.BelongsTo)(() => _Collection.default, "collectionId"), _dec9 = Reflect.metadata("design:type", typeof _Collection.default === "undefined" ? Object : _Collection.default), _dec10 = (0, _sequelizeTypescript.ForeignKey)(() => _Collection.default), _dec11 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec12 = Reflect.metadata("design:type", String), _dec13 = (0, _sequelizeTypescript.BelongsTo)(() => _Document.default, "documentId"), _dec14 = Reflect.metadata("design:type", typeof _Document.default === "undefined" ? Object : _Document.default), _dec15 = (0, _sequelizeTypescript.ForeignKey)(() => _Document.default), _dec16 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec17 = Reflect.metadata("design:type", String), _dec18 = (0, _sequelizeTypescript.BelongsTo)(() => UserMembership, "sourceId"), _dec19 = Reflect.metadata("design:type", Object), _dec20 = (0, _sequelizeTypescript.ForeignKey)(() => UserMembership), _dec21 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec22 = Reflect.metadata("design:type", String), _dec23 = (0, _sequelizeTypescript.BelongsTo)(() => _User.default, "userId"), _dec24 = Reflect.metadata("design:type", typeof _User.default === "undefined" ? Object : _User.default), _dec25 = (0, _sequelizeTypescript.ForeignKey)(() => _User.default), _dec26 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec27 = Reflect.metadata("design:type", String), _dec28 = (0, _sequelizeTypescript.BelongsTo)(() => _User.default, "createdById"), _dec29 = Reflect.metadata("design:type", typeof _User.default === "undefined" ? Object : _User.default), _dec30 = (0, _sequelizeTypescript.ForeignKey)(() => _User.default), _dec31 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec32 = Reflect.metadata("design:type", String), _dec33 = Reflect.metadata("design:type", Function), _dec34 = Reflect.metadata("design:paramtypes", [Object, typeof SaveOptions === "undefined" ? Object : SaveOptions]), _dec35 = Reflect.metadata("design:type", Function), _dec36 = Reflect.metadata("design:paramtypes", [Object, typeof SaveOptions === "undefined" ? Object : SaveOptions]), _dec(_class = _dec2(_class = (0, _Fix.default)(_class = (_class2 = class UserMembership extends _IdModel.default {
  constructor() {
    super(...arguments);
    _initializerDefineProperty(this, "permission", _descriptor, this);
    _initializerDefineProperty(this, "index", _descriptor2, this);
    // associations
    /** The collection that this permission grants the user access to. */
    _initializerDefineProperty(this, "collection", _descriptor3, this);
    /** The collection ID that this permission grants the user access to. */
    _initializerDefineProperty(this, "collectionId", _descriptor4, this);
    /** The document that this permission grants the user access to. */
    _initializerDefineProperty(this, "document", _descriptor5, this);
    /** The document ID that this permission grants the user access to. */
    _initializerDefineProperty(this, "documentId", _descriptor6, this);
    /** If this represents the permission on a child then this points to the permission on the root */
    _initializerDefineProperty(this, "source", _descriptor7, this);
    /** If this represents the permission on a child then this points to the permission on the root */
    _initializerDefineProperty(this, "sourceId", _descriptor8, this);
    /** The user that this permission is granted to. */
    _initializerDefineProperty(this, "user", _descriptor9, this);
    /** The user ID that this permission is granted to. */
    _initializerDefineProperty(this, "userId", _descriptor10, this);
    /** The user that created this permission. */
    _initializerDefineProperty(this, "createdBy", _descriptor11, this);
    /** The user ID that created this permission. */
    _initializerDefineProperty(this, "createdById", _descriptor12, this);
  }
  /**
   * Find the root membership for a document and (optionally) user.
   *
   * @param documentId The document ID to find the membership for.
   * @param userId The user ID to find the membership for.
   * @param options Additional options to pass to the query.
   * @returns A promise that resolves to the root memberships for the document and user, or null.
   */
  static async findRootMembershipsForDocument(documentId, userId, options) {
    const memberships = await this.findAll({
      where: {
        documentId,
        ...(userId ? {
          userId
        } : {})
      }
    });
    const rootMemberships = await Promise.all(memberships.map(membership => membership !== null && membership !== void 0 && membership.sourceId ? this.findByPk(membership.sourceId, options) : membership));
    return rootMemberships.filter(Boolean);
  }
  static async updateSourcedMemberships(model, options) {
    if (model.sourceId || !model.documentId) {
      return;
    }
    const {
      transaction
    } = options;
    if (model.changed("permission")) {
      await this.update({
        permission: model.permission
      }, {
        where: {
          sourceId: model.id
        },
        transaction
      });
    }
  }
  static async createSourcedMemberships(model, options) {
    if (model.sourceId || !model.documentId) {
      return;
    }
    return this.recreateSourcedMemberships(model, options);
  }

  /**
   * Recreate all sourced permissions for a given permission.
   */
  static async recreateSourcedMemberships(model, options) {
    if (!model.documentId) {
      return;
    }
    const {
      transaction
    } = options;
    await this.destroy({
      where: {
        sourceId: model.id
      },
      transaction
    });
    const document = await _Document.default.unscoped().findOne({
      attributes: ["id"],
      where: {
        id: model.documentId
      },
      transaction
    });
    if (!document) {
      return;
    }
    const childDocumentIds = await document.findAllChildDocumentIds({
      publishedAt: {
        [_sequelize.Op.ne]: null
      }
    }, {
      transaction
    });
    for (const childDocumentId of childDocumentIds) {
      await this.create({
        documentId: childDocumentId,
        userId: model.userId,
        permission: model.permission,
        sourceId: model.id,
        createdById: model.createdById,
        createdAt: model.createdAt,
        updatedAt: model.updatedAt
      }, {
        transaction
      });
    }
  }
}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "permission", [_dec3, _dec4, _dec5, _dec6], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "index", [_sequelizeTypescript.AllowNull, _sequelizeTypescript.Column, _dec7], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "collection", [_dec8, _dec9], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "collectionId", [_dec10, _dec11, _dec12], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "document", [_dec13, _dec14], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "documentId", [_dec15, _dec16, _dec17], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "source", [_dec18, _dec19], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "sourceId", [_dec20, _dec21, _dec22], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "user", [_dec23, _dec24], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "userId", [_dec25, _dec26, _dec27], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "createdBy", [_dec28, _dec29], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "createdById", [_dec30, _dec31, _dec32], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class2, "updateSourcedMemberships", [_sequelizeTypescript.AfterUpdate, _dec33, _dec34], Object.getOwnPropertyDescriptor(_class2, "updateSourcedMemberships"), _class2), _applyDecoratedDescriptor(_class2, "createSourcedMemberships", [_sequelizeTypescript.AfterCreate, _dec35, _dec36], Object.getOwnPropertyDescriptor(_class2, "createSourcedMemberships"), _class2)), _class2)) || _class) || _class) || _class);
var _default = exports.default = UserMembership;