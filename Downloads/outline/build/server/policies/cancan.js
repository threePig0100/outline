"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.allow = exports._cannot = exports._can = exports._authorize = exports._abilities = void 0;
var _cancan = _interopRequireDefault(require("cancan"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const cancan = new _cancan.default();
const _can = exports._can = cancan.can;
const _authorize = exports._authorize = cancan.authorize;
const _cannot = exports._cannot = cancan.cannot;
const _abilities = exports._abilities = cancan.abilities;
const allow = exports.allow = cancan.allow;