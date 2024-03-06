"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useComponentSize;
var _react = require("react");
const defaultRect = {
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  x: 0,
  y: 0,
  width: 0,
  height: 0
};
function useComponentSize(element) {
  const [size, setSize] = (0, _react.useState)(() => element === null || element === void 0 ? void 0 : element.getBoundingClientRect());
  (0, _react.useEffect)(() => {
    const sizeObserver = new ResizeObserver(() => {
      element === null || element === void 0 ? void 0 : element.dispatchEvent(new CustomEvent("resize"));
    });
    if (element) {
      sizeObserver.observe(element);
    }
    return () => sizeObserver.disconnect();
  }, [element]);
  (0, _react.useEffect)(() => {
    const handleResize = () => {
      setSize(state => {
        const rect = element === null || element === void 0 ? void 0 : element.getBoundingClientRect();
        if (rect && state && Math.round(state.width) === Math.round(rect.width) && Math.round(state.height) === Math.round(rect.height) && Math.round(state.x) === Math.round(rect.x) && Math.round(state.y) === Math.round(rect.y)) {
          return state;
        }
        return rect;
      });
    };
    window.addEventListener("click", handleResize);
    window.addEventListener("resize", handleResize);
    element === null || element === void 0 ? void 0 : element.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("click", handleResize);
      window.removeEventListener("resize", handleResize);
      element === null || element === void 0 ? void 0 : element.removeEventListener("resize", handleResize);
    };
  });
  return size !== null && size !== void 0 ? size : defaultRect;
}