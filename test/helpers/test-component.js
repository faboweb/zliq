import {diff, createNode} from '../../src'

export function test({vdom$}, schedule, done) {
    renderedElement$({vdom$}).reduce((iteration, newElement) => {
        if (schedule[iteration] === undefined) {
            throw new Error('Unexpected Update!');
        }
        schedule[iteration](newElement);
        if (schedule.length === iteration + 1) {
            done();
        }

        return iteration +1;
    }, 0);
}

function renderedElement$({vdom$}) {
    let rendering$ = vdom$.reduce((
        {element: oldElement, version: oldVersion, children: oldChildren},
        {tag, props, children, version}
    ) => {
        if (oldElement === undefined) {
            oldElement = createNode(tag, children);
        }
        let newElement = diff(oldElement, tag, props, children, version, oldChildren, oldVersion);

        return {
            element: oldElement,
            version,
            children
        };
    }, {
        element: undefined,
        version: -1,
        children: []
    });

    return rendering$.$('element');
}