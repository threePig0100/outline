"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mention;
var _token = _interopRequireDefault(require("markdown-it/lib/token"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function renderMention(tokens, idx) {
  const id = tokens[idx].attrGet("id");
  const mType = tokens[idx].attrGet("type");
  const mId = tokens[idx].attrGet("modelId");
  const label = tokens[idx].content;
  return "<span id=\"".concat(id, "\" class=\"mention\" data-type=\"").concat(mType, "\" data-id=\"").concat(mId, "\">").concat(label, "</span>");
}
function parseMentions(state) {
  const hrefRE = /^mention:\/\/([a-z0-9-]+)\/([a-z]+)\/([a-z0-9-]+)$/;
  for (let i = 0; i < state.tokens.length; i++) {
    const tok = state.tokens[i];
    if (!(tok.type === "inline" && tok.children)) {
      continue;
    }
    const canChunkComposeMentionToken = chunk => {
      var _openToken$attrs;
      // no group of tokens of size less than 4 can compose a mention token
      if (chunk.length < 4) {
        return false;
      }
      const [precToken, openToken, textToken, closeToken] = chunk;

      // check for the valid order of tokens required to compose a mention token
      if (!(precToken.type === "text" && precToken.content && precToken.content.endsWith("@") && openToken.type === "link_open" && textToken.content && closeToken.type === "link_close")) {
        return false;
      }

      // "link_open" token should have valid href
      const attr = (_openToken$attrs = openToken.attrs) === null || _openToken$attrs === void 0 ? void 0 : _openToken$attrs[0];
      if (!(attr && attr[0] === "href" && hrefRE.test(attr[1]))) {
        return false;
      }

      // can probably compose a mention token if arrived here
      return true;
    };
    const chunkWithMentionToken = chunk => {
      const [precToken, openToken, textToken] = chunk;

      // remove "@" from preceding token
      precToken.content = precToken.content.slice(0, -1);

      // href must be present, otherwise the hrefRE test in canChunkComposeMentionToken would've failed
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const href = openToken.attrs[0][1];
      const matches = href.match(hrefRE);
      const [id, mType, mId] = matches.slice(1);
      const mentionToken = new _token.default("mention", "", 0);
      mentionToken.attrSet("id", id);
      mentionToken.attrSet("type", mType);
      mentionToken.attrSet("modelId", mId);
      mentionToken.content = textToken.content;

      // "link_open", followed by "text" and "link_close" tokens are coalesced
      // into "mention" token, hence removed
      return [precToken, mentionToken];
    };
    let newChildren = [];
    let j = 0;
    while (j < tok.children.length) {
      // attempt to grab next four tokens that could potentially construct a mention token
      const chunk = tok.children.slice(j, j + 4);
      if (canChunkComposeMentionToken(chunk)) {
        newChildren = newChildren.concat(chunkWithMentionToken(chunk));
        // skip by 4 since mention token for this group of tokens has been composed
        // and the group cannot compose mention tokens any further
        j += 4;
      } else {
        // push the tokens which do not participate in composing a mention token as it is
        newChildren.push(tok.children[j]);
        j++;
      }
    }
    state.tokens[i].children = newChildren;
  }
}
function mention(md) {
  md.renderer.rules.mention = renderMention;
  md.core.ruler.after("inline", "mention", parseMentions);
}