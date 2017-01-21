import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import createElement from 'virtual-dom/create-element';
import flyd from 'flyd';

export const render = (tree$, parentElem) => {
	let oldTree = tree$();
	let rootNode = createElement(oldTree);
	parentElem.appendChild(rootNode);

	flyd.combine((tree$) => {
		let patches = diff(oldTree, tree$());
		patch(rootNode, patches);
	}, [tree$]);
};