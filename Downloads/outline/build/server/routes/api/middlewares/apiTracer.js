"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = apiTracer;
var _tracer = require("./../../../logging/tracer");
function apiTracer() {
  return async function apiTracerMiddleware(ctx, next) {
    var _ctx$request$body;
    const params = (_ctx$request$body = ctx.request.body) !== null && _ctx$request$body !== void 0 ? _ctx$request$body : ctx.request.query;
    for (const key in params) {
      if (key === "id" || key.endsWith("Id")) {
        const value = params[key];
        if (typeof value === "string") {
          (0, _tracer.addTags)({
            ["resource.".concat(key)]: value
          }, (0, _tracer.getRootSpanFromRequestContext)(ctx));
        }
      }
    }
    await next();
  };
}