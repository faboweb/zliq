import vdomH from 'virtual-dom/h';
import {stream, merge$, isStream} from './streamy';

// TODO check for props are children
/*
* wrap hyperscript elements in reactive streams dependent on their children streams
*/
export const h = (tag, props, children) => {
	// if it is a sub component, resolve that component
	if (typeof tag === 'function') {
		return tag(props, children);
	}
	if (!children) {
		return stream(vdomH(tag, props));
	}
	return merge$(makeChildrenStreams$(children), wrapProps$(props))
		.map(function updateElement([children, props]) {
			return vdomH(tag, props, [].concat(children));
		});
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

	return merge$(...children$Arr)
		.map(children => {
			// flatten children array
			children = children.reduce((_children, child) => {
				return _children.concat(child);
			}, []);
			// TODO maybe add flatmap
			// check if result has streams and if so hook into those streams
			// acts as flatmap from rxjs
			if (children.reduce((hasStream, child) => {
				if (hasStream) return true;
				return isStream(child) || Array.isArray(child);
			}, false)) {
				return makeChildrenStreams$(children)();
			}
			return children;
		});
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
	// merge all props streams and build props object again
	return merge$(...props$).map(props => {
		return props.reduce((obj, {key, value}) => {
			obj[key] = value;
			return obj;
		}, {});
	});
}