"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _types = require("./../../../shared/types");
var _time = require("./../../../shared/utils/time");
var _models = require("./../../models");
var _DocumentHelper = _interopRequireDefault(require("./../../models/helpers/DocumentHelper"));
var _HTMLHelper = _interopRequireDefault(require("./../../models/helpers/HTMLHelper"));
var _NotificationSettingsHelper = _interopRequireDefault(require("./../../models/helpers/NotificationSettingsHelper"));
var _SubscriptionHelper = _interopRequireDefault(require("./../../models/helpers/SubscriptionHelper"));
var _BaseEmail = _interopRequireDefault(require("./BaseEmail"));
var _Body = _interopRequireDefault(require("./components/Body"));
var _Button = _interopRequireDefault(require("./components/Button"));
var _Diff = _interopRequireDefault(require("./components/Diff"));
var _EmailLayout = _interopRequireDefault(require("./components/EmailLayout"));
var _EmptySpace = _interopRequireDefault(require("./components/EmptySpace"));
var _Footer = _interopRequireWildcard(require("./components/Footer"));
var _Header = _interopRequireDefault(require("./components/Header"));
var _Heading = _interopRequireDefault(require("./components/Heading"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * Email sent to a user when they have enabled document notifications, the event
 * may be published or updated.
 */
class DocumentPublishedOrUpdatedEmail extends _BaseEmail.default {
  async beforeSend(props) {
    const {
      documentId,
      revisionId
    } = props;
    const document = await _models.Document.unscoped().findByPk(documentId, {
      includeState: true
    });
    if (!document) {
      return false;
    }
    const collection = await document.$get("collection");
    if (!collection) {
      return false;
    }
    let body;
    if (revisionId) {
      // generate the diff html for the email
      const revision = await _models.Revision.findByPk(revisionId);
      if (revision) {
        const before = await revision.before();
        const content = await _DocumentHelper.default.toEmailDiff(before, revision, {
          includeTitle: false,
          centered: false,
          signedUrls: 4 * _time.Day / 1000,
          baseUrl: props.teamUrl
        });

        // inline all css so that it works in as many email providers as possible.
        body = content ? _HTMLHelper.default.inlineCSS(content) : undefined;
      }
    }
    return {
      document,
      collection,
      body,
      unsubscribeUrl: this.unsubscribeUrl(props)
    };
  }
  unsubscribeUrl(_ref) {
    let {
      userId,
      eventType
    } = _ref;
    return _NotificationSettingsHelper.default.unsubscribeUrl(userId, eventType);
  }
  eventName(eventType) {
    switch (eventType) {
      case _types.NotificationEventType.PublishDocument:
        return "published";
      case _types.NotificationEventType.UpdateDocument:
        return "updated";
      default:
        return "";
    }
  }
  subject(_ref2) {
    let {
      document,
      eventType
    } = _ref2;
    return "\u201C".concat(document.title, "\u201D ").concat(this.eventName(eventType));
  }
  preview(_ref3) {
    let {
      actorName,
      eventType
    } = _ref3;
    return "".concat(actorName, " ").concat(this.eventName(eventType), " a document");
  }
  renderAsText(_ref4) {
    let {
      actorName,
      teamUrl,
      document,
      collection,
      eventType
    } = _ref4;
    const eventName = this.eventName(eventType);
    return "\n\"".concat(document.title, "\" ").concat(eventName, "\n\n").concat(actorName, " ").concat(eventName, " the document \"").concat(document.title, "\", in the ").concat(collection.name, " collection.\n\nOpen Document: ").concat(teamUrl).concat(document.url, "\n");
  }
  render(props) {
    const {
      document,
      actorName,
      collection,
      eventType,
      teamUrl,
      unsubscribeUrl,
      body
    } = props;
    const documentLink = "".concat(teamUrl).concat(document.url, "?ref=notification-email");
    const eventName = this.eventName(eventType);
    return /*#__PURE__*/React.createElement(_EmailLayout.default, {
      previewText: this.preview(props),
      goToAction: {
        url: documentLink,
        name: "View Document"
      }
    }, /*#__PURE__*/React.createElement(_Header.default, null), /*#__PURE__*/React.createElement(_Body.default, null, /*#__PURE__*/React.createElement(_Heading.default, null, "\u201C", document.title, "\u201D ", eventName), /*#__PURE__*/React.createElement("p", null, actorName, " ", eventName, " the document", " ", /*#__PURE__*/React.createElement("a", {
      href: documentLink
    }, document.title), ", in the", " ", collection.name, " collection."), body && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_EmptySpace.default, {
      height: 20
    }), /*#__PURE__*/React.createElement(_Diff.default, null, /*#__PURE__*/React.createElement("div", {
      dangerouslySetInnerHTML: {
        __html: body
      }
    })), /*#__PURE__*/React.createElement(_EmptySpace.default, {
      height: 20
    })), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement(_Button.default, {
      href: documentLink
    }, "Open Document"))), /*#__PURE__*/React.createElement(_Footer.default, {
      unsubscribeUrl: unsubscribeUrl
    }, /*#__PURE__*/React.createElement(_Footer.Link, {
      href: _SubscriptionHelper.default.unsubscribeUrl(props.userId, props.documentId)
    }, "Unsubscribe from this doc")));
  }
}
exports.default = DocumentPublishedOrUpdatedEmail;