"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = pinUpdater;
var _models = require("./../models");
var _database = require("./../storage/database");
/**
 * This command updates a "pinned" document. A pin can only be moved to a new
 * index (reordered) once created.
 *
 * @param Props The properties of the pin to update
 * @returns Pin The updated pin
 */
async function pinUpdater(_ref) {
  let {
    user,
    pin,
    index,
    ip
  } = _ref;
  const transaction = await _database.sequelize.transaction();
  try {
    pin.index = index;
    await pin.save({
      transaction
    });
    await _models.Event.create({
      name: "pins.update",
      modelId: pin.id,
      teamId: user.teamId,
      actorId: user.id,
      documentId: pin.documentId,
      collectionId: pin.collectionId,
      ip
    }, {
      transaction
    });
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
  return pin;
}