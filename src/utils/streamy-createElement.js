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
				if (changes.length) {
					elemLengths = applyChanges(index, changes, parentElem, elemLengths);
				}
			});
		} else {
			child$.map(child => {
				let changes;
				// streams can return arrays of children
				if (Array.isArray(child)) {
					changes = child.map((child, subIndex) => {
						return {
							subIndex,
							elem: child
						}
					});
					// var frag = document.createDocumentFragment();
					// while (parentElem.length > 0) {
					// 	frag.appendChild(parentElem[0]);
					// }
					// child.forEach((subChild_, subIndex) => {
					// 	let leftNeighbor = getLeftNeighbor(index, subIndex, elemLengths, frag);
					// 	addOrUpdateChild(subChild_, index, subIndex, frag, leftNeighbor, elemLengths);
					// });
					// // remove 
					// while (parentElem.firstChild) {
					// 	parentElem.removeChild(parentElem.firstChild);
					// }
					// parentElem.appendChild(frag);
					// elemLengths[index] = child.length;
				} else {
					changes = [{
						elem: child
					}];
					// elemLengths[index] = child !== null ? 1 : 0;
					// let leftNeighbor = getLeftNeighbor(index, null, elemLengths, parentElem);
					// addOrUpdateChild(child, index, null, parentElem, leftNeighbor, elemLengths);
				}
				elemLengths = applyChanges(index, changes, parentElem, elemLengths);
			});
		}
	});
}

// changes: [{index, elem}]
function applyChanges(index, changes, parentElem, elemLengths) {
	var outputElemLengths = [].concat(elemLengths);
	var frag = document.createDocumentFragment();
	while (parentElem.childNodes.length > 0) {
		frag.appendChild(parentElem.childNodes[0]);
	}
	changes.forEach(({ subIndex, elem }) => {
		let leftNeighbor = getLeftNeighbor(index, subIndex, outputElemLengths, frag);
		outputElemLengths = addOrUpdateChild(elem, index, subIndex, frag, leftNeighbor, outputElemLengths);
	});
	parentElem.appendChild(frag);
	// outputElemLengths[index] = parentElem.childNodes.length;
	return outputElemLengths;
}

function getLeftNeighbor(index, subIndex, elemLengths, parentElem) {
	subIndex = subIndex || 0;
	if (index === 0 && subIndex === 0) return null;
	let leftElemRelativePos = elemLengths.reduce((sum, cur, _index_) => _index_ >= index ? sum :  sum + cur, 0) -1;
	return parentElem.childNodes[leftElemRelativePos + subIndex];
}

function getExistingElem(index, subIndex, elemLengths, parentElem) {
	// add all lengths before the index to get the position of the searched elem
	let relativePos = elemLengths.reduce((sum, cur, _index_) => _index_ >= index ? sum :  sum + (cur.length || cur), 0);
	let relativeSubPos = subIndex && Array.isArray(elemLengths[index]) 
		? elemLengths[index].reduce((sum, cur, _index_) => _index_ >= subIndex ? sum :  sum + cur, 0)
		: 0;
	return parentElem.childNodes[relativePos + relativeSubPos];
}

function addOrUpdateChild(child, key, subkey, parentElem, leftNeighbor, elemLengths) {
	let existingElem = getExistingElem(key, subkey, elemLengths, parentElem);

	function setElemLength(key, subkey, elemLengths, hasChild) {
		let outputElemLengths = [].concat(elemLengths);
		if (subkey != null) {
			if (outputElemLengths[key] == null) {
				outputElemLengths[key] = [];
			}
			outputElemLengths[key][subkey] = hasChild ? 1 : 0;
		} else {
			outputElemLengths[key] = hasChild ? 1 : 0;
		}
		return outputElemLengths;
	}

	// if the child was there but got removed
	// we need to remove the elem
	if (existingElem && child === null) {
		parentElem.removeChild(existingElem);
	}
	if (child == null) {
		return setElemLength(key, subkey, elemLengths, false);
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
	return setElemLength(key, subkey, elemLengths, true);
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
			return changes.map(({subIndex, item}) => {
				return {
					subIndex,
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
					subIndex: index,
					item: arr[index]
				});
			}
		}
		oldValue = arr;
		return changes;
	})
}