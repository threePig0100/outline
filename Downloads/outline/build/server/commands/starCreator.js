"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = starCreator;
var _fractionalIndex = _interopRequireDefault(require("fractional-index"));
var _sequelize = require("sequelize");
var _models = require("./../models");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * This command creates a "starred" document via the star relation. Stars are
 * only visible to the user that created them.
 *
 * @param Props The properties of the star to create
 * @returns Star The star that was created
 */
async function starCreator(_ref) {
  let {
    user,
    documentId,
    collectionId,
    ip,
    transaction,
    ...rest
  } = _ref;
  let {
    index
  } = rest;
  const where = {
    userId: user.id
  };
  if (!index) {
    const stars = await _models.Star.findAll({
      where,
      attributes: ["id", "index", "updatedAt"],
      limit: 1,
      order: [
      // using LC_COLLATE:"C" because we need byte order to drive the sorting
      // find only the first star so we can create an index before it
      _sequelize.Sequelize.literal('"star"."index" collate "C"'), ["updatedAt", "DESC"]],
      transaction
    });

    // create a star at the beginning of the list
    index = (0, _fractionalIndex.default)(null, stars.length ? stars[0].index : null);
  }
  const [star, isCreated] = await _models.Star.findOrCreate({
    where: documentId ? {
      userId: user.id,
      documentId
    } : {
      userId: user.id,
      collectionId
    },
    defaults: {
      index
    },
    transaction
  });
  if (isCreated) {
    await _models.Event.create({
      name: "stars.create",
      teamId: user.teamId,
      modelId: star.id,
      userId: user.id,
      actorId: user.id,
      documentId,
      collectionId,
      ip
    }, {
      transaction
    });
  }
  return star;
}