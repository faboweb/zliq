import StackTrace from 'stacktrace-js';


/*
* ATTENTION: Enable sourcemaps in Chrome!!
* ATTENTION: Use "devtool: '#inline-source-map'" for webpack -> only config that worked
*/
export function shrink_stacktrace() {
    window.onerror = function(msg, file, line, col, error) {
        StackTrace.fromError(error)
        .then(frames => console.error(formatFrames(frames, msg)))
        .catch(console.error);

        return true;
    };

    function formatFrames(stackFrames, errorMessage) {
        let formatedFrames = stackFrames
        .filter(({fileName}) => fileName.startsWith(`webpack://`))
        .map(({functionName, columnNumber, fileName, lineNumber}) => {
            // chrome does not redirect to the sources with the default webpack sourcemap url in the console
            let chromeFileDirection = fileName.replace(`webpack://`, `webpack:///.`);

            return `\t${(functionName !== undefined ? functionName  : '(anonymous)')} \t\tat ${chromeFileDirection}:${lineNumber}:${columnNumber}`;
        });

        return ['(ZLIQ) ' + errorMessage].concat(formatedFrames).join('\n');
    }
}