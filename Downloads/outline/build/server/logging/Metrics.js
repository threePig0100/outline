"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _datadogMetrics = _interopRequireDefault(require("datadog-metrics"));
var _env = _interopRequireDefault(require("./../env"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class Metrics {
  constructor() {
    var _process$env$DD_ENV;
    _defineProperty(this, "enabled", !!_env.default.DD_API_KEY);
    if (!this.enabled) {
      return;
    }
    _datadogMetrics.default.init({
      apiKey: _env.default.DD_API_KEY,
      prefix: "outline.",
      defaultTags: ["env:".concat((_process$env$DD_ENV = process.env.DD_ENV) !== null && _process$env$DD_ENV !== void 0 ? _process$env$DD_ENV : _env.default.ENVIRONMENT)]
    });
  }
  gauge(key, value, tags) {
    if (!this.enabled) {
      return;
    }
    return _datadogMetrics.default.gauge(key, value, tags);
  }
  gaugePerInstance(key, value) {
    let tags = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    if (!this.enabled) {
      return;
    }
    const instanceId = process.env.INSTANCE_ID || process.env.HEROKU_DYNO_ID || process.pid;
    return _datadogMetrics.default.gauge(key, value, [...tags, "instance:".concat(instanceId)]);
  }
  increment(key, _tags) {
    if (!this.enabled) {
      return;
    }
    return _datadogMetrics.default.increment(key);
  }
  flush() {
    if (!this.enabled) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      _datadogMetrics.default.flush(resolve, reject);
    });
  }
}
var _default = exports.default = new Metrics();