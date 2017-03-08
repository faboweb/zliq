import {merge$} from './streamy';
import deepEqual from 'deep-equal';

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
	// array to store the actual count of elements in one virtual elem
	// one virtual elem can produce a list of elems so we can't rely on the index only
	let elemLengths = [];
	children$Arr.map((child$, index) => {
		if (child$.IS_CHANGE_STREAM) {
			child$.map(changes => {
				var frag = document.createDocumentFragment();
				while (parentElem.length > 0) {
					frag.appendChild(parentElem[0]);
				}
				changes.forEach(({ index: subIndex, elem }) => {
					let leftNeighbor = getLeftNeighbor(index, subIndex, elemLengths, frag);
					addOrUpdateChild(elem, index, subIndex, frag, leftNeighbor);
				});
				// remove 
				while (parentElem.firstChild) {
					parentElem.removeChild(parentElem.firstChild);
				}
				elemLengths[index] = frag.children.length;
				parentElem.appendChild(frag);
			});
		} else {
			child$.map(child => {
				// streams can return arrays of children
				if (Array.isArray(child)) {
					var frag = document.createDocumentFragment();
					while (parentElem.length > 0) {
						frag.appendChild(parentElem[0]);
					}
					child.forEach((subChild_, subIndex) => {
						let leftNeighbor = getLeftNeighbor(index, subIndex, elemLengths, frag);
						addOrUpdateChild(subChild_, index, subIndex, frag, leftNeighbor);
					});
					// remove 
					while (parentElem.firstChild) {
						parentElem.removeChild(parentElem.firstChild);
					}
					parentElem.appendChild(frag);
					elemLengths[index] = child.length;
				} else {
					elemLengths[index] = child !== null ? 1 : 0;
					let leftNeighbor = getLeftNeighbor(index, null, elemLengths, parentElem);
					addOrUpdateChild(child, index, null, parentElem, leftNeighbor);
				}
			});
		}
	});
}

function getLeftNeighbor(index, subIndex, elemLengths, parentElem) {
	subIndex = subIndex || 0;
	if (index === 0 && subIndex === 0) return null;
	let leftElemRelativePos = elemLengths.reduce((sum, cur, _index_) => _index_ >= index ? sum :  sum + cur, 0) -1;
	return parentElem.childNodes[leftElemRelativePos + subIndex];
}

function addOrUpdateChild(child, key, subkey, parentElem, leftNeighbor) {
	let elemQuery = `[key='${key}']` 
		+ subkey !== null ? `[subkey='${subkey}']` : '';
	let existingElem = parentElem.querySelector(elemQuery);
	// if the child was there but got removed
	// we need to remove the elem
	if (existingElem && child === null) {
		parentElem.removeChild(existingElem);
		return null;
	}
	if (child == null) return null;

	if (typeof child === "string" || typeof child === "number") {
		let newChild = document.createElement('span');
		newChild.innerText = child;
		child = newChild;
	}

	child.setAttribute('key', key);
	if (subkey !== null) {
		child.setAttribute('subkey', subkey);
	}

	// if the element is already there then replace it
	if (existingElem) {
		parentElem.removeChild(existingElem);
	}
	if (leftNeighbor) {
		parentElem.insertBefore(child, leftNeighbor.nextSibling);
	} else {
		parentElem.prepend(child);
	}
	return child;
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

function insertAtPosition(newNode, parentElem, index) {
	let parentNode = parentElem.parentNode;
	if (parentElem.childNodes.length >= index) {
		parentElem.appendChild(newNode);
	} else {
		parentNode.insertBefore(newNode, parentElem.childNodes[index - 1].nextSibling);
	}
}

export function list(input$, listSelector, renderFunc) {
	let output$ = merge$(
			listChanges$(input$.map(value => value != null ? value[listSelector] : null)),
			input$.map(value => {
				if (value == null) { return null; }
				let copiedValue = Object.assign({}, value);
				delete copiedValue[listSelector];
				return copiedValue;
			})
				.distinct()
		)
		.map(([changes, inputs]) => {
			return changes.map(({index, item}) => {
				return {
					index,
					item,
					elem: item != null ? renderFunc(item, inputs) : null
				};
			});
		});
	output$.IS_CHANGE_STREAM = true;
	return output$;
}

function listChanges$(arr$) {
	let oldValue = [];
	return arr$.map(arr => {
		let totalLength = arr.length > oldValue.length ? arr.length : oldValue.length;
		let changes = [];
		for (let index = 0; index < totalLength; index++) {
			if (!deepEqual(arr[index], oldValue[index])) {
				changes.push({
					index,
					item: arr[index]
				});
			}
		}
		oldValue = arr;
		return changes;
	})
}