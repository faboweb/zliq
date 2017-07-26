import StackTrace from 'stacktrace-js';


/*
* ATTENTION: Enable sourcemaps in Chrome!!
*
*/
export function shrink_stacktrace() {
    window.onerror = function(msg, file, line, col, error) {
        let stack = error.stack.split('\n');
        // callback is called with an Array[StackFrame]
        StackTrace.fromError(error).then(frames => callback(frames, stack, msg)).catch(errback);

        return true;
    };

    function callback(mappedFrames, nativeStack, msg) {
        let x = 0;
        let filteredFrames = mappedFrames
        .filter((stackLine, i) => mappedFrames[i] && mappedFrames[i].fileName.startsWith(`webpack://`))
        .map(({functionName, columnNumber, fileName, lineNumber}) => {
            let chromeFileDirection = fileName.replace(`webpack://`, `webpack:///.`);
            return `\t${(functionName !== undefined ? functionName  : '(anonymous)')} \t\tat ${chromeFileDirection}:${lineNumber}:${columnNumber}`;
        });

        let message = ['(ZLIQ) ' + msg].concat(filteredFrames).join('\n');
        console.error(message);
    }

    function errback (err) {
        console.error(err);
    };
}