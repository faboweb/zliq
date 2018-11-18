(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["zliq"] = factory();
	else
		root["zliq"] = factory();
})(window, function() {
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/deep-equal/index.js":
/*!******************************************!*\
  !*** ./node_modules/deep-equal/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pSlice = Array.prototype.slice;

var objectKeys = __webpack_require__(/*! ./lib/keys.js */ "./node_modules/deep-equal/lib/keys.js");

var isArguments = __webpack_require__(/*! ./lib/is_arguments.js */ "./node_modules/deep-equal/lib/is_arguments.js");

var deepEqual = module.exports = function (actual, expected, opts) {
  if (!opts) opts = {}; // 7.1. All identical values are equivalent, as determined by ===.

  if (actual === expected) {
    return true;
  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime(); // 7.3. Other pairs that do not both pass typeof value == 'object',
    // equivalence is determined by ==.
  } else if (!actual || !expected || typeof actual != 'object' && typeof expected != 'object') {
    return opts.strict ? actual === expected : actual == expected; // 7.4. For all other Object pairs, including Array objects, equivalence is
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
  if (!x || typeof x !== 'object' || typeof x.length !== 'number') return false;

  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
    return false;
  }

  if (x.length > 0 && typeof x[0] !== 'number') return false;
  return true;
}

function objEquiv(a, b, opts) {
  var i, key;
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b)) return false; // an identical 'prototype' property.

  if (a.prototype !== b.prototype) return false; //~~~I've managed to break Object.keys through screwy arguments passing.
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
  } // having the same number of owned properties (keys incorporates
  // hasOwnProperty)


  if (ka.length != kb.length) return false; //the same set of keys (although not necessarily the same order),

  ka.sort();
  kb.sort(); //~~~cheap key test

  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i]) return false;
  } //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test


  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!deepEqual(a[key], b[key], opts)) return false;
  }

  return typeof a === typeof b;
}

/***/ }),

/***/ "./node_modules/deep-equal/lib/is_arguments.js":
/*!*****************************************************!*\
  !*** ./node_modules/deep-equal/lib/is_arguments.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var supportsArgumentsClass = function () {
  return Object.prototype.toString.call(arguments);
}() == '[object Arguments]';

exports = module.exports = supportsArgumentsClass ? supported : unsupported;
exports.supported = supported;

function supported(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

;
exports.unsupported = unsupported;

function unsupported(object) {
  return object && typeof object == 'object' && typeof object.length == 'number' && Object.prototype.hasOwnProperty.call(object, 'callee') && !Object.prototype.propertyIsEnumerable.call(object, 'callee') || false;
}

;

/***/ }),

/***/ "./node_modules/deep-equal/lib/keys.js":
/*!*********************************************!*\
  !*** ./node_modules/deep-equal/lib/keys.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

exports = module.exports = typeof Object.keys === 'function' ? Object.keys : shim;
exports.shim = shim;

function shim(obj) {
  var keys = [];

  for (var key in obj) keys.push(key);

  return keys;
}

/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
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
  } // if setTimeout wasn't available but was latter defined


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
  } // if clearTimeout wasn't available but was latter defined


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
}; // v8 likes predictible objects


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

/***/ "./node_modules/setimmediate/setImmediate.js":
/*!***************************************************!*\
  !*** ./node_modules/setimmediate/setImmediate.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
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
    } // Copy function arguments


    var args = new Array(arguments.length - 1);

    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i + 1];
    } // Store and register the task


    var task = {
      callback: callback,
      args: args
    };
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
    registerImmediate = function (handle) {
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

    var onGlobalMessage = function (event) {
      if (event.source === global && typeof event.data === "string" && event.data.indexOf(messagePrefix) === 0) {
        runIfPresent(+event.data.slice(messagePrefix.length));
      }
    };

    if (global.addEventListener) {
      global.addEventListener("message", onGlobalMessage, false);
    } else {
      global.attachEvent("onmessage", onGlobalMessage);
    }

    registerImmediate = function (handle) {
      global.postMessage(messagePrefix + handle, "*");
    };
  }

  function installMessageChannelImplementation() {
    var channel = new MessageChannel();

    channel.port1.onmessage = function (event) {
      var handle = event.data;
      runIfPresent(handle);
    };

    registerImmediate = function (handle) {
      channel.port2.postMessage(handle);
    };
  }

  function installReadyStateChangeImplementation() {
    var html = doc.documentElement;

    registerImmediate = function (handle) {
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
    registerImmediate = function (handle) {
      setTimeout(runIfPresent, 0, handle);
    };
  } // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.


  var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
  attachTo = attachTo && attachTo.setTimeout ? attachTo : global; // Don't get fooled by e.g. browserify environments.

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
})(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js"), __webpack_require__(/*! ./../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/timers-browserify/main.js":
/*!************************************************!*\
  !*** ./node_modules/timers-browserify/main.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var scope = typeof global !== "undefined" && global || typeof self !== "undefined" && self || window;
var apply = Function.prototype.apply; // DOM APIs, for completeness

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
}; // Does not start the time, just sets up the members needed.


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
}; // setimmediate attaches itself to the global object


__webpack_require__(/*! setimmediate */ "./node_modules/setimmediate/setImmediate.js"); // On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.


exports.setImmediate = typeof self !== "undefined" && self.setImmediate || typeof global !== "undefined" && global.setImmediate || this && this.setImmediate;
exports.clearImmediate = typeof self !== "undefined" && self.clearImmediate || typeof global !== "undefined" && global.clearImmediate || this && this.clearImmediate;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g; // This works in non-strict mode

g = function () {
  return this;
}();

try {
  // This works if eval is allowed (see CSP)
  g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
  // This works if the window reference is available
  if (typeof window === "object") g = window;
} // g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}


module.exports = g;

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: zx, testRender, test$, stream, merge$, isStream, render, Component, h, resolveChildren, resolveChild, if$, join$, resolve$, flatten */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "zx", function() { return _utils__WEBPACK_IMPORTED_MODULE_0__["zx"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "stream", function() { return _utils__WEBPACK_IMPORTED_MODULE_0__["stream"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "merge$", function() { return _utils__WEBPACK_IMPORTED_MODULE_0__["merge$"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isStream", function() { return _utils__WEBPACK_IMPORTED_MODULE_0__["isStream"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _utils__WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Component", function() { return _utils__WEBPACK_IMPORTED_MODULE_0__["Component"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "h", function() { return _utils__WEBPACK_IMPORTED_MODULE_0__["h"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "resolveChildren", function() { return _utils__WEBPACK_IMPORTED_MODULE_0__["resolveChildren"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "resolveChild", function() { return _utils__WEBPACK_IMPORTED_MODULE_0__["resolveChild"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "if$", function() { return _utils__WEBPACK_IMPORTED_MODULE_0__["if$"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "join$", function() { return _utils__WEBPACK_IMPORTED_MODULE_0__["join$"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "resolve$", function() { return _utils__WEBPACK_IMPORTED_MODULE_0__["resolve$"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "flatten", function() { return _utils__WEBPACK_IMPORTED_MODULE_0__["flatten"]; });

/* harmony import */ var _test_helpers_test_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../test/helpers/test-component */ "./test/helpers/test-component.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "testRender", function() { return _test_helpers_test_component__WEBPACK_IMPORTED_MODULE_1__["testRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "test$", function() { return _test_helpers_test_component__WEBPACK_IMPORTED_MODULE_1__["test$"]; });




/***/ }),

/***/ "./src/utils/hyperx.js":
/*!*****************************!*\
  !*** ./src/utils/hyperx.js ***!
  \*****************************/
/*! exports provided: default, escape */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return hyperx; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "escape", function() { return escape; });
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.js */ "./src/utils/index.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// forked from https://github.com/choojs/hyperx

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
function hyperx(h, opts) {
  if (!opts) opts = {};

  var concat = opts.concat || function (a, b) {
    return String(a) + String(b);
  };

  if (opts.attrToProp !== false) {
    h = attributeToProperty(h);
  }

  return function (strings) {
    for (var _len = arguments.length, values = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      values[_key - 1] = arguments[_key];
    }

    return new _index_js__WEBPACK_IMPORTED_MODULE_0__["Component"](function (globals) {
      var component = handleTemplateLiteral(globals, strings, values);

      if (Array.isArray(component)) {
        return Object(_index_js__WEBPACK_IMPORTED_MODULE_0__["resolveChildren"])(component, globals);
      } // resolve nested components
      // TODO needed? why?


      var output = component;

      while (output instanceof _index_js__WEBPACK_IMPORTED_MODULE_0__["Component"]) {
        output = output.build(globals);
      }

      return output;
    });
  }; // return (strings, ...values) => handleTemplateLiteral(null, strings, values);

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
      } else if (tokenType === ATTR_EQ || tokenType === ATTR_BREAK) {// no-op
      } else {
        throw new Error("unhandled: " + tokenType);
      }
    } // TODO handle components


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
          state = OPEN; // <button_>HALLO</button_>,  ?? not <button x="y _> 2"></button ??, not // <button_></button_>
        } else if (curChar === ">" && !quot(state) && state !== COMMENT) {
          // <button_>HALLO</button_>
          if (state === OPEN && token.length) {
            res.push([OPEN, token]); // <button disabled_>HALLO</button>
          } else if (state === ATTR_KEY) {
            res.push([ATTR_KEY, token]);
          } // <button x="y _> 2">
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
        } else if (state === OPEN && curChar === "/" && token.length) {// no-op, self closing tag without a space <br/>
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
    if (typeof x === "function") return x;else if (typeof x === "string") return x;else if (x && _typeof(x) === "object") return x;else return concat("", x);
  }
}

function quot(state) {
  return state === ATTR_VALUE_SINGLEQUOTE || state === ATTR_VALUE_DOUBLEQUOTE;
}

var closeRE = RegExp("^(" + ["area", "base", "basefont", "bgsound", "br", "col", "command", "embed", "frame", "hr", "img", "input", "isindex", "keygen", "link", "meta", "param", "source", "track", "wbr", "!--", // SVG TAGS
"animate", "animateTransform", "circle", "cursor", "desc", "ellipse", "feBlend", "feColorMatrix", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "font-face-format", "font-face-name", "font-face-uri", "glyph", "glyphRef", "hkern", "image", "line", "missing-glyph", "mpath", "path", "polygon", "polyline", "rect", "set", "stop", "tref", "use", "view", "vkern"].join("|") + ")(?:[.#][a-zA-Z0-9\x7F-\uFFFF_:-]+)*$");

function selfClosing(tag) {
  return closeRE.test(tag);
} // convert DOM attribute names to the property name used in js elements


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
} // escape potentially malicious strings


var escape = function escape(arg) {
  if (typeof arg !== "string") return arg;
  return arg.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

/***/ }),

/***/ "./src/utils/index.js":
/*!****************************!*\
  !*** ./src/utils/index.js ***!
  \****************************/
/*! exports provided: zx, stream, merge$, isStream, render, Component, h, resolveChildren, resolveChild, if$, join$, resolve$, flatten */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "zx", function() { return zx; });
/* harmony import */ var _streamy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./streamy */ "./src/utils/streamy.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "stream", function() { return _streamy__WEBPACK_IMPORTED_MODULE_0__["stream"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "merge$", function() { return _streamy__WEBPACK_IMPORTED_MODULE_0__["merge$"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isStream", function() { return _streamy__WEBPACK_IMPORTED_MODULE_0__["isStream"]; });

/* harmony import */ var _render__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./render */ "./src/utils/render.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _render__WEBPACK_IMPORTED_MODULE_1__["render"]; });

/* harmony import */ var _streamy_vdom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./streamy-vdom */ "./src/utils/streamy-vdom.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Component", function() { return _streamy_vdom__WEBPACK_IMPORTED_MODULE_2__["Component"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "h", function() { return _streamy_vdom__WEBPACK_IMPORTED_MODULE_2__["h"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "resolveChildren", function() { return _streamy_vdom__WEBPACK_IMPORTED_MODULE_2__["resolveChildren"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "resolveChild", function() { return _streamy_vdom__WEBPACK_IMPORTED_MODULE_2__["resolveChild"]; });

/* harmony import */ var _streamy_helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./streamy-helpers */ "./src/utils/streamy-helpers.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "if$", function() { return _streamy_helpers__WEBPACK_IMPORTED_MODULE_3__["if$"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "join$", function() { return _streamy_helpers__WEBPACK_IMPORTED_MODULE_3__["join$"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "resolve$", function() { return _streamy_helpers__WEBPACK_IMPORTED_MODULE_3__["resolve$"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "flatten", function() { return _streamy_helpers__WEBPACK_IMPORTED_MODULE_3__["flatten"]; });

/* harmony import */ var _hyperx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./hyperx */ "./src/utils/hyperx.js");






var zx = Object(_hyperx__WEBPACK_IMPORTED_MODULE_4__["default"])(_streamy_vdom__WEBPACK_IMPORTED_MODULE_2__["h"]);

/***/ }),

/***/ "./src/utils/render.js":
/*!*****************************!*\
  !*** ./src/utils/render.js ***!
  \*****************************/
/*! exports provided: render */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony import */ var _streamy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./streamy */ "./src/utils/streamy.js");
/* harmony import */ var _streamy_vdom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./streamy-vdom */ "./src/utils/streamy-vdom.js");
/* harmony import */ var _vdom_diff__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./vdom-diff */ "./src/utils/vdom-diff.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }




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

function renderUpdate(parentElement, // current known state
_ref, // new vdom tree
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
    var newElement = Object(_vdom_diff__WEBPACK_IMPORTED_MODULE_2__["diff"])(parentElement, oldElement, {
      tag: tag,
      props: props,
      children: children,
      version: version
    }, {
      children: oldChildren,
      version: oldVersion
    }, keyContainer); // signalise mount of root element on initial render

    if (parentElement && version === 0) {
      Object(_vdom_diff__WEBPACK_IMPORTED_MODULE_2__["triggerLifecycle"])(oldElement, props, "mounted");
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
} // we allow inputs to the render function to be:
// a vdom-stream
// a stream of Component
// a Component
// this function resolves the input to a vdom-stream


function resolveInputToStream(input, globals) {
  var vdom$;

  if (Object(_streamy__WEBPACK_IMPORTED_MODULE_0__["isStream"])(input)) {
    // resolve downstream components
    vdom$ = input.flatMap(function (input) {
      var resolved = Object(_streamy_vdom__WEBPACK_IMPORTED_MODULE_1__["resolveChild"])(input, globals); // resolvedChild can return an array of elements but we expect only one
      // TODO make this better

      if (Array.isArray(resolved)) {
        resolved = resolved[0];
      } // because we are flatMapping we need to return streams


      if (!Object(_streamy__WEBPACK_IMPORTED_MODULE_0__["isStream"])(resolved)) {
        return Object(_streamy__WEBPACK_IMPORTED_MODULE_0__["stream"])(resolved);
      }

      return resolved;
    }) // a resolved input could return an array but we expect the vdom$
    // to return just one root vdom elem
    .map(function (x) {
      if (Array.isArray(x)) {
        x = x[0];
      }

      return x;
    });
    return vdom$;
  }

  if (input instanceof _streamy_vdom__WEBPACK_IMPORTED_MODULE_1__["Component"]) {
    vdom$ = input.build(globals);
    vdom$ = resolveInputToStream(vdom$, globals);
    return vdom$;
  } else if (typeof input === "function") {
    // simple element constructor
    vdom$ = input({}, [], globals);
  } // reiterate if still not a vdom-stream


  if (!Object(_streamy__WEBPACK_IMPORTED_MODULE_0__["isStream"])(vdom$)) vdom$ = resolveInputToStream(vdom$, globals);
  return vdom$;
} // to not mutate the representation of our children from the last iteration we clone them
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

/***/ "./src/utils/streamy-helpers.js":
/*!**************************************!*\
  !*** ./src/utils/streamy-helpers.js ***!
  \**************************************/
/*! exports provided: if$, join$, resolve$, flatten */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "if$", function() { return if$; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "join$", function() { return join$; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resolve$", function() { return resolve$; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "flatten", function() { return flatten; });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ */ "./src/utils/index.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

 // provide easy switched on boolean streams
// example use case: <button onclick={()=>open$(!open$())}>{if$(open$, 'Close', 'Open')}</button>

function if$(boolean$) {
  var onTrue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var onFalse = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  if (boolean$ === undefined || !Object(___WEBPACK_IMPORTED_MODULE_0__["isStream"])(boolean$)) {
    return Object(___WEBPACK_IMPORTED_MODULE_0__["stream"])(boolean$ ? onTrue : onFalse);
  }

  return boolean$.map(function (x) {
    return x ? onTrue : onFalse;
  });
} // join a mixed array of strings and streams of strings
// example use case: <div class={join$('container', if$(open$, 'open', 'closed'))} />

function join$() {
  for (var _len = arguments.length, $arr = new Array(_len), _key = 0; _key < _len; _key++) {
    $arr[_key] = arguments[_key];
  }

  return Object(___WEBPACK_IMPORTED_MODULE_0__["merge$"])($arr).map(function (arr) {
    return arr.join(" ");
  });
}
/*
* Resolve all nested streams in an object
* input: {a:{}, b:stream:{}}
* output: stream({a:{}, b:{}})
*/

function resolve$(obj) {
  if (obj === null) return Object(___WEBPACK_IMPORTED_MODULE_0__["stream"])({});
  var nestedStreams = extractNestedStreams(obj);
  var updateStreams = nestedStreams.map(function makeNestedStreamUpdateObject(_ref) {
    var parent = _ref.parent,
        key = _ref.key,
        stream = _ref.stream;
    return stream.distinct() // here we produce a sideeffect on the object -> low GC
    // to trigger the merge we also need to return sth (as undefined does not trigger listeners)
    .map(function (value) {
      parent[key] = value;
      return value;
    });
  });
  return Object(___WEBPACK_IMPORTED_MODULE_0__["merge$"])(updateStreams).map(function (_) {
    return obj;
  });
} // to react to nested streams in an object, we extract the streams and a reference to their position
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

    if (Object(___WEBPACK_IMPORTED_MODULE_0__["isStream"])(obj[key])) {
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
} // flattens an array


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

/***/ "./src/utils/streamy-vdom.js":
/*!***********************************!*\
  !*** ./src/utils/streamy-vdom.js ***!
  \***********************************/
/*! exports provided: Component, h, resolveChildren, resolveChild */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Component", function() { return Component; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return h; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resolveChildren", function() { return resolveChildren; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resolveChild", function() { return resolveChild; });
/* harmony import */ var _streamy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./streamy */ "./src/utils/streamy.js");
/* harmony import */ var _streamy_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./streamy-helpers */ "./src/utils/streamy-helpers.js");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var Component = function Component(constructorFn) {
  _classCallCheck(this, Component);

  this.build = constructorFn;
};
/*
* wrap vdom elements in reactive streams dependent on their children streams
* the vdom constructor function returns another constructor so we can pass down globals from the renderer to the components
*/

var h = function h(tag, props) {
  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  props = props ? props : {};
  return new Component(function (globals) {
    var version = -1;
    var constructedChildren = resolveChildren(children, globals);
    var mergedChildren$ = mergeChildren$(constructedChildren); // jsx usually resolves known tags as strings and unknown tags as functions
    // if it is a function it is treated as a component and will resolve it
    // props are not automatically resolved

    if (typeof tag === "function") {
      // TODO refactor component resolution
      var output = tag(props, mergedChildren$, globals);

      if (Array.isArray(output)) {
        return resolveChildren(output, globals);
      }

      if (output instanceof Component || Object(_streamy__WEBPACK_IMPORTED_MODULE_0__["isStream"])(output)) {
        return resolveChild(output, globals);
      } // allow simple component that receives resolved streams


      return Object(_streamy__WEBPACK_IMPORTED_MODULE_0__["merge$"])([Object(_streamy_helpers__WEBPACK_IMPORTED_MODULE_1__["resolve$"])(props), mergedChildren$.map(_streamy_helpers__WEBPACK_IMPORTED_MODULE_1__["flatten"])]).map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            props = _ref2[0],
            children = _ref2[1];

        return output(props, children, globals);
      }).map(function (children) {
        return resolveChildren(children, globals);
      });
    }

    return Object(_streamy__WEBPACK_IMPORTED_MODULE_0__["merge$"])([Object(_streamy_helpers__WEBPACK_IMPORTED_MODULE_1__["resolve$"])(props), mergedChildren$.map(_streamy_helpers__WEBPACK_IMPORTED_MODULE_1__["flatten"])]).map(function (_ref3) {
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

  children = Object(_streamy_helpers__WEBPACK_IMPORTED_MODULE_1__["flatten"])(children).filter(function (_) {
    return _ !== null;
  });
  var childrenVdom$arr = children.map(function (child) {
    if (Object(_streamy__WEBPACK_IMPORTED_MODULE_0__["isStream"])(child)) {
      return child.flatMap(mergeChildren$);
    }

    return child;
  });
  return Object(_streamy__WEBPACK_IMPORTED_MODULE_0__["merge$"])(childrenVdom$arr);
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
  return Object(_streamy_helpers__WEBPACK_IMPORTED_MODULE_1__["flatten"])(resolvedChilden);
}
/*
* resolve the element constructor, also for elements nested in streams
* returns the format string|number|vdom|stream<string|number|vdom>
*/

function resolveChild(child, globals) {
  if (child instanceof Component) {
    return resolveChildren(child.build(globals), globals);
  }

  if (Object(_streamy__WEBPACK_IMPORTED_MODULE_0__["isStream"])(child)) {
    return child.map(function (x) {
      return resolveChildren(x, globals);
    });
  }

  return child;
}

/***/ }),

/***/ "./src/utils/streamy.js":
/*!******************************!*\
  !*** ./src/utils/streamy.js ***!
  \******************************/
/*! exports provided: stream, merge$, isStream */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(setImmediate) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stream", function() { return stream; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "merge$", function() { return merge$; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isStream", function() { return isStream; });
/* harmony import */ var deep_equal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! deep-equal */ "./node_modules/deep-equal/index.js");
/* harmony import */ var deep_equal__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(deep_equal__WEBPACK_IMPORTED_MODULE_0__);
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }


/*
* stream constructor
* constructor returns a stream
* get the current value of stream like: stream.value
*/

var stream = function stream(init_value) {
  var s = function s(value) {
    update(s, value);
    return s;
  };

  s.IS_STREAM = true;
  s.value = init_value;
  s.listeners = []; // better debugging output for streams

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
  return !deep_equal__WEBPACK_IMPORTED_MODULE_0___default()(oldValue, newValue);
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
  var result$;

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
} // TODO: maybe refactor with filter

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
    if (partialChange === null || _typeof(partialChange) !== "object" || _typeof(parent$.value) !== "object") {
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
  var curTimer;

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
    setImmediate(
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.t0 = newStream;
              _context.next = 3;
              return executeScheduleItem(schedule, iteration++, value);

            case 3:
              _context.t1 = _context.sent;
              (0, _context.t0)(_context.t1);
              if (iteration === schedule.length) onDone();

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    })));
  });
  return newStream;
}
/*
*  allow to use a stream in an async await cycle
* i.e: const value = await myStream.next()
*/


function next(parent$) {
  var resolve;
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
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/timers-browserify/main.js */ "./node_modules/timers-browserify/main.js").setImmediate))

/***/ }),

/***/ "./src/utils/vdom-diff.js":
/*!********************************!*\
  !*** ./src/utils/vdom-diff.js ***!
  \********************************/
/*! exports provided: TEXT_NODE, diff, createNode, triggerLifecycle */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TEXT_NODE", function() { return TEXT_NODE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "diff", function() { return diff; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createNode", function() { return createNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "triggerLifecycle", function() { return triggerLifecycle; });
/* harmony import */ var _streamy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./streamy */ "./src/utils/streamy.js");

var TEXT_NODE = "#text";
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
  var gotUpdated = false; // if there is no cache, create one

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

  var elementCache = cacheContainer[id]; // ignore update if version equals cache

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
  } // elements are updated in place, so only insert cached element if it's not already there


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
  var initialRender = oldVersion === -1 || oldVersion === undefined; // text nodes behave differently then normal dom elements

  if (isTextNode(element) && tag === TEXT_NODE) {
    updateTextNode(element, newChildren[0]);
    return element;
  } // if the node types do not differ, we reuse the old node
  // we reuse the existing node to save time rerendering it
  // we do not reuse/mutate cached (id) elements as this will mutate the cache


  if (shouldRecycleElement(element, props, tag) === false) {
    var newElement = createNode(tag, newChildren);
    element.parentElement.replaceChild(newElement, element);
    element = newElement; // there are no children anymore on the newly created node

    oldChildren = [];
  }

  diffAttributes(element, props, oldProps); // sometimes you might want to skip updates to children on renderer elements i.e. if externals handle this component

  var isolated = props && props.isolated !== undefined; // text nodes we don't want to handle children like with other elements
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
} // this removes nodes at the end of the children, that are not needed anymore in the current state for recycling


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
      triggerLifecycle(childToRemove, {
        cycle: cycle
      }, "removed");
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
    element.style.cssText = cssText; // other propertys are just added as is to the DOM
  } else {
    if (element[attribute] !== undefined) {
      if (value === null) {
        element[attribute] = undefined;
      } else {
        element[attribute] = value;
      }
    } // also remove attributes on null to allow better handling of streams
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
  var cacheContainer = arguments.length > 3 ? arguments[3] : undefined;

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
    if (!Object(_streamy__WEBPACK_IMPORTED_MODULE_0__["isStream"])(child) && child.tag === undefined) {
      return {
        tag: TEXT_NODE,
        children: [child],
        version: 0
      };
    } else {
      return child;
    }
  });
} // create text_nodes from numbers or strings
// create domNodes from regular vdom descriptions


function createNode(tag, children) {
  if (tag === TEXT_NODE) {
    return document.createTextNode(children[0]);
  } else {
    return document.createElement(tag);
  }
} // TODO use React like effects for lifecycle events
// shorthand to call a cycle event for an element if existing

function triggerLifecycle(element) {
  var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      cycle = _ref5.cycle;

  var event = arguments.length > 2 ? arguments[2] : undefined;

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
} // we want to recycle elements to save time on creating and inserting nodes into the dom
// we don't want to manipulate elements that go into the cache, because they would mutate in the cache as well


function shouldRecycleElement(oldElement, props, tag) {
  return !isTextNode(oldElement) && oldElement.id === "" && !nodeTypeDiffers(oldElement, tag);
}

/***/ }),

/***/ "./test/helpers/test-component.js":
/*!****************************************!*\
  !*** ./test/helpers/test-component.js ***!
  \****************************************/
/*! exports provided: testRender, test$ */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "testRender", function() { return testRender; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "test$", function() { return test$; });
/* harmony import */ var _src__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src */ "./src/index.js");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }


function testRender(vdom$, schedule, done) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
    attach: false,
    debounce: 0,
    globals: {}
  };
  var container = document.createElement("div");

  if (options.attach) {
    document.body.appendChild(container);
  } // enable to just define the expected html in the render schedule


  schedule = schedule.map(function (expected) {
    if (typeof expected === "string") {
      return function (_ref) {
        var element = _ref.element;
        return (// we trim line breaks to make outerHTML more like the visible DOM
          expect(trimWhitespaces(element.outerHTML)).toBe(trimWhitespaces(expected))
        );
      };
    }

    return expected;
  });
  return test$(Object(_src__WEBPACK_IMPORTED_MODULE_0__["render"])(vdom$, container, options.globals, options.debounce), schedule, done);
} // trims whitespaces between tags and strings

function trimWhitespaces(html) {
  var trimmed = html.replace(/\>(\s*)(.*)(\s*)\</g, ">$2<");
  return trimmed;
}

function test$(stream, schedule, done) {
  return stream.schedule(schedule.map(function (iteration) {
    return (
      /*#__PURE__*/
      function () {
        var _ref2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee(value) {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return testIteration(iteration, value).catch(done.fail);

                case 2:
                  return _context.abrupt("return", value);

                case 3:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        return function (_x) {
          return _ref2.apply(this, arguments);
        };
      }()
    );
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

/***/ })

/******/ });
});
//# sourceMappingURL=zliq.js.map