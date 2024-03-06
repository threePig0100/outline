"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = chainTransactions;
function chainTransactions() {
  for (var _len = arguments.length, commands = new Array(_len), _key = 0; _key < _len; _key++) {
    commands[_key] = arguments[_key];
  }
  return (state, dispatch) => {
    const dispatcher = tr => {
      state = state.apply(tr);
      dispatch === null || dispatch === void 0 ? void 0 : dispatch(tr);
    };
    const last = commands.pop();
    const reduced = commands.reduce((result, command) => result || command(state, dispatcher), false);
    return reduced && last !== undefined && last(state, dispatch);
  };
}