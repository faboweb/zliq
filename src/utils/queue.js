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
            let result = fn();
            // enable usage of promises in queue for async behaviour
            if (result != null && typeof result.then === "function") {
                result.then(() => resolve(run()));
            } else {
                resolve(run());
            }
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