// run a queue that runs while it has members
// members can be functions or promises
export function Queue(startAgg) {
    let running = false;
    let queue = [];
    let agg = startAgg;

    function run(agg) {
        return new Promise((resolve, reject) => {
            if (queue.length < 1) {
                running = false;
                resolve(agg);
                return;
            }
            running = true;
            let fn = queue.shift();
            let result = fn(agg);
            if (typeof result.then === "function") {
                result.then(agg => resolve(run(agg)));
            } else {
                setTimeout(() => run(result).then(agg => resolve(agg)), 1);
            }
        })
    }

    return {
        add: (fn) => {
            queue.push(fn);
            if (!running) {
                run(agg).then(_agg_ => agg = _agg_);
            }
        }
    }
}