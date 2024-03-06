"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FoldingHeadersPlugin = void 0;
var _prosemirrorState = require("prosemirror-state");
var _prosemirrorView = require("prosemirror-view");
var _Storage = _interopRequireDefault(require("../../utils/Storage"));
var _headingToSlug = require("../lib/headingToSlug");
var _findChildren = require("../queries/findChildren");
var _findCollapsedNodes = _interopRequireDefault(require("../queries/findCollapsedNodes"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class FoldingHeadersPlugin extends _prosemirrorState.Plugin {
  constructor(documentId) {
    const plugin = new _prosemirrorState.PluginKey("folding");
    let loaded = false;
    super({
      key: plugin,
      view: view => {
        loaded = false;
        view.dispatch(view.state.tr.setMeta("folding", {
          loaded: true
        }));
        return {};
      },
      appendTransaction: (transactions, oldState, newState) => {
        if (loaded) {
          return;
        }
        if (!transactions.some(transaction => transaction.getMeta("folding"))) {
          return;
        }
        let modified = false;
        const tr = newState.tr;
        const blocks = (0, _findChildren.findBlockNodes)(newState.doc);
        for (const block of blocks) {
          if (block.node.type.name === "heading") {
            const persistKey = (0, _headingToSlug.headingToPersistenceKey)(block.node, documentId);
            const persistedState = _Storage.default.get(persistKey);
            if (persistedState === "collapsed") {
              tr.setNodeMarkup(block.pos, undefined, {
                ...block.node.attrs,
                collapsed: true
              });
              modified = true;
            }
          }
        }
        loaded = true;
        return modified ? tr : null;
      },
      props: {
        decorations: state => {
          const {
            doc
          } = state;
          const decorations = (0, _findCollapsedNodes.default)(doc).map(block => _prosemirrorView.Decoration.node(block.pos, block.pos + block.node.nodeSize, {
            class: "folded-content"
          }));
          return _prosemirrorView.DecorationSet.create(doc, decorations);
        }
      }
    });
  }
}
exports.FoldingHeadersPlugin = FoldingHeadersPlugin;