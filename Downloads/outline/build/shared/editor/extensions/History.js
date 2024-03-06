"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prosemirrorHistory = require("prosemirror-history");
var _prosemirrorInputrules = require("prosemirror-inputrules");
var _Extension = _interopRequireDefault(require("../lib/Extension"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class History extends _Extension.default {
  get name() {
    return "history";
  }
  keys() {
    return {
      "Mod-z": _prosemirrorHistory.undo,
      "Mod-y": _prosemirrorHistory.redo,
      "Shift-Mod-z": _prosemirrorHistory.redo,
      Backspace: _prosemirrorInputrules.undoInputRule
    };
  }
  get plugins() {
    return [(0, _prosemirrorHistory.history)()];
  }
}
exports.default = History;