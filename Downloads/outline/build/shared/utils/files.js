"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bytesToHumanReadable = bytesToHumanReadable;
exports.getDataTransferFiles = getDataTransferFiles;
exports.getDataTransferItems = getDataTransferItems;
exports.getEventFiles = getEventFiles;
/**
 * Converts bytes to human readable string for display
 *
 * @param bytes filesize in bytes
 * @returns Human readable filesize as a string
 */
function bytesToHumanReadable(bytes) {
  var _out$;
  if (!bytes) {
    return "0 Bytes";
  }
  const out = ("0".repeat(bytes.toString().length * 2 % 3) + bytes).match(/.{3}/g);
  if (!out || bytes < 1000) {
    return bytes + " Bytes";
  }
  const f = ((_out$ = out[1]) !== null && _out$ !== void 0 ? _out$ : "").substring(0, 2);
  return "".concat(Number(out[0])).concat(f === "00" ? "" : ".".concat(f), " ").concat("  kMGTPEZY"[out.length], "B");
}

/**
 * Get an array of File objects from a drag event
 *
 * @param event The react or native drag event
 * @returns An array of Files
 */
function getDataTransferFiles(event) {
  const dt = event.dataTransfer;
  if (dt) {
    if ("files" in dt && dt.files.length) {
      return dt.files ? Array.prototype.slice.call(dt.files) : [];
    }
    if ("items" in dt && dt.items.length) {
      return dt.items ? Array.prototype.slice.call(dt.items).filter(dt => dt.kind !== "string").map(dt => dt.getAsFile()).filter(Boolean) : [];
    }
  }
  return [];
}

/**
 * Get an array of DataTransferItems from a drag event
 *
 * @param event The react or native drag event
 * @returns An array of DataTransferItems
 */
function getDataTransferItems(event) {
  const dt = event.dataTransfer;
  if (dt) {
    if ("items" in dt && dt.items.length) {
      return dt.items ? Array.prototype.slice.call(dt.items) : [];
    }
  }
  return [];
}

/**
 * Get an array of Files from an input event
 *
 * @param event The react or native input event
 * @returns An array of Files
 */
function getEventFiles(event) {
  return event.target && "files" in event.target ? Array.prototype.slice.call(event.target.files) : [];
}