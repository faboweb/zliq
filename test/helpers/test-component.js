import {diff, createNode} from '../../src'

export function test({vdom$}, schedule, done) {
    vdom$.reduce((
        {element: oldElement, version: oldVersion, children: oldChildren, iteration},
        {tag, props, children, version}
    ) => {
        if (oldElement === null) {
            oldElement = createNode(tag, children);
        }
        let newElement = diff(oldElement, tag, props, children, version, oldChildren, oldVersion);

        if (schedule[iteration] === undefined) {
            throw new Error('Unexpected Update!');
        }
        schedule[iteration](newElement);
        if (schedule.length === iteration + 1) {
            done();
        }

        return {
            element: oldElement,
            version,
            children,
            iteration: iteration + 1
        };
    }, {
        element: null,
        version: -1,
        children: [],
        iteration: 0
    })
}