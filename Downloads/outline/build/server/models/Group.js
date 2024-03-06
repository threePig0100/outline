"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _sequelize = require("sequelize");
var _sequelizeTypescript = require("sequelize-typescript");
var _GroupPermission = _interopRequireDefault(require("./GroupPermission"));
var _GroupUser = _interopRequireDefault(require("./GroupUser"));
var _Team = _interopRequireDefault(require("./Team"));
var _User = _interopRequireDefault(require("./User"));
var _ParanoidModel = _interopRequireDefault(require("./base/ParanoidModel"));
var _Fix = _interopRequireDefault(require("./decorators/Fix"));
var _Length = _interopRequireDefault(require("./validators/Length"));
var _NotContainsUrl = _interopRequireDefault(require("./validators/NotContainsUrl"));
var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }
function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }
let Group = (_dec = (0, _sequelizeTypescript.DefaultScope)(() => ({
  include: [{
    association: "groupMemberships",
    required: false
  }]
})), _dec2 = (0, _sequelizeTypescript.Scopes)(() => ({
  withMember: memberId => ({
    include: [{
      association: "groupMemberships",
      required: true
    }, {
      association: "members",
      required: true,
      where: {
        userId: memberId
      }
    }]
  })
})), _dec3 = (0, _sequelizeTypescript.Table)({
  tableName: "groups",
  modelName: "group",
  validate: {
    async isUniqueNameInTeam() {
      const foundItem = await Group.findOne({
        where: {
          teamId: this.teamId,
          name: {
            [_sequelize.Op.iLike]: this.name
          },
          id: {
            [_sequelize.Op.not]: this.id
          }
        }
      });
      if (foundItem) {
        throw new Error("The name of this group is already in use");
      }
    }
  }
}), _dec4 = (0, _Length.default)({
  min: 0,
  max: 255,
  msg: "name must be be 255 characters or less"
}), _dec5 = Reflect.metadata("design:type", String), _dec6 = Reflect.metadata("design:type", Function), _dec7 = Reflect.metadata("design:paramtypes", [Object]), _dec8 = (0, _sequelizeTypescript.HasMany)(() => _GroupUser.default, "groupId"), _dec9 = (0, _sequelizeTypescript.HasMany)(() => _GroupUser.default, {
  as: "members",
  foreignKey: "groupId"
}), _dec10 = Reflect.metadata("design:type", Array), _dec11 = (0, _sequelizeTypescript.HasMany)(() => _GroupPermission.default, "groupId"), _dec12 = Reflect.metadata("design:type", Array), _dec13 = (0, _sequelizeTypescript.BelongsTo)(() => _Team.default, "teamId"), _dec14 = Reflect.metadata("design:type", typeof _Team.default === "undefined" ? Object : _Team.default), _dec15 = (0, _sequelizeTypescript.ForeignKey)(() => _Team.default), _dec16 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec17 = Reflect.metadata("design:type", String), _dec18 = (0, _sequelizeTypescript.BelongsTo)(() => _User.default, "createdById"), _dec19 = Reflect.metadata("design:type", typeof _User.default === "undefined" ? Object : _User.default), _dec20 = (0, _sequelizeTypescript.ForeignKey)(() => _User.default), _dec21 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec22 = Reflect.metadata("design:type", String), _dec23 = (0, _sequelizeTypescript.BelongsToMany)(() => _User.default, () => _GroupUser.default), _dec24 = Reflect.metadata("design:type", Array), _dec(_class = _dec2(_class = _dec3(_class = (0, _Fix.default)(_class = (_class2 = class Group extends _ParanoidModel.default {
  constructor() {
    super(...arguments);
    _initializerDefineProperty(this, "name", _descriptor, this);
    // associations
    _initializerDefineProperty(this, "groupMemberships", _descriptor2, this);
    _initializerDefineProperty(this, "collectionGroupMemberships", _descriptor3, this);
    _initializerDefineProperty(this, "team", _descriptor4, this);
    _initializerDefineProperty(this, "teamId", _descriptor5, this);
    _initializerDefineProperty(this, "createdBy", _descriptor6, this);
    _initializerDefineProperty(this, "createdById", _descriptor7, this);
    _initializerDefineProperty(this, "users", _descriptor8, this);
  }
  // hooks

  static async deleteGroupUsers(model) {
    if (!model.deletedAt) {
      return;
    }
    await _GroupUser.default.destroy({
      where: {
        groupId: model.id
      }
    });
    await _GroupPermission.default.destroy({
      where: {
        groupId: model.id
      }
    });
  }
  static filterByMember(memberId) {
    return memberId ? this.scope({
      method: ["withMember", memberId]
    }) : this.scope("defaultScope");
  }
}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "name", [_dec4, _NotContainsUrl.default, _sequelizeTypescript.Column, _dec5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class2, "deleteGroupUsers", [_sequelizeTypescript.AfterDestroy, _dec6, _dec7], Object.getOwnPropertyDescriptor(_class2, "deleteGroupUsers"), _class2), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "groupMemberships", [_dec8, _dec9, _dec10], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "collectionGroupMemberships", [_dec11, _dec12], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "team", [_dec13, _dec14], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "teamId", [_dec15, _dec16, _dec17], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "createdBy", [_dec18, _dec19], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "createdById", [_dec20, _dec21, _dec22], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "users", [_dec23, _dec24], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
})), _class2)) || _class) || _class) || _class) || _class);
var _default = exports.default = Group;