"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function presentUnfurl(data) {
  return {
    url: data.url,
    type: data.type,
    title: data.title,
    description: data.description,
    thumbnailUrl: data.thumbnail_url,
    meta: data.meta
  };
}
var _default = exports.default = presentUnfurl;