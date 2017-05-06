import {stream, merge$, isStream} from './streamy';
import {createElement} from './streamy-dom';

/*
* wrap hyperscript elements in reactive streams dependent on their children streams
*/
export const h = (tag, props, ...children) => {
	// jsx usally resolves known tags as strings and unknown tags as functions
	// if it is a sub component, resolve that component
	if (typeof tag === 'function') {
		return tag(props, children);
	}
	return createElement(
		tag,
		wrapProps$(props),
		makeChildrenStreams$(children)
	);
};

/*
* wrap all children in streams and merge those
* we make sure that all children streams are flat arrays to make processing uniform 
*/
function makeChildrenStreams$(childrenArr) {
	// flatten children arr
	// needed to make react style hyperscript (children as arguments) working parallel to preact style hyperscript (children as array)
	childrenArr = [].concat(...childrenArr);
	// wrap all children in streams
	let children$Arr = makeStreams(childrenArr);

	return children$Arr
		// make sure children are arrays and not nest
		.map(child$ => flatten(makeArray(child$)))
		// make sure subchildren are all streams
		.map(child$ => child$.map(children => makeStreams(children)))
		// so we can easily merge them
		.map(child$ => child$.flatMap(children => merge$(...children)));
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
function flatten(stream) {
	return stream.map(arr => {
		while (arr.some(value => Array.isArray(value))) {
			arr = [].concat(...arr);
		}
		return arr;
	})
}

/*
* Wrap props into one stream
*/
function wrapProps$(props) {
	if (props === null) return stream();
	if (isStream(props)) {
		return props;
	}

	// go through all the props and make them a stream
	// if they are objects, traverse them to check if they include streams	
	let props$Arr = Object.keys(props).map((propName, index) => {
		let value = props[propName];
		if (isStream(value)) {
			return value.map(value => {
				return {
					key: propName,
					value
				};
			});
		} else {
			// if it's an object, traverse the sub-object making it a stream
			if (value !== null && typeof value === 'object') {
				return wrapProps$(value).map(value => {
					return {
						key: propName,
						value
					};
				});
			}
			// if it's a plain value wrap it in a stream
			return stream({
				key: propName,
				value
			});
		}
	});
	// merge streams of all properties
	// on changes, reconstruct the properties object from the properties
	return merge$(...props$Arr).map(props => {
		return props.reduce((obj, {key, value}) => {
			obj[key] = value;
			return obj;
		}, {});
	});
}