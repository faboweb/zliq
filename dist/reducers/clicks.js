define(["require", "exports", "../utils/fetch-helper"], function (require, exports, fetch_helper_1) {
    "use strict";
    exports.CLICK = 'CLICK';
    exports.FETCHED = 'FETCHED';
    exports.SUBTRACKED = 'SUBTRACKED';
    var INITIAL_STORE = {
        clicks: 0
    };
    function clicksReducer(_state, _a) {
        var type = _a.type, payload = _a.payload;
        var state = _state || INITIAL_STORE;
        switch (type) {
            case exports.CLICK: return Object.assign({}, state, {
                clicks: ++state.clicks
            });
            case exports.SUBTRACKED: return Object.assign({}, state, {
                clicks: --state.clicks
            });
            case exports.FETCHED: return Object.assign({}, state, {
                fetched: payload
            });
        }
        return state;
    }
    exports.clicks = fetch_helper_1.fetchMiddleware(exports.FETCHED, clicksReducer);
});
//# sourceMappingURL=clicks.js.map