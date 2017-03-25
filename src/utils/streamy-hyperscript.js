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
	return createElement(
		tag,
		wrapProps$(props),
		makeChildrenStreams$(children)
	);
};

/*
* wrap all children in streams and merge those
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
			if (value !== null && typeof value === 'object') {
				return wrapProps$(value).map(value => {
					return {
						key: propName,
						value
					};
				});
			}
			return stream({
				key: propName,
				value
			});
		}
	});
	return merge$(...props$).map(props => {
		return props.reduce((obj, {key, value}) => {
			obj[key] = value;
			return obj;
		}, {});
	});
}