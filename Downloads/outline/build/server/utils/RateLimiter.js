"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.RateLimiterStrategy = void 0;
var _rateLimiterFlexible = require("rate-limiter-flexible");
var _env = _interopRequireDefault(require("./../env"));
var _redis = _interopRequireDefault(require("./../storage/redis"));
var _class;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class RateLimiter {
  constructor() {
    throw Error("Cannot instantiate class!");
  }
  static getRateLimiter(path) {
    return this.rateLimiterMap.get(path) || this.defaultRateLimiter;
  }
  static setRateLimiter(path, config) {
    const rateLimiter = new _rateLimiterFlexible.RateLimiterRedis(config);
    this.rateLimiterMap.set(path, rateLimiter);
  }
  static hasRateLimiter(path) {
    return this.rateLimiterMap.has(path);
  }
}

/**
 * Re-useable configuration for rate limiter middleware.
 */
exports.default = RateLimiter;
_class = RateLimiter;
_defineProperty(RateLimiter, "RATE_LIMITER_REDIS_KEY_PREFIX", "rl");
_defineProperty(RateLimiter, "rateLimiterMap", new Map());
_defineProperty(RateLimiter, "insuranceRateLimiter", new _rateLimiterFlexible.RateLimiterMemory({
  points: _env.default.RATE_LIMITER_REQUESTS,
  duration: _env.default.RATE_LIMITER_DURATION_WINDOW
}));
_defineProperty(RateLimiter, "defaultRateLimiter", new _rateLimiterFlexible.RateLimiterRedis({
  storeClient: _redis.default.defaultClient,
  points: _env.default.RATE_LIMITER_REQUESTS,
  duration: _env.default.RATE_LIMITER_DURATION_WINDOW,
  keyPrefix: _class.RATE_LIMITER_REDIS_KEY_PREFIX,
  insuranceLimiter: _class.insuranceRateLimiter
}));
const RateLimiterStrategy = exports.RateLimiterStrategy = {
  /** Allows five requests per minute, per IP address */
  FivePerMinute: {
    duration: 60,
    requests: 5
  },
  /** Allows ten requests per minute, per IP address */
  TenPerMinute: {
    duration: 60,
    requests: 10
  },
  /** Allows twenty five requests per minute, per IP address */
  TwentyFivePerMinute: {
    duration: 60,
    requests: 25
  },
  /** Allows one hundred requests per minute, per IP address */
  OneHundredPerMinute: {
    duration: 60,
    requests: 100
  },
  /** Allows one thousand requests per hour, per IP address */
  OneThousandPerHour: {
    duration: 3600,
    requests: 1000
  },
  /** Allows one hunred requests per hour, per IP address */
  OneHundredPerHour: {
    duration: 3600,
    requests: 100
  },
  /** Allows ten requests per hour, per IP address */
  TenPerHour: {
    duration: 3600,
    requests: 10
  },
  /** Allows five requests per hour, per IP address */
  FivePerHour: {
    duration: 3600,
    requests: 5
  }
};