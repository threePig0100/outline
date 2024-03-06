"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _find = _interopRequireDefault(require("lodash/find"));
var _findIndex = _interopRequireDefault(require("lodash/findIndex"));
var _remove = _interopRequireDefault(require("lodash/remove"));
var _uniq = _interopRequireDefault(require("lodash/uniq"));
var _randomstring = _interopRequireDefault(require("randomstring"));
var _sequelizeTypescript = require("sequelize-typescript");
var _isUUID = _interopRequireDefault(require("validator/lib/isUUID"));
var _types = require("./../../shared/types");
var _collections = require("./../../shared/utils/collections");
var _slugify = _interopRequireDefault(require("./../../shared/utils/slugify"));
var _urlHelpers = require("./../../shared/utils/urlHelpers");
var _validations = require("./../../shared/validations");
var _errors = require("./../errors");
var _Document = _interopRequireDefault(require("./Document"));
var _FileOperation = _interopRequireDefault(require("./FileOperation"));
var _Group = _interopRequireDefault(require("./Group"));
var _GroupPermission = _interopRequireDefault(require("./GroupPermission"));
var _GroupUser = _interopRequireDefault(require("./GroupUser"));
var _Team = _interopRequireDefault(require("./Team"));
var _User = _interopRequireDefault(require("./User"));
var _UserMembership = _interopRequireDefault(require("./UserMembership"));
var _ParanoidModel = _interopRequireDefault(require("./base/ParanoidModel"));
var _Fix = _interopRequireDefault(require("./decorators/Fix"));
var _IsHexColor = _interopRequireDefault(require("./validators/IsHexColor"));
var _Length = _interopRequireDefault(require("./validators/Length"));
var _NotContainsUrl = _interopRequireDefault(require("./validators/NotContainsUrl"));
var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _dec34, _dec35, _dec36, _dec37, _dec38, _dec39, _dec40, _dec41, _dec42, _dec43, _dec44, _dec45, _dec46, _dec47, _dec48, _dec49, _dec50, _dec51, _dec52, _dec53, _dec54, _dec55, _dec56, _dec57, _dec58, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _class3;
/* eslint-disable lines-between-class-members */
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }
function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }
let Collection = (_dec = (0, _sequelizeTypescript.Scopes)(() => ({
  withAllMemberships: {
    include: [{
      model: _UserMembership.default,
      as: "memberships",
      required: false
    }, {
      model: _GroupPermission.default,
      as: "collectionGroupMemberships",
      required: false,
      // use of "separate" property: sequelize breaks when there are
      // nested "includes" with alternating values for "required"
      // see https://github.com/sequelize/sequelize/issues/9869
      separate: true,
      // include for groups that are members of this collection,
      // of which userId is a member of, resulting in:
      // CollectionGroup [inner join] Group [inner join] GroupUser [where] userId
      include: [{
        model: _Group.default,
        as: "group",
        required: true,
        include: [{
          model: _GroupUser.default,
          as: "groupMemberships",
          required: true
        }]
      }]
    }]
  },
  withUser: () => ({
    include: [{
      model: _User.default,
      required: true,
      as: "user"
    }]
  }),
  withMembership: userId => ({
    include: [{
      model: _UserMembership.default,
      as: "memberships",
      where: {
        userId
      },
      required: false
    }, {
      model: _GroupPermission.default,
      as: "collectionGroupMemberships",
      required: false,
      // use of "separate" property: sequelize breaks when there are
      // nested "includes" with alternating values for "required"
      // see https://github.com/sequelize/sequelize/issues/9869
      separate: true,
      // include for groups that are members of this collection,
      // of which userId is a member of, resulting in:
      // CollectionGroup [inner join] Group [inner join] GroupUser [where] userId
      include: [{
        model: _Group.default,
        as: "group",
        required: true,
        include: [{
          model: _GroupUser.default,
          as: "groupMemberships",
          required: true,
          where: {
            userId
          }
        }]
      }]
    }]
  })
})), _dec2 = (0, _sequelizeTypescript.Table)({
  tableName: "collections",
  modelName: "collection"
}), _dec3 = (0, _sequelizeTypescript.Length)({
  min: 10,
  max: 10,
  msg: "urlId must be 10 characters"
}), _dec4 = Reflect.metadata("design:type", String), _dec5 = (0, _Length.default)({
  max: _validations.CollectionValidation.maxNameLength,
  msg: "name must be ".concat(_validations.CollectionValidation.maxNameLength, " characters or less")
}), _dec6 = Reflect.metadata("design:type", String), _dec7 = (0, _Length.default)({
  max: _validations.CollectionValidation.maxDescriptionLength,
  msg: "description must be ".concat(_validations.CollectionValidation.maxDescriptionLength, " characters or less")
}), _dec8 = Reflect.metadata("design:type", String), _dec9 = (0, _Length.default)({
  max: 50,
  msg: "icon must be 50 characters or less"
}), _dec10 = Reflect.metadata("design:type", String), _dec11 = Reflect.metadata("design:type", String), _dec12 = (0, _Length.default)({
  max: 100,
  msg: "index must be 100 characters or less"
}), _dec13 = Reflect.metadata("design:type", String), _dec14 = (0, _sequelizeTypescript.IsIn)([Object.values(_types.CollectionPermission)]), _dec15 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.STRING), _dec16 = Reflect.metadata("design:type", typeof _types.CollectionPermission === "undefined" ? Object : _types.CollectionPermission), _dec17 = (0, _sequelizeTypescript.Default)(false), _dec18 = Reflect.metadata("design:type", Boolean), _dec19 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.JSONB), _dec20 = Reflect.metadata("design:type", Array), _dec21 = (0, _sequelizeTypescript.Default)(true), _dec22 = Reflect.metadata("design:type", Boolean), _dec23 = (0, _sequelizeTypescript.Default)({
  field: "title",
  direction: "asc"
}), _dec24 = (0, _sequelizeTypescript.Column)({
  type: _sequelizeTypescript.DataType.JSONB,
  validate: {
    isSort(value) {
      if (typeof value !== "object" || !value.direction || !value.field || Object.keys(value).length !== 2) {
        throw new Error("Sort must be an object with field,direction");
      }
      if (!["asc", "desc"].includes(value.direction)) {
        throw new Error("Sort direction must be one of asc,desc");
      }
      if (!["title", "index"].includes(value.field)) {
        throw new Error("Sort field must be one of title,index");
      }
    }
  }
}), _dec25 = Reflect.metadata("design:type", typeof CollectionSort === "undefined" ? Object : CollectionSort), _dec26 = Reflect.metadata("design:type", Function), _dec27 = Reflect.metadata("design:paramtypes", [Object]), _dec28 = Reflect.metadata("design:type", Function), _dec29 = Reflect.metadata("design:paramtypes", [Object]), _dec30 = Reflect.metadata("design:type", Function), _dec31 = Reflect.metadata("design:paramtypes", [Object]), _dec32 = Reflect.metadata("design:type", Function), _dec33 = Reflect.metadata("design:paramtypes", [Object, Object]), _dec34 = (0, _sequelizeTypescript.BelongsTo)(() => _FileOperation.default, "importId"), _dec35 = Reflect.metadata("design:type", typeof _FileOperation.default === "undefined" ? Object : _FileOperation.default), _dec36 = (0, _sequelizeTypescript.ForeignKey)(() => _FileOperation.default), _dec37 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec38 = Reflect.metadata("design:type", String), _dec39 = (0, _sequelizeTypescript.HasMany)(() => _Document.default, "collectionId"), _dec40 = Reflect.metadata("design:type", Array), _dec41 = (0, _sequelizeTypescript.HasMany)(() => _UserMembership.default, "collectionId"), _dec42 = Reflect.metadata("design:type", Array), _dec43 = (0, _sequelizeTypescript.HasMany)(() => _GroupPermission.default, "collectionId"), _dec44 = Reflect.metadata("design:type", Array), _dec45 = (0, _sequelizeTypescript.BelongsToMany)(() => _User.default, () => _UserMembership.default), _dec46 = Reflect.metadata("design:type", Array), _dec47 = (0, _sequelizeTypescript.BelongsToMany)(() => _Group.default, () => _GroupPermission.default), _dec48 = Reflect.metadata("design:type", Array), _dec49 = (0, _sequelizeTypescript.BelongsTo)(() => _User.default, "createdById"), _dec50 = Reflect.metadata("design:type", typeof _User.default === "undefined" ? Object : _User.default), _dec51 = (0, _sequelizeTypescript.ForeignKey)(() => _User.default), _dec52 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec53 = Reflect.metadata("design:type", String), _dec54 = (0, _sequelizeTypescript.BelongsTo)(() => _Team.default, "teamId"), _dec55 = Reflect.metadata("design:type", typeof _Team.default === "undefined" ? Object : _Team.default), _dec56 = (0, _sequelizeTypescript.ForeignKey)(() => _Team.default), _dec57 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec58 = Reflect.metadata("design:type", String), _dec(_class = _dec2(_class = (0, _Fix.default)(_class = (_class2 = (_class3 = class Collection extends _ParanoidModel.default {
  constructor() {
    super(...arguments);
    _initializerDefineProperty(this, "urlId", _descriptor, this);
    _initializerDefineProperty(this, "name", _descriptor2, this);
    _initializerDefineProperty(this, "description", _descriptor3, this);
    _initializerDefineProperty(this, "icon", _descriptor4, this);
    _initializerDefineProperty(this, "color", _descriptor5, this);
    _initializerDefineProperty(this, "index", _descriptor6, this);
    _initializerDefineProperty(this, "permission", _descriptor7, this);
    _initializerDefineProperty(this, "maintainerApprovalRequired", _descriptor8, this);
    _initializerDefineProperty(this, "documentStructure", _descriptor9, this);
    _initializerDefineProperty(this, "sharing", _descriptor10, this);
    _initializerDefineProperty(this, "sort", _descriptor11, this);
    // associations
    _initializerDefineProperty(this, "import", _descriptor12, this);
    _initializerDefineProperty(this, "importId", _descriptor13, this);
    _initializerDefineProperty(this, "documents", _descriptor14, this);
    _initializerDefineProperty(this, "memberships", _descriptor15, this);
    _initializerDefineProperty(this, "collectionGroupMemberships", _descriptor16, this);
    _initializerDefineProperty(this, "users", _descriptor17, this);
    _initializerDefineProperty(this, "groups", _descriptor18, this);
    _initializerDefineProperty(this, "user", _descriptor19, this);
    _initializerDefineProperty(this, "createdById", _descriptor20, this);
    _initializerDefineProperty(this, "team", _descriptor21, this);
    _initializerDefineProperty(this, "teamId", _descriptor22, this);
    _defineProperty(this, "getDocumentTree", documentId => {
      if (!this.documentStructure) {
        return null;
      }
      let result;
      const loopChildren = documents => {
        if (result) {
          return;
        }
        documents.forEach(document => {
          if (result) {
            return;
          }
          if (document.id === documentId) {
            result = document;
          } else {
            loopChildren(document.children);
          }
        });
      };

      // Technically, sorting the children is presenter-layer work...
      // but the only place it's used passes straight into an API response
      // so the extra indirection is not worthwhile
      loopChildren(this.documentStructure);

      // if the document is a draft loopChildren will not find it in the structure
      if (!result) {
        return null;
      }
      return {
        ...result,
        children: (0, _collections.sortNavigationNodes)(result.children, this.sort)
      };
    });
    _defineProperty(this, "deleteDocument", async function (document, options) {
      await this.removeDocumentInStructure(document, options);

      // Helper to destroy all child documents for a document
      const loopChildren = async (documentId, opts) => {
        const childDocuments = await _Document.default.findAll({
          where: {
            parentDocumentId: documentId
          }
        });
        for (const child of childDocuments) {
          await loopChildren(child.id, opts);
          await child.destroy(opts);
        }
      };
      await loopChildren(document.id, options);
      await document.destroy(options);
    });
    _defineProperty(this, "removeDocumentInStructure", async function (document, options) {
      if (!this.documentStructure) {
        return;
      }
      let result;
      const removeFromChildren = async (children, id) => {
        children = await Promise.all(children.map(async childDocument => ({
          ...childDocument,
          children: await removeFromChildren(childDocument.children, id)
        })));
        const match = (0, _find.default)(children, {
          id
        });
        if (match) {
          if (!result) {
            result = [match, (0, _findIndex.default)(children, {
              id
            })];
          }
          (0, _remove.default)(children, {
            id
          });
        }
        return children;
      };
      this.documentStructure = await removeFromChildren(this.documentStructure, document.id);

      // Sequelize doesn't seem to set the value with splice on JSONB field
      // https://github.com/sequelize/sequelize/blob/e1446837196c07b8ff0c23359b958d68af40fd6d/src/model.js#L3937
      this.changed("documentStructure", true);
      if ((options === null || options === void 0 ? void 0 : options.save) !== false) {
        await this.save({
          ...options,
          fields: ["documentStructure"]
        });
      }
      return result;
    });
    _defineProperty(this, "getDocumentParents", function (documentId) {
      let result;
      const loopChildren = function (documents) {
        let path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        if (result) {
          return;
        }
        documents.forEach(document => {
          if (document.id === documentId) {
            result = path;
          } else {
            loopChildren(document.children, [...path, document.id]);
          }
        });
      };
      if (this.documentStructure) {
        loopChildren(this.documentStructure);
      }
      return result;
    });
    /**
     * Update document's title and url in the documentStructure
     */
    _defineProperty(this, "updateDocument", async function (updatedDocument, options) {
      if (!this.documentStructure) {
        return;
      }
      const {
        id
      } = updatedDocument;
      const updateChildren = documents => Promise.all(documents.map(async document => {
        if (document.id === id) {
          document = {
            ...(await updatedDocument.toNavigationNode(options)),
            children: document.children
          };
        } else {
          document.children = await updateChildren(document.children);
        }
        return document;
      }));
      this.documentStructure = await updateChildren(this.documentStructure);
      // Sequelize doesn't seem to set the value with splice on JSONB field
      // https://github.com/sequelize/sequelize/blob/e1446837196c07b8ff0c23359b958d68af40fd6d/src/model.js#L3937
      this.changed("documentStructure", true);
      await this.save({
        fields: ["documentStructure"],
        ...options
      });
      return this;
    });
    _defineProperty(this, "addDocumentToStructure", async function (document, index) {
      let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      if (!this.documentStructure) {
        this.documentStructure = [];
      }
      if (this.getDocumentTree(document.id)) {
        return this;
      }

      // If moving existing document with children, use existing structure
      const documentJson = {
        ...(await document.toNavigationNode(options)),
        ...options.documentJson
      };
      if (!document.parentDocumentId) {
        // Note: Index is supported on DB level but it's being ignored
        // by the API presentation until we build product support for it.
        this.documentStructure.splice(index !== undefined ? index : this.documentStructure.length, 0, documentJson);
      } else {
        // Recursively place document
        const placeDocument = documentList => documentList.map(childDocument => {
          if (document.parentDocumentId === childDocument.id) {
            childDocument.children.splice(index !== undefined ? index : childDocument.children.length, 0, documentJson);
          } else {
            childDocument.children = placeDocument(childDocument.children);
          }
          return childDocument;
        });
        this.documentStructure = placeDocument(this.documentStructure);
      }

      // Sequelize doesn't seem to set the value with splice on JSONB field
      // https://github.com/sequelize/sequelize/blob/e1446837196c07b8ff0c23359b958d68af40fd6d/src/model.js#L3937
      this.changed("documentStructure", true);
      if ((options === null || options === void 0 ? void 0 : options.save) !== false) {
        await this.save({
          ...options,
          fields: ["documentStructure"]
        });
      }
      return this;
    });
  }
  // getters

  /**
   * The frontend path to this collection.
   *
   * @deprecated Use `path` instead.
   */
  get url() {
    return this.path;
  }

  /** The frontend path to this collection. */
  get path() {
    if (!this.name) {
      return "/collection/untitled-".concat(this.urlId);
    }
    return "/collection/".concat((0, _slugify.default)(this.name), "-").concat(this.urlId);
  }

  // hooks

  static async onBeforeValidate(model) {
    model.urlId = model.urlId || _randomstring.default.generate(10);
  }
  static async onBeforeSave(model) {
    if (model.icon === "collection") {
      model.icon = null;
    }
  }
  static async checkLastCollection(model) {
    const total = await this.count({
      where: {
        teamId: model.teamId
      }
    });
    if (total === 1) {
      throw (0, _errors.ValidationError)("Cannot delete last collection");
    }
  }
  static async onAfterCreate(model, options) {
    return _UserMembership.default.findOrCreate({
      where: {
        collectionId: model.id,
        userId: model.createdById
      },
      defaults: {
        permission: _types.CollectionPermission.Admin,
        createdById: model.createdById
      },
      transaction: options.transaction
    });
  }
  /**
   * Returns an array of unique userIds that are members of a collection,
   * either via group or direct membership
   *
   * @param collectionId
   * @returns userIds
   */
  static async membershipUserIds(collectionId) {
    const collection = await this.scope("withAllMemberships").findByPk(collectionId);
    if (!collection) {
      return [];
    }
    const groupMemberships = collection.collectionGroupMemberships.map(cgm => cgm.group.groupMemberships).flat();
    const membershipUserIds = [...groupMemberships, ...collection.memberships].map(membership => membership.userId);
    return (0, _uniq.default)(membershipUserIds);
  }

  /**
   * Overrides the standard findByPk behavior to allow also querying by urlId
   *
   * @param id uuid or urlId
   * @param options FindOptions
   * @returns A promise resolving to a collection instance or null
   */

  static async findByPk(id) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (typeof id !== "string") {
      return null;
    }
    if ((0, _isUUID.default)(id)) {
      return this.findOne({
        where: {
          id
        },
        ...options
      });
    }
    const match = id.match(_urlHelpers.SLUG_URL_REGEX);
    if (match) {
      return this.findOne({
        where: {
          urlId: match[1]
        },
        ...options
      });
    }
    return null;
  }

  /**
   * Find the first collection that the specified user has access to.
   *
   * @param user User object
   * @returns collection First collection in the sidebar order
   */
  static async findFirstCollectionForUser(user) {
    const id = await user.collectionIds();
    return this.findOne({
      where: {
        id
      },
      order: [
      // using LC_COLLATE:"C" because we need byte order to drive the sorting
      _sequelizeTypescript.Sequelize.literal('"collection"."index" collate "C"'), ["updatedAt", "DESC"]]
    });
  }

  /**
   * Convenience method to return if a collection is considered private.
   * This means that a membership is required to view it rather than just being
   * a workspace member.
   *
   * @returns boolean
   */
  get isPrivate() {
    return !this.permission;
  }
}, _defineProperty(_class3, "DEFAULT_SORT", {
  field: "index",
  direction: "asc"
}), _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "urlId", [_dec3, _sequelizeTypescript.Unique, _sequelizeTypescript.Column, _dec4], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "name", [_NotContainsUrl.default, _dec5, _sequelizeTypescript.Column, _dec6], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "description", [_dec7, _sequelizeTypescript.Column, _dec8], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "icon", [_dec9, _sequelizeTypescript.Column, _dec10], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "color", [_IsHexColor.default, _sequelizeTypescript.Column, _dec11], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "index", [_dec12, _sequelizeTypescript.Column, _dec13], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "permission", [_dec14, _dec15, _dec16], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "maintainerApprovalRequired", [_dec17, _sequelizeTypescript.Column, _dec18], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "documentStructure", [_dec19, _dec20], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "sharing", [_dec21, _sequelizeTypescript.Column, _dec22], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "sort", [_dec23, _dec24, _dec25], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class2, "onBeforeValidate", [_sequelizeTypescript.BeforeValidate, _dec26, _dec27], Object.getOwnPropertyDescriptor(_class2, "onBeforeValidate"), _class2), _applyDecoratedDescriptor(_class2, "onBeforeSave", [_sequelizeTypescript.BeforeSave, _dec28, _dec29], Object.getOwnPropertyDescriptor(_class2, "onBeforeSave"), _class2), _applyDecoratedDescriptor(_class2, "checkLastCollection", [_sequelizeTypescript.BeforeDestroy, _dec30, _dec31], Object.getOwnPropertyDescriptor(_class2, "checkLastCollection"), _class2), _applyDecoratedDescriptor(_class2, "onAfterCreate", [_sequelizeTypescript.AfterCreate, _dec32, _dec33], Object.getOwnPropertyDescriptor(_class2, "onAfterCreate"), _class2), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "import", [_dec34, _dec35], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "importId", [_dec36, _dec37, _dec38], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "documents", [_dec39, _dec40], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "memberships", [_dec41, _dec42], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "collectionGroupMemberships", [_dec43, _dec44], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "users", [_dec45, _dec46], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "groups", [_dec47, _dec48], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "user", [_dec49, _dec50], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "createdById", [_dec51, _dec52, _dec53], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "team", [_dec54, _dec55], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, "teamId", [_dec56, _dec57, _dec58], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
})), _class2)) || _class) || _class) || _class);
var _default = exports.default = Collection;