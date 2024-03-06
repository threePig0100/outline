"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ShutdownOrder = void 0;
var _groupBy = _interopRequireDefault(require("lodash/groupBy"));
var _Logger = _interopRequireDefault(require("./../logging/Logger"));
var _timers = require("./timers");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
let ShutdownOrder = exports.ShutdownOrder = /*#__PURE__*/function (ShutdownOrder) {
  ShutdownOrder[ShutdownOrder["first"] = 0] = "first";
  ShutdownOrder[ShutdownOrder["normal"] = 1] = "normal";
  ShutdownOrder[ShutdownOrder["last"] = 2] = "last";
  return ShutdownOrder;
}({});
class ShutdownHelper {
  /**
   * Add a shutdown handler to be executed when the process is exiting
   *
   * @param name The name of the handler
   * @param callback The callback to execute
   */
  static add(name, order, callback) {
    this.handlers.push({
      name,
      order,
      callback
    });
  }

  /**
   * Exit the process after all shutdown handlers have completed
   */
  static async execute() {
    if (this.isShuttingDown) {
      return;
    }
    this.isShuttingDown = true;

    // Start the shutdown timer
    void (0, _timers.timeout)(this.forceQuitTimeout).then(() => {
      _Logger.default.info("lifecycle", "Force quitting");
      process.exit(1);
    });

    // Group handlers by order
    const shutdownGroups = (0, _groupBy.default)(this.handlers, "order");
    const orderedKeys = Object.keys(shutdownGroups).sort();

    // Execute handlers in order
    for (const key of orderedKeys) {
      _Logger.default.debug("lifecycle", "Running shutdown group ".concat(key));
      const handlers = shutdownGroups[key];
      await Promise.allSettled(handlers.map(async handler => {
        _Logger.default.debug("lifecycle", "Running shutdown handler ".concat(handler.name));
        await handler.callback().catch(error => {
          _Logger.default.error("Error inside shutdown handler ".concat(handler.name), error, {
            name: handler.name
          });
        });
      }));
    }
    _Logger.default.info("lifecycle", "Gracefully quitting");
    process.exit(0);
  }
}
exports.default = ShutdownHelper;
/**
 * The amount of time to wait for connections to close before forcefully
 * closing them. This allows for regular HTTP requests to complete but
 * prevents long running requests from blocking shutdown.
 */
_defineProperty(ShutdownHelper, "connectionGraceTimeout", 5 * 1000);
/**
 * The maximum amount of time to wait for ongoing work to finish before
 * force quitting the process. In the event of a force quit, the process
 * will exit with a non-zero exit code.
 */
_defineProperty(ShutdownHelper, "forceQuitTimeout", 60 * 1000);
/** Whether the server is currently shutting down */
_defineProperty(ShutdownHelper, "isShuttingDown", false);
/** List of shutdown handlers to execute */
_defineProperty(ShutdownHelper, "handlers", []);