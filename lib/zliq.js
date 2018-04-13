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
/* WEBPACK VAR INJECTION */(function(setImmediate) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stream = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.merge$ = merge$;
exports.isStream = isStream;

var _deepEqual = __webpack_require__(6);

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
    return s.value;
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11).setImmediate))

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

var _streamyHyperscript = __webpack_require__(13);

Object.keys(_streamyHyperscript).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _streamyHyperscript[key];
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

var _testComponent = __webpack_require__(5);

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

var TEXT_NODE = "#text";

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
      triggerLifecycle(oldElement, props, "mounted");
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
  if (attribute === "class" || attribute === "className") {
    element.className = value || "";
    // we leave the possibility to define styles as strings
    // but we allow styles to be defined as an object
  } else if (attribute === "style" && typeof value !== "string") {
    var cssText = value ? Object.keys(value).map(function (key) {
      return key + ":" + value[key] + ";";
    }).join(" ") : "";
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

    if (_typeof(oldChildren[index]) === "object") {
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
exports.promise$ = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.if$ = if$;
exports.join$ = join$;
exports.resolve$ = resolve$;
exports.flatten = flatten;

var _2 = __webpack_require__(1);

// wrapper around promises to provide an indicator if the promise is running
var promise$ = exports.promise$ = function promise$(promise) {
  var output$ = (0, _2.stream)({
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var pSlice = Array.prototype.slice;
var objectKeys = __webpack_require__(8);
var isArguments = __webpack_require__(7);

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
/* 7 */
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
/* 8 */
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
/* 9 */
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
/* 10 */
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12), __webpack_require__(9)))

/***/ }),
/* 11 */
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
__webpack_require__(10);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;

/***/ }),
/* 12 */
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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.h = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _streamy = __webpack_require__(0);

var _streamyDom = __webpack_require__(3);

var _streamyHelpers = __webpack_require__(4);

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
    // if it is a function it is treated as a component and will resolve it
    // props are not automatically resolved
    if (typeof tag === "function") {
      var output = tag(props || {}, mergedChildren$, globals);

      if (output.IS_ELEMENT_CONSTRUCTOR || (0, _streamy.isStream)(output)) {
        return resolveChild(output, globals);
      }

      // allow simple component that receive resolved streams
      return (0, _streamy.merge$)([(0, _streamyHelpers.resolve$)(props), mergedChildren$.map(_streamyHelpers.flatten)]).map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            props = _ref2[0],
            children = _ref2[1];

        return output(props, children, globals);
      }).map(resolveChildren);
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
  if (typeof child !== "function") {
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
});
//# sourceMappingURL=zliq.js.map