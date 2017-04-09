import {stream, merge$, isStream} from './streamy';
import {createElement} from './streamy-dom';

/*
* wrap hyperscript elements in reactive streams dependent on their children streams
*/
export const h = (tag, props, children) => {
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
function makeChildrenStreams$(children) {
	// wrap all children in streams
	let children$Arr = [].concat(children).reduce(function makeStream(arr, child) {
		if (child === null || !isStream(child)) {
			return arr.concat(stream(child));
		}
		return arr.concat(child);
	}, []);

	// make sure children are arrays
	return children$Arr.map(child => flatten(makeArray(child)));
}

function makeArray(stream) {
	return stream.map(value => {
		if (!Array.isArray(value)) {
			return [value];
		}
		return value;
	})
}

function flatten(stream) {
	return stream.map(arr => {
		while (arr.some(value => Array.isArray(value))) {
			arr = [].concat(...value);
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