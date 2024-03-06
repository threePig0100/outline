"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _admin = _interopRequireDefault(require("./admin"));
var _collaboration = _interopRequireDefault(require("./collaboration"));
var _cron = _interopRequireDefault(require("./cron"));
var _web = _interopRequireDefault(require("./web"));
var _websockets = _interopRequireDefault(require("./websockets"));
var _worker = _interopRequireDefault(require("./worker"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = exports.default = {
  websockets: _websockets.default,
  collaboration: _collaboration.default,
  admin: _admin.default,
  web: _web.default,
  worker: _worker.default,
  cron: _cron.default
};