"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Controlled = Controlled;
var _react = _interopRequireWildcard(require("react"));
var _reactDom = require("react-dom");
var _reakit = require("reakit");
var _utils = require("./utils");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
let elDialogContainer;
if (typeof document !== "undefined") {
  elDialogContainer = document.createElement("div");
  elDialogContainer.setAttribute("data-rmiz-portal", "");
  document.body.appendChild(elDialogContainer);
}
var ModalState = /*#__PURE__*/function (ModalState) {
  ModalState["LOADED"] = "LOADED";
  ModalState["LOADING"] = "LOADING";
  ModalState["UNLOADED"] = "UNLOADED";
  ModalState["UNLOADING"] = "UNLOADING";
  return ModalState;
}(ModalState || {});
const defaultBodyAttrs = {
  overflow: "",
  width: ""
};
function Controlled(props) {
  return /*#__PURE__*/_react.default.createElement(ControlledBase, props);
}
class ControlledBase extends _react.Component {
  constructor() {
    super(...arguments);
    _defineProperty(this, "state", {
      id: "",
      isZoomImgLoaded: false,
      loadedImgEl: undefined,
      modalState: ModalState.UNLOADED,
      shouldRefresh: false
    });
    _defineProperty(this, "refContent", /*#__PURE__*/(0, _react.createRef)());
    _defineProperty(this, "refDialog", /*#__PURE__*/(0, _react.createRef)());
    _defineProperty(this, "refModalContent", /*#__PURE__*/(0, _react.createRef)());
    _defineProperty(this, "refModalImg", /*#__PURE__*/(0, _react.createRef)());
    _defineProperty(this, "refWrap", /*#__PURE__*/(0, _react.createRef)());
    _defineProperty(this, "changeObserver", void 0);
    _defineProperty(this, "imgEl", null);
    _defineProperty(this, "imgElObserver", void 0);
    _defineProperty(this, "prevBodyAttrs", defaultBodyAttrs);
    _defineProperty(this, "styleModalImg", {});
    _defineProperty(this, "touchYStart", void 0);
    _defineProperty(this, "touchYEnd", void 0);
    // Because of SSR, set a unique ID after render
    _defineProperty(this, "setId", () => {
      const gen4 = () => Math.random().toString(16).slice(-4);
      this.setState({
        id: gen4() + gen4() + gen4()
      });
    });
    // Find and set the image we're working with
    _defineProperty(this, "setAndTrackImg", () => {
      const contentEl = this.refContent.current;
      if (!contentEl) {
        return;
      }
      this.imgEl = contentEl.querySelector('img:not([aria-hidden="true"])');
      if (this.imgEl) {
        var _this$changeObserver, _this$changeObserver$, _this$imgEl, _this$imgEl$addEventL, _this$imgEl2, _this$imgEl2$addEvent;
        (_this$changeObserver = this.changeObserver) === null || _this$changeObserver === void 0 ? void 0 : (_this$changeObserver$ = _this$changeObserver.disconnect) === null || _this$changeObserver$ === void 0 ? void 0 : _this$changeObserver$.call(_this$changeObserver);
        (_this$imgEl = this.imgEl) === null || _this$imgEl === void 0 ? void 0 : (_this$imgEl$addEventL = _this$imgEl.addEventListener) === null || _this$imgEl$addEventL === void 0 ? void 0 : _this$imgEl$addEventL.call(_this$imgEl, "load", this.handleImgLoad);
        (_this$imgEl2 = this.imgEl) === null || _this$imgEl2 === void 0 ? void 0 : (_this$imgEl2$addEvent = _this$imgEl2.addEventListener) === null || _this$imgEl2$addEvent === void 0 ? void 0 : _this$imgEl2$addEvent.call(_this$imgEl2, "click", this.handleZoom);
        if (!this.state.loadedImgEl) {
          this.handleImgLoad();
        }
        this.imgElObserver = new ResizeObserver(entries => {
          const entry = entries[0];
          if (entry !== null && entry !== void 0 && entry.target) {
            this.imgEl = entry.target;
            this.setState({}); // Force a re-render
          }
        });
        this.imgElObserver.observe(this.imgEl);
      } else if (!this.changeObserver) {
        this.changeObserver = new MutationObserver(this.setAndTrackImg);
        this.changeObserver.observe(contentEl, {
          childList: true,
          subtree: true
        });
      }
    });
    // Show modal when zoomed; hide modal when unzoomed
    _defineProperty(this, "handleIfZoomChanged", prevIsZoomed => {
      const {
        isZoomed
      } = this.props;
      if (!prevIsZoomed && isZoomed) {
        this.zoom();
      } else if (prevIsZoomed && !isZoomed) {
        this.unzoom();
      }
    });
    // Ensure we always have the latest img src value loaded
    _defineProperty(this, "handleImgLoad", () => {
      const {
        imgEl
      } = this;
      const imgSrc = (0, _utils.getImgSrc)(imgEl);
      if (!imgSrc) {
        return;
      }
      const img = new Image();
      if ((0, _utils.testImg)(imgEl)) {
        img.sizes = imgEl.sizes;
        img.srcset = imgEl.srcset;
      }

      // img.src must be set after sizes and srcset
      // because of Firefox flickering on zoom
      img.src = imgSrc;
      const setLoaded = () => {
        this.setState({
          loadedImgEl: img
        });
      };
      img.decode().then(setLoaded).catch(() => {
        img.onload = setLoaded;
      });
    });
    // Report zoom state changes
    _defineProperty(this, "handleZoom", () => {
      var _this$props$onZoomCha, _this$props;
      (_this$props$onZoomCha = (_this$props = this.props).onZoomChange) === null || _this$props$onZoomCha === void 0 ? void 0 : _this$props$onZoomCha.call(_this$props, true);
    });
    _defineProperty(this, "handleUnzoom", () => {
      var _this$props$onZoomCha2, _this$props2;
      (_this$props$onZoomCha2 = (_this$props2 = this.props).onZoomChange) === null || _this$props$onZoomCha2 === void 0 ? void 0 : _this$props$onZoomCha2.call(_this$props2, false);
    });
    // Prevent the browser from removing the dialog on Escape
    _defineProperty(this, "handleDialogCancel", e => {
      e.preventDefault();
    });
    // Have dialog.click() only close in certain situations
    _defineProperty(this, "handleDialogClick", e => {
      if (e.target === this.refModalContent.current || e.target === this.refModalImg.current) {
        this.handleUnzoom();
      }
    });
    // Intercept default dialog.close() and use ours so we can animate
    _defineProperty(this, "handleDialogKeyDown", e => {
      if (e.key === "Escape" || e.keyCode === 27) {
        e.preventDefault();
        e.stopPropagation();
        this.handleUnzoom();
      }
    });
    // Handle wheel and swipe events
    _defineProperty(this, "handleWheel", e => {
      e.stopPropagation();
      queueMicrotask(() => {
        this.handleUnzoom();
      });
    });
    _defineProperty(this, "handleTouchStart", e => {
      if (e.changedTouches.length === 1 && e.changedTouches[0]) {
        this.touchYStart = e.changedTouches[0].screenY;
      }
    });
    _defineProperty(this, "handleTouchMove", e => {
      if (this.touchYStart !== null && e.changedTouches[0]) {
        this.touchYEnd = e.changedTouches[0].screenY;
        const max = Math.max(this.touchYStart || 0, this.touchYEnd);
        const min = Math.min(this.touchYStart || 0, this.touchYEnd);
        const delta = Math.abs(max - min);
        const threshold = 10;
        if (delta > threshold) {
          this.touchYStart = undefined;
          this.touchYEnd = undefined;
          this.handleUnzoom();
        }
      }
    });
    _defineProperty(this, "handleTouchCancel", () => {
      this.touchYStart = undefined;
      this.touchYEnd = undefined;
    });
    // Force re-render on resize
    _defineProperty(this, "handleResize", () => {
      this.setState({
        shouldRefresh: true
      });
    });
    // Perform zoom actions
    _defineProperty(this, "zoom", () => {
      var _this$refDialog$curre, _this$refDialog$curre2, _this$refModalImg$cur, _this$refModalImg$cur2;
      (_this$refDialog$curre = this.refDialog.current) === null || _this$refDialog$curre === void 0 ? void 0 : (_this$refDialog$curre2 = _this$refDialog$curre.showModal) === null || _this$refDialog$curre2 === void 0 ? void 0 : _this$refDialog$curre2.call(_this$refDialog$curre);
      this.setState({
        modalState: ModalState.LOADING
      });
      this.loadZoomImg();
      window.addEventListener("wheel", this.handleWheel, {
        passive: true
      });
      window.addEventListener("touchstart", this.handleTouchStart, {
        passive: true
      });
      window.addEventListener("touchend", this.handleTouchMove, {
        passive: true
      });
      window.addEventListener("touchcancel", this.handleTouchCancel, {
        passive: true
      });
      (_this$refModalImg$cur = this.refModalImg.current) === null || _this$refModalImg$cur === void 0 ? void 0 : (_this$refModalImg$cur2 = _this$refModalImg$cur.addEventListener) === null || _this$refModalImg$cur2 === void 0 ? void 0 : _this$refModalImg$cur2.call(_this$refModalImg$cur, "transitionend", this.handleZoomEnd, {
        once: true
      });
    });
    _defineProperty(this, "handleZoomEnd", () => {
      setTimeout(() => {
        this.setState({
          modalState: ModalState.LOADED
        });
        window.addEventListener("resize", this.handleResize, {
          passive: true
        });
      }, 0);
    });
    // Perform unzoom actions
    _defineProperty(this, "unzoom", () => {
      var _this$refModalImg$cur3, _this$refModalImg$cur4;
      this.setState({
        modalState: ModalState.UNLOADING
      });
      window.removeEventListener("wheel", this.handleWheel);
      window.removeEventListener("touchstart", this.handleTouchStart);
      window.removeEventListener("touchend", this.handleTouchMove);
      window.removeEventListener("touchcancel", this.handleTouchCancel);
      (_this$refModalImg$cur3 = this.refModalImg.current) === null || _this$refModalImg$cur3 === void 0 ? void 0 : (_this$refModalImg$cur4 = _this$refModalImg$cur3.addEventListener) === null || _this$refModalImg$cur4 === void 0 ? void 0 : _this$refModalImg$cur4.call(_this$refModalImg$cur3, "transitionend", this.handleUnzoomEnd, {
        once: true
      });
    });
    _defineProperty(this, "handleUnzoomEnd", () => {
      setTimeout(() => {
        var _this$refDialog$curre3, _this$refDialog$curre4;
        window.removeEventListener("resize", this.handleResize);
        this.setState({
          shouldRefresh: false,
          modalState: ModalState.UNLOADED
        });
        (_this$refDialog$curre3 = this.refDialog.current) === null || _this$refDialog$curre3 === void 0 ? void 0 : (_this$refDialog$curre4 = _this$refDialog$curre3.close) === null || _this$refDialog$curre4 === void 0 ? void 0 : _this$refDialog$curre4.call(_this$refDialog$curre3);
      }, 0);
    });
    // Load the zoomImg manually
    _defineProperty(this, "loadZoomImg", () => {
      const {
        props: {
          zoomImg
        }
      } = this;
      const zoomImgSrc = zoomImg === null || zoomImg === void 0 ? void 0 : zoomImg.src;
      if (zoomImgSrc) {
        var _zoomImg$sizes, _zoomImg$srcSet;
        const img = new Image();
        img.sizes = (_zoomImg$sizes = zoomImg === null || zoomImg === void 0 ? void 0 : zoomImg.sizes) !== null && _zoomImg$sizes !== void 0 ? _zoomImg$sizes : "";
        img.srcset = (_zoomImg$srcSet = zoomImg === null || zoomImg === void 0 ? void 0 : zoomImg.srcSet) !== null && _zoomImg$srcSet !== void 0 ? _zoomImg$srcSet : "";
        img.src = zoomImgSrc;
        const setLoaded = () => {
          this.setState({
            isZoomImgLoaded: true
          });
        };
        img.decode().then(setLoaded).catch(() => {
          img.onload = setLoaded;
        });
      }
    });
    // Hackily deal with SVGs because of all of their unknowns.
    _defineProperty(this, "UNSAFE_handleSvg", () => {
      const {
        imgEl,
        refModalImg,
        styleModalImg
      } = this;
      if ((0, _utils.testSvg)(imgEl)) {
        var _refModalImg$current, _refModalImg$current$, _refModalImg$current$2, _refModalImg$current2, _refModalImg$current3;
        const tmp = document.createElement("div");
        tmp.innerHTML = imgEl.outerHTML;
        const svg = tmp.firstChild;
        svg.style.width = "".concat(styleModalImg.width || 0, "px");
        svg.style.height = "".concat(styleModalImg.height || 0, "px");
        svg.addEventListener("click", this.handleUnzoom);
        (_refModalImg$current = refModalImg.current) === null || _refModalImg$current === void 0 ? void 0 : (_refModalImg$current$ = _refModalImg$current.firstChild) === null || _refModalImg$current$ === void 0 ? void 0 : (_refModalImg$current$2 = _refModalImg$current$.remove) === null || _refModalImg$current$2 === void 0 ? void 0 : _refModalImg$current$2.call(_refModalImg$current$);
        (_refModalImg$current2 = refModalImg.current) === null || _refModalImg$current2 === void 0 ? void 0 : (_refModalImg$current3 = _refModalImg$current2.appendChild) === null || _refModalImg$current3 === void 0 ? void 0 : _refModalImg$current3.call(_refModalImg$current2, svg);
      }
    });
  }
  render() {
    const {
      handleDialogCancel,
      handleDialogClick,
      handleDialogKeyDown,
      handleUnzoom,
      imgEl,
      props: {
        children,
        classDialog,
        isZoomed,
        wrapElement: WrapElement,
        ZoomContent,
        zoomImg,
        zoomMargin
      },
      refContent,
      refDialog,
      refModalContent,
      refModalImg,
      refWrap,
      state: {
        id,
        isZoomImgLoaded,
        loadedImgEl,
        modalState,
        shouldRefresh
      }
    } = this;
    const idModal = "rmiz-modal-".concat(id);
    const idModalImg = "rmiz-modal-img-".concat(id);

    // =========================================================================

    const isDiv = (0, _utils.testDiv)(imgEl);
    const isImg = (0, _utils.testImg)(imgEl);
    const isSvg = (0, _utils.testSvg)(imgEl);
    const imgAlt = (0, _utils.getImgAlt)(imgEl);
    const imgSrc = (0, _utils.getImgSrc)(imgEl);
    const imgSizes = isImg ? imgEl.sizes : undefined;
    const imgSrcSet = isImg ? imgEl.srcset : undefined;
    const hasZoomImg = !!(zoomImg !== null && zoomImg !== void 0 && zoomImg.src);
    const hasImage = imgEl && (loadedImgEl || isSvg) && window.getComputedStyle(imgEl).display !== "none";
    const isModalActive = modalState === ModalState.LOADING || modalState === ModalState.LOADED;
    const dataContentState = hasImage ? "found" : "not-found";
    const dataOverlayState = modalState === ModalState.UNLOADED || modalState === ModalState.UNLOADING ? "hidden" : "visible";

    // =========================================================================

    const styleContent = {
      visibility: modalState === ModalState.UNLOADED ? "visible" : "hidden"
    };

    // Share this with UNSAFE_handleSvg
    this.styleModalImg = hasImage ? (0, _utils.getStyleModalImg)({
      hasZoomImg,
      imgSrc,
      isSvg,
      isZoomed: isZoomed && isModalActive,
      loadedImgEl,
      offset: zoomMargin,
      shouldRefresh,
      targetEl: imgEl
    }) : {};

    // =========================================================================

    let modalContent = null;
    if (hasImage) {
      const modalImg = isImg || isDiv ? /*#__PURE__*/_react.default.createElement("img", _extends({
        alt: imgAlt,
        sizes: imgSizes,
        src: imgSrc,
        srcSet: imgSrcSet
      }, isZoomImgLoaded && modalState === ModalState.LOADED ? zoomImg : {}, {
        "data-rmiz-modal-img": "",
        height: this.styleModalImg.height || undefined,
        id: idModalImg,
        ref: refModalImg,
        style: this.styleModalImg,
        width: this.styleModalImg.width || undefined
      })) : isSvg ? /*#__PURE__*/_react.default.createElement("div", {
        "data-rmiz-modal-img": true,
        ref: refModalImg,
        style: this.styleModalImg
      }) : null;
      modalContent = ZoomContent ? /*#__PURE__*/_react.default.createElement(ZoomContent, {
        modalState: modalState,
        img: modalImg,
        onUnzoom: handleUnzoom
      }) : modalImg;
    }

    // =========================================================================

    return /*#__PURE__*/_react.default.createElement(WrapElement, {
      "aria-owns": idModal,
      "data-rmiz": "",
      ref: refWrap
    }, /*#__PURE__*/_react.default.createElement(WrapElement, {
      "data-rmiz-content": dataContentState,
      ref: refContent,
      style: styleContent
    }, children), hasImage && elDialogContainer !== null && /*#__PURE__*/(0, _reactDom.createPortal)( /*#__PURE__*/_react.default.createElement("dialog", {
      "aria-labelledby": idModalImg,
      "aria-modal": "true",
      className: classDialog,
      "data-rmiz-modal": "",
      id: idModal,
      onClick: handleDialogClick,
      onClose: handleUnzoom,
      onCancel: handleDialogCancel,
      onKeyDown: handleDialogKeyDown,
      ref: refDialog,
      role: "dialog"
    }, /*#__PURE__*/_react.default.createElement("div", {
      "data-rmiz-modal-overlay": dataOverlayState
    }), /*#__PURE__*/_react.default.createElement("div", {
      "data-rmiz-modal-content": "",
      ref: refModalContent
    }, modalContent, /*#__PURE__*/_react.default.createElement(_reakit.VisuallyHidden, null, /*#__PURE__*/_react.default.createElement("button", {
      onClick: handleUnzoom
    }, "Close")))), elDialogContainer));
  }
  componentDidMount() {
    this.setId();
    this.setAndTrackImg();
    this.handleImgLoad();
    this.UNSAFE_handleSvg();
  }
  componentWillUnmount() {
    var _this$changeObserver2, _this$changeObserver3, _this$imgElObserver, _this$imgElObserver$d, _this$imgEl3, _this$imgEl3$removeEv, _this$imgEl4, _this$imgEl4$removeEv, _this$refModalImg$cur5, _this$refModalImg$cur6, _this$refModalImg$cur7, _this$refModalImg$cur8;
    (_this$changeObserver2 = this.changeObserver) === null || _this$changeObserver2 === void 0 ? void 0 : (_this$changeObserver3 = _this$changeObserver2.disconnect) === null || _this$changeObserver3 === void 0 ? void 0 : _this$changeObserver3.call(_this$changeObserver2);
    (_this$imgElObserver = this.imgElObserver) === null || _this$imgElObserver === void 0 ? void 0 : (_this$imgElObserver$d = _this$imgElObserver.disconnect) === null || _this$imgElObserver$d === void 0 ? void 0 : _this$imgElObserver$d.call(_this$imgElObserver);
    (_this$imgEl3 = this.imgEl) === null || _this$imgEl3 === void 0 ? void 0 : (_this$imgEl3$removeEv = _this$imgEl3.removeEventListener) === null || _this$imgEl3$removeEv === void 0 ? void 0 : _this$imgEl3$removeEv.call(_this$imgEl3, "load", this.handleImgLoad);
    (_this$imgEl4 = this.imgEl) === null || _this$imgEl4 === void 0 ? void 0 : (_this$imgEl4$removeEv = _this$imgEl4.removeEventListener) === null || _this$imgEl4$removeEv === void 0 ? void 0 : _this$imgEl4$removeEv.call(_this$imgEl4, "click", this.handleZoom);
    (_this$refModalImg$cur5 = this.refModalImg.current) === null || _this$refModalImg$cur5 === void 0 ? void 0 : (_this$refModalImg$cur6 = _this$refModalImg$cur5.removeEventListener) === null || _this$refModalImg$cur6 === void 0 ? void 0 : _this$refModalImg$cur6.call(_this$refModalImg$cur5, "transitionend", this.handleZoomEnd);
    (_this$refModalImg$cur7 = this.refModalImg.current) === null || _this$refModalImg$cur7 === void 0 ? void 0 : (_this$refModalImg$cur8 = _this$refModalImg$cur7.removeEventListener) === null || _this$refModalImg$cur8 === void 0 ? void 0 : _this$refModalImg$cur8.call(_this$refModalImg$cur7, "transitionend", this.handleUnzoomEnd);
    window.removeEventListener("wheel", this.handleWheel);
    window.removeEventListener("touchstart", this.handleTouchStart);
    window.removeEventListener("touchend", this.handleTouchMove);
    window.removeEventListener("touchcancel", this.handleTouchCancel);
    window.removeEventListener("resize", this.handleResize);
  }
  componentDidUpdate(prevProps) {
    this.UNSAFE_handleSvg();
    this.handleIfZoomChanged(prevProps.isZoomed);
  }
}
_defineProperty(ControlledBase, "defaultProps", {
  wrapElement: "div",
  zoomMargin: 0
});