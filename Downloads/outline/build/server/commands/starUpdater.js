"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = starUpdater;
var _models = require("./../models");
var _database = require("./../storage/database");
/**
 * This command updates a "starred" document. A star can only be moved to a new
 * index (reordered) once created.
 *
 * @param Props The properties of the star to update
 * @returns Star The updated star
 */
async function starUpdater(_ref) {
  let {
    user,
    star,
    index,
    ip
  } = _ref;
  const transaction = await _database.sequelize.transaction();
  try {
    star.index = index;
    await star.save({
      transaction
    });
    await _models.Event.create({
      name: "stars.update",
      modelId: star.id,
      userId: star.userId,
      teamId: user.teamId,
      actorId: user.id,
      documentId: star.documentId,
      ip
    }, {
      transaction
    });
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
  return star;
}