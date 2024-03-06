"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateColorHex = exports.toRGB = exports.stringToColor = exports.palette = void 0;
var _md = _interopRequireDefault(require("crypto-js/md5"));
var _polished = require("polished");
var _theme = _interopRequireDefault(require("../styles/theme"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const palette = exports.palette = [_theme.default.brand.red, _theme.default.brand.blue, _theme.default.brand.purple, _theme.default.brand.pink, _theme.default.brand.marine, _theme.default.brand.green, _theme.default.brand.yellow, (0, _polished.darken)(0.2, _theme.default.brand.red), (0, _polished.darken)(0.2, _theme.default.brand.blue), (0, _polished.darken)(0.2, _theme.default.brand.purple), (0, _polished.darken)(0.2, _theme.default.brand.pink), (0, _polished.darken)(0.2, _theme.default.brand.marine), (0, _polished.darken)(0.2, _theme.default.brand.green), (0, _polished.darken)(0.2, _theme.default.brand.yellow)];
const validateColorHex = color => /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);
exports.validateColorHex = validateColorHex;
const stringToColor = input => {
  const inputAsNumber = parseInt((0, _md.default)(input).toString(), 16);
  return palette[inputAsNumber % palette.length];
};

/**
 * Converts a color to string of RGB values separated by commas
 *
 * @param color - A color string
 * @returns A string of RGB values separated by commas
 */
exports.stringToColor = stringToColor;
const toRGB = color => Object.values((0, _polished.parseToRgb)(color)).join(", ");
exports.toRGB = toRGB;