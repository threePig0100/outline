"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _path = _interopRequireDefault(require("path"));
var _glob = _interopRequireDefault(require("glob"));
var _koa = _interopRequireDefault(require("koa"));
var _koaBody = _interopRequireDefault(require("koa-body"));
var _koaRouter = _interopRequireDefault(require("koa-router"));
var _koaUseragent = _interopRequireDefault(require("koa-useragent"));
var _env = _interopRequireDefault(require("./../../env"));
var _errors = require("./../../errors");
var _Logger = _interopRequireDefault(require("./../../logging/Logger"));
var _coaleseBody = _interopRequireDefault(require("./../../middlewares/coaleseBody"));
var _apiKeys = _interopRequireDefault(require("./apiKeys"));
var _attachments = _interopRequireDefault(require("./attachments"));
var _auth = _interopRequireDefault(require("./auth"));
var _authenticationProviders = _interopRequireDefault(require("./authenticationProviders"));
var _collections = _interopRequireDefault(require("./collections"));
var _comments = _interopRequireDefault(require("./comments/comments"));
var _cron = _interopRequireDefault(require("./cron"));
var _developer = _interopRequireDefault(require("./developer"));
var _documents = _interopRequireDefault(require("./documents"));
var _rooms = _interopRequireDefault(require("./rooms"));
var _events = _interopRequireDefault(require("./events"));
var _fileOperations = _interopRequireDefault(require("./fileOperations"));
var _groups = _interopRequireDefault(require("./groups"));
var _integrations = _interopRequireDefault(require("./integrations"));
var _apiResponse = _interopRequireDefault(require("./middlewares/apiResponse"));
var _apiTracer = _interopRequireDefault(require("./middlewares/apiTracer"));
var _editor = _interopRequireDefault(require("./middlewares/editor"));
var _notifications = _interopRequireDefault(require("./notifications"));
var _pins = _interopRequireDefault(require("./pins"));
var _revisions = _interopRequireDefault(require("./revisions"));
var _searches = _interopRequireDefault(require("./searches"));
var _shares = _interopRequireDefault(require("./shares"));
var _stars = _interopRequireDefault(require("./stars"));
var _subscriptions = _interopRequireDefault(require("./subscriptions"));
var _teams = _interopRequireDefault(require("./teams"));
var _urls = _interopRequireDefault(require("./urls"));
var _userMemberships = _interopRequireDefault(require("./userMemberships"));
var _users = _interopRequireDefault(require("./users"));
var _views = _interopRequireDefault(require("./views"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const api = new _koa.default();
const router = new _koaRouter.default();

// middlewares
api.use((0, _koaBody.default)({
  multipart: true,
  formidable: {
    maxFileSize: Math.max(_env.default.FILE_STORAGE_UPLOAD_MAX_SIZE, _env.default.MAXIMUM_IMPORT_SIZE),
    maxFieldsSize: 10 * 1024 * 1024
  }
}));
api.use((0, _coaleseBody.default)());
api.use(_koaUseragent.default);
api.use((0, _apiTracer.default)());
api.use((0, _apiResponse.default)());
api.use((0, _editor.default)());

// register package API routes before others to allow for overrides
const rootDir = _env.default.ENVIRONMENT === "test" ? "" : "build";
_glob.default.sync(_path.default.join(rootDir, "plugins/*/server/api/!(*.test).[jt]s")).forEach(filePath => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pkg = require(_path.default.join(process.cwd(), filePath)).default;
  if (pkg && "routes" in pkg) {
    router.use("/", pkg.routes());
    _Logger.default.debug("lifecycle", "Registered API routes for ".concat(filePath));
  }
});

// routes
router.use("/", _auth.default.routes());
router.use("/", _authenticationProviders.default.routes());
router.use("/", _events.default.routes());
router.use("/", _users.default.routes());
router.use("/", _collections.default.routes());
router.use("/", _comments.default.routes());
router.use("/", _documents.default.routes());
router.use("/", _rooms.default.routes());
router.use("/", _pins.default.routes());
router.use("/", _revisions.default.routes());
router.use("/", _views.default.routes());
router.use("/", _apiKeys.default.routes());
router.use("/", _searches.default.routes());
router.use("/", _shares.default.routes());
router.use("/", _stars.default.routes());
router.use("/", _subscriptions.default.routes());
router.use("/", _teams.default.routes());
router.use("/", _integrations.default.routes());
router.use("/", _notifications.default.routes());
router.use("/", _attachments.default.routes());
router.use("/", _cron.default.routes());
router.use("/", _groups.default.routes());
router.use("/", _fileOperations.default.routes());
router.use("/", _urls.default.routes());
router.use("/", _userMemberships.default.routes());
if (_env.default.isDevelopment) {
  router.use("/", _developer.default.routes());
}
router.post("*", ctx => {
  ctx.throw((0, _errors.NotFoundError)("Endpoint not found"));
});
router.get("*", ctx => {
  ctx.throw((0, _errors.NotFoundError)("Endpoint not found"));
});

// Router is embedded in a Koa application wrapper, because koa-router does not
// allow middleware to catch any routes which were not explicitly defined.
api.use(router.routes());
api.use(router.allowedMethods());
var _default = exports.default = api;