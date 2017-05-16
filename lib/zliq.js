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
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fetchy = __webpack_require__(6);

Object.keys(_fetchy).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _fetchy[key];
    }
  });
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

var _streamyHyperscript = __webpack_require__(8);

Object.keys(_streamyHyperscript).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _streamyHyperscript[key];
    }
  });
});

var _router = __webpack_require__(7);

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

var _deepEqual = __webpack_require__(3);

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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.UPDATED = exports.REMOVED = exports.ADDED = exports.CHILDREN_CHANGED = exports.UPDATE_DONE = undefined;
exports.createElement = createElement;

var _streamy = __webpack_require__(1);

// deprecated
var UPDATE_DONE = exports.UPDATE_DONE = 'CHILDREN_CHANGED';
var CHILDREN_CHANGED = exports.CHILDREN_CHANGED = 'CHILDREN_CHANGED';
var ADDED = exports.ADDED = 'ADDED';
var REMOVED = exports.REMOVED = 'REMOVED';
var UPDATED = exports.UPDATED = 'UPDATED';

// js DOM events. add which ones you need
var DOM_EVENT_LISTENERS = ['onchange', 'onclick', 'onmouseover', 'onmouseout', 'onkeydown', 'onload', 'ondblclick'];

var BATCH_CHILD_CHANGE_TRESHOLD = 5;

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
				// TODO notify dev about value not being a function
				if (typeof value === 'function') {
					elem.removeEventListener(eventName, value);
					elem.addEventListener(eventName, value);
				}
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

			var elementsBefore = getElementsBefore(children$Arr, index);
			// apply the changes
			Promise.all(changes.map(function (_ref) {
				var subIndexes = _ref.indexes,
				    type = _ref.type,
				    num = _ref.num,
				    elems = _ref.elems;

				return updateDOMforChild(elems, elementsBefore, subIndexes, type, num, parentElem);
			}))
			// after changes are done notify listeners
			.then(function () {
				notify(parentElem, UPDATE_DONE);
			});

			return childArr;
		}, []);
	});
}

// when we insert into the DOM we need to know where
// as children can be arrays we need to know how many children are before the one we want to put into the DOM
function getElementsBefore(children$Arr, index) {
	return children$Arr.slice(0, index).reduce(function (sum, cur$) {
		return sum += cur$().length;
	}, 0);
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

	return changes.reverse();
}

// list of operations
// remove all the elements starting from a certain index
function removeElements(index, subIndexes, countOfElementsToRemove, parentElem, resolve) {
	for (var times = 0; times < countOfElementsToRemove; times++) {
		var node = parentElem.childNodes[index];
		if (node != null) {
			parentElem.removeChild(node);
		}
		notify(node, REMOVED);
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
		notify(child, ADDED);
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
		if (nodeChildren && nodeChildren.length > BATCH_CHILD_CHANGE_TRESHOLD) {
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
function notify(element, event_name) {
	var event = new CustomEvent(event_name, {
		bubbles: false
	});
	element.dispatchEvent(event);
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var pSlice = Array.prototype.slice;
var objectKeys = __webpack_require__(5);
var isArguments = __webpack_require__(4);

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
/* 4 */
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
/* 5 */
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.fetchy = undefined;

var _ = __webpack_require__(0);

/*
* middleware to log the user out if not authorized
* returns a middleware that sets the token stream value to null if the request is not authenticated
*/
function isAuthenticated(auth$) {
	return function (res) {
		if (res.status === 401) {
			auth$ && auth$(null);
		}
		return res;
	};
}

/*
* TODO
* wrapper for LOADING -> SUCCESS / FAILED actions
* also adds oauth header for a provided oauth-token stream
*/
var fetchy = exports.fetchy = function fetchy(request, extractData, auth$) {
	extractData = extractData || function (a) {
		return a;
	};
	var output$ = (0, _.stream)({
		loading: true,
		error: null,
		data: null
	});

	var options = {
		method: request.method || 'GET',
		headers: Object.assign(auth$ && auth$() ? {
			'Authentication': auth$()
		} : {}, request.headers),
		mode: 'cors',
		cache: request.cache || 'default'
	};

	fetch(request.url, options).then(isAuthenticated(auth$)).then(function (res) {
		return res.json();
	}).then(function (body) {
		output$.patch({
			loading: false,
			data: extractData(body)
		});
	}).catch(function (error) {
		output$.patch({
			loading: false,
			error: error
		});
	});

	return output$;
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Router = Router;
exports.initRouter = initRouter;

var _ = __webpack_require__(0);

function interceptLinks(routerState$) {
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

                var anchorSearch = RegExp(/[\/\w]+(\?\w+=\w*(&\w+=\w*))?#(\w+)/g).exec(href);
                if (anchorSearch != null && anchorSearch[3] != null) {
                    setTimeout(function () {
                        var anchorElem = document.getElementById(anchorSearch[3]);
                        anchorElem && anchorElem.scrollIntoView();
                    }, 1);
                }

                //tell the browser not to respond to the link click
                e.preventDefault();
            }
        }
    }

    // callback for HTML5 navigation events
    // save the routing info in the routerState
    function dispatchRouteChange() {
        // remove hash
        var href = location.hash.substr(1, location.hash.length - 1);

        routerState$.patch({
            route: href === '' ? '/' : href.split('?')[0],
            params: getUrlParams(href)
        });
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
    var urlRegex = /\/\w*(\?\w+=.+(&\w+=.+)*)/g;
    if (!urlRegex.test(href)) {
        return {};
    }
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
function Router(_ref, children) {
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
    router$.patch({ routes: router$().routes.concat(route) });

    // check if no registered route was hit and set default if so
    var sanitizedRoute$ = router$.map(function (_ref2) {
        var route = _ref2.route,
            routes = _ref2.routes;

        if (routes.indexOf(route) === -1) {
            return '/';
        }
        return route;
    });

    var routeWasHit$ = sanitizedRoute$.map(function (curRoute) {
        return curRoute === route;
    });
    return routeWasHit$.map(function (hitRoute) {
        return hitRoute ? children : [];
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

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.h = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _streamy = __webpack_require__(1);

var _streamyDom = __webpack_require__(2);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/*
* wrap hyperscript elements in reactive streams dependent on their children streams
*/
var h = exports.h = function h(tag, props) {
	for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
		children[_key - 2] = arguments[_key];
	}

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
* output: stream([stream([])])
*/
function makeChildrenStreams$(childrenArr) {
	var _ref;

	// flatten children arr
	// needed to make react style hyperscript (children as arguments) working parallel to preact style hyperscript (children as array)
	childrenArr = (_ref = []).concat.apply(_ref, _toConsumableArray(childrenArr));
	// wrap all children in streams
	var children$Arr = makeStreams(childrenArr);

	return children$Arr
	// make sure children are arrays and not nest
	.map(function (child$) {
		return flatten(makeArray(child$));
	})
	// make sure subchildren are all streams
	.map(function (child$) {
		return child$.map(function (children) {
			return makeStreams(children);
		});
	})
	// so we can easily merge them
	.map(function (child$) {
		return child$.flatMap(function (children) {
			return _streamy.merge$.apply(undefined, _toConsumableArray(children));
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
function flatten(stream) {
	return stream.map(function (arr) {
		while (arr.some(function (value) {
			return Array.isArray(value);
		})) {
			var _ref2;

			arr = (_ref2 = []).concat.apply(_ref2, _toConsumableArray(arr));
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
		return props.reduce(function (obj, _ref3) {
			var key = _ref3.key,
			    value = _ref3.value;

			obj[key] = value;
			return obj;
		}, {});
	});
}

/***/ }),
/* 9 */
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

/***/ })
/******/ ]);
});