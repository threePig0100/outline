"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _invariant = _interopRequireDefault(require("invariant"));
var _sequelize = require("sequelize");
var _errors = require("./../errors");
var _tracing = require("./../logging/tracing");
var _models = require("./../models");
var _pinDestroyer = _interopRequireDefault(require("./pinDestroyer"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
async function documentMover(_ref) {
  let {
    user,
    document,
    collectionId = null,
    parentDocumentId = null,
    // convert undefined to null so parentId comparison treats them as equal
    index,
    ip,
    transaction
  } = _ref;
  const collectionChanged = collectionId !== document.collectionId;
  const previousCollectionId = document.collectionId;
  const result = {
    collections: [],
    documents: [],
    collectionChanged
  };
  if (document.template && !collectionChanged) {
    return result;
  }
  if (document.template) {
    if (!document.collectionId) {
      throw (0, _errors.ValidationError)("Templates must be in a collection");
    }
    document.collectionId = collectionId;
    document.parentDocumentId = null;
    document.lastModifiedById = user.id;
    document.updatedBy = user;
    await document.save({
      transaction
    });
    result.documents.push(document);
  } else {
    // Load the current and the next collection upfront and lock them
    const collection = await _models.Collection.findByPk(document.collectionId, {
      transaction,
      lock: _sequelize.Transaction.LOCK.UPDATE,
      paranoid: false
    });
    let newCollection = collection;
    if (collectionChanged) {
      if (collectionId) {
        newCollection = await _models.Collection.findByPk(collectionId, {
          transaction,
          lock: _sequelize.Transaction.LOCK.UPDATE
        });
      } else {
        newCollection = null;
      }
    }
    if (document.publishedAt) {
      // Remove the document from the current collection
      const response = await (collection === null || collection === void 0 ? void 0 : collection.removeDocumentInStructure(document, {
        transaction,
        save: collectionChanged
      }));
      let documentJson = response === null || response === void 0 ? void 0 : response[0];
      const fromIndex = (response === null || response === void 0 ? void 0 : response[1]) || 0;
      if (!documentJson) {
        documentJson = await document.toNavigationNode({
          transaction
        });
      }

      // if we're reordering from within the same parent
      // the original and destination collection are the same,
      // so when the initial item is removed above, the list will reduce by 1.
      // We need to compensate for this when reordering
      const toIndex = index !== undefined && document.parentDocumentId === parentDocumentId && document.collectionId === collectionId && fromIndex < index ? index - 1 : index;

      // Update the properties on the document record, this must be done after
      // the toIndex is calculated above
      document.collectionId = collectionId;
      document.parentDocumentId = parentDocumentId;
      document.lastModifiedById = user.id;
      document.updatedBy = user;
      if (newCollection) {
        // Add the document and it's tree to the new collection
        await newCollection.addDocumentToStructure(document, toIndex, {
          documentJson,
          transaction
        });
      }
    } else {
      document.collectionId = collectionId;
      document.parentDocumentId = parentDocumentId;
      document.lastModifiedById = user.id;
      document.updatedBy = user;
    }
    if (collection && document.publishedAt) {
      result.collections.push(collection);
    }

    // If the collection has changed then we also need to update the properties
    // on all of the documents children to reflect the new collectionId
    if (collectionChanged) {
      // Efficiently find the ID's of all the documents that are children of
      // the moved document and update in one query
      const childDocumentIds = await document.findAllChildDocumentIds();
      if (collectionId) {
        // Reload the collection to get relationship data
        newCollection = await _models.Collection.scope({
          method: ["withMembership", user.id]
        }).findByPk(collectionId, {
          transaction
        });
        (0, _invariant.default)(newCollection, "Collection not found");
        result.collections.push(newCollection);
        await _models.Document.update({
          collectionId: newCollection.id
        }, {
          transaction,
          where: {
            id: childDocumentIds
          }
        });
      } else {
        // document will be moved to drafts
        document.publishedAt = null;

        // point children's parent to moved document's parent
        await _models.Document.update({
          parentDocumentId: document.parentDocumentId
        }, {
          transaction,
          where: {
            id: childDocumentIds
          }
        });
      }

      // We must reload from the database to get the relationship data
      const documents = await _models.Document.findAll({
        where: {
          id: childDocumentIds
        },
        transaction
      });
      document.collection = newCollection;
      result.documents.push(...documents.map(document => {
        if (newCollection) {
          document.collection = newCollection;
        }
        return document;
      }));

      // If the document was pinned to the collection then we also need to
      // automatically remove the pin to prevent a confusing situation where
      // a document is pinned from another collection. Use the command to ensure
      // the correct events are emitted.
      const pin = await _models.Pin.findOne({
        where: {
          documentId: document.id,
          collectionId: previousCollectionId
        },
        transaction,
        lock: _sequelize.Transaction.LOCK.UPDATE
      });
      if (pin) {
        await (0, _pinDestroyer.default)({
          user,
          pin,
          ip,
          transaction
        });
      }
    }
  }
  await document.save({
    transaction
  });
  result.documents.push(document);

  // If there are any sourced permissions for this document, we need to go to the source
  // permission and recalculate
  const [documentPermissions, parentDocumentPermissions] = await Promise.all([_models.UserMembership.findRootMembershipsForDocument(document.id, undefined, {
    transaction
  }), parentDocumentId ? _models.UserMembership.findRootMembershipsForDocument(parentDocumentId, undefined, {
    transaction
  }) : []]);
  await recalculatePermissions(documentPermissions, transaction);
  await recalculatePermissions(parentDocumentPermissions, transaction);
  await _models.Event.create({
    name: "documents.move",
    actorId: user.id,
    documentId: document.id,
    collectionId,
    teamId: document.teamId,
    data: {
      title: document.title,
      collectionIds: result.collections.map(c => c.id),
      documentIds: result.documents.map(d => d.id)
    },
    ip
  }, {
    transaction
  });

  // we need to send all updated models back to the client
  return result;
}
async function recalculatePermissions(permissions, transaction) {
  for (const permission of permissions) {
    await _models.UserMembership.createSourcedMemberships(permission, {
      transaction
    });
  }
}
var _default = exports.default = (0, _tracing.traceFunction)({
  spanName: "documentMover"
})(documentMover);