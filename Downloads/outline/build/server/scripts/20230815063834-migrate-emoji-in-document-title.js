"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = main;
require("./bootstrap");
var _sequelize = require("sequelize");
var _parseTitle = _interopRequireDefault(require("./../../shared/utils/parseTitle"));
var _models = require("./../models");
var _database = require("./../storage/database");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let page = parseInt(process.argv[2], 10);
page = Number.isNaN(page) ? 0 : page;
async function main() {
  let exit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  let limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;
  const work = async page => {
    console.log("Backfill document emoji from title\u2026 page ".concat(page));
    let documents = [];
    await _database.sequelize.transaction(async transaction => {
      documents = await _models.Document.unscoped().findAll({
        attributes: ["id", "urlId", "title", "template", "emoji", "text", "revisionCount", "archivedAt", "publishedAt", "collaboratorIds", "importId", "parentDocumentId", "lastModifiedById", "createdById", "templateId", "teamId", "collectionId", "createdAt", "updatedAt", "deletedAt"],
        where: {
          version: {
            [_sequelize.Op.ne]: null
          }
        },
        limit,
        offset: page * limit,
        order: [["createdAt", "ASC"]],
        paranoid: false,
        lock: _sequelize.Transaction.LOCK.UPDATE,
        transaction
      });
      for (const document of documents) {
        try {
          const {
            emoji,
            strippedTitle
          } = (0, _parseTitle.default)(document.title);
          if (emoji) {
            document.emoji = emoji;
            document.title = strippedTitle;
            if (document.changed()) {
              console.log("Migrating ".concat(document.id, "\u2026"));
              await document.save({
                silent: true,
                transaction
              });
            }
          }
        } catch (err) {
          console.error("Failed at ".concat(document.id, ":"), err);
          continue;
        }
      }
    });
    return documents.length === limit ? work(page + 1) : undefined;
  };
  await work(page);
  console.log("Backfill complete");
  if (exit) {
    process.exit(0);
  }
}

// In the test suite we import the script rather than run via node CLI
if (process.env.NODE_ENV !== "test") {
  void main(true);
}