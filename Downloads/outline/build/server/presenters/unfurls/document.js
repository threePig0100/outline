"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _types = require("./../../../shared/types");
var _common = require("./common");
function presentDocument(document, viewer) {
  return {
    url: document.url,
    type: _types.UnfurlType.Document,
    title: document.titleWithDefault,
    description: document.getSummary(),
    meta: {
      id: document.id,
      info: (0, _common.presentLastActivityInfoFor)(document, viewer)
    }
  };
}
var _default = exports.default = presentDocument;