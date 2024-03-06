"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ViewsExtension = void 0;
var _time = require("./../../shared/utils/time");
var _Logger = _interopRequireDefault(require("./../logging/Logger"));
var _tracing = require("./../logging/tracing");
var _models = require("./../models");
var _dec, _class;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
let ViewsExtension = exports.ViewsExtension = (_dec = (0, _tracing.trace)(), _dec(_class = class ViewsExtension {
  constructor() {
    /**
     * Map of last view recorded by socket
     */
    _defineProperty(this, "lastViewBySocket", new Map());
  }
  /**
   * onChange hook. When a user changes a document, we update their "viewedAt"
   * timestamp if it's been more than a minute since their last change.
   *
   * @param data The change payload
   */
  async onChange(_ref) {
    let {
      documentName,
      context,
      socketId
    } = _ref;
    if (!context.user) {
      return;
    }
    const lastUpdate = this.lastViewBySocket.get(socketId);
    const [, documentId] = documentName.split(".");
    if (!lastUpdate || Date.now() - lastUpdate.getTime() > _time.Minute) {
      this.lastViewBySocket.set(socketId, new Date());
      _Logger.default.debug("multiplayer", "User ".concat(context.user.id, " viewed \"").concat(documentName, "\""));
      await Promise.all([_models.View.touch(documentId, context.user.id, true), context.user.update({
        lastActiveAt: new Date()
      })]);
    }
  }

  /**
   * onDisconnect hook. When a user disconnects, we remove their socket from
   * the lastViewBySocket map to cleanup memory.
   *
   * @param data The disconnect payload
   */
  async onDisconnect(_ref2) {
    let {
      socketId
    } = _ref2;
    const interval = this.lastViewBySocket.get(socketId);
    if (interval) {
      this.lastViewBySocket.delete(socketId);
    }
  }

  /**
   * onDestroy hook
   * @param data The destroy payload
   */
  async onDestroy() {
    this.lastViewBySocket = new Map();
  }
}) || _class);