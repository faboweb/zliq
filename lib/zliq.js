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
	s.debounce = function (timer) {
		return debounce(s, timer);
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
	var newStream = fork$(parent$, fn);
	parent$.listeners.push(function mapValue(value) {
		newStream(fn(value));
	});
	return newStream;
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
	return merge$(selectorArr.map(function (selector) {
		return deepSelect(parent$, selector);
	}));
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
	stopEmitValues$.map(function (stopEmitValues) {
		if (stopEmitValues) {
			removeItem(parent$.listeners, newStream);
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
	var aggregate = startValue;
	var newStream = stream();
	function reduceValue(value) {
		aggregate = fn(aggregate, parent$.value);
		newStream(aggregate);
	}
	if (parent$.value !== undefined) {
		reduceValue(parent$.value);
	};
	parent$.listeners.push(reduceValue);
	return newStream;
}

function debounce(parent$, timer) {
	var curTimer = void 0;
	function debounceValue(value) {
		if (curTimer) {
			window.clearTimeout(curTimer);
		}
		curTimer = setTimeout(function () {
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
};

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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.render = render;
exports.diff = diff;
exports.createNode = createNode;

var _streamy = __webpack_require__(1);

var TEXT_NODE = '#text';

function render(_ref, parentElement) {
	var vdom$ = _ref.vdom$;

	return vdom$.debounce(debounce).reduce(function renderUpdate(_ref2, _ref3) {
		var oldElement = _ref2.element,
		    oldVersion = _ref2.version,
		    oldChildren = _ref2.children,
		    keyContainer = _ref2.keyContainer;
		var tag = _ref3.tag,
		    props = _ref3.props,
		    children = _ref3.children,
		    version = _ref3.version;

		if (oldElement === null) {
			oldElement = createNode(tag, children);
			if (parentElement) {
				parentElement.appendChild(oldElement);
			}
		}
		diff(oldElement, tag, props, children, version, oldChildren, oldVersion, keyContainer);

		// signalise mount of root element on initial render
		if (parentElement && version === 0) {
			triggerLifecycle(oldElement, props, 'mounted');
		}
		return {
			element: oldElement,
			version: version,
			children: copyChildren(children),
			keyContainer: keyContainer
		};
	}, {
		element: null,
		version: -1,
		children: [],
		keyContainer: {}
	});
}

function diff(oldElement, tag, props, newChildren, newVersion, oldChildren, oldVersion, keyContainer) {
	var newElement = oldElement;
	var keyState = void 0;
	// for keyed elements, we recall unchanged elements
	if (props && props.id) {
		keyState = keyContainer[props.id];
	}
	if (keyState && newVersion === keyState.version) {
		if (oldElement !== keyState.element) {
			oldElement.parentElement.replaceChild(keyState.element, oldElement);
		}
		return keyState.element;
	}

	if (isTextNode(oldElement) && tag === TEXT_NODE) {
		updateTextNode(newElement, newChildren[0]);
		return newElement;
	}

	// we do not mutate foreign cached (id) elements
	// if the node types do not differ, we reuse the old node
	var isCached = oldElement.id !== "";
	var isOwnCached = isCached && props && props.id === oldElement.id;
	if (isCached && !isOwnCached || nodeTypeDiffers(oldElement, tag)) {
		newElement = createNode(tag, newChildren);
		oldElement.parentElement.replaceChild(newElement, oldElement);
		oldChildren = [];
		oldVersion = -1;
	}

	diffAttributes(newElement, props);

	// save keyed elements
	if (props && props.id) {
		keyContainer[props.id] = {
			version: newVersion,
			element: newElement
		};
	}

	// text nodes have no real child-nodes, but have a string value as first child
	if (tag !== TEXT_NODE) {
		diffChildren(newElement, newChildren, oldChildren, keyContainer);
	}

	if (newVersion === 0) {
		triggerLifecycle(newElement, props, 'created');
	}

	if (newVersion > 0) {
		triggerLifecycle(newElement, props, 'updated');
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
	if (attribute === 'class' || attribute === 'className') {
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

// remove attributes that are not in props anymore
function cleanupAttributes(element, props) {
	if (element.props !== undefined) {
		for (var attribute in element.props) {
			if (props[attribute] === undefined) {
				element.removeAttribute(attribute);
			}
		}
	}
}

function unifyChildren(children) {
	return children.map(function (child) {
		// if there is no tag we assume it's a number or a string
		if (!(0, _streamy.isStream)(child) && child.tag === undefined) {
			return {
				tag: TEXT_NODE,
				children: [child],
				version: 0,
				cycle: child.cycle || {}
			};
		} else {
			return child;
		}
	});
}

function diffChildren(element, newChildren, oldChildren, keyContainer) {
	var oldChildNodes = element.childNodes;
	var unifiedChildren = unifyChildren(newChildren);
	var unifiedOldChildren = unifyChildren(oldChildren);

	if (newChildren.length === 0 && oldChildren.length === 0) {
		return;
	}

	var i = 0;
	// diff existing nodes
	for (; i < oldChildNodes.length && i < newChildren.length; i++) {
		var oldElement = oldChildNodes[i];
		var _unifiedOldChildren$i = unifiedOldChildren[i],
		    oldVersion = _unifiedOldChildren$i.version,
		    oldChildChildren = _unifiedOldChildren$i.children;
		var _unifiedChildren$i = unifiedChildren[i],
		    tag = _unifiedChildren$i.tag,
		    props = _unifiedChildren$i.props,
		    children = _unifiedChildren$i.children,
		    version = _unifiedChildren$i.version;


		diff(oldElement, tag, props, children, version, oldChildChildren, oldVersion, keyContainer);
	}

	// remove not needed nodes at the end
	for (var remaining = element.childNodes.length; remaining > newChildren.length; remaining--) {
		var childToRemove = element.childNodes[remaining - 1];
		element.removeChild(childToRemove);

		if (unifiedOldChildren.length < remaining) {
			console.log("ZLIQ: Something other then ZLIQ has manipulated the children of the element", element, ". This can lead to sideffects. Please check your code.");
			continue;
		} else {
			var props = unifiedOldChildren[remaining - 1].props;


			triggerLifecycle(childToRemove, props, 'removed');
		}
	}

	// add new nodes
	for (; i < newChildren.length; i++) {
		var _unifiedChildren$i2 = unifiedChildren[i],
		    tag = _unifiedChildren$i2.tag,
		    _props = _unifiedChildren$i2.props,
		    children = _unifiedChildren$i2.children,
		    version = _unifiedChildren$i2.version;

		var newElement = createNode(tag, children);

		element.appendChild(newElement);
		diff(newElement, tag, _props, children, version, [], -1, keyContainer);
		triggerLifecycle(newElement, _props, 'mounted');
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

function copyChildren(oldChildren) {
	if (oldChildren === undefined) return [];

	var newChildren = JSON.parse(JSON.stringify(oldChildren));
	newChildren.forEach(function (child, index) {
		if (oldChildren[index].cycle) {
			child.cycle = oldChildren[index].cycle;
		}

		if (_typeof(oldChildren[index]) === 'object') {
			child.children = copyChildren(oldChildren[index].children);
		}
	});
	return newChildren;
}

function triggerLifecycle(element, props, event) {
	if (props && props.cycle && props.cycle[event]) {
		props.cycle[event](element);
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

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.test = test;
exports.test$ = test$;

var _src = __webpack_require__(2);

function test(_ref, schedule, done) {
    var vdom$ = _ref.vdom$;

    var container = document.createElement('div');
    return test$((0, _src.render)({ vdom$: vdom$ }, container, 0), schedule, done);
}

function test$(stream, schedule) {
    var done = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {
        return null;
    };

    return stream.reduce(function (iteration, value) {
        // tests produce async behaviour often syncronous
        // this can cause race effects on stream declarations
        // here the iterations are made asynchronous to prevent this
        setTimeout(function () {
            if (schedule[iteration] === undefined) {
                throw new Error('Unexpected Update!');
            }
            schedule[iteration](value);
            if (schedule.length === iteration + 1 && done) {
                done();
            }
        });

        return iteration + 1;
    }, 0);
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
    router$.$('routes'
    // routes can be attached async so we check if the route exists and if not add it
    ).map(function (routes) {
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

    var routeWasHit$ = sanitizedRoute$.is(route).distinct();
    return (0, _.merge$)([routeWasHit$, children$]).map(function (_ref3) {
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

var _ = __webpack_require__(0);

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
	return (0, _.merge$)($arr).map(function (arr) {
		return arr.join(' ');
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

	var component = void 0;
	var version = -1;

	var mergedChildren$ = mergeChildren$(flatten(children));
	// jsx usually resolves known tags as strings and unknown tags as functions
	// if it is a sub component, resolve that component
	if (typeof tag === 'function') {
		return tag(props, mergedChildren$);
	}
	// add detachers to props
	if (props !== null) {
		Object.keys(props).map(function (propName, index) {
			if ((0, _streamy.isStream)(props[propName])) {
				props[propName] = props[propName];
			}
		});
	}
	return {
		vdom$: (0, _streamy.merge$)([wrapProps$(props), mergedChildren$.map(flatten)]).map(function (_ref) {
			var _ref2 = _slicedToArray(_ref, 2),
			    props = _ref2[0],
			    children = _ref2[1];

			return {
				tag: tag,
				props: props,
				children: children,
				version: ++version
			};
		})
	};
};

// input has format [stream | {vdom$}]
function mergeChildren$(children) {
	if (!Array.isArray(children)) {
		children = [children];
	}
	children = flatten(children).filter(function (_) {
		return _ !== null;
	});
	var childrenVdom$arr = children.map(function (child) {
		if ((0, _streamy.isStream)(child)) {
			return child.flatMap(mergeChildren$);
		}
		return child.vdom$ || child;
	});

	return (0, _streamy.merge$)(childrenVdom$arr);
}

/*
* wrap all children in streams and merge those
* we make sure that all children streams are flat arrays to make processing uniform
* output: stream([stream([])])
*/
function getChildrenVdom$arr(childrenArr) {
	var _ref3;

	// flatten children arr
	// needed to make react style hyperscript (children as arguments) working parallel to preact style hyperscript (children as array)
	childrenArr = (_ref3 = []).concat.apply(_ref3, _toConsumableArray(childrenArr));
	// only handle vdom for now
	var children$Arr = childrenArr.map(function (component) {
		// if there is no vdom$ it is a string or number
		if (component.vdom$ === undefined) {
			return (0, _streamy.stream)(component);
		}
		return component.vdom$;
	});

	return children$Arr
	// make sure children are arrays and not nest
	.map(function (_) {
		return makeArray(_).map(flatten);
	}
	// so we can easily merge them
	).map(function (vdom$) {
		return vdom$.flatMap(function (vdomArr) {
			return (0, _streamy.merge$)(vdomArr);
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
function flatten(array, mutable) {
	var toString = Object.prototype.toString;
	var arrayTypeStr = '[object Array]';

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

/*
* Wrap props into one stream
*/
function wrapProps$(props) {
	if (props === null) return (0, _streamy.stream)({});
	if ((0, _streamy.isStream)(props)) {
		return props;
	}

	var nestedStreams = extractNestedStreams(props);
	var updateStreams = nestedStreams.map(function makeNestedStreamUpdateProps(_ref4) {
		var parent = _ref4.parent,
		    key = _ref4.key,
		    stream = _ref4.stream;

		return stream.distinct
		// here we produce a sideeffect on the props object -> low GC
		// to trigger the merge we also need to return sth (as undefined does not trigger listeners)
		().map(function (value) {
			parent[key] = value;
			return value;
		});
	});
	return (0, _streamy.merge$)(updateStreams).map(function (_) {
		return props;
	});
}

// to react to nested streams in an object, we extract the streams and a reference to their position
// returns [{parentObject, propertyName, stream}]
function extractNestedStreams(obj) {
	return flatten(Object.keys(obj).map(function (key) {
		if (obj[key] === null) {
			return [];
		}
		if (_typeof(obj[key]) === 'object') {
			return extractNestedStreams(obj[key]);
		}
		if ((0, _streamy.isStream)(obj[key])) {
			return [{
				parent: obj,
				key: key,
				stream: obj[key]
			}];
		}
		return [];
	}));
}

/***/ })
/******/ ]);
});
//# sourceMappingURL=zliq.js.map