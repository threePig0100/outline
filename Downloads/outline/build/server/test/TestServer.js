"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _http = _interopRequireDefault(require("http"));
var _nodeFetch = _interopRequireDefault(require("node-fetch"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } // eslint-disable-next-line no-restricted-imports
class TestServer {
  constructor(app) {
    _defineProperty(this, "server", void 0);
    _defineProperty(this, "listener", void 0);
    this.server = _http.default.createServer(app.callback());
  }
  get address() {
    const {
      port
    } = this.server.address();
    return "http://localhost:".concat(port);
  }
  listen() {
    if (!this.listener) {
      this.listener = new Promise((resolve, reject) => {
        this.server.listen(0, () => resolve()).on("error", err => reject(err));
      });
    }
    return this.listener;
  }
  fetch(path, opts) {
    return this.listen().then(() => {
      var _options$headers$Cont;
      const url = "".concat(this.address).concat(path);
      const options = Object.assign({
        headers: {}
      }, opts);
      const contentType = (_options$headers$Cont = options.headers["Content-Type"]) !== null && _options$headers$Cont !== void 0 ? _options$headers$Cont : options.headers["content-type"];
      // automatic JSON encoding
      if (!contentType && typeof options.body === "object") {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(options.body);
      }
      return (0, _nodeFetch.default)(url, options);
    });
  }
  close() {
    this.listener = null;
    return new Promise((resolve, reject) => {
      this.server.close(err => err ? reject(err) : resolve());
    });
  }
  delete(path, options) {
    return this.fetch(path, {
      ...options,
      method: "DELETE"
    });
  }
  get(path, options) {
    return this.fetch(path, {
      ...options,
      method: "GET"
    });
  }
  head(path, options) {
    return this.fetch(path, {
      ...options,
      method: "HEAD"
    });
  }
  options(path, options) {
    return this.fetch(path, {
      ...options,
      method: "OPTIONS"
    });
  }
  patch(path, options) {
    return this.fetch(path, {
      ...options,
      method: "PATCH"
    });
  }
  post(path, options) {
    return this.fetch(path, {
      ...options,
      method: "POST"
    });
  }
  put(path, options) {
    return this.fetch(path, {
      ...options,
      method: "PUT"
    });
  }
}
var _default = exports.default = TestServer;