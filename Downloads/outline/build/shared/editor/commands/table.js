"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addRowAndMoveSelection = addRowAndMoveSelection;
exports.createTable = createTable;
exports.selectColumn = selectColumn;
exports.selectRow = selectRow;
exports.selectTable = selectTable;
exports.setColumnAttr = setColumnAttr;
var _prosemirrorState = require("prosemirror-state");
var _prosemirrorTables = require("prosemirror-tables");
var _table = require("../queries/table");
function createTable(state, rowsCount, colsCount) {
  let withHeaderRow = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  let cellContent = arguments.length > 4 ? arguments[4] : undefined;
  const types = (0, _prosemirrorTables.tableNodeTypes)(state.schema);
  const headerCells = [];
  const cells = [];
  const rows = [];
  const createCell = (cellType, cellContent) => cellContent ? cellType.createChecked(null, cellContent) : cellType.createAndFill();
  for (let index = 0; index < colsCount; index += 1) {
    const cell = createCell(types.cell, cellContent);
    if (cell) {
      cells.push(cell);
    }
    if (withHeaderRow) {
      const headerCell = createCell(types.header_cell, cellContent);
      if (headerCell) {
        headerCells.push(headerCell);
      }
    }
  }
  for (let index = 0; index < rowsCount; index += 1) {
    rows.push(types.row.createChecked(null, withHeaderRow && index === 0 ? headerCells : cells));
  }
  return types.table.createChecked(null, rows);
}
function addRowAndMoveSelection() {
  let {
    index
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (state, dispatch, view) => {
    if (!(0, _prosemirrorTables.isInTable)(state)) {
      return false;
    }
    const rect = (0, _prosemirrorTables.selectedRect)(state);
    const cells = (0, _table.getCellsInColumn)(0)(state);

    // If the cursor is at the beginning of the first column then insert row
    // above instead of below.
    if (rect.left === 0 && view !== null && view !== void 0 && view.endOfTextblock("backward", state)) {
      const indexBefore = index !== undefined ? index - 1 : rect.top;
      dispatch === null || dispatch === void 0 ? void 0 : dispatch((0, _prosemirrorTables.addRow)(state.tr, rect, indexBefore));
      return true;
    }
    const indexAfter = index !== undefined ? index + 1 : rect.bottom;
    const tr = (0, _prosemirrorTables.addRow)(state.tr, rect, indexAfter);

    // Special case when adding row to the end of the table as the calculated
    // rect does not include the row that we just added.
    if (indexAfter !== rect.map.height) {
      const pos = cells[Math.min(cells.length - 1, indexAfter)];
      const $pos = tr.doc.resolve(pos);
      dispatch === null || dispatch === void 0 ? void 0 : dispatch(tr.setSelection(_prosemirrorState.TextSelection.near($pos)));
    } else {
      const $pos = tr.doc.resolve(rect.tableStart + rect.table.nodeSize);
      dispatch === null || dispatch === void 0 ? void 0 : dispatch(tr.setSelection(_prosemirrorState.TextSelection.near($pos)));
    }
    return true;
  };
}
function setColumnAttr(_ref) {
  let {
    index,
    alignment
  } = _ref;
  return (state, dispatch) => {
    if (dispatch) {
      const cells = (0, _table.getCellsInColumn)(index)(state) || [];
      let transaction = state.tr;
      cells.forEach(pos => {
        transaction = transaction.setNodeMarkup(pos, undefined, {
          alignment
        });
      });
      dispatch(transaction);
    }
    return true;
  };
}
function selectRow(index) {
  let expand = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return state => {
    const rect = (0, _prosemirrorTables.selectedRect)(state);
    const pos = rect.map.positionAt(index, 0, rect.table);
    const $pos = state.doc.resolve(rect.tableStart + pos);
    const rowSelection = expand && state.selection instanceof _prosemirrorTables.CellSelection ? _prosemirrorTables.CellSelection.rowSelection(state.selection.$anchorCell, $pos) : _prosemirrorTables.CellSelection.rowSelection($pos);
    return state.tr.setSelection(rowSelection);
  };
}
function selectColumn(index) {
  let expand = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return state => {
    const rect = (0, _prosemirrorTables.selectedRect)(state);
    const pos = rect.map.positionAt(0, index, rect.table);
    const $pos = state.doc.resolve(rect.tableStart + pos);
    const colSelection = expand && state.selection instanceof _prosemirrorTables.CellSelection ? _prosemirrorTables.CellSelection.colSelection(state.selection.$anchorCell, $pos) : _prosemirrorTables.CellSelection.colSelection($pos);
    return state.tr.setSelection(colSelection);
  };
}
function selectTable(state) {
  const rect = (0, _prosemirrorTables.selectedRect)(state);
  const map = rect.map.map;
  const $anchor = state.doc.resolve(rect.tableStart + map[0]);
  const $head = state.doc.resolve(rect.tableStart + map[map.length - 1]);
  const tableSelection = new _prosemirrorTables.CellSelection($anchor, $head);
  return state.tr.setSelection(tableSelection);
}