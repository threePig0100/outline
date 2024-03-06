"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _yProsemirror = require("@getoutline/y-prosemirror");
var _jsdom = require("jsdom");
var _prosemirrorModel = require("prosemirror-model");
var Y = _interopRequireWildcard(require("yjs"));
var _textBetween = _interopRequireDefault(require("./../../../shared/editor/lib/textBetween"));
var _MarkdownHelper = _interopRequireDefault(require("./../../../shared/utils/MarkdownHelper"));
var _editor = require("./../../editor");
var _tracer = require("./../../logging/tracer");
var _tracing = require("./../../logging/tracing");
var _ = require("./..");
var _diff = _interopRequireDefault(require("./../../utils/diff"));
var _ProsemirrorHelper = _interopRequireDefault(require("./ProsemirrorHelper"));
var _TextHelper = _interopRequireDefault(require("./TextHelper"));
var _dec, _class;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
let DocumentHelper = exports.default = (_dec = (0, _tracing.trace)(), _dec(_class = class DocumentHelper {
  /**
   * Returns the document as JSON content. This method uses the collaborative state if available,
   * otherwise it falls back to Markdown.
   *
   * @param document The document or revision to convert
   * @returns The document content as JSON
   */
  static toJSON(document) {
    if ("state" in document && document.state) {
      const ydoc = new Y.Doc();
      Y.applyUpdate(ydoc, document.state);
      return (0, _yProsemirror.yDocToProsemirrorJSON)(ydoc, "default");
    }
    const node = _editor.parser.parse(document.text) || _prosemirrorModel.Node.fromJSON(_editor.schema, {});
    return node.toJSON();
  }

  /**
   * Returns the document as a Prosemirror Node. This method uses the collaborative state if
   * available, otherwise it falls back to Markdown.
   *
   * @param document The document or revision to convert
   * @returns The document content as a Prosemirror Node
   */
  static toProsemirror(document) {
    if ("state" in document && document.state) {
      const ydoc = new Y.Doc();
      Y.applyUpdate(ydoc, document.state);
      return _prosemirrorModel.Node.fromJSON(_editor.schema, (0, _yProsemirror.yDocToProsemirrorJSON)(ydoc, "default"));
    }
    return _editor.parser.parse(document.text) || _prosemirrorModel.Node.fromJSON(_editor.schema, {});
  }

  /**
   * Returns the document as plain text. This method uses the
   * collaborative state if available, otherwise it falls back to Markdown.
   *
   * @param document The document or revision to convert
   * @returns The document content as plain text without formatting.
   */
  static toPlainText(document) {
    const node = DocumentHelper.toProsemirror(document);
    const textSerializers = Object.fromEntries(Object.entries(_editor.schema.nodes).filter(_ref => {
      let [, node] = _ref;
      return node.spec.toPlainText;
    }).map(_ref2 => {
      let [name, node] = _ref2;
      return [name, node.spec.toPlainText];
    }));
    return (0, _textBetween.default)(node, 0, node.content.size, textSerializers);
  }

  /**
   * Returns the document as Markdown. This is a lossy conversion and should
   * only be used for export.
   *
   * @param document The document or revision to convert
   * @returns The document title and content as a Markdown string
   */
  static toMarkdown(document) {
    return _MarkdownHelper.default.toMarkdown(document);
  }

  /**
   * Returns the document as plain HTML. This is a lossy conversion and should
   * only be used for export.
   *
   * @param document The document or revision to convert
   * @param options Options for the HTML output
   * @returns The document title and content as a HTML string
   */
  static async toHTML(document, options) {
    const node = DocumentHelper.toProsemirror(document);
    let output = _ProsemirrorHelper.default.toHTML(node, {
      title: (options === null || options === void 0 ? void 0 : options.includeTitle) !== false ? document.title : undefined,
      includeStyles: options === null || options === void 0 ? void 0 : options.includeStyles,
      includeMermaid: options === null || options === void 0 ? void 0 : options.includeMermaid,
      centered: options === null || options === void 0 ? void 0 : options.centered,
      baseUrl: options === null || options === void 0 ? void 0 : options.baseUrl
    });
    (0, _tracer.addTags)({
      documentId: document.id,
      options
    });
    if (options !== null && options !== void 0 && options.signedUrls) {
      var _await$document$$get;
      const teamId = document instanceof _.Document ? document.teamId : (_await$document$$get = await document.$get("document")) === null || _await$document$$get === void 0 ? void 0 : _await$document$$get.teamId;
      if (!teamId) {
        return output;
      }
      output = await _TextHelper.default.attachmentsToSignedUrls(output, teamId, typeof options.signedUrls === "number" ? options.signedUrls : undefined);
    }
    return output;
  }

  /**
   * Parse a list of mentions contained in a document or revision
   *
   * @param document Document or Revision
   * @returns An array of mentions in passed document or revision
   */
  static parseMentions(document) {
    const node = DocumentHelper.toProsemirror(document);
    return _ProsemirrorHelper.default.parseMentions(node);
  }

  /**
   * Generates a HTML diff between documents or revisions.
   *
   * @param before The before document
   * @param after The after document
   * @param options Options passed to HTML generation
   * @returns The diff as a HTML string
   */
  static async diff(before, after) {
    let {
      signedUrls,
      ...options
    } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    (0, _tracer.addTags)({
      beforeId: before === null || before === void 0 ? void 0 : before.id,
      documentId: after.documentId,
      options
    });
    if (!before) {
      return await DocumentHelper.toHTML(after, {
        ...options,
        signedUrls
      });
    }
    const beforeHTML = await DocumentHelper.toHTML(before, options);
    const afterHTML = await DocumentHelper.toHTML(after, options);
    const beforeDOM = new _jsdom.JSDOM(beforeHTML);
    const afterDOM = new _jsdom.JSDOM(afterHTML);

    // Extract the content from the article tag and diff the HTML, we don't
    // care about the surrounding layout and stylesheets.
    let diffedContentAsHTML = (0, _diff.default)(beforeDOM.window.document.getElementsByTagName("article")[0].innerHTML, afterDOM.window.document.getElementsByTagName("article")[0].innerHTML);

    // Sign only the URLS in the diffed content
    if (signedUrls) {
      var _await$before$$get;
      const teamId = before instanceof _.Document ? before.teamId : (_await$before$$get = await before.$get("document")) === null || _await$before$$get === void 0 ? void 0 : _await$before$$get.teamId;
      if (teamId) {
        diffedContentAsHTML = await _TextHelper.default.attachmentsToSignedUrls(diffedContentAsHTML, teamId, typeof signedUrls === "number" ? signedUrls : undefined);
      }
    }

    // Inject the diffed content into the original document with styling and
    // serialize back to a string.
    const article = beforeDOM.window.document.querySelector("article");
    if (article) {
      article.innerHTML = diffedContentAsHTML;
    }
    return beforeDOM.serialize();
  }

  /**
   * Generates a compact HTML diff between documents or revisions, the
   * diff is reduced up to show only the parts of the document that changed and
   * the immediate context. Breaks in the diff are denoted with
   * "div.diff-context-break" nodes.
   *
   * @param before The before document
   * @param after The after document
   * @param options Options passed to HTML generation
   * @returns The diff as a HTML string
   */
  static async toEmailDiff(before, after, options) {
    if (!before) {
      return "";
    }
    const html = await DocumentHelper.diff(before, after, options);
    const dom = new _jsdom.JSDOM(html);
    const doc = dom.window.document;
    const containsDiffElement = node => node && node.innerHTML.includes("data-operation-index");

    // The diffing lib isn't able to catch all changes currently, e.g. changing
    // the type of a mark will result in an empty diff.
    // see: https://github.com/tnwinc/htmldiff.js/issues/10
    if (!containsDiffElement(doc.querySelector("#content"))) {
      return;
    }

    // We use querySelectorAll to get a static NodeList as we'll be modifying
    // it as we iterate, rather than getting content.childNodes.
    const contents = doc.querySelectorAll("#content > *");
    let previousNodeRemoved = false;
    let previousDiffClipped = false;
    const br = doc.createElement("div");
    br.innerHTML = "…";
    br.className = "diff-context-break";
    for (const childNode of contents) {
      var _childNode$nextElemen, _childNode$previousEl;
      // If the block node contains a diff tag then we want to keep it
      if (containsDiffElement(childNode)) {
        if (previousNodeRemoved && previousDiffClipped) {
          var _childNode$parentElem;
          (_childNode$parentElem = childNode.parentElement) === null || _childNode$parentElem === void 0 ? void 0 : _childNode$parentElem.insertBefore(br.cloneNode(true), childNode);
        }
        previousNodeRemoved = false;
        previousDiffClipped = true;

        // Special case for largetables, as this block can get very large we
        // want to clip it to only the changed rows and surrounding context.
        if (childNode.classList.contains("table-wrapper")) {
          const rows = childNode.querySelectorAll("tr");
          if (rows.length < 3) {
            continue;
          }
          let previousRowRemoved = false;
          let previousRowDiffClipped = false;
          for (const row of rows) {
            if (containsDiffElement(row)) {
              const cells = row.querySelectorAll("td");
              if (previousRowRemoved && previousRowDiffClipped) {
                var _childNode$parentElem2;
                const tr = doc.createElement("tr");
                const br = doc.createElement("td");
                br.colSpan = cells.length;
                br.innerHTML = "…";
                br.className = "diff-context-break";
                tr.appendChild(br);
                (_childNode$parentElem2 = childNode.parentElement) === null || _childNode$parentElem2 === void 0 ? void 0 : _childNode$parentElem2.insertBefore(tr, childNode);
              }
              previousRowRemoved = false;
              previousRowDiffClipped = true;
              continue;
            }
            if (containsDiffElement(row.nextElementSibling)) {
              previousRowRemoved = false;
              continue;
            }
            if (containsDiffElement(row.previousElementSibling)) {
              previousRowRemoved = false;
              continue;
            }
            previousRowRemoved = true;
            row.remove();
          }
        }
        continue;
      }

      // If the block node does not contain a diff tag and the previous
      // block node did not contain a diff tag then remove the previous.
      if (childNode.nodeName === "P" && childNode.textContent && ((_childNode$nextElemen = childNode.nextElementSibling) === null || _childNode$nextElemen === void 0 ? void 0 : _childNode$nextElemen.nodeName) === "P" && containsDiffElement(childNode.nextElementSibling)) {
        if (previousDiffClipped) {
          var _childNode$parentElem3;
          (_childNode$parentElem3 = childNode.parentElement) === null || _childNode$parentElem3 === void 0 ? void 0 : _childNode$parentElem3.insertBefore(br.cloneNode(true), childNode);
        }
        previousNodeRemoved = false;
        continue;
      }
      if (childNode.nodeName === "P" && childNode.textContent && ((_childNode$previousEl = childNode.previousElementSibling) === null || _childNode$previousEl === void 0 ? void 0 : _childNode$previousEl.nodeName) === "P" && containsDiffElement(childNode.previousElementSibling)) {
        previousNodeRemoved = false;
        continue;
      }
      previousNodeRemoved = true;
      childNode.remove();
    }
    const head = doc.querySelector("head");
    const body = doc.querySelector("body");
    return "".concat(head === null || head === void 0 ? void 0 : head.innerHTML, " ").concat(body === null || body === void 0 ? void 0 : body.innerHTML);
  }

  /**
   * Applies the given Markdown to the document, this essentially creates a
   * single change in the collaborative state that makes all the edits to get
   * to the provided Markdown.
   *
   * @param document The document to apply the changes to
   * @param text The markdown to apply
   * @param append If true appends the markdown instead of replacing existing
   * content
   * @returns The document
   */
  static applyMarkdownToDocument(document, text) {
    let append = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    document.text = append ? document.text + text : text;
    const doc = _editor.parser.parse(document.text);
    if (document.state) {
      const ydoc = new Y.Doc();
      Y.applyUpdate(ydoc, document.state);
      const type = ydoc.get("default", Y.XmlFragment);
      if (!type.doc) {
        throw new Error("type.doc not found");
      }

      // apply new document to existing ydoc
      (0, _yProsemirror.updateYFragment)(type.doc, type, doc, new Map());
      const state = Y.encodeStateAsUpdate(ydoc);
      const node = (0, _yProsemirror.yDocToProsemirror)(_editor.schema, ydoc);
      document.content = node.toJSON();
      document.state = Buffer.from(state);
      document.changed("state", true);
    } else if (doc) {
      document.content = doc.toJSON();
    }
    return document;
  }
}) || _class);