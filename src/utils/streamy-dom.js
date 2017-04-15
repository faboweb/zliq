import {merge$, stream} from './streamy';
import {PromiseQueue} from './promise-queue';

export const UPDATE_EVENT = {
	PENDING: 'update_pending',
	DONE: 'update_done',
	PARTIAL: 'update_partial'
}

// js DOM events. add which ones you need
const DOM_EVENT_LISTENERS = [
	'onchange', 'onclick', 'onmouseover', 'onmouseout', 'onkeydown', 'onload',
    'ondblclick'
];

const BATCH_CHILD_CHANGE_TRASHHOLD = 5;

/*
* Entry point for the streamy-dom
* creates a DOM element attaches handler for property changes and child changes and returns it immediatly
* this way we already pass around the actual dom element
*/
export function createElement(tagName, properties$, children$Arr) {
    let elem = document.createElement(tagName);
    manageProperties(elem, properties$)
    manageChildren(elem, children$Arr);
    return elem;
}

// reacts to property changes and applies these changes to the dom element
function manageProperties(elem, properties$) {
    properties$.map(properties => {
        if (!properties) return;
        Object.getOwnPropertyNames(properties).map(property => {
            let value = properties[property];
            // check if event
            if (DOM_EVENT_LISTENERS.indexOf(property) !== -1) {
                // we can't pass the function as a property
                // so we bind to the event

				// property event binder start with 'on' but events not so we need to strip that
                let eventName = property.substr(2);
                elem.removeEventListener(eventName, value);
                elem.addEventListener(eventName, value);
            } else if (property === 'class' || property.toLowerCase() === 'classname') {
                elem.className = value;
			// we leave the possibility to define styles as strings
			// but we allow styles to be defined as an object
            } else if (property === 'style' && typeof value !== "string" ) {
                Object.assign(elem.style, value);
			// other propertys are just added as is to the DOM
            } else {
                elem.setAttribute(property, value);
            }
        });
    });
}

// manage changes in the childrens (not deep changes, those are handled by the children)
function manageChildren(parentElem, children$Arr) {
	let changeQueue = PromiseQueue([]);
	
	// hook into every child stream for changes
	// children can be arrays and are always treated like such
	// changes are then performed on the parent
	children$Arr.map((child$, index) => {
		child$.reduce((oldChildArr, childArr) => {
			// the default childArr will be [null]
			let changes = calcChanges(childArr, oldChildArr);

			if (changes.length === 0) {
				return childArr;
			}
			// apply the changes
			Promise.all(
				changes.map(({indexes, type, num, elems}) => {
					return updateDOMforChild(elems, index, indexes, type, num, parentElem)
				})
			)
				// after changes are done notify listeners
				.then(() => {
					notifyParent(parentElem, UPDATE_EVENT.DONE);
				})

			return childArr;
		}, []);
	});
}

// very simple change detection
// if the children objects are not the same, they changed
// if there was an element before and there is no one know it got removed 
function calcChanges(childArr, oldChildArr) {
	let subIndex = 0;
	let changes = [];

	if (oldChildArr.length === 0 && childArr.length === 0) {
		return [];
	}

	for (; subIndex < childArr.length; subIndex++) {
		let oldChild = oldChildArr[subIndex];
		let newChild = childArr[subIndex];
		if (oldChild === newChild) {
			continue;
		};
		let type = oldChild != null && newChild == null ? 'rm' 
				: oldChild == null && newChild != null ? 'add' 
				: 'set';

		// aggregate consecutive changes of the similar type to perform batch operations
		let lastChange = changes.length > 0 ? changes[changes.length - 1] : null;
		// if there was a similiar change we add this change to the last change
		if (lastChange && lastChange.type === type) {
			if (type == 'rm') {
				// we just count the positions
				lastChange.num++;
			} else {
				// for add and set operations we need the exact index of the child and the child element to insert
				lastChange.indexes.push(subIndex);
				lastChange.elems.push(newChild);
			}
		} else {
			// if we couldn't aggregate we push a new change
			changes.push({
				indexes: [subIndex],
				elems: [newChild],
				num: 1,
				type
			})
		}
	}
	// all elements that are not in the new list got deleted
	if (subIndex < oldChildArr.length) {
		changes.push({
			indexes: [subIndex],
			num: oldChildArr.length - subIndex,
			type: 'rm'
		})
	}

	return changes;
}

// list of operations
// remove all the elements starting from a certain index
function removeElements(index, subIndexes, children, parentElem, resolve) {
	for(let times = 0; times<num; times++) {
		let node = parentElem.childNodes[index];
		if (node != null) {
			parentElem.removeChild(node);
		}
	}
	resolve();
}
// replace elements with new ones
function setElements(index, subIndexes, children, parentElem, resolve) {
	children.forEach((child, childIndex) => {
		let actualIndex = index + subIndexes[childIndex];
		let elementAtPosition = parentElem.childNodes[actualIndex];
		parentElem.replaceChild(child, elementAtPosition);
	});
	resolve();
};
// add elements at a certain index
function addElements(index, subIndexes, children, parentElem, resolve) {
	// get right neighbor element and insert one after another before this element
	// index is now on position of insertion as we removed the element from this position before
	let elementAtPosition = parentElem.childNodes[index + subIndexes[0]];
	children.forEach(child => {
		if (elementAtPosition == null) {
			parentElem.appendChild(child);
		} else {
			parentElem.insertBefore(child, elementAtPosition);
		}
	});
	resolve();
}

// perform the actual manipulation on the parentElem
function updateDOMforChild(children, index, subIndexes, type, num, parentElem) {
	// make sure children are document nodes as we insert them into the DOM
	let nodeChildren = makeChildrenNodes(children);

	// choose witch change to perform
	let operation;
	switch (type) {
		case 'add': operation = addElements;
			break;
		case 'set': operation = setElements;
			break;
		case 'rm': operation = removeElements;
			break;
		default:
			return Promise.reject('Trying to perform a change with unknown change-type:', type);
	}
	
	// to minor changes directly but bundle long langes with many elements into one animationFrame to speed things update_done
	// if we do this for every change, this slows things down as we have to wait for the animationframe
	return new Promise((resolve, reject) => {
		if (nodeChildren && nodeChildren.length > BATCH_CHILD_CHANGE_TRASHHOLD) {
			requestAnimationFrame(operation.bind(this, index, subIndexes, nodeChildren, parentElem, resolve));
		} else {
			operation(index, subIndexes, nodeChildren, parentElem, resolve);
		}
	})
}

// transforms children into elements
// children can be calculated child elements or strings and numbers
function makeChildrenNodes(children) {
	return children == null ? [] : children.map(child => {
		if (child == null || typeof child === 'string' || typeof child === 'number') {
			return document.createTextNode(child);
		} else {
			return child;
		}
	});
}

// emit an event on the handled parent element
// this helps to test asynchronous rendered elements
function notifyParent(parentElem, event_name) {
	let event = new CustomEvent(event_name, {
		bubbles: false
	});
	parentElem.dispatchEvent(event);
}