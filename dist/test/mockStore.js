define(["require", "exports", "../src/utils/streamy"], function (require, exports, streamy_1) {
    "use strict";
    exports.mockStore = function (store_value) {
        return {
            $: function (query) { return streamy_1.stream(store_value); },
            dispatch: function (action) {
                return;
            }
        };
    };
});
//# sourceMappingURL=mockStore.js.map