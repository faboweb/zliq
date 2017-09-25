import {isStream} from './streamy';

const TEXT_NODE = '#text';

export function render({vdom$}, parentElement, debounce = 10) {
	return vdom$.debounce(debounce).reduce(
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

export function diff(oldElement, tag, props, newChildren, newVersion, oldChildren, oldVersion, keyContainer) {
	let newElement = oldElement;
	let keyState;
	// for keyed elements, we recall unchanged elements
	if (props && props.id) {
		keyState = keyContainer[props.id];
	}
	if (keyState && newVersion === keyState.version) {
		if (oldElement !== keyState.element) {
			oldElement.parentElement.replaceChild(keyState.element, oldElement);
		}
		return keyState.element;
	}

	if (isTextNode(oldElement) && tag === TEXT_NODE ) {
		updateTextNode(newElement, newChildren[0]);
		return newElement;
	}

	// we do not mutate foreign cached (id) elements
	// if the node types do not differ, we reuse the old node
	let isCached = oldElement.id !== "";
	let isOwnCached = isCached && props && props.id === oldElement.id;
	if ((isCached && !isOwnCached) || nodeTypeDiffers(oldElement, tag)) {
		newElement = createNode(tag, newChildren);
		oldElement.parentElement.replaceChild(newElement, oldElement);
		oldChildren = [];
		oldVersion = -1;
	}

	diffAttributes(newElement, props);

	// save keyed elements
	if (props && props.id) {
		keyContainer[props.id] = {
			version: newVersion,
			element: newElement
		}
	}

	// text nodes have no real child-nodes, but have a string value as first child
	if (tag !== TEXT_NODE) {
		diffChildren(newElement, newChildren, oldChildren, keyContainer);
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

function unifyChildren(children) {
	return children.map(child => {
		// if there is no tag we assume it's a number or a string
		if (!isStream(child) && child.tag === undefined) {
			return {
				tag: TEXT_NODE,
				children: [child],
				version: 0,
				cycle: child.cycle || {}
			}
		} else {
			return child;
		}
	})
}

function diffChildren(element, newChildren, oldChildren, keyContainer) {
	let oldChildNodes = element.childNodes;
	let unifiedChildren = unifyChildren(newChildren);
	let unifiedOldChildren = unifyChildren(oldChildren);

	if (newChildren.length === 0 && oldChildren.length === 0) {
		return;
	}

	let i = 0;
	// diff existing nodes
	for(; i < oldChildNodes.length && i < newChildren.length; i++) {
		let oldElement = oldChildNodes[i];
		let {version: oldVersion, children: oldChildChildren} = unifiedOldChildren[i];
		let {tag, props, children, version} = unifiedChildren[i];

		diff(oldElement, tag, props, children, version, oldChildChildren, oldVersion, keyContainer);
	}
	
	// remove not needed nodes at the end
	for(let remaining = element.childNodes.length; remaining > newChildren.length; remaining--) {
		let childToRemove = element.childNodes[remaining - 1];
		element.removeChild(childToRemove);

		if (unifiedOldChildren.length < remaining) {
			console.log("ZLIQ: Something other then ZLIQ has manipulated the children of the element", element, ". This can lead to sideffects. Please check your code.");
			continue;
		} else {
			let {props} = unifiedOldChildren[remaining - 1];

			triggerLifecycle(childToRemove, props, 'removed');
		}
	}

	// add new nodes
	for(; i < newChildren.length; i++) {
		let {tag, props, children, version} = unifiedChildren[i];
		let newElement = createNode(tag, children);

		element.appendChild(newElement);
		diff(newElement, tag, props, children, version, [], -1, keyContainer);
		triggerLifecycle(newElement, props, 'mounted');
	}
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

function copyChildren(oldChildren) {
	if (oldChildren === undefined) return [];

	let newChildren = JSON.parse(JSON.stringify(oldChildren));
	newChildren.forEach((child, index) => {
		if (oldChildren[index].cycle) {
			child.cycle = oldChildren[index].cycle;
		}
		
		if (typeof oldChildren[index] === 'object') {
			child.children = copyChildren(oldChildren[index].children);
		}
	});
	return newChildren;
}

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