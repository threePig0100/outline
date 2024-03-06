"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _invariant = _interopRequireDefault(require("invariant"));
var _WelcomeEmail = _interopRequireDefault(require("./../emails/templates/WelcomeEmail"));
var _errors = require("./../errors");
var _tracing = require("./../logging/tracing");
var _models = require("./../models");
var _teamProvisioner = _interopRequireDefault(require("./teamProvisioner"));
var _userProvisioner = _interopRequireDefault(require("./userProvisioner"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
async function accountProvisioner(_ref) {
  let {
    ip,
    user: userParams,
    team: teamParams,
    authenticationProvider: authenticationProviderParams,
    authentication: authenticationParams
  } = _ref;
  let result;
  let emailMatchOnly;
  try {
    result = await (0, _teamProvisioner.default)({
      ...teamParams,
      authenticationProvider: authenticationProviderParams,
      ip
    });
  } catch (err) {
    // The account could not be provisioned for the provided teamId
    // check to see if we can try authentication using email matching only
    if (err.id === "invalid_authentication") {
      const authenticationProvider = await _models.AuthenticationProvider.findOne({
        where: {
          name: authenticationProviderParams.name,
          // example: "google"
          teamId: teamParams.teamId
        },
        include: [{
          model: _models.Team,
          as: "team",
          required: true
        }]
      });
      if (authenticationProvider) {
        emailMatchOnly = true;
        result = {
          authenticationProvider,
          team: authenticationProvider.team,
          isNewTeam: false
        };
      }
    }
    if (!result) {
      if (err.id) {
        throw err;
      } else {
        throw (0, _errors.InvalidAuthenticationError)(err.message);
      }
    }
  }
  (0, _invariant.default)(result, "Team creator result must exist");
  const {
    authenticationProvider,
    team,
    isNewTeam
  } = result;
  if (!authenticationProvider.enabled) {
    throw (0, _errors.AuthenticationProviderDisabledError)();
  }
  result = await (0, _userProvisioner.default)({
    name: userParams.name,
    email: userParams.email,
    isAdmin: isNewTeam || undefined,
    avatarUrl: userParams.avatarUrl,
    teamId: team.id,
    ip,
    authentication: emailMatchOnly ? undefined : {
      authenticationProviderId: authenticationProvider.id,
      ...authenticationParams,
      expiresAt: authenticationParams.expiresIn ? new Date(Date.now() + authenticationParams.expiresIn * 1000) : undefined
    }
  });
  const {
    isNewUser,
    user
  } = result;

  // TODO: Move to processor
  if (isNewUser) {
    await new _WelcomeEmail.default({
      to: user.email,
      teamUrl: team.url
    }).schedule();
  }
  if (isNewUser || isNewTeam) {
    let provision = isNewTeam;

    // accounts for the case where a team is provisioned, but the user creation
    // failed. In this case we have a valid previously created team but no
    // onboarding collection.
    if (!isNewTeam) {
      const count = await _models.Collection.count({
        where: {
          teamId: team.id
        }
      });
      provision = count === 0;
    }
    if (provision) {
      await team.provisionFirstCollection(user.id);
    }
  }
  return {
    user,
    team,
    isNewUser,
    isNewTeam
  };
}
var _default = exports.default = (0, _tracing.traceFunction)({
  spanName: "accountProvisioner"
})(accountProvisioner);