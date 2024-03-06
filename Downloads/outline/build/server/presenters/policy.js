"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _compact = _interopRequireDefault(require("lodash/compact"));
var _tracing = require("./../logging/tracing");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function presentPolicy(user, objects) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const {
    serialize
  } = require("../policies");
  return (0, _compact.default)(objects).map(object => ({
    id: object.id,
    abilities: serialize(user, object)
  }));
}
var _default = exports.default = (0, _tracing.traceFunction)({
  spanName: "presenters"
})(presentPolicy);