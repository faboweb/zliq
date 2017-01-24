import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import createElement from 'virtual-dom/create-element';

export const render = (tree$, parentElem) => {
	let oldTree = tree$();
	let rootNode = createElement(oldTree);
	parentElem.appendChild(rootNode);

	tree$.map((tree) => {
		let patches = diff(oldTree, tree);
		patch(rootNode, patches);
	});
};