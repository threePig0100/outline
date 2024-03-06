"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prosemirrorCommands = require("prosemirror-commands");
var _prosemirrorState = require("prosemirror-state");
var _uuid = require("uuid");
var _collapseSelection = _interopRequireDefault(require("../commands/collapseSelection"));
var _chainTransactions = _interopRequireDefault(require("../lib/chainTransactions"));
var _isMarkActive = _interopRequireDefault(require("../queries/isMarkActive"));
var _Mark = _interopRequireDefault(require("./Mark"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class Comment extends _Mark.default {
  get name() {
    return "comment";
  }
  get schema() {
    return {
      attrs: {
        id: {},
        userId: {}
      },
      inclusive: false,
      parseDOM: [{
        tag: "span.comment-marker",
        getAttrs: dom => {
          var _this$editor, _dom$getAttribute;
          // Ignore comment markers from other documents
          const documentId = dom.getAttribute("data-document-id");
          if (documentId && documentId !== ((_this$editor = this.editor) === null || _this$editor === void 0 ? void 0 : _this$editor.props.id)) {
            return false;
          }
          return {
            id: (_dom$getAttribute = dom.getAttribute("id")) === null || _dom$getAttribute === void 0 ? void 0 : _dom$getAttribute.replace("comment-", ""),
            userId: dom.getAttribute("data-user-id")
          };
        }
      }],
      toDOM: node => {
        var _this$editor2;
        return ["span", {
          class: "comment-marker",
          id: "comment-".concat(node.attrs.id),
          "data-user-id": node.attrs.userId,
          "data-document-id": (_this$editor2 = this.editor) === null || _this$editor2 === void 0 ? void 0 : _this$editor2.props.id
        }];
      }
    };
  }
  get allowInReadOnly() {
    return true;
  }
  keys(_ref) {
    let {
      type
    } = _ref;
    return this.options.onCreateCommentMark ? {
      "Mod-Alt-m": (state, dispatch) => {
        if ((0, _isMarkActive.default)(state.schema.marks.comment)(state)) {
          return false;
        }
        (0, _chainTransactions.default)((0, _prosemirrorCommands.toggleMark)(type, {
          id: (0, _uuid.v4)(),
          userId: this.options.userId
        }), (0, _collapseSelection.default)())(state, dispatch);
        return true;
      }
    } : {};
  }
  commands(_ref2) {
    let {
      type
    } = _ref2;
    return this.options.onCreateCommentMark ? () => (state, dispatch) => {
      if ((0, _isMarkActive.default)(state.schema.marks.comment)(state)) {
        return false;
      }
      (0, _chainTransactions.default)((0, _prosemirrorCommands.toggleMark)(type, {
        id: (0, _uuid.v4)(),
        userId: this.options.userId
      }), (0, _collapseSelection.default)())(state, dispatch);
      return true;
    } : undefined;
  }
  toMarkdown() {
    return {
      open: "",
      close: "",
      mixable: true,
      expelEnclosingWhitespace: true
    };
  }
  get plugins() {
    return [new _prosemirrorState.Plugin({
      appendTransaction(transactions, oldState, newState) {
        if (!transactions.some(transaction => transaction.getMeta("uiEvent") === "paste")) {
          return;
        }

        // Record existing comment marks
        const existingComments = [];
        oldState.doc.descendants(node => {
          node.marks.forEach(mark => {
            if (mark.type.name === "comment") {
              existingComments.push(mark);
            }
          });
          return true;
        });

        // Remove comment marks that are new duplicates of existing ones. This allows us to cut
        // and paste a comment mark, but not copy and paste.
        let tr = newState.tr;
        newState.doc.descendants((node, pos) => {
          node.marks.forEach(mark => {
            if (mark.type.name === "comment" && existingComments.find(m => m.attrs.id === mark.attrs.id) && !existingComments.find(m => m === mark)) {
              tr = tr.removeMark(pos, pos + node.nodeSize, mark.type);
            }
          });
          return true;
        });
        return tr;
      },
      props: {
        handleDOMEvents: {
          mouseup: (_view, event) => {
            if (!(event.target instanceof HTMLElement)) {
              return false;
            }
            const comment = event.target.closest(".comment-marker");
            if (!comment) {
              return false;
            }
            const commentId = comment.id.replace("comment-", "");
            if (commentId) {
              var _this$options, _this$options$onClick;
              (_this$options = this.options) === null || _this$options === void 0 ? void 0 : (_this$options$onClick = _this$options.onClickCommentMark) === null || _this$options$onClick === void 0 ? void 0 : _this$options$onClick.call(_this$options, commentId);
            }
            return false;
          }
        }
      }
    })];
  }
}
exports.default = Comment;