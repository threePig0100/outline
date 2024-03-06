"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.testSvg = exports.testImg = exports.testDiv = exports.parsePosition = exports.getStyleModalImg = exports.getScaleToWindowMax = exports.getScaleToWindow = exports.getScale = exports.getImgSrc = exports.getImgRegularStyle = exports.getImgObjectFitStyle = exports.getImgAlt = exports.getDivImgStyle = void 0;
const testElType = (type, el) => {
  var _tagName, _tagName$toUpperCase;
  return type === (el === null || el === void 0 ? void 0 : (_tagName = el.tagName) === null || _tagName === void 0 ? void 0 : (_tagName$toUpperCase = _tagName.toUpperCase) === null || _tagName$toUpperCase === void 0 ? void 0 : _tagName$toUpperCase.call(_tagName));
};
const testDiv = el => testElType("DIV", el) || testElType("SPAN", el);
exports.testDiv = testDiv;
const testImg = el => testElType("IMG", el);
exports.testImg = testImg;
const testSvg = el => testElType("SVG", el);
exports.testSvg = testSvg;
const getScaleToWindow = _ref => {
  let {
    height,
    offset,
    width
  } = _ref;
  return Math.min((window.innerWidth - offset * 2) / width,
  // scale X-axis
  (window.innerHeight - offset * 2) / height // scale Y-axis
  );
};
exports.getScaleToWindow = getScaleToWindow;
const getScaleToWindowMax = _ref2 => {
  let {
    containerHeight,
    containerWidth,
    offset,
    targetHeight,
    targetWidth
  } = _ref2;
  const scale = getScaleToWindow({
    height: targetHeight,
    offset,
    width: targetWidth
  });
  const ratio = targetWidth > targetHeight ? targetWidth / containerWidth : targetHeight / containerHeight;
  return scale > 1 ? ratio : scale * ratio;
};
exports.getScaleToWindowMax = getScaleToWindowMax;
const getScale = _ref3 => {
  let {
    containerHeight,
    containerWidth,
    hasScalableSrc,
    offset,
    targetHeight,
    targetWidth
  } = _ref3;
  if (!containerHeight || !containerWidth) {
    return 1;
  }
  return !hasScalableSrc && targetHeight && targetWidth ? getScaleToWindowMax({
    containerHeight,
    containerWidth,
    offset,
    targetHeight,
    targetWidth
  }) : getScaleToWindow({
    height: containerHeight,
    offset,
    width: containerWidth
  });
};
exports.getScale = getScale;
const URL_REGEX = /url(?:\(['"]?)(.*?)(?:['"]?\))/;
const getImgSrc = imgEl => {
  if (imgEl) {
    if (testImg(imgEl)) {
      return imgEl.currentSrc;
    } else if (testDiv(imgEl)) {
      const bgImg = window.getComputedStyle(imgEl).backgroundImage;
      if (bgImg) {
        var _URL_REGEX$exec;
        return (_URL_REGEX$exec = URL_REGEX.exec(bgImg)) === null || _URL_REGEX$exec === void 0 ? void 0 : _URL_REGEX$exec[1];
      }
    }
  }
  return;
};
exports.getImgSrc = getImgSrc;
const getImgAlt = imgEl => {
  if (imgEl) {
    if (testImg(imgEl)) {
      var _imgEl$alt;
      return (_imgEl$alt = imgEl.alt) !== null && _imgEl$alt !== void 0 ? _imgEl$alt : undefined;
    } else {
      var _imgEl$getAttribute;
      return (_imgEl$getAttribute = imgEl.getAttribute("aria-label")) !== null && _imgEl$getAttribute !== void 0 ? _imgEl$getAttribute : undefined;
    }
  }
  return;
};
exports.getImgAlt = getImgAlt;
const getImgRegularStyle = _ref4 => {
  let {
    containerHeight,
    containerLeft,
    containerTop,
    containerWidth,
    hasScalableSrc,
    offset,
    targetHeight,
    targetWidth
  } = _ref4;
  const scale = getScale({
    containerHeight,
    containerWidth,
    hasScalableSrc,
    offset,
    targetHeight,
    targetWidth
  });
  return {
    top: containerTop,
    left: containerLeft,
    width: containerWidth * scale,
    height: containerHeight * scale,
    transform: "translate(0,0) scale(".concat(1 / scale, ")")
  };
};
exports.getImgRegularStyle = getImgRegularStyle;
const parsePosition = _ref5 => {
  let {
    position,
    relativeNum
  } = _ref5;
  const positionNum = parseFloat(position);
  return position.endsWith("%") ? relativeNum * positionNum / 100 : positionNum;
};
exports.parsePosition = parsePosition;
const getImgObjectFitStyle = _ref6 => {
  let {
    containerHeight,
    containerLeft,
    containerTop,
    containerWidth,
    hasScalableSrc,
    objectFit,
    objectPosition,
    offset,
    targetHeight,
    targetWidth
  } = _ref6;
  if (objectFit === "scale-down") {
    if (targetWidth <= containerWidth && targetHeight <= containerHeight) {
      objectFit = "none";
    } else {
      objectFit = "contain";
    }
  }
  if (objectFit === "cover" || objectFit === "contain") {
    const widthRatio = containerWidth / targetWidth;
    const heightRatio = containerHeight / targetHeight;
    const ratio = objectFit === "cover" ? Math.max(widthRatio, heightRatio) : Math.min(widthRatio, heightRatio);
    const [posLeft = "50%", posTop = "50%"] = objectPosition.split(" ");
    const posX = parsePosition({
      position: posLeft,
      relativeNum: containerWidth - targetWidth * ratio
    });
    const posY = parsePosition({
      position: posTop,
      relativeNum: containerHeight - targetHeight * ratio
    });
    const scale = getScale({
      containerHeight: targetHeight * ratio,
      containerWidth: targetWidth * ratio,
      hasScalableSrc,
      offset,
      targetHeight,
      targetWidth
    });
    return {
      top: containerTop + posY,
      left: containerLeft + posX,
      width: targetWidth * ratio * scale,
      height: targetHeight * ratio * scale,
      transform: "translate(0,0) scale(".concat(1 / scale, ")")
    };
  } else if (objectFit === "none") {
    const [posLeft = "50%", posTop = "50%"] = objectPosition.split(" ");
    const posX = parsePosition({
      position: posLeft,
      relativeNum: containerWidth - targetWidth
    });
    const posY = parsePosition({
      position: posTop,
      relativeNum: containerHeight - targetHeight
    });
    const scale = getScale({
      containerHeight: targetHeight,
      containerWidth: targetWidth,
      hasScalableSrc,
      offset,
      targetHeight,
      targetWidth
    });
    return {
      top: containerTop + posY,
      left: containerLeft + posX,
      width: targetWidth * scale,
      height: targetHeight * scale,
      transform: "translate(0,0) scale(".concat(1 / scale, ")")
    };
  } else if (objectFit === "fill") {
    const widthRatio = containerWidth / targetWidth;
    const heightRatio = containerHeight / targetHeight;
    const ratio = Math.max(widthRatio, heightRatio);
    const scale = getScale({
      containerHeight: targetHeight * ratio,
      containerWidth: targetWidth * ratio,
      hasScalableSrc,
      offset,
      targetHeight,
      targetWidth
    });
    return {
      width: containerWidth * scale,
      height: containerHeight * scale,
      transform: "translate(0,0) scale(".concat(1 / scale, ")")
    };
  } else {
    return {};
  }
};
exports.getImgObjectFitStyle = getImgObjectFitStyle;
const getDivImgStyle = _ref7 => {
  let {
    backgroundPosition,
    backgroundSize,
    containerHeight,
    containerLeft,
    containerTop,
    containerWidth,
    hasScalableSrc,
    offset,
    targetHeight,
    targetWidth
  } = _ref7;
  if (backgroundSize === "cover" || backgroundSize === "contain") {
    const widthRatio = containerWidth / targetWidth;
    const heightRatio = containerHeight / targetHeight;
    const ratio = backgroundSize === "cover" ? Math.max(widthRatio, heightRatio) : Math.min(widthRatio, heightRatio);
    const [posLeft = "50%", posTop = "50%"] = backgroundPosition.split(" ");
    const posX = parsePosition({
      position: posLeft,
      relativeNum: containerWidth - targetWidth * ratio
    });
    const posY = parsePosition({
      position: posTop,
      relativeNum: containerHeight - targetHeight * ratio
    });
    const scale = getScale({
      containerHeight: targetHeight * ratio,
      containerWidth: targetWidth * ratio,
      hasScalableSrc,
      offset,
      targetHeight,
      targetWidth
    });
    return {
      top: containerTop + posY,
      left: containerLeft + posX,
      width: targetWidth * ratio * scale,
      height: targetHeight * ratio * scale,
      transform: "translate(0,0) scale(".concat(1 / scale, ")")
    };
  } else if (backgroundSize === "auto") {
    const [posLeft = "50%", posTop = "50%"] = backgroundPosition.split(" ");
    const posX = parsePosition({
      position: posLeft,
      relativeNum: containerWidth - targetWidth
    });
    const posY = parsePosition({
      position: posTop,
      relativeNum: containerHeight - targetHeight
    });
    const scale = getScale({
      containerHeight: targetHeight,
      containerWidth: targetWidth,
      hasScalableSrc,
      offset,
      targetHeight,
      targetWidth
    });
    return {
      top: containerTop + posY,
      left: containerLeft + posX,
      width: targetWidth * scale,
      height: targetHeight * scale,
      transform: "translate(0,0) scale(".concat(1 / scale, ")")
    };
  } else {
    const [sizeW = "50%", sizeH = "50%"] = backgroundSize.split(" ");
    const sizeWidth = parsePosition({
      position: sizeW,
      relativeNum: containerWidth
    });
    const sizeHeight = parsePosition({
      position: sizeH,
      relativeNum: containerHeight
    });
    const widthRatio = sizeWidth / targetWidth;
    const heightRatio = sizeHeight / targetHeight;

    // @TODO: something funny is happening with this ratio
    const ratio = Math.min(widthRatio, heightRatio);
    const [posLeft = "50%", posTop = "50%"] = backgroundPosition.split(" ");
    const posX = parsePosition({
      position: posLeft,
      relativeNum: containerWidth - targetWidth * ratio
    });
    const posY = parsePosition({
      position: posTop,
      relativeNum: containerHeight - targetHeight * ratio
    });
    const scale = getScale({
      containerHeight: targetHeight * ratio,
      containerWidth: targetWidth * ratio,
      hasScalableSrc,
      offset,
      targetHeight,
      targetWidth
    });
    return {
      top: containerTop + posY,
      left: containerLeft + posX,
      width: targetWidth * ratio * scale,
      height: targetHeight * ratio * scale,
      transform: "translate(0,0) scale(".concat(1 / scale, ")")
    };
  }
};
exports.getDivImgStyle = getDivImgStyle;
const SRC_SVG_REGEX = /\.svg$/i;
const getStyleModalImg = _ref8 => {
  var _imgSrc$slice, _loadedImgEl$naturalH, _loadedImgEl$naturalW;
  let {
    hasZoomImg,
    imgSrc,
    isSvg,
    isZoomed,
    loadedImgEl,
    offset,
    shouldRefresh,
    targetEl
  } = _ref8;
  const hasScalableSrc = isSvg || (imgSrc === null || imgSrc === void 0 ? void 0 : (_imgSrc$slice = imgSrc.slice) === null || _imgSrc$slice === void 0 ? void 0 : _imgSrc$slice.call(imgSrc, 0, 18)) === "data:image/svg+xml" || hasZoomImg || !!(imgSrc && SRC_SVG_REGEX.test(imgSrc));
  const imgRect = targetEl.getBoundingClientRect();
  const targetElComputedStyle = window.getComputedStyle(targetEl);
  const styleImgRegular = getImgRegularStyle({
    containerHeight: imgRect.height,
    containerLeft: imgRect.left,
    containerTop: imgRect.top,
    containerWidth: imgRect.width,
    hasScalableSrc,
    offset,
    targetHeight: (_loadedImgEl$naturalH = loadedImgEl === null || loadedImgEl === void 0 ? void 0 : loadedImgEl.naturalHeight) !== null && _loadedImgEl$naturalH !== void 0 ? _loadedImgEl$naturalH : imgRect.height,
    targetWidth: (_loadedImgEl$naturalW = loadedImgEl === null || loadedImgEl === void 0 ? void 0 : loadedImgEl.naturalWidth) !== null && _loadedImgEl$naturalW !== void 0 ? _loadedImgEl$naturalW : imgRect.width
  });
  const styleImgObjectFit = loadedImgEl && targetElComputedStyle.objectFit ? getImgObjectFitStyle({
    containerHeight: imgRect.height,
    containerLeft: imgRect.left,
    containerTop: imgRect.top,
    containerWidth: imgRect.width,
    hasScalableSrc,
    objectFit: targetElComputedStyle.objectFit,
    objectPosition: targetElComputedStyle.objectPosition,
    offset,
    targetHeight: loadedImgEl.naturalHeight,
    targetWidth: loadedImgEl.naturalWidth
  }) : undefined;
  const styleDivImg = loadedImgEl && testDiv(targetEl) ? getDivImgStyle({
    backgroundPosition: targetElComputedStyle.backgroundPosition,
    backgroundSize: targetElComputedStyle.backgroundSize,
    containerHeight: imgRect.height,
    containerLeft: imgRect.left,
    containerTop: imgRect.top,
    containerWidth: imgRect.width,
    hasScalableSrc,
    offset,
    targetHeight: loadedImgEl.naturalHeight,
    targetWidth: loadedImgEl.naturalWidth
  }) : undefined;
  const style = Object.assign({}, styleImgRegular, styleImgObjectFit, styleDivImg);
  if (isZoomed) {
    const viewportX = window.innerWidth / 2;
    const viewportY = window.innerHeight / 2;
    const childCenterX = parseFloat(String(style.left || 0)) + parseFloat(String(style.width || 0)) / 2;
    const childCenterY = parseFloat(String(style.top || 0)) + parseFloat(String(style.height || 0)) / 2;
    const translateX = viewportX - childCenterX;
    const translateY = viewportY - childCenterY;

    // For scenarios like resizing the browser window
    if (shouldRefresh) {
      style.transitionDuration = "0.01ms";
    }
    style.transform = "translate(".concat(translateX, "px,").concat(translateY, "px) scale(1)");
  }
  return style;
};
exports.getStyleModalImg = getStyleModalImg;