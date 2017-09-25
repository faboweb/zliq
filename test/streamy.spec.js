import { h, stream, merge$, if$, REMOVED } from '../src';
import { test$ } from './helpers/test-component.js';

describe('Streamy', () => {
    it('should trigger listeners on initial value', (done)=> {
        const myMock = jest.fn();
        let myStream = stream({test: 1});
        myStream.map(myMock);
        myStream.flatMap((value) => stream(value).map(myMock));
        myStream.filter(myMock);
        myStream.deepSelect('test').map(myMock);
        // myStream.distinct().map(myMock);
        myStream.reduce(myMock, null);
        merge$([myStream]).map(myMock);
        myStream.map(() => {
            expect(myMock.mock.calls.length).toBe(6);
            done();
        });
    })

    it('shouldnt trigger listeners on undefined', (done)=> {
        const myMock = jest.fn();
        let myStream = stream();
        myStream.map(myMock);
        myStream.flatMap((value) => stream(value).map(myMock));
        myStream.filter(myMock);
        myStream.deepSelect('test').map(myMock);
        // myStream.distinct().map(myMock);
        myStream.reduce(myMock, null);
        merge$([myStream]).map(myMock);

        expect(myMock.mock.calls.length).toBe(0);
        myStream.map(() => {
            expect(myMock.mock.calls.length).toBe(6);
            done()
        });
        myStream({test: 1});
    })

    it('shouldnt trigger listeners for negative .until triggers', () => {
        const myMock = jest.fn();
        let myStream = stream('HALLO');
        let myTrigger = stream(false);
        myStream.until(myTrigger).map(myMock);
        expect(myStream.listeners.length).toBe(1);
        expect(myMock.mock.calls.length).toBe(1);
        myTrigger(true);
        expect(myStream.listeners.length).toBe(0);
        expect(myMock.mock.calls.length).toBe(1);
        myStream('WORLD');
        expect(myMock.mock.calls.length).toBe(1);
    })

    describe('is-operator', () => {
        it('should emit true if value is matched', (done)=> {
            stream('foo').is('foo').map(x => {
                expect(x).toBe(true);
                done();
            })
        });
        it('should emit false if value is not matched', (done)=> {
            stream('foo').is('bar').map(x => {
                expect(x).toBe(false);
                done();
            })
        });
    });

    it('should emit aggregates on reduce', (done)=> {
        let myStream = stream();
        let agg$ = myStream.reduce((agg, cur) => {
            return agg + cur;
        }, 0);
        test$(agg$, [
            x => {
                expect(x).toBe(1);
                setImmediate(() => myStream(2));
            },
            x => {
                expect(x).toBe(3);
            }
        ], done)
        myStream(1);
    })

    it('should debounce values', (done)=> {
        let myStream = stream(1);
        const myMock = jest.fn();
        let debounced$ = myStream.debounce(50);
        debounced$.map(myMock);
        test$(debounced$, [
            x => expect(x).toBe(2)
        ], done);
        myStream(2);
    })
})