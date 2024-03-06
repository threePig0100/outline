"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _crypto = _interopRequireDefault(require("crypto"));
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
var _url = require("url");
var _util = _interopRequireDefault(require("util"));
var _dateFns = require("date-fns");
var _sequelize = require("sequelize");
var _sequelizeTypescript = require("sequelize-typescript");
var _constants = require("./../../shared/constants");
var _types = require("./../../shared/types");
var _domains = require("./../../shared/utils/domains");
var _env = _interopRequireDefault(require("./../env"));
var _errors = require("./../errors");
var _DeleteAttachmentTask = _interopRequireDefault(require("./../queues/tasks/DeleteAttachmentTask"));
var _parseAttachmentIds = _interopRequireDefault(require("./../utils/parseAttachmentIds"));
var _Attachment = _interopRequireDefault(require("./Attachment"));
var _AuthenticationProvider = _interopRequireDefault(require("./AuthenticationProvider"));
var _Collection = _interopRequireDefault(require("./Collection"));
var _Document = _interopRequireDefault(require("./Document"));
var _Share = _interopRequireDefault(require("./Share"));
var _TeamDomain = _interopRequireDefault(require("./TeamDomain"));
var _User = _interopRequireDefault(require("./User"));
var _ParanoidModel = _interopRequireDefault(require("./base/ParanoidModel"));
var _Fix = _interopRequireDefault(require("./decorators/Fix"));
var _IsFQDN = _interopRequireDefault(require("./validators/IsFQDN"));
var _IsUrlOrRelativePath = _interopRequireDefault(require("./validators/IsUrlOrRelativePath"));
var _Length = _interopRequireDefault(require("./validators/Length"));
var _NotContainsUrl = _interopRequireDefault(require("./validators/NotContainsUrl"));
var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _dec34, _dec35, _dec36, _dec37, _dec38, _dec39, _dec40, _dec41, _dec42, _dec43, _dec44, _dec45, _dec46, _dec47, _dec48, _dec49, _dec50, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _init, _class3;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }
function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }
const readFile = _util.default.promisify(_fs.default.readFile);
let Team = (_dec = (0, _sequelizeTypescript.Scopes)(() => ({
  withDomains: {
    include: [{
      model: _TeamDomain.default
    }]
  },
  withAuthenticationProviders: {
    include: [{
      model: _AuthenticationProvider.default,
      as: "authenticationProviders"
    }]
  }
})), _dec2 = (0, _sequelizeTypescript.Table)({
  tableName: "teams",
  modelName: "team"
}), _dec3 = (0, _Length.default)({
  min: 2,
  max: 255,
  msg: "name must be between 2 to 255 characters"
}), _dec4 = Reflect.metadata("design:type", String), _dec5 = (0, _Length.default)({
  min: 2,
  max: _env.default.isCloudHosted ? 32 : 255,
  msg: "subdomain must be between 2 and ".concat(_env.default.isCloudHosted ? 32 : 255, " characters")
}), _dec6 = (0, _sequelizeTypescript.Is)({
  args: [/^[a-z\d-]+$/, "i"],
  msg: "Must be only alphanumeric and dashes"
}), _dec7 = (0, _sequelizeTypescript.NotIn)({
  args: [_domains.RESERVED_SUBDOMAINS],
  msg: "You chose a restricted word, please try another."
}), _dec8 = Reflect.metadata("design:type", String), _dec9 = (0, _Length.default)({
  max: 255,
  msg: "domain must be 255 characters or less"
}), _dec10 = Reflect.metadata("design:type", String), _dec11 = (0, _sequelizeTypescript.IsUUID)(4), _dec12 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.UUID), _dec13 = Reflect.metadata("design:type", String), _dec14 = (0, _Length.default)({
  max: 4096,
  msg: "avatarUrl must be 4096 characters or less"
}), _dec15 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.STRING), _dec16 = Reflect.metadata("design:type", Function), _dec17 = Reflect.metadata("design:paramtypes", []), _dec18 = (0, _sequelizeTypescript.Default)(true), _dec19 = Reflect.metadata("design:type", Boolean), _dec20 = (0, _sequelizeTypescript.Default)(false), _dec21 = Reflect.metadata("design:type", Boolean), _dec22 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.JSONB), _dec23 = Reflect.metadata("design:type", Object), _dec24 = (0, _sequelizeTypescript.Default)(true), _dec25 = Reflect.metadata("design:type", Boolean), _dec26 = (0, _sequelizeTypescript.Default)(true), _dec27 = Reflect.metadata("design:type", Boolean), _dec28 = (0, _sequelizeTypescript.Default)(true), _dec29 = Reflect.metadata("design:type", Boolean), _dec30 = (0, _sequelizeTypescript.Default)("member"), _dec31 = (0, _sequelizeTypescript.IsIn)([["viewer", "member"]]), _dec32 = Reflect.metadata("design:type", String), _dec33 = (0, _sequelizeTypescript.Column)(_sequelizeTypescript.DataType.JSONB), _dec34 = Reflect.metadata("design:type", typeof _types.TeamPreferences === "undefined" ? Object : _types.TeamPreferences), _dec35 = Reflect.metadata("design:type", typeof Date === "undefined" ? Object : Date), _dec36 = Reflect.metadata("design:type", typeof Date === "undefined" ? Object : Date), _dec37 = (0, _sequelizeTypescript.HasMany)(() => _Collection.default), _dec38 = Reflect.metadata("design:type", Array), _dec39 = (0, _sequelizeTypescript.HasMany)(() => _Document.default), _dec40 = Reflect.metadata("design:type", Array), _dec41 = (0, _sequelizeTypescript.HasMany)(() => _User.default), _dec42 = Reflect.metadata("design:type", Array), _dec43 = (0, _sequelizeTypescript.HasMany)(() => _AuthenticationProvider.default), _dec44 = Reflect.metadata("design:type", Array), _dec45 = (0, _sequelizeTypescript.HasMany)(() => _TeamDomain.default), _dec46 = Reflect.metadata("design:type", Array), _dec47 = Reflect.metadata("design:type", Function), _dec48 = Reflect.metadata("design:paramtypes", [Object]), _dec49 = Reflect.metadata("design:type", Function), _dec50 = Reflect.metadata("design:paramtypes", [Object, typeof SaveOptions === "undefined" ? Object : SaveOptions]), _dec(_class = _dec2(_class = (0, _Fix.default)(_class = (_class2 = (_class3 = class Team extends _ParanoidModel.default {
  constructor() {
    var _this;
    super(...arguments);
    _this = this;
    _initializerDefineProperty(this, "name", _descriptor, this);
    _initializerDefineProperty(this, "subdomain", _descriptor2, this);
    _initializerDefineProperty(this, "domain", _descriptor3, this);
    _initializerDefineProperty(this, "defaultCollectionId", _descriptor4, this);
    _initializerDefineProperty(this, "sharing", _descriptor5, this);
    _initializerDefineProperty(this, "inviteRequired", _descriptor6, this);
    _initializerDefineProperty(this, "signupQueryParams", _descriptor7, this);
    _initializerDefineProperty(this, "guestSignin", _descriptor8, this);
    _initializerDefineProperty(this, "documentEmbeds", _descriptor9, this);
    _initializerDefineProperty(this, "memberCollectionCreate", _descriptor10, this);
    _initializerDefineProperty(this, "defaultUserRole", _descriptor11, this);
    _initializerDefineProperty(this, "preferences", _descriptor12, this);
    _initializerDefineProperty(this, "suspendedAt", _descriptor13, this);
    _initializerDefineProperty(this, "lastActiveAt", _descriptor14, this);
    /**
     * Preferences that decide behavior for the team.
     *
     * @param preference The team preference to set
     * @param value Sets the preference value
     * @returns The current team preferences
     */
    _defineProperty(this, "setPreference", (preference, value) => {
      if (!this.preferences) {
        this.preferences = {};
      }
      this.preferences = {
        ...this.preferences,
        [preference]: value
      };
      return this.preferences;
    });
    /**
     * Returns the value of the given preference.
     *
     * @param preference The team preference to retrieve
     * @returns The preference value if set, else the default value
     */
    _defineProperty(this, "getPreference", preference => {
      var _ref, _this$preferences$pre, _this$preferences;
      return (_ref = (_this$preferences$pre = (_this$preferences = this.preferences) === null || _this$preferences === void 0 ? void 0 : _this$preferences[preference]) !== null && _this$preferences$pre !== void 0 ? _this$preferences$pre : _constants.TeamPreferenceDefaults[preference]) !== null && _ref !== void 0 ? _ref : false;
    });
    /**
     * Updates the lastActiveAt timestamp to the current time.
     *
     * @param force Whether to force the update even if the last update was recent
     * @returns A promise that resolves with the updated team
     */
    _defineProperty(this, "updateActiveAt", async function () {
      let force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      const fiveMinutesAgo = (0, _dateFns.subMinutes)(new Date(), 5);

      // ensure this is updated only every few minutes otherwise
      // we'll be constantly writing to the DB as API requests happen
      if (!_this.lastActiveAt || _this.lastActiveAt < fiveMinutesAgo || force) {
        _this.lastActiveAt = new Date();
      }

      // Save only writes to the database if there are changes
      return _this.save({
        hooks: false
      });
    });
    _defineProperty(this, "provisionFirstCollection", async userId => {
      await this.sequelize.transaction(async transaction => {
        const collection = await _Collection.default.create({
          name: "Welcome",
          description: "This collection is a quick guide to what ".concat(_env.default.APP_NAME, " is all about. Feel free to delete this collection once your team is up to speed with the basics!"),
          teamId: this.id,
          createdById: userId,
          sort: _Collection.default.DEFAULT_SORT,
          permission: _types.CollectionPermission.ReadWrite
        }, {
          transaction
        });

        // For the first collection we go ahead and create some intitial documents to get
        // the team started. You can edit these in /server/onboarding/x.md
        const onboardingDocs = ["Integrations & API", "Our Editor", "Getting Started", "What is Outline"];
        for (const title of onboardingDocs) {
          const text = await readFile(_path.default.join(process.cwd(), "server", "onboarding", "".concat(title, ".md")), "utf8");
          const document = await _Document.default.create({
            version: 2,
            isWelcome: true,
            parentDocumentId: null,
            collectionId: collection.id,
            teamId: collection.teamId,
            lastModifiedById: collection.createdById,
            createdById: collection.createdById,
            title,
            text
          }, {
            transaction
          });
          await document.publish(collection.createdById, collection.id, {
            transaction
          });
        }
      });
    });
    _defineProperty(this, "collectionIds", async function () {
      let paranoid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      const models = await _Collection.default.findAll({
        attributes: ["id"],
        where: {
          teamId: this.id,
          permission: {
            [_sequelize.Op.ne]: null
          }
        },
        paranoid
      });
      return models.map(c => c.id);
    });
    /**
     * Find whether the passed domain can be used to sign-in to this team. Note
     * that this method always returns true if no domain restrictions are set.
     *
     * @param domain The domain to check
     * @returns True if the domain is allowed to sign-in to this team
     */
    _defineProperty(this, "isDomainAllowed", async function (domain) {
      const allowedDomains = (await this.$get("allowedDomains")) || [];
      return allowedDomains.length === 0 || allowedDomains.map(d => d.name).includes(domain);
    });
    // associations
    _initializerDefineProperty(this, "collections", _descriptor15, this);
    _initializerDefineProperty(this, "documents", _descriptor16, this);
    _initializerDefineProperty(this, "users", _descriptor17, this);
    _initializerDefineProperty(this, "authenticationProviders", _descriptor18, this);
    _initializerDefineProperty(this, "allowedDomains", _descriptor19, this);
  }
  get avatarUrl() {
    const original = this.getDataValue("avatarUrl");
    if (original && !original.startsWith("https://tiley.herokuapp.com")) {
      return original;
    }
    return null;
  }
  set avatarUrl(value) {
    this.setDataValue("avatarUrl", value);
  }
  // getters

  /**
   * Returns whether the team has been suspended and is no longer accessible.
   */
  get isSuspended() {
    return !!this.suspendedAt;
  }

  /**
   * Returns whether the team has email login enabled. For self-hosted installs
   * this also considers whether SMTP connection details have been configured.
   *
   * @return {boolean} Whether to show email login options
   */
  get emailSigninEnabled() {
    return this.guestSignin && (!!_env.default.SMTP_HOST || _env.default.isDevelopment);
  }
  get url() {
    const url = new _url.URL(_env.default.URL);

    // custom domain
    if (this.domain) {
      return "".concat(url.protocol, "//").concat(this.domain).concat(url.port ? ":".concat(url.port) : "");
    }
    if (!this.subdomain || !_env.default.isCloudHosted) {
      return _env.default.URL;
    }
    url.host = "".concat(this.subdomain, ".").concat((0, _domains.getBaseDomain)());
    return url.href.replace(/\/$/, "");
  }

  /**
   * Returns a code that can be used to delete the user's team. The code will
   * be rotated when the user signs out.
   *
   * @returns The deletion code.
   */
  getDeleteConfirmationCode(user) {
    return _crypto.default.createHash("md5").update("".concat(this.id).concat(user.jwtSecret)).digest("hex").replace(/[l1IoO0]/gi, "").slice(0, 8).toUpperCase();
  }
  // hooks

  static async setPreferences(model) {
    // Set here rather than in TeamPreferenceDefaults as we only want to enable by default for new
    // workspaces.
    model.setPreference(_types.TeamPreference.MembersCanInvite, true);

    // Set last active at on creation.
    model.lastActiveAt = new Date();
    return model;
  }
  static async checkDomain(model, options) {
    if (!model.domain) {
      return model;
    }
    model.domain = model.domain.toLowerCase();
    const count = await _Share.default.count({
      ...options,
      where: {
        domain: model.domain
      }
    });
    if (count > 0) {
      throw (0, _errors.ValidationError)("Domain is already in use");
    }
    return model;
  }
}, _defineProperty(_class3, "deletePreviousAvatar", async model => {
  const previousAvatarUrl = model.previous("avatarUrl");
  if (previousAvatarUrl && previousAvatarUrl !== model.avatarUrl) {
    const attachmentIds = (0, _parseAttachmentIds.default)(previousAvatarUrl, true);
    if (!attachmentIds.length) {
      return;
    }
    const attachment = await _Attachment.default.findOne({
      where: {
        id: attachmentIds[0],
        teamId: model.id
      }
    });
    if (attachment) {
      await _DeleteAttachmentTask.default.schedule({
        attachmentId: attachment.id,
        teamId: model.id
      });
    }
  }
}), _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "name", [_NotContainsUrl.default, _dec3, _sequelizeTypescript.Column, _dec4], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "subdomain", [_sequelizeTypescript.IsLowercase, _sequelizeTypescript.Unique, _dec5, _dec6, _dec7, _sequelizeTypescript.Column, _dec8], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "domain", [_sequelizeTypescript.Unique, _dec9, _IsFQDN.default, _sequelizeTypescript.Column, _dec10], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "defaultCollectionId", [_dec11, _dec12, _dec13], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class2.prototype, "avatarUrl", [_sequelizeTypescript.AllowNull, _IsUrlOrRelativePath.default, _dec14, _dec15, _dec16, _dec17], Object.getOwnPropertyDescriptor(_class2.prototype, "avatarUrl"), _class2.prototype), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "sharing", [_dec18, _sequelizeTypescript.Column, _dec19], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "inviteRequired", [_dec20, _sequelizeTypescript.Column, _dec21], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "signupQueryParams", [_dec22, _dec23], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "guestSignin", [_dec24, _sequelizeTypescript.Column, _dec25], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "documentEmbeds", [_dec26, _sequelizeTypescript.Column, _dec27], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "memberCollectionCreate", [_dec28, _sequelizeTypescript.Column, _dec29], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "defaultUserRole", [_dec30, _dec31, _sequelizeTypescript.Column, _dec32], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "preferences", [_sequelizeTypescript.AllowNull, _dec33, _dec34], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "suspendedAt", [_sequelizeTypescript.IsDate, _sequelizeTypescript.Column, _dec35], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "lastActiveAt", [_sequelizeTypescript.IsDate, _sequelizeTypescript.Column, _dec36], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "collections", [_dec37, _dec38], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "documents", [_dec39, _dec40], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "users", [_dec41, _dec42], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "authenticationProviders", [_dec43, _dec44], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "allowedDomains", [_dec45, _dec46], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class2, "setPreferences", [_sequelizeTypescript.BeforeCreate, _dec47, _dec48], Object.getOwnPropertyDescriptor(_class2, "setPreferences"), _class2), _applyDecoratedDescriptor(_class2, "checkDomain", [_sequelizeTypescript.BeforeUpdate, _dec49, _dec50], Object.getOwnPropertyDescriptor(_class2, "checkDomain"), _class2), _applyDecoratedDescriptor(_class2, "deletePreviousAvatar", [_sequelizeTypescript.AfterUpdate], (_init = Object.getOwnPropertyDescriptor(_class2, "deletePreviousAvatar"), _init = _init ? _init.value : undefined, {
  enumerable: true,
  configurable: true,
  writable: true,
  initializer: function () {
    return _init;
  }
}), _class2)), _class2)) || _class) || _class) || _class);
var _default = exports.default = Team;