"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _path = _interopRequireDefault(require("path"));
var _glob = require("glob");
var _env = _interopRequireDefault(require("./../../env"));
var _Logger = _interopRequireDefault(require("./../../logging/Logger"));
var _fs = require("./../../utils/fs");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const processors = {};
const rootDir = _env.default.ENVIRONMENT === "test" ? "" : "build";
(0, _fs.requireDirectory)(__dirname).forEach(_ref => {
  let [module, id] = _ref;
  if (id === "index") {
    return;
  }
  processors[id] = module.default;
});
_glob.glob.sync(_path.default.join(rootDir, "plugins/*/server/processors/!(*.test).[jt]s")).forEach(filePath => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const processor = require(_path.default.join(process.cwd(), filePath)).default;
  const name = _path.default.basename(filePath, ".js");
  processors[name] = processor;
  _Logger.default.debug("processor", "Registered processor ".concat(name));
});
var _default = exports.default = processors;