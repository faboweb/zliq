import {diff, createNode, render} from '../../src'

export function test({vdom$}, schedule, done) {
    render({vdom$}).$('element').reduce((iteration, newElement) => {
        if (schedule[iteration] === undefined) {
            throw new Error('Unexpected Update!');
        }
        schedule[iteration](newElement);
        if (schedule.length === iteration + 1 && done) {
            done();
        }

        return iteration +1;
    }, 0);
}