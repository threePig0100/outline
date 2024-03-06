"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _models = require("./../../models");
var _BaseEmail = _interopRequireDefault(require("./BaseEmail"));
var _Body = _interopRequireDefault(require("./components/Body"));
var _Button = _interopRequireDefault(require("./components/Button"));
var _EmailLayout = _interopRequireDefault(require("./components/EmailLayout"));
var _Header = _interopRequireDefault(require("./components/Header"));
var _Heading = _interopRequireDefault(require("./components/Heading"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * Email sent to a user when someone mentions them in a document.
 */
class DocumentMentionedEmail extends _BaseEmail.default {
  async beforeSend(_ref) {
    let {
      documentId
    } = _ref;
    const document = await _models.Document.unscoped().findByPk(documentId);
    if (!document) {
      return false;
    }
    return {
      document
    };
  }
  subject(_ref2) {
    let {
      document
    } = _ref2;
    return "Mentioned you in \u201C".concat(document.title, "\u201D");
  }
  preview(_ref3) {
    let {
      actorName
    } = _ref3;
    return "".concat(actorName, " mentioned you");
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
      document
    } = _ref5;
    return "\nYou were mentioned\n\n".concat(actorName, " mentioned you in the document \u201C").concat(document.title, "\u201D.\n\nOpen Document: ").concat(teamUrl).concat(document.url, "\n");
  }
  render(props) {
    const {
      document,
      actorName,
      teamUrl
    } = props;
    const documentLink = "".concat(teamUrl).concat(document.url, "?ref=notification-email");
    return /*#__PURE__*/React.createElement(_EmailLayout.default, {
      previewText: this.preview(props),
      goToAction: {
        url: documentLink,
        name: "View Document"
      }
    }, /*#__PURE__*/React.createElement(_Header.default, null), /*#__PURE__*/React.createElement(_Body.default, null, /*#__PURE__*/React.createElement(_Heading.default, null, "You were mentioned"), /*#__PURE__*/React.createElement("p", null, actorName, " mentioned you in the document", " ", /*#__PURE__*/React.createElement("a", {
      href: documentLink
    }, document.title), "."), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement(_Button.default, {
      href: documentLink
    }, "Open Document"))));
  }
}
exports.default = DocumentMentionedEmail;