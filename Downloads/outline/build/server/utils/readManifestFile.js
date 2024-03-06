"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readManifestFile = exports.default = void 0;
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
var _Logger = _interopRequireDefault(require("./../logging/Logger"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const readManifestFile = function () {
  let file = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "./build/app/.vite/manifest.json";
  const absoluteFilePath = _path.default.resolve(file);
  let manifest = "{}";
  try {
    manifest = _fs.default.readFileSync(absoluteFilePath, "utf8");
  } catch (err) {
    _Logger.default.warn("Can not find ".concat(absoluteFilePath, ". Try executing \"yarn vite:build\" before running in production mode."));
  }
  return JSON.parse(manifest);
};
exports.readManifestFile = readManifestFile;
var _default = exports.default = readManifestFile;