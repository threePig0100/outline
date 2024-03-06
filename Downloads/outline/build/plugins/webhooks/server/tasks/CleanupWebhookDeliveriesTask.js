"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _dateFns = require("date-fns");
var _sequelize = require("sequelize");
var _Logger = _interopRequireDefault(require("./../../../../server/logging/Logger"));
var _models = require("./../../../../server/models");
var _BaseTask = _interopRequireWildcard(require("./../../../../server/queues/tasks/BaseTask"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class CleanupWebhookDeliveriesTask extends _BaseTask.default {
  async perform(_) {
    _Logger.default.info("task", "Deleting WebhookDeliveries older than one week\u2026");
    const count = await _models.WebhookDelivery.unscoped().destroy({
      where: {
        createdAt: {
          [_sequelize.Op.lt]: (0, _dateFns.subDays)(new Date(), 7)
        }
      }
    });
    _Logger.default.info("task", "".concat(count, " old WebhookDeliveries deleted."));
  }
  get options() {
    return {
      attempts: 1,
      priority: _BaseTask.TaskPriority.Background
    };
  }
}
exports.default = CleanupWebhookDeliveriesTask;
_defineProperty(CleanupWebhookDeliveriesTask, "cron", _BaseTask.TaskSchedule.Daily);