import vdomH from 'virtual-dom/h';
import flyd from 'flyd';

// TODO check for props are children
// TODO resolve nested props streams
export const h = (tag, props, children) => {
	if (!children) {
		return flyd.stream()(vdomH(tag, props));
	}
	return flyd.combine((children$Arr) => {
		return vdomH(tag, props, children$Arr());
	}, [].concat(wrapChildren(children)));
};

function wrapChildren(children) {
	if (flyd.isStream(children)) {
		return children;
	}
	if (!Array.isArray(children)) {
		return flyd.stream()(children);
	}
	let children$Arr = children.reduce((arr, child) => {
		if (!flyd.isStream(child)) {
			return arr.concat(flyd.stream()(child));
		}
		return arr.concat(child);
	}, []);

	return flyd
		.combine((...children) => children
			.splice(0, children.length - 2)
			.reduce((arr, child$) => arr.concat(child$()), [])
		, children$Arr);
}