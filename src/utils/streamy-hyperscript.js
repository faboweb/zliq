import { merge$, isStream } from "./streamy";
import { resolve$, flatten } from "./streamy-helpers";

/*
* wrap hyperscript elements in reactive streams dependent on their children streams
* the hyperscript function returns a constructor so we can pass down globals from the renderer to the components
*/
export const h = (hyperscriptTag, props, ...children) => {
  props = props ? props : {};

  let elementConstructor = globals => {
    let version = -1;

    let constructedChildren = resolveChildren(children, globals);
    let mergedChildren$ = mergeChildren$(constructedChildren);
    // jsx usually resolves known tags as strings and unknown tags as functions
    // if it is a function it is treated as a component and will resolve it
    // props are not automatically resolved
    if (typeof hyperscriptTag === "function") {
      // TODO refactor component resolution
      let output = hyperscriptTag(props, mergedChildren$, globals);

      if (Array.isArray(output)) {
        return resolveChildren(output, globals);
      }
      if (output.IS_ELEMENT_CONSTRUCTOR || isStream(output)) {
        return resolveChild(output, globals);
      }

      // allow simple component that receives resolved streams
      return merge$([resolve$(props), mergedChildren$.map(flatten)])
        .map(([props, children]) => output(props, children, globals))
        .map(children => resolveChildren(children, globals));
    }

    let { tag, classes, id } = resolveTag(hyperscriptTag);
    props = mergeHyperscript(props, id, classes);

    return merge$([resolve$(props), mergedChildren$.map(flatten)]).map(
      ([props, children]) => {
        return {
          tag,
          props,
          children,
          version: ++version
        };
      }
    );
  };
  elementConstructor.IS_ELEMENT_CONSTRUCTOR = true;

  return elementConstructor;
};

/*
* wrap all children in streams and merge those
* we make sure that all children streams are flat arrays to make processing uniform
* input: [stream]
* output: stream([])
*/
function mergeChildren$(children) {
  if (!Array.isArray(children)) {
    children = [children];
  }
  children = flatten(children).filter(_ => _ !== null);
  let childrenVdom$arr = children.map(child => {
    if (isStream(child)) {
      return child.flatMap(mergeChildren$);
    }
    return child;
  });

  return merge$(childrenVdom$arr);
}

/*
* children can be nested arrays, nested streams and element contstructors
* this function unifies them into the format [string|number|vdom|stream<string|number|vdom>]
*/
function resolveChildren(children, globals) {
  if (!Array.isArray(children)) {
    children = [].concat(children);
  }
  let resolvedChilden = children.map(child => {
    if (Array.isArray(child)) {
      return resolveChildren(child, globals);
    }
    return resolveChild(child, globals);
  });
  return flatten(resolvedChilden);
}

/*
* resolve the element constructor, also for elements nested in streams
* returns the format string|number|vdom|stream<string|number|vdom>
*/
function resolveChild(child, globals) {
  if (typeof child !== "function") {
    return child;
  }
  if (child.IS_ELEMENT_CONSTRUCTOR) {
    return child(globals);
  }
  if (isStream(child)) {
    return child.map(x => resolveChildren(x, globals));
  }
}

/*
* extract tag classes and ids from a hyperscript selector ala div.class#id
*/
export function resolveTag(hyperscriptTag) {
  let id;
  let classes = [];
  let tag;
  while (hyperscriptTag.length > 0) {
    let end = indexOfRegex(hyperscriptTag.substr(1), /[\.#]/); // ignore first
    end = end === -1 ? hyperscriptTag.length : end + 1; // add the first position to the length again we ignored one row above
    if (hyperscriptTag.startsWith(".")) {
      classes.push(hyperscriptTag.slice(1, end));
    } else if (hyperscriptTag.startsWith("#")) {
      if (id)
        throw Error("You have set two ids in the selector " + hyperscriptTag);
      id = hyperscriptTag.slice(1, end);
    } else {
      tag = hyperscriptTag.slice(0, end);
    }
    hyperscriptTag = hyperscriptTag.slice(end);
  }

  return { id, classes, tag: tag || "div" };
}

// add id and classes extracted from hyperscript to the properties
function mergeHyperscript(props, id, classes) {
  if (!id && !classes) return props;
  props = props ? props : {};

  // add id
  if (props.id && id)
    throw Error(`You defined two ids [${props.id},${id}] on one element.`);
  if (id) props.id = id;

  // add classes
  if (classes.length > 0) {
    if (props.class)
      props.class = merge$([props.class, classes.join(" ")]).map(classResults =>
        classResults.join(" ")
      );
    else props.class = classes.join(" ");
  }

  return props;
}

// find first position of a regex in a string
function indexOfRegex(string, regex) {
  var match = string.match(regex);
  return match ? string.indexOf(match[0]) : -1;
}
