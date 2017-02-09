define(["require", "exports", "deep-equal"], function (require, exports, deep_equal_1) {
    "use strict";
    /*
    * stream constructor
    * constructor returns a stream
    * get the current value of stream like: stream()
    */
    exports.stream = function (init_value) {
        function s(value) {
            if (arguments.length === 0)
                return s.value;
            update(s, value);
            return s;
        }
        s.IS_STREAM = true;
        s.value = init_value !== null ? init_value : null;
        s.listeners = [];
        s.map = function (fn) { return map(s, fn); };
        s.filter = function (fn) { return filter(s, fn); };
        s.deepSelect = function (fn) { return deepSelect(s, fn); };
        s.distinct = function (fn) { return distinct(s, fn); };
        s.notEmpty = function () { return notEmpty(s); };
        return s;
    };
    /*
    * wrapper for the diffing of stream values
    */
    function valuesChanged(oldValue, newValue) {
        return !deep_equal_1.default(oldValue, newValue);
    }
    /*
    * update the stream value and notify listeners on the stream
    */
    function update(parent$, newValue) {
        if (newValue === undefined) {
            return parent$.value;
        }
        parent$.value = newValue;
        notifyListeners(parent$.listeners, newValue);
    }
    ;
    /*
    * provide a new value to all listeners registered for a stream
    */
    function notifyListeners(listeners, value) {
        listeners.forEach(function notifyListener(listener) {
            listener(value);
        });
    }
    /*
    * provides a new stream applying a transformation function to the value of a parent stream
    */
    function map(parent$, fn) {
        var newStream = exports.stream(fn(parent$.value));
        parent$.listeners.push(function mapValue(value) {
            newStream(fn(value));
        });
        return newStream;
    }
    /*
    * provides a new stream that only serves the values that a filter function returns true for
    * still a stream ALWAYS has a value -> so it starts at least with NULL
    */
    function filter(parent$, fn) {
        var newStream = exports.stream(fn(parent$.value) ? parent$.value : null);
        parent$.listeners.push(function filterValue(value) {
            if (fn(value)) {
                newStream(value);
            }
        });
        return newStream;
    }
    /*
    * provides a new stream that has a selected sub property of the object value of the parent stream
    * the selector has the format [{propertyName}.]*
    */
    function deepSelect(parent$, selector) {
        var selectors = selector.split('.');
        function select(parent, selectors) {
            return selectors.reduce(function (input, selector) {
                return input[selector];
            }, parent);
        }
        var newStream = exports.stream(select(parent$.value, selectors));
        parent$.listeners.push(function deepSelectValue(value) {
            newStream(select(value, selectors));
        });
        return newStream;
    }
    ;
    // TODO: maybe refactor with filter
    /*
    * provide a new stream that only notifys its children if the containing value actualy changes
    */
    function distinct(parent$, fn) {
        if (fn === void 0) { fn = function (a, b) { return valuesChanged(a, b); }; }
        var newStream = exports.stream(parent$.value);
        parent$.listeners.push(function deepSelectValue(value) {
            if (fn(newStream.value, value)) {
                newStream(value);
            }
        });
        return newStream;
    }
    /*
    * merge several streams into one stream providing the values of all streams as an array
    */
    function merge$() {
        var streams = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            streams[_i] = arguments[_i];
        }
        var values = streams.map(function (parent$) { return parent$.value; });
        var newStream = exports.stream(values);
        streams.forEach(function triggerMergedStreamUpdate(parent$, index) {
            parent$.listeners.push(function updateMergedStream(value) {
                newStream(streams.map(function (parent$) { return parent$.value; }));
            });
        });
        return newStream;
    }
    exports.merge$ = merge$;
    function isStream(parent$) {
        return parent$ != null && !!parent$.IS_STREAM;
    }
    exports.isStream = isStream;
});
//# sourceMappingURL=streamy.js.map