"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _types = require("./../../../shared/types");
var _time = require("./../../../shared/utils/time");
var _models = require("./../../models");
var _HTMLHelper = _interopRequireDefault(require("./../../models/helpers/HTMLHelper"));
var _NotificationSettingsHelper = _interopRequireDefault(require("./../../models/helpers/NotificationSettingsHelper"));
var _ProsemirrorHelper = _interopRequireDefault(require("./../../models/helpers/ProsemirrorHelper"));
var _TextHelper = _interopRequireDefault(require("./../../models/helpers/TextHelper"));
var _BaseEmail = _interopRequireDefault(require("./BaseEmail"));
var _Body = _interopRequireDefault(require("./components/Body"));
var _Button = _interopRequireDefault(require("./components/Button"));
var _Diff = _interopRequireDefault(require("./components/Diff"));
var _EmailLayout = _interopRequireDefault(require("./components/EmailLayout"));
var _EmptySpace = _interopRequireDefault(require("./components/EmptySpace"));
var _Footer = _interopRequireDefault(require("./components/Footer"));
var _Header = _interopRequireDefault(require("./components/Header"));
var _Heading = _interopRequireDefault(require("./components/Heading"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * Email sent to a user when a new comment is created in a document they are
 * subscribed to.
 */
class CommentMentionedEmail extends _BaseEmail.default {
  async beforeSend(props) {
    const {
      documentId,
      commentId
    } = props;
    const document = await _models.Document.unscoped().findByPk(documentId);
    if (!document) {
      return false;
    }
    const collection = await document.$get("collection");
    if (!collection) {
      return false;
    }
    const comment = await _models.Comment.findByPk(commentId);
    if (!comment) {
      return false;
    }
    let body;
    let content = _ProsemirrorHelper.default.toHTML(_ProsemirrorHelper.default.toProsemirror(comment.data), {
      centered: false
    });
    content = await _TextHelper.default.attachmentsToSignedUrls(content, document.teamId, 4 * _time.Day / 1000);
    if (content) {
      // inline all css so that it works in as many email providers as possible.
      body = _HTMLHelper.default.inlineCSS(content);
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
      userId
    } = _ref;
    return _NotificationSettingsHelper.default.unsubscribeUrl(userId, _types.NotificationEventType.MentionedInComment);
  }
  subject(_ref2) {
    let {
      actorName,
      document
    } = _ref2;
    return "".concat(actorName, " mentioned you in \u201C").concat(document.title, "\u201D");
  }
  preview(_ref3) {
    let {
      actorName
    } = _ref3;
    return "".concat(actorName, " mentioned you in a thread");
  }
  fromName(_ref4) {
    let {
      actorName
    } = _ref4;
    return actorName;
  }
  renderAsText(_ref5) {
    let {
      actorName,
      teamUrl,
      document,
      commentId,
      collection
    } = _ref5;
    return "\n".concat(actorName, " mentioned you in a comment on \"").concat(document.title, "\"").concat(collection.name ? "in the ".concat(collection.name, " collection") : "", ".\n\nOpen Thread: ").concat(teamUrl).concat(document.url, "?commentId=").concat(commentId, "\n");
  }
  render(props) {
    const {
      document,
      collection,
      actorName,
      teamUrl,
      commentId,
      unsubscribeUrl,
      body
    } = props;
    const threadLink = "".concat(teamUrl).concat(document.url, "?commentId=").concat(commentId, "&ref=notification-email");
    return /*#__PURE__*/React.createElement(_EmailLayout.default, {
      previewText: this.preview(props),
      goToAction: {
        url: threadLink,
        name: "View Thread"
      }
    }, /*#__PURE__*/React.createElement(_Header.default, null), /*#__PURE__*/React.createElement(_Body.default, null, /*#__PURE__*/React.createElement(_Heading.default, null, document.title), /*#__PURE__*/React.createElement("p", null, actorName, " mentioned you in a comment on", " ", /*#__PURE__*/React.createElement("a", {
      href: threadLink
    }, document.title), " ", collection.name ? "in the ".concat(collection.name, " collection") : "", "."), body && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_EmptySpace.default, {
      height: 20
    }), /*#__PURE__*/React.createElement(_Diff.default, null, /*#__PURE__*/React.createElement("div", {
      dangerouslySetInnerHTML: {
        __html: body
      }
    })), /*#__PURE__*/React.createElement(_EmptySpace.default, {
      height: 20
    })), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement(_Button.default, {
      href: threadLink
    }, "Open Thread"))), /*#__PURE__*/React.createElement(_Footer.default, {
      unsubscribeUrl: unsubscribeUrl
    }));
  }
}
exports.default = CommentMentionedEmail;