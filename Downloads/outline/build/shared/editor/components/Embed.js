"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _embeds = require("../lib/embeds");
var _DisabledEmbed = _interopRequireDefault(require("./DisabledEmbed"));
var _Frame = _interopRequireDefault(require("./Frame"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const EmbedComponent = _ref => {
  let {
    isEditable,
    isSelected,
    theme,
    node,
    embeds,
    embedsDisabled
  } = _ref;
  const cache = React.useMemo(() => (0, _embeds.getMatchingEmbed)(embeds, node.attrs.href), [embeds, node.attrs.href]);
  if (!cache) {
    return null;
  }
  const {
    embed,
    matches
  } = cache;
  if (embedsDisabled) {
    return /*#__PURE__*/React.createElement(_DisabledEmbed.default, {
      href: node.attrs.href,
      embed: embed,
      isEditable: isEditable,
      isSelected: isSelected,
      theme: theme
    });
  }
  if (embed.transformMatch) {
    const src = embed.transformMatch(matches);
    return /*#__PURE__*/React.createElement(_Frame.default, {
      src: src,
      isSelected: isSelected,
      canonicalUrl: embed.hideToolbar ? undefined : node.attrs.href,
      title: embed.title,
      referrerPolicy: "origin",
      border: true
    });
  }
  if ("component" in embed) {
    return (
      /*#__PURE__*/
      // @ts-expect-error Component type
      React.createElement(embed.component, {
        attrs: node.attrs,
        matches: matches,
        isEditable: isEditable,
        isSelected: isSelected,
        embed: embed,
        theme: theme
      })
    );
  }
  return null;
};
var _default = exports.default = EmbedComponent;