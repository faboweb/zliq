define(["require", "exports", "./streamy"], function (require, exports, streamy_1) {
    "use strict";
    /*
    * simple action -> reducers -> state mashine
    */
    function reduxy(reducers) {
        var action$ = streamy_1.stream({ type: 'INIT' });
        var state$ = streamy_1.stream();
        action$.map(function (action, self) { return reduce(state$, reducers, action); });
        // action$.map((action) => console.log('Action called:', action));
        // state$.map((state) => console.log('New State:', state));
        return {
            // query a value from the store
            // as we probably render according to the values of this store only serve distinct values
            // query format: {reducer}.{property}.{subproperty}
            $: function (query) { return queryStore(state$, query).distinct(); },
            dispatch: function (action) {
                action$(action);
                return;
            }
        };
    }
    exports.reduxy = reduxy;
    /*
    * applies reducers to an action for a state stream
    * the resulting store object has the format { {reducerName}: {reducerValue} }
    */
    function reduce(state$, reducers, action) {
        var reducerNames = Object.getOwnPropertyNames(reducers);
        state$(reducerNames.reduce(function (state, reducer) {
            var newState = state || {};
            newState[reducer] = reducers[reducer](newState[reducer], action);
            return newState;
        }, state$()));
    }
    /*
    * query a value from the streams value
    * query format: {reducer}.{property}.{subproperty}
    */
    function queryStore(state$, query) {
        if (!query)
            return state$;
        return state$.deepSelect(query);
    }
    ;
});
//# sourceMappingURL=reduxy.js.map