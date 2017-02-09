/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

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

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.clicks = exports.SUBTRACKED = exports.FETCHED = exports.CLICK = undefined;

var _fetchHelper = __webpack_require__(5);

var CLICK = exports.CLICK = 'CLICK';
var FETCHED = exports.FETCHED = 'FETCHED';
var SUBTRACKED = exports.SUBTRACKED = 'SUBTRACKED';

var INITIAL_STORE = {
	clicks: 0
};

function clicksReducer(_state, _ref) {
	var type = _ref.type,
	    payload = _ref.payload;

	var state = _state || INITIAL_STORE;
	switch (type) {
		case CLICK:
			return Object.assign({}, state, {
				clicks: ++state.clicks
			});
		case SUBTRACKED:
			return Object.assign({}, state, {
				clicks: --state.clicks
			});
		case FETCHED:
			return Object.assign({}, state, {
				fetched: payload
			});
	}

	return state;
}

var clicks = exports.clicks = (0, _fetchHelper.fetchMiddleware)(FETCHED, clicksReducer);

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

var _deepEqual = __webpack_require__(11);

var _deepEqual2 = _interopRequireDefault(_deepEqual);

var _arrayUtils = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
	s.value = init_value !== null ? init_value : null;
	s.listeners = [];

	s.map = function (fn) {
		return map(s, fn);
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
	s.notEmpty = function () {
		return notEmpty(s);
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
* provides a new stream applying a transformation function to the value of a parent stream
*/
function map(parent$, fn) {
	var newStream = stream(fn(parent$.value));
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
	var newStream = stream(fn(parent$.value) ? parent$.value : null);
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

	var newStream = stream(select(parent$.value, selectors));
	parent$.listeners.push(function deepSelectValue(value) {
		newStream(select(value, selectors));
	});
	return newStream;
};

// TODO: maybe refactor with filter
/*
* provide a new stream that only notifys its children if the containing value actualy changes
*/
function distinct(parent$) {
	var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (a, b) {
		return valuesChanged(a, b);
	};

	var newStream = stream(parent$.value);
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
	for (var _len = arguments.length, streams = Array(_len), _key = 0; _key < _len; _key++) {
		streams[_key] = arguments[_key];
	}

	var values = streams.map(function (parent$) {
		return parent$.value;
	});
	var newStream = stream(values);
	streams.forEach(function triggerMergedStreamUpdate(parent$, index) {
		parent$.listeners.push(function updateMergedStream(value) {
			newStream(streams.map(function (parent$) {
				return parent$.value;
			}));
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

var map = {
	"./demo_component.spec.js": 7
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 2;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.SuperDumbComponent = exports.DumbComponent = exports.CleverComponent = undefined;

var _streamyHyperscript = __webpack_require__(6);

var _clicks = __webpack_require__(0);

__webpack_require__(9);

// component returning a stream
var CleverComponent = exports.CleverComponent = function CleverComponent(_ref) {
	var store = _ref.sinks.store;

	return store.$('clicks.clicks').map(function (clicks) {
		return (0, _streamyHyperscript.h)(
			'div',
			null,
			['Clicks again ', clicks]
		);
	});
};

// component returning a hyperscript element but interacting with the state
var DumbComponent = exports.DumbComponent = function DumbComponent(_ref2) {
	var store = _ref2.sinks.store;
	return (0, _streamyHyperscript.h)(
		'button',
		{ onclick: function onclick() {
				return store.dispatch({ type: _clicks.SUBTRACKED });
			} },
		['subtracked']
	);
};

// component not interacting with anything -> plain hyperscript
var SuperDumbComponent = exports.SuperDumbComponent = function SuperDumbComponent() {
	return (0, _streamyHyperscript.h)(
		'p',
		null,
		['HELLO WORLD']
	);
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.replace = replace;
/*
* replaces a value at a specific index in an array
*/
function replace(arr, index, value) {
	var newArr = [].concat(arr);
	newArr.splice(index, 1, value);
	return newArr;
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.fetchMiddleware = fetchMiddleware;
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

/*
* wrapper for LOADING -> SUCCESS / FAILED actions
* also adds oauth header for a provided oauth-token stream
*/
var easyFetch = exports.easyFetch = function easyFetch(store, token$) {
	return function (request, actionType) {
		store.dispatch({ type: actionType + '_LOADING' });

		var options = {
			method: request.method || 'GET',
			headers: Object.assign(token$ && token$() ? {
				'Authentication': 'Bearer ' + token$()
			} : {}, request.headers),
			mode: 'cors',
			cache: request.cache || 'default'
		};

		fetch(request.url, options).then(isAuthenticated(token$)).then(function (res) {
			return res.json();
		}).then(function (body) {
			store.dispatch({ type: actionType + '_SUCCESS', payload: body });
		});
	};
};

/*
* enrich a reducer with LOADING -> SUCCESS / FAILED for a certain prefix
* sets a {prefix}_loading flag
* sets a {prefix}_message on errors
* on success provides a action of type {prefix} to the wrapped reducer
* use like: fetchMiddleware('users', usersReducer)
*/
function fetchMiddleware(prefix, reducer) {
	return function (state, _ref) {
		var type = _ref.type,
		    payload = _ref.payload;

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

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.h = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _h = __webpack_require__(13);

var _h2 = _interopRequireDefault(_h);

var _streamy = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// TODO check for props are children
/*
* wrap hyperscript elements in reactive streams dependent on their children streams
*/
var h = exports.h = function h(tag, props, children) {
	// if it is a sub component, resolve that component
	if (typeof tag === 'function') {
		return tag(props, children);
	}
	if (!children) {
		return (0, _streamy.stream)((0, _h2.default)(tag, props));
	}
	return (0, _streamy.merge$)(makeChildrenStreams$(children), wrapProps$(props)).map(function updateElement(_ref) {
		var _ref2 = _slicedToArray(_ref, 2),
		    children = _ref2[0],
		    props = _ref2[1];

		return (0, _h2.default)(tag, props, [].concat(children));
	});
};

/*
* wrap all children in streams and merge those
*/
function makeChildrenStreams$(children) {
	// wrap all children in streams
	var children$Arr = [].concat(children).reduce(function makeStream(arr, child) {
		if (child === null || !(0, _streamy.isStream)(child)) {
			return arr.concat((0, _streamy.stream)(child));
		}
		return arr.concat(child);
	}, []);

	return _streamy.merge$.apply(undefined, _toConsumableArray(children$Arr)).map(function (children) {
		// flatten children array
		children = children.reduce(function (_children, child) {
			return _children.concat(child);
		}, []);
		// TODO maybe add flatmap
		// check if result has streams and if so hook into those streams
		// acts as flatmap from rxjs
		if (children.reduce(function (hasStream, child) {
			if (hasStream) return true;
			return (0, _streamy.isStream)(child) || Array.isArray(child);
		}, false)) {
			return makeChildrenStreams$(children)();
		}
		return children;
	});
}

// TODO: refactor, make more understandable
function wrapProps$(props) {
	if (props === null) return (0, _streamy.stream)();
	if ((0, _streamy.isStream)(props)) {
		return props;
	}
	var props$ = Object.keys(props).map(function (propName, index) {
		var value = props[propName];
		if ((0, _streamy.isStream)(value)) {
			return value.map(function (value) {
				return {
					key: propName,
					value: value
				};
			});
		} else {
			if (value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
				return wrapProps$(value).map(function (value) {
					return {
						key: propName,
						value: value
					};
				});
			}
			return (0, _streamy.stream)({
				key: propName,
				value: value
			});
		}
	});
	return _streamy.merge$.apply(undefined, _toConsumableArray(props$)).map(function (props) {
		return props.reduce(function (obj, _ref3) {
			var key = _ref3.key,
			    value = _ref3.value;

			obj[key] = value;
			return obj;
		}, {});
	});
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _virtualDom = __webpack_require__(12);

var _clicks = __webpack_require__(0);

var _demo_component = __webpack_require__(3);

var _chai = __webpack_require__(10);

var _mockStore = __webpack_require__(8);

describe('Components', function () {
	it('SuperDumpComponent should show', function () {
		var component$ = (0, _demo_component.SuperDumbComponent)();
		// then we render the result of the hyperscript stream and check the dom result
		var elem = (0, _virtualDom.create)(component$());
		console.log(elem);
		(0, _chai.expect)(elem.innerHtml).to.contain(5);
	});
	// it('CleverComponent should show clicks', () => {
	// 	// to test components we just manipulate the input streams
	// 	let store = mockStore({clicks: { clicks: 5 }});
	// 	let component$ = CleverComponent({ sinks: { store }});
	// 	// then we render the result of the hyperscript stream and check the dom result
	// 	let elem = create(component$());
	// 	expect(elem.innerText).to.contain(5);
	// });
});

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.mockStore = undefined;

var _streamy = __webpack_require__(1);

var mockStore = exports.mockStore = function mockStore(store_value) {
	return {
		$: function $(query) {
			return (0, _streamy.stream)(store_value);
		},
		dispatch: function dispatch(action) {
			return;
		}
	};
};

/***/ }),
/* 9 */
/***/ (function(module, exports) {

// empty (null-loader)

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("chai");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("deep-equal");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("virtual-dom");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("virtual-dom/h");

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var testsContext = __webpack_require__(2);

var runnable = testsContext.keys();

runnable.forEach(testsContext);

/***/ })
/******/ ]);