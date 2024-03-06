"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deserializeFilename = deserializeFilename;
exports.getFilenamesInDirectory = getFilenamesInDirectory;
exports.requireDirectory = requireDirectory;
exports.serializeFilename = serializeFilename;
var _path = _interopRequireDefault(require("path"));
var _fsExtra = _interopRequireDefault(require("fs-extra"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function serializeFilename(text) {
  return text.replace(/\//g, "%2F").replace(/\\/g, "%5C");
}
function deserializeFilename(text) {
  return text.replace(/%2F/g, "/").replace(/%5C/g, "\\");
}
function getFilenamesInDirectory(dirName) {
  return _fsExtra.default.readdirSync(dirName).filter(file => file.indexOf(".") !== 0 && file.match(/\.[jt]s$/) && file !== _path.default.basename(__filename) && !file.includes(".test"));
}
function requireDirectory(dirName) {
  return getFilenamesInDirectory(dirName).map(fileName => {
    const filePath = _path.default.join(dirName, fileName);
    const name = _path.default.basename(filePath.replace(/\.[jt]s$/, ""));
    return [require(filePath), name];
  });
}