"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = present;
// Note: This entire object is stringified in the HTML exposed to the client
// do not add anything here that should be a secret or password
function present(env) {
  var _options$analytics, _options$analytics2;
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return {
    URL: env.URL.replace(/\/$/, ""),
    AWS_S3_UPLOAD_BUCKET_URL: env.AWS_S3_UPLOAD_BUCKET_URL || "",
    AWS_S3_ACCELERATE_URL: env.AWS_S3_ACCELERATE_URL || "",
    CDN_URL: (env.CDN_URL || "").replace(/\/$/, ""),
    COLLABORATION_URL: (env.COLLABORATION_URL || env.URL).replace(/\/$/, "").replace(/^http/, "ws"),
    ENVIRONMENT: env.ENVIRONMENT,
    SENTRY_DSN: env.SENTRY_DSN,
    SENTRY_TUNNEL: env.SENTRY_TUNNEL,
    SLACK_CLIENT_ID: env.SLACK_CLIENT_ID,
    SLACK_APP_ID: env.SLACK_APP_ID,
    MAXIMUM_IMPORT_SIZE: env.MAXIMUM_IMPORT_SIZE,
    PDF_EXPORT_ENABLED: false,
    DEFAULT_LANGUAGE: env.DEFAULT_LANGUAGE,
    EMAIL_ENABLED: !!env.SMTP_HOST || env.isDevelopment,
    GOOGLE_ANALYTICS_ID: env.GOOGLE_ANALYTICS_ID,
    RELEASE: undefined || undefined || undefined,
    APP_NAME: env.APP_NAME,
    ROOT_SHARE_ID: options.rootShareId || undefined,
    analytics: {
      service: (_options$analytics = options.analytics) === null || _options$analytics === void 0 ? void 0 : _options$analytics.service,
      settings: (_options$analytics2 = options.analytics) === null || _options$analytics2 === void 0 ? void 0 : _options$analytics2.settings
    }
  };
}