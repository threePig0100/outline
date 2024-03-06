"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Environment = void 0;
var _os = _interopRequireDefault(require("os"));
var _classValidator = require("class-validator");
var _uniq = _interopRequireDefault(require("lodash/uniq"));
var _i18n = require("./../shared/i18n");
var _validators = require("./utils/validators");
var _Deprecated = _interopRequireDefault(require("./models/decorators/Deprecated"));
var _args = require("./utils/args");
var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _dec34, _dec35, _dec36, _dec37, _dec38, _dec39, _dec40, _dec41, _dec42, _dec43, _dec44, _dec45, _dec46, _dec47, _dec48, _dec49, _dec50, _dec51, _dec52, _dec53, _dec54, _dec55, _dec56, _dec57, _dec58, _dec59, _dec60, _dec61, _dec62, _dec63, _dec64, _dec65, _dec66, _dec67, _dec68, _dec69, _dec70, _dec71, _dec72, _dec73, _dec74, _dec75, _dec76, _dec77, _dec78, _dec79, _dec80, _dec81, _dec82, _dec83, _dec84, _dec85, _dec86, _dec87, _dec88, _dec89, _dec90, _dec91, _dec92, _dec93, _dec94, _dec95, _dec96, _dec97, _dec98, _dec99, _dec100, _dec101, _dec102, _dec103, _dec104, _dec105, _dec106, _dec107, _dec108, _dec109, _dec110, _dec111, _dec112, _dec113, _dec114, _dec115, _dec116, _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29, _descriptor30, _descriptor31, _descriptor32, _descriptor33, _descriptor34, _descriptor35, _descriptor36, _descriptor37, _descriptor38, _descriptor39, _descriptor40, _descriptor41, _descriptor42, _descriptor43, _descriptor44, _descriptor45, _descriptor46, _descriptor47, _descriptor48, _descriptor49, _descriptor50, _descriptor51, _descriptor52, _descriptor53, _descriptor54, _descriptor55, _descriptor56, _descriptor57, _descriptor58, _descriptor59, _descriptor60, _descriptor61, _descriptor62, _descriptor63, _descriptor64, _descriptor65, _descriptor66;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }
function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }
/* eslint-disable @typescript-eslint/no-var-requires */

// Load the process environment variables
require("dotenv").config({
  silent: true
});
let Environment = exports.Environment = (_dec = (0, _classValidator.IsIn)(["development", "production", "staging", "test"]), _dec2 = (0, _classValidator.IsByteLength)(32, 64), _dec3 = (0, _classValidator.IsNotEmpty)(), _dec4 = (0, _classValidator.IsNotEmpty)(), _dec5 = (0, _classValidator.IsUrl)({
  require_tld: false,
  allow_underscores: true,
  protocols: ["postgres", "postgresql"]
}), _dec6 = (0, _classValidator.IsOptional)(), _dec7 = (0, _classValidator.IsUrl)({
  require_tld: false,
  allow_underscores: true,
  protocols: ["postgres", "postgresql"]
}), _dec8 = (0, _classValidator.IsNumber)(), _dec9 = (0, _classValidator.IsOptional)(), _dec10 = (0, _classValidator.IsNumber)(), _dec11 = (0, _classValidator.IsOptional)(), _dec12 = (0, _classValidator.IsIn)(["disable", "allow", "require", "prefer", "verify-ca", "verify-full"]), _dec13 = (0, _classValidator.IsOptional)(), _dec14 = (0, _classValidator.IsNotEmpty)(), _dec15 = (0, _classValidator.IsNotEmpty)(), _dec16 = (0, _classValidator.IsUrl)({
  protocols: ["http", "https"],
  require_protocol: true,
  require_tld: false
}), _dec17 = (0, _classValidator.IsOptional)(), _dec18 = (0, _classValidator.IsUrl)({
  protocols: ["http", "https"],
  require_protocol: true,
  require_tld: false
}), _dec19 = (0, _classValidator.IsUrl)({
  require_tld: false,
  require_protocol: true,
  protocols: ["http", "https", "ws", "wss"]
}), _dec20 = (0, _classValidator.IsOptional)(), _dec21 = (0, _classValidator.IsOptional)(), _dec22 = (0, _classValidator.IsNumber)(), _dec23 = (0, _classValidator.IsNumber)(), _dec24 = (0, _classValidator.IsOptional)(), _dec25 = (0, _classValidator.IsIn)(["error", "warn", "info", "http", "verbose", "debug", "silly"]), _dec26 = (0, _classValidator.IsNumber)(), _dec27 = (0, _classValidator.IsOptional)(), _dec28 = (0, _classValidator.IsNumber)(), _dec29 = (0, _classValidator.IsOptional)(), _dec30 = (0, _classValidator.IsOptional)(), _dec31 = (0, _validators.CannotUseWithout)("SSL_CERT"), _dec32 = (0, _classValidator.IsOptional)(), _dec33 = (0, _validators.CannotUseWithout)("SSL_KEY"), _dec34 = (0, _classValidator.IsIn)(_i18n.languages), _dec35 = (0, _classValidator.IsBoolean)(), _dec36 = (0, _classValidator.IsBoolean)(), _dec37 = (0, _classValidator.IsNumber)(), _dec38 = (0, _classValidator.IsOptional)(), _dec39 = (0, _classValidator.IsEmail)({
  allow_display_name: true,
  allow_ip_domain: true
}), _dec40 = (0, _classValidator.IsOptional)(), _dec41 = (0, _classValidator.IsEmail)({
  allow_display_name: true,
  allow_ip_domain: true
}), _dec42 = (0, _classValidator.IsOptional)(), _dec43 = (0, _classValidator.IsUrl)(), _dec44 = (0, _classValidator.IsOptional)(), _dec45 = (0, _classValidator.IsUrl)(), _dec46 = (0, _classValidator.IsOptional)(), _dec47 = (0, _classValidator.IsOptional)(), _dec48 = (0, _classValidator.IsOptional)(), _dec49 = (0, _validators.CannotUseWithout)("GOOGLE_CLIENT_SECRET"), _dec50 = (0, _classValidator.IsOptional)(), _dec51 = (0, _validators.CannotUseWithout)("GOOGLE_CLIENT_ID"), _dec52 = (0, _classValidator.IsOptional)(), _dec53 = (0, _Deprecated.default)("Use SLACK_CLIENT_SECRET instead"), _dec54 = (0, _classValidator.IsOptional)(), _dec55 = (0, _Deprecated.default)("Use SLACK_CLIENT_ID instead"), _dec56 = (0, _classValidator.IsOptional)(), _dec57 = (0, _validators.CannotUseWithout)("SLACK_CLIENT_SECRET"), _dec58 = (0, _classValidator.IsOptional)(), _dec59 = (0, _validators.CannotUseWithout)("SLACK_CLIENT_ID"), _dec60 = (0, _classValidator.IsOptional)(), _dec61 = (0, _classValidator.IsOptional)(), _dec62 = (0, _validators.CannotUseWithout)("SLACK_CLIENT_ID"), _dec63 = (0, _classValidator.IsOptional)(), _dec64 = (0, _classValidator.IsBoolean)(), _dec65 = (0, _classValidator.IsOptional)(), _dec66 = (0, _validators.CannotUseWithout)("AZURE_CLIENT_SECRET"), _dec67 = (0, _classValidator.IsOptional)(), _dec68 = (0, _validators.CannotUseWithout)("AZURE_CLIENT_ID"), _dec69 = (0, _classValidator.IsOptional)(), _dec70 = (0, _validators.CannotUseWithout)("AZURE_CLIENT_ID"), _dec71 = (0, _classValidator.IsOptional)(), _dec72 = (0, _validators.CannotUseWithout)("OIDC_CLIENT_SECRET"), _dec73 = (0, _validators.CannotUseWithout)("OIDC_AUTH_URI"), _dec74 = (0, _validators.CannotUseWithout)("OIDC_TOKEN_URI"), _dec75 = (0, _validators.CannotUseWithout)("OIDC_USERINFO_URI"), _dec76 = (0, _validators.CannotUseWithout)("OIDC_DISPLAY_NAME"), _dec77 = (0, _classValidator.IsOptional)(), _dec78 = (0, _validators.CannotUseWithout)("OIDC_CLIENT_ID"), _dec79 = (0, _classValidator.MaxLength)(50), _dec80 = (0, _classValidator.IsOptional)(), _dec81 = (0, _classValidator.IsUrl)({
  require_tld: false,
  allow_underscores: true
}), _dec82 = (0, _classValidator.IsOptional)(), _dec83 = (0, _classValidator.IsUrl)({
  require_tld: false,
  allow_underscores: true
}), _dec84 = (0, _classValidator.IsOptional)(), _dec85 = (0, _classValidator.IsUrl)({
  require_tld: false,
  allow_underscores: true
}), _dec86 = (0, _classValidator.IsOptional)(), _dec87 = (0, _classValidator.IsBoolean)(), _dec88 = (0, _classValidator.IsOptional)(), _dec89 = (0, _classValidator.IsNumber)(), _dec90 = (0, _validators.CannotUseWithout)("RATE_LIMITER_ENABLED"), _dec91 = (0, _classValidator.IsOptional)(), _dec92 = (0, _classValidator.IsNumber)(), _dec93 = (0, _classValidator.IsOptional)(), _dec94 = (0, _classValidator.IsNumber)(), _dec95 = (0, _validators.CannotUseWithout)("RATE_LIMITER_ENABLED"), _dec96 = (0, _classValidator.IsOptional)(), _dec97 = (0, _classValidator.IsNumber)(), _dec98 = (0, _Deprecated.default)("Use FILE_STORAGE_UPLOAD_MAX_SIZE instead"), _dec99 = (0, _classValidator.IsOptional)(), _dec100 = (0, _classValidator.IsOptional)(), _dec101 = (0, _validators.CannotUseWithout)("AWS_ACCESS_KEY_ID"), _dec102 = (0, _classValidator.IsOptional)(), _dec103 = (0, _classValidator.IsOptional)(), _dec104 = (0, _classValidator.IsOptional)(), _dec105 = (0, _classValidator.IsOptional)(), _dec106 = (0, _classValidator.IsOptional)(), _dec107 = (0, _classValidator.IsOptional)(), _dec108 = (0, _classValidator.IsIn)(["local", "s3"]), _dec109 = (0, _classValidator.IsNumber)(), _dec110 = (0, _classValidator.IsNumber)(), _dec111 = (0, _classValidator.IsNumber)(), _dec112 = (0, _classValidator.IsOptional)(), _dec113 = (0, _classValidator.IsUrl)({
  require_tld: false,
  require_protocol: true,
  allow_underscores: true,
  protocols: ["http", "https"]
}), _dec114 = (0, _classValidator.IsOptional)(), _dec115 = (0, _validators.CannotUseWithout)("IFRAMELY_URL"), _dec116 = (0, _classValidator.IsBoolean)(), (_class = class Environment {
  constructor() {
    var _ref, _getArg, _process$env$ALLOWED_, _process$env$SMTP_SEC, _process$env$DD_SERVI, _process$env$OIDC_USE, _process$env$OIDC_SCO, _this$toOptionalStrin;
    _defineProperty(this, "validationPromise", void 0);
    /**
     * The current environment name.
     */
    _initializerDefineProperty(this, "ENVIRONMENT", _descriptor, this);
    /**
     * The secret key is used for encrypting data. Do not change this value once
     * set or your users will be unable to login.
     */
    _initializerDefineProperty(this, "SECRET_KEY", _descriptor2, this);
    /**
     * The secret that should be passed to the cron utility endpoint to enable
     * triggering of scheduled tasks.
     */
    _initializerDefineProperty(this, "UTILS_SECRET", _descriptor3, this);
    /**
     * The url of the database.
     */
    _initializerDefineProperty(this, "DATABASE_URL", _descriptor4, this);
    /**
     * The url of the database pool.
     */
    _initializerDefineProperty(this, "DATABASE_CONNECTION_POOL_URL", _descriptor5, this);
    /**
     * Database connection pool configuration.
     */
    _initializerDefineProperty(this, "DATABASE_CONNECTION_POOL_MIN", _descriptor6, this);
    /**
     * Database connection pool configuration.
     */
    _initializerDefineProperty(this, "DATABASE_CONNECTION_POOL_MAX", _descriptor7, this);
    /**
     * Set to "disable" to disable SSL connection to the database. This option is
     * passed through to Postgres. See:
     *
     * https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNECT-SSLMODE
     */
    _initializerDefineProperty(this, "PGSSLMODE", _descriptor8, this);
    /**
     * The url of redis. Note that redis does not have a database after the port.
     * Note: More extensive validation isn't included here due to our support for
     * base64-encoded configuration.
     */
    _initializerDefineProperty(this, "REDIS_URL", _descriptor9, this);
    /**
     * The fully qualified, external facing domain name of the server.
     */
    _initializerDefineProperty(this, "URL", _descriptor10, this);
    /**
     * If using a Cloudfront/Cloudflare distribution or similar it can be set below.
     * This will cause paths to javascript, stylesheets, and images to be updated to
     * the hostname defined in CDN_URL. In your CDN configuration the origin server
     * should be set to the same as URL.
     */
    _initializerDefineProperty(this, "CDN_URL", _descriptor11, this);
    /**
     * The fully qualified, external facing domain name of the collaboration
     * service, if different (unlikely)
     */
    _initializerDefineProperty(this, "COLLABORATION_URL", _descriptor12, this);
    /**
     * The maximum number of network clients that can be connected to a single
     * document at once. Defaults to 100.
     */
    _initializerDefineProperty(this, "COLLABORATION_MAX_CLIENTS_PER_DOCUMENT", _descriptor13, this);
    /**
     * The port that the server will listen on, defaults to 3000.
     */
    _initializerDefineProperty(this, "PORT", _descriptor14, this);
    /**
     * Optional extra debugging. Comma separated
     */
    _defineProperty(this, "DEBUG", process.env.DEBUG || "");
    /**
     * Configure lowest severity level for server logs
     */
    _initializerDefineProperty(this, "LOG_LEVEL", _descriptor15, this);
    /**
     * How many processes should be spawned. As a reasonable rule divide your
     * server's available memory by 512 for a rough estimate
     */
    _initializerDefineProperty(this, "WEB_CONCURRENCY", _descriptor16, this);
    /**
     * How long a request should be processed before giving up and returning an
     * error response to the client, defaults to 10s
     */
    _initializerDefineProperty(this, "REQUEST_TIMEOUT", _descriptor17, this);
    /**
     * Base64 encoded private key if Outline is to perform SSL termination.
     */
    _initializerDefineProperty(this, "SSL_KEY", _descriptor18, this);
    /**
     * Base64 encoded public certificate if Outline is to perform SSL termination.
     */
    _initializerDefineProperty(this, "SSL_CERT", _descriptor19, this);
    /**
     * The default interface language. See translate.getoutline.com for a list of
     * available language codes and their percentage translated.
     */
    _initializerDefineProperty(this, "DEFAULT_LANGUAGE", _descriptor20, this);
    /**
     * A comma list of which services should be enabled on this instance – defaults to all.
     *
     * If a services flag is passed it takes priority over the environment variable
     * for example: --services=web,worker
     */
    _defineProperty(this, "SERVICES", (0, _uniq.default)(((_ref = (_getArg = (0, _args.getArg)("services")) !== null && _getArg !== void 0 ? _getArg : process.env.SERVICES) !== null && _ref !== void 0 ? _ref : "collaboration,websockets,worker,web").split(",").map(service => service.toLowerCase().trim())));
    /**
     * Auto-redirect to https in production. The default is true but you may set
     * to false if you can be sure that SSL is terminated at an external
     * loadbalancer.
     */
    _initializerDefineProperty(this, "FORCE_HTTPS", _descriptor21, this);
    /**
     * Should the installation send anonymized statistics to the maintainers.
     * Defaults to true.
     */
    _initializerDefineProperty(this, "TELEMETRY", _descriptor22, this);
    /**
     * An optional comma separated list of allowed domains.
     */
    _defineProperty(this, "ALLOWED_DOMAINS", (_process$env$ALLOWED_ = process.env.ALLOWED_DOMAINS) !== null && _process$env$ALLOWED_ !== void 0 ? _process$env$ALLOWED_ : process.env.GOOGLE_ALLOWED_DOMAINS);
    // Third-party services
    /**
     * The host of your SMTP server for enabling emails.
     */
    _defineProperty(this, "SMTP_HOST", process.env.SMTP_HOST);
    /**
     * Optional hostname of the client, used for identifying to the server
     * defaults to hostname of the machine.
     */
    _defineProperty(this, "SMTP_NAME", process.env.SMTP_NAME);
    /**
     * The port of your SMTP server.
     */
    _initializerDefineProperty(this, "SMTP_PORT", _descriptor23, this);
    /**
     * The username of your SMTP server, if any.
     */
    _defineProperty(this, "SMTP_USERNAME", process.env.SMTP_USERNAME);
    /**
     * The password for the SMTP username, if any.
     */
    _defineProperty(this, "SMTP_PASSWORD", process.env.SMTP_PASSWORD);
    /**
     * The email address from which emails are sent.
     */
    _initializerDefineProperty(this, "SMTP_FROM_EMAIL", _descriptor24, this);
    /**
     * The reply-to address for emails sent from Outline. If unset the from
     * address is used by default.
     */
    _initializerDefineProperty(this, "SMTP_REPLY_EMAIL", _descriptor25, this);
    /**
     * Override the cipher used for SMTP SSL connections.
     */
    _defineProperty(this, "SMTP_TLS_CIPHERS", this.toOptionalString(process.env.SMTP_TLS_CIPHERS));
    /**
     * If true (the default) the connection will use TLS when connecting to server.
     * If false then TLS is used only if server supports the STARTTLS extension.
     *
     * Setting secure to false therefore does not mean that you would not use an
     * encrypted connection.
     */
    _defineProperty(this, "SMTP_SECURE", this.toBoolean((_process$env$SMTP_SEC = process.env.SMTP_SECURE) !== null && _process$env$SMTP_SEC !== void 0 ? _process$env$SMTP_SEC : "true"));
    /**
     * Sentry DSN for capturing errors and frontend performance.
     */
    _initializerDefineProperty(this, "SENTRY_DSN", _descriptor26, this);
    /**
     * Sentry tunnel URL for bypassing ad blockers
     */
    _initializerDefineProperty(this, "SENTRY_TUNNEL", _descriptor27, this);
    /**
     * A release SHA or other identifier for Sentry.
     */
    _defineProperty(this, "RELEASE", this.toOptionalString(process.env.RELEASE));
    /**
     * A Google Analytics tracking ID, supports v3 or v4 properties.
     */
    _initializerDefineProperty(this, "GOOGLE_ANALYTICS_ID", _descriptor28, this);
    /**
     * A DataDog API key for tracking server metrics.
     */
    _defineProperty(this, "DD_API_KEY", process.env.DD_API_KEY);
    /**
     * The name of the service to use in DataDog.
     */
    _defineProperty(this, "DD_SERVICE", (_process$env$DD_SERVI = process.env.DD_SERVICE) !== null && _process$env$DD_SERVI !== void 0 ? _process$env$DD_SERVI : "outline");
    /**
     * Google OAuth2 client credentials. To enable authentication with Google.
     */
    _initializerDefineProperty(this, "GOOGLE_CLIENT_ID", _descriptor29, this);
    _initializerDefineProperty(this, "GOOGLE_CLIENT_SECRET", _descriptor30, this);
    /**
     * Slack OAuth2 client credentials. To enable authentication with Slack.
     */
    _initializerDefineProperty(this, "SLACK_SECRET", _descriptor31, this);
    _initializerDefineProperty(this, "SLACK_KEY", _descriptor32, this);
    _initializerDefineProperty(this, "SLACK_CLIENT_ID", _descriptor33, this);
    _initializerDefineProperty(this, "SLACK_CLIENT_SECRET", _descriptor34, this);
    /**
     * This is used to verify webhook requests received from Slack.
     */
    _initializerDefineProperty(this, "SLACK_VERIFICATION_TOKEN", _descriptor35, this);
    /**
     * This is injected into the slack-app-id header meta tag if provided.
     */
    _initializerDefineProperty(this, "SLACK_APP_ID", _descriptor36, this);
    /**
     * If enabled a "Post to Channel" button will be added to search result
     * messages inside of Slack. This also requires setup in Slack UI.
     */
    _initializerDefineProperty(this, "SLACK_MESSAGE_ACTIONS", _descriptor37, this);
    /**
     * Azure OAuth2 client credentials. To enable authentication with Azure.
     */
    _initializerDefineProperty(this, "AZURE_CLIENT_ID", _descriptor38, this);
    _initializerDefineProperty(this, "AZURE_CLIENT_SECRET", _descriptor39, this);
    _initializerDefineProperty(this, "AZURE_RESOURCE_APP_ID", _descriptor40, this);
    /**
     * OIDC client credentials. To enable authentication with any
     * compatible provider.
     */
    _initializerDefineProperty(this, "OIDC_CLIENT_ID", _descriptor41, this);
    _initializerDefineProperty(this, "OIDC_CLIENT_SECRET", _descriptor42, this);
    /**
     * The name of the OIDC provider, eg "GitLab" – this will be displayed on the
     * sign-in button and other places in the UI. The default value is:
     * "OpenID Connect".
     */
    _initializerDefineProperty(this, "OIDC_DISPLAY_NAME", _descriptor43, this);
    /**
     * The OIDC authorization endpoint.
     */
    _initializerDefineProperty(this, "OIDC_AUTH_URI", _descriptor44, this);
    /**
     * The OIDC token endpoint.
     */
    _initializerDefineProperty(this, "OIDC_TOKEN_URI", _descriptor45, this);
    /**
     * The OIDC userinfo endpoint.
     */
    _initializerDefineProperty(this, "OIDC_USERINFO_URI", _descriptor46, this);
    /**
     * The OIDC profile field to use as the username. The default value is
     * "preferred_username".
     */
    _defineProperty(this, "OIDC_USERNAME_CLAIM", (_process$env$OIDC_USE = process.env.OIDC_USERNAME_CLAIM) !== null && _process$env$OIDC_USE !== void 0 ? _process$env$OIDC_USE : "preferred_username");
    /**
     * A space separated list of OIDC scopes to request. Defaults to "openid
     * profile email".
     */
    _defineProperty(this, "OIDC_SCOPES", (_process$env$OIDC_SCO = process.env.OIDC_SCOPES) !== null && _process$env$OIDC_SCO !== void 0 ? _process$env$OIDC_SCO : "openid profile email");
    /**
     * A string representing the version of the software.
     *
     * SOURCE_COMMIT is used by Docker Hub
     * SOURCE_VERSION is used by Heroku
     */
    _defineProperty(this, "VERSION", this.toOptionalString(undefined || undefined));
    /**
     * A boolean switch to toggle the rate limiter at application web server.
     */
    _initializerDefineProperty(this, "RATE_LIMITER_ENABLED", _descriptor47, this);
    /**
     * Set max allowed requests in a given duration for default rate limiter to
     * trigger throttling, per IP address.
     */
    _initializerDefineProperty(this, "RATE_LIMITER_REQUESTS", _descriptor48, this);
    /**
     * Set max allowed realtime connections before throttling. Defaults to 50
     * requests/ip/duration window.
     */
    _initializerDefineProperty(this, "RATE_LIMITER_COLLABORATION_REQUESTS", _descriptor49, this);
    /**
     * Set fixed duration window(in secs) for default rate limiter, elapsing which
     * the request quota is reset (the bucket is refilled with tokens).
     */
    _initializerDefineProperty(this, "RATE_LIMITER_DURATION_WINDOW", _descriptor50, this);
    /**
     * @deprecated Set max allowed upload size for file attachments.
     */
    _initializerDefineProperty(this, "AWS_S3_UPLOAD_MAX_SIZE", _descriptor51, this);
    /**
     * Access key ID for AWS S3.
     */
    _initializerDefineProperty(this, "AWS_ACCESS_KEY_ID", _descriptor52, this);
    /**
     * Secret key for AWS S3.
     */
    _initializerDefineProperty(this, "AWS_SECRET_ACCESS_KEY", _descriptor53, this);
    /**
     * The name of the AWS S3 region to use.
     */
    _initializerDefineProperty(this, "AWS_REGION", _descriptor54, this);
    /**
     * Optional AWS S3 endpoint URL for file attachments.
     */
    _initializerDefineProperty(this, "AWS_S3_ACCELERATE_URL", _descriptor55, this);
    /**
     * Optional AWS S3 endpoint URL for file attachments.
     */
    _initializerDefineProperty(this, "AWS_S3_UPLOAD_BUCKET_URL", _descriptor56, this);
    /**
     * The bucket name to store file attachments in.
     */
    _initializerDefineProperty(this, "AWS_S3_UPLOAD_BUCKET_NAME", _descriptor57, this);
    /**
     * Whether to force path style URLs for S3 objects, this is required for some
     * S3-compatible storage providers.
     */
    _initializerDefineProperty(this, "AWS_S3_FORCE_PATH_STYLE", _descriptor58, this);
    /**
     * Set default AWS S3 ACL for file attachments.
     */
    _initializerDefineProperty(this, "AWS_S3_ACL", _descriptor59, this);
    /**
     * Which file storage system to use
     */
    _initializerDefineProperty(this, "FILE_STORAGE", _descriptor60, this);
    /**
     * Set default root dir path for local file storage
     */
    _defineProperty(this, "FILE_STORAGE_LOCAL_ROOT_DIR", (_this$toOptionalStrin = this.toOptionalString(process.env.FILE_STORAGE_LOCAL_ROOT_DIR)) !== null && _this$toOptionalStrin !== void 0 ? _this$toOptionalStrin : "/var/lib/outline/data");
    /**
     * Set max allowed upload size for file attachments.
     */
    _initializerDefineProperty(this, "FILE_STORAGE_UPLOAD_MAX_SIZE", _descriptor61, this);
    /**
     * Because imports can be much larger than regular file attachments and are
     * deleted automatically we allow an optional separate limit on the size of
     * imports.
     */
    _initializerDefineProperty(this, "MAXIMUM_IMPORT_SIZE", _descriptor62, this);
    /**
     * Limit on export size in bytes. Defaults to the total memory available to
     * the container.
     */
    _initializerDefineProperty(this, "MAXIMUM_EXPORT_SIZE", _descriptor63, this);
    /**
     * Iframely url
     */
    _initializerDefineProperty(this, "IFRAMELY_URL", _descriptor64, this);
    /**
     * Iframely API key
     */
    _initializerDefineProperty(this, "IFRAMELY_API_KEY", _descriptor65, this);
    /**
     * Enable unsafe-inline in script-src CSP directive
     */
    _initializerDefineProperty(this, "DEVELOPMENT_UNSAFE_INLINE_CSP", _descriptor66, this);
    /**
     * The product name
     */
    _defineProperty(this, "APP_NAME", "Outline");
    this.validationPromise = (0, _classValidator.validate)(this);
  }

  /**
   * Allows waiting on the environment to be validated.
   *
   * @returns A promise that resolves when the environment is validated.
   */
  validate() {
    return this.validationPromise;
  }
  /**
   * Returns true if the current installation is the cloud hosted version at
   * getoutline.com
   */
  get isCloudHosted() {
    return ["https://app.getoutline.com", "https://app.outline.dev", "https://app.outline.dev:3000"].includes(this.URL);
  }

  /**
   * Returns true if the current installation is running in production.
   */
  get isProduction() {
    return this.ENVIRONMENT === "production";
  }

  /**
   * Returns true if the current installation is running in the development environment.
   */
  get isDevelopment() {
    return this.ENVIRONMENT === "development";
  }

  /**
   * Returns true if the current installation is running in a test environment.
   */
  get isTest() {
    return this.ENVIRONMENT === "test";
  }
  toOptionalString(value) {
    return value ? value : undefined;
  }
  toOptionalNumber(value) {
    return value ? parseInt(value, 10) : undefined;
  }

  /**
   * Convert a string to a boolean. Supports the following:
   *
   * 0 = false
   * 1 = true
   * "true" = true
   * "false" = false
   * "" = false
   *
   * @param value The string to convert
   * @returns A boolean
   */
  toBoolean(value) {
    try {
      return value ? !!JSON.parse(value) : false;
    } catch (err) {
      throw new Error("\"".concat(value, "\" could not be parsed as a boolean, must be \"true\" or \"false\""));
    }
  }
}, (_descriptor = _applyDecoratedDescriptor(_class.prototype, "ENVIRONMENT", [_dec], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    var _process$env$NODE_ENV;
    return (_process$env$NODE_ENV = process.env.NODE_ENV) !== null && _process$env$NODE_ENV !== void 0 ? _process$env$NODE_ENV : "production";
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "SECRET_KEY", [_dec2], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    var _process$env$SECRET_K;
    return (_process$env$SECRET_K = process.env.SECRET_KEY) !== null && _process$env$SECRET_K !== void 0 ? _process$env$SECRET_K : "";
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "UTILS_SECRET", [_dec3], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    var _process$env$UTILS_SE;
    return (_process$env$UTILS_SE = process.env.UTILS_SECRET) !== null && _process$env$UTILS_SE !== void 0 ? _process$env$UTILS_SE : "";
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, "DATABASE_URL", [_dec4, _dec5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    var _process$env$DATABASE;
    return (_process$env$DATABASE = process.env.DATABASE_URL) !== null && _process$env$DATABASE !== void 0 ? _process$env$DATABASE : "";
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, "DATABASE_CONNECTION_POOL_URL", [_dec6, _dec7], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return this.toOptionalString(process.env.DATABASE_CONNECTION_POOL_URL);
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class.prototype, "DATABASE_CONNECTION_POOL_MIN", [_dec8, _dec9], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return this.toOptionalNumber(process.env.DATABASE_CONNECTION_POOL_MIN);
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class.prototype, "DATABASE_CONNECTION_POOL_MAX", [_dec10, _dec11], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return this.toOptionalNumber(process.env.DATABASE_CONNECTION_POOL_MAX);
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class.prototype, "PGSSLMODE", [_dec12, _dec13], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return process.env.PGSSLMODE;
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class.prototype, "REDIS_URL", [_dec14], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return process.env.REDIS_URL;
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class.prototype, "URL", [_dec15, _dec16], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return process.env.URL || "";
  }
}), _descriptor11 = _applyDecoratedDescriptor(_class.prototype, "CDN_URL", [_dec17, _dec18], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return this.toOptionalString(process.env.CDN_URL);
  }
}), _descriptor12 = _applyDecoratedDescriptor(_class.prototype, "COLLABORATION_URL", [_dec19, _dec20], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return this.toOptionalString(process.env.COLLABORATION_URL);
  }
}), _descriptor13 = _applyDecoratedDescriptor(_class.prototype, "COLLABORATION_MAX_CLIENTS_PER_DOCUMENT", [_dec21, _dec22], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return parseInt(process.env.COLLABORATION_MAX_CLIENTS_PER_DOCUMENT || "100", 10);
  }
}), _descriptor14 = _applyDecoratedDescriptor(_class.prototype, "PORT", [_dec23, _dec24], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    var _this$toOptionalNumbe;
    return (_this$toOptionalNumbe = this.toOptionalNumber(process.env.PORT)) !== null && _this$toOptionalNumbe !== void 0 ? _this$toOptionalNumbe : 3000;
  }
}), _descriptor15 = _applyDecoratedDescriptor(_class.prototype, "LOG_LEVEL", [_dec25], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return process.env.LOG_LEVEL || "info";
  }
}), _descriptor16 = _applyDecoratedDescriptor(_class.prototype, "WEB_CONCURRENCY", [_dec26, _dec27], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return this.toOptionalNumber(process.env.WEB_CONCURRENCY);
  }
}), _descriptor17 = _applyDecoratedDescriptor(_class.prototype, "REQUEST_TIMEOUT", [_dec28, _dec29], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    var _this$toOptionalNumbe2;
    return (_this$toOptionalNumbe2 = this.toOptionalNumber(process.env.REQUEST_TIMEOUT)) !== null && _this$toOptionalNumbe2 !== void 0 ? _this$toOptionalNumbe2 : 10 * 1000;
  }
}), _descriptor18 = _applyDecoratedDescriptor(_class.prototype, "SSL_KEY", [_dec30, _dec31], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return this.toOptionalString(process.env.SSL_KEY);
  }
}), _descriptor19 = _applyDecoratedDescriptor(_class.prototype, "SSL_CERT", [_dec32, _dec33], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return this.toOptionalString(process.env.SSL_CERT);
  }
}), _descriptor20 = _applyDecoratedDescriptor(_class.prototype, "DEFAULT_LANGUAGE", [_dec34], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    var _process$env$DEFAULT_;
    return (_process$env$DEFAULT_ = process.env.DEFAULT_LANGUAGE) !== null && _process$env$DEFAULT_ !== void 0 ? _process$env$DEFAULT_ : "en_US";
  }
}), _descriptor21 = _applyDecoratedDescriptor(_class.prototype, "FORCE_HTTPS", [_dec35], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    var _process$env$FORCE_HT;
    return this.toBoolean((_process$env$FORCE_HT = process.env.FORCE_HTTPS) !== null && _process$env$FORCE_HT !== void 0 ? _process$env$FORCE_HT : "true");
  }
}), _descriptor22 = _applyDecoratedDescriptor(_class.prototype, "TELEMETRY", [_dec36], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    var _ref2, _process$env$ENABLE_U;
    return this.toBoolean((_ref2 = (_process$env$ENABLE_U = process.env.ENABLE_UPDATES) !== null && _process$env$ENABLE_U !== void 0 ? _process$env$ENABLE_U : process.env.TELEMETRY) !== null && _ref2 !== void 0 ? _ref2 : "true");
  }
}), _descriptor23 = _applyDecoratedDescriptor(_class.prototype, "SMTP_PORT", [_dec37, _dec38], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return this.toOptionalNumber(process.env.SMTP_PORT);
  }
}), _descriptor24 = _applyDecoratedDescriptor(_class.prototype, "SMTP_FROM_EMAIL", [_dec39, _dec40], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return this.toOptionalString(process.env.SMTP_FROM_EMAIL);
  }
}), _descriptor25 = _applyDecoratedDescriptor(_class.prototype, "SMTP_REPLY_EMAIL", [_dec41, _dec42], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return this.toOptionalString(process.env.SMTP_REPLY_EMAIL);
  }
}), _descriptor26 = _applyDecoratedDescriptor(_class.prototype, "SENTRY_DSN", [_dec43, _dec44], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return this.toOptionalString(process.env.SENTRY_DSN);
  }
}), _descriptor27 = _applyDecoratedDescriptor(_class.prototype, "SENTRY_TUNNEL", [_dec45, _dec46], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return this.toOptionalString(process.env.SENTRY_TUNNEL);
  }
}), _descriptor28 = _applyDecoratedDescriptor(_class.prototype, "GOOGLE_ANALYTICS_ID", [_dec47], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return this.toOptionalString(process.env.GOOGLE_ANALYTICS_ID);
  }
}), _descriptor29 = _applyDecoratedDescriptor(_class.prototype, "GOOGLE_CLIENT_ID", [_dec48, _dec49], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return this.toOptionalString(process.env.GOOGLE_CLIENT_ID);
  }
}), _descriptor30 = _applyDecoratedDescriptor(_class.prototype, "GOOGLE_CLIENT_SECRET", [_dec50, _dec51], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return this.toOptionalString(process.env.GOOGLE_CLIENT_SECRET);
  }
}), _descriptor31 = _applyDecoratedDescriptor(_class.prototype, "SLACK_SECRET", [_dec52, _dec53], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return this.toOptionalString(process.env.SLACK_SECRET);
  }
}), _descriptor32 = _applyDecoratedDescriptor(_class.prototype, "SLACK_KEY", [_dec54, _dec55], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return this.toOptionalString(process.env.SLACK_KEY);
  }
}), _descriptor33 = _applyDecoratedDescriptor(_class.prototype, "SLACK_CLIENT_ID", [_dec56, _dec57], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    var _process$env$SLACK_CL;
    return this.toOptionalString((_process$env$SLACK_CL = process.env.SLACK_CLIENT_ID) !== null && _process$env$SLACK_CL !== void 0 ? _process$env$SLACK_CL : process.env.SLACK_KEY);
  }
}), _descriptor34 = _applyDecoratedDescriptor(_class.prototype, "SLACK_CLIENT_SECRET", [_dec58, _dec59], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    var _process$env$SLACK_CL2;
    return this.toOptionalString((_process$env$SLACK_CL2 = process.env.SLACK_CLIENT_SECRET) !== null && _process$env$SLACK_CL2 !== void 0 ? _process$env$SLACK_CL2 : process.env.SLACK_SECRET);
  }
}), _descriptor35 = _applyDecoratedDescriptor(_class.prototype, "SLACK_VERIFICATION_TOKEN", [_dec60], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return this.toOptionalString(process.env.SLACK_VERIFICATION_TOKEN);
  }
}), _descriptor36 = _applyDecoratedDescriptor(_class.prototype, "SLACK_APP_ID", [_dec61, _dec62], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return this.toOptionalString(process.env.SLACK_APP_ID);
  }
}), _descriptor37 = _applyDecoratedDescriptor(_class.prototype, "SLACK_MESSAGE_ACTIONS", [_dec63, _dec64], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    var _process$env$SLACK_ME;
    return this.toBoolean((_process$env$SLACK_ME = process.env.SLACK_MESSAGE_ACTIONS) !== null && _process$env$SLACK_ME !== void 0 ? _process$env$SLACK_ME : "false");
  }
}), _descriptor38 = _applyDecoratedDescriptor(_class.prototype, "AZURE_CLIENT_ID", [_dec65, _dec66], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return this.toOptionalString(process.env.AZURE_CLIENT_ID);
  }
}), _descriptor39 = _applyDecoratedDescriptor(_class.prototype, "AZURE_CLIENT_SECRET", [_dec67, _dec68], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return this.toOptionalString(process.env.AZURE_CLIENT_SECRET);
  }
}), _descriptor40 = _applyDecoratedDescriptor(_class.prototype, "AZURE_RESOURCE_APP_ID", [_dec69, _dec70], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return this.toOptionalString(process.env.AZURE_RESOURCE_APP_ID);
  }
}), _descriptor41 = _applyDecoratedDescriptor(_class.prototype, "OIDC_CLIENT_ID", [_dec71, _dec72, _dec73, _dec74, _dec75, _dec76], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return this.toOptionalString(process.env.OIDC_CLIENT_ID);
  }
}), _descriptor42 = _applyDecoratedDescriptor(_class.prototype, "OIDC_CLIENT_SECRET", [_dec77, _dec78], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return this.toOptionalString(process.env.OIDC_CLIENT_SECRET);
  }
}), _descriptor43 = _applyDecoratedDescriptor(_class.prototype, "OIDC_DISPLAY_NAME", [_dec79], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    var _process$env$OIDC_DIS;
    return (_process$env$OIDC_DIS = process.env.OIDC_DISPLAY_NAME) !== null && _process$env$OIDC_DIS !== void 0 ? _process$env$OIDC_DIS : "OpenID Connect";
  }
}), _descriptor44 = _applyDecoratedDescriptor(_class.prototype, "OIDC_AUTH_URI", [_dec80, _dec81], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return this.toOptionalString(process.env.OIDC_AUTH_URI);
  }
}), _descriptor45 = _applyDecoratedDescriptor(_class.prototype, "OIDC_TOKEN_URI", [_dec82, _dec83], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return this.toOptionalString(process.env.OIDC_TOKEN_URI);
  }
}), _descriptor46 = _applyDecoratedDescriptor(_class.prototype, "OIDC_USERINFO_URI", [_dec84, _dec85], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return this.toOptionalString(process.env.OIDC_USERINFO_URI);
  }
}), _descriptor47 = _applyDecoratedDescriptor(_class.prototype, "RATE_LIMITER_ENABLED", [_dec86, _dec87], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    var _process$env$RATE_LIM;
    return this.toBoolean((_process$env$RATE_LIM = process.env.RATE_LIMITER_ENABLED) !== null && _process$env$RATE_LIM !== void 0 ? _process$env$RATE_LIM : "false");
  }
}), _descriptor48 = _applyDecoratedDescriptor(_class.prototype, "RATE_LIMITER_REQUESTS", [_dec88, _dec89, _dec90], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    var _this$toOptionalNumbe3;
    return (_this$toOptionalNumbe3 = this.toOptionalNumber(process.env.RATE_LIMITER_REQUESTS)) !== null && _this$toOptionalNumbe3 !== void 0 ? _this$toOptionalNumbe3 : 1000;
  }
}), _descriptor49 = _applyDecoratedDescriptor(_class.prototype, "RATE_LIMITER_COLLABORATION_REQUESTS", [_dec91, _dec92], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    var _this$toOptionalNumbe4;
    return (_this$toOptionalNumbe4 = this.toOptionalNumber(process.env.RATE_LIMITER_COLLABORATION_REQUESTS)) !== null && _this$toOptionalNumbe4 !== void 0 ? _this$toOptionalNumbe4 : 50;
  }
}), _descriptor50 = _applyDecoratedDescriptor(_class.prototype, "RATE_LIMITER_DURATION_WINDOW", [_dec93, _dec94, _dec95], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    var _this$toOptionalNumbe5;
    return (_this$toOptionalNumbe5 = this.toOptionalNumber(process.env.RATE_LIMITER_DURATION_WINDOW)) !== null && _this$toOptionalNumbe5 !== void 0 ? _this$toOptionalNumbe5 : 60;
  }
}), _descriptor51 = _applyDecoratedDescriptor(_class.prototype, "AWS_S3_UPLOAD_MAX_SIZE", [_dec96, _dec97, _dec98], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return this.toOptionalNumber(process.env.AWS_S3_UPLOAD_MAX_SIZE);
  }
}), _descriptor52 = _applyDecoratedDescriptor(_class.prototype, "AWS_ACCESS_KEY_ID", [_dec99], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return this.toOptionalString(process.env.AWS_ACCESS_KEY_ID);
  }
}), _descriptor53 = _applyDecoratedDescriptor(_class.prototype, "AWS_SECRET_ACCESS_KEY", [_dec100, _dec101], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return this.toOptionalString(process.env.AWS_SECRET_ACCESS_KEY);
  }
}), _descriptor54 = _applyDecoratedDescriptor(_class.prototype, "AWS_REGION", [_dec102], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return this.toOptionalString(process.env.AWS_REGION);
  }
}), _descriptor55 = _applyDecoratedDescriptor(_class.prototype, "AWS_S3_ACCELERATE_URL", [_dec103], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return this.toOptionalString(process.env.AWS_S3_ACCELERATE_URL);
  }
}), _descriptor56 = _applyDecoratedDescriptor(_class.prototype, "AWS_S3_UPLOAD_BUCKET_URL", [_dec104], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    var _process$env$AWS_S3_U;
    return (_process$env$AWS_S3_U = process.env.AWS_S3_UPLOAD_BUCKET_URL) !== null && _process$env$AWS_S3_U !== void 0 ? _process$env$AWS_S3_U : "";
  }
}), _descriptor57 = _applyDecoratedDescriptor(_class.prototype, "AWS_S3_UPLOAD_BUCKET_NAME", [_dec105], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return this.toOptionalString(process.env.AWS_S3_UPLOAD_BUCKET_NAME);
  }
}), _descriptor58 = _applyDecoratedDescriptor(_class.prototype, "AWS_S3_FORCE_PATH_STYLE", [_dec106], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    var _process$env$AWS_S3_F;
    return this.toBoolean((_process$env$AWS_S3_F = process.env.AWS_S3_FORCE_PATH_STYLE) !== null && _process$env$AWS_S3_F !== void 0 ? _process$env$AWS_S3_F : "true");
  }
}), _descriptor59 = _applyDecoratedDescriptor(_class.prototype, "AWS_S3_ACL", [_dec107], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    var _process$env$AWS_S3_A;
    return (_process$env$AWS_S3_A = process.env.AWS_S3_ACL) !== null && _process$env$AWS_S3_A !== void 0 ? _process$env$AWS_S3_A : "private";
  }
}), _descriptor60 = _applyDecoratedDescriptor(_class.prototype, "FILE_STORAGE", [_dec108], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    var _this$toOptionalStrin2;
    return (_this$toOptionalStrin2 = this.toOptionalString(process.env.FILE_STORAGE)) !== null && _this$toOptionalStrin2 !== void 0 ? _this$toOptionalStrin2 : "s3";
  }
}), _descriptor61 = _applyDecoratedDescriptor(_class.prototype, "FILE_STORAGE_UPLOAD_MAX_SIZE", [_dec109], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    var _ref3, _this$toOptionalNumbe6;
    return (_ref3 = (_this$toOptionalNumbe6 = this.toOptionalNumber(process.env.FILE_STORAGE_UPLOAD_MAX_SIZE)) !== null && _this$toOptionalNumbe6 !== void 0 ? _this$toOptionalNumbe6 : this.toOptionalNumber(process.env.AWS_S3_UPLOAD_MAX_SIZE)) !== null && _ref3 !== void 0 ? _ref3 : 100000000;
  }
}), _descriptor62 = _applyDecoratedDescriptor(_class.prototype, "MAXIMUM_IMPORT_SIZE", [_dec110], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    var _this$toOptionalNumbe7;
    return Math.max((_this$toOptionalNumbe7 = this.toOptionalNumber(process.env.MAXIMUM_IMPORT_SIZE)) !== null && _this$toOptionalNumbe7 !== void 0 ? _this$toOptionalNumbe7 : 100000000, this.FILE_STORAGE_UPLOAD_MAX_SIZE);
  }
}), _descriptor63 = _applyDecoratedDescriptor(_class.prototype, "MAXIMUM_EXPORT_SIZE", [_dec111], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    var _this$toOptionalNumbe8;
    return (_this$toOptionalNumbe8 = this.toOptionalNumber(process.env.MAXIMUM_EXPORT_SIZE)) !== null && _this$toOptionalNumbe8 !== void 0 ? _this$toOptionalNumbe8 : _os.default.totalmem();
  }
}), _descriptor64 = _applyDecoratedDescriptor(_class.prototype, "IFRAMELY_URL", [_dec112, _dec113], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    var _process$env$IFRAMELY;
    return (_process$env$IFRAMELY = process.env.IFRAMELY_URL) !== null && _process$env$IFRAMELY !== void 0 ? _process$env$IFRAMELY : "https://iframe.ly";
  }
}), _descriptor65 = _applyDecoratedDescriptor(_class.prototype, "IFRAMELY_API_KEY", [_dec114, _dec115], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return this.toOptionalString(process.env.IFRAMELY_API_KEY);
  }
}), _descriptor66 = _applyDecoratedDescriptor(_class.prototype, "DEVELOPMENT_UNSAFE_INLINE_CSP", [_dec116], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    var _process$env$DEVELOPM;
    return this.toBoolean((_process$env$DEVELOPM = process.env.DEVELOPMENT_UNSAFE_INLINE_CSP) !== null && _process$env$DEVELOPM !== void 0 ? _process$env$DEVELOPM : "false");
  }
})), _class));
const env = new Environment();
var _default = exports.default = env;