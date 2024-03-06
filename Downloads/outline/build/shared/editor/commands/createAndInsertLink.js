"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _sonner = require("sonner");
function findPlaceholderLink(doc, href) {
  let result;
  doc.descendants(function (node) {
    let pos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    // get text nodes
    if (node.type.name === "text") {
      // get marks for text nodes
      node.marks.forEach(mark => {
        // any of the marks links?
        if (mark.type.name === "link") {
          // any of the links to other docs?
          if (mark.attrs.href === href) {
            result = {
              node,
              pos
            };
          }
        }
      });
      return false;
    }
    if (!node.content.size) {
      return false;
    }
    return true;
  });
  return result;
}
const createAndInsertLink = async function (view, title, href, options) {
  const {
    dispatch,
    state
  } = view;
  const {
    onCreateLink
  } = options;
  try {
    const url = await onCreateLink(title, options.nested);
    const result = findPlaceholderLink(view.state.doc, href);
    if (!result) {
      return;
    }
    dispatch(view.state.tr.removeMark(result.pos, result.pos + result.node.nodeSize, state.schema.marks.link).addMark(result.pos, result.pos + result.node.nodeSize, state.schema.marks.link.create({
      href: url
    })));
  } catch (err) {
    const result = findPlaceholderLink(view.state.doc, href);
    if (!result) {
      return;
    }
    dispatch(view.state.tr.removeMark(result.pos, result.pos + result.node.nodeSize, state.schema.marks.link));
    _sonner.toast.error(options.dictionary.createLinkError);
  }
};
var _default = exports.default = createAndInsertLink;