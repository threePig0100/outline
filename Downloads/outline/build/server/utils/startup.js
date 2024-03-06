"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkDataMigrations = checkDataMigrations;
exports.checkEnv = checkEnv;
exports.checkPendingMigrations = checkPendingMigrations;
var _chalk = _interopRequireDefault(require("chalk"));
var _isEmpty = _interopRequireDefault(require("lodash/isEmpty"));
var _env = _interopRequireDefault(require("./../env"));
var _Logger = _interopRequireDefault(require("./../logging/Logger"));
var _AuthenticationProvider = _interopRequireDefault(require("./../models/AuthenticationProvider"));
var _Team = _interopRequireDefault(require("./../models/Team"));
var _database = require("./../storage/database");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
async function checkPendingMigrations() {
  try {
    const pending = await _database.migrations.pending();
    if (!(0, _isEmpty.default)(pending)) {
      _Logger.default.info("database", "Running migrations…");
      await _database.migrations.up();
    }
    await checkDataMigrations();
  } catch (err) {
    if (err.message.includes("ECONNREFUSED")) {
      _Logger.default.warn(_chalk.default.red("Could not connect to the database. Please check your connection settings."));
    } else {
      _Logger.default.warn(_chalk.default.red(err.message));
    }
    process.exit(1);
  }
}
async function checkDataMigrations() {
  if (_env.default.isCloudHosted) {
    return;
  }
  const teams = await _Team.default.count();
  const providers = await _AuthenticationProvider.default.count();
  if (_env.default.isProduction && teams && !providers) {
    _Logger.default.warn("\nThis version of Outline cannot start until a data migration is complete.\nBackup your database, run the database migrations and the following script:\n(Note: script run needed only when upgrading to any version between 0.54.0 and 0.61.1, including both)\n\n$ node ./build/server/scripts/20210226232041-migrate-authentication.js\n");
    process.exit(1);
  }
}
async function checkEnv() {
  await _env.default.validate().then(errors => {
    if (errors.length > 0) {
      _Logger.default.warn("Environment configuration is invalid, please check the following:\n\n");
      for (const error of errors) {
        var _error$constraints;
        _Logger.default.warn("- " + Object.values((_error$constraints = error.constraints) !== null && _error$constraints !== void 0 ? _error$constraints : {}).join(", "));
      }
      process.exit(1);
    }
  });
  if (_env.default.isProduction) {
    _Logger.default.info("lifecycle", _chalk.default.green("\nIs your team enjoying Outline? Consider supporting future development by sponsoring the project:\n\nhttps://github.com/sponsors/outline\n"));
  } else if (_env.default.isDevelopment) {
    _Logger.default.warn("Running Outline in ".concat(_chalk.default.bold("development mode"), ". To run Outline in production mode set the ").concat(_chalk.default.bold("NODE_ENV"), " env variable to \"production\""));
  }
}