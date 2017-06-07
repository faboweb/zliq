import { h, stream, merge$, if$, REMOVED } from '../src';

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
        merge$(myStream).map(myMock);
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
        merge$(myStream).map(myMock);

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
})