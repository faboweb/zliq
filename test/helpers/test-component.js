import {diff, createNode, render} from '../../src'

export function testRender(vdom$, schedule, done) {
    let container = document.createElement('div');
    return test$(render(vdom$, container, 0), schedule, done);
}

export function test$(stream, schedule, done) {
    return stream.reduce(function(iteration, value) {
        if (schedule[iteration] === undefined) {
            done.fail('Unexpected Update!');
        }

        testSchedule(schedule, iteration, value, done);

        return iteration + 1;
    }, 0);
}

function testSchedule(schedule, iteration, value, done) {
    // tests produce async behaviour often syncronous
    // this can cause race effects on stream declarations
    // here the iterations are made asynchronous to prevent this
    setTimeout(function() {
        try {
            if (typeof schedule[iteration] === 'function') {
                schedule[iteration](value)
            } else {
                expect(value).toEqual(schedule[iteration])
            }
        } catch (error) {
            done.fail(error);
        }
        
        if (schedule.length === iteration + 1 && done) {
            done();
        }
    })
}