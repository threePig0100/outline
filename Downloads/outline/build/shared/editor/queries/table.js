"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCellsInColumn = getCellsInColumn;
exports.getCellsInRow = getCellsInRow;
exports.getColumnIndex = getColumnIndex;
exports.getRowIndex = getRowIndex;
exports.isColumnSelected = isColumnSelected;
exports.isRowSelected = isRowSelected;
exports.isTableSelected = isTableSelected;
var _prosemirrorTables = require("prosemirror-tables");
function getColumnIndex(state) {
  if (state.selection instanceof _prosemirrorTables.CellSelection) {
    if (state.selection.isColSelection()) {
      const rect = (0, _prosemirrorTables.selectedRect)(state);
      return rect.left;
    }
  }
  return undefined;
}
function getRowIndex(state) {
  if (state.selection instanceof _prosemirrorTables.CellSelection) {
    if (state.selection.isRowSelection()) {
      const rect = (0, _prosemirrorTables.selectedRect)(state);
      return rect.top;
    }
  }
  return undefined;
}
function getCellsInColumn(index) {
  return state => {
    if (!(0, _prosemirrorTables.isInTable)(state)) {
      return [];
    }
    const rect = (0, _prosemirrorTables.selectedRect)(state);
    const cells = [];
    for (let i = index; i < rect.map.map.length; i += rect.map.width) {
      const cell = rect.tableStart + rect.map.map[i];
      cells.push(cell);
    }
    return cells;
  };
}
function getCellsInRow(index) {
  return state => {
    if (!(0, _prosemirrorTables.isInTable)(state)) {
      return [];
    }
    const rect = (0, _prosemirrorTables.selectedRect)(state);
    const cells = [];
    for (let i = 0; i < rect.map.width; i += 1) {
      const cell = rect.tableStart + rect.map.map[index * rect.map.width + i];
      cells.push(cell);
    }
    return cells;
  };
}
function isColumnSelected(index) {
  return state => {
    if (state.selection instanceof _prosemirrorTables.CellSelection) {
      if (state.selection.isColSelection()) {
        const rect = (0, _prosemirrorTables.selectedRect)(state);
        return rect.left <= index && rect.right > index;
      }
    }
    return false;
  };
}
function isRowSelected(index) {
  return state => {
    if (state.selection instanceof _prosemirrorTables.CellSelection) {
      if (state.selection.isRowSelection()) {
        const rect = (0, _prosemirrorTables.selectedRect)(state);
        return rect.top <= index && rect.bottom > index;
      }
    }
    return false;
  };
}
function isTableSelected(state) {
  const rect = (0, _prosemirrorTables.selectedRect)(state);
  return rect.top === 0 && rect.left === 0 && rect.bottom === rect.map.height && rect.right === rect.map.width;
}