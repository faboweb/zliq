import {merge$} from './streamy';
import odiff from 'odiff';
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
	children$Arr.map((child$, index) => {
		if (child$.IS_CHANGE_STREAM) {
			child$.map(changes => {
				if (changes.length) {
					applyChanges(index, changes, parentElem);
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
				applyChanges(index, changes, parentElem);
			});
		}
	});
}

// changes: [{index, elem}]
function applyChanges(index, changes, parentElem) {
	changes.forEach(({ index:subIndex, elems, type, num }) => {
		updateDOMforChild(elems, index, subIndex, type, num, parentElem);
	});
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

function updateDOMforChild(children, index, subIndex, type, num, parentElem) {
	if (type === 'rm') {
		for(let times = 0; times<num; times++) {
			let node = parentElem.childNodes[index];
			parentElem.removeChild(node);
		}
		return;
	}

	if (children != null && (children[0] == undefined 
		|| (typeof children[0] === 'string' 
		|| typeof children[0] === 'number'))
		) {
		children = [document.createTextNode(children)];
	} else if (!Array.isArray(children)) {
		children = [children];
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
	for(let times = 0; times < children.length; times++) {
		let existingElem = parentElem.childNodes[index];
		existingElem && parentElem.removeChild(existingElem);
	}
	var frag = document.createDocumentFragment();
	while (parentElem.childNodes.length > 0) {
		frag.appendChild(parentElem.childNodes[0]);
	}
	let elementAtPosition = parentElem.childNodes[index];
	children.forEach(child => {
		if (elementAtPosition == null) {
			frag.appendChild(child);
		} else {
			frag.insertBefore(child, elementAtPosition);
		}
	});
	parentElem.appendChild(frag);
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
			return changes.map(({index, val, vals, type, num, path }) => {
				if (type === 'add' || type === 'rm') {
					return {
						type,
						index,
						num,
						elems: vals != null ? vals.map(val => renderFunc(val, inputs)) : null
					};
				}
				if (type == 'set') {
					return {
						type,
						index,
						elems: val != null ? [renderFunc(val, inputs)] : null
					};
				}
			});
		});
	output$.IS_CHANGE_STREAM = true;
	return output$;
}

function listChanges$(arr$) {
	let oldValue = [];
	return arr$.map(arr => {
		let changes = odiff(oldValue, arr);
		changes = changes.map(change => {
			// changes in arrays are currently analysed deep
			// but we only need the changed element
			if (change.type === 'set' && change.path && typeof change.path[0] === 'number') {
				let index = change.path[0];
				change.val = arr[index];
				change.index = index;
			}
			return change;
		})
		oldValue = arr;
		return changes;
	})
}