(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["zliq"] = factory();
	else
		root["zliq"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _streamy = __webpack_require__(1);

Object.keys(_streamy).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _streamy[key];
    }
  });
});

var _streamyDom = __webpack_require__(3);

Object.keys(_streamyDom).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _streamyDom[key];
    }
  });
});

var _streamyHyperscript = __webpack_require__(10);

Object.keys(_streamyHyperscript).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _streamyHyperscript[key];
    }
  });
});

var _streamyHelpers = __webpack_require__(9);

Object.keys(_streamyHelpers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _streamyHelpers[key];
    }
  });
});

var _router = __webpack_require__(8);

Object.keys(_router).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _router[key];
    }
  });
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.stream = undefined;
exports.merge$ = merge$;
exports.isStream = isStream;

var _deepEqual = __webpack_require__(5);

var _deepEqual2 = _interopRequireDefault(_deepEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/*
* stream constructor
* constructor returns a stream
* get the current value of stream like: stream()
*/
var stream = exports.stream = function stream(init_value) {
	function s(value) {
		if (arguments.length === 0) return s.value;
		update(s, value);
		return s;
	}

	s.IS_STREAM = true;
	s.value = init_value;
	s.listeners = [];

	s.map = function (fn) {
		return map(s, fn);
	};
	s.flatMap = function (fn) {
		return flatMap(s, fn);
	};
	s.filter = function (fn) {
		return filter(s, fn);
	};
	s.deepSelect = function (fn) {
		return deepSelect(s, fn);
	};
	s.distinct = function (fn) {
		return distinct(s, fn);
	};
	s.$ = function (selectorArr) {
		return query(s, selectorArr);
	};
	s.until = function (stopEmit$) {
		return until(s, stopEmit$);
	};
	s.patch = function (partialChange) {
		return patch(s, partialChange);
	};
	s.reduce = function (fn, startValue) {
		return reduce(s, fn, startValue);
	};

	return s;
};

/*
* wrapper for the diffing of stream values
*/
function valuesChanged(oldValue, newValue) {
	return !(0, _deepEqual2.default)(oldValue, newValue);
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
};

/*
* provide a new value to all listeners registered for a stream
*/
function notifyListeners(listeners, value) {
	listeners.forEach(function notifyListener(listener) {
		listener(value);
	});
}

/*
* Do not pipe the value undefined. This allows to wait for an external initialization.
* It also saves you from checking for an initial null on every map function.
*/
function fork$(parent$, mapFunction) {
	var initValue = parent$.value !== undefined ? mapFunction(parent$.value) : undefined;
	return stream(initValue);
}

/*
* provides a new stream applying a transformation function to the value of a parent stream
*/
function map(parent$, fn) {
	var newStream = fork$(parent$, function (value) {
		return fn(value);
	});
	parent$.listeners.push(function mapValue(value) {
		newStream(fn(value));
	});
	return newStream;
}

/*
* provides a new stream applying a transformation function to the value of a parent stream
*/
function flatMap(parent$, fn) {
	var newStream = fork$(parent$, function (value) {
		return fn(value)();
	});
	parent$.listeners.push(function flatMapValue(value) {
		fn(value).map(function updateOuterStream(result) {
			newStream(result);
		});
	});
	return newStream;
}

/*
* provides a new stream that only serves the values that a filter function returns true for
* still a stream ALWAYS has a value -> so it starts at least with NULL
*/
function filter(parent$, fn) {
	var newStream = fork$(parent$, function (value) {
		return fn(value) ? value : undefined;
	});
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

	var newStream = fork$(parent$, function (value) {
		return select(value, selectors);
	});
	parent$.listeners.push(function deepSelectValue(newValue) {
		newStream(select(newValue, selectors));
	});
	return newStream;
};

function query(parent$, selectorArr) {
	if (!Array.isArray(selectorArr)) {
		return deepSelect(parent$, selectorArr);
	}
	return merge$.apply(undefined, _toConsumableArray(selectorArr.map(function (selector) {
		return deepSelect(parent$, selector);
	})));
}

// TODO: maybe refactor with filter
/*
* provide a new stream that only notifys its children if the containing value actualy changes
*/
function distinct(parent$) {
	var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (a, b) {
		return valuesChanged(a, b);
	};

	var newStream = fork$(parent$, function (value) {
		return value;
	});
	parent$.listeners.push(function deepSelectValue(value) {
		if (fn(newStream.value, value)) {
			newStream(value);
		}
	});
	return newStream;
}

/*
* update only the properties of an object passed
* i.e. {name: 'Fabian', lastname: 'Weber} patched with {name: 'Fabo'} produces {name: 'Fabo', lastname: 'Weber}
*/
function patch(parent$, partialChange) {
	if (parent$.value == null) {
		parent$(partialChange);
		return;
	}
	return parent$(Object.assign({}, parent$.value, partialChange));
}

function until(parent$, stopEmitValues$) {
	var newStream = stream(stopEmitValues$.value ? undefined : parent$.value);
	var subscribeTo = function subscribeTo(stream) {
		newStream(parent$.value);
		stream.listeners.push(newStream);
	};
	var unsubscribeFrom = function unsubscribeFrom(stream) {
		var index = stream.listeners.indexOf(newStream);
		if (index !== -1) {
			stream.listeners.splice(index, 1);
		}
	};
	stopEmitValues$.distinct().map(function (stopEmitValues) {
		if (stopEmitValues) {
			unsubscribeFrom(parent$);
		} else {
			subscribeTo(parent$);
		}
	});
	return newStream;
}

/*
* reduce a stream over time
* this will pass the last output value to the calculation function
* reads like the array reduce function
*/
function reduce(parent$, fn, startValue) {
	var aggregate = parent$.value !== undefined ? fn(startValue, parent$.value) : undefined;
	var newStream = stream(aggregate);
	parent$.listeners.push(function reduceValue(value) {
		aggregate = fn(aggregate, parent$.value);
		newStream(aggregate);
	});
	return newStream;
}

/*
* merge several streams into one stream providing the values of all streams as an array
* the merge will only have a value if every stream for the merge has a value
*/
function merge$() {
	for (var _len = arguments.length, streams = Array(_len), _key = 0; _key < _len; _key++) {
		streams[_key] = arguments[_key];
	}

	var values = streams.map(function (parent$) {
		return parent$.value;
	});
	var newStream = stream(values.indexOf(undefined) === -1 ? values : undefined);
	streams.forEach(function triggerMergedStreamUpdate(parent$, index) {
		parent$.listeners.push(function updateMergedStream(value) {
			values[index] = value;
			newStream(values.indexOf(undefined) === -1 ? values : undefined);
		});
	});
	return newStream;
}

function isStream(parent$) {
	return parent$ != null && !!parent$.IS_STREAM;
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = __webpack_require__(0);

Object.keys(_utils).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _utils[key];
    }
  });
});

var _testComponent = __webpack_require__(4);

Object.keys(_testComponent).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _testComponent[key];
    }
  });
});

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.render = render;
exports.diff = diff;
exports.createNode = createNode;

var _streamy = __webpack_require__(1);

var TEXT_NODE = '#text';

function render(component, parentElement) {
	component.vdom$.reduce(function (_ref, _ref2) {
		var oldElement = _ref.element,
		    oldVersion = _ref.version,
		    oldChildren = _ref.children;
		var tag = _ref2.tag,
		    props = _ref2.props,
		    children = _ref2.children,
		    version = _ref2.version;

		if (oldElement === null) {
			oldElement = createNode(tag, children);
			parentElement.appendChild(oldElement);
		}
		diff(oldElement, tag, props, children, version, oldChildren, oldVersion);
		return {
			element: oldElement,
			version: version,
			children: children
		};
	}, {
		element: null,
		version: -1,
		children: []
	});
}

function diff(oldElement, tag, props, newChildren, newVersion, oldChildren, oldVersion) {
	// if the dom-tree hasn't changed, don't process it
	if (newVersion === undefined && newVersion === oldVersion) {
		return oldElement;
	}
	var newElement = oldElement;

	// TODO check performance without equal check
	if (oldElement instanceof window.Text && tag === TEXT_NODE && oldElement.nodeValue !== newChildren[0]) {
		oldElement.nodeValue = newChildren[0];
		return newElement;
	}

	if (oldElement.nodeName.toLowerCase() !== tag) {
		newElement = createNode(tag, newChildren);
		oldElement.parentElement.replaceChild(newElement, oldElement);
		oldChildren = [];
		oldVersion = -1;
	}

	diffAttributes(newElement, props);
	if (tag !== TEXT_NODE && newChildren && newChildren.length > 0) {
		diffChildren(newElement, newChildren, oldChildren);
	}

	return newElement;
}

function diffAttributes(element, props) {
	if (props !== undefined) {
		Object.getOwnPropertyNames(props).map(function applyPropertyToElement(attribute) {
			applyAttribute(element, attribute, props[attribute]);
		});
		cleanupAttributes(element, props);
	}
}

function applyAttribute(element, attribute, value) {
	if (attribute === 'class' || attribute.toLowerCase() === 'classname') {
		element.className = value;
		// we leave the possibility to define styles as strings
		// but we allow styles to be defined as an object
	} else if (attribute === 'style' && typeof value !== "string") {
		Object.assign(element.style, value);
		// other propertys are just added as is to the DOM
	} else {
		// also remove attributes on null to allow better handling of streams
		// streams don't emit on undefined
		if (value === null) {
			element[attribute] = undefined;
		} else {
			// element.setAttribute(attribute, value);
			element[attribute] = value;
		}
	}
}

function cleanupAttributes(element, props) {
	if (element.props !== undefined) {
		for (var attribute in element.props) {
			if (props[attribute] === undefined) {
				element.removeAttribute(attribute);
			}
		}
	}
}

function diffChildren(element, newChildren, oldChildren) {
	var oldChildNodes = element.childNodes;
	var unifiedChildren = newChildren.map(function (child) {
		// if there is no tag we assume it's a number or a string
		if (!(0, _streamy.isStream)(child) && child.tag === undefined) {
			return {
				tag: TEXT_NODE,
				children: [child],
				version: 1
			};
		} else {
			return child;
		}
	});
	var unifiedOldChildren = oldChildren.map(function (child) {
		// if there is no tag we assume it's a number or a string
		if (!(0, _streamy.isStream)(child) && child.tag === undefined) {
			return {
				tag: TEXT_NODE,
				children: [child],
				version: 1
			};
		} else {
			return child;
		}
	});

	// diff existing nodes
	for (var i = 0; i < unifiedOldChildren.length && i < unifiedChildren.length; i++) {
		var oldElement = oldChildNodes[i];
		var _unifiedOldChildren$i = unifiedOldChildren[i],
		    oldVersion = _unifiedOldChildren$i.version,
		    oldChildChildren = _unifiedOldChildren$i.children;
		var _unifiedChildren$i = unifiedChildren[i],
		    tag = _unifiedChildren$i.tag,
		    props = _unifiedChildren$i.props,
		    children = _unifiedChildren$i.children,
		    version = _unifiedChildren$i.version;

		diff(oldElement, tag, props, children, version, oldChildChildren, oldVersion);
	};

	// remove not needed nodes at the end
	for (var _i = unifiedChildren.length; _i < unifiedOldChildren.length; _i++) {
		element.removeChild(element.lastChild);
	}

	// add new nodes
	for (var _i2 = unifiedOldChildren.length; _i2 < unifiedChildren.length; _i2++) {
		var _unifiedChildren$_i = unifiedChildren[_i2],
		    tag = _unifiedChildren$_i.tag,
		    props = _unifiedChildren$_i.props,
		    children = _unifiedChildren$_i.children,
		    version = _unifiedChildren$_i.version;

		var newElement = createNode(tag, children);
		element.appendChild(newElement);
		diff(newElement, tag, props, children, version, [], -1);
	}
}

// create text_nodes from numbers or strings
// create domNodes from regular vdom descriptions
function createNode(tag, children) {
	if (tag === TEXT_NODE) {
		return document.createTextNode(children[0]);
	} else {
		return document.createElement(tag);
	}
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.test = test;

var _src = __webpack_require__(2);

function test(_ref, schedule, done) {
    var vdom$ = _ref.vdom$;

    renderedElement$({ vdom$: vdom$ }).reduce(function (iteration, newElement) {
        if (schedule[iteration] === undefined) {
            throw new Error('Unexpected Update!');
        }
        schedule[iteration](newElement);
        if (schedule.length === iteration + 1) {
            done();
        }

        return iteration + 1;
    }, 0);
}

function renderedElement$(_ref2) {
    var vdom$ = _ref2.vdom$;

    var rendering$ = vdom$.reduce(function (_ref3, _ref4) {
        var oldElement = _ref3.element,
            oldVersion = _ref3.version,
            oldChildren = _ref3.children;
        var tag = _ref4.tag,
            props = _ref4.props,
            children = _ref4.children,
            version = _ref4.version;

        if (oldElement === undefined) {
            oldElement = (0, _src.createNode)(tag, children);
        }
        var newElement = (0, _src.diff)(oldElement, tag, props, children, version, oldChildren, oldVersion);

        return {
            element: oldElement,
            version: version,
            children: children
        };
    }, {
        element: undefined,
        version: -1,
        children: []
    });

    return rendering$.$('element');
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var pSlice = Array.prototype.slice;
var objectKeys = __webpack_require__(7);
var isArguments = __webpack_require__(6);

var deepEqual = module.exports = function (actual, expected, opts) {
  if (!opts) opts = {};
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();

    // 7.3. Other pairs that do not both pass typeof value == 'object',
    // equivalence is determined by ==.
  } else if (!actual || !expected || (typeof actual === 'undefined' ? 'undefined' : _typeof(actual)) != 'object' && (typeof expected === 'undefined' ? 'undefined' : _typeof(expected)) != 'object') {
    return opts.strict ? actual === expected : actual == expected;

    // 7.4. For all other Object pairs, including Array objects, equivalence is
    // determined by having the same number of owned properties (as verified
    // with Object.prototype.hasOwnProperty.call), the same set of keys
    // (although not necessarily the same order), equivalent values for every
    // corresponding key, and an identical 'prototype' property. Note: this
    // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected, opts);
  }
};

function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

function isBuffer(x) {
  if (!x || (typeof x === 'undefined' ? 'undefined' : _typeof(x)) !== 'object' || typeof x.length !== 'number') return false;
  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
    return false;
  }
  if (x.length > 0 && typeof x[0] !== 'number') return false;
  return true;
}

function objEquiv(a, b, opts) {
  var i, key;
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b)) return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return deepEqual(a, b, opts);
  }
  if (isBuffer(a)) {
    if (!isBuffer(b)) {
      return false;
    }
    if (a.length !== b.length) return false;
    for (i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b);
  } catch (e) {
    //happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length) return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i]) return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!deepEqual(a[key], b[key], opts)) return false;
  }
  return (typeof a === 'undefined' ? 'undefined' : _typeof(a)) === (typeof b === 'undefined' ? 'undefined' : _typeof(b));
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var supportsArgumentsClass = function () {
  return Object.prototype.toString.call(arguments);
}() == '[object Arguments]';

exports = module.exports = supportsArgumentsClass ? supported : unsupported;

exports.supported = supported;
function supported(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
};

exports.unsupported = unsupported;
function unsupported(object) {
  return object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) == 'object' && typeof object.length == 'number' && Object.prototype.hasOwnProperty.call(object, 'callee') && !Object.prototype.propertyIsEnumerable.call(object, 'callee') || false;
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports = module.exports = typeof Object.keys === 'function' ? Object.keys : shim;

exports.shim = shim;
function shim(obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }return keys;
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.Router = Router;
exports.initRouter = initRouter;

var _ = __webpack_require__(0);

function interceptLinks(routerState$) {
    // intercepts clicks on links
    // if the link is local '/...' we change the location hash instead
    function interceptClickEvent(e) {
        var target = e.target || e.srcElement;
        if (target.tagName === 'A') {
            var href = target.getAttribute('href');
            var isLocal = href != null && href.startsWith('/');
            var isAnchor = href != null && href.startsWith('#');

            if (isLocal || isAnchor) {
                var _parseLink = parseLink(href),
                    anchor = _parseLink.anchor,
                    route = _parseLink.route,
                    query = _parseLink.query;

                if (route === undefined) {
                    route = routerState$.value.route;
                }
                goTo(routerState$, anchor, route, query);
                //tell the browser not to respond to the link click
                e.preventDefault();
            }
        }
    }

    // react to HTML5 go back and forward events
    window.onpopstate = function (event) {
        if (event.state) {
            var _event$state = event.state,
                route = _event$state.route,
                query = _event$state.query;

            dispatchRouteChange(routerState$, route, query);
        }
    };

    // listen for link click events at the document level
    document.addEventListener('click', interceptClickEvent);

    // react to initial routing info
    if (location.pathname !== '/' || location.search !== "") {
        // construct initial routing link
        var href = location.pathname + location.search + location.hash;

        var _parseLink2 = parseLink(location.pathname + location.search + location.hash),
            route = _parseLink2.route,
            query = _parseLink2.query;

        dispatchRouteChange(routerState$, route, query);
    }
}

// TODO refactor
function getUrlParams(hash, search) {
    // match query params in urls like:
    // http://localhost:8080/?code=e4a4f94f008a92f12221&code2=abc#/location?code=e4a4f94f008a92f12221&code2=abc
    // the query could be set internaly; then it would be behind the #
    // the query could be set at start; then it would be before the #
    var urlRegex = /(#\/\w*)?(\?(\w+=\w*)(&\w+=\w*)*)+(#\w+)?/g;
    var regExResultHash = RegExp(urlRegex).exec(hash);
    var regExResultSearch = RegExp(urlRegex).exec(search);

    // merge all query params before and after the hash
    var vars = regExResultHash && regExResultHash[3] != null ? regExResultHash[3].split('&') : [];
    vars = regExResultSearch && regExResultSearch[3] != null ? vars.concat(regExResultSearch[3].split('&')) : vars;

    var params = {};
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof params[pair[0]] === "undefined") {
            params[pair[0]] = decodeURIComponent(pair[1]);
            // If second entry with this name
        } else if (typeof params[pair[0]] === "string") {
            var arr = [params[pair[0]], decodeURIComponent(pair[1])];
            params[pair[0]] = arr;
            // If third or later entry with this name
        } else {
            params[pair[0]].push(decodeURIComponent(pair[1]));
        }
    }
    return params;
}

// this is an element that shows it's content only if the expected route is met
function Router(_ref, children$) {
    var router$ = _ref.router$,
        route = _ref.route;

    if (router$ == null) {
        console.log('The Router component needs the routerState$ as attribute.');
        return null;
    }
    if (route == null) {
        console.log('The Router component needs the route as attribute.');
        return null;
    }
    // Register the route
    // this is necessary to decide on a default route
    router$.$('routes')
    // routes can be attached async so we check if the route exists and if not add it
    .map(function (routes) {
        return routes.indexOf(route) === -1 && router$.patch({ routes: routes.concat(route) });
    });

    // check if no registered route was hit and set default if so
    var sanitizedRoute$ = router$.map(function (_ref2) {
        var route = _ref2.route,
            routes = _ref2.routes;

        if (routes.indexOf(route) === -1) {
            return '/';
        }
        return route;
    });

    var routeWasHit$ = (0, _.is$)(sanitizedRoute$, route).distinct();
    return (0, _.merge$)(routeWasHit$, children$).map(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            wasHit = _ref4[0],
            children = _ref4[1];

        return wasHit ? children : [];
    });
}

function initRouter() {
    var routerState$ = (0, _.stream)({
        route: '',
        params: {},
        routes: ['/']
    });

    interceptLinks(routerState$);

    return routerState$;
}

// matching links in the form of /route/subroute?param1=a&param2=b#anchor
function parseLink(link) {
    var regexp = /((\/\w*)*)?(\?((\w+=\w*)(&(\w+=\w*)+)*))?(#(\w+))?/;
    var matchArr = regexp.exec(link);
    return {
        anchor: matchArr[9],
        route: matchArr[1],
        query: matchArr[4]
    };
}

// callback for HTML5 navigation events
// save the routing info in the routerState
function dispatchRouteChange(routerState$, route, query) {
    // remove hash
    var href = location.hash.substr(1);
    routerState$.patch({
        route: route || '',
        params: getUrlParams(href, location.search)
    });
}

function goTo(routerState$, anchor, route, query) {
    history.pushState({ anchor: anchor, route: route, query: query }, '', '/' + (route ? route.substr(1) : '') + (query ? '?' + query : ''));
    if (anchor) {
        location.hash = '#' + anchor;
    }
    dispatchRouteChange(routerState$, route, query);
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.promise$ = undefined;
exports.if$ = if$;
exports.join$ = join$;
exports.is$ = is$;

var _ = __webpack_require__(0);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// wrapper around promises to provide an indicator if the promise is running
var promise$ = exports.promise$ = function promise$(promise) {
	var output$ = (0, _.stream)({
		loading: true,
		error: null,
		data: null
	});

	promise.then(function (result) {
		output$.patch({
			loading: false,
			data: result
		});
	}, function (error) {
		output$.patch({
			loading: false,
			error: error
		});
	});

	return output$;
};

// provide easy switched on boolean streams
// example use case: <button onclick={()=>open$(!open$())}>{if$(open$, 'Close', 'Open')}</button>
function if$(stream, onTrue, onFalse) {
	return stream.map(function (x) {
		return x ? onTrue || null : onFalse || null;
	});
}

// join a mixed array of strings and streams of strings
// example use case: <div class={join$('container', if$(open$, 'open', 'closed'))} />
function join$() {
	for (var _len = arguments.length, arr = Array(_len), _key = 0; _key < _len; _key++) {
		arr[_key] = arguments[_key];
	}

	var $arr = arr.map(function (item) {
		if (item === null || item === undefined) {
			return (0, _.stream)('');
		}
		if (item.IS_STREAM) {
			return item;
		}
		return (0, _.stream)(item);
	});
	return _.merge$.apply(undefined, _toConsumableArray($arr)).map(function (arr) {
		return arr.join(' ');
	});
}

// make it easy to check a stream for a value
// returns a boolean
function is$(stream, value) {
	return stream.map(function (x) {
		return x === value;
	});
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.h = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.flatten = flatten;
exports.mixedMerge$ = mixedMerge$;

var _streamy = __webpack_require__(1);

var _streamyDom = __webpack_require__(3);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/*
* wrap hyperscript elements in reactive streams dependent on their children streams
*/
var h = exports.h = function h(tag, props) {
	for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
		children[_key - 2] = arguments[_key];
	}

	var deleted$ = (0, _streamy.stream)(false);
	var component = void 0;

	// let childrenWithDetacher = addStreamDetacher(flatten(children), deleted$);
	var mergedChildren$ = mergeChildren$(flatten(children));
	// jsx usually resolves known tags as strings and unknown tags as functions
	// if it is a sub component, resolve that component
	if (typeof tag === 'function') {
		component = tag(props, mergedChildren$, deleted$);
	} else {
		// add detachers to props
		props !== null && Object.keys(props).map(function (propName, index) {
			if ((0, _streamy.isStream)(props[propName])) {
				props[propName] = props[propName].until(deleted$);
			}
		});
		component = {
			vdom$: (0, _streamy.merge$)(wrapProps$(props, deleted$).distinct(), mergedChildren$.map(flatten)).map(function (_ref) {
				var _ref2 = _slicedToArray(_ref, 2),
				    props = _ref2[0],
				    children = _ref2[1];

				return {
					tag: tag,
					props: props,
					children: children,
					version: guid()
				};
			})
		};
	}

	return component;
};

function addStreamDetacher(obj, deleted$) {
	if (obj === null || obj === undefined) return obj;
	if (Array.isArray(obj)) {
		return obj.map(function (item) {
			if ((0, _streamy.isStream)(item)) {
				return item.until(deleted$);
			}
			return item;
		});
	}
	Object.keys(obj).map(function (propName, index) {
		if ((0, _streamy.isStream)(obj[propName])) {
			obj[propName] = obj[propName].until(deleted$);
		}
	});
	return obj;
}

// input has format [stream | {vdom$}]
function mergeChildren$(children) {
	if (!Array.isArray(children)) {
		children = [children];
	}
	children = flatten(children);
	var childrenVdom$arr = children.map(function (child) {
		if ((0, _streamy.isStream)(child)) {
			return child.flatMap(mergeChildren$);
		}
		return child.vdom$ || child;
	});

	return mixedMerge$.apply(undefined, _toConsumableArray(childrenVdom$arr));
}

/*
* wrap all children in streams and merge those
* we make sure that all children streams are flat arrays to make processing uniform
* output: stream([stream([])])
*/
function getChildrenVdom$arr(childrenArr, deleted$) {
	var _ref3;

	// flatten children arr
	// needed to make react style hyperscript (children as arguments) working parallel to preact style hyperscript (children as array)
	childrenArr = (_ref3 = []).concat.apply(_ref3, _toConsumableArray(childrenArr));
	// only handle vdom for now
	var children$Arr = childrenArr.map(function (component) {
		// TODO
		// if (component.IS_STREAM) {
		// 	return
		// }
		// if there is no vdom$ it is a string or number
		if (component.vdom$ === undefined) {
			return (0, _streamy.stream)(component);
		}
		return component.vdom$;
	});

	return children$Arr
	// unsubscribe on the child when deleted
	.map(function (vdom$) {
		return vdom$.until(deleted$);
	})
	// make sure children are arrays and not nest
	.map(function (_) {
		return makeArray(_).map(flatten);
	})
	// so we can easily merge them
	.map(function (vdom$) {
		return vdom$.flatMap(function (vdomArr) {
			return mixedMerge$.apply(undefined, _toConsumableArray(vdomArr));
		});
	});
}

// make sure all children are handled as streams
// so we can later easily merge them
function makeStreams(childrenArr) {
	return childrenArr.map(function (child) {
		if (child === null || !(0, _streamy.isStream)(child)) {
			return (0, _streamy.stream)(child);
		}
		return child;
	});
}

// converts an input into an array
function makeArray(stream) {
	return stream.map(function (value) {
		if (value == null) {
			return [];
		}
		if (!Array.isArray(value)) {
			return [value];
		}
		return value;
	});
}

// flattens an array
function flatten(arr) {
	while (arr.some(function (value) {
		return Array.isArray(value);
	})) {
		var _ref4;

		arr = (_ref4 = []).concat.apply(_ref4, _toConsumableArray(arr));
	}
	return arr;
}

/*
* Wrap props into one stream
*/
function wrapProps$(props, deleted$) {
	if (props === null) return (0, _streamy.stream)({});
	if ((0, _streamy.isStream)(props)) {
		return props.until(deleted$);
	}

	// go through all the props and make them a stream
	// if they are objects, traverse them to check if they include streams
	var props$Arr = Object.keys(props).map(function (propName, index) {
		var value = props[propName];
		if ((0, _streamy.isStream)(value)) {
			return value.until(deleted$).map(function (value) {
				return {
					key: propName,
					value: value
				};
			});
		} else {
			// if it's an object, traverse the sub-object making it a stream
			if (value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
				return wrapProps$(value, deleted$).map(function (value) {
					return {
						key: propName,
						value: value
					};
				});
			}
			// if it's a plain value wrap it in a stream
			return (0, _streamy.stream)({
				key: propName,
				value: value
			});
		}
	});
	// merge streams of all properties
	// on changes, reconstruct the properties object from the properties
	return _streamy.merge$.apply(undefined, _toConsumableArray(props$Arr)).map(function (props) {
		return props.reduce(function (obj, _ref5) {
			var key = _ref5.key,
			    value = _ref5.value;

			obj[key] = value;
			return obj;
		}, {});
	});
}

function mixedMerge$() {
	for (var _len2 = arguments.length, potentialStreams = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
		potentialStreams[_key2] = arguments[_key2];
	}

	var values = potentialStreams.map(function (parent$) {
		return parent$.IS_STREAM ? parent$.value : parent$;
	});
	var actualStreams = potentialStreams.reduce(function (streams, potentialStream, index) {
		if (potentialStream.IS_STREAM) {
			streams.push({
				stream: potentialStream,
				index: index
			});
		}
		return streams;
	}, []);
	var newStream = (0, _streamy.stream)(values.indexOf(undefined) === -1 ? values : undefined);
	actualStreams.forEach(function triggerMergedStreamUpdate(_ref6) {
		var stream = _ref6.stream,
		    index = _ref6.index;

		stream.listeners.push(function updateMergedStream(value) {
			values[index] = value;
			newStream(values.indexOf(undefined) === -1 ? values : undefined);
		});
	});
	return newStream;
}

function guid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

/***/ })
/******/ ]);
});