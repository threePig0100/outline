"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = vaults;
var _sequelizeEncrypted = _interopRequireDefault(require("sequelize-encrypted"));
var _sequelizeTypescript = require("sequelize-typescript");
var _env = _interopRequireDefault(require("./../env"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * Encrypted field storage, use via the Encrypted decorator, not directly.
 */
function vaults() {
  return (0, _sequelizeEncrypted.default)(_sequelizeTypescript.Sequelize, _env.default.SECRET_KEY);
}