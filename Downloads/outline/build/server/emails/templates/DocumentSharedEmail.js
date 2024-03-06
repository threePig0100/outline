"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _types = require("./../../../shared/types");
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
 * Email sent to a user when someone adds them to a document.
 */
class DocumentSharedEmail extends _BaseEmail.default {
  async beforeSend(_ref) {
    let {
      documentId,
      userId
    } = _ref;
    const document = await _models.Document.unscoped().findByPk(documentId);
    if (!document) {
      return false;
    }
    const membership = await _models.UserMembership.findOne({
      where: {
        documentId,
        userId
      }
    });
    if (!membership) {
      return false;
    }
    return {
      document,
      membership
    };
  }
  subject(_ref2) {
    let {
      actorName,
      document
    } = _ref2;
    return "".concat(actorName, " shared \u201C").concat(document.title, "\u201D with you");
  }
  preview(_ref3) {
    let {
      actorName
    } = _ref3;
    return "".concat(actorName, " shared a document");
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
    return "\n".concat(actorName, " shared \u201C").concat(document.title, "\u201D with you.\n\nView Document: ").concat(teamUrl).concat(document.path, "\n");
  }
  render(props) {
    const {
      document,
      membership,
      actorName,
      teamUrl
    } = props;
    const documentUrl = "".concat(teamUrl).concat(document.path, "?ref=notification-email");
    const permission = membership.permission === _types.DocumentPermission.ReadWrite ? "edit" : "view";
    return /*#__PURE__*/React.createElement(_EmailLayout.default, {
      previewText: this.preview(props),
      goToAction: {
        url: documentUrl,
        name: "View Document"
      }
    }, /*#__PURE__*/React.createElement(_Header.default, null), /*#__PURE__*/React.createElement(_Body.default, null, /*#__PURE__*/React.createElement(_Heading.default, null, document.title), /*#__PURE__*/React.createElement("p", null, actorName, " invited you to ", permission, " the", " ", /*#__PURE__*/React.createElement("a", {
      href: documentUrl
    }, document.title), " document."), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement(_Button.default, {
      href: documentUrl
    }, "View Document"))));
  }
}
exports.default = DocumentSharedEmail;