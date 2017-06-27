import StackTrace from 'stacktrace-js';

export function shrink_stacktrace() {
    StackTrace.get().then(callback).catch(()=>null);

    function callback (frames) {
        console.log(frames);
    }
}