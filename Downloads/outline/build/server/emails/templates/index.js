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
const emails = {};
(0, _fs.requireDirectory)(__dirname).forEach(_ref => {
  let [module, id] = _ref;
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'default' does not exist on type 'unknown'
  const {
    default: Email
  } = module;
  if (id === "index") {
    return;
  }
  emails[id] = Email;
});
const rootDir = _env.default.ENVIRONMENT === "test" ? "" : "build";
_glob.glob.sync(_path.default.join(rootDir, "plugins/*/server/email/templates/!(*.test).[jt]s")).forEach(filePath => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const template = require(_path.default.join(process.cwd(), filePath)).default;
  _Logger.default.debug("lifecycle", "Registered email template ".concat(template.name));
  emails[template.name] = template;
});
var _default = exports.default = emails;