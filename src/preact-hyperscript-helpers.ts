import hh from 'hyperscript-helpers';

function ph(h) {
	return function (selector: string, _props?, _children?) {
		let tag, id, classes, props, children;
		if (!_children) {
			props = {};
			children = _props;
		} else {
			props = _props;
			children = _children;
		}
		let [_tag, rest] = selector.split('#');
		let hasId = !!rest;
		if (hasId) {
			tag = _tag;
			[id, ...classes] = rest.split('.');
		} else {
			[tag, ...classes] = _tag.split('.');
		}

		return h(tag, Object.assign(props, {
			id,
			className: classes.length > 0 ? classes.join(' ') : null
		}), ...children);
	};
}

export default (h) => hh(ph(h));