import deepEqual from 'deep-equal';
import odiff from 'odiff';
import {merge$, stream} from './streamy';
import {Queue} from './queue';
import {processLargeArrayAsync, iterateAsync} from './array-utils';

const DOM_EVENT_LISTENERS = [
	'onchange', 'onclick', 'onmouseover', 'onmouseout', 'onkeydown', 'onload',
    'ondblclick'
];

// TODO custom rendering for classes and styles

export function createElement(tagName, properties$, children$Arr) {
    let elem = document.createElement(tagName);
    manageProperties(elem, properties$)
    manageChildren(elem, children$Arr);
    return elem;
}

// IDEA add request animation frame and only update when animating
function manageChildren(parentElem, children$Arr) {
	let changeQueue = Queue([]);
	// array to store the actual count of elements in one virtual elem
	// one virtual elem can produce a list of elems so we can't rely on the index only
	children$Arr.map((child$, index) => {
		if (child$.IS_CHANGE_STREAM) {
			child$.map(changes => {
				if (changes.length > 0) {
					changeQueue.add(() => applyChanges(index, changes, parentElem));
				}
			});
		} else {
			let oldChilds = [];
			let oldChild = null;
			child$.map(child => {
				let changes;
				// streams can return arrays of children
				if (Array.isArray(child)) {
					changes = odiff(oldChilds, child);
					oldChilds = child;
				} else {
					if (oldChild == null && child == null) return;

					changes = [{
						index: 0,
						type: oldChild != null && child == null ? 'rm' 
							: oldChild == null && child != null ? 'add' 
							: 'set',
						elems: [child]
					}];
					oldChild = child;
				}
				changeQueue.add(() => applyChanges(index, changes, parentElem));
			});
		}
	});
}

function applyChanges(index, changes, parentElem) {
	changes.forEach(({ index:subIndex, elems, type, num }) => {
		updateDOMforChild(elems, index, subIndex, type, num, parentElem);
	});
}

function updateDOMforChild(children, index, subIndex, type, num, parentElem) {
	if (type === 'rm') {
		for(let times = 0; times<num; times++) {
			let node = parentElem.childNodes[index];
			if (node != null) {
				parentElem.removeChild(node);
			}
		}
		return;
	} else {
		if (children == null 
			|| (children.length != null && (typeof children[0] === 'string' || typeof children[0] === 'number'))) {
			children = [document.createTextNode(children)];
		}
	}

	let visibleIndex = index + (subIndex != null ? subIndex : 0);
	switch (type) {
		case 'add':
			performAdd(children, parentElem, visibleIndex);
			break;
		case 'set':
			performSet(children[0], parentElem, visibleIndex);
			break;
	}
	return;
}

function performAdd(children, parentElem, index) {
	let isManyChildrenToAdd = children.length > 10;
	let formerParent = parentElem.parentElement;
	requestAnimationFrame(() => {
		if (isManyChildrenToAdd) {
			// add rest of children to document fragment to speed up rendering
			var frag = document.createDocumentFragment();
			frag.appendChild(parentElem);
			// remove elemens that will be overwritten
			for(let times = 0; times < children.length; times++) {
				let existingElem = parentElem.childNodes[index];
				existingElem && parentElem.removeChild(existingElem);
			}
		}
		// get right border element and insert one after another before this element
		// index is now on position of insertion as we removed the element from this position before
		let elementAtPosition = parentElem.childNodes[index];
		children.forEach(child => {
			if (elementAtPosition == null) {
				parentElem.appendChild(child);
			} else {
				parentElem.insertBefore(child, elementAtPosition);
			}
		});
		if (formerParent && isManyChildrenToAdd) {
			formerParent.appendChild(parentElem);
		}
	})
}


function performSet(child, parentElem, index) {
	let elementAtPosition = parentElem.childNodes[index];
	let nextElement = elementAtPosition ? elementAtPosition.nextSibling : null;
	if (child == null) {
		if (elementAtPosition != null) {
			parentElem.removeChild(elementAtPosition);
		}
		return;
	}
	if (elementAtPosition == null) {
		parentElem.appendChild(child)
	} else {
		parentElem.removeChild(elementAtPosition);
		if (nextElement == null) {
			parentElem.appendChild(child)
		} else {
			nextElement.parentNode.insertBefore(child, nextElement);
		}
	}
}

function manageProperties(elem, properties$) {
    properties$.map(properties => {
        if (!properties) return;
        Object.getOwnPropertyNames(properties).map(property => {
            let value = properties[property];
            // check if event
            if (DOM_EVENT_LISTENERS.indexOf(property) !== -1) {
                // we can't pass the function as a property
                // so we bind to the event
                let eventName = property.substr(2);
                elem.removeEventListener(eventName, value);
                elem.addEventListener(eventName, value);
            } else if (property === 'class') {
                elem.className = value;
            } else if (property === 'style') {
                Object.assign(elem.style, value);
            } else {
                elem.setAttribute(property, value);
            }
        });
    });
}