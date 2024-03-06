"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _ioredis = _interopRequireDefault(require("ioredis"));
var _defaults = _interopRequireDefault(require("lodash/defaults"));
var _env = _interopRequireDefault(require("./../env"));
var _Logger = _interopRequireDefault(require("./../logging/Logger"));
var _class;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const defaultOptions = {
  maxRetriesPerRequest: 20,
  enableReadyCheck: false,
  showFriendlyErrorStack: _env.default.isDevelopment,
  retryStrategy(times) {
    _Logger.default.warn("Retrying redis connection: attempt ".concat(times));
    return Math.min(times * 100, 3000);
  },
  reconnectOnError(err) {
    return err.message.includes("READONLY");
  },
  // support Heroku Redis, see:
  // https://devcenter.heroku.com/articles/heroku-redis#ioredis-module
  tls: (_env.default.REDIS_URL || "").startsWith("rediss://") ? {
    rejectUnauthorized: false
  } : undefined
};
class RedisAdapter extends _ioredis.default {
  constructor(url) {
    let {
      connectionNameSuffix,
      ...options
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    /**
     * For debugging. The connection name is based on the services running in
     * this process. Note that this does not need to be unique.
     */
    const connectionNamePrefix = _env.default.isDevelopment ? process.pid : "outline";
    const connectionName = "".concat(connectionNamePrefix, ":").concat(_env.default.SERVICES.join("-")) + (connectionNameSuffix ? ":".concat(connectionNameSuffix) : "");
    if (!url || !url.startsWith("ioredis://")) {
      var _env$REDIS_URL;
      super((_env$REDIS_URL = _env.default.REDIS_URL) !== null && _env$REDIS_URL !== void 0 ? _env$REDIS_URL : "", (0, _defaults.default)(options, {
        connectionName
      }, defaultOptions));
    } else {
      let customOptions = {};
      try {
        const decodedString = Buffer.from(url.slice(10), "base64").toString();
        customOptions = JSON.parse(decodedString);
      } catch (error) {
        throw new Error("Failed to decode redis adapter options: ".concat(error));
      }
      try {
        super((0, _defaults.default)(options, {
          connectionName
        }, customOptions, defaultOptions));
      } catch (error) {
        throw new Error("Failed to initialize redis client: ".concat(error));
      }
    }

    // More than the default of 10 listeners is expected for the amount of queues
    // we're running. Increase the max here to prevent a warning in the console:
    // https://github.com/OptimalBits/bull/issues/1192
    this.setMaxListeners(100);
  }
  static get defaultClient() {
    return this.client || (this.client = new this(_env.default.REDIS_URL, {
      connectionNameSuffix: "client"
    }));
  }
  static get defaultSubscriber() {
    return this.subscriber || (this.subscriber = new this(_env.default.REDIS_URL, {
      maxRetriesPerRequest: null,
      connectionNameSuffix: "subscriber"
    }));
  }
}
exports.default = RedisAdapter;
_class = RedisAdapter;
_defineProperty(RedisAdapter, "client", void 0);
_defineProperty(RedisAdapter, "subscriber", void 0);