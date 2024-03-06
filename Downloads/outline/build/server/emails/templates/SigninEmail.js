"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _env = _interopRequireDefault(require("./../../env"));
var _Logger = _interopRequireDefault(require("./../../logging/Logger"));
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
 * Email sent to a user when they request a magic sign-in link.
 */
class SigninEmail extends _BaseEmail.default {
  subject() {
    return "Magic signin link";
  }
  preview() {
    return "Here\u2019s your link to signin to ".concat(_env.default.APP_NAME, ".");
  }
  renderAsText(_ref) {
    let {
      token,
      teamUrl,
      client
    } = _ref;
    return "\nUse the link below to signin to ".concat(_env.default.APP_NAME, ":\n\n").concat(this.signinLink(token, client), "\n\nIf your magic link expired you can request a new one from your team\u2019s\nsignin page at: ").concat(teamUrl, "\n");
  }
  render(_ref2) {
    let {
      token,
      client,
      teamUrl
    } = _ref2;
    if (_env.default.isDevelopment) {
      _Logger.default.debug("email", "Sign-In link: ".concat(this.signinLink(token, client)));
    }
    return /*#__PURE__*/React.createElement(_EmailLayout.default, {
      previewText: this.preview(),
      goToAction: {
        url: this.signinLink(token, client),
        name: "Sign In"
      }
    }, /*#__PURE__*/React.createElement(_Header.default, null), /*#__PURE__*/React.createElement(_Body.default, null, /*#__PURE__*/React.createElement(_Heading.default, null, "Magic Sign-in Link"), /*#__PURE__*/React.createElement("p", null, "Click the button below to sign in to ", _env.default.APP_NAME, "."), /*#__PURE__*/React.createElement(_EmptySpace.default, {
      height: 10
    }), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement(_Button.default, {
      href: this.signinLink(token, client)
    }, "Sign In")), /*#__PURE__*/React.createElement(_EmptySpace.default, {
      height: 10
    }), /*#__PURE__*/React.createElement("p", null, "If your magic link expired you can request a new one from your team\u2019s sign-in page at: ", /*#__PURE__*/React.createElement("a", {
      href: teamUrl
    }, teamUrl))), /*#__PURE__*/React.createElement(_Footer.default, null));
  }
  signinLink(token, client) {
    return "".concat(_env.default.URL, "/auth/email.callback?token=").concat(token, "&client=").concat(client);
  }
}
exports.default = SigninEmail;