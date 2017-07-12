import {diff, createNode} from '../../src'

export function test({vdom$}, schedule, done) {
    vdom$.reduce(({element: oldElement, version: oldVersion, children: oldChildren, iteration}, {tag, props, children, version}) => {
        if (oldElement === null) {
			oldElement = createNode(tag, children);
		}
		let newElement = diff(oldElement, tag, props, children, version, oldChildren, oldVersion);

        iteration++;
        if (schedule[iteration] !== undefined) {
            schedule[iteration](newElement);
        } else {
            throw new Error('Unexpected Update!');
        }
        if (schedule.length === iteration + 1) {
            done();
        }

        return {
            element: oldElement,
			version,
			children,
            iteration
        }
    }, {
        element: null,
		version: -1,
		children: [],
        iteration: -1
    })
}