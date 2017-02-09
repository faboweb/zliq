define(["require", "exports", "virtual-dom/h", "./streamy"], function (require, exports, h_1, streamy_1) {
    "use strict";
    // TODO check for props are children
    /*
    * wrap hyperscript elements in reactive streams dependent on their children streams
    */
    exports.h = function (tag, props, children) {
        if (!children) {
            return streamy_1.stream(h_1.default(tag, props));
        }
        return streamy_1.merge$(makeChildrenStreams$(children), wrapProps$(props))
            .map(function updateElement(_a) {
            var children = _a[0], props = _a[1];
            return h_1.default(tag, props, [].concat(children));
        });
    };
    /*
    * wrap all children in streams and merge those
    */
    function makeChildrenStreams$(children) {
        // wrap all children in streams
        var children$Arr = [].concat(children).reduce(function makeStream(arr, child) {
            if (child === null || !streamy_1.isStream(child)) {
                return arr.concat(streamy_1.stream(child));
            }
            return arr.concat(child);
        }, []);
        return streamy_1.merge$.apply(void 0, children$Arr).map(function (children) {
            // flatten children array
            children = children.reduce(function (_children, child) {
                return _children.concat(child);
            }, []);
            // TODO maybe add flatmap
            // check if result has streams and if so hook into those streams
            // acts as flatmap from rxjs
            if (children.reduce(function (hasStream, child) {
                if (hasStream)
                    return true;
                return streamy_1.isStream(child) || Array.isArray(child);
            }, false)) {
                return makeChildrenStreams$(children)();
            }
            return children;
        });
    }
    // TODO: refactor, make more understandable
    function wrapProps$(props) {
        if (props === null)
            return streamy_1.stream();
        if (streamy_1.isStream(props)) {
            return props;
        }
        var props$ = Object.keys(props).map(function (propName, index) {
            var value = props[propName];
            if (streamy_1.isStream(value)) {
                return value.map(function (value) {
                    return {
                        key: propName,
                        value: value
                    };
                });
            }
            else {
                if (value !== null && typeof value === 'object') {
                    return wrapProps$(value).map(function (value) {
                        return {
                            key: propName,
                            value: value
                        };
                    });
                }
                return streamy_1.stream({
                    key: propName,
                    value: value
                });
            }
        });
        return streamy_1.merge$.apply(void 0, props$).map(function (props) {
            return props.reduce(function (obj, _a) {
                var key = _a.key, value = _a.value;
                obj[key] = value;
                return obj;
            }, {});
        });
    }
});
//# sourceMappingURL=streamy-hyperscript.js.map