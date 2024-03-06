"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _templates = _interopRequireDefault(require("./../../emails/templates"));
var _BaseTask = _interopRequireDefault(require("./BaseTask"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class EmailTask extends _BaseTask.default {
  async perform(_ref) {
    let {
      templateName,
      props,
      ...metadata
    } = _ref;
    const EmailClass = _templates.default[templateName];
    if (!EmailClass) {
      throw new Error("Email task \"".concat(templateName, "\" template does not exist. Check the file name matches the class name."));
    }
    const email = new EmailClass(props, metadata);
    return email.send();
  }
}
exports.default = EmailTask;