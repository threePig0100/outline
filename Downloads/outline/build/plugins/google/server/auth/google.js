"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _koaPassport = _interopRequireDefault(require("@outlinewiki/koa-passport"));
var _koaRouter = _interopRequireDefault(require("koa-router"));
var _capitalize = _interopRequireDefault(require("lodash/capitalize"));
var _passportGoogleOauth = require("passport-google-oauth2");
var _domains = require("./../../../../shared/utils/domains");
var _accountProvisioner = _interopRequireDefault(require("./../../../../server/commands/accountProvisioner"));
var _env = _interopRequireDefault(require("./../../../../server/env"));
var _errors = require("./../../../../server/errors");
var _passport = _interopRequireDefault(require("./../../../../server/middlewares/passport"));
var _models = require("./../../../../server/models");
var _passport2 = require("./../../../../server/utils/passport");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = new _koaRouter.default();
const providerName = "google";
const scopes = ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"];
if (_env.default.GOOGLE_CLIENT_ID && _env.default.GOOGLE_CLIENT_SECRET) {
  _koaPassport.default.use(new _passportGoogleOauth.Strategy({
    clientID: _env.default.GOOGLE_CLIENT_ID,
    clientSecret: _env.default.GOOGLE_CLIENT_SECRET,
    callbackURL: "".concat(_env.default.URL, "/auth/google.callback"),
    passReqToCallback: true,
    // @ts-expect-error StateStore
    store: new _passport2.StateStore(),
    scope: scopes
  }, async function (ctx, accessToken, refreshToken, params, profile, done) {
    try {
      // "domain" is the Google Workspaces domain
      const domain = profile._json.hd;
      const team = await (0, _passport2.getTeamFromContext)(ctx);
      const client = (0, _passport2.getClientFromContext)(ctx);

      // No profile domain means personal gmail account
      // No team implies the request came from the apex domain
      // This combination is always an error
      if (!domain && !team) {
        const userExists = await _models.User.count({
          where: {
            email: profile.email.toLowerCase()
          }
        });

        // Users cannot create a team with personal gmail accounts
        if (!userExists) {
          throw (0, _errors.GmailAccountCreationError)();
        }

        // To log-in with a personal account, users must specify a team subdomain
        throw (0, _errors.TeamDomainRequiredError)();
      }

      // remove the TLD and form a subdomain from the remaining
      // subdomains of the form "foo.bar.com" are allowed as primary Google Workspaces domains
      // see https://support.google.com/nonprofits/thread/19685140/using-a-subdomain-as-a-primary-domain
      const subdomain = domain ? (0, _domains.slugifyDomain)(domain) : "";
      const teamName = (0, _capitalize.default)(subdomain);

      // Request a larger size profile picture than the default by tweaking
      // the query parameter.
      const avatarUrl = profile.picture.replace("=s96-c", "=s128-c");

      // if a team can be inferred, we assume the user is only interested in signing into
      // that team in particular; otherwise, we will do a best effort at finding their account
      // or provisioning a new one (within AccountProvisioner)
      const result = await (0, _accountProvisioner.default)({
        ip: ctx.ip,
        team: {
          teamId: team === null || team === void 0 ? void 0 : team.id,
          name: teamName,
          domain,
          subdomain
        },
        user: {
          email: profile.email,
          name: profile.displayName,
          avatarUrl
        },
        authenticationProvider: {
          name: providerName,
          providerId: domain !== null && domain !== void 0 ? domain : ""
        },
        authentication: {
          providerId: profile.id,
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
  router.get("google", _koaPassport.default.authenticate(providerName, {
    accessType: "offline",
    prompt: "select_account consent"
  }));
  router.get("google.callback", (0, _passport.default)(providerName));
}
var _default = exports.default = router;