import {isStream} from './streamy';

const TEXT_NODE = '#text';

export function render(vdom$, parentElement) {
	return vdom$.reduce(
		function renderUpdate({
				element:oldElement,
				version:oldVersion,
				children:oldChildren,
				keyContainer
			}, {tag, props, children, version}) {
				if (oldElement === null) {
					oldElement = createNode(tag, children);
					if (parentElement) {
						parentElement.appendChild(oldElement);
					}
				}
				diff(oldElement, tag, props, children, version, oldChildren, oldVersion, keyContainer);

				// signalise mount of root element on initial render
				if (parentElement && version === 0) {
					triggerLifecycle(oldElement, props, 'mounted');
				}
				return {
					element: oldElement,
					version,
					children: copyChildren(children),
					keyContainer
				}
		}, {
			element: null,
			version: -1,
			children: [],
			keyContainer: {}
		})
}

export function diff(oldElement, tag, props, newChildren, newVersion, oldChildren, oldVersion, cacheContainer) {
	let newElement = oldElement;
	let isCaching = props && props.id;
	// for keyed elements, we recall unchanged elements
	if (isCaching) {
		newElement = diffCachedElement(oldElement, tag, props, newChildren, newVersion, oldChildren, cacheContainer);
	} else {
		newElement = diffElement(oldElement, tag, props, newChildren, newVersion, oldChildren, oldVersion, cacheContainer);
	}
	
	if (newVersion === 0) {
		triggerLifecycle(newElement, props, 'created');
	}

	if (newVersion > 0) {
		triggerLifecycle(newElement, props, 'updated');
	}

	return newElement;
}

function diffAttributes(element, props) {
	if (props !== undefined) {
		Object.getOwnPropertyNames(props).map(function applyPropertyToElement(attribute) {
			applyAttribute(element, attribute, props[attribute])
		});
		cleanupAttributes(element, props);
	}
}

function applyAttribute(element, attribute, value) {
	if (attribute === 'class' || attribute === 'className') {
		element.className = value;
	// we leave the possibility to define styles as strings
	// but we allow styles to be defined as an object
	} else if (attribute === 'style' && typeof value !== "string" ) {
		Object.assign(element.style, value);
	// other propertys are just added as is to the DOM
	} else {
		// also remove attributes on null to allow better handling of streams
		// streams don't emit on undefined
		if (value === null) {
			element[attribute] = undefined;
		} else {
			// element.setAttribute(attribute, value);
			element[attribute] = value;
		}
	}
}

// remove attributes that are not in props anymore
function cleanupAttributes(element, props) {
	if (element.props !== undefined) {
		for(let attribute in element.props) {
			if (props[attribute] === undefined) {
				element.removeAttribute(attribute);
			}
		}
	}
}

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
			}
		} else {
			return child;
		}
	})
}

function diffChildren(element, newChildren, oldChildren, cacheContainer) {
	if (newChildren.length === 0 && oldChildren.length === 0) {
		return;
	}

	let oldChildNodes = element.childNodes;
	let unifiedNewChildren = unifyChildren(newChildren);
	let unifiedOldChildren = unifyChildren(oldChildren);

	updateExistingNodes(element, unifiedNewChildren, unifiedOldChildren, cacheContainer);
	removeNotNeededNodes(element, unifiedNewChildren, oldChildren);
	addNewNodes(element, unifiedNewChildren, cacheContainer);
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

// to not mutate the representation of our children from the last iteration we clone them
// we copy the cycle functions for each element, as JSON parse/stringify does not work for functions
function copyChildren(oldChildren) {
	if (oldChildren === undefined) return [];

	let newChildren = JSON.parse(JSON.stringify(oldChildren));
	newChildren.forEach((child, index) => {
		let oldChild = oldChildren[index];
		if (oldChild.props && oldChild.props.cycle) {
			child.cycle = oldChild.props.cycle;
		}
		
		if (typeof oldChildren[index] === 'object') {
			child.children = copyChildren(oldChild.children);
		}
	});
	return newChildren;
}

// shorthand to call a cycle event for an element if existing
function triggerLifecycle(element, props, event) {
	if(props && props.cycle && props.cycle[event]) {
		props.cycle[event](element);
	}
}

function nodeTypeDiffers(element, tag) {
	return element.nodeName.toLowerCase() !== tag;
}

function isTextNode(element) {
	return element instanceof window.Text
}

function updateTextNode(element, value) {
	if (element.nodeValue !== value) {
		element.nodeValue = value;
	}
}

// we want to recycle elements to save time on creating and inserting nodes into the dom
// we don't want to manipulate elements that go into the cache, because they would mutate in the cache as well
function shouldRecycleElement(oldElement, props, tag) {
	return oldElement.id === "" && nodeTypeDiffers(oldElement, tag);
}

function diffCachedElement(oldElement, tag, props, newChildren, newVersion, oldChildren, cacheContainer) {
	let id = props.id;

	// if there is no cache, create one
	if (cacheContainer[id] === undefined) {
		cacheContainer[id] = {
			element: document.createElement(tag)
		}
	}

	let elementCache = cacheContainer[id];

	// ignore update if version equals cache
	if (newVersion !== elementCache.version) {
		diffAttributes(elementCache.element, props);
		diffChildren(elementCache.element, newChildren, oldChildren, cacheContainer);
		
		elementCache.version = newVersion;
	}

	// elements are updated in place, so only insert cached element if it's not already there
	if (oldElement !== elementCache.element) {
		oldElement.parentElement.replaceChild(elementCache.element, oldElement);
	}

	return elementCache.element;
}

function diffElement(element, tag, props, newChildren, newVersion, oldChildren, oldVersion, cacheContainer) {
	// text nodes behave differently then normal dom elements
	if (isTextNode(element) && tag === TEXT_NODE ) {
		updateTextNode(element, newChildren[0]);
		return element;
	}

	// if the node types do not differ, we reuse the old node
	// we reuse the existing node to save time rerendering it
	// we do not reuse/mutate cached (id) elements as this will mutate the cache
	if (shouldRecycleElement(element, props, tag)) {
		let newElement = createNode(tag, newChildren);
		element.parentElement.replaceChild(newElement, element);
		element = newElement;
		// there are no children anymore on the newly created node
		oldChildren = [];
	}

	diffAttributes(element, props);

	// text nodes have no real child-nodes, but have a string value as first child
	if (tag !== TEXT_NODE) {
		diffChildren(element, newChildren, oldChildren, cacheContainer);
	}
}

// this removes nodes at the end of the children, that are not needed anymore in the current state for recycling
function removeNotNeededNodes(parentElements, newChildren, oldChildren) {
	for(let remaining = parentElements.childNodes.length; remaining > newChildren.length; remaining--) {
		let childToRemove = parentElements.childNodes[remaining - 1];
		parentElements.removeChild(childToRemove);

		if (oldChildren.length < remaining) {
			console.log("ZLIQ: Something other then ZLIQ has manipulated the children of the element", parentElements, ". This can lead to sideffects. Please check your code.");
			continue;
		} else {
			let {props} = oldChildren[remaining - 1];

			triggerLifecycle(childToRemove, props, 'removed');
		}
	}
}

function updateExistingNodes(parentElement, newChildren, oldChildren, cacheContainer) {
	let nodes = parentElement.childNodes;
	for(let i = 0; i < nodes.length && i < newChildren.length; i++) {
		let oldElement = nodes[i];
		let {version: oldVersion, children: oldChildChildren} = oldChildren[i];
		let {tag, props, children, version} = newChildren[i];

		diff(oldElement, tag, props, children, version, oldChildChildren, oldVersion, cacheContainer);
	}
}

function addNewNodes(parentElement, newChildren, cacheContainer) {
	for(let i = parentElement.childNodes.length; i < newChildren.length; i++) {
		let {tag, props, children, version} = newChildren[i];
		let newElement = createNode(tag, children);

		parentElement.appendChild(newElement);
		diff(newElement, tag, props, children, version, [], -1, cacheContainer);
		triggerLifecycle(newElement, props, 'mounted');
	}
}