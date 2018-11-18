import { merge$, isStream } from "./streamy";
import { resolve$, flatten } from "./streamy-helpers";

export class Component {
  constructor(constructorFn) {
    this.build = constructorFn;
  }
}

/*
* wrap vdom elements in reactive streams dependent on their children streams
* the vdom constructor function returns another constructor so we can pass down globals from the renderer to the components
*/
export const h = (tag, props, ...children) => {
  props = props ? props : {};

  return new Component(globals => {
    let version = -1;

    let constructedChildren = resolveChildren(children, globals);
    let mergedChildren$ = mergeChildren$(constructedChildren);
    // jsx usually resolves known tags as strings and unknown tags as functions
    // if it is a function it is treated as a component and will resolve it
    // props are not automatically resolved
    if (typeof tag === "function") {
      // TODO refactor component resolution
      let output = tag(props, mergedChildren$, globals);

      if (Array.isArray(output)) {
        return resolveChildren(output, globals);
      }
      if (output instanceof Component || isStream(output)) {
        return resolveChild(output, globals);
      }

      // allow simple component that receives resolved streams
      return merge$([resolve$(props), mergedChildren$.map(flatten)])
        .map(([props, children]) => output(props, children, globals))
        .map(children => resolveChildren(children, globals));
    }

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
  });
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
export function resolveChildren(children, globals) {
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
export function resolveChild(child, globals) {
  if (child instanceof Component) {
    return resolveChildren(child.build(globals), globals);
  }
  if (isStream(child)) {
    return child.map(x => resolveChildren(x, globals));
  }
  return child;
}
