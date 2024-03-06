"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _env = _interopRequireDefault(require("./../../env"));
var _LocalStorage = _interopRequireDefault(require("./LocalStorage"));
var _S3Storage = _interopRequireDefault(require("./S3Storage"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const storage = _env.default.FILE_STORAGE === "local" ? new _LocalStorage.default() : new _S3Storage.default();
var _default = exports.default = storage;