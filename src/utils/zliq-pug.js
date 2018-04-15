import { isStream } from "./index.js";

var lexer = require("pug-lexer");
var parse = require("pug-parser");
var safeEval = require("safe-eval");
var { TEXT_NODE } = require("./streamy-dom.js");
var { stream } = require("./streamy.js");

export function pug(strings, ...values) {
  let ast = parse(lexer(strings.join("")));

  return (props = {}, children = [], globals = {}) => {
    try {
      let context = Object.assign({ globals }, props);
      let output = walk(ast, context, children);
      return output;
    } catch (err) {
      console.error("Error parsing pug template", err);
    }
  };
}

function resolveCode(code, context, renderFunc = context => context) {
  let output = safeEval(code, context);
  if (isStream(output)) {
    return output.map(renderFunc);
  }
  return renderFunc(output);
}

// NOTE: we need to flatten out the blocks that produce nested arrays. if not we will have a structure of {children: [[[]]]} that zliq won't handle
function walk(node, context, children) {
  if (node.type === "Block") {
    let output = node.nodes
      .map(node => walk(node, context, children))
      .flatten();
    // TODO sometimes returning arrays is a problem like with root level elements
    if (output.length === 1) {
      return output[0];
    }
    return output;
  }
  if (node.type === "Text") {
    return {
      tag: TEXT_NODE,
      props: {},
      children: [node.val],
      version: 0
    };
  }
  if (node.type === "Each") {
    return JSON.parse(node.obj)
      .map((val, i) => {
        let newContext = Object.assign(
          {},
          context,
          { [node.val]: val },
          node.key
            ? {
                [node.key]: i
              }
            : {}
        );
        return node.block.nodes
          .map(node => {
            return walk(node, newContext);
          })
          .flatten();
      })
      .flatten();
  }
  if (node.type === "Code") {
    return resolveCode(node.val, context);
  }
  if (node.type === "Conditional") {
    return resolveCode(node.test, context, condition => {
      if (condition) {
        if (node.consequent) {
          return walk(node.consequent, context, children);
        }
      } else {
        if (node.alternate) {
          return walk(node.alternate, context, children);
        }
      }
    });
  }
  if (node.type === "Tag") {
    if (node.name === "children") {
      return children;
    }
    return {
      tag: node.name,
      props: node.attrs
        ? node.attrs.reduce(
            (p, c) =>
              Object.assign(p, {
                [c.name]: isVariable(c.val)
                  ? resolveCode(c.val, context)
                  : c.val.trim("'\"")
              }),
            {}
          )
        : {},
      children: node.block
        ? [].concat(walk(node.block, context, children))
        : [],
      version: 0
    };
  }
}

String.prototype.trimRight = function(charlist) {
  if (charlist === undefined) charlist = "s";

  return this.replace(new RegExp("[" + charlist + "]+$"), "");
};

String.prototype.trimLeft = function(charlist) {
  if (charlist === undefined) charlist = "s";

  return this.replace(new RegExp("^[" + charlist + "]+"), "");
};

String.prototype.trim = function(charlist) {
  return this.trimLeft(charlist).trimRight(charlist);
};

Array.prototype.flatten = function() {
  return this.reduce((acc, val) => acc.concat(val), []);
};

function isVariable(val) {
  if (val.startsWith("'") || val.startsWith('"')) {
    return false;
  }
  return true;
}
