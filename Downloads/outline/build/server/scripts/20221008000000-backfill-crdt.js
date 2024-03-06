"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = main;
require("./bootstrap");
var _yProsemirror = require("@getoutline/y-prosemirror");
var _prosemirrorModel = require("prosemirror-model");
var Y = _interopRequireWildcard(require("yjs"));
var _editor = require("./../editor");
var _models = require("./../models");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const limit = 100;
const page = 0;
const teamId = process.argv[2];
async function main() {
  let exit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  const work = async page => {
    console.log("Backfill crdt\u2026 page ".concat(page));
    if (!teamId && process.env.DEPLOYMENT === "hosted") {
      throw new Error("Team ID is required");
    }

    // Retrieve all documents within set limit.
    const documents = await _models.Document.unscoped().findAll({
      attributes: ["id", "urlId", "text", "state"],
      limit,
      offset: page * limit,
      where: {
        ...(teamId ? {
          teamId
        } : {})
      },
      order: [["createdAt", "ASC"]],
      paranoid: false
    });
    console.log(documents.length);
    for (const document of documents) {
      if (document.state || !document.text) {
        continue;
      }
      console.log("Writing CRDT for ".concat(document.id));
      const ydoc = new Y.Doc();
      const type = ydoc.get("default", Y.XmlFragment);
      const doc = _editor.parser.parse(document.text);
      if (!type.doc) {
        throw new Error("type.doc not found");
      }

      // apply new document to existing ydoc
      (0, _yProsemirror.updateYFragment)(type.doc, type, doc, new Map());
      const state = Y.encodeStateAsUpdate(ydoc);
      document.state = Buffer.from(state);
      const node = _prosemirrorModel.Node.fromJSON(_editor.schema, (0, _yProsemirror.yDocToProsemirrorJSON)(ydoc, "default"));
      const text = _editor.serializer.serialize(node, undefined);
      document.text = text;
      await document.save({
        hooks: false,
        silent: true
      });
    }
    return documents.length === limit ? work(page + 1) : undefined;
  };
  await work(page);
  if (exit) {
    console.log("Backfill complete");
    process.exit(0);
  }
}
if (process.env.NODE_ENV !== "test") {
  void main(true);
}