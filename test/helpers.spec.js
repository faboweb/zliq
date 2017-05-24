import { h, stream, promise$, if$, merge$, join$ } from '../src';
import assert from 'assert';

describe('Helpers', () => {
    describe('promise$', () => {
        it('should indicate loading', (done)=> {
            let done$ = stream(false);
            let promise = new Promise((resolve, reject) => {
                done$.map(x => {
                    x && resolve()
                });
            });
            let request$ = promise$(promise);
            let call = 0;
            request$.map(({loading}) => {
                if (call === 0) {
                    assert.equal(loading, true);
                    done$(true);
                }
                if (call === 1) {
                    assert.equal(loading, false);
                    done();
                }
                call++;
            })
        });
        it('should deliver data', (done)=> {
            let done$ = stream(true);
            let promise = Promise.resolve('Data');
            let request$ = promise$(promise);
            request$.map(({loading, data}) => {
                if (loading === false) {
                    assert.equal(data, 'Data');
                    done();
                }
            })
        });
        it('should deliver errors', (done)=> {
            let done$ = stream(true);
            let promise = Promise.reject('Error');
            let request$ = promise$(promise);
            request$.map(({loading, error}) => {
                if (loading === false) {
                    assert.equal(error, 'Error');
                    done();
                }
            })
        });
    });

    describe('if$', () => {
        it('should switch on boolean streams', (done)=> {
            let result$ = stream(false);
            let call = 0;
            if$(result$, 'True', 'False')
                .map(output => {
                    if (call === 0) {
                        assert.equal(output, 'False');
                        done();
                    }
                    if (call === 1) {
                        assert.equal(output, 'True');
                        result$(true);
                    }
                    call++;
                })
        })
        it('should switch on empty streams', (done)=> {
            let result$ = stream(null);
            let call = 0;
            if$(result$, 'True', 'False')
                .map(output => {
                    if (call === 0) {
                        assert.equal(output, 'False');
                        done();
                    }
                    if (call === 1) {
                        assert.equal(output, 'True');
                        result$({param:'value'});
                    }
                    call++;
                })
        })
    });

    describe('join$', () => {
        it('should join string', (done)=> {
            join$('a','b').map(x => {
                assert.equal(x, 'a b');
                done();
            })
        });
        it('should join mixed content', (done)=> {
            join$('a',stream('b')).map(x => {
                assert.equal(x, 'a b');
                done();
            })
        });
    });
})