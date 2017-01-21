import hh from 'hyperscript-helpers';

/* allow for dom defenition like div#foo.bar */
/* this does not seem to work with preact */

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
			id
		}, classes.length > 0 ? {
			className: classes.join(' ')
		} : {}), children);
	};
}

export default (h) => hh(ph(h));