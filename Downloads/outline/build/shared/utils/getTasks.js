"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getTasks;
const CHECKBOX_REGEX = /\[(X|\s|_|-)\]\s(.*)?/gi;
function getTasks(text) {
  const matches = [...text.matchAll(CHECKBOX_REGEX)];
  const total = matches.length;
  if (!total) {
    return {
      completed: 0,
      total: 0
    };
  } else {
    const notCompleted = matches.reduce((accumulator, match) => match[1] === " " ? accumulator + 1 : accumulator, 0);
    return {
      completed: total - notCompleted,
      total
    };
  }
}