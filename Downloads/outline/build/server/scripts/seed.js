"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = main;
require("./bootstrap");
var _teamCreator = _interopRequireDefault(require("./../commands/teamCreator"));
var _env = _interopRequireDefault(require("./../env"));
var _models = require("./../models");
var _database = require("./../storage/database");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const email = process.argv[2];
async function main() {
  let exit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  const teamCount = await _models.Team.count();
  if (teamCount === 0) {
    const user = await _database.sequelize.transaction(async transaction => {
      const team = await (0, _teamCreator.default)({
        name: "Enfon",
        subdomain: "enfon",
        authenticationProviders: [],
        transaction,
        ip: "127.0.0.1"
      });
      return await _models.User.create({
        teamId: team.id,
        name: email.split("@")[0],
        password: "123456",
        email,
        isAdmin: true,
        isViewer: false
      }, {
        transaction
      });
    });
    console.log("email", "\u2705 Seed done \u2013 sign-in link: ".concat(_env.default.URL, "/auth/email.callback?token=").concat(user.getEmailSigninToken()));
  } else {
    console.log("Team already exists, aborting");
  }
  if (exit) {
    process.exit(0);
  }
}
if (process.env.NODE_ENV !== "test") {
  void main(true);
}