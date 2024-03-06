"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = images;
/**
 * A turndown plugin overriding inbuilt image parsing behavior
 *
 * @param turndownService The TurndownService instance.
 */
function images(turndownService) {
  turndownService.addRule("image", {
    filter(node) {
      return node.nodeName === "IMG" && !(node !== null && node !== void 0 && node.className.includes("emoticon"));
    },
    replacement(content, node) {
      var _node$parentElement;
      if (!("className" in node)) {
        return content;
      }
      const alt = cleanAttribute(node.getAttribute("alt") || "");
      const src = cleanAttribute(node.getAttribute("src") || "");
      const title = cleanAttribute(node.getAttribute("title") || "");

      // Remove icons in issue keys as they will not resolve correctly and mess
      // up the layout.
      if (node.className === "icon" && (_node$parentElement = node.parentElement) !== null && _node$parentElement !== void 0 && _node$parentElement.className.includes("jira-issue-key")) {
        return "";
      }

      // Respect embedded Confluence image size
      let size;
      const naturalWidth = node.getAttribute("data-width");
      const naturalHeight = node.getAttribute("data-height");
      const width = node.getAttribute("width");
      if (naturalWidth && naturalHeight && width) {
        const ratio = parseInt(naturalWidth) / parseInt(width);
        size = " =".concat(width, "x").concat(parseInt(naturalHeight) / ratio);
      }
      const titlePart = title || size ? " \"".concat(title).concat(size, "\"") : "";
      return src ? "![".concat(alt, "](").concat(src).concat(titlePart, ")") : "";
    }
  });
}
function cleanAttribute(attribute) {
  return (attribute ? attribute.replace(/\n+/g, "") : "").trim();
}