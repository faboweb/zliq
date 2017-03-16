export function Queue() {
    let running = false;
    let queue = [];

    function run() {
        if (queue.length < 1) {
            running = false;
            return;
        }
        running = true;
        let fn = queue.shift();
        if (typeof fn.then === "function") {
            fn.then(() => run());
        } else {
            fn();
            setTimeout(run, 1);
        }
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