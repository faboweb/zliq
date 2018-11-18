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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(setImmediate) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stream = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.merge$ = merge$;
exports.isStream = isStream;

var _deepEqual = __webpack_require__(7);

var _deepEqual2 = _interopRequireDefault(_deepEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* stream constructor
* constructor returns a stream
* get the current value of stream like: stream.value
*/
var stream = exports.stream = function stream(init_value) {
  var s = function s(value) {
    if (value === undefined) {
      return s.value;
    }
    update(s, value);
    return s;
  };

  s.IS_STREAM = true;
  s.value = init_value;
  s.listeners = [];

  // better debugging output for streams
  s.toString = function () {
    return "Stream(" + s.value + ")";
  };

  s.map = function (fn) {
    return map(s, fn);
  };
  s.is = function (value) {
    return map(s, function (cur) {
      return cur === value;
    });
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
  s.query = function (selectorArr) {
    return query(s, selectorArr);
  };
  s.$ = function (selectorArr) {
    return query(s, selectorArr).distinct();
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
  s.debounce = function (timer) {
    return debounce(s, timer);
  };
  s.schedule = function (scheduleItems, onDone) {
    return schedule(s, scheduleItems, onDone);
  };
  s.next = function () {
    return next(s);
  };
  s.log = function () {
    var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Stream:";
    return log(s, prefix);
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
  parent$.value = newValue;
  notifyListeners(parent$.listeners, newValue);
}

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
  var newStream = fork$(parent$, fn);
  parent$.listeners.push(function mapValue(value) {
    newStream(fn(value));
  });
  return newStream;
}

/* 
* helper function to debug, calls console.log on every value returnin the parent stream 
*/
function log(parent$, prefix) {
  map(parent$, function (value) {
    return console.log(prefix, value);
  });
  return parent$;
}

/*
* provides a new stream applying a transformation function to the value of a parent stream
*/
function flatMap(parent$, fn) {
  var result$ = void 0;
  var listener = function updateOuterStream(result) {
    newStream(result);
  };
  function attachToResult$(mapFn, parentValue, listener) {
    var result$ = mapFn(parentValue);
    result$.listeners.push(listener);
    return result$;
  }
  var newStream = fork$(parent$, function getChildStreamValue(value) {
    result$ = attachToResult$(fn, value, listener);
    return result$.value;
  });
  parent$.listeners.push(function flatMapValue(value) {
    // clean up listeners or they will stack on child streams
    if (result$) {
      removeItem(result$.listeners, listener);
    }

    result$ = attachToResult$(fn, value, listener);
    newStream(result$.value);
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
* recursivly return the nested property of an object defined by an array of selectors
* parent: {foo: {bar:1}}, selectors: ['foo','bar'] returns 1
*/
function select(parent, selectors) {
  if (parent === null || parent === undefined) {
    return null;
  }
  if (selectors.length === 0) {
    return parent;
  }
  var selector = selectors[0];
  return select(parent[selector], selectors.splice(1, selectors.length - 1));
}
/*
* provides a new stream that has a selected sub property of the object value of the parent stream
* the selector has the format [{propertyName}.]*
*/
function deepSelect(parent$, selector) {
  var selectors = selector.split(".");

  var newStream = fork$(parent$, function (value) {
    return select(value, selectors);
  });
  parent$.listeners.push(function deepSelectValue(newValue) {
    newStream(select(newValue, selectors));
  });
  return newStream;
}

function query(parent$, selectorsArr) {
  if (!Array.isArray(selectorsArr)) {
    return parent$.map(function (value) {
      return select(value, selectorsArr.split("."));
    });
  }
  return parent$.map(function (value) {
    return selectorsArr.map(function (selectors) {
      return select(value, selectors.split("."));
    });
  });
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
  setImmediate(function () {
    if (partialChange === null || (typeof partialChange === "undefined" ? "undefined" : _typeof(partialChange)) !== "object" || _typeof(parent$.value) !== "object") {
      parent$(partialChange);
    } else {
      parent$(Object.assign({}, parent$.value, partialChange));
    }
  });
  return parent$;
}

function until(parent$, stopEmitValues$) {
  var newStream = stream();
  var subscribeTo = function subscribeTo(stream, listener) {
    listener(parent$.value);
    stream.listeners.push(listener);
  };
  if (stopEmitValues$.value === undefined) {
    subscribeTo(parent$, newStream);
  }
  stopEmitValues$.map(function (stopEmitValues) {
    if (stopEmitValues) {
      removeItem(parent$.listeners, newStream);
    } else {
      subscribeTo(parent$, newStream);
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
  var aggregate = startValue;
  var newStream = stream();
  function reduceValue(value) {
    aggregate = fn(aggregate, parent$.value);
    newStream(aggregate);
  }
  if (parent$.value !== undefined) {
    reduceValue(parent$.value);
  }
  parent$.listeners.push(reduceValue);
  return newStream;
}

function debounce(parent$, timer) {
  var curTimer = void 0;
  function debounceValue(value) {
    if (curTimer) {
      window.clearTimeout(curTimer);
    }
    curTimer = setTimeout(function updateChildStream() {
      newStream(value);
      curTimer = null;
    }, timer);
  }
  var newStream = stream();
  if (parent$.value !== undefined) {
    debounceValue(parent$.value);
  }
  parent$.listeners.push(debounceValue);
  return newStream;
}

/*
* Execute the scheduled function or return the scheduled value for a stream iteration
*/
function executeScheduleItem(schedule, iteration, value) {
  if (schedule.length < iteration + 1) {
    throw Error("ZLIQ: schedule for iteration " + iteration + " not defined");
  }
  var item = schedule[iteration];
  if (typeof item === "function") {
    return item(value);
  } else {
    return item;
  }
}

/*
* Especially in tests you want to define a reaction to a certain iteration of a stream
* The iteration can be a function or a value
*/
function schedule(parent$, schedule) {
  var onDone = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

  var iteration = 0;
  var newStream = fork$(parent$, function (value) {
    return executeScheduleItem(schedule, iteration++, value);
  });
  if (schedule.length === iteration) onDone();

  parent$.listeners.push(function checkSchedule(value) {
    // do immediate to prevent schedule items to update parent streams before child streams ran
    setImmediate(async function () {
      newStream((await executeScheduleItem(schedule, iteration++, value)));
      if (iteration === schedule.length) onDone();
    });
  });
  return newStream;
}

/*
*  allow to use a stream in an async await cycle
* i.e: const value = await myStream.next()
*/
function next(parent$) {
  var resolve = void 0;
  var promise = new Promise(function (_resolve) {
    resolve = _resolve;
  });
  subscribeTo(parent$, resolve);
  promise.then(function () {
    return removeItem(parent$.listeners, resolve);
  });
  return promise;
}

/*
* merge several streams into one stream providing the values of all streams as an array
* accepts also non stream elements, those are just copied to the output
* the merge will only have a value if every stream for the merge has a value
*/
function merge$(potentialStreamsArr) {
  var values = potentialStreamsArr.map(function (parent$) {
    return parent$ && parent$.IS_STREAM ? parent$.value : parent$;
  });
  var newStream = stream(values.indexOf(undefined) === -1 ? values : undefined);

  potentialStreamsArr.forEach(function (potentialStream, index) {
    if (potentialStream.IS_STREAM) {
      potentialStream.listeners.push(function updateMergedStream(value) {
        values[index] = value;
        newStream(values.indexOf(undefined) === -1 ? values : undefined);
      });
    }
  });
  return newStream;
}

function isStream(parent$) {
  return parent$ != null && !!parent$.IS_STREAM;
}

function removeItem(arr, item) {
  var index = arr.indexOf(item);
  if (index !== -1) {
    arr.splice(index, 1);
  }
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12).setImmediate))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zx = undefined;

var _streamy = __webpack_require__(0);

Object.keys(_streamy).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _streamy[key];
    }
  });
});

var _render = __webpack_require__(14);

Object.keys(_render).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _render[key];
    }
  });
});

var _streamyVdom = __webpack_require__(5);

Object.keys(_streamyVdom).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _streamyVdom[key];
    }
  });
});

var _streamyHelpers = __webpack_require__(4);

Object.keys(_streamyHelpers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _streamyHelpers[key];
    }
  });
});

var _hyperx = __webpack_require__(13);

var _hyperx2 = _interopRequireDefault(_hyperx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var zx = exports.zx = (0, _hyperx2.default)(_streamyVdom.h);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = __webpack_require__(1);

Object.keys(_utils).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _utils[key];
    }
  });
});

var _testComponent = __webpack_require__(6);

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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.if$ = if$;
exports.join$ = join$;
exports.resolve$ = resolve$;
exports.flatten = flatten;

var _2 = __webpack_require__(1);

// provide easy switched on boolean streams
// example use case: <button onclick={()=>open$(!open$())}>{if$(open$, 'Close', 'Open')}</button>
function if$(boolean$) {
  var onTrue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var onFalse = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  if (boolean$ === undefined || !(0, _2.isStream)(boolean$)) {
    return (0, _2.stream)(boolean$ ? onTrue : onFalse);
  }
  return boolean$.map(function (x) {
    return x ? onTrue : onFalse;
  });
}

// join a mixed array of strings and streams of strings
// example use case: <div class={join$('container', if$(open$, 'open', 'closed'))} />
function join$() {
  for (var _len = arguments.length, $arr = Array(_len), _key = 0; _key < _len; _key++) {
    $arr[_key] = arguments[_key];
  }

  return (0, _2.merge$)($arr).map(function (arr) {
    return arr.join(" ");
  });
}

/*
* Resolve all nested streams in an object
* input: {a:{}, b:stream:{}}
* output: stream({a:{}, b:{}})
*/
function resolve$(obj) {
  if (obj === null) return (0, _2.stream)({});

  var nestedStreams = extractNestedStreams(obj);
  var updateStreams = nestedStreams.map(function makeNestedStreamUpdateObject(_ref) {
    var parent = _ref.parent,
        key = _ref.key,
        stream = _ref.stream;

    return stream.distinct()
    // here we produce a sideeffect on the object -> low GC
    // to trigger the merge we also need to return sth (as undefined does not trigger listeners)
    .map(function (value) {
      parent[key] = value;
      return value;
    });
  });
  return (0, _2.merge$)(updateStreams).map(function (_) {
    return obj;
  });
}

// to react to nested streams in an object, we extract the streams and a reference to their position
// returns [{parentObject, propertyName, stream}]
function extractNestedStreams(obj) {
  return flatten(Object.keys(obj).map(function (key) {
    // DEPRECATED I can't think of a usecase
    // if (typeof obj[key] === 'object') {
    // 	return extractNestedStreams(obj[key]);
    // }
    if (obj[key] === null || obj[key] === undefined) {
      return [];
    }
    if ((0, _2.isStream)(obj[key])) {
      return [{
        parent: obj,
        key: key,
        stream: obj[key]
      }];
    }
    if (_typeof(obj[key]) === "object") {
      return extractNestedStreams(obj[key]);
    }
    return [];
  }));
}

// flattens an array
function flatten(array, mutable) {
  var toString = Object.prototype.toString;
  var arrayTypeStr = "[object Array]";

  var result = [];
  var nodes = mutable && array || array.slice();
  var node;

  if (!array.length) {
    return result;
  }

  node = nodes.pop();

  do {
    if (toString.call(node) === arrayTypeStr) {
      nodes.push.apply(nodes, node);
    } else {
      result.push(node);
    }
  } while (nodes.length && (node = nodes.pop()) !== undefined);

  result.reverse(); // we reverse result to restore the original order
  return result;
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.h = exports.Component = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.resolveChildren = resolveChildren;
exports.resolveChild = resolveChild;

var _streamy = __webpack_require__(0);

var _streamyHelpers = __webpack_require__(4);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// class VNode {
//   constructor(tag, props, children) {

//   }
// }

var Component = exports.Component = function Component(constructorFn) {
  _classCallCheck(this, Component);

  this.build = constructorFn;
};

/*
* wrap vdom elements in reactive streams dependent on their children streams
* the vdom constructor function returns another constructor so we can pass down globals from the renderer to the components
*/


var h = exports.h = function h(tag, props) {
  for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  props = props ? props : {};

  return new Component(function (globals) {
    var version = -1;

    var constructedChildren = resolveChildren(children, globals);
    var mergedChildren$ = mergeChildren$(constructedChildren);
    // jsx usually resolves known tags as strings and unknown tags as functions
    // if it is a function it is treated as a component and will resolve it
    // props are not automatically resolved
    if (typeof tag === "function") {
      // TODO refactor component resolution
      var output = tag(props, mergedChildren$, globals);

      if (Array.isArray(output)) {
        return resolveChildren(output, globals);
      }
      if (output instanceof Component || (0, _streamy.isStream)(output)) {
        return resolveChild(output, globals);
      }

      // allow simple component that receives resolved streams
      return (0, _streamy.merge$)([(0, _streamyHelpers.resolve$)(props), mergedChildren$.map(_streamyHelpers.flatten)]).map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            props = _ref2[0],
            children = _ref2[1];

        return output(props, children, globals);
      }).map(function (children) {
        return resolveChildren(children, globals);
      });
    }

    return (0, _streamy.merge$)([(0, _streamyHelpers.resolve$)(props), mergedChildren$.map(_streamyHelpers.flatten)]).map(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          props = _ref4[0],
          children = _ref4[1];

      return {
        tag: tag,
        props: props,
        children: children,
        version: ++version
      };
    });
  });
};

/*
* wrap all children in streams and merge those
* we make sure that all children streams are flat arrays to make processing uniform
* input: [stream]
* output: stream([])
*/
function mergeChildren$(children) {
  if (!Array.isArray(children)) {
    children = [children];
  }
  children = (0, _streamyHelpers.flatten)(children).filter(function (_) {
    return _ !== null;
  });
  var childrenVdom$arr = children.map(function (child) {
    if ((0, _streamy.isStream)(child)) {
      return child.flatMap(mergeChildren$);
    }
    return child;
  });

  return (0, _streamy.merge$)(childrenVdom$arr);
}

/*
* children can be nested arrays, nested streams and element contstructors
* this function unifies them into the format [string|number|vdom|stream<string|number|vdom>]
*/
function resolveChildren(children, globals) {
  if (!Array.isArray(children)) {
    children = [].concat(children);
  }
  var resolvedChilden = children.map(function (child) {
    if (Array.isArray(child)) {
      return resolveChildren(child, globals);
    }
    return resolveChild(child, globals);
  });
  return (0, _streamyHelpers.flatten)(resolvedChilden);
}

/*
* resolve the element constructor, also for elements nested in streams
* returns the format string|number|vdom|stream<string|number|vdom>
*/
function resolveChild(child, globals) {
  if (child instanceof Component) {
    return resolveChildren(child.build(globals), globals);
  }
  if ((0, _streamy.isStream)(child)) {
    return child.map(function (x) {
      return resolveChildren(x, globals);
    });
  }
  return child;
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.testRender = testRender;
exports.test$ = test$;

var _src = __webpack_require__(3);

function testRender(vdom$, schedule, done) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
    attach: false,
    debounce: 0,
    globals: {}
  };

  var container = document.createElement("div");
  if (options.attach) {
    document.body.appendChild(container);
  }
  // enable to just define the expected html in the render schedule
  schedule = schedule.map(function (expected) {
    if (typeof expected === "string") {
      return function (_ref) {
        var element = _ref.element;
        return (
          // we trim line breaks to make outerHTML more like the visible DOM
          expect(trimWhitespaces(element.outerHTML)).toBe(trimWhitespaces(expected))
        );
      };
    }
    return expected;
  });
  return test$((0, _src.render)(vdom$, container, options.globals, options.debounce), schedule, done);
}

// trims whitespaces between tags and strings
function trimWhitespaces(html) {
  var trimmed = html.replace(/\>(\s*)(.*)(\s*)\</g, ">$2<");
  return trimmed;
}

function test$(stream, schedule, done) {
  return stream.schedule(schedule.map(function (iteration) {
    return async function (value) {
      await testIteration(iteration, value).catch(done.fail);
      return value;
    };
  }), done);
}

function testIteration(iteration, value) {
  return new Promise(function (resolve, reject) {
    // tests produce async behavior often synchronous
    // this can cause race effects on stream declarations
    // here the iterations are made asynchronous to prevent this
    setTimeout(function () {
      try {
        if (typeof iteration === "function") {
          iteration(value);
        } else {
          expect(value).toEqual(iteration);
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var pSlice = Array.prototype.slice;
var objectKeys = __webpack_require__(9);
var isArguments = __webpack_require__(8);

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
/* 8 */
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
/* 9 */
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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
    return [];
};

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {

(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
        // Callback can either be a function or a string
        if (typeof callback !== "function") {
            callback = new Function("" + callback);
        }
        // Copy function arguments
        var args = new Array(arguments.length - 1);
        for (var i = 0; i < args.length; i++) {
            args[i] = arguments[i + 1];
        }
        // Store and register the task
        var task = { callback: callback, args: args };
        tasksByHandle[nextHandle] = task;
        registerImmediate(nextHandle);
        return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
            case 0:
                callback();
                break;
            case 1:
                callback(args[0]);
                break;
            case 2:
                callback(args[0], args[1]);
                break;
            case 3:
                callback(args[0], args[1], args[2]);
                break;
            default:
                callback.apply(undefined, args);
                break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function registerImmediate(handle) {
            process.nextTick(function () {
                runIfPresent(handle);
            });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function () {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function onGlobalMessage(event) {
            if (event.source === global && typeof event.data === "string" && event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function registerImmediate(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function (event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function registerImmediate(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function registerImmediate(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function registerImmediate(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();
    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();
    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();
    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();
    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
})(typeof self === "undefined" ? typeof global === "undefined" ? undefined : global : self);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(10)))

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var scope = typeof global !== "undefined" && global || typeof self !== "undefined" && self || window;
var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function () {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
};
exports.setInterval = function () {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
};
exports.clearTimeout = exports.clearInterval = function (timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function () {};
Timeout.prototype.close = function () {
  this._clearFn.call(scope, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function (item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function (item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function (item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout) item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(11);
// On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = typeof self !== "undefined" && self.setImmediate || typeof global !== "undefined" && global.setImmediate || undefined && undefined.setImmediate;
exports.clearImmediate = typeof self !== "undefined" && self.clearImmediate || typeof global !== "undefined" && global.clearImmediate || undefined && undefined.clearImmediate;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.escape = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; // forked from https://github.com/choojs/hyperx

var _index = __webpack_require__(1);

var VAR = 0,
    TEXT = 1,
    OPEN = 2,
    CLOSE = 3,
    ATTR = 4;
var ATTR_KEY = 5,
    ATTR_KEY_WHITESPACE = 6;
var ATTR_VALUE_WHITESPACE = 7,
    ATTR_VALUE = 8;
var ATTR_VALUE_SINGLEQUOTE = 9,
    ATTR_VALUE_DOUBLEQUOTE = 10;
var ATTR_EQ = 11,
    ATTR_BREAK = 12;
var COMMENT = 13;

module.exports = function (h, opts) {
  if (!opts) opts = {};
  var concat = opts.concat || function (a, b) {
    return String(a) + String(b);
  };
  if (opts.attrToProp !== false) {
    h = attributeToProperty(h);
  }

  return function (strings) {
    for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      values[_key - 1] = arguments[_key];
    }

    return new _index.Component(function (globals) {
      var component = handleTemplateLiteral(globals, strings, values);
      if (Array.isArray(component)) {
        return (0, _index.resolveChildren)(component, globals);
      }

      // resolve nested components
      // TODO needed? why?
      var output = component;
      while (output instanceof _index.Component) {
        output = output.build(globals);
      }
      return output;
    });
  };

  // return (strings, ...values) => handleTemplateLiteral(null, strings, values);

  function handleTemplateLiteral(globals, strings, values) {
    var state = TEXT,
        token = "";
    var valuesLength = values.length;
    var parts = [];

    for (var i = 0; i < strings.length; i++) {
      if (i < valuesLength) {
        var value = escape(values[i]);
        var parsedTokens = parse(strings[i]);
        var xstate = state;
        if (xstate === ATTR_VALUE_DOUBLEQUOTE) xstate = ATTR_VALUE;
        if (xstate === ATTR_VALUE_SINGLEQUOTE) xstate = ATTR_VALUE;
        if (xstate === ATTR_VALUE_WHITESPACE) xstate = ATTR_VALUE;
        if (xstate === ATTR) xstate = ATTR_KEY;
        if (xstate === OPEN) {
          if (token === "/") {
            parsedTokens.push([OPEN, "/", value]);
            token = "";
          } else {
            parsedTokens.push([OPEN, value]);
          }
        } else {
          // TODO resolve component here?
          // if (typeof value === "function") value = value(globals);
          parsedTokens.push([VAR, xstate, value]);
        }
        parts.push.apply(parts, parsedTokens);
      } else parts.push.apply(parts, parse(strings[i]));
    }

    var tree = [null, {}, []];
    var stack = [[tree, -1]];
    for (var _i = 0; _i < parts.length; _i++) {
      var cur = stack[stack.length - 1][0];
      var p = parts[_i],
          tokenType = p[0];
      if (tokenType === OPEN && /^\//.test(p[1])) {
        var ix = stack[stack.length - 1][1];
        if (stack.length > 1) {
          stack.pop();
          stack[stack.length - 1][0][2][ix] = h(cur[0], cur[1], cur[2].length ? cur[2] : undefined);
        }
      } else if (tokenType === OPEN) {
        var c = [p[1], {}, []];
        cur[2].push(c);
        stack.push([c, cur[2].length - 1]);
      } else if (tokenType === ATTR_KEY || tokenType === VAR && p[1] === ATTR_KEY) {
        var key = "";
        var copyKey = void 0;
        for (; _i < parts.length; _i++) {
          if (parts[_i][0] === ATTR_KEY) {
            key = concat(key, parts[_i][1]);
          } else if (parts[_i][0] === VAR && parts[_i][1] === ATTR_KEY) {
            if (_typeof(parts[_i][2]) === "object" && !key) {
              for (copyKey in parts[_i][2]) {
                if (parts[_i][2].hasOwnProperty(copyKey) && !cur[1][copyKey]) {
                  cur[1][copyKey] = parts[_i][2][copyKey];
                }
              }
            } else {
              key = concat(key, parts[_i][2]);
            }
          } else break;
        }
        if (parts[_i][0] === ATTR_EQ) _i++;
        var j = _i;
        for (; _i < parts.length; _i++) {
          if (parts[_i][0] === ATTR_VALUE || parts[_i][0] === ATTR_KEY) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[_i][1]);else parts[_i][1] === "" || (cur[1][key] = concat(cur[1][key], parts[_i][1]));
          } else if (parts[_i][0] === VAR && (parts[_i][1] === ATTR_VALUE || parts[_i][1] === ATTR_KEY)) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[_i][2]);else parts[_i][2] === "" || (cur[1][key] = concat(cur[1][key], parts[_i][2]));
          } else {
            if (key.length && !cur[1][key] && _i === j && (parts[_i][0] === CLOSE || parts[_i][0] === ATTR_BREAK)) {
              // https://html.spec.whatwg.org/multipage/infrastructure.html#boolean-attributes
              // empty string is falsy, not well behaved value in browser
              cur[1][key] = key.toLowerCase();
            }
            if (parts[_i][0] === CLOSE) {
              _i--;
            }
            break;
          }
        }
      } else if (tokenType === ATTR_KEY) {
        cur[1][p[1]] = true;
      } else if (tokenType === VAR && p[1] === ATTR_KEY) {
        cur[1][p[2]] = true;
      } else if (tokenType === CLOSE) {
        if (selfClosing(cur[0]) && stack.length) {
          var _ix = stack[stack.length - 1][1];
          stack.pop();
          stack[stack.length - 1][0][2][_ix] = h(cur[0], cur[1], cur[2].length ? cur[2] : undefined);
        }
      } else if (tokenType === VAR && p[1] === TEXT) {
        if (p[2] === undefined || p[2] === null) p[2] = "";else if (!p[2]) p[2] = concat("", p[2]);
        if (Array.isArray(p[2][0])) {
          cur[2].push.apply(cur[2], p[2]);
        } else {
          cur[2].push(p[2]);
        }
      } else if (tokenType === TEXT) {
        cur[2].push(p[1]);
      } else if (tokenType === ATTR_EQ || tokenType === ATTR_BREAK) {
        // no-op
      } else {
        throw new Error("unhandled: " + tokenType);
      }
    }

    // TODO handle components

    if (tree[2].length > 1 && /^\s*$/.test(tree[2][0])) {
      tree[2].shift();
    }

    if (tree[2].length > 2 || tree[2].length === 2 && /\S/.test(tree[2][1])) {
      return tree[2];
    }
    if (Array.isArray(tree[2][0]) && typeof tree[2][0][0] === "string" && Array.isArray(tree[2][0][2])) {
      tree[2][0] = h(tree[2][0][0], tree[2][0][1], tree[2][0][2]);
    }
    return tree[2][0];

    function parse(str) {
      var res = [];
      if (state === ATTR_VALUE_WHITESPACE) state = ATTR;
      for (var _i2 = 0; _i2 < str.length; _i2++) {
        var curChar = str.charAt(_i2);

        if (state === TEXT && curChar === "<") {
          // _<button>HALLO_</button>
          if (token.length) res.push([TEXT, token]);
          token = "";
          state = OPEN;
          // <button_>HALLO</button_>,  ?? not <button x="y _> 2"></button ??, not // <button_></button_>
        } else if (curChar === ">" && !quot(state) && state !== COMMENT) {
          // <button_>HALLO</button_>
          if (state === OPEN && token.length) {
            res.push([OPEN, token]);
            // <button disabled_>HALLO</button>
          } else if (state === ATTR_KEY) {
            res.push([ATTR_KEY, token]);
          }
          // <button x="y _> 2">
          else if (state === ATTR_VALUE && token.length) {
              res.push([ATTR_VALUE, token]);
            }
          res.push([CLOSE]);
          token = "";
          state = TEXT;
        } else if (state === COMMENT && /-$/.test(token) && curChar === "-") {
          token = "";
          state = TEXT;
        } else if (state === OPEN && /^!--$/.test(token)) {
          token = curChar;
          state = COMMENT;
        } else if (state === TEXT || state === COMMENT) {
          token += curChar;
        } else if (state === OPEN && curChar === "/" && token.length) {
          // no-op, self closing tag without a space <br/>
        } else if (state === OPEN && /\s/.test(curChar)) {
          if (token.length) {
            res.push([OPEN, token]);
          }
          token = "";
          state = ATTR;
        } else if (state === OPEN) {
          token += curChar;
        } else if (state === ATTR && /[^\s"'=/]/.test(curChar)) {
          state = ATTR_KEY;
          token = curChar;
        } else if (state === ATTR && /\s/.test(curChar)) {
          if (token.length) res.push([ATTR_KEY, token]);
          res.push([ATTR_BREAK]);
        } else if (state === ATTR_KEY && /\s/.test(curChar)) {
          res.push([ATTR_KEY, token]);
          token = "";
          state = ATTR_KEY_WHITESPACE;
        } else if (state === ATTR_KEY && curChar === "=") {
          res.push([ATTR_KEY, token], [ATTR_EQ]);
          token = "";
          state = ATTR_VALUE_WHITESPACE;
        } else if (state === ATTR_KEY) {
          token += curChar;
        } else if ((state === ATTR_KEY_WHITESPACE || state === ATTR) && curChar === "=") {
          res.push([ATTR_EQ]);
          state = ATTR_VALUE_WHITESPACE;
        } else if ((state === ATTR_KEY_WHITESPACE || state === ATTR) && !/\s/.test(curChar)) {
          res.push([ATTR_BREAK]);
          if (/[\w-]/.test(curChar)) {
            token += curChar;
            state = ATTR_KEY;
          } else state = ATTR;
        } else if (state === ATTR_VALUE_WHITESPACE && curChar === '"') {
          state = ATTR_VALUE_DOUBLEQUOTE;
        } else if (state === ATTR_VALUE_WHITESPACE && curChar === "'") {
          state = ATTR_VALUE_SINGLEQUOTE;
        } else if (state === ATTR_VALUE_DOUBLEQUOTE && curChar === '"') {
          res.push([ATTR_VALUE, token], [ATTR_BREAK]);
          token = "";
          state = ATTR;
        } else if (state === ATTR_VALUE_SINGLEQUOTE && curChar === "'") {
          res.push([ATTR_VALUE, token], [ATTR_BREAK]);
          token = "";
          state = ATTR;
        } else if (state === ATTR_VALUE_WHITESPACE && !/\s/.test(curChar)) {
          state = ATTR_VALUE;
          _i2--;
        } else if (state === ATTR_VALUE && /\s/.test(curChar)) {
          res.push([ATTR_VALUE, token], [ATTR_BREAK]);
          token = "";
          state = ATTR;
        } else if (state === ATTR_VALUE || state === ATTR_VALUE_SINGLEQUOTE || state === ATTR_VALUE_DOUBLEQUOTE) {
          token += curChar;
        }
      }
      if (state === TEXT && token.length) {
        res.push([TEXT, token]);
        token = "";
      } else if (state === ATTR_VALUE && token.length) {
        res.push([ATTR_VALUE, token]);
        token = "";
      } else if (state === ATTR_VALUE_DOUBLEQUOTE && token.length) {
        res.push([ATTR_VALUE, token]);
        token = "";
      } else if (state === ATTR_VALUE_SINGLEQUOTE && token.length) {
        res.push([ATTR_VALUE, token]);
        token = "";
      } else if (state === ATTR_KEY) {
        res.push([ATTR_KEY, token]);
        token = "";
      }
      return res;
    }
  }

  function strfn(x) {
    if (typeof x === "function") return x;else if (typeof x === "string") return x;else if (x && (typeof x === "undefined" ? "undefined" : _typeof(x)) === "object") return x;else return concat("", x);
  }
};

function quot(state) {
  return state === ATTR_VALUE_SINGLEQUOTE || state === ATTR_VALUE_DOUBLEQUOTE;
}

var closeRE = RegExp("^(" + ["area", "base", "basefont", "bgsound", "br", "col", "command", "embed", "frame", "hr", "img", "input", "isindex", "keygen", "link", "meta", "param", "source", "track", "wbr", "!--",
// SVG TAGS
"animate", "animateTransform", "circle", "cursor", "desc", "ellipse", "feBlend", "feColorMatrix", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "font-face-format", "font-face-name", "font-face-uri", "glyph", "glyphRef", "hkern", "image", "line", "missing-glyph", "mpath", "path", "polygon", "polyline", "rect", "set", "stop", "tref", "use", "view", "vkern"].join("|") + ")(?:[.#][a-zA-Z0-9\x7F-\uFFFF_:-]+)*$");
function selfClosing(tag) {
  return closeRE.test(tag);
}

// convert DOM attribute names to the property name used in js elements
function attributeToProperty(h) {
  var transform = {
    class: "className",
    for: "htmlFor",
    "http-equiv": "httpEquiv"
  };

  return function (tagName) {
    var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var children = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    for (var attr in attrs) {
      if (attr in transform) {
        attrs[transform[attr]] = attrs[attr];
        delete attrs[attr];
      }
    }
    return h(tagName, attrs, children);
  };
}

// escape potentially malicious strings
var escape = exports.escape = function escape(arg) {
  if (typeof arg !== "string") return arg;
  return arg.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.render = render;

var _streamy = __webpack_require__(0);

var _streamyVdom = __webpack_require__(5);

var _vdomDiff = __webpack_require__(15);

function render(vdom, parentElement) {
  var globals = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var debounce = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;

  var vdom$ = resolveInputToStream(vdom, globals);
  var renderStartState = {
    element: null,
    version: -1,
    children: [],
    keyContainer: {}
  };

  return vdom$.debounce(debounce).reduce(renderUpdate.bind(null, parentElement), renderStartState);
}

function renderUpdate(parentElement,
// current known state
_ref,
// new vdom tree
_ref2) {
  var oldElement = _ref.element,
      oldVersion = _ref.version,
      oldChildren = _ref.children,
      keyContainer = _ref.keyContainer;
  var tag = _ref2.tag,
      props = _ref2.props,
      children = _ref2.children,
      version = _ref2.version;

  try {
    var newElement = (0, _vdomDiff.diff)(parentElement, oldElement, { tag: tag, props: props, children: children, version: version }, { children: oldChildren, version: oldVersion }, keyContainer);

    // signalise mount of root element on initial render
    if (parentElement && version === 0) {
      (0, _vdomDiff.triggerLifecycle)(oldElement, props, "mounted");
    }

    return {
      element: newElement,
      version: version,
      children: copyChildren(children),
      keyContainer: keyContainer
    };
  } catch (err) {
    console.error("Error in rendering step:", err);
  }
}

// we allow inputs to the render function to be:
// a vdom-stream
// a stream of Component
// a Component
// this function resolves the input to a vdom-stream
function resolveInputToStream(input, globals) {
  var vdom$ = void 0;
  if ((0, _streamy.isStream)(input)) {
    // resolve downstream components
    vdom$ = input.flatMap(function (input) {
      var resolved = (0, _streamyVdom.resolveChild)(input, globals);

      // resolvedChild can return an array of elements but we expect only one
      // TODO make this better
      if (Array.isArray(resolved)) {
        resolved = resolved[0];
      }

      // because we are flatMapping we need to return streams
      if (!(0, _streamy.isStream)(resolved)) {
        return (0, _streamy.stream)(resolved);
      }

      return resolved;
    })
    // a resolved input could return an array but we expect the vdom$
    // to return just one root vdom elem
    .map(function (x) {
      if (Array.isArray(x)) {
        x = x[0];
      }
      return x;
    });
    return vdom$;
  }

  if (input instanceof _streamyVdom.Component) {
    vdom$ = input.build(globals);
    vdom$ = resolveInputToStream(vdom$, globals);
    return vdom$;
  } else if (typeof input === "function") {
    // simple element constructor
    vdom$ = input({}, [], globals);
  }

  // reiterate if still not a vdom-stream
  if (!(0, _streamy.isStream)(vdom$)) vdom$ = resolveInputToStream(vdom$, globals);

  return vdom$;
}

// to not mutate the representation of our children from the last iteration we clone them
// we copy the cycle functions for each element, as JSON parse/stringify does not work for functions
function copyChildren() {
  var oldChildren = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  var newChildren = JSON.parse(JSON.stringify(oldChildren));
  newChildren.forEach(function (child, index) {
    var oldChild = oldChildren[index];
    if (oldChild.props && oldChild.props.cycle) {
      child.cycle = oldChild.props.cycle;
    }

    if (_typeof(oldChildren[index]) === "object") {
      child.children = copyChildren(oldChild.children);
    }
  });
  return newChildren;
}

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TEXT_NODE = undefined;
exports.diff = diff;
exports.createNode = createNode;
exports.triggerLifecycle = triggerLifecycle;

var _streamy = __webpack_require__(0);

var TEXT_NODE = exports.TEXT_NODE = "#text";

function diff(parentElement, oldElement, newChild, oldChild, cacheContainer) {
  // if there is no element on the parent to diff against yet,
  // we create the element here to make diffing later on more uniform
  if (oldElement === null) {
    oldElement = createNode(newChild.tag, newChild.children);
    if (parentElement) {
      parentElement.appendChild(oldElement);
    }
  }

  var newElement = oldElement;
  var isCaching = newChild.props && newChild.props.id;

  try {
    // for keyed/idd elements, we recall unchanged elements
    if (isCaching) {
      newElement = diffCachedElement(oldElement, newChild, oldChild, cacheContainer);
    } else {
      newElement = diffElement(oldElement, newChild, oldChild, cacheContainer);
    }
  } catch (err) {
    // on errors, show an error element instead of crashing
    newElement = {
      tag: "div",
      props: {
        style: "border: 1px solid red; color: red;"
      },
      children: ["FAULTY ELEMENT"]
    };
    console.error("[ERROR]: An element failed to render.\n", err);
  }

  return newElement;
}

function diffCachedElement(oldElement, _ref, _ref2, cacheContainer) {
  var tag = _ref.tag,
      props = _ref.props,
      children = _ref.children,
      version = _ref.version;
  var oldProps = _ref2.props;

  var id = props.id;
  var gotCreated = false;
  var gotUpdated = false;

  // if there is no cache, create one
  if (cacheContainer[id] === undefined) {
    cacheContainer[id] = {
      element: document.createElement(tag),
      vdom: {
        tag: tag,
        props: {},
        children: []
      }
    };
    gotCreated = true;
  }

  var elementCache = cacheContainer[id];

  // ignore update if version equals cache
  if (version !== elementCache.version) {
    diffAttributes(elementCache.element, props, oldProps);
    diffChildren(elementCache.element, children, elementCache.vdom.children, cacheContainer);

    elementCache.version = version;
    elementCache.vdom.props = props;
    elementCache.vdom.children = children;

    gotUpdated = true;
  }

  if (gotCreated) {
    triggerLifecycle(elementCache.element, props, "created");
  } else if (gotUpdated) {
    triggerLifecycle(elementCache.element, props, "updated");
  }

  // elements are updated in place, so only insert cached element if it's not already there
  if (oldElement !== elementCache.element) {
    oldElement.parentElement.replaceChild(elementCache.element, oldElement);
    triggerLifecycle(elementCache.element, props, "mounted");
  }

  return elementCache.element;
}

function diffElement(element, _ref3, _ref4, cacheContainer) {
  var tag = _ref3.tag,
      props = _ref3.props,
      newChildren = _ref3.children,
      newVersion = _ref3.version;
  var oldProps = _ref4.props,
      oldChildren = _ref4.children,
      oldVersion = _ref4.version;

  var initialRender = oldVersion === -1 || oldVersion === undefined;

  // text nodes behave differently then normal dom elements
  if (isTextNode(element) && tag === TEXT_NODE) {
    updateTextNode(element, newChildren[0]);
    return element;
  }

  // if the node types do not differ, we reuse the old node
  // we reuse the existing node to save time rerendering it
  // we do not reuse/mutate cached (id) elements as this will mutate the cache
  if (shouldRecycleElement(element, props, tag) === false) {
    var newElement = createNode(tag, newChildren);
    element.parentElement.replaceChild(newElement, element);
    element = newElement;
    // there are no children anymore on the newly created node
    oldChildren = [];
  }

  diffAttributes(element, props, oldProps);

  // sometimes you might want to skip updates to children on renderer elements i.e. if externals handle this component
  var isolated = props && props.isolated !== undefined;

  // text nodes we don't want to handle children like with other elements
  // and for isolated components we want to skip all updates after the first render
  if (tag !== TEXT_NODE && (!isolated || initialRender)) {
    diffChildren(element, newChildren, oldChildren, cacheContainer);
  }

  if (initialRender) {
    triggerLifecycle(element, props, "created");
  }

  if (newVersion > 0) {
    triggerLifecycle(element, props, "updated");
  }

  return element;
}

// this removes nodes at the end of the children, that are not needed anymore in the current state for recycling
function removeNotNeededNodes(parentElements, newChildren, oldChildren) {
  var remaining = parentElements.childNodes.length;
  if (oldChildren.length !== remaining) {
    console.warn("ZLIQ: Something other then ZLIQ has manipulated the children of the element", parentElements, ". This can lead to sideffects. Consider using the 'isolated' attribute for this element to prevent updates.");
  }

  for (; remaining > newChildren.length; remaining--) {
    var childToRemove = parentElements.childNodes[remaining - 1];
    parentElements.removeChild(childToRemove);

    if (oldChildren.length < remaining) {
      continue;
    } else {
      var cycle = oldChildren[remaining - 1].cycle;


      triggerLifecycle(childToRemove, { cycle: cycle }, "removed");
    }
  }
}

function updateExistingNodes(parentElement, newChildren, oldChildren, cacheContainer) {
  var nodes = parentElement.childNodes;
  for (var i = 0; i < nodes.length && i < newChildren.length; i++) {
    diff(parentElement, nodes[i], newChildren[i], oldChildren[i] || {}, cacheContainer);
  }
}

function addNewNodes(parentElement, newChildren, cacheContainer) {
  for (var i = parentElement.childNodes.length; i < newChildren.length; i++) {
    var _newChildren$i = newChildren[i],
        tag = _newChildren$i.tag,
        props = _newChildren$i.props,
        children = _newChildren$i.children,
        version = _newChildren$i.version;

    var newElement = createNode(tag, children);

    parentElement.appendChild(newElement);

    diff(parentElement, newElement, newChildren[i], {}, cacheContainer);

    if (props && props.cycle && props.cycle.mounted && !props.id) {
      console.error("The 'mounted' lifecycle event is only called on elements with id. As elements are updated in place, it is hard to define when a normal element is mounted.");
    }
  }
}

function diffAttributes(element, props) {
  var oldProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (props !== undefined) {
    Object.keys(props).map(function applyPropertyToElement(attribute) {
      applyAttribute(element, attribute, props[attribute]);
    });
    Object.keys(oldProps).map(function removeNotNeededAttributes(oldAttribute) {
      if (props[oldAttribute] === undefined) {
        element.removeAttribute(oldAttribute);
      }
    });
  }
}

function applyAttribute(element, attribute, value) {
  // allow for any custom attribute to be set on the element
  if (attribute.startsWith("*")) {
    element.setAttribute(attribute.substr(1), value);
    return;
  }

  if (attribute === "class") {
    element.className = value || ""; // "" in the case of a class stream returning null
    // we leave the possibility to define styles as strings
    // but we allow styles to be defined as an object
  } else if (attribute === "style" && typeof value !== "string") {
    var cssText = value ? Object.keys(value).map(function (key) {
      return key + ":" + value[key] + ";";
    }).join(" ") : "";
    element.style.cssText = cssText;
    // other propertys are just added as is to the DOM
  } else {
    if (element[attribute] !== undefined) {
      if (value === null) {
        element[attribute] = undefined;
      } else {
        element[attribute] = value;
      }
    }
    // also remove attributes on null to allow better handling of streams
    // streams don't emit on undefined
    if (value === null) {
      element[attribute] = undefined;
    } else {
      element[attribute] = value;
    }
  }
}

function diffChildren(element) {
  var newChildren = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var oldChildren = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var cacheContainer = arguments[3];

  if (newChildren.length === 0 && oldChildren.length === 0) {
    return;
  }

  var oldChildNodes = element.childNodes;
  var unifiedNewChildren = unifyChildren(newChildren);
  var unifiedOldChildren = unifyChildren(oldChildren);

  updateExistingNodes(element, unifiedNewChildren, unifiedOldChildren, cacheContainer);
  removeNotNeededNodes(element, unifiedNewChildren, oldChildren);
  addNewNodes(element, unifiedNewChildren, cacheContainer);
}

/* HELPERS */

/*
  * jsx has children mixed as vdom-elements and numbers or strings
  * to consistently treat these children similar in the code we transform those numbers and strings
  * into vdom-elements with the tag #text that have one child with their value
  */
function unifyChildren(children) {
  return children.map(function (child) {
    // if there is no tag we assume it's a number or a string
    if (!(0, _streamy.isStream)(child) && child.tag === undefined) {
      return {
        tag: TEXT_NODE,
        children: [child],
        version: 0
      };
    } else {
      return child;
    }
  });
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

// TODO use React like effects for lifecycle events
// shorthand to call a cycle event for an element if existing
function triggerLifecycle(element) {
  var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      cycle = _ref5.cycle;

  var event = arguments[2];

  if (cycle && cycle[event]) {
    cycle[event](element);
  }
}

function nodeTypeDiffers(element, tag) {
  return element.nodeName.toLowerCase() !== tag;
}

function isTextNode(element) {
  return element instanceof window.Text;
}

function updateTextNode(element, value) {
  if (element.nodeValue !== value) {
    element.nodeValue = value;
  }
}

// we want to recycle elements to save time on creating and inserting nodes into the dom
// we don't want to manipulate elements that go into the cache, because they would mutate in the cache as well
function shouldRecycleElement(oldElement, props, tag) {
  return !isTextNode(oldElement) && oldElement.id === "" && !nodeTypeDiffers(oldElement, tag);
}

/***/ })
/******/ ]);
});
//# sourceMappingURL=zliq.js.map