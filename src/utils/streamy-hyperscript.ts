import vdomH from 'virtual-dom/h';
import {stream, merge$, isStream} from './streamy';

// TODO check for props are children
export const h = (tag, props, children) => {
	if (!children) {
		return stream(vdomH(tag, props));
	}
	return merge$(makeChildrenStreams$(children), wrapProps$(props))
		.map(function updateElement([children, props]) {
			return vdomH(tag, props, [].concat(children));
		});
};

function makeChildrenStreams$(children) {
	let children$Arr = [].concat(children).reduce(function makeStream(arr, child) {
		if (child === null || !isStream(child)) {
			return arr.concat(stream(child));
		}
		return arr.concat(child);
	}, []);

	return merge$(...children$Arr)
		.map(children => {
			children = children.reduce((_children, child) => {
				return _children.concat(child);
			}, []);
			if (children.reduce((hasStream, child) => {
				if (hasStream) return true;
				return isStream(child) || Array.isArray(child);
			}, false)) {
				// TODO maybe add flatmap
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