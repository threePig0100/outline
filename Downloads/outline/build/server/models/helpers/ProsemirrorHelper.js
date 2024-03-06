"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _yProsemirror = require("@getoutline/y-prosemirror");
var _jsdom = require("jsdom");
var _prosemirrorModel = require("prosemirror-model");
var React = _interopRequireWildcard(require("react"));
var _server = require("react-dom/server");
var _styledComponents = _interopRequireWildcard(require("styled-components"));
var Y = _interopRequireWildcard(require("yjs"));
var _Styles = _interopRequireDefault(require("./../../../shared/editor/components/Styles"));
var _embeds = _interopRequireDefault(require("./../../../shared/editor/embeds"));
var _globals = _interopRequireDefault(require("./../../../shared/styles/globals"));
var _theme = _interopRequireDefault(require("./../../../shared/styles/theme"));
var _rtl = require("./../../../shared/utils/rtl");
var _editor = require("./../../editor");
var _Logger = _interopRequireDefault(require("./../../logging/Logger"));
var _tracing = require("./../../logging/tracing");
var _dec, _class, _templateObject;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }
let ProsemirrorHelper = exports.default = (_dec = (0, _tracing.trace)(), _dec(_class = class ProsemirrorHelper {
  /**
   * Returns the input text as a Y.Doc.
   *
   * @param markdown The text to parse
   * @returns The content as a Y.Doc.
   */
  static toYDoc(markdown) {
    let fieldName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "default";
    let node = _editor.parser.parse(markdown);

    // in the editor embeds are created at runtime by converting links into
    // embeds where they match.Because we're converting to a CRDT structure on
    //  the server we need to mimic this behavior.
    function urlsToEmbeds(node) {
      if (node.type.name === "paragraph") {
        // @ts-expect-error content
        for (const textNode of node.content.content) {
          for (const embed of _embeds.default) {
            if (textNode.text && textNode.marks.some(m => m.type.name === "link" && m.attrs.href === textNode.text) && embed.matcher(textNode.text)) {
              return _editor.schema.nodes.embed.createAndFill({
                href: textNode.text
              });
            }
          }
        }
      }
      if (node.content) {
        const contentAsArray = node.content instanceof _prosemirrorModel.Fragment ?
        // @ts-expect-error content
        node.content.content : node.content;
        // @ts-expect-error content
        node.content = _prosemirrorModel.Fragment.fromArray(contentAsArray.map(urlsToEmbeds));
      }
      return node;
    }
    if (node) {
      node = urlsToEmbeds(node);
    }
    return node ? (0, _yProsemirror.prosemirrorToYDoc)(node, fieldName) : new Y.Doc();
  }

  /**
   * Returns the input Y.Doc encoded as a YJS state update.
   *
   * @param ydoc The Y.Doc to encode
   * @returns The content as a YJS state update
   */
  static toState(ydoc) {
    return Buffer.from(Y.encodeStateAsUpdate(ydoc));
  }

  /**
   * Converts a plain object into a Prosemirror Node.
   *
   * @param data The object to parse
   * @returns The content as a Prosemirror Node
   */
  static toProsemirror(data) {
    return _prosemirrorModel.Node.fromJSON(_editor.schema, data);
  }

  /**
   * Returns an array of attributes of all mentions in the node.
   *
   * @param node The node to parse mentions from
   * @returns An array of mention attributes
   */
  static parseMentions(node) {
    const mentions = [];
    node.descendants(node => {
      if (node.type.name === "mention" && !mentions.some(m => m.id === node.attrs.id)) {
        mentions.push(node.attrs);
        return false;
      }
      if (!node.content.size) {
        return false;
      }
      return true;
    });
    return mentions;
  }

  /**
   * Returns the node as HTML. This is a lossy conversion and should only be used
   * for export.
   *
   * @param node The node to convert to HTML
   * @param options Options for the HTML output
   * @returns The content as a HTML string
   */
  static toHTML(node, options) {
    const sheet = new _styledComponents.ServerStyleSheet();
    let html = "";
    let styleTags = "";
    const Centered = options !== null && options !== void 0 && options.centered ? _styledComponents.default.article(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n          max-width: 46em;\n          margin: 0 auto;\n          padding: 0 1em;\n        "]))) : "article";
    const rtl = (0, _rtl.isRTL)(node.textContent);
    const content = /*#__PURE__*/React.createElement("div", {
      id: "content",
      className: "ProseMirror"
    });
    const children = /*#__PURE__*/React.createElement(React.Fragment, null, (options === null || options === void 0 ? void 0 : options.title) && /*#__PURE__*/React.createElement("h1", {
      dir: rtl ? "rtl" : "ltr"
    }, options.title), (options === null || options === void 0 ? void 0 : options.includeStyles) !== false ? /*#__PURE__*/React.createElement(_Styles.default, {
      dir: rtl ? "rtl" : "ltr",
      rtl: rtl,
      staticHTML: true
    }, content) : content);

    // First render the containing document which has all the editor styles,
    // global styles, layout and title.
    try {
      html = (0, _server.renderToString)(sheet.collectStyles( /*#__PURE__*/React.createElement(_styledComponents.ThemeProvider, {
        theme: _theme.default
      }, /*#__PURE__*/React.createElement(React.Fragment, null, (options === null || options === void 0 ? void 0 : options.includeStyles) === false ? /*#__PURE__*/React.createElement("article", null, children) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_globals.default, {
        staticHTML: true
      }), /*#__PURE__*/React.createElement(Centered, null, children))))));
      styleTags = sheet.getStyleTags();
    } catch (error) {
      _Logger.default.error("Failed to render styles on node HTML conversion", error);
    } finally {
      sheet.seal();
    }

    // Render the Prosemirror document using virtual DOM and serialize the
    // result to a string
    const dom = new _jsdom.JSDOM("<!DOCTYPE html>".concat((options === null || options === void 0 ? void 0 : options.includeStyles) === false ? "" : styleTags).concat(html));
    const doc = dom.window.document;
    const target = doc.getElementById("content");
    _prosemirrorModel.DOMSerializer.fromSchema(_editor.schema).serializeFragment(node.content, {
      document: doc
    },
    // @ts-expect-error incorrect library type, third argument is target node
    target);

    // Convert relative urls to absolute
    if (options !== null && options !== void 0 && options.baseUrl) {
      const elements = doc.querySelectorAll("a[href]");
      for (const el of elements) {
        if ("href" in el && el.href.startsWith("/")) {
          el.href = new URL(el.href, options.baseUrl).toString();
        }
      }
    }

    // Inject mermaidjs scripts if the document contains mermaid diagrams
    if (options !== null && options !== void 0 && options.includeMermaid) {
      const mermaidElements = dom.window.document.querySelectorAll("[data-language=\"mermaidjs\"] pre code");

      // Unwrap <pre> tags to enable Mermaid script to correctly render inner content
      for (const el of mermaidElements) {
        const parent = el.parentNode;
        if (parent) {
          while (el.firstChild) {
            parent.insertBefore(el.firstChild, el);
          }
          parent.removeChild(el);
          parent.setAttribute("class", "mermaid");
        }
      }
      const element = dom.window.document.createElement("script");
      element.setAttribute("type", "module");

      // Inject Mermaid script
      if (mermaidElements.length) {
        element.innerHTML = "\n          import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@9/dist/mermaid.esm.min.mjs';\n          mermaid.initialize({\n            startOnLoad: true,\n            fontFamily: \"inherit\",\n          });\n          window.status = \"ready\";\n        ";
      } else {
        element.innerHTML = "\n          window.status = \"ready\";\n        ";
      }
      dom.window.document.body.appendChild(element);
    }
    return dom.serialize();
  }
}) || _class);