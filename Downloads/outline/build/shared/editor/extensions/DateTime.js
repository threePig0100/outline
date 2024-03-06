"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prosemirrorInputrules = require("prosemirror-inputrules");
var _date = require("../../utils/date");
var _Extension = _interopRequireDefault(require("../lib/Extension"));
var _types = require("../types");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * An editor extension that adds commands to insert the current date and time.
 */
class DateTime extends _Extension.default {
  get name() {
    return "date_time";
  }
  inputRules() {
    return [
    // Note: There is a space at the end of the pattern here otherwise the
    // /datetime rule can never be matched.
    // these extra input patterns are needed until the block menu matches
    // in places other than the start of a line
    new _prosemirrorInputrules.InputRule(/\/date\s$/, (_ref, _match, start, end) => {
      let {
        tr
      } = _ref;
      tr.delete(start, end).insertText((0, _date.getCurrentDateAsString)() + " ");
      this.editor.events.emit(_types.EventType.SuggestionsMenuClose);
      return tr;
    }), new _prosemirrorInputrules.InputRule(/\/time\s$/, (_ref2, _match, start, end) => {
      let {
        tr
      } = _ref2;
      tr.delete(start, end).insertText((0, _date.getCurrentTimeAsString)() + " ");
      this.editor.events.emit(_types.EventType.SuggestionsMenuClose);
      return tr;
    }), new _prosemirrorInputrules.InputRule(/\/datetime\s$/, (_ref3, _match, start, end) => {
      let {
        tr
      } = _ref3;
      tr.delete(start, end).insertText("".concat((0, _date.getCurrentDateTimeAsString)(), " "));
      this.editor.events.emit(_types.EventType.SuggestionsMenuClose);
      return tr;
    })];
  }
  commands(_options) {
    return {
      date: () => (state, dispatch) => {
        dispatch === null || dispatch === void 0 ? void 0 : dispatch(state.tr.insertText((0, _date.getCurrentDateAsString)() + " "));
        return true;
      },
      time: () => (state, dispatch) => {
        dispatch === null || dispatch === void 0 ? void 0 : dispatch(state.tr.insertText((0, _date.getCurrentTimeAsString)() + " "));
        return true;
      },
      datetime: () => (state, dispatch) => {
        dispatch === null || dispatch === void 0 ? void 0 : dispatch(state.tr.insertText((0, _date.getCurrentDateTimeAsString)() + " "));
        return true;
      }
    };
  }
}
exports.default = DateTime;