import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import createElement from 'virtual-dom/create-element';

/*
* render a virtual dom stream into a parent element
*/
export const render = (tree$, parentElem) => {
	let oldTree = tree$();
	let rootNode = createElement(oldTree);
	parentElem.appendChild(rootNode);

	// on updates of the virtual dom stream update the actual dom
	tree$.map((tree) => {
		let patches = diff(oldTree, tree);
		patch(rootNode, patches);
		oldTree = tree;
	});
};