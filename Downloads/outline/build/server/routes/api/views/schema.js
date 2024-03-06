"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ViewsListSchema = exports.ViewsCreateSchema = void 0;
var _zod = _interopRequireDefault(require("zod"));
var _schema = require("../schema");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const ViewsListSchema = exports.ViewsListSchema = _schema.BaseSchema.extend({
  body: _zod.default.object({
    /** Id of the document to retrieve the views for */
    documentId: _zod.default.string().uuid(),
    /** Whether to include views by suspended users */
    includeSuspended: _zod.default.boolean().default(false)
  })
});
const ViewsCreateSchema = exports.ViewsCreateSchema = _schema.BaseSchema.extend({
  body: _zod.default.object({
    /** Id of the document to create the view for */
    documentId: _zod.default.string().uuid()
  })
});