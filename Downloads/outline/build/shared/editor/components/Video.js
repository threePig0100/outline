"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Video;
exports.videoStyle = void 0;
var React = _interopRequireWildcard(require("react"));
var _styledComponents = _interopRequireWildcard(require("styled-components"));
var _urls = require("../../utils/urls");
var _ResizeHandle = require("./ResizeHandle");
var _useComponentSize = _interopRequireDefault(require("./hooks/useComponentSize"));
var _useDragResize = _interopRequireDefault(require("./hooks/useDragResize"));
var _templateObject, _templateObject2, _templateObject3;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }
function Video(props) {
  var _node$attrs$width, _node$attrs$height;
  const {
    isSelected,
    node,
    isEditable,
    children,
    onChangeSize
  } = props;
  const [naturalWidth] = React.useState(node.attrs.width);
  const [naturalHeight] = React.useState(node.attrs.height);
  const documentBounds = (0, _useComponentSize.default)(props.view.dom);
  const isResizable = !!onChangeSize;
  const {
    width,
    height,
    setSize,
    handlePointerDown,
    dragging
  } = (0, _useDragResize.default)({
    width: (_node$attrs$width = node.attrs.width) !== null && _node$attrs$width !== void 0 ? _node$attrs$width : naturalWidth,
    height: (_node$attrs$height = node.attrs.height) !== null && _node$attrs$height !== void 0 ? _node$attrs$height : naturalHeight,
    minWidth: documentBounds.width * 0.1,
    maxWidth: documentBounds.width,
    naturalWidth,
    naturalHeight,
    gridWidth: documentBounds.width / 20,
    onChangeSize
  });
  React.useEffect(() => {
    if (node.attrs.width && node.attrs.width !== width) {
      setSize({
        width: node.attrs.width,
        height: node.attrs.height
      });
    }
  }, [node.attrs.width]);
  const style = {
    width: width || "auto",
    maxHeight: height || "auto",
    pointerEvents: dragging ? "none" : "all"
  };
  return /*#__PURE__*/React.createElement("div", {
    contentEditable: false
  }, /*#__PURE__*/React.createElement(VideoWrapper, {
    className: isSelected ? "ProseMirror-selectednode" : "",
    style: style
  }, /*#__PURE__*/React.createElement(StyledVideo, {
    src: (0, _urls.sanitizeUrl)(node.attrs.src),
    title: node.attrs.title,
    style: style,
    controls: !dragging
  }), isEditable && isResizable && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_ResizeHandle.ResizeLeft, {
    onPointerDown: handlePointerDown("left"),
    $dragging: !!dragging
  }), /*#__PURE__*/React.createElement(_ResizeHandle.ResizeRight, {
    onPointerDown: handlePointerDown("right"),
    $dragging: !!dragging
  }))), children);
}
const videoStyle = exports.videoStyle = (0, _styledComponents.css)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  max-width: 100%;\n  height: auto;\n  background: ", ";\n  color: ", " !important;\n  margin: -2px;\n  padding: 2px;\n  border-radius: 8px;\n  box-shadow: 0 0 0 1px ", ";\n"])), props => props.theme.background, props => props.theme.text, props => props.theme.divider);
const StyledVideo = _styledComponents.default.video(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  ", "\n"])), videoStyle);
const VideoWrapper = _styledComponents.default.div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  line-height: 0;\n  position: relative;\n  margin-left: auto;\n  margin-right: auto;\n  white-space: nowrap;\n  cursor: default;\n  border-radius: 8px;\n  user-select: none;\n  max-width: 100%;\n  overflow: hidden;\n\n  transition-property: width, max-height;\n  transition-duration: 150ms;\n  transition-timing-function: ease-in-out;\n\n  video {\n    transition-property: width, max-height;\n    transition-duration: 150ms;\n    transition-timing-function: ease-in-out;\n  }\n\n  &:hover {\n    ", ", ", " {\n      opacity: 1;\n    }\n  }\n"])), _ResizeHandle.ResizeLeft, _ResizeHandle.ResizeRight);