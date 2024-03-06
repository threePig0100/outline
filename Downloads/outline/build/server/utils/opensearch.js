"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.opensearchResponse = void 0;
const opensearchResponse = baseUrl => "\n<OpenSearchDescription xmlns=\"http://a9.com/-/spec/opensearch/1.1/\" xmlns:moz=\"http://www.mozilla.org/2006/browser/search/\">\n  <ShortName>Outline</ShortName>\n  <Description>Search Outline</Description>\n  <InputEncoding>UTF-8</InputEncoding>\n  <Image width=\"16\" height=\"16\" type=\"image/x-icon\">".concat(baseUrl, "/images/favicon-16.png</Image>\n  <Url type=\"text/html\" method=\"get\" template=\"").concat(baseUrl, "/search/{searchTerms}?ref=opensearch\"/>\n  <moz:SearchForm>").concat(baseUrl, "/search</moz:SearchForm>\n</OpenSearchDescription>\n");
exports.opensearchResponse = opensearchResponse;