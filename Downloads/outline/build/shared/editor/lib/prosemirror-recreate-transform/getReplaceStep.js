"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getReplaceStep = getReplaceStep;
var _prosemirrorTransform = require("prosemirror-transform");
function getReplaceStep(fromDoc, toDoc) {
  let start = toDoc.content.findDiffStart(fromDoc.content);
  if (start === null) {
    return false;
  }
  let {
    a: endA,
    b: endB
  } = toDoc.content.findDiffEnd(fromDoc.content);
  const overlap = start - Math.min(endA, endB);
  if (overlap > 0) {
    // If there is an overlap, there is some freedom of choice in how to calculate the
    // start/end boundary. for an inserted/removed slice. We choose the extreme with
    // the lowest depth value.
    if (fromDoc.resolve(start - overlap).depth < toDoc.resolve(endA + overlap).depth) {
      start -= overlap;
    } else {
      endA += overlap;
      endB += overlap;
    }
  }
  return new _prosemirrorTransform.ReplaceStep(start, endB, toDoc.slice(start, endA));
}