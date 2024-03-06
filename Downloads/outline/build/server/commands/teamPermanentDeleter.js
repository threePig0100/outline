"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Logger = _interopRequireDefault(require("./../logging/Logger"));
var _tracing = require("./../logging/tracing");
var _models = require("./../models");
var _database = require("./../storage/database");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
async function teamPermanentDeleter(team) {
  if (!team.deletedAt) {
    throw new Error("Cannot permanently delete ".concat(team.id, " team. Please delete it and try again."));
  }
  _Logger.default.info("commands", "Permanently destroying team ".concat(team.name, " (").concat(team.id, ")"));
  const teamId = team.id;
  let transaction;
  try {
    transaction = await _database.sequelize.transaction();
    await _models.Attachment.findAllInBatches({
      where: {
        teamId
      },
      limit: 100,
      offset: 0
    }, async (attachments, options) => {
      _Logger.default.info("commands", "Deleting attachments ".concat(options.offset, " \u2013 ").concat((options.offset || 0) + ((options === null || options === void 0 ? void 0 : options.limit) || 0), "\u2026"));
      await Promise.all(attachments.map(attachment => attachment.destroy({
        transaction
      })));
    });
    // Destroy user-relation models
    await _models.User.findAllInBatches({
      attributes: ["id"],
      where: {
        teamId
      },
      limit: 100,
      offset: 0
    }, async users => {
      const userIds = users.map(user => user.id);
      await _models.UserAuthentication.destroy({
        where: {
          userId: userIds
        },
        force: true,
        transaction
      });
      await _models.ApiKey.destroy({
        where: {
          userId: userIds
        },
        force: true,
        transaction
      });
      await _models.Event.destroy({
        where: {
          actorId: userIds
        },
        force: true,
        transaction
      });
    });
    // Destory team-relation models
    await _models.AuthenticationProvider.destroy({
      where: {
        teamId
      },
      force: true,
      transaction
    });
    // events must be first due to db constraints
    await _models.Event.destroy({
      where: {
        teamId
      },
      force: true,
      transaction
    });
    await _models.Collection.destroy({
      where: {
        teamId
      },
      force: true,
      transaction
    });
    await _models.Document.unscoped().destroy({
      where: {
        teamId
      },
      force: true,
      transaction
    });
    await _models.FileOperation.destroy({
      where: {
        teamId
      },
      force: true,
      transaction
    });
    await _models.Group.unscoped().destroy({
      where: {
        teamId
      },
      force: true,
      transaction
    });
    await _models.Integration.destroy({
      where: {
        teamId
      },
      force: true,
      transaction
    });
    await _models.IntegrationAuthentication.destroy({
      where: {
        teamId
      },
      force: true,
      transaction
    });
    await _models.SearchQuery.destroy({
      where: {
        teamId
      },
      force: true,
      transaction
    });
    await _models.Share.destroy({
      where: {
        teamId
      },
      force: true,
      transaction
    });
    await team.destroy({
      force: true,
      transaction
    });
    await _models.Event.create({
      name: "teams.destroy",
      modelId: teamId
    }, {
      transaction
    });
    await transaction.commit();
  } catch (err) {
    if (transaction) {
      await transaction.rollback();
    }
    throw err;
  }
}
var _default = exports.default = (0, _tracing.traceFunction)({
  spanName: "teamPermanentDeleter"
})(teamPermanentDeleter);