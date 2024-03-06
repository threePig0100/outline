"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = apiResponse;
var _stream = _interopRequireDefault(require("stream"));
var _readableStream = require("readable-stream");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function apiResponse() {
  return async function apiResponseMiddleware(ctx, next) {
    await next();
    const ok = ctx.status < 400;
    if (typeof ctx.body === "object" && !(ctx.body instanceof _readableStream.Readable) && !(ctx.body instanceof _stream.default.Readable) && !(ctx.body instanceof Buffer)) {
      ctx.body = {
        ...ctx.body,
        status: ctx.status,
        ok
      };
    }
  };
}