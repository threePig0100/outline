"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prosemirrorCommands = require("prosemirror-commands");
var _prosemirrorState = require("prosemirror-state");
var _prosemirrorTables = require("prosemirror-tables");
var _prosemirrorView = require("prosemirror-view");
var _table = require("../commands/table");
var _tables = _interopRequireDefault(require("../rules/tables"));
var _Node = _interopRequireDefault(require("./Node"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class Table extends _Node.default {
  get name() {
    return "table";
  }
  get schema() {
    return {
      content: "tr+",
      tableRole: "table",
      isolating: true,
      group: "block",
      parseDOM: [{
        tag: "table"
      }],
      toDOM() {
        return ["div", {
          class: "scrollable-wrapper table-wrapper"
        }, ["div", {
          class: "scrollable"
        }, ["table", {
          class: "rme-table"
        }, ["tbody", 0]]]];
      }
    };
  }
  get rulePlugins() {
    return [_tables.default];
  }
  commands() {
    return {
      createTable: _ref => {
        let {
          rowsCount,
          colsCount
        } = _ref;
        return (state, dispatch) => {
          if (dispatch) {
            const offset = state.tr.selection.anchor + 1;
            const nodes = (0, _table.createTable)(state, rowsCount, colsCount);
            const tr = state.tr.replaceSelectionWith(nodes).scrollIntoView();
            const resolvedPos = tr.doc.resolve(offset);
            tr.setSelection(_prosemirrorState.TextSelection.near(resolvedPos));
            dispatch(tr);
          }
          return true;
        };
      },
      setColumnAttr: _table.setColumnAttr,
      addColumnBefore: () => _prosemirrorTables.addColumnBefore,
      addColumnAfter: () => _prosemirrorTables.addColumnAfter,
      deleteColumn: () => _prosemirrorTables.deleteColumn,
      addRowAfter: _table.addRowAndMoveSelection,
      deleteRow: () => _prosemirrorTables.deleteRow,
      deleteTable: () => _prosemirrorTables.deleteTable,
      toggleHeaderColumn: () => _prosemirrorTables.toggleHeaderColumn,
      toggleHeaderRow: () => _prosemirrorTables.toggleHeaderRow,
      toggleHeaderCell: () => _prosemirrorTables.toggleHeaderCell
    };
  }
  keys() {
    return {
      Tab: (0, _prosemirrorCommands.chainCommands)((0, _prosemirrorTables.goToNextCell)(1), (0, _table.addRowAndMoveSelection)()),
      "Shift-Tab": (0, _prosemirrorTables.goToNextCell)(-1),
      Enter: (0, _table.addRowAndMoveSelection)()
    };
  }
  toMarkdown(state, node) {
    state.renderTable(node);
    state.closeBlock(node);
  }
  parseMarkdown() {
    return {
      block: "table"
    };
  }
  get plugins() {
    return [(0, _prosemirrorTables.tableEditing)(), new _prosemirrorState.Plugin({
      props: {
        decorations: state => {
          const {
            doc
          } = state;
          const decorations = [];
          let index = 0;
          doc.descendants((node, pos) => {
            if (node.type.name !== this.name) {
              return;
            }
            const elements = document.getElementsByClassName("rme-table");
            const table = elements[index];
            if (!table) {
              return;
            }
            const element = table.parentElement;
            const shadowRight = !!(element && element.scrollWidth > element.clientWidth);
            if (shadowRight) {
              decorations.push(_prosemirrorView.Decoration.widget(pos + 1, () => {
                const shadow = document.createElement("div");
                shadow.className = "scrollable-shadow right";
                return shadow;
              }, {
                key: "table-shadow-right"
              }));
            }
            index++;
          });
          return _prosemirrorView.DecorationSet.create(doc, decorations);
        }
      }
    })];
  }
}
exports.default = Table;