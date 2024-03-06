"use strict";

var _env = _interopRequireDefault(require("../env"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// test environment variables
_env.default.SMTP_HOST = "smtp.example.com";
_env.default.ENVIRONMENT = "test";
_env.default.GOOGLE_CLIENT_ID = "123";
_env.default.GOOGLE_CLIENT_SECRET = "123";
_env.default.SLACK_CLIENT_ID = "123";
_env.default.SLACK_CLIENT_SECRET = "123";
_env.default.AZURE_CLIENT_ID = undefined;
_env.default.AZURE_CLIENT_SECRET = undefined;
_env.default.OIDC_CLIENT_ID = "client-id";
_env.default.OIDC_CLIENT_SECRET = "client-secret";
_env.default.OIDC_AUTH_URI = "http://localhost/authorize";
_env.default.OIDC_TOKEN_URI = "http://localhost/token";
_env.default.OIDC_USERINFO_URI = "http://localhost/userinfo";
_env.default.RATE_LIMITER_ENABLED = false;
_env.default.FILE_STORAGE = "local";
_env.default.FILE_STORAGE_LOCAL_ROOT_DIR = "/tmp";
_env.default.IFRAMELY_API_KEY = "123";
if (process.env.DATABASE_URL_TEST) {
  _env.default.DATABASE_URL = process.env.DATABASE_URL_TEST;
}