"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = splitHeading;
var _prosemirrorState = require("prosemirror-state");
var _findChildren = require("../queries/findChildren");
var _findCollapsedNodes = _interopRequireDefault(require("../queries/findCollapsedNodes"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function splitHeading(type) {
  return (state, dispatch) => {
    const {
      $from,
      from,
      $to,
      to
    } = state.selection;

    // check we're in a matching heading node
    if ($from.parent.type !== type) {
      return false;
    }

    // is the selection at the beginning of the node
    const startPos = $from.before() + 1;
    if (startPos === from) {
      const collapsedNodes = (0, _findCollapsedNodes.default)(state.doc);
      const allBlocks = (0, _findChildren.findBlockNodes)(state.doc);
      const previousBlock = allBlocks.filter(a => a.pos + a.node.nodeSize < startPos).pop();
      const previousBlockIsCollapsed = !!collapsedNodes.find(a => a.pos === (previousBlock === null || previousBlock === void 0 ? void 0 : previousBlock.pos));
      if (previousBlockIsCollapsed) {
        // Insert a new heading directly before this one
        const transaction = state.tr.insert($from.before(), type.create({
          ...$from.parent.attrs,
          collapsed: false
        }));

        // Move the selection into the new heading node and make sure it's on screen
        dispatch === null || dispatch === void 0 ? void 0 : dispatch(transaction.setSelection(_prosemirrorState.TextSelection.near(transaction.doc.resolve($from.before()))).scrollIntoView());
        return true;
      }
      return false;
    }

    // If the heading isn't collapsed standard behavior applies
    if (!$from.parent.attrs.collapsed) {
      return false;
    }

    // is the selection at the end of the node. If not standard node-splitting
    // behavior applies
    const endPos = $to.after() - 1;
    if (endPos === to) {
      // Find the next visible block after this one. It takes into account nested
      // collapsed headings and reaching the end of the document
      const collapsedNodes = (0, _findCollapsedNodes.default)(state.doc);
      const allBlocks = (0, _findChildren.findBlockNodes)(state.doc);
      const visibleBlocks = allBlocks.filter(a => !collapsedNodes.find(b => b.pos === a.pos));
      const nextVisibleBlock = visibleBlocks.find(a => a.pos > from);
      const pos = nextVisibleBlock ? nextVisibleBlock.pos : state.doc.content.size;

      // Insert a new heading directly before the next visible block
      const transaction = state.tr.insert(pos, type.create({
        ...$from.parent.attrs,
        collapsed: false
      }));

      // Move the selection into the new heading node and make sure it's on screen
      dispatch === null || dispatch === void 0 ? void 0 : dispatch(transaction.setSelection(_prosemirrorState.TextSelection.near(transaction.doc.resolve(Math.min(pos + 1, transaction.doc.content.size)))).scrollIntoView());
      return true;
    }
    return false;
  };
}