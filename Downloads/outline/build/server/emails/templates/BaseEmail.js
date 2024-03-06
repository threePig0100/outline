"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _mailer = _interopRequireDefault(require("./../mailer"));
var _Logger = _interopRequireDefault(require("./../../logging/Logger"));
var _Metrics = _interopRequireDefault(require("./../../logging/Metrics"));
var _Notification = _interopRequireDefault(require("./../../models/Notification"));
var _queues = require("./../../queues");
var _BaseTask = require("./../../queues/tasks/BaseTask");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class BaseEmail {
  /**
   * Schedule this email type to be sent asyncronously by a worker.
   *
   * @param options Options to pass to the Bull queue
   * @returns A promise that resolves once the email is placed on the task queue
   */
  schedule(options) {
    const templateName = this.constructor.name;
    _Metrics.default.increment("email.scheduled", {
      templateName
    });

    // Ideally we'd use EmailTask.schedule here but importing creates a circular
    // dependency so we're pushing onto the task queue in the expected format
    return _queues.taskQueue.add({
      name: "EmailTask",
      props: {
        templateName,
        ...this.metadata,
        props: this.props
      }
    }, {
      priority: _BaseTask.TaskPriority.Normal,
      attempts: 5,
      backoff: {
        type: "exponential",
        delay: 60 * 1000
      },
      ...options
    });
  }
  constructor(props, metadata) {
    _defineProperty(this, "props", void 0);
    _defineProperty(this, "metadata", void 0);
    this.props = props;
    this.metadata = metadata;
  }

  /**
   * Send this email now.
   *
   * @returns A promise that resolves once the email has been successfully sent.
   */
  async send() {
    var _this$beforeSend, _this$metadata, _this$metadata2;
    const templateName = this.constructor.name;
    const bsResponse = await ((_this$beforeSend = this.beforeSend) === null || _this$beforeSend === void 0 ? void 0 : _this$beforeSend.call(this, this.props));
    if (bsResponse === false) {
      _Logger.default.info("email", "Email ".concat(templateName, " not sent due to beforeSend hook"), this.props);
      return;
    }
    if (!this.props.to) {
      _Logger.default.info("email", "Email ".concat(templateName, " not sent due to missing email address"), this.props);
      return;
    }
    const data = {
      ...this.props,
      ...(bsResponse !== null && bsResponse !== void 0 ? bsResponse : {})
    };
    const notification = (_this$metadata = this.metadata) !== null && _this$metadata !== void 0 && _this$metadata.notificationId ? await _Notification.default.unscoped().findByPk((_this$metadata2 = this.metadata) === null || _this$metadata2 === void 0 ? void 0 : _this$metadata2.notificationId) : undefined;
    if (notification !== null && notification !== void 0 && notification.viewedAt) {
      _Logger.default.info("email", "Email ".concat(templateName, " not sent as already viewed"), this.props);
      return;
    }
    try {
      var _this$fromName, _this$headCSS, _this$unsubscribeUrl;
      await _mailer.default.sendMail({
        to: this.props.to,
        fromName: (_this$fromName = this.fromName) === null || _this$fromName === void 0 ? void 0 : _this$fromName.call(this, data),
        subject: this.subject(data),
        previewText: this.preview(data),
        component: /*#__PURE__*/React.createElement(React.Fragment, null, this.render(data), notification ? this.pixel(notification) : null),
        text: this.renderAsText(data),
        headCSS: (_this$headCSS = this.headCSS) === null || _this$headCSS === void 0 ? void 0 : _this$headCSS.call(this, data),
        unsubscribeUrl: (_this$unsubscribeUrl = this.unsubscribeUrl) === null || _this$unsubscribeUrl === void 0 ? void 0 : _this$unsubscribeUrl.call(this, data)
      });
      _Metrics.default.increment("email.sent", {
        templateName
      });
    } catch (err) {
      _Metrics.default.increment("email.sending_failed", {
        templateName
      });
      throw err;
    }
    if (notification) {
      try {
        notification.emailedAt = new Date();
        await notification.save();
      } catch (err) {
        _Logger.default.error("Failed to update notification", err, this.metadata);
      }
    }
  }
  pixel(notification) {
    return /*#__PURE__*/React.createElement("img", {
      src: notification.pixelUrl,
      width: "1",
      height: "1"
    });
  }

  /**
   * Returns the subject of the email.
   *
   * @param props Props in email constructor
   * @returns The email subject as a string
   */

  /**
   * Returns the preview text of the email, this is the text that will be shown
   * in email client list views.
   *
   * @param props Props in email constructor
   * @returns The preview text as a string
   */

  /**
   * Returns a plain-text version of the email, this is the text that will be
   * shown if the email client does not support or want HTML.
   *
   * @param props Props in email constructor
   * @returns The plain text email as a string
   */

  /**
   * Returns a React element that will be rendered on the server to produce the
   * HTML version of the email.
   *
   * @param props Props in email constructor
   * @returns A JSX element
   */

  /**
   * Returns the unsubscribe URL for the email.
   *
   * @param props Props in email constructor
   * @returns The unsubscribe URL as a string
   */

  /**
   * Allows injecting additional CSS into the head of the email.
   *
   * @param props Props in email constructor
   * @returns A string of CSS
   */

  /**
   * beforeSend hook allows async loading additional data that was not passed
   * through the serialized worker props. If false is returned then the email
   * send is aborted.
   *
   * @param props Props in email constructor
   * @returns A promise resolving to additional data
   */

  /**
   * fromName hook allows overriding the "from" name of the email.
   */
}
exports.default = BaseEmail;