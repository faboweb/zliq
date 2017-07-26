import StackTrace from 'stacktrace-js';


/*
* ATTENTION: Enable sourcemaps in Chrome!!
*/
export function shrink_stacktrace() {
    window.onerror = function(msg, file, line, col, error) {
        let stack = error.stack.split('\n');
        // callback is called with an Array[StackFrame]
        StackTrace.fromError(error).then(frames => callback(frames, stack)).catch(errback);

        return true;
    };

    function callback(mappedFrames, nativeStack) {
        let x = 0;
        let filteredFrames = mappedFrames
        .filter((stackLine, i) => mappedFrames[i] && mappedFrames[i].fileName.startsWith(`webpack://`))
        .map(frame => {
            frame.fileName = frame.fileName.replace(`webpack://`, `webpack:///.`);
            return frame;
        })
        // remove error message
        filteredFrames.splice(0,1);

        let message = ['ZLIQ encountered an error:'].concat(filteredFrames).join('\n');
        console.error(message);
    }

    function errback (err) {
        console.error(err);
    };
}