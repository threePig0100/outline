"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RecreateTransform = void 0;
exports.recreateTransform = recreateTransform;
var _diff = require("diff");
var _prosemirrorTransform = require("prosemirror-transform");
var _rfc = require("rfc6902");
var _copy = require("./copy");
var _getFromPath = require("./getFromPath");
var _getReplaceStep = require("./getReplaceStep");
var _removeMarks = require("./removeMarks");
var _simplifyTransform = require("./simplifyTransform");
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class RecreateTransform {
  constructor(fromDoc, toDoc) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    _defineProperty(this, "fromDoc", void 0);
    _defineProperty(this, "toDoc", void 0);
    _defineProperty(this, "complexSteps", void 0);
    _defineProperty(this, "wordDiffs", void 0);
    _defineProperty(this, "simplifyDiff", void 0);
    _defineProperty(this, "schema", void 0);
    _defineProperty(this, "tr", void 0);
    /* current working document data, may get updated while recalculating node steps */
    _defineProperty(this, "currentJSON", void 0);
    /* final document as json data */
    _defineProperty(this, "finalJSON", void 0);
    _defineProperty(this, "ops", void 0);
    const o = {
      complexSteps: true,
      wordDiffs: false,
      simplifyDiff: true,
      ...options
    };
    this.fromDoc = fromDoc;
    this.toDoc = toDoc;
    this.complexSteps = o.complexSteps; // Whether to return steps other than ReplaceSteps
    this.wordDiffs = o.wordDiffs; // Whether to make text diffs cover entire words
    this.simplifyDiff = o.simplifyDiff;
    this.schema = fromDoc.type.schema;
    this.tr = new _prosemirrorTransform.Transform(fromDoc);
    this.currentJSON = {};
    this.finalJSON = {};
    this.ops = [];
  }
  init() {
    if (this.complexSteps) {
      // For First steps: we create versions of the documents without marks as
      // these will only confuse the diffing mechanism and marks won't cause
      // any mapping changes anyway.
      this.currentJSON = (0, _removeMarks.removeMarks)(this.fromDoc).toJSON();
      this.finalJSON = (0, _removeMarks.removeMarks)(this.toDoc).toJSON();
      this.ops = (0, _rfc.createPatch)(this.currentJSON, this.finalJSON);
      this.recreateChangeContentSteps();
      this.recreateChangeMarkSteps();
    } else {
      // We don't differentiate between mark changes and other changes.
      this.currentJSON = this.fromDoc.toJSON();
      this.finalJSON = this.toDoc.toJSON();
      this.ops = (0, _rfc.createPatch)(this.currentJSON, this.finalJSON);
      this.recreateChangeContentSteps();
    }
    if (this.simplifyDiff) {
      this.tr = (0, _simplifyTransform.simplifyTransform)(this.tr) || this.tr;
    }
    return this.tr;
  }

  /** convert json-diff to prosemirror steps */
  recreateChangeContentSteps() {
    // First step: find content changing steps.
    let ops = [];
    while (this.ops.length) {
      // get next
      let op = this.ops.shift();
      ops.push(op);
      let toDoc;
      const afterStepJSON = (0, _copy.copy)(this.currentJSON); // working document receiving patches
      const pathParts = op.path.split("/");

      // collect operations until we receive a valid document:
      // apply ops-patches until a valid prosemirror document is retrieved,
      // then try to create a transformation step or retry with next operation
      while (!toDoc) {
        (0, _rfc.applyPatch)(afterStepJSON, [op]);
        try {
          toDoc = this.schema.nodeFromJSON(afterStepJSON);
          toDoc.check();
        } catch (error) {
          toDoc = null;
          if (this.ops.length > 0) {
            op = this.ops.shift();
            ops.push(op);
          } else {
            throw new Error("No valid diff possible applying ".concat(op.path));
          }
        }
      }

      // apply operation (ignoring afterStepJSON)
      if (this.complexSteps && ops.length === 1 && (pathParts.includes("attrs") || pathParts.includes("type"))) {
        // Node markup is changing
        this.addSetNodeMarkup(); // a lost update is ignored
        ops = [];
      } else if (ops.length === 1 && op.op === "replace" && pathParts[pathParts.length - 1] === "text") {
        // Text is being replaced, we apply text diffing to find the smallest possible diffs.
        this.addReplaceTextSteps(op, afterStepJSON);
        ops = [];
      } else if (this.addReplaceStep(toDoc, afterStepJSON)) {
        // operations have been applied
        ops = [];
      }
    }
  }

  /** update node with attrs and marks, may also change type */
  addSetNodeMarkup() {
    // first diff in document is supposed to be a node-change (in type and/or attributes)
    // thus simply find the first change and apply a node change step, then recalculate the diff
    // after updating the document
    const fromDoc = this.schema.nodeFromJSON(this.currentJSON);
    const toDoc = this.schema.nodeFromJSON(this.finalJSON);
    const start = toDoc.content.findDiffStart(fromDoc.content);
    // @note start is the same (first) position for current and target document
    const fromNode = fromDoc.nodeAt(start);
    const toNode = toDoc.nodeAt(start);
    if (!start) {
      // @note this completly updates all attributes in one step, by completely replacing node
      const nodeType = fromNode.type === toNode.type ? null : toNode.type;
      try {
        this.tr.setNodeMarkup(start, nodeType, toNode.attrs, toNode.marks);
      } catch (e) {
        // if nodetypes differ, the updated node-type and contents might not be compatible
        // with schema and requires a replace
        if (nodeType && e.message.includes("Invalid content")) {
          // @todo add test-case for this scenario
          this.tr.replaceWith(start, start + fromNode.nodeSize, toNode);
        } else {
          throw e;
        }
      }
      this.currentJSON = (0, _removeMarks.removeMarks)(this.tr.doc).toJSON();
      // setting the node markup may have invalidated the following ops, so we calculate them again.
      this.ops = (0, _rfc.createPatch)(this.currentJSON, this.finalJSON);
      return true;
    }
    return false;
  }
  recreateChangeMarkSteps() {
    // Now the documents should be the same, except their marks, so everything should map 1:1.
    // Second step: Iterate through the toDoc and make sure all marks are the same in tr.doc
    this.toDoc.descendants((tNode, tPos) => {
      if (!tNode.isInline) {
        return true;
      }
      this.tr.doc.nodesBetween(tPos, tPos + tNode.nodeSize, (fNode, fPos) => {
        if (!fNode.isInline) {
          return true;
        }
        const from = Math.max(tPos, fPos);
        const to = Math.min(tPos + tNode.nodeSize, fPos + fNode.nodeSize);
        fNode.marks.forEach(nodeMark => {
          if (!nodeMark.isInSet(tNode.marks)) {
            this.tr.removeMark(from, to, nodeMark);
          }
        });
        tNode.marks.forEach(nodeMark => {
          if (!nodeMark.isInSet(fNode.marks)) {
            this.tr.addMark(from, to, nodeMark);
          }
        });
        return;
      });
      return;
    });
  }

  /**
   * retrieve and possibly apply replace-step based from doc changes
   * From http://prosemirror.net/examples/footnote/
   */
  addReplaceStep(toDoc, afterStepJSON) {
    const fromDoc = this.schema.nodeFromJSON(this.currentJSON);
    const step = (0, _getReplaceStep.getReplaceStep)(fromDoc, toDoc);
    if (!step) {
      return false;
    } else if (!this.tr.maybeStep(step).failed) {
      this.currentJSON = afterStepJSON;
      return true; // @change previously null
    }
    throw new Error("No valid step found.");
  }

  /** retrieve and possibly apply text replace-steps based from doc changes */
  addReplaceTextSteps(op, afterStepJSON) {
    // We find the position number of the first character in the string
    const op1 = {
      ...op,
      value: "xx"
    };
    const op2 = {
      ...op,
      value: "yy"
    };
    const afterOP1JSON = (0, _copy.copy)(this.currentJSON);
    const afterOP2JSON = (0, _copy.copy)(this.currentJSON);
    (0, _rfc.applyPatch)(afterOP1JSON, [op1]);
    (0, _rfc.applyPatch)(afterOP2JSON, [op2]);
    const op1Doc = this.schema.nodeFromJSON(afterOP1JSON);
    const op2Doc = this.schema.nodeFromJSON(afterOP2JSON);

    // get text diffs
    const finalText = op.value;
    const currentText = (0, _getFromPath.getFromPath)(this.currentJSON, op.path);
    const textDiffs = this.wordDiffs ? (0, _diff.diffWordsWithSpace)(currentText, finalText) : (0, _diff.diffChars)(currentText, finalText);
    let offset = op1Doc.content.findDiffStart(op2Doc.content);
    const marks = op1Doc.resolve(offset + 1).marks();
    while (textDiffs.length) {
      const diff = textDiffs.shift();
      if (diff.added) {
        const textNode = this.schema.nodeFromJSON({
          type: "text",
          text: diff.value
        }).mark(marks);
        if (textDiffs.length && textDiffs[0].removed) {
          const nextDiff = textDiffs.shift();
          this.tr.replaceWith(offset, offset + nextDiff.value.length, textNode);
        } else {
          this.tr.insert(offset, textNode);
        }
        offset += diff.value.length;
      } else if (diff.removed) {
        if (textDiffs.length && textDiffs[0].added) {
          const nextDiff = textDiffs.shift();
          const textNode = this.schema.nodeFromJSON({
            type: "text",
            text: nextDiff.value
          }).mark(marks);
          this.tr.replaceWith(offset, offset + diff.value.length, textNode);
          offset += nextDiff.value.length;
        } else {
          this.tr.delete(offset, offset + diff.value.length);
        }
      } else {
        offset += diff.value.length;
      }
    }
    this.currentJSON = afterStepJSON;
  }
}
exports.RecreateTransform = RecreateTransform;
function recreateTransform(fromDoc, toDoc) {
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const recreator = new RecreateTransform(fromDoc, toDoc, options);
  return recreator.init();
}