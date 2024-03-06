"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SLUG_URL_REGEX = exports.SHARE_URL_SLUG_REGEX = void 0;
exports.changelogUrl = changelogUrl;
exports.developersUrl = developersUrl;
exports.feedbackUrl = feedbackUrl;
exports.githubIssuesUrl = githubIssuesUrl;
exports.githubUrl = githubUrl;
exports.slackAuth = slackAuth;
exports.twitterUrl = twitterUrl;
var _env = _interopRequireDefault(require("../env"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function slackAuth(state) {
  let scopes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ["identity.email", "identity.basic", "identity.avatar", "identity.team"];
  let clientId = arguments.length > 2 ? arguments[2] : undefined;
  let redirectUri = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "".concat(_env.default.URL, "/auth/slack.callback");
  const baseUrl = "https://slack.com/oauth/authorize";
  const params = {
    client_id: clientId,
    scope: scopes ? scopes.join(" ") : "",
    redirect_uri: redirectUri,
    state
  };
  const urlParams = Object.keys(params).map(key => "".concat(key, "=").concat(encodeURIComponent(params[key]))).join("&");
  return "".concat(baseUrl, "?").concat(urlParams);
}
function githubUrl() {
  return "https://www.github.com/outline";
}
function githubIssuesUrl() {
  return "https://www.github.com/outline/outline/issues";
}
function twitterUrl() {
  return "https://twitter.com/getoutline";
}
function feedbackUrl() {
  return "https://www.getoutline.com/contact";
}
function developersUrl() {
  return "https://www.getoutline.com/developers";
}
function changelogUrl() {
  return "https://www.getoutline.com/changelog";
}
const SLUG_URL_REGEX = exports.SLUG_URL_REGEX = /^(?:[0-9a-zA-Z-_~]*-)?([a-zA-Z0-9]{10,15})$/;
const SHARE_URL_SLUG_REGEX = exports.SHARE_URL_SLUG_REGEX = /^[0-9a-z-]+$/;