import { isStream } from "./index.js";

var lexer = require("pug-lexer");
var parse = require("pug-parser");
var safeEval = require("safe-eval");
var { TEXT_NODE } = require("./streamy-dom.js");
var { stream, merge$ } = require("./streamy.js");
var { flatten, resolve$ } = require("./streamy-helpers.js");

export function pug(input) {
  // allow setup of components used in template by doing put({CoolButton})`CoolButton.col.s12`
  if (!Array.isArray(input)) {
    let components = input;
    return strings => {
      let renderFunc = pug(strings);
      return (props, children = [], globals = {}) =>
        renderFunc(props, children, Object.assign({}, globals, { components }));
    };
  }

  let template = trimTemplate(input.join(""));
  let ast = parse(lexer(template));

  return function renderFunc(props = {}, children = [], globals = {}) {
    try {
      let context = Object.assign({ globals }, props);
      if (!context.globals.components) {
        context.globals.components = {};
      }
      context.globals.components.children = children;

      let output = walk(ast, context);
      return output;
    } catch (err) {
      console.error("Error parsing pug template", err);
    }
  };
}

// trim whitespaces to allow indentation in code
function trimTemplate(template) {
  let whiteSpaces = template.search(/\S/) - 1;
  if (whiteSpaces > 0) {
    return template
      .split("\n")
      .map(line => line.substr(whiteSpaces))
      .join("\n");
  }
  return template;
}

function resolveCode(code, context, renderFunc = context => context) {
  let output = safeEval(code, context);
  if (isStream(output)) {
    return output.flatMap(renderFunc);
  }
  return renderFunc(output);
}

// NOTE: we need to flatten out the blocks that produce nested arrays. if not we will have a structure of {children: [[[]]]} that zliq won't handle
function walk(node, context) {
  if (node.type === "Block") {
    let output = flatten(node.nodes.map(node => walk(node, context)));
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
    return flatten(
      JSON.parse(node.obj).map((val, i) => {
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
        return flatten(
          node.block.nodes.map(node => {
            return walk(node, newContext);
          })
        );
      })
    );
  }
  if (node.type === "Code") {
    return resolveCode(node.val, context);
  }
  if (node.type === "Conditional") {
    return resolveCode(node.test, context, condition => {
      if (condition) {
        if (node.consequent) {
          return walk(node.consequent, context);
        }
      } else {
        if (node.alternate) {
          return walk(node.alternate, context);
        }
      }
    });
  }
  if (node.type === "Tag") {
    let props = node.attrs ? resolveAttributes(node.attrs, context) : {};
    let children = node.block ? [].concat(walk(node.block, context)) : [];

    let registeredComponent = context.globals.components
      ? context.globals.components[node.name]
      : false;
    if (registeredComponent) {
      if (typeof registeredComponent === "function") {
        // TODO refactor into common component resolve function
        let output = registeredComponent(props, children, context.globals);
        if (typeof output === "function") {
          if (isStream(output)) {
            return output;
          }
          if (output.IS_ELEMENT_CONSTRUCTOR) {
            return output(context.globals);
          }
          return output(props, children, context.globals);
        }
        return output;
      }
      return registeredComponent;
    }

    return merge$([resolve$(props), merge$(children).map(flatten)]).map(
      ([props, children]) => ({
        tag: node.name,
        props,
        children,
        version: 0
      })
    );
  }
}

function resolveAttributes(attrs, context) {
  return attrs.reduce((resolvedAttrs, cur) => {
    if (cur.name === "class") {
      resolvedAttrs.class =
        (resolvedAttrs.class ? resolvedAttrs.class + " " : "") +
        trim(cur.val, "'\"");
      return resolvedAttrs;
    }
    return Object.assign(resolvedAttrs, {
      [cur.name]: isVariable(cur.val)
        ? resolveCode(cur.val, context)
        : trim(cur.val, "'\"")
    });
  }, {});
}

function trim(string, charlist) {
  return (
    string
      // trim left
      .replace(new RegExp("^[" + charlist + "]+"), "")
      // trim right
      .replace(new RegExp("[" + charlist + "]+$"), "")
  );
}

function isVariable(val) {
  if (val === true) {
    return true;
  }
  if (val.startsWith("'") || val.startsWith('"')) {
    return false;
  }
  return true;
}
