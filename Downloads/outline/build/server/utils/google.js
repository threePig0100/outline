"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _oauth = _interopRequireDefault(require("./oauth"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class GoogleClient extends _oauth.default {
  constructor() {
    super(...arguments);
    _defineProperty(this, "endpoints", {
      authorize: "https://accounts.google.com/o/oauth2/auth",
      token: "https://accounts.google.com/o/oauth2/token",
      userinfo: "https://www.googleapis.com/oauth2/v3/userinfo"
    });
  }
}
exports.default = GoogleClient;