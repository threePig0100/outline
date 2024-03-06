"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prosemirrorState = require("prosemirror-state");
const collapseSelection = () => (state, dispatch) => {
  dispatch === null || dispatch === void 0 ? void 0 : dispatch(state.tr.setSelection(_prosemirrorState.TextSelection.create(state.doc, state.tr.selection.from)));
  return true;
};
var _default = exports.default = collapseSelection;