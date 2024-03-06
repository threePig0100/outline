"use strict";

var _env = _interopRequireDefault(require("./../../shared/env"));
var _env2 = _interopRequireDefault(require("./../env"));
var _redis = _interopRequireDefault(require("./../storage/redis"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
require("./../storage/database");
jest.mock("bull");

// This is needed for the relative manual mock to be picked up
jest.mock("../queues");

// We never want to make real S3 requests in test environment
jest.mock("aws-sdk", () => {
  const mS3 = {
    createPresignedPost: jest.fn(),
    putObject: jest.fn().mockReturnThis(),
    deleteObject: jest.fn().mockReturnThis(),
    promise: jest.fn()
  };
  return {
    S3: jest.fn(() => mS3),
    Endpoint: jest.fn()
  };
});
afterAll(() => _redis.default.defaultClient.disconnect());
beforeEach(() => {
  _env2.default.URL = _env.default.URL = "https://app.outline.dev";
});