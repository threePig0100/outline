"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = presentCollection;
var _collections = require("./../../shared/utils/collections");
function presentCollection(collection) {
  return {
    id: collection.id,
    url: collection.url,
    urlId: collection.urlId,
    name: collection.name,
    description: collection.description,
    sort: collection.sort,
    icon: collection.icon,
    index: collection.index,
    color: collection.color || _collections.colorPalette[0],
    permission: collection.permission,
    sharing: collection.sharing,
    createdAt: collection.createdAt,
    updatedAt: collection.updatedAt,
    deletedAt: collection.deletedAt
  };
}