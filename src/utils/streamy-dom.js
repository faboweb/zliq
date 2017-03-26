import odiff from 'odiff';
import {merge$, stream} from './streamy';
import {PromiseQueue} from './promise-queue';

// js DOM events. add which ones you need
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
	let changeQueue = PromiseQueue([]);
	// array to store the actual count of elements in one virtual elem
	// one virtual elem can produce a list of elems so we can't rely on the index only
	children$Arr.map((child$, index) => {
		if (child$.IS_CHANGE_STREAM) {
			child$.map(changes => {
				changes.forEach(({ index:subIndex, elems, type, num }) => {
					changeQueue.add(() => updateDOMforChild(elems, index, subIndex, type, num, parentElem));
				});
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
				changes.forEach(({ index:subIndex, elems, type, num }) => {
					changeQueue.add(() => updateDOMforChild(elems, index, subIndex, type, num, parentElem));
				});
			});
		}
	});
}

function updateDOMforChild(children, index, subIndex, type, num, parentElem) {
	// console.log('performing update on DOM', children, index, subIndex, type, num, parentElem);
	if (type === 'rm') {
		for(let times = 0; times<num; times++) {
			let node = parentElem.childNodes[index];
			if (node != null) {
				parentElem.removeChild(node);
			}
		}
		return Promise.resolve();
	} else {
		if (children == null 
			|| (children.length != null && (typeof children[0] === 'string' || typeof children[0] === 'number'))) {
			children = [document.createTextNode(children)];
		}
	}

	if (type === 'add') {
		let visibleIndex = index + (subIndex != null ? subIndex : 0);
		return performAdd(children, parentElem, visibleIndex);
	}

	if (type === 'set') {
		performSet(children, index, subIndex, parentElem);
		return Promise.resolve();
	}
}

function performAdd(children, parentElem, index) {
	return new Promise((resolve, reject) => {
		function addElement() {
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
			resolve();
		}

		// only request an animation frame for inserts of many elements
		// let the browser handle querying of insertion of single elements
		if (children.length > 5) {
			requestAnimationFrame(addElement);
		} else {
			addElement();
		}
	});
}


function performSet(children, index, subIndexArr, parentElem) {
	return new Promise((resolve, reject) => {
		if (!Array.isArray(children)) {
			children = [children];
		}
		if (!Array.isArray(subIndexArr)) {
			subIndexArr = [subIndexArr];
		}
		function setElement() {
			children.forEach((child, childIndex) => {
				let subIndex = subIndexArr[childIndex];
				let visibleIndex = index + (subIndex != null ? subIndex : 0);
				let elementAtPosition = parentElem.childNodes[visibleIndex];
				if (elementAtPosition == null) {
					parentElem.appendChild(child);
				} else {
					parentElem.replaceChild(child, elementAtPosition);
				}
			});
			resolve();
		}

		// only request an animation frame for inserts of many elements
		// let the browser handle querying of insertion of single elements
		if (children.length > 5) {
			requestAnimationFrame(setElement);
		} else {
			setElement();
		}
	});
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
            } else if (property === 'class' || property.toLowerCase() === 'classname') {
                elem.className = value;
            } else if (property === 'style') {
                Object.assign(elem.style, value);
            } else {
                elem.setAttribute(property, value);
            }
        });
    });
}