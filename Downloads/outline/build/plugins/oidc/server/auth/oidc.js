"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.name = exports.default = void 0;
var _koaPassport = _interopRequireDefault(require("@outlinewiki/koa-passport"));
var _koaRouter = _interopRequireDefault(require("koa-router"));
var _get = _interopRequireDefault(require("lodash/get"));
var _passportOauth = require("passport-oauth2");
var _domains = require("./../../../../shared/utils/domains");
var _accountProvisioner = _interopRequireDefault(require("./../../../../server/commands/accountProvisioner"));
var _env = _interopRequireDefault(require("./../../../../server/env"));
var _errors = require("./../../../../server/errors");
var _passport = _interopRequireDefault(require("./../../../../server/middlewares/passport"));
var _passport2 = require("./../../../../server/utils/passport");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = new _koaRouter.default();
const providerName = "oidc";
const scopes = _env.default.OIDC_SCOPES.split(" ");
_passportOauth.Strategy.prototype.userProfile = async function (accessToken, done) {
  try {
    var _env$OIDC_USERINFO_UR;
    const response = await (0, _passport2.request)((_env$OIDC_USERINFO_UR = _env.default.OIDC_USERINFO_URI) !== null && _env$OIDC_USERINFO_UR !== void 0 ? _env$OIDC_USERINFO_UR : "", accessToken);
    return done(null, response);
  } catch (err) {
    return done(err);
  }
};
const authorizationParams = _passportOauth.Strategy.prototype.authorizationParams;
_passportOauth.Strategy.prototype.authorizationParams = function (options) {
  return {
    ...(options.originalQuery || {}),
    ...(authorizationParams.bind(this)(options) || {})
  };
};
const authenticate = _passportOauth.Strategy.prototype.authenticate;
_passportOauth.Strategy.prototype.authenticate = function (req, options) {
  options.originalQuery = req.query;
  authenticate.bind(this)(req, options);
};
if (_env.default.OIDC_CLIENT_ID && _env.default.OIDC_CLIENT_SECRET && _env.default.OIDC_AUTH_URI && _env.default.OIDC_TOKEN_URI && _env.default.OIDC_USERINFO_URI) {
  _koaPassport.default.use(providerName, new _passportOauth.Strategy({
    authorizationURL: _env.default.OIDC_AUTH_URI,
    tokenURL: _env.default.OIDC_TOKEN_URI,
    clientID: _env.default.OIDC_CLIENT_ID,
    clientSecret: _env.default.OIDC_CLIENT_SECRET,
    callbackURL: "".concat(_env.default.URL, "/auth/").concat(providerName, ".callback"),
    passReqToCallback: true,
    scope: _env.default.OIDC_SCOPES,
    // @ts-expect-error custom state store
    store: new _passport2.StateStore(),
    state: true,
    pkce: false
  },
  // OpenID Connect standard profile claims can be found in the official
  // specification.
  // https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
  // Non-standard claims may be configured by individual identity providers.
  // Any claim supplied in response to the userinfo request will be
  // available on the `profile` parameter
  async function (ctx, accessToken, refreshToken, params, profile, done) {
    try {
      if (!profile.email) {
        throw (0, _errors.AuthenticationError)("An email field was not returned in the profile parameter, but is required.");
      }
      const team = await (0, _passport2.getTeamFromContext)(ctx);
      const client = (0, _passport2.getClientFromContext)(ctx);
      const parts = profile.email.toLowerCase().split("@");
      const domain = parts.length && parts[1];
      if (!domain) {
        throw (0, _errors.OIDCMalformedUserInfoError)();
      }

      // remove the TLD and form a subdomain from the remaining
      const subdomain = (0, _domains.slugifyDomain)(domain);

      // Claim name can be overriden using an env variable.
      // Default is 'preferred_username' as per OIDC spec.
      const username = (0, _get.default)(profile, _env.default.OIDC_USERNAME_CLAIM);
      const name = profile.name || username || profile.username;
      const providerId = profile.sub ? profile.sub : profile.id;
      if (!name) {
        throw (0, _errors.AuthenticationError)("Neither a name or username was returned in the profile parameter, but at least one is required.");
      }
      const result = await (0, _accountProvisioner.default)({
        ip: ctx.ip,
        team: {
          teamId: team === null || team === void 0 ? void 0 : team.id,
          // https://github.com/outline/outline/pull/2388#discussion_r681120223
          name: "Enfon",
          domain,
          subdomain
        },
        user: {
          name,
          email: profile.email,
          avatarUrl: profile.picture
        },
        authenticationProvider: {
          name: providerName,
          providerId: domain
        },
        authentication: {
          providerId,
          accessToken,
          refreshToken,
          expiresIn: params.expires_in,
          scopes
        }
      });
      return done(null, result.user, {
        ...result,
        client
      });
    } catch (err) {
      return done(err, null);
    }
  }));
  router.get(providerName, _koaPassport.default.authenticate(providerName));
  router.get("".concat(providerName, ".callback"), (0, _passport.default)(providerName));
}
const name = exports.name = _env.default.OIDC_DISPLAY_NAME;
var _default = exports.default = router;