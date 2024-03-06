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
class TableHeadCell extends _Node.default {
  get name() {
    return "th";
  }
  get schema() {
    return {
      content: "(paragraph | embed)+",
      tableRole: "header_cell",
      isolating: true,
      parseDOM: [{
        tag: "th"
      }],
      toDOM(node) {
        return ["th", node.attrs.alignment ? {
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
      block: "th",
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
          const cells = (0, _table2.getCellsInRow)(0)(state);
          if (cells) {
            cells.forEach((pos, index) => {
              decorations.push(_prosemirrorView.Decoration.widget(pos + 1, () => {
                const colSelected = (0, _table2.isColumnSelected)(index)(state);
                let className = "grip-column";
                if (colSelected) {
                  className += " selected";
                }
                if (index === 0) {
                  className += " first";
                } else if (index === cells.length - 1) {
                  className += " last";
                }
                const grip = document.createElement("a");
                grip.className = className;
                grip.addEventListener("mousedown", event => {
                  event.preventDefault();
                  event.stopImmediatePropagation();
                  this.editor.view.dispatch((0, _table.selectColumn)(index, event.metaKey || event.shiftKey)(state));
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
exports.default = TableHeadCell;