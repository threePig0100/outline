"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = documentCollaborativeUpdater;
var _yProsemirror = require("@getoutline/y-prosemirror");
var _uniq = _interopRequireDefault(require("lodash/uniq"));
var _prosemirrorModel = require("prosemirror-model");
var Y = _interopRequireWildcard(require("yjs"));
var _editor = require("./../editor");
var _Logger = _interopRequireDefault(require("./../logging/Logger"));
var _models = require("./../models");
var _database = require("./../storage/database");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
async function documentCollaborativeUpdater(_ref) {
  let {
    documentId,
    ydoc,
    userId,
    isLastConnection
  } = _ref;
  return _database.sequelize.transaction(async transaction => {
    const document = await _models.Document.unscoped().scope("withoutState").findOne({
      where: {
        id: documentId
      },
      transaction,
      lock: {
        of: _models.Document,
        level: transaction.LOCK.UPDATE
      },
      rejectOnEmpty: true,
      paranoid: false
    });
    const state = Y.encodeStateAsUpdate(ydoc);
    const content = (0, _yProsemirror.yDocToProsemirrorJSON)(ydoc, "default");
    const node = _prosemirrorModel.Node.fromJSON(_editor.schema, content);
    const text = _editor.serializer.serialize(node, undefined);
    const isUnchanged = document.text === text;
    const lastModifiedById = userId !== null && userId !== void 0 ? userId : document.lastModifiedById;
    if (isUnchanged) {
      return;
    }
    _Logger.default.info("multiplayer", "Persisting ".concat(documentId, ", attributed to ").concat(lastModifiedById));

    // extract collaborators from doc user data
    const pud = new Y.PermanentUserData(ydoc);
    const pudIds = Array.from(pud.clients.values());
    const collaboratorIds = (0, _uniq.default)([...document.collaboratorIds, ...pudIds]);
    await document.update({
      text,
      content,
      state: Buffer.from(state),
      lastModifiedById,
      collaboratorIds
    }, {
      transaction,
      hooks: false
    });
    await _models.Event.schedule({
      name: "documents.update",
      documentId: document.id,
      collectionId: document.collectionId,
      teamId: document.teamId,
      actorId: lastModifiedById,
      data: {
        multiplayer: true,
        title: document.title,
        done: isLastConnection
      }
    });
  });
}