"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = apexRedirect;
function apexRedirect() {
  return async function apexRedirectMiddleware(ctx, next) {
    if (ctx.headers.host === "getoutline.com") {
      ctx.redirect("https://www.".concat(ctx.headers.host).concat(ctx.path));
    } else {
      return next();
    }
  };
}