"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _path = _interopRequireDefault(require("path"));
var _glob = _interopRequireDefault(require("glob"));
var _env = _interopRequireDefault(require("./../env"));
var _Logger = _interopRequireDefault(require("./../logging/Logger"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable @typescript-eslint/no-var-requires */

const rootDir = _env.default.ENVIRONMENT === "test" ? "" : "build";
const plugins = _glob.default.sync(_path.default.join(rootDir, "plugins/*/server/unfurl.[jt]s"));
const resolvers = plugins.reduce((resolvers, filePath) => {
  var _config$requiredEnvVa;
  const resolver = require(_path.default.join(process.cwd(), filePath));
  const id = filePath.replace("build/", "").split("/")[1];
  const config = require(_path.default.join(process.cwd(), rootDir, "plugins", id, "plugin.json"));

  // Test the all required env vars are set for the resolver
  const enabled = ((_config$requiredEnvVa = config.requiredEnvVars) !== null && _config$requiredEnvVa !== void 0 ? _config$requiredEnvVa : []).every(name => !!_env.default[name]);
  if (!enabled) {
    return resolvers;
  }
  resolvers[config.name] = resolver;
  _Logger.default.debug("utils", "Registered unfurl resolver ".concat(filePath));
  return resolvers;
}, {});
var _default = exports.default = resolvers;