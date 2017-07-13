import {isStream} from './streamy';

const TEXT_NODE = '#text';

export function render(component, parentElement) {
	component.vdom$.reduce(({element:oldElement, version:oldVersion, children:oldChildren}, {tag, props, children, version}) => {
		if (oldElement === null) {
			oldElement = createNode(tag, children);
			parentElement.appendChild(oldElement);
		}
		diff(oldElement, tag, props, children, version, oldChildren, oldVersion);
		return {
			element: oldElement,
			version,
			children
		}
	}, {
		element: null,
		version: -1,
		children: []
	})
}

export function diff(oldElement, tag, props, newChildren, newVersion, oldChildren, oldVersion) {
	// if the dom-tree hasn't changed, don't process it
	if (newVersion === undefined && newVersion === oldVersion) {
		return oldElement;
	}
	let newElement = oldElement;

	// TODO check performance without equal check
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
	if (tag !== TEXT_NODE && newChildren && newChildren.length > 0) {
		diffChildren(newElement, newChildren, oldChildren);
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
	if (attribute === 'class' || attribute.toLowerCase() === 'classname') {
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

function cleanupAttributes(element, props) {
	if (element.props !== undefined) {
		for(let attribute in element.props) {
			if (props[attribute] === undefined) {
				element.removeAttribute(attribute);
			}
		}
	}
}

function diffChildren(element, newChildren, oldChildren) {
	let oldChildNodes = element.childNodes;
	let unifiedChildren = newChildren.map(child => {
		// if there is no tag we assume it's a number or a string
		if (!isStream(child) && child.tag === undefined) {
			return {
				tag: TEXT_NODE,
				children: [child],
				version: 1
			}
		} else {
			return child;
		}
	})
	let unifiedOldChildren = oldChildren.map(child => {
		// if there is no tag we assume it's a number or a string
		if (!isStream(child) && child.tag === undefined) {
			return {
				tag: TEXT_NODE,
				children: [child],
				version: 1
			}
		} else {
			return child;
		}
	})

	// diff existing nodes
	for(let i = 0; i < unifiedOldChildren.length && i < unifiedChildren.length; i++) {
		let oldElement = oldChildNodes[i];
		let {version: oldVersion, children: oldChildChildren} = unifiedOldChildren[i];
		let {tag, props, children, version} = unifiedChildren[i];
		diff(oldElement, tag, props, children, version, oldChildChildren, oldVersion);
	};

	// remove not needed nodes at the end
	for(let i = unifiedChildren.length; i < unifiedOldChildren.length; i++) {
		element.removeChild(element.lastChild);
	}

	// add new nodes
	for(let i = unifiedOldChildren.length; i < unifiedChildren.length; i++) {
		let {tag, props, children, version} = unifiedChildren[i];
		let newElement = createNode(tag, children);
		element.appendChild(newElement);
		diff(newElement, tag, props, children, version, [], -1);
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