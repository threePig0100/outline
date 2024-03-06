"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = presentFileOperation;
var _path = _interopRequireDefault(require("path"));
var _ = require(".");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function presentFileOperation(data) {
  var _data$collection;
  return {
    id: data.id,
    type: data.type,
    format: data.format,
    name: ((_data$collection = data.collection) === null || _data$collection === void 0 ? void 0 : _data$collection.name) || _path.default.basename(data.key || ""),
    state: data.state,
    error: data.error,
    size: data.size,
    collectionId: data.collectionId,
    user: (0, _.presentUser)(data.user),
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}