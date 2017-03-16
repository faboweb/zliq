import deepEqual from 'deep-equal';
import {merge$, stream} from './streamy';
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
				} else {
					changes = [{
						elem: child
					}];
				}
				elemLengths = applyChanges(index, changes, parentElem, elemLengths);
			});
		}
	});
}

function applyChanges(index, changes, parentElem, elemPositionsLookup) {
	let outputElemPositions = [].concat(elemPositionsLookup);
	// if the parent is attached to the DOM remove it while updating
	const parentContainer = parentElem.parent;
	let frag;
	if (parentContainer) {
		frag = document.createDocumentFragment();
		frag.appendChild(parentElem);
	}
	changes.forEach(({ subIndex, elem }) => {
		outputElemPositions = addOrUpdateChild(elem, index, subIndex, parentElem, outputElemPositions);
	});
	if (parentContainer) {
		parentContainer.appendChild(frag);
	}
	return outputElemPositions;
}

function getLeftNeighbor(index, subIndex, elemPositionsLookup, parentElem) {
	subIndex = subIndex || 0;
	if (index === 0 && subIndex === 0) return null;
	let elemsBefore = elemPositionsLookup[index].before;
	let subElemsBefore = subIndex && elemPositionsLookup[index].children[subIndex].before;
	return parentElem.childNodes[elemsBefore + subElemsBefore - 1];
}

function getExistingElem(index, subIndex, elemPositionsLookup, parentElem) {
	if (elemPositionsLookup[index] == null) {
		return null;
	}
	let elemsBefore = elemPositionsLookup[index].before;
	let subElemsBefore = subIndex && elemPositionsLookup[index].children[subIndex].before;
	return parentElem.childNodes[elemsBefore + subElemsBefore];
}

function updateElemPositionsLookup(index, subIndex, elemPositionsLookup, hasElement) {
	let outputLookup = [].concat(elemPositionsLookup);
	if (outputLookup[index] == null) {
		let before = index === 0 ? 0 : outputLookup[index - 1].before + outputLookup[index - 1].size;
		outputLookup[index] = {
			before,
			size: 1,
			children: []
		};
	}
	let sizeBefore = outputLookup[index].size;
	if (subIndex != null) {
		outputLookup[index].children = updateElemPositionsLookup(subIndex, null, outputLookup[index].children, hasElement);
		// TODO optimize and remove this reduce
		outputLookup[index].size = outputLookup[index].children.reduce((sum, curr) => sum + curr.size);
		hasElement = outputLookup[index].size > 0;
	} else {
		outputLookup[index].size = hasElement ? 1 : 0;
	}
	let sizeDiff = outputLookup[index].size - sizeBefore;
	// update following positions
	if (sizeDiff !== 0) {
		for (let i = index + 1; i < outputLookup.length; i++) {
			outputLookup[i].before = outputLookup[i].before + sizeDiff;
		}
	}
	return outputLookup;
}

function addOrUpdateChild(child, key, subkey, parentElem, elemPositionsLookup) {
	let updatedElemPositionsLookup = updateElemPositionsLookup(key, subkey, elemPositionsLookup, child != null);
	let existingElem = getExistingElem(key, subkey, updatedElemPositionsLookup, parentElem);
	let leftNeighbor = getLeftNeighbor(key, subkey, updatedElemPositionsLookup, parentElem);

	// if the child was there but got removed
	// we need to remove the elem
	if (existingElem && child === null) {
		parentElem.removeChild(existingElem);
	}
	if (child) {
		// if the element is already there then replace it
		if (existingElem) {
			parentElem.removeChild(existingElem);
		}
		if (leftNeighbor) {
			parentElem.insertBefore(child, leftNeighbor.nextSibling);
		} else {
			parentElem.prepend(child);
		}
	}
	return updatedElemPositionsLookup;
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
