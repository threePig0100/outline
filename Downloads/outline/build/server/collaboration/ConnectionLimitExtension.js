"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConnectionLimitExtension = void 0;
var _env = _interopRequireDefault(require("./../env"));
var _Logger = _interopRequireDefault(require("./../logging/Logger"));
var _tracing = require("./../logging/tracing");
var _CloseEvents = require("./CloseEvents");
var _dec, _class;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
let ConnectionLimitExtension = exports.ConnectionLimitExtension = (_dec = (0, _tracing.trace)(), _dec(_class = class ConnectionLimitExtension {
  constructor() {
    /**
     * Map of documentId -> connection count
     */
    _defineProperty(this, "connectionsByDocument", new Map());
  }
  /**
   * onDisconnect hook
   * @param data The disconnect payload
   */
  onDisconnect(_ref) {
    let {
      documentName,
      socketId
    } = _ref;
    const connections = this.connectionsByDocument.get(documentName);
    if (connections) {
      connections.delete(socketId);
      if (connections.size === 0) {
        this.connectionsByDocument.delete(documentName);
      } else {
        this.connectionsByDocument.set(documentName, connections);
      }
    }
    _Logger.default.debug("multiplayer", "".concat(connections === null || connections === void 0 ? void 0 : connections.size, " connections to \"").concat(documentName, "\""));
    return Promise.resolve();
  }

  /**
   * connected hook
   * @param data The connected payload
   */
  connected(_ref2) {
    let {
      documentName,
      socketId
    } = _ref2;
    const connections = this.connectionsByDocument.get(documentName) || new Set();
    if ((connections === null || connections === void 0 ? void 0 : connections.size) >= _env.default.COLLABORATION_MAX_CLIENTS_PER_DOCUMENT) {
      _Logger.default.info("multiplayer", "Rejected connection to \"".concat(documentName, "\" because it has reached the maximum number of connections"));

      // Rejecting the promise will cause the connection to be dropped.
      return Promise.reject(_CloseEvents.TooManyConnections);
    }
    connections.add(socketId);
    this.connectionsByDocument.set(documentName, connections);
    _Logger.default.debug("multiplayer", "".concat(connections.size, " connections to \"").concat(documentName, "\""));
    return Promise.resolve();
  }
}) || _class);