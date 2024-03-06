"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * A tiny EventEmitter implementation for the browser.
 */
class EventEmitter {
  constructor() {
    _defineProperty(this, "listeners", {});
    _defineProperty(this, "on", this.addListener);
    _defineProperty(this, "off", this.removeListener);
  }
  addListener(name, callback) {
    if (!this.listeners[name]) {
      this.listeners[name] = [];
    }
    this.listeners[name].push(callback);
  }
  removeListener(name, callback) {
    var _this$listeners$name;
    this.listeners[name] = (_this$listeners$name = this.listeners[name]) === null || _this$listeners$name === void 0 ? void 0 : _this$listeners$name.filter(cb => cb !== callback);
  }
  emit(name, data) {
    var _this$listeners$name2;
    (_this$listeners$name2 = this.listeners[name]) === null || _this$listeners$name2 === void 0 ? void 0 : _this$listeners$name2.forEach(callback => {
      callback(data);
    });
  }
}
exports.default = EventEmitter;