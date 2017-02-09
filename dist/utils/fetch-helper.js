define(["require", "exports"], function (require, exports) {
    "use strict";
    /*
    * middleware to log the user out if not authorized
    * returns a middleware that sets the token stream value to null if the request is not authenticated
    */
    function isAuthenticated(token$) {
        return function (res) {
            if (res.status === 401) {
                token$ && token$(null);
            }
            return res;
        };
    }
    ;
    /*
    * wrapper for LOADING -> SUCCESS / FAILED actions
    * also adds oauth header for a provided oauth-token stream
    */
    exports.easyFetch = function (store, token$) { return function (request, actionType) {
        store.dispatch({ type: actionType + '_LOADING' });
        var options = {
            method: request.method || 'GET',
            headers: Object.assign(token$ && token$() ? {
                'Authentication': "Bearer " + token$()
            } : {}, request.headers),
            mode: 'cors',
            cache: request.cache || 'default'
        };
        fetch(request.url, options)
            .then(isAuthenticated(token$))
            .then(function (res) { return res.json(); })
            .then(function (body) {
            store.dispatch({ type: actionType + '_SUCCESS', payload: body });
        });
    }; };
    /*
    * enrich a reducer with LOADING -> SUCCESS / FAILED for a certain prefix
    * sets a {prefix}_loading flag
    * sets a {prefix}_message on errors
    * on success provides a action of type {prefix} to the wrapped reducer
    * use like: fetchMiddleware('users', usersReducer)
    */
    function fetchMiddleware(prefix, reducer) {
        return function (state, _a) {
            var type = _a.type, payload = _a.payload;
            var output = state;
            switch (type) {
                case prefix + '_LOAD':
                    output[prefix.toLowerCase() + '_loading'] = true;
                case prefix + '_SUCCESS':
                    output[prefix.toLowerCase() + '_loading'] = false;
                    type = prefix;
                case prefix + '_FAILURE':
                    output[prefix.toLowerCase() + '_loading'] = false;
                    output[prefix.toLowerCase() + '_message'] = payload.message;
            }
            return reducer(output, { type: type, payload: payload });
        };
    }
    exports.fetchMiddleware = fetchMiddleware;
});
//# sourceMappingURL=fetch-helper.js.map