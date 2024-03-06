"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = presentPublicTeam;
var _types = require("./../../shared/types");
function presentPublicTeam(team) {
  return {
    name: team.name,
    avatarUrl: team.avatarUrl,
    customTheme: team.getPreference(_types.TeamPreference.CustomTheme)
  };
}