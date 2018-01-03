module.exports =
/******/ (function(modules) { // webpackBootstrap
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
exports.stream = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
	s.log = function () {
		var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Stream:';
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
	var selectors = selector.split('.');

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
			return select(value, selectorsArr.split('.'));
		});
	}
	return parent$.map(function (value) {
		return selectorsArr.map(function (selectors) {
			return select(value, selectors.split('.'));
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
	if (partialChange === null || (typeof partialChange === 'undefined' ? 'undefined' : _typeof(partialChange)) !== 'object' || _typeof(parent$.value) !== 'object') {
		parent$(partialChange);
	} else {
		parent$(Object.assign({}, parent$.value, partialChange));
	}
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

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
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

var _streamyHyperscript = __webpack_require__(9);

Object.keys(_streamyHyperscript).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _streamyHyperscript[key];
    }
  });
});

var _streamyHelpers = __webpack_require__(8);

Object.keys(_streamyHelpers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _streamyHelpers[key];
    }
  });
});

/***/ }),
/* 2 */
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

var _streamy = __webpack_require__(0);

var TEXT_NODE = '#text';

function render(vdom, parentElement) {
	var globals = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	var debounce = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;

	var vdom$ = vdom(globals);
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
		var newElement = diff(oldElement, { tag: tag, props: props, children: children, version: version }, { children: oldChildren, version: oldVersion }, keyContainer);

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

function diff(oldElement, newChild, oldChild, cacheContainer) {
	var newElement = oldElement;
	var isCaching = newChild.props && newChild.props.id;
	// for keyed elements, we recall unchanged elements
	if (isCaching) {
		newElement = diffCachedElement(oldElement, newChild, oldChild, cacheContainer);
	} else {
		newElement = diffElement(oldElement, newChild, oldChild, cacheContainer);
	}

	return newElement;
}

function diffCachedElement(oldElement, _ref3, _ref4, cacheContainer) {
	var tag = _ref3.tag,
	    props = _ref3.props,
	    children = _ref3.children,
	    version = _ref3.version;
	var oldProps = _ref4.props;

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

function diffElement(element, _ref5, _ref6, cacheContainer) {
	var tag = _ref5.tag,
	    props = _ref5.props,
	    newChildren = _ref5.children,
	    newVersion = _ref5.version;
	var oldProps = _ref6.props,
	    oldChildren = _ref6.children,
	    oldVersion = _ref6.version;

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
		triggerLifecycle(element, props, 'created');
	}

	if (newVersion > 0) {
		triggerLifecycle(element, props, 'updated');
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


			triggerLifecycle(childToRemove, { cycle: cycle }, 'removed');
		}
	}
}

function updateExistingNodes(parentElement, newChildren, oldChildren, cacheContainer) {
	var nodes = parentElement.childNodes;
	for (var i = 0; i < nodes.length && i < newChildren.length; i++) {
		diff(nodes[i], newChildren[i], oldChildren[i], cacheContainer);
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

		diff(newElement, newChildren[i], {}, cacheContainer);

		if (props && props.cycle && props.cycle.mounted && !props.id) {
			console.error('The \'mounted\' lifecycle event is only called on elements with id. As elements are updated in place, it is hard to define when a normal element is mounted.');
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
	if (attribute === 'class' || attribute === 'className') {
		element.className = value || '';
		// we leave the possibility to define styles as strings
		// but we allow styles to be defined as an object
	} else if (attribute === 'style' && typeof value !== "string") {
		var cssText = value ? Object.keys(value).map(function (key) {
			return key + ':' + value[key] + ';';
		}).join(' ') : '';
		element.style.cssText = cssText;
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

function diffChildren(element, newChildren) {
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

// to not mutate the representation of our children from the last iteration we clone them
// we copy the cycle functions for each element, as JSON parse/stringify does not work for functions
function copyChildren(oldChildren) {
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
function triggerLifecycle(element) {
	var _ref7 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    cycle = _ref7.cycle;

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
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
        attach: false,
        debounce: 0,
        globals: {}
    };

    var container = document.createElement('div');
    if (options.attach) {
        document.body.appendChild(container);
    }
    // enable to just define the expected html in the render schedule
    schedule = schedule.map(function (fn) {
        if (typeof fn === 'string') {
            return function (_ref) {
                var element = _ref.element;
                return expect(element.outerHTML).toBe(fn);
            };
        }
        return fn;
    });
    return test$((0, _src.render)(vdom$, container, options.globals, options.debounce), schedule, done);
}

function test$(stream, schedule, done) {
    return stream.reduce(function (iteration, value) {
        if (schedule[iteration] === undefined) {
            done.fail('Unexpected Update!');
        }

        testIteration(schedule, iteration, value, done);

        return iteration + 1;
    }, 0);
}

function testIteration(schedule, iteration, value, done) {
    // tests produce async behaviour often syncronous
    // this can cause race effects on stream declarations
    // here the iterations are made asynchronous to prevent this
    setTimeout(function () {
        try {
            if (typeof schedule[iteration] === 'function') {
                schedule[iteration](value);
            } else {
                expect(value).toEqual(schedule[iteration]);
            }
        } catch (error) {
            done.fail(error);
        }

        if (schedule.length === iteration + 1 && done) {
            done();
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


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.promise$ = undefined;
exports.if$ = if$;
exports.join$ = join$;

var _ = __webpack_require__(1);

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
function if$(boolean$) {
	var onTrue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
	var onFalse = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

	if (boolean$ === undefined || !(0, _.isStream)(boolean$)) {
		return (0, _.stream)(boolean$ ? onTrue : onFalse);
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

	return (0, _.merge$)($arr).map(function (arr) {
		return arr.join(' ');
	});
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.h = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.flatten = flatten;

var _streamy = __webpack_require__(0);

var _streamyDom = __webpack_require__(3);

/*
* wrap hyperscript elements in reactive streams dependent on their children streams
* the hyperscript function returns a constructor so we can pass down globals from the renderer to the components
*/
var h = exports.h = function h(tag, props) {
	for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
		children[_key - 2] = arguments[_key];
	}

	var elementConstructor = function elementConstructor(globals) {
		var component = void 0;
		var version = -1;

		var constructedChildren = resolveChildren(children, globals);
		var mergedChildren$ = mergeChildren$(constructedChildren);
		// jsx usually resolves known tags as strings and unknown tags as functions
		// if it is a function it is treated as a componen and will resolve it
		// props are not automatically resolved
		if (typeof tag === 'function') {
			return tag(props || {}, mergedChildren$, globals)(globals);
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
	elementConstructor.IS_ELEMENT_CONSTRUCTOR = true;

	return elementConstructor;
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
* input: {{}}
* output: stream({})
*/
function wrapProps$(props) {
	if (props === null) return (0, _streamy.stream)({});

	var nestedStreams = extractNestedStreams(props);
	var updateStreams = nestedStreams.map(function makeNestedStreamUpdateProps(_ref3) {
		var parent = _ref3.parent,
		    key = _ref3.key,
		    stream = _ref3.stream;

		return stream.distinct()
		// here we produce a sideeffect on the props object -> low GC
		// to trigger the merge we also need to return sth (as undefined does not trigger listeners)
		.map(function (value) {
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
		// DEPRECATED I can't think of a usecase
		// if (typeof obj[key] === 'object') {
		// 	return extractNestedStreams(obj[key]);
		// }
		if (obj[key] === null || obj[key] === undefined) {
			return [];
		}
		if ((0, _streamy.isStream)(obj[key])) {
			return [{
				parent: obj,
				key: key,
				stream: obj[key]
			}];
		}
		if (_typeof(obj[key]) === 'object') {
			return extractNestedStreams(obj[key]);
		}
		return [];
	}));
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
	return flatten(resolvedChilden);
}

/*
* resolve the element constructor, also for elements nested in streams
* returns the format string|number|vdom|stream<string|number|vdom>
*/
function resolveChild(child, globals) {
	if (typeof child !== 'function') {
		return child;
	}
	if (child.IS_ELEMENT_CONSTRUCTOR) {
		return child(globals);
	}
	if ((0, _streamy.isStream)(child)) {
		return child.map(function (x) {
			return resolveChildren(x, globals);
		});
	}
}

/***/ })
/******/ ]);
//# sourceMappingURL=zliq.js.map