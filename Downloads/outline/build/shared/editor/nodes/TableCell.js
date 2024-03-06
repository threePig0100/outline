"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prosemirrorState = require("prosemirror-state");
var _prosemirrorView = require("prosemirror-view");
var _table = require("../commands/table");
var _table2 = require("../queries/table");
var _Node = _interopRequireDefault(require("./Node"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class TableCell extends _Node.default {
  get name() {
    return "td";
  }
  get schema() {
    return {
      content: "(paragraph | embed)+",
      tableRole: "cell",
      isolating: true,
      parseDOM: [{
        tag: "td"
      }],
      toDOM(node) {
        return ["td", node.attrs.alignment ? {
          style: "text-align: ".concat(node.attrs.alignment)
        } : {}, 0];
      },
      attrs: {
        colspan: {
          default: 1
        },
        rowspan: {
          default: 1
        },
        alignment: {
          default: null
        }
      }
    };
  }
  toMarkdown() {
    // see: renderTable
  }
  parseMarkdown() {
    return {
      block: "td",
      getAttrs: tok => ({
        alignment: tok.info
      })
    };
  }
  get plugins() {
    return [new _prosemirrorState.Plugin({
      props: {
        decorations: state => {
          const {
            doc
          } = state;
          const decorations = [];
          const cells = (0, _table2.getCellsInColumn)(0)(state);
          if (cells) {
            cells.forEach((pos, index) => {
              if (index === 0) {
                decorations.push(_prosemirrorView.Decoration.widget(pos + 1, () => {
                  let className = "grip-table";
                  const selected = (0, _table2.isTableSelected)(state);
                  if (selected) {
                    className += " selected";
                  }
                  const grip = document.createElement("a");
                  grip.className = className;
                  grip.addEventListener("mousedown", event => {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    this.editor.view.dispatch((0, _table.selectTable)(state));
                  });
                  return grip;
                }));
              }
              decorations.push(_prosemirrorView.Decoration.widget(pos + 1, () => {
                const rowSelected = (0, _table2.isRowSelected)(index)(state);
                let className = "grip-row";
                if (rowSelected) {
                  className += " selected";
                }
                if (index === 0) {
                  className += " first";
                }
                if (index === cells.length - 1) {
                  className += " last";
                }
                const grip = document.createElement("a");
                grip.className = className;
                grip.addEventListener("mousedown", event => {
                  event.preventDefault();
                  event.stopImmediatePropagation();
                  this.editor.view.dispatch((0, _table.selectRow)(index, event.metaKey || event.shiftKey)(state));
                });
                return grip;
              }));
            });
          }
          return _prosemirrorView.DecorationSet.create(doc, decorations);
        }
      }
    })];
  }
}
exports.default = TableCell;