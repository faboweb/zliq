import { isStream } from "./streamy";

export const TEXT_NODE = "#text";

export function diff(
  parentElement,
  oldElement,
  newChild,
  oldChild,
  cacheContainer
) {
  // if there is no element on the parent to diff against yet,
  // we create the element here to make diffing later on more uniform
  if (oldElement === null) {
    oldElement = createNode(newChild.tag, newChild.children);
    if (parentElement) {
      parentElement.appendChild(oldElement);
    }
  }

  let newElement = oldElement;
  let isCaching = newChild.props && newChild.props.id;

  try {
    // for keyed/idd elements, we recall unchanged elements
    if (isCaching) {
      newElement = diffCachedElement(
        oldElement,
        newChild,
        oldChild,
        cacheContainer
      );
    } else {
      newElement = diffElement(oldElement, newChild, oldChild, cacheContainer);
    }
  } catch (err) {
    // on errors, show an error element instead of crashing
    newElement = {
      tag: "div",
      props: {
        style: "border: 1px solid red; color: red;"
      },
      children: ["FAULTY ELEMENT"]
    };
    console.error("[ERROR]: An element failed to render.\n", err);
  }

  return newElement;
}

function diffCachedElement(
  oldElement,
  { tag, props, children, version },
  { props: oldProps },
  cacheContainer
) {
  let id = props.id;
  let gotCreated = false;
  let gotUpdated = false;

  // if there is no cache, create one
  if (cacheContainer[id] === undefined) {
    cacheContainer[id] = {
      element: document.createElement(tag),
      vdom: {
        tag,
        props: {},
        children: []
      }
    };
    gotCreated = true;
  }

  let elementCache = cacheContainer[id];

  // ignore update if version equals cache
  if (version !== elementCache.version) {
    diffAttributes(elementCache.element, props, oldProps);
    diffChildren(
      elementCache.element,
      children,
      elementCache.vdom.children,
      cacheContainer
    );

    elementCache.version = version;
    elementCache.vdom.props = props;
    elementCache.vdom.children = children;

    gotUpdated = true;
  }

  if (gotCreated) {
    triggerLifecycle(elementCache.element, props, "created");
  } else if (gotUpdated) {
    triggerLifecycle(elementCache.element, props, "updated");
  }

  // elements are updated in place, so only insert cached element if it's not already there
  if (oldElement !== elementCache.element) {
    oldElement.parentElement.replaceChild(elementCache.element, oldElement);
    triggerLifecycle(elementCache.element, props, "mounted");
  }

  return elementCache.element;
}

function diffElement(
  element,
  { tag, props, children: newChildren, version: newVersion },
  { props: oldProps, children: oldChildren, version: oldVersion },
  cacheContainer
) {
  let initialRender = oldVersion === -1 || oldVersion === undefined;

  // text nodes behave differently then normal dom elements
  if (isTextNode(element) && tag === TEXT_NODE) {
    updateTextNode(element, newChildren[0]);
    return element;
  }

  // if the node types do not differ, we reuse the old node
  // we reuse the existing node to save time rerendering it
  // we do not reuse/mutate cached (id) elements as this will mutate the cache
  if (shouldRecycleElement(element, props, tag) === false) {
    let newElement = createNode(tag, newChildren);
    element.parentElement.replaceChild(newElement, element);
    element = newElement;
    // there are no children anymore on the newly created node
    oldChildren = [];
  }

  diffAttributes(element, props, oldProps);

  // sometimes you might want to skip updates to children on renderer elements i.e. if externals handle this component
  let isolated = props && props.isolated !== undefined;

  // text nodes we don't want to handle children like with other elements
  // and for isolated components we want to skip all updates after the first render
  if (tag !== TEXT_NODE && (!isolated || initialRender)) {
    diffChildren(element, newChildren, oldChildren, cacheContainer);
  }

  if (initialRender) {
    triggerLifecycle(element, props, "created");
  }

  if (newVersion > 0) {
    triggerLifecycle(element, props, "updated");
  }

  return element;
}

// this removes nodes at the end of the children, that are not needed anymore in the current state for recycling
function removeNotNeededNodes(parentElements, newChildren, oldChildren) {
  let remaining = parentElements.childNodes.length;
  if (oldChildren.length !== remaining) {
    console.warn(
      "ZLIQ: Something other then ZLIQ has manipulated the children of the element",
      parentElements,
      ". This can lead to sideffects. Consider using the 'isolated' attribute for this element to prevent updates."
    );
  }

  for (; remaining > newChildren.length; remaining--) {
    let childToRemove = parentElements.childNodes[remaining - 1];
    parentElements.removeChild(childToRemove);

    if (oldChildren.length < remaining) {
      continue;
    } else {
      let { cycle } = oldChildren[remaining - 1];

      triggerLifecycle(childToRemove, { cycle }, "removed");
    }
  }
}

function updateExistingNodes(
  parentElement,
  newChildren,
  oldChildren,
  cacheContainer
) {
  let nodes = parentElement.childNodes;
  for (let i = 0; i < nodes.length && i < newChildren.length; i++) {
    diff(
      parentElement,
      nodes[i],
      newChildren[i],
      oldChildren[i] || {},
      cacheContainer
    );
  }
}

function addNewNodes(parentElement, newChildren, cacheContainer) {
  for (let i = parentElement.childNodes.length; i < newChildren.length; i++) {
    let { tag, props, children, version } = newChildren[i];
    let newElement = createNode(tag, children);

    parentElement.appendChild(newElement);

    diff(parentElement, newElement, newChildren[i], {}, cacheContainer);

    if (props && props.cycle && props.cycle.mounted && !props.id) {
      console.error(
        "The 'mounted' lifecycle event is only called on elements with id. As elements are updated in place, it is hard to define when a normal element is mounted."
      );
    }
  }
}

function diffAttributes(element, props, oldProps = {}) {
  if (props !== undefined) {
    Object.keys(props).map(function applyPropertyToElement(attribute) {
      applyAttribute(element, attribute, props[attribute]);
    });
    Object.keys(oldProps).map(function removeNotNeededAttributes(oldAttribute) {
      if (props[oldAttribute] === undefined) {
        element.removeAttribute(oldAttribute);
      }
    });
  }
}

function applyAttribute(element, attribute, value) {
  if (attribute === "class") {
    element.className = value || ""; // "" in the case of a class stream returning null
    // we leave the possibility to define styles as strings
    // but we allow styles to be defined as an object
  } else if (attribute === "style" && typeof value !== "string") {
    const cssText = value
      ? Object.keys(value)
          .map(key => key + ":" + value[key] + ";")
          .join(" ")
      : "";
    element.style.cssText = cssText;
    // other propertys are just added as is to the DOM
  } else {
    if (element[attribute] !== undefined) {
      if (value === null) {
        element[attribute] = undefined;
      } else {
        // element.setAttribute(attribute, value);
        element[attribute] = value;
      }
    }
    // also remove attributes on null to allow better handling of streams
    // streams don't emit on undefined
    if (value === null) {
      element[attribute] = undefined;
    } else {
      // element.setAttribute(attribute, value);
      element[attribute] = value;
    }

    // TODO handle custom attributes
  }
}

function diffChildren(
  element,
  newChildren = [],
  oldChildren = [],
  cacheContainer
) {
  if (newChildren.length === 0 && oldChildren.length === 0) {
    return;
  }

  let oldChildNodes = element.childNodes;
  let unifiedNewChildren = unifyChildren(newChildren);
  let unifiedOldChildren = unifyChildren(oldChildren);

  updateExistingNodes(
    element,
    unifiedNewChildren,
    unifiedOldChildren,
    cacheContainer
  );
  removeNotNeededNodes(element, unifiedNewChildren, oldChildren);
  addNewNodes(element, unifiedNewChildren, cacheContainer);
}

/* HELPERS */

/*
  * jsx has children mixed as vdom-elements and numbers or strings
  * to consistently treat these children similar in the code we transform those numbers and strings
  * into vdom-elements with the tag #text that have one child with their value
  */
function unifyChildren(children) {
  return children.map(child => {
    // if there is no tag we assume it's a number or a string
    if (!isStream(child) && child.tag === undefined) {
      return {
        tag: TEXT_NODE,
        children: [child],
        version: 0
      };
    } else {
      return child;
    }
  });
}

// create text_nodes from numbers or strings
// create domNodes from regular vdom descriptions
export function createNode(tag, children) {
  if (tag === TEXT_NODE) {
    return document.createTextNode(children[0]);
  } else {
    return document.createElement(tag);
  }
}

// TODO use React like effects for lifecycle events
// shorthand to call a cycle event for an element if existing
export function triggerLifecycle(element, { cycle } = {}, event) {
  if (cycle && cycle[event]) {
    cycle[event](element);
  }
}

function nodeTypeDiffers(element, tag) {
  return element.nodeName.toLowerCase() !== tag;
}

function isTextNode(element) {
  return element instanceof window.Text;
}

function updateTextNode(element, value) {
  if (element.nodeValue !== value) {
    element.nodeValue = value;
  }
}

// we want to recycle elements to save time on creating and inserting nodes into the dom
// we don't want to manipulate elements that go into the cache, because they would mutate in the cache as well
function shouldRecycleElement(oldElement, props, tag) {
  return (
    !isTextNode(oldElement) &&
    oldElement.id === "" &&
    !nodeTypeDiffers(oldElement, tag)
  );
}
