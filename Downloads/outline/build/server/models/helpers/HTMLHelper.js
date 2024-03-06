"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _cssInline = require("css-inline");
var _env = _interopRequireDefault(require("./../../env"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class HTMLHelper {
  /**
   * Move CSS styles from <style> tags to inline styles with default settings.
   *
   * @param html The HTML to inline CSS styles for.
   * @returns The HTML with CSS styles inlined.
   */
  static inlineCSS(html) {
    return (0, _cssInline.inline)(html, {
      base_url: _env.default.URL,
      inline_style_tags: true,
      keep_link_tags: false,
      keep_style_tags: false,
      load_remote_stylesheets: false
    });
  }
}
exports.default = HTMLHelper;