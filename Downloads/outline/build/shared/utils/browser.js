"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isMac = isMac;
exports.isTouchDevice = isTouchDevice;
exports.isWindows = isWindows;
exports.supportsPassiveListener = void 0;
const SSR = typeof window === "undefined";

/**
 * Returns true if the client is a touch device.
 */
function isTouchDevice() {
  var _window$matchMedia, _window, _window$matchMedia$ca;
  if (SSR) {
    return false;
  }
  return (_window$matchMedia = (_window = window).matchMedia) === null || _window$matchMedia === void 0 ? void 0 : (_window$matchMedia$ca = _window$matchMedia.call(_window, "(hover: none) and (pointer: coarse)")) === null || _window$matchMedia$ca === void 0 ? void 0 : _window$matchMedia$ca.matches;
}

/**
 * Returns true if the client is running on a Mac.
 */
function isMac() {
  if (SSR) {
    return false;
  }
  return window.navigator.platform === "MacIntel";
}

/**
 * Returns true if the client is running on Windows.
 */
function isWindows() {
  if (SSR) {
    return false;
  }
  return window.navigator.platform === "Win32";
}
let supportsPassive = false;
try {
  const opts = Object.defineProperty({}, "passive", {
    get() {
      supportsPassive = true;
    }
  });
  // @ts-expect-error ts-migrate(2769) testPassive is not a real event
  window.addEventListener("testPassive", null, opts);
  // @ts-expect-error ts-migrate(2769) testPassive is not a real event
  window.removeEventListener("testPassive", null, opts);
} catch (e) {
  // No-op
}

/**
 * Returns true if the client supports passive event listeners
 */
const supportsPassiveListener = exports.supportsPassiveListener = supportsPassive;