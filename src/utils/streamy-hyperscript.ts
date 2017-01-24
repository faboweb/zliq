import vdomH from 'virtual-dom/h';
import {stream, merge, isStream} from './streamy';

// TODO check for props are children
// TODO resolve nested props streams
export const h = (tag, props, children) => {
	if (!children) {
		return stream(vdomH(tag, props));
	}
	return wrapChildren$(children).map(function updateChildren(children) {
		return vdomH(tag, props, [].concat(children));
	});
};

function wrapChildren$(children) {
	let children$Arr = [].concat(children).reduce(function makeStream(arr, child) {
		if (!isStream(child)) {
			return arr.concat(stream(child));
		}
		return arr.concat(child);
	}, []);

	return merge(...children$Arr)
		.map(children => {
			if (children.reduce((hasStream, child) => {
				if (hasStream) return true;
				return isStream(child);
			}, false)) {
				// TODO maybe add flatmap
				return wrapChildren$(children)();
			}
			return children;
		});
}