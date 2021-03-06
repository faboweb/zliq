import { isStream, stream } from "./streamy";
import { Component, resolveChild, resolveChildren } from "./streamy-vdom";
import { diff, triggerLifecycle } from "./vdom-diff";

export function render(vdom, parentElement, globals = {}, debounce = 10) {
  const vdom$ = resolveInputToStream(vdom, globals);
  const renderStartState = {
    element: null,
    version: -1,
    children: [],
    keyContainer: {}
  };

  return vdom$
    .debounce(debounce)
    .reduce(renderUpdate.bind(null, parentElement), renderStartState);
}

function renderUpdate(
  parentElement,
  // current known state
  {
    element: oldElement,
    version: oldVersion,
    children: oldChildren,
    keyContainer
  },
  // new vdom tree
  { tag, props, children, version }
) {
  try {
    let newElement = diff(
      parentElement,
      oldElement,
      { tag, props, children, version },
      { children: oldChildren, version: oldVersion },
      keyContainer
    );

    // signalise mount of root element on initial render
    if (parentElement && version === 0) {
      triggerLifecycle(oldElement, props, "mounted");
    }

    return {
      element: newElement,
      version,
      children: copyChildren(children),
      keyContainer
    };
  } catch (err) {
    console.error("Error in rendering step:", err);
  }
}

// we allow inputs to the render function to be:
// a vdom-stream
// a stream of Component
// a Component
// this function resolves the input to a vdom-stream
function resolveInputToStream(input, globals) {
  let vdom$;
  if (isStream(input)) {
    // resolve downstream components
    vdom$ = input
      .flatMap(input => {
        let resolved = resolveChild(input, globals);

        // resolvedChild can return an array of elements but we expect only one
        // TODO make this better
        if (Array.isArray(resolved)) {
          resolved = resolved[0];
        }

        // because we are flatMapping we need to return streams
        if (!isStream(resolved)) {
          return stream(resolved);
        }

        return resolved;
      })
      // a resolved input could return an array but we expect the vdom$
      // to return just one root vdom elem
      .map(x => {
        if (Array.isArray(x)) {
          x = x[0];
        }
        return x;
      });
    return vdom$;
  }

  if (input instanceof Component) {
    vdom$ = input.build(globals);
    vdom$ = resolveInputToStream(vdom$, globals);
    return vdom$;
  } else if (typeof input === "function") {
    // simple element constructor
    vdom$ = input({}, [], globals);
  }

  // reiterate if still not a vdom-stream
  if (!isStream(vdom$)) vdom$ = resolveInputToStream(vdom$, globals);

  return vdom$;
}

// to not mutate the representation of our children from the last iteration we clone them
// we copy the cycle functions for each element, as JSON parse/stringify does not work for functions
function copyChildren(oldChildren = []) {
  let newChildren = JSON.parse(JSON.stringify(oldChildren));
  newChildren.forEach((child, index) => {
    let oldChild = oldChildren[index];
    if (oldChild.props && oldChild.props.cycle) {
      child.cycle = oldChild.props.cycle;
    }

    if (typeof oldChildren[index] === "object") {
      child.children = copyChildren(oldChild.children);
    }
  });
  return newChildren;
}
