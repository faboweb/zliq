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
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
	s.value = init_value !== null ? init_value : null;
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
	s.notEmpty = function () {
		return notEmpty(s);
	};
	s.$ = function (selectorArr) {
		return query(s, selectorArr);
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
* provides a new stream applying a transformation function to the value of a parent stream
*/
function flatMap(parent$, fn) {
	var newStream = stream(fn(parent$.value)());
	parent$.listeners.push(function mapValue(value) {
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
	parent$.listeners.push(function deepSelectValue(newValue) {
		newStream(select(newValue, selectors), newStream.value);
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

	var newStream = stream(parent$.value);
	parent$.listeners.push(function deepSelectValue(value) {
		if (fn(newStream.value, value)) {
			newStream(value, newStream.value);
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
	parent$(Object.assign({}, parent$.value, partialChange));
}

/*
* reduce a stream over time
* this will pass the last output value to the calculation function
*/
function reduce(parent$, fn, startValue) {
	var aggregate = fn(startValue, parent$.value);
	var newStream = stream(aggregate);
	parent$.listeners.push(function reduceValue(value) {
		aggregate = fn(aggregate, parent$.value);
		newStream(aggregate);
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
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(setImmediate) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PromiseQueue = PromiseQueue;
exports.timedBatchProcessing = timedBatchProcessing;
// run a queue that runs while it has members
// members can be functions or promises
function PromiseQueue() {
    var current = Promise.resolve();

    return {
        add: function add(fn) {
            current = current.then(function () {
                return new Promise(function (_resolve_, _reject_) {
                    var result = fn();
                    // enable usage of promises in queue for async behaviour
                    if (result != null && typeof result.then === "function") {
                        result.then(_resolve_);
                    } else {
                        setImmediate(_resolve_);
                    }
                });
            });
            return current;
        }
    };
}

// collect the results from running a set of functions one after another
// call a functions with the results until the end of a certain timeframe
function timedBatchProcessing(queueFnArr, batchCallback, maxTimePerChunk) {
    var queue = PromiseQueue();
    var results = [];
    maxTimePerChunk = maxTimePerChunk || 200;

    var startTime = new Date();
    queueFnArr.forEach(function (fn) {
        queue.add(function () {
            // if max time for one batch has reached, output the results for that batch
            var now = new Date();
            if (now - startTime > maxTimePerChunk) {
                startTime = now;
                batchCallback && batchCallback(results, results.length === queueFnArr.length);
                results = [];
            }
            // fn is a promises 
            if (typeof fn.then === 'function') {
                return fn.then(function (partial) {
                    return results = results.concat(fn);
                });
            }
            // fn is a function
            results = results.concat(fn());
        });
    });
    // when the queue is empty return all the results not yet send
    return queue.add(function () {
        if (results.length > 0) {
            batchCallback && batchCallback(results, true);
        }
    });
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10).setImmediate))

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.UPDATE_DONE = undefined;
exports.createElement = createElement;

var _streamy = __webpack_require__(0);

var _promiseQueue = __webpack_require__(1);

var UPDATE_DONE = exports.UPDATE_DONE = 'update_done';

// js DOM events. add which ones you need
var DOM_EVENT_LISTENERS = ['onchange', 'onclick', 'onmouseover', 'onmouseout', 'onkeydown', 'onload', 'ondblclick'];

var BATCH_CHILD_CHANGE_TRASHHOLD = 5;

/*
* Entry point for the streamy-dom
* creates a DOM element attaches handler for property changes and child changes and returns it immediatly
* this way we already pass around the actual dom element
*/
function createElement(tagName, properties$, children$Arr) {
	var elem = document.createElement(tagName);
	manageProperties(elem, properties$);
	manageChildren(elem, children$Arr);
	return elem;
}

// reacts to property changes and applies these changes to the dom element
function manageProperties(elem, properties$) {
	properties$.map(function (properties) {
		if (!properties) return;
		Object.getOwnPropertyNames(properties).map(function (property) {
			var value = properties[property];
			// check if event
			if (DOM_EVENT_LISTENERS.indexOf(property) !== -1) {
				// we can't pass the function as a property
				// so we bind to the event

				// property event binder start with 'on' but events not so we need to strip that
				var eventName = property.substr(2);
				elem.removeEventListener(eventName, value);
				elem.addEventListener(eventName, value);
			} else if (property === 'class' || property.toLowerCase() === 'classname') {
				elem.className = value;
				// we leave the possibility to define styles as strings
				// but we allow styles to be defined as an object
			} else if (property === 'style' && typeof value !== "string") {
				Object.assign(elem.style, value);
				// other propertys are just added as is to the DOM
			} else {
				elem.setAttribute(property, value);
			}
		});
	});
}

// manage changes in the childrens (not deep changes, those are handled by the children)
function manageChildren(parentElem, children$Arr) {
	var changeQueue = (0, _promiseQueue.PromiseQueue)([]);

	// hook into every child stream for changes
	// children can be arrays and are always treated like such
	// changes are then performed on the parent
	children$Arr.map(function (child$, index) {
		child$.reduce(function (oldChildArr, childArr) {
			// the default childArr will be [null]
			var changes = calcChanges(childArr, oldChildArr);

			if (changes.length === 0) {
				return childArr;
			}
			// apply the changes
			Promise.all(changes.map(function (_ref) {
				var indexes = _ref.indexes,
				    type = _ref.type,
				    num = _ref.num,
				    elems = _ref.elems;

				return updateDOMforChild(elems, index, indexes, type, num, parentElem);
			}))
			// after changes are done notify listeners
			.then(function () {
				notifyParent(parentElem, UPDATE_DONE);
			});

			return childArr;
		}, []);
	});
}

// very simple change detection
// if the children objects are not the same, they changed
// if there was an element before and there is no one know it got removed 
function calcChanges(childArr, oldChildArr) {
	var subIndex = 0;
	var changes = [];

	if (oldChildArr.length === 0 && childArr.length === 0) {
		return [];
	}

	for (; subIndex < childArr.length; subIndex++) {
		var oldChild = oldChildArr[subIndex];
		var newChild = childArr[subIndex];
		if (oldChild === newChild) {
			continue;
		};
		var type = oldChild != null && newChild == null ? 'rm' : oldChild == null && newChild != null ? 'add' : 'set';

		// aggregate consecutive changes of the similar type to perform batch operations
		var lastChange = changes.length > 0 ? changes[changes.length - 1] : null;
		// if there was a similiar change we add this change to the last change
		if (lastChange && lastChange.type === type) {
			if (type == 'rm') {
				// we just count the positions
				lastChange.num++;
			} else {
				// for add and set operations we need the exact index of the child and the child element to insert
				lastChange.indexes.push(subIndex);
				lastChange.elems.push(newChild);
			}
		} else {
			// if we couldn't aggregate we push a new change
			changes.push({
				indexes: [subIndex],
				elems: [newChild],
				num: 1,
				type: type
			});
		}
	}
	// all elements that are not in the new list got deleted
	if (subIndex < oldChildArr.length) {
		changes.push({
			indexes: [subIndex],
			num: oldChildArr.length - subIndex,
			type: 'rm'
		});
	}

	return changes;
}

// list of operations
// remove all the elements starting from a certain index
function removeElements(index, subIndexes, countOfElementsToRemove, parentElem, resolve) {
	for (var times = 0; times < countOfElementsToRemove; times++) {
		var node = parentElem.childNodes[index];
		if (node != null) {
			parentElem.removeChild(node);
		}
	}
	resolve();
}
// replace elements with new ones
function setElements(index, subIndexes, children, parentElem, resolve) {
	children.forEach(function (child, childIndex) {
		var actualIndex = index + subIndexes[childIndex];
		var elementAtPosition = parentElem.childNodes[actualIndex];
		parentElem.replaceChild(child, elementAtPosition);
	});
	resolve();
};
// add elements at a certain index
function addElements(index, subIndexes, children, parentElem, resolve) {
	// get right neighbor element and insert one after another before this element
	// index is now on position of insertion as we removed the element from this position before
	var elementAtPosition = parentElem.childNodes[index + subIndexes[0]];
	children.forEach(function (child) {
		if (elementAtPosition == null) {
			parentElem.appendChild(child);
		} else {
			parentElem.insertBefore(child, elementAtPosition);
		}
	});
	resolve();
}

// perform the actual manipulation on the parentElem
function updateDOMforChild(children, index, subIndexes, type, num, parentElem) {
	var _this = this;

	// make sure children are document nodes as we insert them into the DOM
	var nodeChildren = makeChildrenNodes(children);

	// choose witch change to perform
	var operation = void 0;
	switch (type) {
		case 'add':
			operation = addElements;
			break;
		case 'set':
			operation = setElements;
			break;
		case 'rm':
			operation = removeElements;
			break;
		default:
			return Promise.reject('Trying to perform a change with unknown change-type:', type);
	}

	// to minor changes directly but bundle long langes with many elements into one animationFrame to speed things update_done
	// if we do this for every change, this slows things down as we have to wait for the animationframe
	return new Promise(function (resolve, reject) {
		if (nodeChildren && nodeChildren.length > BATCH_CHILD_CHANGE_TRASHHOLD) {
			requestAnimationFrame(operation.bind(_this, index, subIndexes, type === 'rm' ? num : nodeChildren, parentElem, resolve));
		} else {
			operation(index, subIndexes, type === 'rm' ? num : nodeChildren, parentElem, resolve);
		}
	});
}

// transforms children into elements
// children can be calculated child elements or strings and numbers
function makeChildrenNodes(children) {
	return children == null ? [] : children.map(function (child) {
		if (child == null || typeof child === 'string' || typeof child === 'number') {
			return document.createTextNode(child);
		} else {
			return child;
		}
	});
}

// emit an event on the handled parent element
// this helps to test asynchronous rendered elements
function notifyParent(parentElem, event_name) {
	var event = new CustomEvent(event_name, {
		bubbles: false
	});
	parentElem.dispatchEvent(event);
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.h = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _streamy = __webpack_require__(0);

var _streamyDom = __webpack_require__(2);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/*
* wrap hyperscript elements in reactive streams dependent on their children streams
*/
var h = exports.h = function h(tag, props, children) {
	// jsx usally resolves known tags as strings and unknown tags as functions
	// if it is a sub component, resolve that component
	if (typeof tag === 'function') {
		return tag(props, children);
	}
	return (0, _streamyDom.createElement)(tag, wrapProps$(props), makeChildrenStreams$(children));
};

/*
* wrap all children in streams and merge those
* we make sure that all children streams are flat arrays to make processing uniform 
*/
function makeChildrenStreams$(children) {
	// wrap all children in streams
	var children$Arr = !Array.isArray(children) ? [] : children.map(function (child) {
		if (child === null || !(0, _streamy.isStream)(child)) {
			return (0, _streamy.stream)(child);
		}
		return child;
	});

	// make sure children are arrays and not nest
	return children$Arr.map(function (child$) {
		return flatten(makeArray(child$));
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
function flatten(stream) {
	return stream.map(function (arr) {
		while (arr.some(function (value) {
			return Array.isArray(value);
		})) {
			var _ref;

			arr = (_ref = []).concat.apply(_ref, _toConsumableArray(arr));
		}
		return arr;
	});
}

/*
* Wrap props into one stream
*/
function wrapProps$(props) {
	if (props === null) return (0, _streamy.stream)();
	if ((0, _streamy.isStream)(props)) {
		return props;
	}

	// go through all the props and make them a stream
	// if they are objects, traverse them to check if they include streams	
	var props$Arr = Object.keys(props).map(function (propName, index) {
		var value = props[propName];
		if ((0, _streamy.isStream)(value)) {
			return value.map(function (value) {
				return {
					key: propName,
					value: value
				};
			});
		} else {
			// if it's an object, traverse the sub-object making it a stream
			if (value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
				return wrapProps$(value).map(function (value) {
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
		return props.reduce(function (obj, _ref2) {
			var key = _ref2.key,
			    value = _ref2.value;

			obj[key] = value;
			return obj;
		}, {});
	});
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fetchHelper = __webpack_require__(12);

Object.keys(_fetchHelper).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _fetchHelper[key];
    }
  });
});

var _promiseQueue = __webpack_require__(1);

Object.keys(_promiseQueue).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _promiseQueue[key];
    }
  });
});

var _reduxy = __webpack_require__(13);

Object.keys(_reduxy).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _reduxy[key];
    }
  });
});

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

var _streamyDom = __webpack_require__(2);

Object.keys(_streamyDom).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _streamyDom[key];
    }
  });
});

var _streamyHyperscript = __webpack_require__(3);

Object.keys(_streamyHyperscript).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _streamyHyperscript[key];
    }
  });
});

var _router = __webpack_require__(14);

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
/* 9 */
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11), __webpack_require__(8)))

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function () {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function () {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
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
  this._clearFn.call(window, this._id);
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
__webpack_require__(9);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;

/***/ }),
/* 11 */
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
/* 12 */
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
		}).catch(function (e) {
			store.dispatch({ type: actionType + '_FAILURE', payload: e });
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
			case prefix + '_LOADING':
				output[prefix.toLowerCase() + '_loading'] = true;
				break;
			case prefix + '_SUCCESS':
				output[prefix.toLowerCase() + '_loading'] = false;
				break;
			case prefix + '_FAILURE':
				output[prefix.toLowerCase() + '_loading'] = false;
				output[prefix.toLowerCase() + '_error'] = payload.message;
				break;
		}
		return reducer(output, { type: type, payload: payload });
	};
}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.reduxy = reduxy;
exports.queryStore = queryStore;

var _streamy = __webpack_require__(0);

/*
* simple action -> reducers -> state mashine
*/
function reduxy(reducers) {
	var action$ = (0, _streamy.stream)({ type: 'INIT' });
	var state$ = (0, _streamy.stream)();
	action$.map(function (action, self) {
		return reduce(state$, reducers, action);
	});
	// action$.map((action) => console.log('Action called:', action));
	// state$.map((state) => console.log('New State:', state));

	return {
		// query a value from the store
		// as we probably render according to the values of this store only serve distinct values
		// query format: {reducer}.{property}.{subproperty}
		$: function $(query) {
			return state$.$(query).distinct();
		},
		dispatch: function dispatch(action) {
			action$(action);
			return;
		}
	};
}

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
	if (!query) return state$;
	return state$.deepSelect(query);
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NEW_ROUTE = undefined;
exports.routerReducer = routerReducer;
exports.initRouter = initRouter;
exports.Router = Router;

var _streamyHyperscript = __webpack_require__(3);

var NEW_ROUTE = exports.NEW_ROUTE = 'NEW_ROUTE';

var INITIAL_STORE = {
    route: '/',
    params: {}
};

// we use a reducer to unify the way we check for information
function routerReducer(_state, _ref) {
    var type = _ref.type,
        payload = _ref.payload;

    var state = _state || INITIAL_STORE;
    switch (type) {
        case NEW_ROUTE:
            return Object.assign({}, state, {
                route: payload.route,
                params: payload.params
            });
    }

    return state;
}

function initRouter(store) {
    // intercepts clicks on links
    // if the link is local '/...' we change the location hash instead
    function interceptClickEvent(e) {
        var href;
        var target = e.target || e.srcElement;
        if (target.tagName === 'A') {
            href = target.getAttribute('href');
            var isLocal = href != null && href.startsWith('/');

            //put your logic here...
            if (isLocal) {
                location.hash = href;

                //tell the browser not to respond to the link click
                e.preventDefault();
            }
        }
    }

    // callback for HTML5 navigation events
    // save the routing info in the store
    function dispatchRouteChange() {
        var href = location.hash.substr(1, location.hash.length - 1);
        store.dispatch({ type: NEW_ROUTE, payload: {
                route: href === '' ? '/' : href.split('?')[0],
                params: getUrlParams(href)
            } });
    }

    // react to HTML5 go back and forward events
    window.onpopstate = function () {
        dispatchRouteChange();
    };

    // listen for link click events at the document level
    document.addEventListener('click', interceptClickEvent);

    // react to initial routing info
    if (location.hash != '') {
        dispatchRouteChange();
    }
}

// src: http://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-get-parameters
function getUrlParams(href) {
    var params = {};
    if (href === '') {
        return params;
    };
    var splitHref = href.split('?');
    if (splitHref.length == 0) {
        return params;
    }
    var query = splitHref[1];
    var vars = query.split("&");
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
function Router(_ref2, children) {
    var store = _ref2.store,
        route = _ref2.route;

    if (store == null) {
        console.log('The Router component needs the store as attribute.');
        return null;
    }
    if (route == null) {
        console.log('The Router component needs the route as attribute.');
        return null;
    }
    return store.$('router.route').map(function (curRoute) {
        return curRoute === route;
    }).map(function (hitRoute) {
        return hitRoute ? children : [];
    });
}

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = __webpack_require__(4);

Object.keys(_utils).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _utils[key];
    }
  });
});

/***/ })
/******/ ]);