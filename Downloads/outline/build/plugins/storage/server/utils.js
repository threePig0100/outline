"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRootDirForLocalStorage = void 0;
var _fs = require("fs");
var _env = _interopRequireDefault(require("./../../../server/env"));
var _Logger = _interopRequireDefault(require("./../../../server/logging/Logger"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const createRootDirForLocalStorage = () => {
  if (_env.default.FILE_STORAGE === "local") {
    const rootDir = _env.default.FILE_STORAGE_LOCAL_ROOT_DIR;
    try {
      if (!(0, _fs.existsSync)(rootDir)) {
        (0, _fs.mkdirSync)(rootDir, {
          recursive: true
        });
        _Logger.default.debug("utils", "Created ".concat(rootDir, " for local storage"));
      }
    } catch (err) {
      _Logger.default.fatal("Failed to create directory for local file storage at ".concat(_env.default.FILE_STORAGE_LOCAL_ROOT_DIR), err);
    }
  }
};
exports.createRootDirForLocalStorage = createRootDirForLocalStorage;