"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _path = _interopRequireDefault(require("path"));
var _glob = require("glob");
var _find = _interopRequireDefault(require("lodash/find"));
var _sortBy = _interopRequireDefault(require("lodash/sortBy"));
var _env = _interopRequireDefault(require("./../../env"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /* eslint-disable @typescript-eslint/no-var-requires */
class AuthenticationHelper {
  /**
   * Returns the enabled authentication provider configurations for the current
   * installation.
   *
   * @returns A list of authentication providers
   */
  static get providers() {
    if (this.providersCache) {
      return this.providersCache;
    }
    const authenticationProviderConfigs = [];
    const rootDir = _env.default.ENVIRONMENT === "test" ? "" : "build";
    _glob.glob.sync(_path.default.join(rootDir, "plugins/*/server/auth/!(*.test|schema).[jt]s")).forEach(filePath => {
      var _config$requiredEnvVa;
      const {
        default: authProvider,
        name
      } = require(_path.default.join(process.cwd(), filePath));
      const id = filePath.replace("build/", "").split("/")[1];
      const config = require(_path.default.join(process.cwd(), rootDir, "plugins", id, "plugin.json"));

      // Test the all required env vars are set for the auth provider
      const enabled = ((_config$requiredEnvVa = config.requiredEnvVars) !== null && _config$requiredEnvVa !== void 0 ? _config$requiredEnvVa : []).every(name => !!_env.default[name]);
      if (enabled) {
        authenticationProviderConfigs.push({
          id,
          name: name !== null && name !== void 0 ? name : config.name,
          enabled,
          router: authProvider
        });
      }
    });
    this.providersCache = (0, _sortBy.default)(authenticationProviderConfigs, "id");
    return this.providersCache;
  }

  /**
   * Returns the enabled authentication provider configurations for a team,
   * if given otherwise all enabled providers are returned.
   *
   * @param team The team to get enabled providers for
   * @returns A list of authentication providers
   */
  static providersForTeam(team) {
    const isCloudHosted = _env.default.isCloudHosted;
    return AuthenticationHelper.providers.sort(config => config.id === "email" ? 1 : -1).filter(config => {
      // Guest sign-in is an exception as it does not have an authentication
      // provider using passport, instead it exists as a boolean option.
      if (config.id === "email") {
        return team === null || team === void 0 ? void 0 : team.emailSigninEnabled;
      }

      // If no team return all possible authentication providers except email.
      if (!team) {
        return true;
      }
      const authProvider = (0, _find.default)(team.authenticationProviders, {
        name: config.id
      });

      // If cloud hosted then the auth provider must be enabled for the team,
      // If self-hosted then it must not be actively disabled, otherwise all
      // providers are considered.
      return !isCloudHosted && (authProvider === null || authProvider === void 0 ? void 0 : authProvider.enabled) !== false || isCloudHosted && (authProvider === null || authProvider === void 0 ? void 0 : authProvider.enabled);
    });
  }
}
exports.default = AuthenticationHelper;
_defineProperty(AuthenticationHelper, "providersCache", void 0);