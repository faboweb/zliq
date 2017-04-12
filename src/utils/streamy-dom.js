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

export function createElement(tagName, properties$, children$Arr) {
    let elem = document.createElement(tagName);
    manageProperties(elem, properties$)
    manageChildren(elem, children$Arr);
    return elem;
}

function manageChildren(parentElem, children$Arr) {
	let changeQueue = PromiseQueue([]);
	
	// TODO add comment
	// TODO batch updates
	children$Arr.map((child$, index) => {
		let oldChildArr = [];
		child$.map(childArr => {
			if (oldChildArr.length === 0 && childArr.length === 0) return;
			
			let subIndex = 0;
			let changes = [];
			for (; subIndex < childArr.length; subIndex++) {
				let oldChild = oldChildArr[subIndex];
				let newChild = childArr[subIndex];
				let type = oldChild != null && newChild == null ? 'rm' 
						: oldChild == null && newChild != null ? 'add' 
						: 'set';

				// aggregate change-flights of the similar type to perform batch operations of these
				let lastChange = changes.length > 0 ? changes[changes.length - 1] : null;
				if (lastChange && lastChange.type === type) {
					if (type == 'rm') {
						lastChange.num++;
					} else {
						lastChange.indexes.push(subIndex);
						lastChange.elems.push(newChild);
					}
				} else {
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

			changes.forEach(({indexes, type, num, elems}) => {
				updateDOMforChild(elems, index, indexes, type, num, parentElem);
			});
			
			oldChildArr = childArr;
		});
	});
}

/*
* perform the actual manipulation on the parentElem
*/
function updateDOMforChild(children, index, subIndexes, type, num, parentElem) {
	// console.log('performing update on DOM', children, index, subIndex, type, num, parentElem);
	// remove all the elements starting from a certain index
	if (type === 'rm') {
		for(let times = 0; times<num; times++) {
			let node = parentElem.childNodes[index];
			if (node != null) {
				parentElem.removeChild(node);
			}
		}
		return Promise.resolve();
	}
	// make sure children are document nodes 
	let nodeChildren = children.map(child => {
		if (child == null || typeof child === 'string' || typeof child === 'number') {
			return document.createTextNode(child);
		} else {
			return child;
		}
	})

	if (type === 'add') {
		return performAdd(nodeChildren, index, subIndexes, parentElem);
	}

	if (type === 'set') {
		return performSet(nodeChildren, index, subIndexes, parentElem);
	}
}

function performAdd(children, index, subIndexes, parentElem) {
	return new Promise((resolve, reject) => {
		let visibleIndex = index + subIndexes[0];
		function addElement() {
			// get right border element and insert one after another before this element
			// index is now on position of insertion as we removed the element from this position before
			let elementAtPosition = parentElem.childNodes[visibleIndex];
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

function performSet(children, index, subIndexes, parentElem) {
	return new Promise((resolve, reject) => {		function setElement() {
			children.forEach((child, childIndex) => {
				let subIndex = subIndexes[childIndex];
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
            } else if (property === 'style' && typeof value !== "string" ) {
                Object.assign(elem.style, value);
            } else {
                elem.setAttribute(property, value);
            }
        });
    });
}

function notifyParent(parentElem, event_name) {
	let event = new CustomEvent(event_name, {
		bubbles: false
	});
	parentElem.dispatchEvent(event);
}