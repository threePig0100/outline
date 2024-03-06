"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _env = _interopRequireDefault(require("./../../env"));
var _BaseEmail = _interopRequireDefault(require("./BaseEmail"));
var _Body = _interopRequireDefault(require("./components/Body"));
var _Button = _interopRequireDefault(require("./components/Button"));
var _EmailLayout = _interopRequireDefault(require("./components/EmailLayout"));
var _EmptySpace = _interopRequireDefault(require("./components/EmptySpace"));
var _Footer = _interopRequireDefault(require("./components/Footer"));
var _Header = _interopRequireDefault(require("./components/Header"));
var _Heading = _interopRequireDefault(require("./components/Heading"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * Email sent to an external user when an admin sends them an invite and they
 * haven't signed in after a few days.
 */
class InviteReminderEmail extends _BaseEmail.default {
  subject(_ref) {
    let {
      actorName,
      teamName
    } = _ref;
    return "Reminder: ".concat(actorName, " invited you to join ").concat(teamName, "\u2019s workspace");
  }
  preview() {
    return "".concat(_env.default.APP_NAME, " is a place for your team to build and share knowledge.");
  }
  renderAsText(_ref2) {
    let {
      teamName,
      actorName,
      actorEmail,
      teamUrl
    } = _ref2;
    return "\nThis is just a quick reminder that ".concat(actorName, " ").concat(actorEmail ? "(".concat(actorEmail, ")") : "", " invited you to join them in the ").concat(teamName, " team on ").concat(_env.default.APP_NAME, ", a place for your team to build and share knowledge.\nWe only send a reminder once.\n\nIf you haven't signed up yet, you can do so here: ").concat(teamUrl, "\n");
  }
  render(_ref3) {
    let {
      teamName,
      actorName,
      actorEmail,
      teamUrl
    } = _ref3;
    const inviteLink = "".concat(teamUrl, "?ref=invite-reminder-email");
    return /*#__PURE__*/React.createElement(_EmailLayout.default, {
      previewText: this.preview()
    }, /*#__PURE__*/React.createElement(_Header.default, null), /*#__PURE__*/React.createElement(_Body.default, null, /*#__PURE__*/React.createElement(_Heading.default, null, "Join ", teamName, " on ", _env.default.APP_NAME), /*#__PURE__*/React.createElement("p", null, "This is just a quick reminder that ", actorName, " ", actorEmail ? "(".concat(actorEmail, ")") : "", "invited you to join them in the ", teamName, " team on ", _env.default.APP_NAME, ", a place for your team to build and share knowledge."), /*#__PURE__*/React.createElement("p", null, "If you haven't signed up yet, you can do so here:"), /*#__PURE__*/React.createElement(_EmptySpace.default, {
      height: 10
    }), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement(_Button.default, {
      href: inviteLink
    }, "Join now"))), /*#__PURE__*/React.createElement(_Footer.default, null));
  }
}
exports.default = InviteReminderEmail;