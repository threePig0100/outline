"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.APIKeysDeleteSchema = exports.APIKeysCreateSchema = void 0;
var _zod = require("zod");
var _schema = require("./../schema");
const APIKeysCreateSchema = exports.APIKeysCreateSchema = _schema.BaseSchema.extend({
  body: _zod.z.object({
    /** API Key name */
    name: _zod.z.string()
  })
});
const APIKeysDeleteSchema = exports.APIKeysDeleteSchema = _schema.BaseSchema.extend({
  body: _zod.z.object({
    /** API Key Id */
    id: _zod.z.string().uuid()
  })
});