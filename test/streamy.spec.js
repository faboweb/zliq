import { stream, merge$ } from '../src';

describe('Streamy', () => {
    it('shouldnt trigger listeners on undefined', (done)=> {
        const myMock = jest.fn();
        let myStream = stream();
        myStream.map(myMock);
        myStream.flatMap(stream().map(myMock));
        myStream.filter(myMock);
        myStream.deepSelect('').map(myMock);
        myStream.distinct(myMock);
        myStream.reduce(myMock, null);
        merge$(myStream).map(myMock);

        setTimeout(()=> {
            expect(myMock.mock.calls.length).toBe(0);
            myStream.map(() => {
                expect(myMock.mock.calls.length).toBe(7);
                done()
            });
            myStream({test: 1});
        }, 1)
    })
})