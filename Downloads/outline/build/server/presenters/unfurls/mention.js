"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _types = require("./../../../shared/types");
var _common = require("./common");
async function presentMention(user, document) {
  const lastOnlineInfo = (0, _common.presentLastOnlineInfoFor)(user);
  const lastViewedInfo = await (0, _common.presentLastViewedInfoFor)(user, document);
  return {
    type: _types.UnfurlType.Mention,
    title: user.name,
    thumbnailUrl: user.avatarUrl,
    meta: {
      id: user.id,
      color: user.color,
      info: "".concat(lastOnlineInfo, " \u2022 ").concat(lastViewedInfo)
    }
  };
}
var _default = exports.default = presentMention;