"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = documentDuplicator;
var _sequelize = require("sequelize");
var _documentCreator = _interopRequireDefault(require("./documentCreator"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
async function documentDuplicator(_ref) {
  let {
    user,
    document,
    collection,
    parentDocumentId,
    title,
    publish,
    recursive,
    transaction,
    ip
  } = _ref;
  const newDocuments = [];
  const sharedProperties = {
    user,
    collectionId: collection === null || collection === void 0 ? void 0 : collection.id,
    publish: publish !== null && publish !== void 0 ? publish : !!document.publishedAt,
    ip,
    transaction
  };
  const duplicated = await (0, _documentCreator.default)({
    parentDocumentId: parentDocumentId !== null && parentDocumentId !== void 0 ? parentDocumentId : document.parentDocumentId,
    emoji: document.emoji,
    template: document.template,
    title: title !== null && title !== void 0 ? title : document.title,
    text: document.text,
    ...sharedProperties
  });
  duplicated.collection = collection;
  newDocuments.push(duplicated);
  async function duplicateChildDocuments(original, duplicated) {
    const childDocuments = await original.findChildDocuments({
      archivedAt: original.archivedAt ? {
        [_sequelize.Op.ne]: null
      } : {
        [_sequelize.Op.eq]: null
      }
    }, {
      transaction
    });
    for (const childDocument of childDocuments) {
      const duplicatedChildDocument = await (0, _documentCreator.default)({
        parentDocumentId: duplicated.id,
        emoji: childDocument.emoji,
        title: childDocument.title,
        text: childDocument.text,
        ...sharedProperties
      });
      duplicatedChildDocument.collection = collection;
      newDocuments.push(duplicatedChildDocument);
      await duplicateChildDocuments(childDocument, duplicatedChildDocument);
    }
  }
  if (recursive && !document.template) {
    await duplicateChildDocuments(document, duplicated);
  }
  return newDocuments;
}