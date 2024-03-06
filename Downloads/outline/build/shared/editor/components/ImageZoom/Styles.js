"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _polished = require("polished");
var _styledComponents = require("styled-components");
var _styles = require("../../../styles");
var _templateObject;
function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }
var _default = exports.default = (0, _styledComponents.createGlobalStyle)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  [data-rmiz] {\n    position: relative;\n  }\n  [data-rmiz-content=\"found\"] img,\n  [data-rmiz-content=\"found\"] svg,\n  [data-rmiz-content=\"found\"] [role=\"img\"],\n  [data-rmiz-content=\"found\"] [data-zoom] {\n    cursor: zoom-in;\n  }\n  [data-rmiz-modal]::backdrop {\n    display: none;\n  }\n  [data-rmiz-modal][open] {\n    position: fixed;\n    width: 100vw;\n    width: 100svw;\n    height: 100vh;\n    height: 100svh;\n    max-width: none;\n    max-height: none;\n    margin: 0;\n    padding: 0;\n    border: 0;\n    background: transparent;\n    overflow: hidden;\n  }\n  [data-rmiz-modal-overlay] {\n    position: absolute;\n    inset: 0;\n    transition: background-color 0.3s;\n  }\n  [data-rmiz-modal-overlay=\"hidden\"] {\n    background-color: ", ";\n  }\n  [data-rmiz-modal-overlay=\"visible\"] {\n    background-color: ", ";\n  }\n  [data-rmiz-modal-content] {\n    position: relative;\n    width: 100%;\n    height: 100%;\n  }\n  [data-rmiz-modal-img] {\n    position: absolute;\n    cursor: zoom-out;\n    image-rendering: high-quality;\n    transform-origin: top left;\n    transition: transform 0.3s;\n  }\n  @media (prefers-reduced-motion: reduce) {\n    [data-rmiz-modal-overlay],\n    [data-rmiz-modal-img] {\n      transition-duration: 0.01ms !important;\n    }\n  }\n"])), props => (0, _polished.transparentize)(1, props.theme.background), (0, _styles.s)("background"));