import {diff, createNode, render} from '../../src'

export function testRender(vdom$, schedule, done) {
    let container = document.createElement('div');
    return test$(render(vdom$, container, 0), schedule, done);
}

export function test$(stream, schedule, done) {
    return stream.reduce(function(iteration, value) {
        if (schedule[iteration] === undefined) {
            throw new Error('Unexpected Update!');
        }

        testSchedule(schedule, iteration, value, done);
        
        if (schedule.length === iteration + 1 && done) {
            done();
        }

        return iteration + 1;
    }, 0);
}

function testSchedule(schedule, iteration, value, done) {
    // tests produce async behaviour often syncronous
    // this can cause race effects on stream declarations
    // here the iterations are made asynchronous to prevent this
    setTimeout(function() {
        try {
            schedule[iteration](value);
        } catch (error) {
            done.fail(error);
        }
    })
}