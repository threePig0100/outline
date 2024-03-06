"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _koaRouter = _interopRequireDefault(require("koa-router"));
var _types = require("./../../../../shared/types");
var _domains = require("./../../../../shared/utils/domains");
var _InviteAcceptedEmail = _interopRequireDefault(require("./../../../../server/emails/templates/InviteAcceptedEmail"));
var _SigninEmail = _interopRequireDefault(require("./../../../../server/emails/templates/SigninEmail"));
var _WelcomeEmail = _interopRequireDefault(require("./../../../../server/emails/templates/WelcomeEmail"));
var _env = _interopRequireDefault(require("./../../../../server/env"));
var _errors = require("./../../../../server/errors");
var _rateLimiter = require("./../../../../server/middlewares/rateLimiter");
var _validate = _interopRequireDefault(require("./../../../../server/middlewares/validate"));
var _models = require("./../../../../server/models");
var _RateLimiter = require("./../../../../server/utils/RateLimiter");
var _authentication = require("./../../../../server/utils/authentication");
var _jwt = require("./../../../../server/utils/jwt");
var T = _interopRequireWildcard(require("./schema"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = new _koaRouter.default();
router.post("login", (0, _rateLimiter.rateLimiter)(_RateLimiter.RateLimiterStrategy.TenPerHour), (0, _validate.default)(T.EmailSchema), async ctx => {
  var _team;
  const {
    email,
    password,
    client
  } = ctx.input.body;
  const domain = (0, _domains.parseDomain)(ctx.request.hostname);
  domain.teamSubdomain = "enfon";
  let team;
  if (!_env.default.isCloudHosted) {
    team = await _models.Team.scope("withAuthenticationProviders").findOne();
  } else if (domain.custom) {
    team = await _models.Team.scope("withAuthenticationProviders").findOne({
      where: {
        domain: domain.host
      }
    });
  } else if (domain.teamSubdomain) {
    team = await _models.Team.scope("withAuthenticationProviders").findOne({
      where: {
        subdomain: domain.teamSubdomain
      }
    });
  }
  if (!((_team = team) !== null && _team !== void 0 && _team.emailSigninEnabled)) {
    throw (0, _errors.AuthorizationError)();
  }

  // const user = await User.scope("withAuthentications").findOne({
  //   where: {
  //     teamId: team.id,
  //     email: email.toLowerCase(),
  //   },
  // });
  console.log({
    teamId: team.id,
    email: email.toLowerCase(),
    password: password
  });
  const user = await _models.User.scope("withAuthentications").findOne({
    where: {
      teamId: team.id,
      email: email.toLowerCase(),
      password: password
    }
  });
  if (!user) {
    ctx.body = {
      success: false
    };
    return;
  }

  // If the user matches an email address associated with an SSO
  // provider then just forward them directly to that sign-in page
  if (user.authentications.length) {
    const authenticationProvider = user.authentications[0].authenticationProvider;
    ctx.body = {
      redirect: "".concat(team.url, "/auth/").concat(authenticationProvider === null || authenticationProvider === void 0 ? void 0 : authenticationProvider.name)
    };
    return;
  }

  // send email to users email address with a short-lived token
  await new _SigninEmail.default({
    to: user.email,
    token: user.getEmailSigninToken(),
    teamUrl: team.url,
    client
  }).schedule();
  user.lastSigninEmailSentAt = new Date();
  await user.save();

  // respond with success regardless of whether an email was sent
  ctx.body = {
    token: user.getEmailSigninToken(),
    // 过期时间没有填
    success: true
  };
});
router.get("email.callback", (0, _validate.default)(T.EmailCallbackSchema), async ctx => {
  const {
    token,
    client
  } = ctx.input.query;
  let user;
  try {
    user = await (0, _jwt.getUserForEmailSigninToken)(token);
  } catch (err) {
    ctx.redirect("/?notice=expired-token");
    return;
  }
  if (!user.team.emailSigninEnabled) {
    return ctx.redirect("/?notice=auth-error");
  }
  if (user.isSuspended) {
    return ctx.redirect("/?notice=user-suspended");
  }
  if (user.isInvited) {
    await new _WelcomeEmail.default({
      to: user.email,
      teamUrl: user.team.url
    }).schedule();
    const inviter = await user.$get("invitedBy");
    if (inviter !== null && inviter !== void 0 && inviter.subscribedToEventType(_types.NotificationEventType.InviteAccepted)) {
      await new _InviteAcceptedEmail.default({
        to: inviter.email,
        inviterId: inviter.id,
        invitedName: user.name,
        teamUrl: user.team.url
      }).schedule();
    }
  }

  // set cookies on response and redirect to team subdomain
  await (0, _authentication.signIn)(ctx, "email", {
    user,
    team: user.team,
    isNewTeam: false,
    isNewUser: false,
    client
  });
});
var _default = exports.default = router;