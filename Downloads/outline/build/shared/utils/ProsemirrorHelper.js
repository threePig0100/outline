"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _headingToSlug = _interopRequireDefault(require("../editor/lib/headingToSlug"));
var _textBetween = _interopRequireDefault(require("../editor/lib/textBetween"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class ProsemirrorHelper {
  /**
   * Returns the node as plain text.
   *
   * @param node The node to convert.
   * @param schema The schema to use.
   * @returns The document content as plain text without formatting.
   */
  static toPlainText(node, schema) {
    const textSerializers = Object.fromEntries(Object.entries(schema.nodes).filter(_ref => {
      let [, node] = _ref;
      return node.spec.toPlainText;
    }).map(_ref2 => {
      let [name, node] = _ref2;
      return [name, node.spec.toPlainText];
    }));
    return (0, _textBetween.default)(node, 0, node.content.size, textSerializers);
  }

  /**
   * Removes any empty paragraphs from the beginning and end of the document.
   *
   * @returns True if the editor is empty
   */
  static trim(doc) {
    const {
      schema
    } = doc.type;
    let index = 0,
      start = 0,
      end = doc.nodeSize - 2,
      isEmpty;
    if (doc.childCount <= 1) {
      return doc;
    }
    isEmpty = true;
    while (isEmpty) {
      const node = doc.maybeChild(index++);
      if (!node) {
        break;
      }
      isEmpty = ProsemirrorHelper.toPlainText(node, schema).trim() === "";
      if (isEmpty) {
        start += node.nodeSize;
      }
    }
    index = doc.childCount - 1;
    isEmpty = true;
    while (isEmpty) {
      const node = doc.maybeChild(index--);
      if (!node) {
        break;
      }
      isEmpty = ProsemirrorHelper.toPlainText(node, schema).trim() === "";
      if (isEmpty) {
        end -= node.nodeSize;
      }
    }
    return doc.cut(start, end);
  }

  /**
   * Returns true if the trimmed content of the passed document is an empty string.
   *
   * @returns True if the editor is empty
   */
  static isEmpty(doc) {
    return !doc || doc.textContent.trim() === "";
  }

  /**
   * Iterates through the document to find all of the comments that exist as marks.
   *
   * @param doc Prosemirror document node
   * @returns Array<CommentMark>
   */
  static getComments(doc) {
    const comments = [];
    doc.descendants(node => {
      node.marks.forEach(mark => {
        if (mark.type.name === "comment") {
          comments.push({
            ...mark.attrs,
            text: node.textContent
          });
        }
      });
      return true;
    });
    return comments;
  }

  /**
   * Iterates through the document to find all of the tasks and their completion state.
   *
   * @param doc Prosemirror document node
   * @returns Array<Task>
   */
  static getTasks(doc) {
    const tasks = [];
    doc.descendants(node => {
      if (!node.isBlock) {
        return false;
      }
      if (node.type.name === "checkbox_list") {
        node.content.forEach(listItem => {
          let text = "";
          listItem.forEach(contentNode => {
            if (contentNode.type.name === "paragraph") {
              text += contentNode.textContent;
            }
          });
          tasks.push({
            text,
            completed: listItem.attrs.checked
          });
        });
      }
      return true;
    });
    return tasks;
  }

  /**
   * Iterates through the document to find all of the headings and their level.
   *
   * @param doc Prosemirror document node
   * @returns Array<Heading>
   */
  static getHeadings(doc) {
    const headings = [];
    const previouslySeen = {};
    doc.forEach(node => {
      if (node.type.name === "heading") {
        // calculate the optimal id
        const id = (0, _headingToSlug.default)(node);
        let name = id;

        // check if we've already used it, and if so how many times?
        // Make the new id based on that number ensuring that we have
        // unique ID's even when headings are identical
        if (previouslySeen[id] > 0) {
          name = (0, _headingToSlug.default)(node, previouslySeen[id]);
        }

        // record that we've seen this id for the next loop
        previouslySeen[id] = previouslySeen[id] !== undefined ? previouslySeen[id] + 1 : 1;
        headings.push({
          title: node.textContent,
          level: node.attrs.level,
          id: name
        });
      }
    });
    return headings;
  }
}
exports.default = ProsemirrorHelper;