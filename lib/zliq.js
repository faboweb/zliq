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
/******/ 	return __webpack_require__(__webpack_require__.s = 17);
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

var _deepEqual = __webpack_require__(4);

var _deepEqual2 = _interopRequireDefault(_deepEqual);

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

    var startTime = now();
    queueFnArr.forEach(function (fn) {
        queue.add(function () {
            if (now() - startTime > maxTimePerChunk) {
                startTime = now();
                batchCallback && batchCallback(results);
                results = [];
            }
            if (typeof fn.then === 'function') {
                return fn.then(function (partial) {
                    return results = results.concat(fn);
                });
            }
            results = results.concat(fn());
        });
    });
    return queue.add(function () {
        if (results.length > 0) {
            batchCallback && batchCallback(results);
        }
    });
}

function now() {
    return new Date().getTime();
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10).setImmediate))

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.createElement = createElement;

var _odiff = __webpack_require__(7);

var _odiff2 = _interopRequireDefault(_odiff);

var _streamy = __webpack_require__(0);

var _promiseQueue = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// js DOM events. add which ones you need
var DOM_EVENT_LISTENERS = ['onchange', 'onclick', 'onmouseover', 'onmouseout', 'onkeydown', 'onload', 'ondblclick'];

function createElement(tagName, properties$, children$Arr) {
	var elem = document.createElement(tagName);
	manageProperties(elem, properties$);
	manageChildren(elem, children$Arr);
	return elem;
}

function manageChildren(parentElem, children$Arr) {
	var changeQueue = (0, _promiseQueue.PromiseQueue)([]);
	// array to store the actual count of elements in one virtual elem
	// one virtual elem can produce a list of elems so we can't rely on the index only
	children$Arr.map(function (child$, index) {
		// TODO get rid of IS_CHANGE_STREAM flag
		if (child$.IS_CHANGE_STREAM) {
			child$.map(function (changes) {
				changes.forEach(function (_ref) {
					var subIndex = _ref.index,
					    elems = _ref.elems,
					    type = _ref.type,
					    num = _ref.num;

					changeQueue.add(function () {
						return updateDOMforChild(elems, index, subIndex, type, num, parentElem);
					});
				});
			});
		} else {
			var oldChilds = [];
			var oldChild = null;
			child$.map(function (child) {
				var changes = void 0;
				// streams can return arrays of children
				if (Array.isArray(child)) {
					changes = (0, _odiff2.default)(oldChilds, child).map(function (change) {
						change.elems = change.vals;
						delete change.vals;
						return change;
					});
					oldChilds = child;
				} else {
					if (oldChild == null && child == null) return;

					changes = [{
						index: 0,
						type: oldChild != null && child == null ? 'rm' : oldChild == null && child != null ? 'add' : 'set',
						elems: [child]
					}];
					oldChild = child;
				}
				changes.forEach(function (_ref2) {
					var subIndex = _ref2.index,
					    elems = _ref2.elems,
					    type = _ref2.type,
					    num = _ref2.num;

					changeQueue.add(function () {
						return updateDOMforChild(elems, index, subIndex, type, num, parentElem);
					});
				});
			});
		}
	});
}

/*
* perform the actual manipulation on the parentElem
*/
function updateDOMforChild(children, index, subIndex, type, num, parentElem) {
	// console.log('performing update on DOM', children, index, subIndex, type, num, parentElem);
	// remove all the elements starting from a certain index
	if (type === 'rm') {
		for (var times = 0; times < num; times++) {
			var node = parentElem.childNodes[index];
			if (node != null) {
				parentElem.removeChild(node);
			}
		}
		return Promise.resolve();
	} else {
		// make sure children are document nodes 
		if (children == null || children.length != null && (typeof children[0] === 'string' || typeof children[0] === 'number')) {
			children = [document.createTextNode(children)];
		}
	}

	if (type === 'add') {
		var visibleIndex = index + (subIndex != null ? subIndex : 0);
		return performAdd(children, parentElem, visibleIndex);
	}

	if (type === 'set') {
		return performSet(children, index, subIndex, parentElem);
	}
}

function performAdd(children, parentElem, index) {
	return new Promise(function (resolve, reject) {
		function addElement() {
			// get right border element and insert one after another before this element
			// index is now on position of insertion as we removed the element from this position before
			var elementAtPosition = parentElem.childNodes[index];
			children.forEach(function (child) {
				if (elementAtPosition == null) {
					parentElem.appendChild(child);
				} else {
					parentElem.insertBefore(child, elementAtPosition);
				}
			});
			resolve();
		}

		// only request an animation frame for inserts of many elements
		// let the browser handle querying of insertion of single elements
		if (children.length > 5) {
			requestAnimationFrame(addElement);
		} else {
			addElement();
		}
	});
}

function performSet(children, index, subIndexArr, parentElem) {
	return new Promise(function (resolve, reject) {
		if (!Array.isArray(children)) {
			children = [children];
		}
		if (!Array.isArray(subIndexArr)) {
			subIndexArr = [subIndexArr];
		}
		function setElement() {
			children.forEach(function (child, childIndex) {
				var subIndex = subIndexArr[childIndex];
				var visibleIndex = index + (subIndex != null ? subIndex : 0);
				var elementAtPosition = parentElem.childNodes[visibleIndex];
				if (elementAtPosition == null) {
					parentElem.appendChild(child);
				} else {
					parentElem.replaceChild(child, elementAtPosition);
				}
			});
			resolve();
		}

		// only request an animation frame for inserts of many elements
		// let the browser handle querying of insertion of single elements
		if (children.length > 5) {
			requestAnimationFrame(setElement);
		} else {
			setElement();
		}
	});
	var elementAtPosition = parentElem.childNodes[index];
	var nextElement = elementAtPosition ? elementAtPosition.nextSibling : null;
	if (child == null) {
		if (elementAtPosition != null) {
			parentElem.removeChild(elementAtPosition);
		}
		return;
	}
	if (elementAtPosition == null) {
		parentElem.appendChild(child);
	} else {
		parentElem.removeChild(elementAtPosition);
		if (nextElement == null) {
			parentElem.appendChild(child);
		} else {
			nextElement.parentNode.insertBefore(child, nextElement);
		}
	}
}

function manageProperties(elem, properties$) {
	properties$.map(function (properties) {
		if (!properties) return;
		Object.getOwnPropertyNames(properties).map(function (property) {
			var value = properties[property];
			// check if event
			if (DOM_EVENT_LISTENERS.indexOf(property) !== -1) {
				// we can't pass the function as a property
				// so we bind to the event
				var eventName = property.substr(2);
				elem.removeEventListener(eventName, value);
				elem.addEventListener(eventName, value);
			} else if (property === 'class' || property.toLowerCase() === 'classname') {
				elem.className = value;
			} else if (property === 'style') {
				Object.assign(elem.style, value);
			} else {
				elem.setAttribute(property, value);
			}
		});
	});
}

/***/ }),
/* 3 */
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

var _streamyHyperscript = __webpack_require__(14);

Object.keys(_streamyHyperscript).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _streamyHyperscript[key];
    }
  });
});

var _streamyList = __webpack_require__(15);

Object.keys(_streamyList).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _streamyList[key];
    }
  });
});

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var pSlice = Array.prototype.slice;
var objectKeys = __webpack_require__(6);
var isArguments = __webpack_require__(5);

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
/* 5 */
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
/* 6 */
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* Copyright (c) 2013 Billy Tetrud - Free to use for any purpose: MIT License*/
// gets the changes that need to happen to a to change it into b
// returns an object with the members
// type
// property
// value
// values
// count

module.exports = function (a, b) {
    var results = [];
    diffInternal(a, b, results, []);
    return results;
};

var diffInternal = function diffInternal(a, b, acc, base) {
    if (a === b || Number.isNaN(a) && Number.isNaN(b)) {
        return;
    } else if (a instanceof Array && b instanceof Array) {
        var an = a.length - 1,
            bn = b.length - 1;
        while (an >= 0 && bn >= 0) {
            // loop backwards (so that making changes in order will work correctly)
            if (!equal(a[an], b[bn])) {
                var indexes = findMatchIndexes(equal, a, b, an, bn, 0, 0);

                var anInner = an,
                    bnInner = bn;
                while (anInner > indexes.a && bnInner > indexes.b) {
                    if (similar(a[anInner], b[bnInner])) {
                        // get change for that element
                        diffInternal(a[anInner], b[bnInner], acc, base.concat([anInner]));
                        anInner--;bnInner--;
                    } else {
                        var indexesInner = findMatchIndexes(similar, a, b, anInner, bnInner, indexes.a + 1, indexes.b + 1);

                        var numberPulled = anInner - indexesInner.a;
                        var numberPushed = bnInner - indexesInner.b;

                        if (numberPulled === 1 && numberPushed === 1) {
                            set(acc, base.concat(indexesInner.a + 1), b[indexesInner.b + 1]); // set the one
                        } else if (numberPulled === 1 && numberPushed === 2) {
                            // set one, push the other
                            add(acc, base, indexesInner.a + 2, b.slice(indexesInner.b + 2, bnInner + 1));
                            set(acc, base.concat(indexesInner.a + 1), b[indexesInner.b + 1]);
                        } else if (numberPulled === 2 && numberPushed === 1) {
                            // set one, pull the other
                            rm(acc, base, indexesInner.a + 2, 1);
                            set(acc, base.concat(indexesInner.a + 1), b[indexesInner.b + 1]);
                        } else if (numberPulled === 2 && numberPushed === 2) {
                            set(acc, base.concat(indexesInner.a + 2), b[indexesInner.b + 2]);
                            set(acc, base.concat(indexesInner.a + 1), b[indexesInner.b + 1]);
                        } else {
                            if (numberPulled > 0) {
                                // if there were some elements pulled
                                rm(acc, base, indexesInner.a + 1, numberPulled);
                            }
                            if (numberPushed > 0) {
                                // if there were some elements pushed
                                add(acc, base, indexesInner.a + 1, b.slice(indexesInner.b + 1, bnInner + 1));
                            }
                        }

                        anInner = indexesInner.a;
                        bnInner = indexesInner.b;
                    }
                }

                if (anInner > indexes.a) {
                    // more to pull
                    rm(acc, base, anInner, anInner - indexes.a);
                } else if (bnInner > indexes.b) {
                    // more to push
                    add(acc, base, anInner + 1, b.slice(indexes.b + 1, bnInner + 1));
                }

                an = indexes.a;
                bn = indexes.b;
            } else {
                an--;bn--;
            }
        }

        if (an >= 0) {
            // more to pull
            rm(acc, base, 0, an + 1);
        } else if (bn >= 0) {
            // more to push
            add(acc, base, 0, b.slice(0, bn + 1));
        }
    } else if (a instanceof Object && b instanceof Object) {
        var keyMap = merge(arrayToMap(Object.keys(a)), arrayToMap(Object.keys(b)));
        for (var key in keyMap) {
            var path = base.concat([key]);
            diffInternal(a[key], b[key], acc, path);
        }
    } else {
        set(acc, base, b);
    }

    // adds an 'set' type to the changeList
    function set(changeList, property, value) {
        changeList.push({
            type: 'set',
            path: property,
            val: value
        });
    }

    // adds an 'rm' type to the changeList
    function rm(changeList, property, index, count) {
        changeList.push({
            type: 'rm',
            path: property,
            index: index,
            num: count
        });
    }

    // adds an 'add' type to the changeList
    function add(changeList, property, index, values) {
        changeList.push({
            type: 'add',
            path: property,
            index: index,
            vals: values
        });
    }
};

module.exports.similar = similar;
module.exports.equal = equal;

// finds and returns the closest indexes in a and b that match starting with divergenceIndex
// note: loops backwards like the rest of this stuff
// returns the index beyond the first element (aSubMin-1 or bSubMin-1) for each if there is no match
// parameters:
// compareFn - determines what matches (returns true if the arguments match)
// a,b - two arrays to compare
// divergenceIndexA,divergenceIndexB - the two positions of a and b to start comparing from
// aSubMin,bSubMin - the two positions to compare until
function findMatchIndexes(compareFn, a, b, divergenceIndexA, divergenceIndexB, aSubMin, bSubMin) {
    var maxNForA = divergenceIndexA - aSubMin;
    var maxNForB = divergenceIndexB - bSubMin;
    var maxN = Math.max(maxNForA, maxNForB);
    for (var n = 1; n <= maxN; n++) {
        var newestA = a[divergenceIndexA - n]; // the current item farthest from the divergence index being compared
        var newestB = b[divergenceIndexB - n];

        if (n <= maxNForB && n <= maxNForA && compareFn(newestA, newestB)) {
            return { a: divergenceIndexA - n, b: divergenceIndexB - n };
        }

        for (var j = 0; j < n; j++) {
            var elemA = a[divergenceIndexA - j]; // an element between the divergence index and the newest items
            var elemB = b[divergenceIndexB - j];

            if (n <= maxNForB && compareFn(elemA, newestB)) {
                return { a: divergenceIndexA - j, b: divergenceIndexB - n };
            } else if (n <= maxNForA && compareFn(newestA, elemB)) {
                return { a: divergenceIndexA - n, b: divergenceIndexB - j };
            }
        }
    }
    // else
    return { a: aSubMin - 1, b: bSubMin - 1 };
}

// compares arrays and objects and returns true if they're similar meaning:
// less than 2 changes, or
// less than 10% different members
function similar(a, b) {
    if (a instanceof Array) {
        if (!(b instanceof Array)) return false;

        var tenPercent = a.length / 10;
        var notEqual = Math.abs(a.length - b.length); // initialize with the length difference
        for (var n = 0; n < a.length; n++) {
            if (equal(a[n], b[n])) {
                if (notEqual >= 2 && notEqual > tenPercent || notEqual === a.length) {
                    return false;
                }

                notEqual++;
            }
        }
        // else
        return true;
    } else if (a instanceof Object) {
        if (!(b instanceof Object)) return false;

        var keyMap = merge(arrayToMap(Object.keys(a)), arrayToMap(Object.keys(b)));
        var keyLength = Object.keys(keyMap).length;
        var tenPercent = keyLength / 10;
        var notEqual = 0;
        for (var key in keyMap) {
            var aVal = a[key];
            var bVal = b[key];

            if (!equal(aVal, bVal)) {
                if (notEqual >= 2 && notEqual > tenPercent || notEqual + 1 === keyLength) {
                    return false;
                }

                notEqual++;
            }
        }
        // else
        return true;
    } else {
        return a === b || Number.isNaN(a) && Number.isNaN(b);
    }
}

// compares arrays and objects for value equality (all elements and members must match)
function equal(a, b) {
    if (a instanceof Array) {
        if (!(b instanceof Array)) return false;
        if (a.length !== b.length) {
            return false;
        } else {
            for (var n = 0; n < a.length; n++) {
                if (!equal(a[n], b[n])) {
                    return false;
                }
            }
            // else
            return true;
        }
    } else if (a instanceof Object) {
        if (!(b instanceof Object)) return false;

        var aKeys = Object.keys(a);
        var bKeys = Object.keys(b);

        if (aKeys.length !== bKeys.length) {
            return false;
        } else {
            for (var n = 0; n < aKeys.length; n++) {
                var key = aKeys[n];
                var aVal = a[key];
                var bVal = b[key];

                if (!equal(aVal, bVal)) {
                    return false;
                }
            }
            // else
            return true;
        }
    } else {
        return a === b || Number.isNaN(a) && Number.isNaN(b);
    }
}

// turns an array of values into a an object where those values are all keys that point to 'true'
function arrayToMap(array) {
    var result = {};
    array.forEach(function (v) {
        result[v] = true;
    });
    return result;
}

// Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
// returns obj1 (now mutated)
function merge(obj1, obj2) {
    for (var key in obj2) {
        obj1[key] = obj2[key];
    }

    return obj1;
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
			return queryStore(state$, query).distinct();
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
*/
function makeChildrenStreams$(children) {
	// wrap all children in streams
	var children$Arr = [].concat(children).reduce(function makeStream(arr, child) {
		if (child === null || !(0, _streamy.isStream)(child)) {
			return arr.concat((0, _streamy.stream)(child));
		}
		return arr.concat(child);
	}, []);

	return children$Arr;
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
		return props.reduce(function (obj, _ref) {
			var key = _ref.key,
			    value = _ref.value;

			obj[key] = value;
			return obj;
		}, {});
	});
}

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.list = list;

var _streamy = __webpack_require__(0);

var _promiseQueue = __webpack_require__(1);

var ChangeWorker = __webpack_require__(16);

function list(input$, listSelector, renderFunc) {
	var output$ = (0, _streamy.stream)([]);
	var changeQueue = new _promiseQueue.PromiseQueue();
	var startTime = new Date();
	(0, _streamy.merge$)(listChanges$(input$.map(function (value) {
		return value != null ? value[listSelector] : null;
	})), input$.map(function (value) {
		if (value == null) {
			return null;
		}
		var copiedValue = Object.assign({}, value);
		delete copiedValue[listSelector];
		return copiedValue;
	}).distinct()).map(function (_ref) {
		var _ref2 = _slicedToArray(_ref, 2),
		    changes = _ref2[0],
		    inputs = _ref2[1];

		changes.forEach(function (change) {
			changeQueue.add(function () {
				return renderChange(change, inputs, renderFunc, function (partialRenderedChange) {
					// console.log('outputting rendered change', renderedChange);
					output$(partialRenderedChange);
				});
				// .then(() => {
				// 	console.log('rendered change', change);
				// });
			});
			// .then(() => {
			// 	console.log('resolved changes', changes);
			// })
		});
	});
	output$.IS_CHANGE_STREAM = true;
	return output$;
}

function renderChange(_ref3, inputs, renderFunc, batchCallback) {
	var index = _ref3.index,
	    val = _ref3.val,
	    vals = _ref3.vals,
	    type = _ref3.type,
	    num = _ref3.num,
	    path = _ref3.path;

	if (type === 'add' || type === 'set') {
		var renderedAddElems = [];
		var queue = new _promiseQueue.PromiseQueue();
		var startTime = now();
		return (0, _promiseQueue.timedBatchProcessing)(vals.map(function (val) {
			return function () {
				return renderFunc(val, inputs);
			};
		}), function (elems) {
			var partialChange = {
				type: type,
				index: index,
				elems: elems
			};
			index += elems.length;
			batchCallback([partialChange]);
		});
		// .then(() => {
		// 	console.log('finished rendering add bulk', vals);
		// });
	}
	if (type == 'rm') {
		batchCallback([{
			type: type,
			index: index,
			num: num
		}]);
	}
	return Promise.resolve();
}

// calculate the difference in the array
// do the calculation in a worker to not block UI-thread
function listChanges$(arr$) {
	var oldValue = [];
	var changes$ = (0, _streamy.stream)([]);
	var changeWorker = new ChangeWorker();
	changeWorker.onmessage = function (_ref4) {
		var changes = _ref4.data.changes;

		changes$(changes);
	};
	arr$.map(function (arr) {
		changeWorker.postMessage({ newArr: arr, oldArr: oldValue });
		oldValue = arr;
	});
	return changes$;
}

function now() {
	return new Date().getTime();
}

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function() {
	return new Worker(__webpack_require__.p + "4fe6723dbb9445d18fa2.worker.js");
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = __webpack_require__(3);

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