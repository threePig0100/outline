"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useDragResize;
var React = _interopRequireWildcard(require("react"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function useDragResize(props) {
  const [size, setSize] = React.useState({
    width: props.width,
    height: props.height
  });
  const [offset, setOffset] = React.useState(0);
  const [sizeAtDragStart, setSizeAtDragStart] = React.useState(size);
  const [dragging, setDragging] = React.useState();
  const isResizable = !!props.onChangeSize;
  const constrainWidth = width => Math.round(Math.min(props.maxWidth, Math.max(width, props.minWidth)));
  const handlePointerMove = event => {
    event.preventDefault();
    let diff;
    if (dragging === "left") {
      diff = offset - event.pageX;
    } else {
      diff = event.pageX - offset;
    }
    const newWidth = sizeAtDragStart.width + diff * 2;
    const widthOnGrid = Math.round(newWidth / props.gridWidth) * props.gridWidth;
    const constrainedWidth = constrainWidth(widthOnGrid);
    const aspectRatio = props.naturalHeight / props.naturalWidth;
    setSize({
      width: constrainedWidth,
      height: props.naturalWidth ? Math.round(constrainedWidth * aspectRatio) : undefined
    });
  };
  const handlePointerUp = event => {
    var _props$onChangeSize;
    event.preventDefault();
    event.stopPropagation();
    setOffset(0);
    setDragging(undefined);
    (_props$onChangeSize = props.onChangeSize) === null || _props$onChangeSize === void 0 ? void 0 : _props$onChangeSize.call(props, size);
    document.removeEventListener("mousemove", handlePointerMove);
  };
  const handleKeyDown = event => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      setSize(sizeAtDragStart);
      setDragging(undefined);
    }
  };
  const handlePointerDown = dragging => event => {
    event.preventDefault();
    event.stopPropagation();
    setSizeAtDragStart({
      width: constrainWidth(size.width),
      height: size.height
    });
    setOffset(event.pageX);
    setDragging(dragging);
  };
  React.useEffect(() => {
    if (!isResizable) {
      return;
    }
    if (dragging) {
      document.body.style.cursor = "ew-resize";
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", handlePointerUp);
    }
    return () => {
      document.body.style.cursor = "initial";
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dragging, handlePointerMove, handlePointerUp, isResizable]);
  return {
    handlePointerDown,
    dragging: !!dragging,
    setSize,
    width: size.width,
    height: size.height
  };
}