"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mobx = require("mobx");
var _mobxReact = require("mobx-react");
var _outlineIcons = require("outline-icons");
var React = _interopRequireWildcard(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _styles = require("../../styles");
var _urls = require("../../utils/urls");
var _class, _class2, _descriptor, _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }
function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }
function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }
let Frame = (0, _mobxReact.observer)(_class = (_class2 = class Frame extends React.Component {
  constructor() {
    super(...arguments);
    _defineProperty(this, "mounted", void 0);
    _initializerDefineProperty(this, "isLoaded", _descriptor, this);
    _defineProperty(this, "loadIframe", () => {
      if (!this.mounted) {
        return;
      }
      this.isLoaded = true;
    });
  }
  componentDidMount() {
    this.mounted = true;
    setTimeout(this.loadIframe, 0);
  }
  componentWillUnmount() {
    this.mounted = false;
  }
  render() {
    const {
      border,
      width = "100%",
      height = "400px",
      forwardedRef,
      icon,
      title,
      canonicalUrl,
      isSelected,
      referrerPolicy,
      className = "",
      src
    } = this.props;
    const withBar = !!(icon || canonicalUrl);
    return /*#__PURE__*/React.createElement(Rounded, {
      width: width,
      height: height,
      $withBar: withBar,
      $border: border,
      className: isSelected ? "ProseMirror-selectednode ".concat(className) : className
    }, this.isLoaded && /*#__PURE__*/React.createElement(Iframe, {
      ref: forwardedRef,
      $withBar: withBar,
      sandbox: "allow-same-origin allow-scripts allow-popups allow-forms allow-downloads allow-storage-access-by-user-activation",
      width: width,
      height: height,
      frameBorder: "0",
      title: "embed",
      loading: "lazy",
      src: (0, _urls.sanitizeUrl)(src),
      referrerPolicy: referrerPolicy,
      allowFullScreen: true
    }), withBar && /*#__PURE__*/React.createElement(Bar, null, icon, " ", /*#__PURE__*/React.createElement(Title, null, title), canonicalUrl && /*#__PURE__*/React.createElement(Open, {
      href: canonicalUrl,
      target: "_blank",
      rel: "noopener noreferrer"
    }, /*#__PURE__*/React.createElement(_outlineIcons.OpenIcon, {
      size: 18
    }), " Open")));
  }
}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "isLoaded", [_mobx.observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return false;
  }
})), _class2)) || _class;
const Iframe = _styledComponents.default.iframe(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  border-radius: ", ";\n  display: block;\n"])), props => props.$withBar ? "3px 3px 0 0" : "3px");
const Rounded = _styledComponents.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  border: 1px solid\n    ", ";\n  border-radius: 6px;\n  overflow: hidden;\n  width: ", ";\n  height: ", ";\n"])), props => props.$border ? props.theme.embedBorder : "transparent", props => props.width, props => props.$withBar ? props.height + 28 : props.height);
const Open = _styledComponents.default.a(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  color: ", " !important;\n  font-size: 13px;\n  font-weight: 500;\n  align-items: center;\n  display: flex;\n  position: absolute;\n  right: 0;\n  padding: 0 8px;\n"])), (0, _styles.s)("textSecondary"));
const Title = _styledComponents.default.span(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  font-size: 13px;\n  font-weight: 500;\n  padding-left: 4px;\n"])));
const Bar = _styledComponents.default.div(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  display: flex;\n  align-items: center;\n  border-top: 1px solid ", ";\n  background: ", ";\n  color: ", ";\n  padding: 0 8px;\n  border-bottom-left-radius: 6px;\n  border-bottom-right-radius: 6px;\n  user-select: none;\n  position: relative;\n"])), props => props.theme.embedBorder, (0, _styles.s)("secondaryBackground"), (0, _styles.s)("textSecondary"));
var _default = exports.default = /*#__PURE__*/React.forwardRef((props, ref) => /*#__PURE__*/React.createElement(Frame, _extends({}, props, {
  forwardedRef: ref
})));