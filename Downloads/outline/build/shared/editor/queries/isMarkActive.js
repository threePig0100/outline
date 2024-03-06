"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const isMarkActive = type => state => {
  if (!type) {
    return false;
  }
  const {
    from,
    $from,
    to,
    empty
  } = state.selection;
  return !!(empty ? type.isInSet(state.storedMarks || $from.marks()) : state.doc.rangeHasMark(from, to, type));
};
var _default = exports.default = isMarkActive;