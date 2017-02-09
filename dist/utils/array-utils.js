define(["require", "exports"], function (require, exports) {
    "use strict";
    /*
    * replaces a value at a specific index in an array
    */
    function replace(arr, index, value) {
        var newArr = [].concat(arr);
        newArr.splice(index, 1, value);
        return newArr;
    }
    exports.replace = replace;
});
//# sourceMappingURL=array-utils.js.map