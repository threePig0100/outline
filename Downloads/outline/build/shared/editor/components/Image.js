"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _outlineIcons = require("outline-icons");
var React = _interopRequireWildcard(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _styles = require("../../styles");
var _urls = require("../../utils/urls");
var _ImageZoom = _interopRequireDefault(require("./ImageZoom"));
var _ResizeHandle = require("./ResizeHandle");
var _useComponentSize = _interopRequireDefault(require("./hooks/useComponentSize"));
var _useDragResize = _interopRequireDefault(require("./hooks/useDragResize"));
var _templateObject, _templateObject2;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }
const Image = props => {
  var _node$attrs$width, _node$attrs$height, _sanitizeUrl;
  const {
    isSelected,
    node,
    isEditable,
    onChangeSize
  } = props;
  const {
    src,
    layoutClass
  } = node.attrs;
  const className = layoutClass ? "image image-".concat(layoutClass) : "image";
  const [loaded, setLoaded] = React.useState(false);
  const [naturalWidth, setNaturalWidth] = React.useState(node.attrs.width);
  const [naturalHeight, setNaturalHeight] = React.useState(node.attrs.height);
  const containerBounds = (0, _useComponentSize.default)(document.body.querySelector("#full-width-container"));
  const documentBounds = props.view.dom.getBoundingClientRect();
  const maxWidth = layoutClass ? documentBounds.width / 3 : documentBounds.width;
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
    maxWidth,
    naturalWidth,
    naturalHeight,
    gridWidth: documentBounds.width / 20,
    onChangeSize
  });
  const isFullWidth = layoutClass === "full-width";
  const isResizable = !!props.onChangeSize;
  React.useEffect(() => {
    if (node.attrs.width && node.attrs.width !== width) {
      setSize({
        width: node.attrs.width,
        height: node.attrs.height
      });
    }
  }, [node.attrs.width]);
  const widthStyle = isFullWidth ? {
    width: containerBounds.width
  } : {
    width: width || "auto"
  };
  const containerStyle = isFullWidth ? {
    "--offset": "".concat(-(documentBounds.left - containerBounds.left + getPadding(props.view.dom)), "px")
  } : undefined;
  return /*#__PURE__*/React.createElement("div", {
    contentEditable: false,
    className: className,
    style: containerStyle
  }, /*#__PURE__*/React.createElement(ImageWrapper, {
    isFullWidth: isFullWidth,
    className: isSelected || dragging ? "ProseMirror-selectednode" : "",
    onClick: dragging ? undefined : props.onClick,
    style: widthStyle
  }, !dragging && width > 60 && props.onDownload && /*#__PURE__*/React.createElement(Button, {
    onClick: props.onDownload
  }, /*#__PURE__*/React.createElement(_outlineIcons.DownloadIcon, null)), /*#__PURE__*/React.createElement(_ImageZoom.default, {
    zoomMargin: 24
  }, /*#__PURE__*/React.createElement("img", {
    style: {
      ...widthStyle,
      display: loaded ? "block" : "none"
    },
    src: (_sanitizeUrl = (0, _urls.sanitizeUrl)(src)) !== null && _sanitizeUrl !== void 0 ? _sanitizeUrl : "",
    onLoad: ev => {
      // For some SVG's Firefox does not provide the naturalWidth, in this
      // rare case we need to provide a default so that the image can be
      // seen and is not sized to 0px
      const nw = ev.target.naturalWidth || 300;
      const nh = ev.target.naturalHeight;
      setNaturalWidth(nw);
      setNaturalHeight(nh);
      setLoaded(true);
      if (!node.attrs.width) {
        setSize(state => ({
          ...state,
          width: nw
        }));
      }
    }
  }), !loaded && width && height && /*#__PURE__*/React.createElement("img", {
    style: {
      ...widthStyle,
      display: "block"
    },
    src: "data:image/svg+xml;charset=UTF-8,".concat(encodeURIComponent(getPlaceholder(width, height)))
  })), isEditable && !isFullWidth && isResizable && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_ResizeHandle.ResizeLeft, {
    onPointerDown: handlePointerDown("left"),
    $dragging: !!dragging
  }), /*#__PURE__*/React.createElement(_ResizeHandle.ResizeRight, {
    onPointerDown: handlePointerDown("right"),
    $dragging: !!dragging
  }))), isFullWidth && props.children ? /*#__PURE__*/React.cloneElement(props.children, {
    style: widthStyle
  }) : props.children);
};
function getPadding(element) {
  const computedStyle = window.getComputedStyle(element, null);
  return parseFloat(computedStyle.paddingLeft);
}
function getPlaceholder(width, height) {
  return "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"".concat(width, "\" height=\"").concat(height, "\" />");
}
const Button = _styledComponents.default.button(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  position: absolute;\n  top: 8px;\n  right: 8px;\n  border: 0;\n  margin: 0;\n  padding: 0;\n  border-radius: 4px;\n  background: ", ";\n  color: ", ";\n  width: 24px;\n  height: 24px;\n  display: inline-block;\n  cursor: var(--pointer);\n  opacity: 0;\n  transition: opacity 150ms ease-in-out;\n\n  &:active {\n    transform: scale(0.98);\n  }\n\n  &:hover {\n    color: ", ";\n    opacity: 1;\n  }\n"])), (0, _styles.s)("background"), (0, _styles.s)("textSecondary"), (0, _styles.s)("text"));
const ImageWrapper = _styledComponents.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  line-height: 0;\n  position: relative;\n  margin-left: auto;\n  margin-right: auto;\n  max-width: ", ";\n  transition-property: width, height;\n  transition-duration: ", ";\n  transition-timing-function: ease-in-out;\n  overflow: hidden;\n\n  img {\n    transition-property: width, height;\n    transition-duration: ", ";\n    transition-timing-function: ease-in-out;\n  }\n\n  &:hover {\n    ", " {\n      opacity: 0.9;\n    }\n\n    ", ", ", " {\n      opacity: 1;\n    }\n  }\n"])), props => props.isFullWidth ? "initial" : "100%", props => props.isFullWidth ? "0ms" : "150ms", props => props.isFullWidth ? "0ms" : "150ms", Button, _ResizeHandle.ResizeLeft, _ResizeHandle.ResizeRight);
var _default = exports.default = Image;