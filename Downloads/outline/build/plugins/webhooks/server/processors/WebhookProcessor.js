"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _models = require("./../../../../server/models");
var _BaseProcessor = _interopRequireDefault(require("./../../../../server/queues/processors/BaseProcessor"));
var _DeliverWebhookTask = _interopRequireDefault(require("../tasks/DeliverWebhookTask"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class WebhookProcessor extends _BaseProcessor.default {
  async perform(event) {
    if (!event.teamId) {
      return;
    }
    const webhookSubscriptions = await _models.WebhookSubscription.findAll({
      where: {
        enabled: true,
        teamId: event.teamId
      }
    });
    const applicableSubscriptions = webhookSubscriptions.filter(webhook => webhook.validForEvent(event));
    await Promise.all(applicableSubscriptions.map(subscription => _DeliverWebhookTask.default.schedule({
      event,
      subscriptionId: subscription.id
    })));
  }
}
exports.default = WebhookProcessor;
_defineProperty(WebhookProcessor, "applicableEvents", ["*"]);