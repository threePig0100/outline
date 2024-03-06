"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _isArray = _interopRequireDefault(require("lodash/isArray"));
var _isEqual = _interopRequireDefault(require("lodash/isEqual"));
var _isObject = _interopRequireDefault(require("lodash/isObject"));
var _pick = _interopRequireDefault(require("lodash/pick"));
var _sequelizeTypescript = require("sequelize-typescript");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable @typescript-eslint/ban-types */

class Model extends _sequelizeTypescript.Model {
  /**
   * Find all models in batches, calling the callback function for each batch.
   *
   * @param query The query options.
   * @param callback The function to call for each batch of results
   */
  static async findAllInBatches(query, callback) {
    if (!query.offset) {
      query.offset = 0;
    }
    if (!query.limit) {
      query.limit = 10;
    }
    let results;
    do {
      // @ts-expect-error this T
      results = await this.findAll(query);
      await callback(results, query);
      query.offset += query.limit;
    } while (results.length >= query.limit);
  }

  /**
   * Returns the attributes that have changed since the last save and their previous values.
   *
   * @returns An object with `attributes` and `previousAttributes` keys.
   */
  get changeset() {
    const changes = this.changed();
    const attributes = {};
    const previousAttributes = {};
    if (!changes) {
      return {
        attributes,
        previous: previousAttributes
      };
    }
    for (const change of changes) {
      const previous = this.previous(change);
      const current = this.getDataValue(change);
      if ((0, _isObject.default)(previous) && (0, _isObject.default)(current) && !(0, _isArray.default)(previous) && !(0, _isArray.default)(current)) {
        const difference = Object.keys(previous).concat(Object.keys(current)).filter(key => !(0, _isEqual.default)(previous[key], current[key]));
        previousAttributes[change] = (0, _pick.default)(previous, difference);
        attributes[change] = (0, _pick.default)(current, difference);
      } else {
        previousAttributes[change] = previous;
        attributes[change] = current;
      }
    }
    return {
      attributes,
      previous: previousAttributes
    };
  }
}
var _default = exports.default = Model;