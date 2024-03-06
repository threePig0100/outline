"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prosemirrorState = require("prosemirror-state");
var _files = require("../../utils/files");
var _insertFiles = _interopRequireDefault(require("../commands/insertFiles"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const uploadPlugin = options => new _prosemirrorState.Plugin({
  props: {
    handleDOMEvents: {
      paste(view, event) {
        if (view.props.editable && !view.props.editable(view.state) || !options.uploadFile) {
          return false;
        }
        if (!event.clipboardData) {
          return false;
        }

        // check if we actually pasted any files
        const files = Array.prototype.slice.call(event.clipboardData.items).filter(dt => dt.kind !== "string").map(dt => dt.getAsFile()).filter(Boolean);
        if (files.length === 0) {
          return false;
        }

        // When copying from Microsoft Office product the clipboard contains
        // an image version of the content, check if there is also text and
        // use that instead in this scenario.
        const html = event.clipboardData.getData("text/html");

        // Fallback to default paste behavior if the clipboard contains HTML
        // Even if there is an image, it's likely to be a screenshot from eg
        // Microsoft Suite / Apple Numbers – and not the original content.
        if (html.length && !html.includes("<img")) {
          return false;
        }
        const {
          tr
        } = view.state;
        if (!tr.selection.empty) {
          tr.deleteSelection();
        }
        const pos = tr.selection.from;
        void (0, _insertFiles.default)(view, event, pos, files, options);
        return true;
      },
      drop(view, event) {
        if (view.props.editable && !view.props.editable(view.state) || !options.uploadFile) {
          return false;
        }

        // filter to only include image files
        const files = (0, _files.getDataTransferFiles)(event);
        if (files.length === 0) {
          return false;
        }

        // grab the position in the document for the cursor
        const result = view.posAtCoords({
          left: event.clientX,
          top: event.clientY
        });
        if (result) {
          void (0, _insertFiles.default)(view, event, result.pos, files, options);
          return true;
        }
        return false;
      }
    }
  }
});
var _default = exports.default = uploadPlugin;