"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _models = require("./../../models");
var _database = require("./../../storage/database");
var _BaseProcessor = _interopRequireDefault(require("./BaseProcessor"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class UsersDeletedProcessor extends _BaseProcessor.default {
  async perform(event) {
    await _database.sequelize.transaction(async transaction => {
      await _models.GroupUser.destroy({
        where: {
          userId: event.userId
        },
        transaction
      });
      await _models.UserAuthentication.destroy({
        where: {
          userId: event.userId
        },
        transaction
      });
      await _models.UserMembership.destroy({
        where: {
          userId: event.userId
        },
        transaction
      });
      await _models.Subscription.destroy({
        where: {
          userId: event.userId
        },
        transaction
      });
      await _models.ApiKey.destroy({
        where: {
          userId: event.userId
        },
        transaction
      });
      await _models.Star.destroy({
        where: {
          userId: event.userId
        },
        transaction
      });
    });
  }
}
exports.default = UsersDeletedProcessor;
_defineProperty(UsersDeletedProcessor, "applicableEvents", ["users.delete"]);