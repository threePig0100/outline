"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = presentTeam;
function presentTeam(team) {
  var _team$allowedDomains;
  return {
    id: team.id,
    name: team.name,
    avatarUrl: team.avatarUrl,
    sharing: team.sharing,
    memberCollectionCreate: team.memberCollectionCreate,
    defaultCollectionId: team.defaultCollectionId,
    documentEmbeds: team.documentEmbeds,
    guestSignin: team.emailSigninEnabled,
    subdomain: team.subdomain,
    domain: team.domain,
    url: team.url,
    defaultUserRole: team.defaultUserRole,
    inviteRequired: team.inviteRequired,
    allowedDomains: (_team$allowedDomains = team.allowedDomains) === null || _team$allowedDomains === void 0 ? void 0 : _team$allowedDomains.map(d => d.name),
    preferences: team.preferences
  };
}