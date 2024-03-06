"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = pagination;
var _querystring = _interopRequireDefault(require("querystring"));
var _constants = require("./../../../../shared/constants");
var _errors = require("./../../../errors");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function pagination() {
  return async function paginationMiddleware(ctx, next) {
    const opts = {
      defaultLimit: _constants.Pagination.defaultLimit,
      defaultOffset: _constants.Pagination.defaultOffset,
      maxLimit: _constants.Pagination.maxLimit
    };
    const query = ctx.request.query;
    const body = ctx.request.body;
    let limit = query.limit || body.limit;
    let offset = query.offset || body.offset;
    if (limit && isNaN(limit)) {
      throw (0, _errors.InvalidRequestError)("Pagination limit must be a valid number");
    }
    if (offset && isNaN(offset)) {
      throw (0, _errors.InvalidRequestError)("Pagination offset must be a valid number");
    }
    limit = parseInt(limit || opts.defaultLimit, 10);
    offset = parseInt(offset || opts.defaultOffset, 10);
    if (limit > opts.maxLimit) {
      throw (0, _errors.InvalidRequestError)("Pagination limit is too large (max ".concat(opts.maxLimit, ")"));
    }
    if (limit <= 0) {
      throw (0, _errors.InvalidRequestError)("Pagination limit must be greater than 0");
    }
    if (offset < 0) {
      throw (0, _errors.InvalidRequestError)("Pagination offset must be greater than or equal to 0");
    }
    query.limit = String(limit);
    query.offset = String(limit + offset);
    ctx.state.pagination = {
      limit,
      offset,
      nextPath: "/api".concat(ctx.request.path, "?").concat(_querystring.default.stringify(query))
    };
    return next();
  };
}