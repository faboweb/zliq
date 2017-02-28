import {stream, merge$, isStream} from './streamy';
import {createElement} from './streamy-dom';

// TODO check for props are children
/*
* wrap hyperscript elements in reactive streams dependent on their children streams
*/
export const h = (tag, props, children) => {
	// if it is a sub component, resolve that component
	if (typeof tag === 'function') {
		return tag(props, children);
	}
	let elem = createElement(tag, wrapProps$(props), makeChildrenStreams$(children));
	return elem;
};


/*
* wrap all children in streams
*/
function makeChildrenStreams$(children) {
	// wrap all children in streams
	let children$Arr = [].concat(children).reduce(function makeStream(arr, child) {
		if (child === null || !isStream(child)) {
			return arr.concat(stream(child));
		}
		return arr.concat(child);
	}, []);

	return children$Arr;
}

// TODO: refactor, make more understandable
function wrapProps$(props) {
	if (props === null) return stream();
	if (isStream(props)) {
		return props;
	}
	// map all props into streams of format {key,value} to rebuild props object later
	let props$ = Object.keys(props).map((propName, index) => {
		let value = props[propName];
		if (isStream(value)) {
			return value.map(value => {
				return {
					key: propName,
					value
				};
			});
		} else {
			// if it's an object recursivly make it also into a stream
			if (value !== null && typeof value === 'object') {
				return wrapProps$(value).map(_value_ => {
					return {
						key: propName,
						value: _value_
					};
				});
			}
			// if it's a plain value streamify it
			return stream({
				key: propName,
				value
			});
		}
	});
	// merge all props streams and build props object again
	return merge$(...props$).map(props => {
		return props.reduce((obj, {key, value}) => {
			obj[key] = value;
			return obj;
		}, {});
	});
}