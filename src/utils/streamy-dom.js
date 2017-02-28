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

// IDEA add request animation frame and only update when animating
function manageChildren(parentElem, children$Arr) {
	let childElems = [];
	children$Arr.map((child$, index) => {
		// TODO if child is array calc positions + refactor
		child$.map(child => {
			let rightNeighbor = childElems.slice(index).find(elem => elem !== null);
			rightNeighbor = Array.isArray(rightNeighbor) ? rightNeighbor[0] : rightNeighbor;
			let relativePos = rightNeighbor 
				? Array.prototype.indexOf.call(parentElem.childNodes, rightNeighbor) - 1
				: parentElem.childNodes.length;
			// streams can return arrays of children
			if (Array.isArray(child)) {
				childElems[index] = childElems[index] || [];
				var clonedParent = parentElem.cloneNode();
				child.forEach((_child_, _index_) => {
					childElems[index][_index_] = addOrUpdateChild(_child_, relativePos + _index_, childElems[index][_index_], clonedParent, rightNeighbor);
				});
				// if the parent is already attached to the dom we replace it
				// this is faster then manipulating it often
				if (!parentElem.parentNode) {
					return clonedParent;
				} else {
					parentElem.parentNode.replaceChild(clonedParent, parentElem);
				}
			} else {
				childElems[index] = addOrUpdateChild(child, relativePos, childElems[index], parentElem, rightNeighbor);
			}
		});
	});
}

function addOrUpdateChild(child, relativePos, savedElem, parentElem, rightNeighbor) {
	// if the child was there but got removed
	// we need to remove the elem
	if (savedElem && child === null) {
		parentElem.removeChild(childElems[index]);
		return null;
	}
	if (child == null) return null;

	if (typeof child === "string" || typeof child === "number") {
		child = document.createTextNode(child);
	}
	// if the element is not yet drawn
	if (!savedElem) {
		// if rightNeighbor is null it gets appended
		parentElem.insertBefore(child, rightNeighbor);
	} else {
		// if the element is already there then replace it
		parentElem.replaceChild(child, savedElem);
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