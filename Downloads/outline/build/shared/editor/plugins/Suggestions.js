"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SuggestionsMenuPlugin = void 0;
var _mobx = require("mobx");
var _prosemirrorState = require("prosemirror-state");
const MAX_MATCH = 500;
class SuggestionsMenuPlugin extends _prosemirrorState.Plugin {
  constructor(options, extensionState) {
    super({
      props: {
        handleKeyDown: (view, event) => {
          // Prosemirror input rules are not triggered on backspace, however
          // we need them to be evaluted for the filter trigger to work
          // correctly. This additional handler adds inputrules-like handling.
          if (event.key === "Backspace") {
            // timeout ensures that the delete has been handled by prosemirror
            // and any characters removed, before we evaluate the rule.
            setTimeout(() => {
              const {
                pos
              } = view.state.selection.$from;
              return this.execute(view, pos, pos, options.openRegex, (0, _mobx.action)((_, match) => {
                if (match) {
                  extensionState.open = true;
                  extensionState.query = match[1];
                } else {
                  extensionState.open = false;
                  extensionState.query = "";
                }
                return null;
              }));
            });
          }
          const {
            pos
          } = view.state.selection.$from;

          // If the query is active and we're navigating the block menu then
          // just ignore the key events in the editor itself until we're done
          if (event.key === "Enter" || event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "Tab") {
            return this.execute(view, pos, pos, options.openRegex, (state, match) =>
            // just tell Prosemirror we handled it and not to do anything
            match ? true : null);
          }
          return false;
        }
      }
    });
  }

  // based on the input rules code in Prosemirror, here:
  // https://github.com/ProseMirror/prosemirror-inputrules/blob/master/src/inputrules.js
  execute(view, from, to, regex, handler) {
    if (view.composing) {
      return false;
    }
    const state = view.state;
    const $from = state.doc.resolve(from);
    if ($from.parent.type.spec.code) {
      return false;
    }
    const textBefore = $from.parent.textBetween(Math.max(0, $from.parentOffset - MAX_MATCH), $from.parentOffset, undefined, "\ufffc");
    const match = regex.exec(textBefore);
    const tr = handler(state, match, match ? from - match[0].length : from, to);
    if (!tr) {
      return false;
    }
    return true;
  }
}
exports.SuggestionsMenuPlugin = SuggestionsMenuPlugin;