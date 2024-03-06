"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkConnection = void 0;
exports.createDatabaseInstance = createDatabaseInstance;
exports.createMigrationRunner = createMigrationRunner;
exports.sequelize = exports.migrations = void 0;
var _path = _interopRequireDefault(require("path"));
var _sequelizeTypescript = require("sequelize-typescript");
var _umzug = require("umzug");
var _env = _interopRequireDefault(require("./../env"));
var _Logger = _interopRequireDefault(require("../logging/Logger"));
var models = _interopRequireWildcard(require("../models"));
var _env$DATABASE_CONNECT, _env$DATABASE_CONNECT2;
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const isSSLDisabled = _env.default.PGSSLMODE === "disable";
const poolMax = (_env$DATABASE_CONNECT = _env.default.DATABASE_CONNECTION_POOL_MAX) !== null && _env$DATABASE_CONNECT !== void 0 ? _env$DATABASE_CONNECT : 5;
const poolMin = (_env$DATABASE_CONNECT2 = _env.default.DATABASE_CONNECTION_POOL_MIN) !== null && _env$DATABASE_CONNECT2 !== void 0 ? _env$DATABASE_CONNECT2 : 0;
const url = _env.default.DATABASE_CONNECTION_POOL_URL || _env.default.DATABASE_URL;
function createDatabaseInstance(url, models) {
  return new _sequelizeTypescript.Sequelize(url, {
    logging: msg => {
      var _process$env$DEBUG;
      return ((_process$env$DEBUG = process.env.DEBUG) === null || _process$env$DEBUG === void 0 ? void 0 : _process$env$DEBUG.includes("database")) && _Logger.default.debug("database", msg);
    },
    typeValidation: true,
    logQueryParameters: _env.default.isDevelopment,
    dialectOptions: {
      ssl: _env.default.isProduction && !isSSLDisabled ? {
        // Ref.: https://github.com/brianc/node-postgres/issues/2009
        rejectUnauthorized: false
      } : false
    },
    models: Object.values(models),
    pool: {
      max: poolMax,
      min: poolMin,
      acquire: 30000,
      idle: 10000
    }
  });
}

/**
 * This function is used to test the database connection on startup. It will
 * throw a descriptive error if the connection fails.
 */
const checkConnection = async db => {
  try {
    await db.authenticate();
  } catch (error) {
    if (error.message.includes("does not support SSL")) {
      _Logger.default.fatal("The database does not support SSL connections. Set the `PGSSLMODE` environment variable to `disable` or enable SSL on your database server.", error);
    } else {
      _Logger.default.fatal("Failed to connect to database", error);
    }
  }
};
exports.checkConnection = checkConnection;
function createMigrationRunner(db, glob) {
  return new _umzug.Umzug({
    migrations: {
      glob,
      resolve: _ref => {
        let {
          name,
          path,
          context
        } = _ref;
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const migration = require(path);
        return {
          name,
          up: async () => migration.up(context, _sequelizeTypescript.Sequelize),
          down: async () => migration.down(context, _sequelizeTypescript.Sequelize)
        };
      }
    },
    context: db.getQueryInterface(),
    storage: new _umzug.SequelizeStorage({
      sequelize: db
    }),
    logger: {
      warn: params => _Logger.default.warn("database", params),
      error: params => _Logger.default.error(params.message, params),
      info: params => _Logger.default.info("database", params.event === "migrating" ? "Migrating ".concat(params.name, "\u2026") : "Migrated ".concat(params.name, " in ").concat(params.durationSeconds, "s")),
      debug: params => _Logger.default.debug("database", params.event === "migrating" ? "Migrating ".concat(params.name, "\u2026") : "Migrated ".concat(params.name, " in ").concat(params.durationSeconds, "s"))
    }
  });
}
const sequelize = exports.sequelize = createDatabaseInstance(url, models);
const migrations = exports.migrations = createMigrationRunner(sequelize, ["migrations/*.js", {
  cwd: _path.default.resolve("server")
}]);