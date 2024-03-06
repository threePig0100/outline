"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _turndownPluginGfm = require("@joplin/turndown-plugin-gfm");
var _turndown = _interopRequireDefault(require("turndown"));
var _breaks = _interopRequireDefault(require("./breaks"));
var _emptyLists = _interopRequireDefault(require("./emptyLists"));
var _emptyParagraph = _interopRequireDefault(require("./emptyParagraph"));
var _frames = _interopRequireDefault(require("./frames"));
var _images = _interopRequireDefault(require("./images"));
var _inlineLink = _interopRequireDefault(require("./inlineLink"));
var _sanitizeLists = _interopRequireDefault(require("./sanitizeLists"));
var _sanitizeTables = _interopRequireDefault(require("./sanitizeTables"));
var _underlines = _interopRequireDefault(require("./underlines"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * Turndown converts HTML to Markdown and is used in the importer code.
 *
 * For options, see: https://github.com/domchristie/turndown#options
 */
const service = new _turndown.default({
  hr: "---",
  bulletListMarker: "-",
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  blankReplacement: (content, node) => node.nodeName === "P" ? "\n\n\\\n" : ""
}).remove(["script", "style", "title", "head"]).use(_turndownPluginGfm.gfm).use(_inlineLink.default).use(_emptyParagraph.default).use(_sanitizeTables.default).use(_sanitizeLists.default).use(_underlines.default).use(_frames.default).use(_images.default).use(_breaks.default).use(_emptyLists.default);
const escapes = [[/\\/g, "\\\\"], [/\*/g, "\\*"], [/^-/g, "\\-"], [/^\+ /g, "\\+ "], [/^(=+)/g, "\\$1"], [/^(#{1,6}) /g, "\\$1 "], [/`/g, "\\`"], [/^~~~/g, "\\~~~"], [/\[/g, "\\["], [/\]/g, "\\]"], [/\(/g, "\\("],
// OLN-91
[/\)/g, "\\)"],
// OLN-91
[/^>/g, "\\>"], [/_/g, "\\_"], [/^(\d+)\. /g, "$1\\. "]];

/**
 * Overrides the Markdown escaping, as documented here:
 * https://github.com/mixmark-io/turndown/blob/4499b5c313d30a3189a58fdd74fc4ed4b2428afd/README.md#overriding-turndownserviceprototypeescape
 *
 * @param text The string to escape
 * @returns A string with Markdown syntax escaped
 */
service.escape = function (text) {
  return escapes.reduce(function (accumulator, escape) {
    return accumulator.replace(escape[0], escape[1]);
  }, text);
};
var _default = exports.default = service;