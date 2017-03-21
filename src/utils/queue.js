// run a queue that runs while it has members
// members can be functions or promises
export function Queue() {
    let running = false;
    let queue = [];

    function run() {
        return new Promise((resolve, reject) => {
            if (queue.length < 1) {
                running = false;
                resolve();
                return;
            }
            running = true;
            let fn = queue.shift();
            setImmediate(() => {
                let result = fn();
                // enable usage of promises in queue for async behaviour
                if (result != null && typeof result.then === "function") {
                    result.then(() => run().then(resolve));
                } else {
                    run().then(resolve);
                }
            });
        })
    }

    return {
        add: (fn) => {
            queue.push(fn);
            if (!running) {
                run();
            }
        }
    }
}

export function batchAsyncQueue(queueFnArr, batchCallback, maxTimePerChunk) {
    let queue = Queue();
    let results = [];
    maxTimePerChunk = maxTimePerChunk || 200;
    
    let startTime = now();
    return new Promise((resolve, reject) => {
        queueFnArr.forEach(fn => {
            queue.add(() => {
                if ((now() - startTime) > maxTimePerChunk) {
                    startTime = now();
                    batchCallback && batchCallback(results);
                    results = [];
                }
                if (typeof fn.then === 'function') {
                    return fn.then(partial => results.concat(fn))
                }
                results.push(fn());
            })
        });
        queue.add(() => {
            if (results.length > 0) {
                batchCallback && batchCallback(results);
            }
            resolve();
        });
    })
} 
			
function now() {
	return new Date().getTime();
}