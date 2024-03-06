"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderShare = exports.renderApp = void 0;
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
var _util = _interopRequireDefault(require("util"));
var _escape = _interopRequireDefault(require("lodash/escape"));
var _sequelize = require("sequelize");
var _isUUID = _interopRequireDefault(require("validator/lib/isUUID"));
var _types = require("./../../shared/types");
var _documentLoader = _interopRequireDefault(require("./../commands/documentLoader"));
var _env = _interopRequireDefault(require("./../env"));
var _models = require("./../models");
var _env2 = _interopRequireDefault(require("./../presenters/env"));
var _passport = require("./../utils/passport");
var _prefetchTags = _interopRequireDefault(require("./../utils/prefetchTags"));
var _readManifestFile = _interopRequireDefault(require("./../utils/readManifestFile"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const readFile = _util.default.promisify(_fs.default.readFile);
const entry = "app/index.tsx";
const viteHost = _env.default.URL.replace(":".concat(_env.default.PORT), ":3001");
let indexHtmlCache;
const readIndexFile = async () => {
  if (_env.default.isProduction || _env.default.isTest) {
    if (indexHtmlCache) {
      return indexHtmlCache;
    }
  }
  if (_env.default.isTest) {
    return await readFile(_path.default.join(__dirname, "../static/index.html"));
  }
  if (_env.default.isDevelopment) {
    return await readFile(_path.default.join(__dirname, "../../../server/static/index.html"));
  }
  return indexHtmlCache = await readFile(_path.default.join(__dirname, "../../app/index.html"));
};
const renderApp = async function (ctx, next) {
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const {
    title = _env.default.APP_NAME,
    description = "A modern team knowledge base for your internal documentation, product specs, support answers, meeting notes, onboarding, &amp; more…",
    canonical = "",
    shortcutIcon = "".concat(_env.default.CDN_URL || "", "/images/favicon-32.png")
  } = options;
  if (ctx.request.path === "/realtime/") {
    return next();
  }
  const {
    shareId
  } = ctx.params;
  const page = await readIndexFile();
  const environment = "\n    <script nonce=\"".concat(ctx.state.cspNonce, "\">\n      window.env = ").concat(JSON.stringify((0, _env2.default)(_env.default, options)), ";\n    </script>\n  ");
  const scriptTags = _env.default.isProduction ? "<script type=\"module\" nonce=\"".concat(ctx.state.cspNonce, "\" src=\"").concat(_env.default.CDN_URL || "", "/static/").concat((0, _readManifestFile.default)()[entry]["file"], "\"></script>") : "<script type=\"module\" nonce=\"".concat(ctx.state.cspNonce, "\">\n        import RefreshRuntime from \"").concat(viteHost, "/static/@react-refresh\"\n        RefreshRuntime.injectIntoGlobalHook(window)\n        window.$RefreshReg$ = () => { }\n        window.$RefreshSig$ = () => (type) => type\n        window.__vite_plugin_react_preamble_installed__ = true\n      </script>\n      <script type=\"module\" nonce=\"").concat(ctx.state.cspNonce, "\" src=\"").concat(viteHost, "/static/@vite/client\"></script>\n      <script type=\"module\" nonce=\"").concat(ctx.state.cspNonce, "\" src=\"").concat(viteHost, "/static/").concat(entry, "\"></script>\n    ");
  ctx.body = page.toString().replace(/\{env\}/g, environment).replace(/\{title\}/g, (0, _escape.default)(title)).replace(/\{description\}/g, (0, _escape.default)(description)).replace(/\{canonical-url\}/g, canonical).replace(/\{shortcut-icon\}/g, shortcutIcon).replace(/\{prefetch\}/g, shareId ? "" : _prefetchTags.default).replace(/\{slack-app-id\}/g, _env.default.SLACK_APP_ID || "").replace(/\{cdn-url\}/g, _env.default.CDN_URL || "").replace(/\{script-tags\}/g, scriptTags).replace(/\{csp-nonce\}/g, ctx.state.cspNonce);
};
exports.renderApp = renderApp;
const renderShare = async (ctx, next) => {
  var _ctx$state, _ctx$state$rootShare, _document, _document2, _team2;
  const rootShareId = (_ctx$state = ctx.state) === null || _ctx$state === void 0 ? void 0 : (_ctx$state$rootShare = _ctx$state.rootShare) === null || _ctx$state$rootShare === void 0 ? void 0 : _ctx$state$rootShare.id;
  const shareId = rootShareId !== null && rootShareId !== void 0 ? rootShareId : ctx.params.shareId;
  const documentSlug = ctx.params.documentSlug;

  // Find the share record if publicly published so that the document title
  // can be be returned in the server-rendered HTML. This allows it to appear in
  // unfurls with more reliablity
  let share, document, team, analytics;
  try {
    var _team, _share;
    team = await (0, _passport.getTeamFromContext)(ctx);
    const result = await (0, _documentLoader.default)({
      id: documentSlug,
      shareId,
      teamId: (_team = team) === null || _team === void 0 ? void 0 : _team.id
    });
    share = result.share;
    if ((0, _isUUID.default)(shareId) && (_share = share) !== null && _share !== void 0 && _share.urlId) {
      // Redirect temporarily because the url slug
      // can be modified by the user at any time
      ctx.redirect(share.canonicalUrl);
      ctx.status = 307;
      return;
    }
    document = result.document;
    analytics = await _models.Integration.findOne({
      where: {
        teamId: document.teamId,
        type: _types.IntegrationType.Analytics
      }
    });
    if (share && !ctx.userAgent.isBot) {
      await share.update({
        lastAccessedAt: new Date(),
        views: _sequelize.Sequelize.literal("views + 1")
      });
    }
  } catch (err) {
    // If the share or document does not exist, return a 404.
    ctx.status = 404;
  }

  // Allow shares to be embedded in iframes on other websites
  ctx.remove("X-Frame-Options");

  // Inject share information in SSR HTML
  return renderApp(ctx, next, {
    title: (_document = document) === null || _document === void 0 ? void 0 : _document.title,
    description: (_document2 = document) === null || _document2 === void 0 ? void 0 : _document2.getSummary(),
    shortcutIcon: (_team2 = team) !== null && _team2 !== void 0 && _team2.getPreference(_types.TeamPreference.PublicBranding) && team.avatarUrl ? team.avatarUrl : undefined,
    analytics,
    rootShareId,
    canonical: share ? "".concat(share.canonicalUrl).concat(documentSlug && document ? document.url : "") : undefined
  });
};
exports.renderShare = renderShare;