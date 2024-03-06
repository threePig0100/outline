"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = presentApiKey;
function presentApiKey(key) {
  return {
    id: key.id,
    name: key.name,
    secret: key.secret,
    createdAt: key.createdAt,
    updatedAt: key.updatedAt
  };
}