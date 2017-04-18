// run a queue that runs while it has members
// members can be functions or promises
export function PromiseQueue() {
    var current = Promise.resolve();

    return {
        add: (fn) => {
            current = current.then(() => {
                return new Promise((_resolve_, _reject_) => {
                    let result = fn();
                    // enable usage of promises in queue for async behaviour
                    if (result != null && typeof result.then === "function") {
                        result.then(_resolve_);
                    } else {
                        setImmediate(_resolve_)
                    }
                })
            });
            return current;
        }
    }
}

// collect the results from running a set of functions one after another
// call a functions with the results until the end of a certain timeframe
export function timedBatchProcessing(queueFnArr, batchCallback, maxTimePerChunk) {
    let queue = PromiseQueue();
    let results = [];
    maxTimePerChunk = maxTimePerChunk || 200;
    
    let startTime = new Date();
    queueFnArr.forEach(fn => {
        queue.add(() => {
            // if max time for one batch has reached, output the results for that batch
            let now = new Date();
            if ((now - startTime) > maxTimePerChunk) {
                startTime = now;
                batchCallback && batchCallback(results, results.length === queueFnArr.length);
                results = [];
            }
            // fn is a promises 
            if (typeof fn.then === 'function') {
                return fn.then(partial => results = results.concat(fn))
            }
            // fn is a function
            results = results.concat(fn());
        })
    });
    // when the queue is empty return all the results not yet send
    return queue.add(() => {
        if (results.length > 0) {
            batchCallback && batchCallback(results, true);
        }
    });
}