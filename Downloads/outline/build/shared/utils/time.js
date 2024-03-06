"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Second = exports.Minute = exports.Hour = exports.Day = void 0;
/** A second in ms */
const Second = exports.Second = 1000;

/** A minute in ms */
const Minute = exports.Minute = 60 * Second;

/** An hour in ms */
const Hour = exports.Hour = 60 * Minute;

/** A day in ms */
const Day = exports.Day = 24 * Hour;