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
	children$Arr.map((child$, index) => {
		let oldChildArr = [];
		child$.map(childArr => {
			if (oldChildArr.length === 0 && childArr.length === 0) return;
			
			let subIndex = 0;
			for (; subIndex < childArr.length; subIndex++) {
				let oldChild = oldChildArr[subIndex];
				let newChild = childArr[subIndex];
				let type = oldChild != null && newChild == null ? 'rm' 
						: oldChild == null && newChild != null ? 'add' 
						: 'set';
				updateDOMforChild([newChild], index, subIndex, type, 1, parentElem);
			}
			for (; subIndex < oldChildArr.length; subIndex++) {
				updateDOMforChild([newChild], index, subIndex, 'rm', 1, parentElem);
			}
			oldChildArr = childArr;
		});
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