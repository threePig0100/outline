"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Logger = _interopRequireDefault(require("./../../logging/Logger"));
var _models = require("./../../models");
var _database = require("./../../storage/database");
var _BaseTask = _interopRequireDefault(require("./BaseTask"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * Task to disable mechanisms for exporting data from a suspended or demoted user,
 * currently this is done by destroying associated Api Keys and disabling webhooks.
 */
class CleanupDemotedUserTask extends _BaseTask.default {
  async perform(props) {
    await _database.sequelize.transaction(async transaction => {
      const user = await _models.User.findByPk(props.userId, {
        rejectOnEmpty: true
      });
      if (user.isSuspended || !user.isAdmin) {
        const subscriptions = await _models.WebhookSubscription.findAll({
          where: {
            createdById: props.userId,
            enabled: true
          },
          transaction,
          lock: transaction.LOCK.UPDATE
        });
        await Promise.all(subscriptions.map(subscription => subscription.disable({
          transaction
        })));
        _Logger.default.info("task", "Disabled ".concat(subscriptions.length, " webhooks for user ").concat(props.userId));
      }
      if (user.isSuspended || user.isViewer) {
        const apiKeys = await _models.ApiKey.findAll({
          where: {
            userId: props.userId
          },
          transaction,
          lock: transaction.LOCK.UPDATE
        });
        await Promise.all(apiKeys.map(apiKey => apiKey.destroy({
          transaction
        })));
        _Logger.default.info("task", "Destroyed ".concat(apiKeys.length, " api keys for user ").concat(props.userId));
      }
    });
  }
}
exports.default = CleanupDemotedUserTask;