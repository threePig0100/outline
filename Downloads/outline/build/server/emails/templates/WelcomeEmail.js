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
 * Email sent to a user when their account has just been created, or they signed
 * in for the first time from an invite.
 */
class WelcomeEmail extends _BaseEmail.default {
  subject() {
    return "Welcome to ".concat(_env.default.APP_NAME);
  }
  preview() {
    return "".concat(_env.default.APP_NAME, " is a place for your team to build and share knowledge.");
  }
  renderAsText(_ref) {
    let {
      teamUrl
    } = _ref;
    return "\nWelcome to ".concat(_env.default.APP_NAME, "!\n\n").concat(_env.default.APP_NAME, " is a place for your team to build and share knowledge.\n\nTo get started, head to the home screen and try creating a collection to help document your processes, create playbooks, or plan your teams work.\n\nYou can also import existing Markdown documents by dragging and dropping them to your collections.\n\n").concat(teamUrl, "/home\n");
  }
  render(_ref2) {
    let {
      teamUrl
    } = _ref2;
    const welcomeLink = "".concat(teamUrl, "/home?ref=welcome-email");
    return /*#__PURE__*/React.createElement(_EmailLayout.default, {
      previewText: this.preview()
    }, /*#__PURE__*/React.createElement(_Header.default, null), /*#__PURE__*/React.createElement(_Body.default, null, /*#__PURE__*/React.createElement(_Heading.default, null, "Welcome to ", _env.default.APP_NAME, "!"), /*#__PURE__*/React.createElement("p", null, _env.default.APP_NAME, " is a place for your team to build and share knowledge."), /*#__PURE__*/React.createElement("p", null, "To get started, head to the home screen and try creating a collection to help document your processes, create playbooks, or plan your teams work."), /*#__PURE__*/React.createElement("p", null, "You can also import existing Markdown documents by dragging and dropping them to your collections."), /*#__PURE__*/React.createElement(_EmptySpace.default, {
      height: 10
    }), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement(_Button.default, {
      href: welcomeLink
    }, "Open ", _env.default.APP_NAME))), /*#__PURE__*/React.createElement(_Footer.default, null));
  }
}
exports.default = WelcomeEmail;