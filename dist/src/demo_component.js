define(["require", "exports", "./utils/streamy-hyperscript", "./reducers/clicks", "./component.scss"], function (require, exports, streamy_hyperscript_1, clicks_1) {
    "use strict";
    // component returning a stream
    exports.CleverComponent = function (_a) {
        var store = _a.sinks.store;
        return store.$('clicks.clicks').map(function (clicks) {
            return streamy_hyperscript_1.h("div", null,
                "Clicks again ",
                clicks);
        });
    };
    // component returning a hyperscript element but interacting with the state
    exports.DumbComponent = function (_a) {
        var store = _a.sinks.store;
        return streamy_hyperscript_1.h("button", { onclick: function () { return store.dispatch({ type: clicks_1.SUBTRACKED }); } }, "subtracked");
    };
    // component not interacting with anything -> plain hyperscript
    exports.SuperDumbComponent = streamy_hyperscript_1.h("p", null, "HELLO WORLD");
});
//# sourceMappingURL=demo_component.js.map