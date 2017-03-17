import {merge$} from './streamy';
import {BinarySearchTree} from './binary-tree';
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
	let elemPositionTree = new BinarySearchTree();
	children$Arr.map((child$, index) => {
		if (child$.IS_CHANGE_STREAM) {
			child$.map(changes => {
				if (changes.length) {
					applyChanges(index, changes, parentElem, elemPositionTree);
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
				applyChanges(index, changes, parentElem, elemPositionTree);
			});
		}
	});
}

// changes: [{index, elem}]
function applyChanges(index, changes, parentElem, elemPositionsTree) {
	var frag = document.createDocumentFragment();
	while (parentElem.childNodes.length > 0) {
		frag.appendChild(parentElem.childNodes[0]);
	}
	changes.forEach(({ subIndex, elem }) => {
		updateDOMforChild(elem, index, subIndex, frag, elemPositionsTree);
	});
	parentElem.appendChild(frag);
}

function getDomElemPosition(index, subIndex, elemPositionsTree) {
	subIndex = subIndex || 0;
	if (index === 0 && subIndex === 0) return null;
	let elemPositionNode = elemPositionsTree.find(index);
	if (elemPositionNode == null) {
		return null;
	}
	let position = elemPositionNode.before;
	let subPosition = subIndex > 0 && elemPositionNode.subTree ? elemPositionNode.subTree(subIndex).before : 0;
	return position + subPosition;

}

function getLeftNeighbor(index, subIndex, elemPositionsTree, parentElem) {
	let position = getDomElemPosition(index, subIndex, elemPositionsTree);
	if (position == null) {
		return null;
	}
	return parentElem.childNodes[position - 1];
}

function getExistingElem(index, subIndex, elemPositionsTree, parentElem) {
	let position = getDomElemPosition(index, subIndex, elemPositionsTree);
	if (position == null) {
		return null;
	}
	return parentElem.childNodes[position];
}

function updateDOMforChild(child, index, subIndex, parentElem, elemPositionsTree) {
	let existingElem = getExistingElem(index, subIndex, elemPositionsTree, parentElem);

	// if the child was there but got removed
	// we need to remove the elem
	if (existingElem && child === null) {
		parentElem.removeChild(existingElem);
	}
	if (child == null) {
		elemPositionsTree.remove(index, null, subIndex);
		return;
	}

	// if the element is already there then replace it
	if (existingElem) {
		parentElem.removeChild(existingElem);
	}

	let leftNeighbor = getLeftNeighbor(index, subIndex, elemPositionsTree, parentElem);
	if (leftNeighbor) {
		parentElem.insertBefore(child, leftNeighbor.nextSibling);
	} else {
		parentElem.prepend(child);
	}
	elemPositionsTree.add(index, null, subIndex);
	return;
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