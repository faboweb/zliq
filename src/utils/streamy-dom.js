import odiff from 'odiff';
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
	let pending_updates = 0;
	// array to store the actual count of elements in one virtual elem
	// one virtual elem can produce a list of elems so we can't rely on the index only
	children$Arr.map((child$, index) => {
		// TODO get rid of IS_CHANGE_STREAM flag
		if (child$.IS_CHANGE_STREAM) {
			// iterative updates are streams of changes belonging together
			// to notify that the update is done, we need to wait for the change with the final flag set to true
			let isIterativeUpdate = false;
			child$.map(changes => { 
				if (changes.length === 0) {
					return;
				}
				pending_updates++;
				changes.forEach(({ index:subIndex, elems, type, num, final }, changeIndex) => {
					if (!isIterativeUpdate && !final) {
						isIterativeUpdate = true;
					}
					changeQueue.add(() => updateDOMforChild(elems, index, subIndex, type, num, parentElem));
					changeQueue.add(() => {
						if (!final && pending_updates > 1) {
							notifyParent(parentElem, UPDATE_EVENT.PARTIAL);
						}
						pending_updates--;
						if (isIterativeUpdate && final) {
							isIterativeUpdate = false;
						}
					});
				});
				changeQueue.add(() => {
					if (!isIterativeUpdate && pending_updates === 0) {
						notifyParent(parentElem, UPDATE_EVENT.DONE);
					} else {
						notifyParent(parentElem, UPDATE_EVENT.PARTIAL);
					}
				});
			});
		} else {
			let oldChilds = [];
			let oldChild = null;
			child$.map(child => {
				let changes;
				// streams can return arrays of children
				if (Array.isArray(child)) {
					changes = odiff(oldChilds, child).map(change => {
						change.elems = change.vals;
						delete change.vals;
						return change;
					});
					oldChilds = child;
				} else {
					if (oldChild == null && child == null) return;

					changes = [{
						index: 0,
						type: oldChild != null && child == null ? 'rm' 
							: oldChild == null && child != null ? 'add' 
							: 'set',
						elems: [child],
						final: false
					}];
					oldChild = child;
				}
				if (changes.length == 0) return;

				pending_updates++;
				changes.forEach(({ index:subIndex, elems, type, num }) => {
					changeQueue.add(() => updateDOMforChild(elems, index, subIndex, type, num, parentElem));
					changeQueue.add(() => notifyParent(parentElem, UPDATE_EVENT.PARTIAL));
				});
				changeQueue.add(() => {
					pending_updates--;
					if (pending_updates === 0) {
						notifyParent(parentElem, UPDATE_EVENT.DONE);
					} else {
						notifyParent(parentElem, UPDATE_EVENT.PARTIAL);
					}
				});
			});
		}
	});
}

/*
* perform the actual manipulation on the parentElem
*/
function updateDOMforChild(children, index, subIndex, type, num, parentElem) {
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
	} else {
		// make sure children are document nodes 
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
		return performSet(children, index, subIndex, parentElem);
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

function notifyParent(parentElem, event_name) {
	let event = new CustomEvent(event_name, {
		bubbles: false
	});
	parentElem.dispatchEvent(event);
}