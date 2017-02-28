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
	let childElems = [];
	children$Arr.map((child$, index) => {
		child$.map(child => {
			// streams can return arrays of children
			if (Array.isArray(child)) {
				child.forEach(_child_ => addOrUpdateChild(_child_, childElems));
			} else {
				addOrUpdateChild(child, childElems);
			}
		});
	});
}

function addOrUpdateChild(child, childElems) {
	// if the child was there but got removed
	// we need to remove the elem
	if (childElems[index] && child === null) {
		parentElem.removeChild(childElems[index]);
		childElems[index] = null;
	}
	if (child == null) return;

	if (typeof child === "string" || typeof child === "number") {
		child = document.createTextNode(child);
	}
	// maybe some elements are missing
	// so we get the relativePos by not counting the missing ones before
	let relativePos = childElems.slice(0, index)
		.reduce((pos, elem) => {
			return pos + elem ? 1 : 0;
		}, 0);
	// if the element is not yet drawn
	if (!childElems[index]) {
		if (relativePos === 0) {
			parentElem.appendChild(child);
		} else {
			insertAtPosition(child, parentElem, relativePos);
		}
	} else {
		// if the element is already there then replace it
		parentElem.replaceChild(child, childElems[index]);
	}
	childElems[index] = child;
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