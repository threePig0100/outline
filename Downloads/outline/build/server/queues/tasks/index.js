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
const tasks = {};
const rootDir = _env.default.ENVIRONMENT === "test" ? "" : "build";
(0, _fs.requireDirectory)(__dirname).forEach(_ref => {
  let [module, id] = _ref;
  if (id === "index") {
    return;
  }
  tasks[id] = module.default;
});
_glob.glob.sync(_path.default.join(rootDir, "plugins/*/server/tasks/!(*.test).[jt]s")).forEach(filePath => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const task = require(_path.default.join(process.cwd(), filePath)).default;
  const name = _path.default.basename(filePath, ".js");
  tasks[name] = task;
  _Logger.default.debug("task", "Registered task ".concat(name));
});
var _default = exports.default = tasks;