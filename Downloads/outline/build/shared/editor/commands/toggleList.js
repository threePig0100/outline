"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toggleList;
var _prosemirrorSchemaList = require("prosemirror-schema-list");
var _chainTransactions = _interopRequireDefault(require("../lib/chainTransactions"));
var _findParentNode = require("../queries/findParentNode");
var _isList = _interopRequireDefault(require("../queries/isList"));
var _clearNodes = _interopRequireDefault(require("./clearNodes"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function toggleList(listType, itemType) {
  return (state, dispatch) => {
    const {
      schema,
      selection
    } = state;
    const {
      $from,
      $to
    } = selection;
    const range = $from.blockRange($to);
    const {
      tr
    } = state;
    if (!range) {
      return false;
    }
    const parentList = (0, _findParentNode.findParentNode)(node => (0, _isList.default)(node, schema))(selection);
    if (range.depth >= 1 && parentList && range.depth - parentList.depth <= 1) {
      if (parentList.node.type === listType) {
        return (0, _prosemirrorSchemaList.liftListItem)(itemType)(state, dispatch);
      }
      if ((0, _isList.default)(parentList.node, schema) && listType.validContent(parentList.node.content)) {
        tr.setNodeMarkup(parentList.pos, listType);
        if (dispatch) {
          dispatch(tr);
        }
        return false;
      }
    }
    const canWrapInList = (0, _prosemirrorSchemaList.wrapInList)(listType)(state);
    if (canWrapInList) {
      return (0, _prosemirrorSchemaList.wrapInList)(listType)(state, dispatch);
    }
    return (0, _chainTransactions.default)((0, _clearNodes.default)(), (0, _prosemirrorSchemaList.wrapInList)(listType))(state, dispatch);
  };
}