"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProsemirrorSchema = exports.BaseSchema = void 0;
var _prosemirrorModel = require("prosemirror-model");
var _zod = require("zod");
var _editor = require("./../../editor");
const BaseSchema = exports.BaseSchema = _zod.z.object({
  body: _zod.z.unknown(),
  query: _zod.z.unknown(),
  file: _zod.z.custom().optional()
});
const ProsemirrorSchema = exports.ProsemirrorSchema = _zod.z.custom(val => {
  try {
    const node = _prosemirrorModel.Node.fromJSON(_editor.schema, val);
    node.check();
    return true;
  } catch (_e) {
    return false;
  }
}, "not valid data");