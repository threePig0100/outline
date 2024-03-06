"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _models = require("./../../models");
var _BaseTask = _interopRequireDefault(require("./BaseTask"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class DeleteAttachmentTask extends _BaseTask.default {
  async perform(_ref) {
    let {
      attachmentId,
      teamId
    } = _ref;
    const attachment = await _models.Attachment.findOne({
      where: {
        teamId,
        id: attachmentId
      }
    });
    if (!attachment) {
      return;
    }
    await attachment.destroy();
  }
}
exports.default = DeleteAttachmentTask;