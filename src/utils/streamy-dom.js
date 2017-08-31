import {isStream} from './streamy';

const TEXT_NODE = '#text';

export function render({vdom$}, parentElement, onMounted) {
	return vdom$.reduce(
		function renderUpdate({element:oldElement, version:oldVersion, children:oldChildren}, {tag, props, children, version}) {
			if (oldElement === null) {
				oldElement = createNode(tag, children);
				if (parentElement) {
					parentElement.appendChild(oldElement);
				}
			}
			diff(oldElement, tag, props, children, version, oldChildren, oldVersion);

			// signalise mount of root element on initial render
			if (parentElement && version === 0 && onMounted) {
				onMounted(oldElement);
			}
			return {
				element: oldElement,
				version,
				children: copyChildren(children)
			}
		}, {
			element: null,
			version: -1,
			children: []
		})
}

export function diff(oldElement, tag, props, newChildren, newVersion, oldChildren, oldVersion, cycle = {}) {
	// if the dom-tree hasn't changed, don't process it
	if (newVersion === undefined && newVersion === oldVersion) {
		return oldElement;
	}
	let newElement = oldElement;

	if (oldElement instanceof window.Text && tag === TEXT_NODE && oldElement.nodeValue !== newChildren[0]) {
		oldElement.nodeValue = newChildren[0];
		return newElement;
	}

	if (oldElement.nodeName.toLowerCase() !== tag) {
		newElement = createNode(tag, newChildren);
		oldElement.parentElement.replaceChild(newElement, oldElement);
		oldChildren = [];
		oldVersion = -1;
	}

	diffAttributes(newElement, props);
	if (tag !== TEXT_NODE && !(newChildren.length === 0 && oldChildren.length === 0)) {
		diffChildren(newElement, newChildren, oldChildren);
	}
	
	if (newVersion == 0 && cycle.created) {
		cycle.created(newElement);
	}

	if (newVersion > 0 && cycle.updated) {
		cycle.updated(newElement);
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

function diffChildren(element, newChildren, oldChildren) {
	let oldChildNodes = element.childNodes;
	let unifiedChildren = unifyChildren(newChildren);
	let unifiedOldChildren = unifyChildren(oldChildren);

	let i = 0;
	// diff existing nodes
	for(; i < unifiedOldChildren.length && i < unifiedChildren.length; i++) {
		let oldElement = oldChildNodes[i];
		let {version: oldVersion, children: oldChildChildren} = unifiedOldChildren[i];
		let {tag, props, children, version, cycle} = unifiedChildren[i];

		diff(oldElement, tag, props, children, version, oldChildChildren, oldVersion, cycle);
		if(cycle.updated) {
			cycle.updated(oldElement);
		}
	}
	
	// remove not needed nodes at the end
	for(; i < unifiedOldChildren.length; i++) {
		let childToRemove = element.childNodes[i];
		let {children: oldChildChildren, cycle} = unifiedOldChildren[i];

		element.removeChild(childToRemove);
		if(cycle.removed) {
			cycle.removed(childToRemove);
		}
	}

	// add new nodes
	for(; i < unifiedChildren.length; i++) {
		let {tag, props, children, version, cycle} = unifiedChildren[i];
		let newElement = createNode(tag, children);

		element.appendChild(newElement);
		diff(newElement, tag, props, children, version, [], -1, cycle);
		if(cycle.mounted) {
			cycle.mounted(newElement);
		}
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