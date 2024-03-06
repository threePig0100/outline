"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "presentDocument", {
  enumerable: true,
  get: function () {
    return _document.default;
  }
});
Object.defineProperty(exports, "presentMention", {
  enumerable: true,
  get: function () {
    return _mention.default;
  }
});
var _document = _interopRequireDefault(require("./document"));
var _mention = _interopRequireDefault(require("./mention"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }