import {stream, merge$, isStream} from './streamy';
import {createElement, REMOVED, ADDED} from './streamy-dom';

/*
* wrap hyperscript elements in reactive streams dependent on their children streams
*/
export const h = (tag, props, ...children) => {
	let component;
	let version = -1;

	let mergedChildren$ = mergeChildren$(flatten(children));
	// jsx usually resolves known tags as strings and unknown tags as functions
	// if it is a sub component, resolve that component
	if (typeof tag === 'function') {
		return tag(
			props || {},
			mergedChildren$
		);
	}
	// add detachers to props
	if (props !== null) {
		Object.keys(props).map((propName, index) => {
			if (isStream(props[propName])) {
				props[propName] = props[propName];
			}
		});
	}
	return merge$([
		wrapProps$(props),
		mergedChildren$.map(flatten)
	]).map(([props, children]) => {
		return {
			tag,
			props,
			children,
			version: ++version
	}});
};

// input has format [stream]
function mergeChildren$(children) {
	if (!Array.isArray(children)) {
		children = [children];
	}
	children = flatten(children)
	.filter(_ => _ !== null);
	let childrenVdom$arr = children.map(child => {
		if (isStream(child)) {
			return child
			.flatMap(mergeChildren$);
		}
		return child;
	})

	return merge$(childrenVdom$arr);
}

/*
* wrap all children in streams and merge those
* we make sure that all children streams are flat arrays to make processing uniform
* output: stream([stream([])])
*/
function getChildrenVdom$arr(childrenArr) {
	// flatten children arr
	// needed to make react style hyperscript (children as arguments) working parallel to preact style hyperscript (children as array)
	childrenArr = [].concat(...childrenArr);
	// only handle vdom for now
	let children$Arr = childrenArr.map(component => {
		// if there is no stream it is a string or number
		if (!isStream(component)) {
			return stream(component);
		}
		return component
	});

	return children$Arr
		// make sure children are arrays and not nest
		.map(_ => makeArray(_)
			.map(flatten))
		// so we can easily merge them
		.map(vdom$ => vdom$.flatMap(vdomArr =>
				merge$(vdomArr)));
}

// make sure all children are handled as streams
// so we can later easily merge them
function makeStreams(childrenArr) {
	return childrenArr.map(child => {
		if (child === null || !isStream(child)) {
			return stream(child);
		}
		return child;
	});
}

// converts an input into an array
function makeArray(stream) {
	return stream.map(value => {
		if (value == null) {
			return [];
		}
		if (!Array.isArray(value)) {
			return [value];
		}
		return value;
	})
}

// flattens an array
export function flatten(array, mutable) {
    var toString = Object.prototype.toString;
    var arrayTypeStr = '[object Array]';
    
    var result = [];
    var nodes = (mutable && array) || array.slice();
    var node;

    if (!array.length) {
        return result;
    }

    node = nodes.pop();
    
    do {
        if (toString.call(node) === arrayTypeStr) {
            nodes.push.apply(nodes, node);
        } else {
            result.push(node);
        }
    } while (nodes.length && (node = nodes.pop()) !== undefined);

    result.reverse(); // we reverse result to restore the original order
    return result;
}

/*
* Wrap props into one stream
*/
function wrapProps$(props) {
	if (props === null) return stream({});
	if (isStream(props)) {
		return props;
	}

	let nestedStreams = extractNestedStreams(props);
	let updateStreams = nestedStreams.map(function makeNestedStreamUpdateProps({parent, key, stream}) {
		return stream
		.distinct()
		// here we produce a sideeffect on the props object -> low GC
		// to trigger the merge we also need to return sth (as undefined does not trigger listeners)
		.map(value => {
			parent[key] = value;
			return value; 
		})
	});
	return merge$(updateStreams).map(_ => props);
}

// to react to nested streams in an object, we extract the streams and a reference to their position
// returns [{parentObject, propertyName, stream}]
function extractNestedStreams(obj) {
	return flatten(Object.keys(obj).map(key => {
		if (obj[key] === null) {
			return [];
		}
		if (typeof obj[key] === 'object') {
			return extractNestedStreams(obj[key]);
		}
		if (isStream(obj[key])) {
			return [{
				parent: obj,
				key,
				stream: obj[key]
			}];
		}
		return [];
	}))
}