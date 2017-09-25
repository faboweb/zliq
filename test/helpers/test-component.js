import {diff, createNode, render} from '../../src'

export function test({vdom$}, schedule, done) {
    return render({vdom$}).map((rendered) => {
        // tests produce async behaviour often syncronous
        // this can cause race effects on stream declarations
        // here the iterations are made asynchronous to prevent this
        setTimeout(() => {
            if (schedule[rendered.version] === undefined) {
                throw new Error('Unexpected Update!');
            }
            schedule[rendered.version](rendered.element, rendered);
            if (schedule.length === rendered.version + 1 && done) {
                done();
            }
        })

        return rendered;
    });
}

export function test$(stream, schedule, done) {
    return stream.reduce((iteration, value) => {
        // tests produce async behaviour often syncronous
        // this can cause race effects on stream declarations
        // here the iterations are made asynchronous to prevent this
        setTimeout(() => {
            if (schedule[iteration] === undefined) {
                throw new Error('Unexpected Update!');
            }
            schedule[iteration](value);
            if (schedule.length === iteration + 1 && done) {
                done();
            }
        })

        return iteration + 1;
    }, 0);
}