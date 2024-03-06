"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createMiddleware;
var _koaPassport = _interopRequireDefault(require("@outlinewiki/koa-passport"));
var _passportOauth = require("passport-oauth2");
var _types = require("./../../shared/types");
var _env = _interopRequireDefault(require("./../env"));
var _errors = require("./../errors");
var _Logger = _interopRequireDefault(require("./../logging/Logger"));
var _authentication = require("./../utils/authentication");
var _passport = require("./../utils/passport");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function createMiddleware(providerName) {
  return function passportMiddleware(ctx) {
    return _koaPassport.default.authorize(providerName, {
      session: false
    }, async (err, user, result) => {
      if (err) {
        _Logger.default.error("Error during authentication", err instanceof _passportOauth.InternalOAuthError ? err.oauthError : err);
        if (err.id) {
          var _err$redirectUrl, _state$host;
          const notice = err.id.replace(/_/g, "-");
          const redirectUrl = (_err$redirectUrl = err.redirectUrl) !== null && _err$redirectUrl !== void 0 ? _err$redirectUrl : "/";
          const hasQueryString = redirectUrl === null || redirectUrl === void 0 ? void 0 : redirectUrl.includes("?");

          // Every authentication action is routed through the apex domain.
          // But when there is an error, we want to redirect the user on the
          // same domain or subdomain that they originated from (found in state).

          // get original host
          const stateString = ctx.cookies.get("state");
          const state = stateString ? (0, _passport.parseState)(stateString) : undefined;
          const host = (_state$host = state === null || state === void 0 ? void 0 : state.host) !== null && _state$host !== void 0 ? _state$host : ctx.hostname;

          // form a URL object with the err.redirectUrl and replace the host
          const reqProtocol = (state === null || state === void 0 ? void 0 : state.client) === _types.Client.Desktop ? "outline" : ctx.protocol;
          const requestHost = ctx.get("host");
          const url = new URL("".concat(reqProtocol, "://").concat(requestHost).concat(redirectUrl));
          url.host = host;
          return ctx.redirect("".concat(url.toString()).concat(hasQueryString ? "&" : "?", "notice=").concat(notice));
        }
        if (_env.default.isDevelopment) {
          throw err;
        }
        return ctx.redirect("/?notice=auth-error");
      }

      // Passport.js may invoke this callback with err=null and user=null in
      // the event that error=access_denied is received from the OAuth server.
      // I'm not sure why this exception to the rule exists, but it does:
      // https://github.com/jaredhanson/passport-oauth2/blob/e20f26aad60ed54f0e7952928cbb64979ef8da2b/lib/strategy.js#L135
      if (!user && !(result !== null && result !== void 0 && result.user)) {
        _Logger.default.error("No user returned during authentication", (0, _errors.AuthenticationError)());
        return ctx.redirect("/?notice=auth-error");
      }

      // Handle errors from Azure which come in the format: message, Trace ID,
      // Correlation ID, Timestamp in these two query string parameters.
      const {
        error,
        error_description
      } = ctx.request.query;
      if (error && error_description) {
        _Logger.default.error("Error from Azure during authentication", new Error(String(error_description)));
        // Display only the descriptive message to the user, log the rest
        const description = String(error_description).split("Trace ID")[0];
        return ctx.redirect("/?notice=auth-error&description=".concat(description));
      }
      if (result.user.isSuspended) {
        return ctx.redirect("/?notice=user-suspended");
      }
      await (0, _authentication.signIn)(ctx, providerName, result);
    })(ctx);
  };
}