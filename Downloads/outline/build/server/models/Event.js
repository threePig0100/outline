"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _sequelizeTypescript = require("sequelize-typescript");
var _queues = require("../queues");
var _Collection = _interopRequireDefault(require("./Collection"));
var _Document = _interopRequireDefault(require("./Document"));
var _Team = _interopRequireDefault(require("./Team"));
var _User = _interopRequireDefault(require("./User"));
var _IdModel = _interopRequireDefault(require("./base/IdModel"));
var _Fix = _interopRequireDefault(require("./decorators/Fix"));
var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _dec34, _dec35, _dec36, _dec37, _dec38, _dec39, _dec40, _dec41, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _class3;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }
function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }
let Event = (_dec = (0, _sequelizeTypescript.Table)({
  tableName: "events",
  modelName: "event",
  updatedAt: false
}), _dec2 = (0, _sequelizeTypescript.IsUUID)(4), _dec3 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec4 = Reflect.metadata("design:type", String), _dec5 = (0, _sequelizeTypescript.Length)({
  max: 255,
  msg: "name must be 255 characters or less"
}), _dec6 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.STRING), _dec7 = Reflect.metadata("design:type", String), _dec8 = Reflect.metadata("design:type", String), _dec9 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.JSONB), _dec10 = Reflect.metadata("design:type", typeof Record === "undefined" ? Object : Record), _dec11 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.JSONB), _dec12 = Reflect.metadata("design:type", typeof Record === "undefined" ? Object : Record), _dec13 = Reflect.metadata("design:type", Function), _dec14 = Reflect.metadata("design:paramtypes", [Object]), _dec15 = Reflect.metadata("design:type", Function), _dec16 = Reflect.metadata("design:paramtypes", [Object, typeof SaveOptions === "undefined" ? Object : SaveOptions]), _dec17 = (0, _sequelizeTypescript.BelongsTo)(() => _User.default, "userId"), _dec18 = Reflect.metadata("design:type", typeof _User.default === "undefined" ? Object : _User.default), _dec19 = (0, _sequelizeTypescript.ForeignKey)(() => _User.default), _dec20 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec21 = Reflect.metadata("design:type", String), _dec22 = (0, _sequelizeTypescript.BelongsTo)(() => _Document.default, "documentId"), _dec23 = Reflect.metadata("design:type", typeof _Document.default === "undefined" ? Object : _Document.default), _dec24 = (0, _sequelizeTypescript.ForeignKey)(() => _Document.default), _dec25 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec26 = Reflect.metadata("design:type", String), _dec27 = (0, _sequelizeTypescript.BelongsTo)(() => _User.default, "actorId"), _dec28 = Reflect.metadata("design:type", typeof _User.default === "undefined" ? Object : _User.default), _dec29 = (0, _sequelizeTypescript.ForeignKey)(() => _User.default), _dec30 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec31 = Reflect.metadata("design:type", String), _dec32 = (0, _sequelizeTypescript.BelongsTo)(() => _Collection.default, "collectionId"), _dec33 = Reflect.metadata("design:type", typeof _Collection.default === "undefined" ? Object : _Collection.default), _dec34 = (0, _sequelizeTypescript.ForeignKey)(() => _Collection.default), _dec35 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec36 = Reflect.metadata("design:type", String), _dec37 = (0, _sequelizeTypescript.BelongsTo)(() => _Team.default, "teamId"), _dec38 = Reflect.metadata("design:type", typeof _Team.default === "undefined" ? Object : _Team.default), _dec39 = (0, _sequelizeTypescript.ForeignKey)(() => _Team.default), _dec40 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec41 = Reflect.metadata("design:type", String), _dec(_class = (0, _Fix.default)(_class = (_class2 = (_class3 = class Event extends _IdModel.default {
  constructor() {
    super(...arguments);
    _initializerDefineProperty(this, "modelId", _descriptor, this);
    /**
     * The name of the event.
     */
    _initializerDefineProperty(this, "name", _descriptor2, this);
    /**
     * The originating IP address of the event.
     */
    _initializerDefineProperty(this, "ip", _descriptor3, this);
    /**
     * Metadata associated with the event, previously used for storing some changed attributes.
     */
    _initializerDefineProperty(this, "data", _descriptor4, this);
    /**
     * The changes made to the model – gradually moving to this column away from `data` which can be
     * used for arbitrary data associated with the event.
     */
    _initializerDefineProperty(this, "changes", _descriptor5, this);
    // associations
    _initializerDefineProperty(this, "user", _descriptor6, this);
    _initializerDefineProperty(this, "userId", _descriptor7, this);
    _initializerDefineProperty(this, "document", _descriptor8, this);
    _initializerDefineProperty(this, "documentId", _descriptor9, this);
    _initializerDefineProperty(this, "actor", _descriptor10, this);
    _initializerDefineProperty(this, "actorId", _descriptor11, this);
    _initializerDefineProperty(this, "collection", _descriptor12, this);
    _initializerDefineProperty(this, "collectionId", _descriptor13, this);
    _initializerDefineProperty(this, "team", _descriptor14, this);
    _initializerDefineProperty(this, "teamId", _descriptor15, this);
  }
  // hooks

  static cleanupIp(model) {
    if (model.ip) {
      // cleanup IPV6 representations of IPV4 addresses
      model.ip = model.ip.replace(/^::ffff:/, "");
    }
  }
  static async enqueue(model, options) {
    if (options.transaction) {
      options.transaction.afterCommit(() => void _queues.globalEventQueue.add(model));
      return;
    }
    void _queues.globalEventQueue.add(model);
  }
  /*
   * Schedule can be used to send events into the event system without recording
   * them in the database or audit trail – consider using a task instead.
   */
  static schedule(event) {
    const now = new Date();
    return _queues.globalEventQueue.add(this.build({
      createdAt: now,
      ...event
    }));
  }

  /**
   * Find the latest event matching the where clause
   *
   * @param where The options to match against
   * @returns A promise resolving to the latest event or null
   */
  static findLatest(where) {
    return this.findOne({
      where,
      order: [["createdAt", "DESC"]]
    });
  }

  /**
   * Create and persist new event from request context
   *
   * @param ctx The request context to use
   * @param attributes The event attributes
   * @returns A promise resolving to the new event
   */
  static createFromContext(ctx) {
    let attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let options = arguments.length > 2 ? arguments[2] : undefined;
    const {
      user
    } = ctx.state.auth;
    return this.create({
      ...attributes,
      actorId: user.id,
      teamId: user.teamId,
      ip: ctx.request.ip
    }, options);
  }
}, _defineProperty(_class3, "ACTIVITY_EVENTS", ["collections.create", "collections.delete", "collections.move", "collections.permission_changed", "collections.add_user", "collections.remove_user", "documents.publish", "documents.unpublish", "documents.archive", "documents.unarchive", "documents.move", "documents.delete", "documents.permanent_delete", "documents.restore", "documents.add_user", "documents.remove_user", "revisions.create", "users.create", "users.demote", "userMemberships.update"]), _defineProperty(_class3, "AUDIT_EVENTS", ["api_keys.create", "api_keys.delete", "authenticationProviders.update", "collections.create", "collections.update", "collections.permission_changed", "collections.move", "collections.add_user", "collections.remove_user", "collections.add_group", "collections.remove_group", "collections.delete", "documents.create", "documents.publish", "documents.update", "documents.archive", "documents.unarchive", "documents.move", "documents.delete", "documents.permanent_delete", "documents.restore", "documents.add_user", "documents.remove_user", "groups.create", "groups.update", "groups.delete", "pins.create", "pins.update", "pins.delete", "revisions.create", "shares.create", "shares.update", "shares.revoke", "teams.update", "users.create", "users.update", "users.signin", "users.signout", "users.promote", "users.demote", "users.invite", "users.suspend", "users.activate", "users.delete", "fileOperations.create", "fileOperations.delete", "webhookSubscriptions.create", "webhookSubscriptions.delete"]), _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "modelId", [_dec2, _dec3, _dec4], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "name", [_dec5, _dec6, _dec7], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "ip", [_sequelizeTypescript.IsIP, _sequelizeTypescript.Column, _dec8], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "data", [_dec9, _dec10], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "changes", [_dec11, _dec12], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class2, "cleanupIp", [_sequelizeTypescript.BeforeCreate, _dec13, _dec14], Object.getOwnPropertyDescriptor(_class2, "cleanupIp"), _class2), _applyDecoratedDescriptor(_class2, "enqueue", [_sequelizeTypescript.AfterSave, _dec15, _dec16], Object.getOwnPropertyDescriptor(_class2, "enqueue"), _class2), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "user", [_dec17, _dec18], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "userId", [_dec19, _dec20, _dec21], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "document", [_dec22, _dec23], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "documentId", [_dec24, _dec25, _dec26], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "actor", [_dec27, _dec28], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "actorId", [_dec29, _dec30, _dec31], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "collection", [_dec32, _dec33], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "collectionId", [_dec34, _dec35, _dec36], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "team", [_dec37, _dec38], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "teamId", [_dec39, _dec40, _dec41], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
})), _class2)) || _class) || _class);
var _default = exports.default = Event;