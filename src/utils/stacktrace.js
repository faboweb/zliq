import StackTrace from 'stacktrace-js';


/*
* ATTENTION: Enable sourcemaps in Chrome!!
*/
export function shrink_stacktrace() {
    window.onerror = function(msg, file, line, col, error) {
        // callback is called with an Array[StackFrame]
        StackTrace.fromError(error).then(callback).catch(errback);

        return true;
    };

    function callback (frames) {
        // hide things that are not code
        let filtered = frames.filter(({fileName}) => fileName.startsWith(`webpack://`));
        let links = filtered.map(({functionName, columnNumber, fileName, lineNumber}) => `\t${functionName !== undefined ? functionName + ' ' : ''}\tat ${fileName}:${lineNumber}:${columnNumber}`)
        let message = ['ZLIQ encountered an error:'].concat(links).join('\n');
        console.error(message);
    }

    function errback () {};
}