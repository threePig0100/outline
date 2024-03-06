"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.snakeCase = exports.nameToEmoji = exports.getNameFromEmoji = exports.getEmojiFromName = exports.emojiMartToGemoji = void 0;
var _data = _interopRequireDefault(require("@emoji-mart/data"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const emojiMartToGemoji = exports.emojiMartToGemoji = {
  "+1": "thumbs_up",
  "-1": "thumbs_down"
};

/**
 * Convert kebab case to snake case.
 *
 * @param str The string to convert
 * @returns The converted string
 */
const snakeCase = str => str.replace(/(\w)-(\w)/g, "$1_$2");

/**
 * A map of emoji shortcode to emoji character. The shortcode is snake cased
 * for backwards compatibility with those already encoded into documents.
 */
exports.snakeCase = snakeCase;
const nameToEmoji = exports.nameToEmoji = Object.values(_data.default.emojis).reduce((acc, emoji) => {
  var _emojiMartToGemoji$co;
  const convertedId = snakeCase(emoji.id);
  acc[(_emojiMartToGemoji$co = emojiMartToGemoji[convertedId]) !== null && _emojiMartToGemoji$co !== void 0 ? _emojiMartToGemoji$co : convertedId] = emoji.skins[0].native;
  return acc;
}, {});

/**
 * Get the emoji character for a given emoji shortcode.
 *
 * @param name The emoji shortcode
 * @returns The emoji character
 */
const getEmojiFromName = name => nameToEmoji[name.replace(/:/g, "")];

/**
 * Get the emoji shortcode for a given emoji character.
 *
 * @param emoji The emoji character
 * @returns The emoji shortcode
 */
exports.getEmojiFromName = getEmojiFromName;
const getNameFromEmoji = emoji => {
  var _Object$entries$find;
  return (_Object$entries$find = Object.entries(nameToEmoji).find(_ref => {
    let [, value] = _ref;
    return value === emoji;
  })) === null || _Object$entries$find === void 0 ? void 0 : _Object$entries$find[0];
};
exports.getNameFromEmoji = getNameFromEmoji;