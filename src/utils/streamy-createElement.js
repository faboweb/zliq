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
	let elemLenghts = [];
	children$Arr.map((child$, index) => {
		child$.map(child => {
			// streams can return arrays of children
			if (Array.isArray(child)) {
				var frag = document.createDocumentFragment();
				parentElem.childNodes.forEach(node => frag.appendChild(node));
				child.forEach((subChild_, subIndex) => {
					let leftNeighbor = getLeftNeighbor(index, subIndex, elemLenghts, parentElem);
					addOrUpdateChild(subChild_, index, subIndex, frag);
				});
				// remove 
				while (parentElem.firstChild) {
					parentElem.removeChild(parentElem.firstChild);
				}
				parentElem.appendChild(frag);
				elemLenghts[index] = child.length;
			} else {
				elemLenghts[index] = child !== null ? 1 : 0;
				addOrUpdateChild(child, index, null, parentElem);
			}
		});
	});
}

function getLeftNeighbor(index, subIndex, elemLenghts, parentElem) {
	subIndex = subIndex || 0;
	if (index === 0 && subIndex === 0) return null;
	let relativePos = elemLengths.splice(0, index-1).reduce((sum, cur) => sum + cur, 0);
	return parentElem.childNodes[relativePos + subIndex];
}

function addOrUpdateChild(child, key, subkey, parentElem, leftNeighbor) {
	let elemQuery = `[data-key=${key}]` 
		+ subkey !== null ? `[data-subkey=${subkey}]` : '';
	let existingElem = parentElem.querySelector(elemQuery);
	// if the child was there but got removed
	// we need to remove the elem
	if (existingElem && child === null) {
		parentElem.removeChild(existingElem);
		return null;
	}
	if (child == null) return null;

	child.dataSet['key'] = key;
	subkey !== null && child.dataSet['subkey'] = subkey;

	if (typeof child === "string" || typeof child === "number") {
		child = document.createTextNode(child);
	}
	// if the element is already there then replace it
	if (existingElem) {
		parentElem.replace(child, existingElem);
	} else {
		parentElem.insertBefore(child, leftNeighbor ? leftNeighbor.nextSibling : null);
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