"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _authentication = _interopRequireDefault(require("./../../../middlewares/authentication"));
var _pagination = _interopRequireDefault(require("./../middlewares/pagination"));
var _rateLimiter = require("./../../../middlewares/rateLimiter");
var _RateLimiter = require("./../../../utils/RateLimiter");
var _validate = _interopRequireDefault(require("./../../../middlewares/validate"));
var T = _interopRequireWildcard(require("./../documents/schema"));
var _koaRouter = _interopRequireDefault(require("koa-router"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// import { RoomServiceClient, Room } from 'livekit-server-sdk'
const router = new _koaRouter.default();
const axios = require('axios');
router.post("rooms.create", (0, _authentication.default)({
  optional: true
}), (0, _pagination.default)(), (0, _rateLimiter.rateLimiter)(_RateLimiter.RateLimiterStrategy.OneHundredPerMinute), (0, _validate.default)(T.DocumentsSearchSchema), async ctx => {
  const {
    query,
    includeArchived,
    includeDrafts,
    collectionId,
    userId,
    dateFilter,
    shareId,
    snippetMinWords,
    snippetMaxWords
  } = ctx.input.body;
  console.log("收到");
  axios.get('http://localhost:4000/createRoom').then(function (response) {
    console.log(response.data);
  }).catch(function (error) {
    console.log(error);
  });
});
var _default = exports.default = router;