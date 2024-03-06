"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTestServer = getTestServer;
exports.setSelfHosted = setSelfHosted;
var _faker = require("@faker-js/faker");
var _env = _interopRequireDefault(require("./../../shared/env"));
var _env2 = _interopRequireDefault(require("./../env"));
var _onerror = _interopRequireDefault(require("./../onerror"));
var _web = _interopRequireDefault(require("./../services/web"));
var _database = require("./../storage/database");
var _TestServer = _interopRequireDefault(require("./TestServer"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function getTestServer() {
  const app = (0, _web.default)();
  (0, _onerror.default)(app);
  const server = new _TestServer.default(app);
  const disconnect = async () => {
    await _database.sequelize.close();
    return server.close();
  };
  afterAll(disconnect);
  return server;
}

/**
 * Set the environment to be self hosted.
 */
function setSelfHosted() {
  _env2.default.URL = _env.default.URL = "https://".concat(_faker.faker.internet.domainName());
}