"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _time = require("./../../../shared/utils/time");
var _env = _interopRequireDefault(require("./../../../server/env"));
var _errors = require("./../../../server/errors");
var _Logger = _interopRequireDefault(require("./../../../server/logging/Logger"));
var _redis = _interopRequireDefault(require("./../../../server/storage/redis"));
var _fetch = _interopRequireDefault(require("./../../../server/utils/fetch"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class Iframely {
  static cacheKey(url) {
    return "".concat(this.cacheKeyPrefix, "-").concat(url);
  }
  static async cache(url, response) {
    // do not cache error responses
    if (response.error) {
      return;
    }
    try {
      await _redis.default.defaultClient.set(this.cacheKey(url), JSON.stringify(response), "EX", response.cache_age || this.defaultCacheExpiry);
    } catch (err) {
      // just log it, can skip caching and directly return response
      _Logger.default.error("Could not cache Iframely response", err);
    }
  }
  static async fetch(url) {
    let type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "oembed";
    const res = await (0, _fetch.default)("".concat(this.apiUrl, "/").concat(type, "?url=").concat(encodeURIComponent(url), "&api_key=").concat(this.apiKey));
    return res.json();
  }
  static async cached(url) {
    try {
      const val = await _redis.default.defaultClient.get(this.cacheKey(url));
      if (val) {
        return JSON.parse(val);
      }
    } catch (err) {
      // just log it, response can still be obtained using the fetch call
      _Logger.default.error("Could not fetch cached Iframely response", err);
    }
  }

  /**
   * Fetches the preview data for the given url
   * using Iframely oEmbed API
   *
   * @param url
   * @returns Preview data for the url
   */
  static async get(url) {
    try {
      const cached = await this.cached(url);
      if (cached) {
        return cached;
      }
      const res = await this.fetch(url);
      await this.cache(url, res);
      return res;
    } catch (err) {
      throw (0, _errors.InternalError)(err);
    }
  }
}
_defineProperty(Iframely, "apiUrl", "".concat(_env.default.IFRAMELY_URL, "/api"));
_defineProperty(Iframely, "apiKey", _env.default.IFRAMELY_API_KEY);
_defineProperty(Iframely, "cacheKeyPrefix", "unfurl");
_defineProperty(Iframely, "defaultCacheExpiry", _time.Day);
var _default = exports.default = Iframely;