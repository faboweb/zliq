// forked from https://github.com/choojs/hyperx

let VAR = 0,
  TEXT = 1,
  OPEN = 2,
  CLOSE = 3,
  ATTR = 4;
let ATTR_KEY = 5,
  ATTR_KEY_WHITESPACE = 6;
let ATTR_VALUE_WHITESPACE = 7,
  ATTR_VALUE = 8;
let ATTR_VALUE_SINGLEQUOTE = 9,
  ATTR_VALUE_DOUBLEQUOTE = 10;
let ATTR_EQ = 11,
  ATTR_BREAK = 12;
let COMMENT = 13;

module.exports = function(h, opts) {
  if (!opts) opts = {};
  let concat =
    opts.concat ||
    function(a, b) {
      return String(a) + String(b);
    };
  if (opts.attrToProp !== false) {
    h = attributeToProperty(h);
  }

  return function(strings) {
    let state = TEXT,
      token = "";
    let arglen = arguments.length;
    let parts = [];

    for (let i = 0; i < strings.length; i++) {
      if (i < arglen - 1) {
        let arg = escape(arguments[i + 1]);
        let p = parse(strings[i]);
        let xstate = state;
        if (xstate === ATTR_VALUE_DOUBLEQUOTE) xstate = ATTR_VALUE;
        if (xstate === ATTR_VALUE_SINGLEQUOTE) xstate = ATTR_VALUE;
        if (xstate === ATTR_VALUE_WHITESPACE) xstate = ATTR_VALUE;
        if (xstate === ATTR) xstate = ATTR_KEY;
        if (xstate === OPEN) {
          if (token === "/") {
            p.push([OPEN, "/", arg]);
            token = "";
          } else {
            p.push([OPEN, arg]);
          }
        } else {
          p.push([VAR, xstate, arg]);
        }
        parts.push.apply(parts, p);
      } else parts.push.apply(parts, parse(strings[i]));
    }

    let tree = [null, {}, []];
    let stack = [[tree, -1]];
    for (let i = 0; i < parts.length; i++) {
      let cur = stack[stack.length - 1][0];
      let p = parts[i],
        s = p[0];
      if (s === OPEN && /^\//.test(p[1])) {
        let ix = stack[stack.length - 1][1];
        if (stack.length > 1) {
          stack.pop();
          stack[stack.length - 1][0][2][ix] = h(
            cur[0],
            cur[1],
            cur[2].length ? cur[2] : undefined
          );
        }
      } else if (s === OPEN) {
        let c = [p[1], {}, []];
        cur[2].push(c);
        stack.push([c, cur[2].length - 1]);
      } else if (s === ATTR_KEY || (s === VAR && p[1] === ATTR_KEY)) {
        let key = "";
        let copyKey;
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_KEY) {
            key = concat(key, parts[i][1]);
          } else if (parts[i][0] === VAR && parts[i][1] === ATTR_KEY) {
            if (typeof parts[i][2] === "object" && !key) {
              for (copyKey in parts[i][2]) {
                if (parts[i][2].hasOwnProperty(copyKey) && !cur[1][copyKey]) {
                  cur[1][copyKey] = parts[i][2][copyKey];
                }
              }
            } else {
              key = concat(key, parts[i][2]);
            }
          } else break;
        }
        if (parts[i][0] === ATTR_EQ) i++;
        let j = i;
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_VALUE || parts[i][0] === ATTR_KEY) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][1]);
            else
              parts[i][1] === "" ||
                (cur[1][key] = concat(cur[1][key], parts[i][1]));
          } else if (
            parts[i][0] === VAR &&
            (parts[i][1] === ATTR_VALUE || parts[i][1] === ATTR_KEY)
          ) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][2]);
            else
              parts[i][2] === "" ||
                (cur[1][key] = concat(cur[1][key], parts[i][2]));
          } else {
            if (
              key.length &&
              !cur[1][key] &&
              i === j &&
              (parts[i][0] === CLOSE || parts[i][0] === ATTR_BREAK)
            ) {
              // https://html.spec.whatwg.org/multipage/infrastructure.html#boolean-attributes
              // empty string is falsy, not well behaved value in browser
              cur[1][key] = key.toLowerCase();
            }
            if (parts[i][0] === CLOSE) {
              i--;
            }
            break;
          }
        }
      } else if (s === ATTR_KEY) {
        cur[1][p[1]] = true;
      } else if (s === VAR && p[1] === ATTR_KEY) {
        cur[1][p[2]] = true;
      } else if (s === CLOSE) {
        if (selfClosing(cur[0]) && stack.length) {
          let ix = stack[stack.length - 1][1];
          stack.pop();
          stack[stack.length - 1][0][2][ix] = h(
            cur[0],
            cur[1],
            cur[2].length ? cur[2] : undefined
          );
        }
      } else if (s === VAR && p[1] === TEXT) {
        if (p[2] === undefined || p[2] === null) p[2] = "";
        else if (!p[2]) p[2] = concat("", p[2]);
        if (Array.isArray(p[2][0])) {
          cur[2].push.apply(cur[2], p[2]);
        } else {
          cur[2].push(p[2]);
        }
      } else if (s === TEXT) {
        cur[2].push(p[1]);
      } else if (s === ATTR_EQ || s === ATTR_BREAK) {
        // no-op
      } else {
        throw new Error("unhandled: " + s);
      }
    }

    if (tree[2].length > 1 && /^\s*$/.test(tree[2][0])) {
      tree[2].shift();
    }

    if (tree[2].length > 2 || (tree[2].length === 2 && /\S/.test(tree[2][1]))) {
      return tree[2];
    }
    if (
      Array.isArray(tree[2][0]) &&
      typeof tree[2][0][0] === "string" &&
      Array.isArray(tree[2][0][2])
    ) {
      tree[2][0] = h(tree[2][0][0], tree[2][0][1], tree[2][0][2]);
    }
    return tree[2][0];

    function parse(str) {
      let res = [];
      if (state === ATTR_VALUE_WHITESPACE) state = ATTR;
      for (let i = 0; i < str.length; i++) {
        let curChar = str.charAt(i);
        // <button>HALLO_</button>
        if (state === TEXT && curChar === "<") {
          if (token.length) res.push([TEXT, token]);
          token = "";
          state = OPEN;
          // <button_>HALLO</button_>,  ?? not <button x="y _> 2"></button ??, not // <button_></button_>
        } else if (curChar === ">" && !quot(state) && state !== COMMENT) {
          // <button_>HALLO</button_>
          if (state === OPEN && token.length) {
            res.push([OPEN, token]);
            // <button disabled_>HALLO</button>
          } else if (state === ATTR_KEY) {
            res.push([ATTR_KEY, token]);
          }
          // <button x="y _> 2">
          else if (state === ATTR_VALUE && token.length) {
            res.push([ATTR_VALUE, token]);
          }
          res.push([CLOSE]);
          token = "";
          state = TEXT;
        } else if (state === COMMENT && /-$/.test(token) && curChar === "-") {
          token = "";
          state = TEXT;
        } else if (state === OPEN && /^!--$/.test(token)) {
          token = curChar;
          state = COMMENT;
        } else if (state === TEXT || state === COMMENT) {
          token += curChar;
        } else if (state === OPEN && curChar === "/" && token.length) {
          // no-op, self closing tag without a space <br/>
        } else if (state === OPEN && /\s/.test(curChar)) {
          if (token.length) {
            res.push([OPEN, token]);
          }
          token = "";
          state = ATTR;
        } else if (state === OPEN) {
          token += curChar;
        } else if (state === ATTR && /[^\s"'=/]/.test(curChar)) {
          state = ATTR_KEY;
          token = curChar;
        } else if (state === ATTR && /\s/.test(curChar)) {
          if (token.length) res.push([ATTR_KEY, token]);
          res.push([ATTR_BREAK]);
        } else if (state === ATTR_KEY && /\s/.test(curChar)) {
          res.push([ATTR_KEY, token]);
          token = "";
          state = ATTR_KEY_WHITESPACE;
        } else if (state === ATTR_KEY && curChar === "=") {
          res.push([ATTR_KEY, token], [ATTR_EQ]);
          token = "";
          state = ATTR_VALUE_WHITESPACE;
        } else if (state === ATTR_KEY) {
          token += curChar;
        } else if (
          (state === ATTR_KEY_WHITESPACE || state === ATTR) &&
          curChar === "="
        ) {
          res.push([ATTR_EQ]);
          state = ATTR_VALUE_WHITESPACE;
        } else if (
          (state === ATTR_KEY_WHITESPACE || state === ATTR) &&
          !/\s/.test(curChar)
        ) {
          res.push([ATTR_BREAK]);
          if (/[\w-]/.test(curChar)) {
            token += curChar;
            state = ATTR_KEY;
          } else state = ATTR;
        } else if (state === ATTR_VALUE_WHITESPACE && curChar === '"') {
          state = ATTR_VALUE_DOUBLEQUOTE;
        } else if (state === ATTR_VALUE_WHITESPACE && curChar === "'") {
          state = ATTR_VALUE_SINGLEQUOTE;
        } else if (state === ATTR_VALUE_DOUBLEQUOTE && curChar === '"') {
          res.push([ATTR_VALUE, token], [ATTR_BREAK]);
          token = "";
          state = ATTR;
        } else if (state === ATTR_VALUE_SINGLEQUOTE && curChar === "'") {
          res.push([ATTR_VALUE, token], [ATTR_BREAK]);
          token = "";
          state = ATTR;
        } else if (state === ATTR_VALUE_WHITESPACE && !/\s/.test(curChar)) {
          state = ATTR_VALUE;
          i--;
        } else if (state === ATTR_VALUE && /\s/.test(curChar)) {
          res.push([ATTR_VALUE, token], [ATTR_BREAK]);
          token = "";
          state = ATTR;
        } else if (
          state === ATTR_VALUE ||
          state === ATTR_VALUE_SINGLEQUOTE ||
          state === ATTR_VALUE_DOUBLEQUOTE
        ) {
          token += curChar;
        }
      }
      if (state === TEXT && token.length) {
        res.push([TEXT, token]);
        token = "";
      } else if (state === ATTR_VALUE && token.length) {
        res.push([ATTR_VALUE, token]);
        token = "";
      } else if (state === ATTR_VALUE_DOUBLEQUOTE && token.length) {
        res.push([ATTR_VALUE, token]);
        token = "";
      } else if (state === ATTR_VALUE_SINGLEQUOTE && token.length) {
        res.push([ATTR_VALUE, token]);
        token = "";
      } else if (state === ATTR_KEY) {
        res.push([ATTR_KEY, token]);
        token = "";
      }
      return res;
    }
  };

  function strfn(x) {
    if (typeof x === "function") return x;
    else if (typeof x === "string") return x;
    else if (x && typeof x === "object") return x;
    else return concat("", x);
  }
};

function quot(state) {
  return state === ATTR_VALUE_SINGLEQUOTE || state === ATTR_VALUE_DOUBLEQUOTE;
}

let closeRE = RegExp(
  "^(" +
    [
      "area",
      "base",
      "basefont",
      "bgsound",
      "br",
      "col",
      "command",
      "embed",
      "frame",
      "hr",
      "img",
      "input",
      "isindex",
      "keygen",
      "link",
      "meta",
      "param",
      "source",
      "track",
      "wbr",
      "!--",
      // SVG TAGS
      "animate",
      "animateTransform",
      "circle",
      "cursor",
      "desc",
      "ellipse",
      "feBlend",
      "feColorMatrix",
      "feComposite",
      "feConvolveMatrix",
      "feDiffuseLighting",
      "feDisplacementMap",
      "feDistantLight",
      "feFlood",
      "feFuncA",
      "feFuncB",
      "feFuncG",
      "feFuncR",
      "feGaussianBlur",
      "feImage",
      "feMergeNode",
      "feMorphology",
      "feOffset",
      "fePointLight",
      "feSpecularLighting",
      "feSpotLight",
      "feTile",
      "feTurbulence",
      "font-face-format",
      "font-face-name",
      "font-face-uri",
      "glyph",
      "glyphRef",
      "hkern",
      "image",
      "line",
      "missing-glyph",
      "mpath",
      "path",
      "polygon",
      "polyline",
      "rect",
      "set",
      "stop",
      "tref",
      "use",
      "view",
      "vkern"
    ].join("|") +
    ")(?:[.#][a-zA-Z0-9\u007F-\uFFFF_:-]+)*$"
);
function selfClosing(tag) {
  return closeRE.test(tag);
}

// convert DOM attribute names to the property name used in js elements
function attributeToProperty(h) {
  let transform = {
    class: "className",
    for: "htmlFor",
    "http-equiv": "httpEquiv"
  };
  return function(tagName, attrs = {}, children = []) {
    for (let attr in attrs) {
      if (attr in transform) {
        attrs[transform[attr]] = attrs[attr];
        delete attrs[attr];
      }
    }
    return h(tagName, attrs, children);
  };
}

// escape potentially malicious strings
export const escape = arg => {
  if (typeof arg !== "string") return arg;
  return arg
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
};
