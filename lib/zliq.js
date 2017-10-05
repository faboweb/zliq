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

var _streamyHelpers = __webpack_require__(13);

Object.keys(_streamyHelpers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _streamyHelpers[key];
    }
  });
});

var _router = __webpack_require__(12);

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
/* WEBPACK VAR INJECTION */(function(setImmediate) {

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
	setImmediate(function () {
		if (parent$.value == null) {
			parent$(partialChange);
			return;
		}

		parent$(Object.assign({}, parent$.value, partialChange));
	});
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10).setImmediate))

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

function render(vdom$, parentElement) {
	var debounce = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;

	return vdom$.debounce(debounce).reduce(function renderUpdate(_ref, _ref2) {
		var oldElement = _ref.element,
		    oldVersion = _ref.version,
		    oldChildren = _ref.children,
		    keyContainer = _ref.keyContainer;
		var tag = _ref2.tag,
		    props = _ref2.props,
		    children = _ref2.children,
		    version = _ref2.version;

		if (oldElement === null) {
			oldElement = createNode(tag, children);
			if (parentElement) {
				parentElement.appendChild(oldElement);
			}
		}
		var newElement = diff(oldElement, tag, props, children, version, oldChildren, oldVersion, keyContainer);

		// signalise mount of root element on initial render
		if (parentElement && version === 0) {
			triggerLifecycle(oldElement, props, 'mounted');
		}

		return {
			element: newElement,
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

function diff(oldElement, tag, props, newChildren, newVersion, oldChildren, oldVersion, cacheContainer) {
	var newElement = oldElement;
	var isCaching = props && props.id;
	// for keyed elements, we recall unchanged elements
	if (isCaching) {
		newElement = diffCachedElement(oldElement, tag, props, newChildren, newVersion, cacheContainer);
	} else {
		newElement = diffElement(oldElement, tag, props, newChildren, newVersion, oldChildren, oldVersion, cacheContainer);
	}

	return newElement;
}

function diffCachedElement(oldElement, tag, props, newChildren, newVersion, cacheContainer) {
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
	if (newVersion !== elementCache.version) {
		diffAttributes(elementCache.element, props);
		diffChildren(elementCache.element, newChildren, elementCache.vdom.children, cacheContainer);

		elementCache.version = newVersion;
		elementCache.vdom.props = props;
		elementCache.vdom.children = newChildren;

		gotUpdated = true;
	}

	if (gotCreated) {
		triggerLifecycle(elementCache.element, props, 'created');
	} else if (gotUpdated) {
		triggerLifecycle(elementCache.element, props, 'updated');
	}

	// elements are updated in place, so only insert cached element if it's not already there
	if (oldElement !== elementCache.element) {
		oldElement.parentElement.replaceChild(elementCache.element, oldElement);
		triggerLifecycle(elementCache.element, props, 'mounted');
	}

	return elementCache.element;
}

function diffElement(element, tag, props, newChildren, newVersion, oldChildren, oldVersion, cacheContainer) {
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

	diffAttributes(element, props);

	// text nodes have no real child-nodes, but have a string value as first child
	if (tag !== TEXT_NODE) {
		diffChildren(element, newChildren, oldChildren, cacheContainer);
	}

	if (newVersion === 0) {
		triggerLifecycle(element, props, 'created');
	}

	if (newVersion > 0) {
		triggerLifecycle(element, props, 'updated');
	}

	return element;
}

// this removes nodes at the end of the children, that are not needed anymore in the current state for recycling
function removeNotNeededNodes(parentElements, newChildren, oldChildren) {
	for (var remaining = parentElements.childNodes.length; remaining > newChildren.length; remaining--) {
		var childToRemove = parentElements.childNodes[remaining - 1];
		parentElements.removeChild(childToRemove);

		if (oldChildren.length < remaining) {
			console.log("ZLIQ: Something other then ZLIQ has manipulated the children of the element", parentElements, ". This can lead to sideffects. Please check your code.");
			continue;
		} else {
			var props = oldChildren[remaining - 1].props;


			triggerLifecycle(childToRemove, props, 'removed');
		}
	}
}

function updateExistingNodes(parentElement, newChildren, oldChildren, cacheContainer) {
	var nodes = parentElement.childNodes;
	for (var i = 0; i < nodes.length && i < newChildren.length; i++) {
		var oldElement = nodes[i];
		var _oldChildren$i = oldChildren[i],
		    oldVersion = _oldChildren$i.version,
		    oldChildChildren = _oldChildren$i.children;
		var _newChildren$i = newChildren[i],
		    tag = _newChildren$i.tag,
		    props = _newChildren$i.props,
		    children = _newChildren$i.children,
		    version = _newChildren$i.version;


		diff(oldElement, tag, props, children, version, oldChildChildren, oldVersion, cacheContainer);
	}
}

function addNewNodes(parentElement, newChildren, cacheContainer) {
	for (var i = parentElement.childNodes.length; i < newChildren.length; i++) {
		var _newChildren$i2 = newChildren[i],
		    tag = _newChildren$i2.tag,
		    props = _newChildren$i2.props,
		    children = _newChildren$i2.children,
		    version = _newChildren$i2.version;

		var newElement = createNode(tag, children);

		parentElement.appendChild(newElement);

		diff(newElement, tag, props, children, version, [], -1, cacheContainer);

		if (props && props.cycle && props.cycle.mounted) {
			console.error('The \'mounted\' lifecycle event is only called on elements with id. As elements are updated in place, it is hard to define when a normal element is mounted.');
		}
	}
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
		element.className = value || '';
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

function diffChildren(element, newChildren, oldChildren, cacheContainer) {
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

// to not mutate the representation of our children from the last iteration we clone them
// we copy the cycle functions for each element, as JSON parse/stringify does not work for functions
function copyChildren(oldChildren) {
	if (oldChildren === undefined) return [];

	var newChildren = JSON.parse(JSON.stringify(oldChildren));
	newChildren.forEach(function (child, index) {
		var oldChild = oldChildren[index];
		if (oldChild.props && oldChild.props.cycle) {
			child.cycle = oldChild.props.cycle;
		}

		if (_typeof(oldChildren[index]) === 'object') {
			child.children = copyChildren(oldChild.children);
		}
	});
	return newChildren;
}

// shorthand to call a cycle event for an element if existing
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

// we want to recycle elements to save time on creating and inserting nodes into the dom
// we don't want to manipulate elements that go into the cache, because they would mutate in the cache as well
function shouldRecycleElement(oldElement, props, tag) {
	return !isTextNode(oldElement) && oldElement.id === "" && !nodeTypeDiffers(oldElement, tag);
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.testRender = testRender;
exports.test$ = test$;

var _src = __webpack_require__(2);

function testRender(vdom$, schedule, done) {
    var container = document.createElement('div');
    return test$((0, _src.render)(vdom$, container, 0), schedule, done);
}

function test$(stream, schedule, done) {
    return stream.reduce(function (iteration, value) {
        if (schedule[iteration] === undefined) {
            throw new Error('Unexpected Update!');
        }

        testSchedule(schedule, iteration, value, done);

        if (schedule.length === iteration + 1 && done) {
            done();
        }

        return iteration + 1;
    }, 0);
}

function testSchedule(schedule, iteration, value, done) {
    // tests produce async behaviour often syncronous
    // this can cause race effects on stream declarations
    // here the iterations are made asynchronous to prevent this
    setTimeout(function () {
        try {
            schedule[iteration](value);
        } catch (error) {
            done.fail(error);
        }
    });
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
/* 13 */
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
function if$(boolean$, onTrue, onFalse) {
	if (boolean$ === undefined || typeof boolean$ === 'boolean') {
		return (0, _.stream)(boolean$ ? onTrue || null : onFalse || null);
	}
	return boolean$.map(function (x) {
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
/* 14 */
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
	// if it is a function it is treated as a componen and will resolve it
	// props are not automatically resolved
	if (typeof tag === 'function') {
		return tag(props || {}, mergedChildren$);
	}
	return (0, _streamy.merge$)([wrapProps$(props), mergedChildren$.map(flatten)]).map(function (_ref) {
		var _ref2 = _slicedToArray(_ref, 2),
		    props = _ref2[0],
		    children = _ref2[1];

		return {
			tag: tag,
			props: props,
			children: children,
			version: ++version
		};
	});
};

// input has format [stream]
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
		return child;
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
		// if there is no stream it is a string or number
		if (!(0, _streamy.isStream)(component)) {
			return (0, _streamy.stream)(component);
		}
		return component;
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