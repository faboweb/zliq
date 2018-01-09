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
/******/ 	return __webpack_require__(__webpack_require__.s = 18);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });var _utils = __webpack_require__(6);Object.keys(_utils).forEach(function (key) {if (key === "default" || key === "__esModule") return;Object.defineProperty(exports, key, { enumerable: true, get: function get() {return _utils[key];} });});var _testComponent = __webpack_require__(22);
Object.keys(_testComponent).forEach(function (key) {if (key === "default" || key === "__esModule") return;Object.defineProperty(exports, key, { enumerable: true, get: function get() {return _testComponent[key];} });});

/***/ }),
/* 1 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.Subheader = undefined;var _src = __webpack_require__(0);

var Subheader = exports.Subheader = function Subheader(_ref) {var title = _ref.title,subtitle = _ref.subtitle,id = _ref.id;return (
        (0, _src.h)("div", { "class": "row center" }, [
            (0, _src.h)("div", { "class": "anchor", id: id }, []),
            (0, _src.h)("h3", { "class": "light header highlight" }, [title]),
            (0, _src.h)("p", { "class": "col s12 m8 offset-m2 caption" }, [subtitle])]));};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.stream = undefined;var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};exports.































































































































































































































































merge$ = merge$;exports.














isStream = isStream;var _deepEqual = __webpack_require__(29);var _deepEqual2 = _interopRequireDefault(_deepEqual);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };} /*
                                                                                                                                                                                                              * stream constructor
                                                                                                                                                                                                              * constructor returns a stream
                                                                                                                                                                                                              * get the current value of stream like: stream.value
                                                                                                                                                                                                              */var stream = exports.stream = function stream(init_value) {var s = function s(value) {if (value === undefined) {return s.value;}update(s, value);return s;};s.IS_STREAM = true;s.value = init_value;s.listeners = [];s.map = function (fn) {return map(s, fn);};s.is = function (value) {return map(s, function (cur) {return cur === value;});};s.flatMap = function (fn) {return flatMap(s, fn);};s.filter = function (fn) {return filter(s, fn);};s.deepSelect = function (fn) {return deepSelect(s, fn);};s.distinct = function (fn) {return distinct(s, fn);};s.$ = function (selectorArr) {return query(s, selectorArr);};s.until = function (stopEmit$) {return until(s, stopEmit$);};s.patch = function (partialChange) {return patch(s, partialChange);};s.reduce = function (fn, startValue) {return reduce(s, fn, startValue);};s.debounce = function (timer) {return debounce(s, timer);};s.log = function () {var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Stream:';return log(s, prefix);};return s;}; /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * wrapper for the diffing of stream values
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */function valuesChanged(oldValue, newValue) {return !(0, _deepEqual2.default)(oldValue, newValue);} /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * update the stream value and notify listeners on the stream
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */function update(parent$, newValue) {parent$.value = newValue;notifyListeners(parent$.listeners, newValue);} /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             * provide a new value to all listeners registered for a stream
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             */function notifyListeners(listeners, value) {listeners.forEach(function notifyListener(listener) {listener(value);});} /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * Do not pipe the value undefined. This allows to wait for an external initialization.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * It also saves you from checking for an initial null on every map function.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */function fork$(parent$, mapFunction) {var initValue = parent$.value !== undefined ? mapFunction(parent$.value) : undefined;return stream(initValue);} /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             * provides a new stream applying a transformation function to the value of a parent stream
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             */function map(parent$, fn) {var newStream = fork$(parent$, fn);parent$.listeners.push(function mapValue(value) {newStream(fn(value));});return newStream;} /* 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * helper function to debug, calls console.log on every value returnin the parent stream 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         */function log(parent$, prefix) {map(parent$, function (value) {return console.log(prefix, value);});return parent$;} /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * provides a new stream applying a transformation function to the value of a parent stream
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */function flatMap(parent$, fn) {var result$ = void 0;var listener = function updateOuterStream(result) {newStream(result);};function attachToResult$(mapFn, parentValue, listener) {var result$ = mapFn(parentValue);result$.listeners.push(listener);return result$;}var newStream = fork$(parent$, function getChildStreamValue(value) {result$ = attachToResult$(fn, value, listener);return result$.value;});parent$.listeners.push(function flatMapValue(value) {// clean up listeners or they will stack on child streams
		if (result$) {removeItem(result$.listeners, listener);}result$ = attachToResult$(fn, value, listener);newStream(result$.value);});return newStream;} /*
                                                                                                                                                       * provides a new stream that only serves the values that a filter function returns true for
                                                                                                                                                       * still a stream ALWAYS has a value -> so it starts at least with NULL
                                                                                                                                                       */function filter(parent$, fn) {var newStream = fork$(parent$, function (value) {return fn(value) ? value : undefined;});parent$.listeners.push(function filterValue(value) {if (fn(value)) {newStream(value);}});return newStream;} /*
                                                                                                                                                                                                                                                                                                                                                                                            * recursivly return the nested property of an object defined by an array of selectors
                                                                                                                                                                                                                                                                                                                                                                                            * parent: {foo: {bar:1}}, selectors: ['foo','bar'] returns 1
                                                                                                                                                                                                                                                                                                                                                                                            */function select(parent, selectors) {if (parent === null || parent === undefined) {return null;}if (selectors.length === 0) {return parent;}var selector = selectors[0];return select(parent[selector], selectors.splice(1, selectors.length - 1));} /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  * provides a new stream that has a selected sub property of the object value of the parent stream
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  * the selector has the format [{propertyName}.]*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  */function deepSelect(parent$, selector) {var selectors = selector.split('.');var newStream = fork$(parent$, function (value) {return select(value, selectors);});parent$.listeners.push(function deepSelectValue(newValue) {newStream(select(newValue, selectors));});return newStream;}function query(parent$, selectorsArr) {if (!Array.isArray(selectorsArr)) {return parent$.map(function (value) {return select(value, selectorsArr.split('.'));});}return parent$.map(function (value) {return selectorsArr.map(function (selectors) {return select(value, selectors.split('.'));});});} // TODO: maybe refactor with filter
/*
* provide a new stream that only notifys its children if the containing value actualy changes
*/function distinct(parent$) {var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (a, b) {return valuesChanged(a, b);};var newStream = fork$(parent$, function (value) {return value;});parent$.listeners.push(function deepSelectValue(value) {if (fn(newStream.value, value)) {newStream(value);}});return newStream;} /*
                                                                                                                                                                                                                                                                                                                                                           * update only the properties of an object passed
                                                                                                                                                                                                                                                                                                                                                           * i.e. {name: 'Fabian', lastname: 'Weber} patched with {name: 'Fabo'} produces {name: 'Fabo', lastname: 'Weber}
                                                                                                                                                                                                                                                                                                                                                           */function patch(parent$, partialChange) {if (partialChange === null || (typeof partialChange === 'undefined' ? 'undefined' : _typeof(partialChange)) !== 'object' || _typeof(parent$.value) !== 'object') {parent$(partialChange);} else {parent$(Object.assign({}, parent$.value, partialChange));}return parent$;}function until(parent$, stopEmitValues$) {var newStream = stream();var subscribeTo = function subscribeTo(stream, listener) {listener(parent$.value);stream.listeners.push(listener);};if (stopEmitValues$.value === undefined) {subscribeTo(parent$, newStream);}stopEmitValues$.map(function (stopEmitValues) {if (stopEmitValues) {removeItem(parent$.listeners, newStream);} else {subscribeTo(parent$, newStream);}});return newStream;} /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              * reduce a stream over time
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              * this will pass the last output value to the calculation function
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              * reads like the array reduce function
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              */function reduce(parent$, fn, startValue) {var aggregate = startValue;var newStream = stream();function reduceValue(value) {aggregate = fn(aggregate, parent$.value);newStream(aggregate);}if (parent$.value !== undefined) {reduceValue(parent$.value);}parent$.listeners.push(reduceValue);return newStream;}function debounce(parent$, timer) {var curTimer = void 0;function debounceValue(value) {if (curTimer) {window.clearTimeout(curTimer);}curTimer = setTimeout(function updateChildStream() {newStream(value);curTimer = null;}, timer);}var newStream = stream();if (parent$.value !== undefined) {debounceValue(parent$.value);}parent$.listeners.push(debounceValue);return newStream;} /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * merge several streams into one stream providing the values of all streams as an array
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * accepts also non stream elements, those are just copied to the output
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * the merge will only have a value if every stream for the merge has a value
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */function merge$(potentialStreamsArr) {var values = potentialStreamsArr.map(function (parent$) {return parent$ && parent$.IS_STREAM ? parent$.value : parent$;});var newStream = stream(values.indexOf(undefined) === -1 ? values : undefined);potentialStreamsArr.forEach(function (potentialStream, index) {if (potentialStream.IS_STREAM) {potentialStream.listeners.push(function updateMergedStream(value) {values[index] = value;newStream(values.indexOf(undefined) === -1 ? values : undefined);});}});return newStream;}function isStream(parent$) {return parent$ != null && !!parent$.IS_STREAM;}function removeItem(arr, item) {var index = arr.indexOf(item);if (index !== -1) {arr.splice(index, 1);}}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });var _zliqRouter = __webpack_require__(16);Object.keys(_zliqRouter).forEach(function (key) {if (key === "default" || key === "__esModule") return;Object.defineProperty(exports, key, { enumerable: true, get: function get() {return _zliqRouter[key];} });});

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });var _streamy = __webpack_require__(4);Object.keys(_streamy).forEach(function (key) {if (key === "default" || key === "__esModule") return;Object.defineProperty(exports, key, { enumerable: true, get: function get() {return _streamy[key];} });});var _streamyDom = __webpack_require__(7);
Object.keys(_streamyDom).forEach(function (key) {if (key === "default" || key === "__esModule") return;Object.defineProperty(exports, key, { enumerable: true, get: function get() {return _streamyDom[key];} });});var _streamyHyperscript = __webpack_require__(21);
Object.keys(_streamyHyperscript).forEach(function (key) {if (key === "default" || key === "__esModule") return;Object.defineProperty(exports, key, { enumerable: true, get: function get() {return _streamyHyperscript[key];} });});var _streamyHelpers = __webpack_require__(20);
Object.keys(_streamyHelpers).forEach(function (key) {if (key === "default" || key === "__esModule") return;Object.defineProperty(exports, key, { enumerable: true, get: function get() {return _streamyHelpers[key];} });});

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};exports.



render = render;exports.








































diff = diff;exports.

































































































































































































































createNode = createNode;var _streamy = __webpack_require__(4);var TEXT_NODE = '#text';function render(vdom, parentElement) {var globals = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};var debounce = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;var vdom$ = vdom(globals);return vdom$.debounce(debounce).reduce(function renderUpdate(_ref, _ref2) {var oldElement = _ref.element,oldVersion = _ref.version,oldChildren = _ref.children,keyContainer = _ref.keyContainer;var tag = _ref2.tag,props = _ref2.props,children = _ref2.children,version = _ref2.version;if (oldElement === null) {oldElement = createNode(tag, children);if (parentElement) {parentElement.appendChild(oldElement);}}var newElement = diff(oldElement, { tag: tag, props: props, children: children, version: version }, { children: oldChildren, version: oldVersion }, keyContainer); // signalise mount of root element on initial render
		if (parentElement && version === 0) {triggerLifecycle(oldElement, props, 'mounted');}return { element: newElement, version: version, children: copyChildren(children), keyContainer: keyContainer };}, { element: null, version: -1, children: [], keyContainer: {} });}function diff(oldElement, newChild, oldChild, cacheContainer) {var newElement = oldElement;var isCaching = newChild.props && newChild.props.id; // for keyed elements, we recall unchanged elements
	if (isCaching) {newElement = diffCachedElement(oldElement, newChild, oldChild, cacheContainer);} else {newElement = diffElement(oldElement, newChild, oldChild, cacheContainer);}return newElement;}function diffCachedElement(oldElement, _ref3, _ref4, cacheContainer) {var tag = _ref3.tag,props = _ref3.props,children = _ref3.children,version = _ref3.version;var oldProps = _ref4.props;var id = props.id;var gotCreated = false;var gotUpdated = false; // if there is no cache, create one
	if (cacheContainer[id] === undefined) {cacheContainer[id] = { element: document.createElement(tag), vdom: { tag: tag, props: {}, children: [] } };gotCreated = true;}var elementCache = cacheContainer[id]; // ignore update if version equals cache
	if (version !== elementCache.version) {diffAttributes(elementCache.element, props, oldProps);diffChildren(elementCache.element, children, elementCache.vdom.children, cacheContainer);elementCache.version = version;elementCache.vdom.props = props;elementCache.vdom.children = children;gotUpdated = true;}if (gotCreated) {triggerLifecycle(elementCache.element, props, 'created');} else if (gotUpdated) {triggerLifecycle(elementCache.element, props, 'updated');} // elements are updated in place, so only insert cached element if it's not already there
	if (oldElement !== elementCache.element) {oldElement.parentElement.replaceChild(elementCache.element, oldElement);triggerLifecycle(elementCache.element, props, 'mounted');}return elementCache.element;}function diffElement(element, _ref5, _ref6, cacheContainer) {var tag = _ref5.tag,props = _ref5.props,newChildren = _ref5.children,newVersion = _ref5.version;var oldProps = _ref6.props,oldChildren = _ref6.children,oldVersion = _ref6.version;var initialRender = oldVersion === -1 || oldVersion === undefined; // text nodes behave differently then normal dom elements
	if (isTextNode(element) && tag === TEXT_NODE) {updateTextNode(element, newChildren[0]);return element;} // if the node types do not differ, we reuse the old node
	// we reuse the existing node to save time rerendering it
	// we do not reuse/mutate cached (id) elements as this will mutate the cache
	if (shouldRecycleElement(element, props, tag) === false) {var newElement = createNode(tag, newChildren);element.parentElement.replaceChild(newElement, element);element = newElement; // there are no children anymore on the newly created node
		oldChildren = [];}diffAttributes(element, props, oldProps); // sometimes you might want to skip updates to children on renderer elements i.e. if externals handle this component
	var isolated = props && props.isolated !== undefined; // text nodes we don't want to handle children like with other elements
	// and for isolated components we want to skip all updates after the first render
	if (tag !== TEXT_NODE && (!isolated || initialRender)) {diffChildren(element, newChildren, oldChildren, cacheContainer);}if (initialRender) {triggerLifecycle(element, props, 'created');}if (newVersion > 0) {triggerLifecycle(element, props, 'updated');}return element;} // this removes nodes at the end of the children, that are not needed anymore in the current state for recycling
function removeNotNeededNodes(parentElements, newChildren, oldChildren) {var remaining = parentElements.childNodes.length;if (oldChildren.length !== remaining) {console.warn("ZLIQ: Something other then ZLIQ has manipulated the children of the element", parentElements, ". This can lead to sideffects. Consider using the 'isolated' attribute for this element to prevent updates.");}for (; remaining > newChildren.length; remaining--) {var childToRemove = parentElements.childNodes[remaining - 1];parentElements.removeChild(childToRemove);if (oldChildren.length < remaining) {continue;} else {var cycle = oldChildren[remaining - 1].cycle;triggerLifecycle(childToRemove, { cycle: cycle }, 'removed');}}}function updateExistingNodes(parentElement, newChildren, oldChildren, cacheContainer) {var nodes = parentElement.childNodes;for (var i = 0; i < nodes.length && i < newChildren.length; i++) {diff(nodes[i], newChildren[i], oldChildren[i], cacheContainer);}}function addNewNodes(parentElement, newChildren, cacheContainer) {for (var i = parentElement.childNodes.length; i < newChildren.length; i++) {var _newChildren$i = newChildren[i],tag = _newChildren$i.tag,props = _newChildren$i.props,children = _newChildren$i.children,version = _newChildren$i.version;var newElement = createNode(tag, children);parentElement.appendChild(newElement);diff(newElement, newChildren[i], {}, cacheContainer);if (props && props.cycle && props.cycle.mounted && !props.id) {console.error('The \'mounted\' lifecycle event is only called on elements with id. As elements are updated in place, it is hard to define when a normal element is mounted.');}}}function diffAttributes(element, props) {var oldProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};if (props !== undefined) {Object.keys(props).map(function applyPropertyToElement(attribute) {applyAttribute(element, attribute, props[attribute]);});Object.keys(oldProps).map(function removeNotNeededAttributes(oldAttribute) {if (props[oldAttribute] === undefined) {element.removeAttribute(oldAttribute);}});}}function applyAttribute(element, attribute, value) {if (attribute === 'class' || attribute === 'className') {element.className = value || ''; // we leave the possibility to define styles as strings
		// but we allow styles to be defined as an object
	} else if (attribute === 'style' && typeof value !== "string") {var cssText = value ? Object.keys(value).map(function (key) {return key + ':' + value[key] + ';';}).join(' ') : '';element.style.cssText = cssText; // other propertys are just added as is to the DOM
	} else {// also remove attributes on null to allow better handling of streams
		// streams don't emit on undefined
		if (value === null) {element[attribute] = undefined;} else {// element.setAttribute(attribute, value);
			element[attribute] = value;}}}function diffChildren(element, newChildren) {var oldChildren = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];var cacheContainer = arguments[3];if (newChildren.length === 0 && oldChildren.length === 0) {return;}var oldChildNodes = element.childNodes;var unifiedNewChildren = unifyChildren(newChildren);var unifiedOldChildren = unifyChildren(oldChildren);updateExistingNodes(element, unifiedNewChildren, unifiedOldChildren, cacheContainer);removeNotNeededNodes(element, unifiedNewChildren, oldChildren);addNewNodes(element, unifiedNewChildren, cacheContainer);} /* HELPERS */ /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * jsx has children mixed as vdom-elements and numbers or strings
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * to consistently treat these children similar in the code we transform those numbers and strings
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * into vdom-elements with the tag #text that have one child with their value
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        */function unifyChildren(children) {return children.map(function (child) {// if there is no tag we assume it's a number or a string
		if (!(0, _streamy.isStream)(child) && child.tag === undefined) {return { tag: TEXT_NODE, children: [child], version: 0 };} else {return child;}});} // create text_nodes from numbers or strings
// create domNodes from regular vdom descriptions
function createNode(tag, children) {if (tag === TEXT_NODE) {return document.createTextNode(children[0]);} else {return document.createElement(tag);}} // to not mutate the representation of our children from the last iteration we clone them
// we copy the cycle functions for each element, as JSON parse/stringify does not work for functions
function copyChildren(oldChildren) {var newChildren = JSON.parse(JSON.stringify(oldChildren));newChildren.forEach(function (child, index) {var oldChild = oldChildren[index];if (oldChild.props && oldChild.props.cycle) {child.cycle = oldChild.props.cycle;}if (_typeof(oldChildren[index]) === 'object') {child.children = copyChildren(oldChild.children);}});return newChildren;} // shorthand to call a cycle event for an element if existing
function triggerLifecycle(element) {var _ref7 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},cycle = _ref7.cycle;var event = arguments[2];if (cycle && cycle[event]) {cycle[event](element);}}

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
	return !isTextNode(oldElement) &&
	oldElement.id === "" &&
	!nodeTypeDiffers(oldElement, tag);
}

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });var _zliqStacktrace = __webpack_require__(17);Object.keys(_zliqStacktrace).forEach(function (key) {if (key === "default" || key === "__esModule") return;Object.defineProperty(exports, key, { enumerable: true, get: function get() {return _zliqStacktrace[key];} });});

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.Header = undefined;var _src = __webpack_require__(0);
__webpack_require__(44);

var Header = exports.Header = function Header() {
    var scroll$ = (0, _src.stream)();
    window.addEventListener('scroll', scroll$);

    var headerHidden$ = (0, _src.stream)(false);
    var header = (0, _src.h)('div', {
            'class': headerHidden$.map(function (hidden) {return "row big-header highlight-background " + (hidden ? 'hidden' : '');}),
            onclick: function onclick(e) {return e.target.tagName !== "A" && scrollUp();} }, [

        (0, _src.h)('div', { 'class': 'container' }, [
            (0, _src.h)('div', { 'class': 'row' }, [
                (0, _src.h)('div', { 'class': 'col s12 center' }, [
                    (0, _src.h)('img', { src: './icon.png' }, [])]),

                (0, _src.h)('h1', { 'class': 'col s12 center highlight' }, ['ZLIQ'])]),

            (0, _src.h)('h3', { 'class': 'center highlight-less' }, ['The web-framework-force you want your Padawan to learn.'])]),

        (0, _src.h)('div', { 'class': 'link-list center' }, [
            (0, _src.h)('a', { href: '#motivation' }, ['Motivation']),
            (0, _src.h)('a', { href: '#tutorial' }, ['Tutorial']),
            (0, _src.h)('a', { href: '#streams' }, ['Streams']),
            (0, _src.h)('a', { href: '#state' }, ['State']),
            (0, _src.h)('a', { href: '#helpers' }, ['Helpers']),
            (0, _src.h)('a', { href: '#routing' }, ['Routing']),
            (0, _src.h)('a', { href: '#lifecycle' }, ['Lifecycle']),
            (0, _src.h)('a', { href: '#testing' }, ['Testing'])])]);



    scroll$.map(function () {
        if (!headerHidden$.value && document.body.scrollHeight < 900) return false;
        var scrollTop = window.scrollY;
        return scrollTop > 100;
    }).map(headerHidden$);

    return header;
};

function scrollUp() {
    scrollTo(document.body, 0, 0.5);
}

function scrollTo(element, to, duration) {
    if (duration <= 0) return;
    var difference = to - element.scrollTop;
    var perTick = difference / duration * 10;

    setTimeout(function () {
        element.scrollTop = element.scrollTop + perTick;
        if (element.scrollTop === to) return;
        scrollTo(element, to, duration - 10);
    }, 10);
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.Infos = undefined;var _src = __webpack_require__(0);

var InfoBullet = function InfoBullet(_ref, children) {var icon = _ref.icon,title = _ref.title;
    return (0, _src.h)("div", { "class": "col s12 m4" }, [
        (0, _src.h)("div", { "class": "center promo" }, [
            (0, _src.h)("i", { "class": "material-icons highlight" }, [icon]),
            (0, _src.h)("p", { "class": "promo-caption highlight-less" }, [title]),
            (0, _src.h)("p", { "class": "light center" }, [
                children])])]);



};

var Infos = exports.Infos = function Infos() {return (
        (0, _src.h)("div", { "class": "section" }, [
            (0, _src.h)("div", { "class": "row" }, [
                (0, _src.h)(InfoBullet, { icon: "fast_forward", title: "Few concepts" }, ["ZLIQ is mainly based on functions and streams. If you know React you already understand it. But it doesn't force you into how to build your components.",

                    (0, _src.h)("br", null, []), "Bend it to your will."]),


                (0, _src.h)(InfoBullet, { icon: "merge_type", title: "Based on streams" }, ["ZLIQ uses streams to apply changes to the DOM. You can provide these streams per component. Or you can provide a state stream and pass it through to your component.",

                    (0, _src.h)("br", null, []), "Feel the flow."]),


                (0, _src.h)(InfoBullet, { icon: "short_text", title: "An evenings read" }, ["ZLIQ has only a few lines of code (~600 January 2018). ZLIQ may be the first framework you actually understand E2E.",

                    (0, _src.h)("br", null, []), "Own your code."])])]));};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.Playground = undefined;var _src = __webpack_require__(0);
var _subheader = __webpack_require__(3);
__webpack_require__(45);

var Playground = exports.Playground = function Playground() {return (
        (0, _src.h)('div', { 'class': 'section' }, [
            (0, _src.h)(_subheader.Subheader, { title: 'Experiment', subtitle: 'Fork and get your hands dirty' }, []),
            (0, _src.h)('div', { isolated: true }, [
                (0, _src.h)('script', { async: true, src: '//jsfiddle.net/hvbee8m9/10/embed/js,result/' }, [])])]));};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.Tutorial = undefined;var _src = __webpack_require__(0);
var _zliqRouter = __webpack_require__(5);
var _subheader = __webpack_require__(3);
var _utils = __webpack_require__(19);
__webpack_require__(46);

var Tutorial = exports.Tutorial = function Tutorial(_ref, children, globals) {var router$ = _ref.router$;return (
                (0, _src.h)('div', { 'class': 'section tutorial' }, [
                        (0, _src.h)(_subheader.Subheader, { title: 'Writing Components', subtitle: 'Hello World here we come', id: 'tutorial' }, []),

                        (0, _src.h)('p', null, ['ZLIQ is leveraging ES2015 to read easier and to be readable by everybody. ZLIQ is using ',
                                (0, _src.h)('a', { href: 'https://facebook.github.io/jsx/' }, ['JSX']), ' as a DOM abstraction in JS. This allows templating of the components and allows ZLIQ to define how properties and children are rendered.']),

                        (0, _src.h)('p', null, ['A component in ZLIQ can look like this:']),

                        (0, _src.h)(_utils.Markup, null, ['\n            |import {h} from \'zliq\';\n            |\n            |// insert values in the markup with {x}\n            |export const Highlight = (props, children) =>\n            |    <span class=\'highlight\'>{props.text}</span>;\n            ']),









                        (0, _src.h)('p', null, ['You need to always provide the ', (0, _src.h)('code', null, ['h']), ' function. JSX gets transformed to Hyperscript and the ', (0, _src.h)('code', null, ['h']), ' is what gets evaluated by ZLIQ.']),

                        (0, _src.h)(_utils.Markup, null, ['\n            |// before\n            |export const Highlight = ({text}) =>\n            |    <span class="highlight">{text}</span>;\n            |\n            |// after\n            |export const Highlight = ({text}) =>\n            |    h(\'span\', {\'class\': \'highlight\'}, [text]);\n            ']),











                        (0, _src.h)('p', null, ['ZLIQ is a reactive view rendering framework. Much like React. Reactivity enables the developer to define how the rendering performs without needing to know when or where the data is coming from. Separating the concerns. ZLIQ will rerender the above component every time the input changes. Displaying it with the new content.']),


                        (0, _src.h)('p', null, ['To use components in other components just import the function and use the function name as a tag name:']),

                        (0, _src.h)(_utils.Markup, null, ['\n            |import {h} from \'zliq\';\n            |import {Highlight} from \'./highlight.js\';\n            |\n            |let app = <div>\n            |        <Highlight text="Hello World!!!"></Highlight>\n            |    </div>;\n            |...\n            ']),











                        (0, _src.h)('p', null, ['Insert the generated element into the DOM where you please:']),

                        (0, _src.h)(_utils.Markup, null, ['\n            |import {render} from \'zliq\';\n            |\n            |render(app, document.querySelector(\'#app\'));\n            ']),







                        (0, _src.h)('p', null, ['ZLIQ doesn\'t enforce the parent element rule known from React. Do whatever you like with an element array.']),

                        (0, _src.h)(_utils.Markup, null, ['\n            |import {h} from \'zliq\';\n            |\n            |export const ListItems = () => {\n            |    return [\n            |        <li>I am 1</li>,\n            |        <li>I am 2</li>\n            |    ]\n            |}\n            |\n            |let list = <ul><ListItems /></ul>;\n            ']),














                        (0, _src.h)('p', null, ['ZLIQ allows HTML style event binding to elements:']),

                        (0, _src.h)(_utils.Markup, null, ['|let button = <button onclick={() => console.log(\'got clicked\')}>Click me</button>;']),


                        (0, _src.h)(_subheader.Subheader, { title: 'Streams', subtitle: 'Feel the flow', id: 'streams' }, []),

                        (0, _src.h)('p', null, ['To render static content, we don\'t need a framework... Actual user interaction with our application will change the state at several occasions over time. Stream-librarys like ', (0, _src.h)('a', { href: 'https://github.com/Reactive-Extensions/RxJS' }, ['RXJS']), ' are there explicitly for that scenario. ZLIQ includes a very lite implementation of streams inspired by RXJS and ', (0, _src.h)('a', { href: 'https://github.com/paldepind/flyd' }, ['Flyd']), '.']),

                        (0, _src.h)(_utils.Markup, null, ['\n            |import {stream} from \'zliq\';\n            |\n            |// streams are objects with changing values that will call listeners on new values\n            |// create a new stream with an optional starting value\n            |let newStream = stream(5);\n            |// retrieve the current value of the stream with stream() or stream.value\n            |console.log(newStream()); // 5\n            |// update the stream\n            |newStream(6);\n            |console.log(newStream.value); // 6\n            |\n            |// a stream update returns the stream, so you can chain updats easy\n            |newStream(7)(8)(9);\n            |\n            |// to debug your streams you can use the .log helper\n            |newStream.log() // 9, 10, 11, 12\n            |newStream(10)(11)(12);\n            ']),





















                        (0, _src.h)('p', null, ['The map function is the easiest way to add a listener to the stream']),
                        (0, _src.h)(_utils.Markup, null, ['\n            |newStream.map(value => console.log(value));\n            |\n            |// the map function return a stream of values returned by the listener function\n            |let times2 = newStream.map(x => 2*x)\n            |times2.log() // 10\n            |newStream(5)\n            ']),










                        (0, _src.h)('p', null, ['The format of the stream as a function makes it easy to pipe events into streams.']),
                        (0, _src.h)(_utils.Markup, null, ['\n            |element.attachEventListener(\'click\', eventStream);\n            |// or pipe streams into streams\n            |newStream.map(otherStream);\n            ']),







                        (0, _src.h)('p', null, ['There are a bunch of stream manipulation functions available: ', (0, _src.h)('code', null, ['.map']), ', ', (0, _src.h)('code', null, ['.is']), ', ', (0, _src.h)('code', null, ['.filter']), ', ', (0, _src.h)('code', null, ['.distinct']), ' and ', (0, _src.h)('code', null, ['.reduce']), '. Checkout ', (0, _src.h)('code', null, ['src/utils/streamy.js']), ' for descriptions.']),

                        (0, _src.h)(_utils.Markup, null, ['\n            |let myStream = stream(5)\n            |\n            |// check for a certain value\n            |myStream.is(5).log() // false, true...\n            |myStream(5)\n            |\n            |// only output filtered values\n            |newStream.filter(x => x > 4).log() // 5, 7, 8...\n            |newStream(3)(7)(8)\n            |\n            |// react to previous values\n            |newStream.reduce((sum, cur) => sum + cur, 0).log() // 8, 17, 27...\n            |newStream(9)(10)\n            |\n            |// only react to changed values\n            |newStream.distinct().log() // 10, 11, 10...\n            |newStream(10)(10)(11)(10)\n            ']),





















                        (0, _src.h)('p', null, ['You can also combine streams:']),
                        (0, _src.h)(_utils.Markup, null, ['\n            |import {merge$} from \'zliq\'\n            |\n            |let myStream = stream(5)\n            |let sndStream = stream(3)\n            |let thrdStream = stream(4)\n            |\n            |// you can fuse several streams into one\n            |merge$([myStream, sndStream, thrdStream]).log() // [5, 3, 4]...\n            |\n            |// you can also flatten nested streams into one stream\n            |myStream.flatMap(x => {\n            |    if (x > 5) return sndStream\n            |    return thrdStream\n            |}).log() // 4, 7, 6, 9\n            |sndStream(6)\n            |thrdStream(7)\n            |myStream(8)\n            |sndStream(9)\n            ']),






















                        (0, _src.h)('p', null, ['A special manipulation is the ', (0, _src.h)('code', null, ['.$()']), ' query selector. As a developer I often want to react to changes on a specific nested property. The query selector takes one or more property paths and will return a new stream with the current selected properties:']),

                        (0, _src.h)(_utils.Markup, null, ['\n            |let newStream = stream({\n            |    propA: 1,\n            |    propB: {\n            |        propBA: 2\n            |    }\n            |});\n            |newStream.$(\'propA\').log() // 1\n            |newStream.$([\'propA\', \'propB.propBA\']).log() // [1,2]\n            ']),












                        (0, _src.h)('p', null, ['The counterpart is the ', (0, _src.h)('code', null, ['.patch']), ' functions. It will assume the stream to be a state object and it updates just parts of the object:']),

                        (0, _src.h)(_utils.Markup, null, ['\n            |let newStream = stream({\n            |    propA: 1\n            |})\n            |newStream.log() // { propA: 1 }, { propA: 1, propB: 2 }\n            |newStream.patch({ propB: 2})\n            ']),









                        (0, _src.h)('p', null, ['ZLIQ recognizes passed streams in the Hyperscript and updates the DOM on new stream values:']),

                        (0, _src.h)(_utils.Markup, null, ['\n            |let newStream = stream(\'Hello World\')\n            |let app = <span>{newStream}</span>\n            |render(app).map(({element}) => element.outerHTML).log()\n            |// <span>Hello World</span>\n            |newStream(\'Bye World\')\n            |// <span>Bye World</span>\n            ']),










                        (0, _src.h)('p', null, ['ZLIQ streams are always hot, meaning they will send their last value on hooking into it. BUT the streams will not emit `undefined`!']),

                        (0, _src.h)(_utils.Markup, null, ['\n            |let newStream = stream()\n            |assert(newStream() === undefined)\n            |newStream.log() // \'Hallo World\', ...\n            |newStream(\'Hallo World\')\n            |newStream.log() // \'Hallo World\', ...\n            ']),









                        (0, _src.h)(_subheader.Subheader, { title: 'State Management', subtitle: 'F*** Redux. ZLIQ \u2665 streams', id: 'state' }, []),

                        (0, _src.h)('p', null, ['A core reason for web UI frameworks is the automatic updating of the UI according to some state. This is handled very different in the known frameworks. ZLIQ has no dedicated state management. We already saw that ZLIQ reacts to streams in the Hyperscript. This way you are free to decide if you want to put the state locally or globally or where ever.']),

                        (0, _src.h)('p', null, ['For a component based on state like used in the most MV* frameworks just define a state stream locally.']),

                        (0, _src.h)(_utils.Markup, null, ['\n            |let state$ = stream({ clicks: 0 });\n            |let Component = () => <div>\n            |  Clicks: {state$.$(\'clicks\')}\n            |</div>;\n            ']),








                        (0, _src.h)('p', null, ['For a centralized state like in ', (0, _src.h)('a', { href: 'http://redux.js.org/' }, ['Redux']), ' define a state for the application and then pass it on to each component.']),

                        (0, _src.h)(_utils.Markup, null, ['\n            |let state$ = stream({ clicks: 0 });\n            |\n            |let Component = (props, children, {state$}) => <div>\n            |  Clicks: {state$.$(\'clicks\')}\n            |</div>;\n            |\n            |let app = <Component />;\n            |// pass the state$ as a global to all sub-components\n            |render(app, document.querySelector(\'#app\'), {state$})\n            ']),













                        (0, _src.h)('p', null, ['To manipulate the local or global state you can emit a completely new state to the state stream. Or use the `.patch` function to update only parts of the state:']),

                        (0, _src.h)(_utils.Markup, null, ['\n            |// Redux like action\n            |let increment = (state$) => () => {\n            |    state$.patch({ clicks: state$.$(\'clicks\')() + 1 })\n            |};\n            |\n            |let app = <div>\n            |    <button onclick={increment(state$)}>Click + 1</button>\n            |</div>;\n            ']),












                        (0, _src.h)(_subheader.Subheader, { title: 'Helpers', subtitle: 'Because in some situation you need a friend', id: 'helpers' }, []),

                        (0, _src.h)('p', null, ['ZLIQ acknowledges that a web developer has a bunch of tasks he performs frequently. With ZLIQ this developer could build his own helpers. But we developers are lazy, so ZLIQ provides some basics you probably will use in you ZLIQ application.']),

                        (0, _src.h)('h6', null, ['if$ - boolean switch']),

                        (0, _src.h)('p', null, ['Often you want to show content dependent on boolean-state:']),

                        (0, _src.h)(_utils.Markup, null, ['\n            |<div>\n            |    {\n            |        open$.map(open => {\n            |            if (open) {\n            |                return <span>Open</span>;\n            |            } else {\n            |                return <span>Closed</span>;\n            |            }\n            |        })\n            |    }\n            |</div>\n            ']),















                        (0, _src.h)('p', null, ['ZLIQ provides a boolean switch for these cases:']),

                        (0, _src.h)(_utils.Markup, null, ['\n            |<div>\n            |    {\n            |        if$(open$,\n            |            <span>Open</span>,\n            |            <span>Closed</span>)\n            |    }\n            |</div>\n            ']),











                        (0, _src.h)('h6', null, ['join$ - string merge']),

                        (0, _src.h)('p', null, ['Performing class manipulation on an element can be a pain:']),

                        (0, _src.h)(_utils.Markup, null, ['\n            |<div class={open$.map(open => \'container \' + open ? \'open\' : \'closed\')}>\n            |</div>\n            ']),






                        (0, _src.h)('p', null, ['Imagine this with more then one condition... ZLIQ provides a helper for joining strings even from streams:']),

                        (0, _src.h)(_utils.Markup, null, ['\n            |<div class={join$(\'container\', if$(open$, \'open\', \'closed\'))}>\n            |</div>\n            ']),






                        (0, _src.h)('h6', null, ['promise$ - promise enhancer']),

                        (0, _src.h)('p', null, ['ZLIQ provides a little wrapper around promises. It provides a flag for the ongoing request. This way you can show loading bars easily:']),

                        (0, _src.h)(_utils.Markup, null, ['\n            |import { promise$ } from \'../src\';\n            |\n            |let fetchQuote = (into$) => () => {\n            |\tpromise$(fetch(\'http://quotes.rest/qod.json?category=inspire\')\n            |        .then(res => res.json())\n            |        .then(data => {\n            |\t\t    return {\n            |\t\t    \tquote: data.contents.quotes["0"].quote,\n            |\t\t    \tauthor: data.contents.quotes["0"].author\n            |\t\t    };\n            |\t}).map(into$);\n            |}\n            |let quoteRequest$ = stream({initial: true});\n            |\n            |let app = <div>\n            |    <button onclick={fetchQuote(quoteRequest$)}>Get Quote of the Day</button>\n            |    <p>\n            |        {\n            |            quoteRequest$.map(({initial, data, loading}) => {\n            |                if (initial) {\n            |                   return null;\n            |                }\n            |                if (loading) {\n            |                    return \'Loading...\';\n            |                }\n            |                return <p>{data.quote} - {data.author}</p>;\n            |            })\n            |        }\n            |    </p>\n            |</div>;\n            ']),


































                        (0, _src.h)(_subheader.Subheader, { title: 'Routing', subtitle: 'Put your state where your URL is', id: 'routing' }, []),

                        (0, _src.h)('p', null, ['ZLIQ provides a small router as a package \'zliq-router\' to be installed via npm. It plugs very natural into native links. It provides you with the routing as a stream so you can use it as an input to your view. It also provides a component to switch on certain routes. Check it out on ',

                                (0, _src.h)('a', { href: 'http://github.com/faboweb/zliq-router' }, ['GitHub'])]),

                        (0, _src.h)(_utils.Markup, null, ['\n            |import {Router, initRouter}\n            |\n            |let router$ = initRouter()\n            |router$.log() // {route: \'/\', params: {}, routes: [...]}\n            |\n            |let app = <div>\n            |    <a href="/cats">Go the cats</a>\n            |    <a href="/">Go away from cats</a>\n            |    <Router route="/" router$={router$}>\n            |        No Cats here. :-(\n            |    </Router>\n            |    <Router route="/cats" router$={router$}>\n            |        Miau! Miau!\n            |    </Router>\n            |</div>\n            ']),



















                        (0, _src.h)(_subheader.Subheader, { title: 'Lifecycle', subtitle: 'To cleanup your s*** after your done', id: 'lifecycle' }, []),

                        (0, _src.h)('p', null, ['ZLIQ integrates lifecycle event. You can add an attribute cycle to any component holding functions for the lifecycle events `created`, `mounted`, `updated` and `removed`. This way you can perform actions like initialization jQuery plugins on the element.']),

                        (0, _src.h)(_utils.Markup, null, ['\n            |let cycle = {\n            |    mounted: element => {} // do sth with the element here\n            |}\n            |let app = <div cycle={cycle}><div>\n            ']),








                        (0, _src.h)('p', null, ['In rare cases you want to prevent ZLIQ from updating renderer children. For example if yome external plugin handles a renderer element. To do so you just add the `isolated` attribute to the element.']),

                        (0, _src.h)(_utils.Markup, null, ['\n            |let state$ = stream({ clicks: 0 });\n            |let app = <div isolated>\n            |  Clicks: {state$.$(\'clicks\')}\n            |</div>\n            |render(app).map(({element}) => element.outerHTML).log()\n            |// <div>Clicks: 0</div>\n            |// <div>Clicks: 0</div>\n            |state$.patch({clicks: 1})\n            ']),






























                        (0, _src.h)(_subheader.Subheader, { title: 'Testing', subtitle: 'A good framework is easy to test', id: 'testing' }, []),

                        (0, _src.h)('p', null, ['ZLIQ provides a helper to test the output of your components over time:']),

                        (0, _src.h)(_utils.Markup, null, ['\n            |import {h, stream, testRender} from \'zliq\';\n            |\n            |let text$ = stream(\'Hello World!!!\');\n            |testRender(<p>{text$}></p>, [\n            |    // on each update of an element, we can test it\n            |    ({element}) => assert.equal(element.outerHTML, \'<p>Hello World!!!</p>\'),\n            |    // it is enough to just provide the expected html\n            |    \'<p>Bye World!!!</p>\',\n            |]);\n            |text$(\'Bye World!!!\');\n            ']),














                        (0, _src.h)('p', null, ['For streams you can also just provide the sequence of values:']),

                        (0, _src.h)(_utils.Markup, null, ['\n            |import {stream, test$} from \'zliq\';\n            |\n            |let value$ = stream({value: 1});\n            |test$(value$, [\n            |    {value: 1},\n            |    2,\n            |    false\n            |]);\n            |value$(2)(false);\n            ']),













                        (0, _src.h)('p', null, ['If you need an easy test setup checkout how the ZLIQ project uses ', (0, _src.h)('a', { href: 'https://facebook.github.io/jest/' }, ['Jest']), ' with almost 0 configuration.'])]));};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(25);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(2)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js!./styles.scss", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js!./styles.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(27);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(2)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../css-loader/index.js!../../sass-loader/lib/loader.js!./ghpages-materialize.css", function() {
			var newContent = require("!!../../css-loader/index.js!../../sass-loader/lib/loader.js!./ghpages-materialize.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var _typeof3 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};(function webpackUniversalModuleDefinition(root, factory) {
	if (( false ? 'undefined' : _typeof3(exports)) === 'object' && ( false ? 'undefined' : _typeof3(module)) === 'object')
	module.exports = factory();else
	if (true)
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else
	if ((typeof exports === 'undefined' ? 'undefined' : _typeof3(exports)) === 'object')
	exports["zliq-router"] = factory();else

	root["zliq-router"] = factory();
})(undefined, function () {
	return (/******/function (modules) {// webpackBootstrap
			/******/ // The module cache
			/******/var installedModules = {};
			/******/
			/******/ // The require function
			/******/function __webpack_require__(moduleId) {
				/******/
				/******/ // Check if module is in cache
				/******/if (installedModules[moduleId]) {
					/******/return installedModules[moduleId].exports;
					/******/}
				/******/ // Create a new module (and put it into the cache)
				/******/var module = installedModules[moduleId] = {
					/******/i: moduleId,
					/******/l: false,
					/******/exports: {}
					/******/ };
				/******/
				/******/ // Execute the module function
				/******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
				/******/
				/******/ // Flag the module as loaded
				/******/module.l = true;
				/******/
				/******/ // Return the exports of the module
				/******/return module.exports;
				/******/}
			/******/
			/******/
			/******/ // expose the modules object (__webpack_modules__)
			/******/__webpack_require__.m = modules;
			/******/
			/******/ // expose the module cache
			/******/__webpack_require__.c = installedModules;
			/******/
			/******/ // identity function for calling harmony imports with the correct context
			/******/__webpack_require__.i = function (value) {return value;};
			/******/
			/******/ // define getter function for harmony exports
			/******/__webpack_require__.d = function (exports, name, getter) {
				/******/if (!__webpack_require__.o(exports, name)) {
					/******/Object.defineProperty(exports, name, {
						/******/configurable: false,
						/******/enumerable: true,
						/******/get: getter
						/******/ });
					/******/}
				/******/};
			/******/
			/******/ // getDefaultExport function for compatibility with non-harmony modules
			/******/__webpack_require__.n = function (module) {
				/******/var getter = module && module.__esModule ?
				/******/function getDefault() {return module['default'];} :
				/******/function getModuleExports() {return module;};
				/******/__webpack_require__.d(getter, 'a', getter);
				/******/return getter;
				/******/};
			/******/
			/******/ // Object.prototype.hasOwnProperty.call
			/******/__webpack_require__.o = function (object, property) {return Object.prototype.hasOwnProperty.call(object, property);};
			/******/
			/******/ // __webpack_public_path__
			/******/__webpack_require__.p = "";
			/******/
			/******/ // Load entry module and return exports
			/******/return __webpack_require__(__webpack_require__.s = 3);
			/******/}(
		/************************************************************************/
		/******/[
		/* 0 */
		/***/function (module, exports, __webpack_require__) {

			"use strict";


			Object.defineProperty(exports, "__esModule", {
				value: true });


			var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();

			exports.removeRouter = removeRouter;
			exports.Router = Router;
			exports.initRouter = initRouter;

			var _zliq = __webpack_require__(1);

			var interceptClickEventInstance = void 0;

			// intercepts clicks on links 
			// if the link is local '/...' we change the location hash instead 
			function interceptClickEvent(routerState$) {
				return function (e) {
					var target = e.target || e.srcElement;
					if (target.tagName === 'A') {
						var href = target.getAttribute('href');
						var isLocal = href && href.startsWith('/');
						var isAnchor = href && href.startsWith('#');

						if (isLocal || isAnchor) {
							var _parseLink = parseLink(href),
							anchor = _parseLink.anchor,
							route = _parseLink.route,
							query = _parseLink.query;

							if (route === undefined) {
								route = routerState$.value.route;
							}
							pushRoute(routerState$, { route: route, query: query, anchor: anchor });
							//tell the browser not to respond to the link click 
							e.preventDefault();
						}
					}
				};
			}

			function removeRouter() {
				window.onpopstate = function () {};
				document.removeEventListener('click', interceptClickEventInstance);
			}
			function interceptLinks(routerState$) {
				if (interceptClickEventInstance) {
					removeRouter();
				}
				// listen for link click events at the document level 
				interceptClickEventInstance = interceptClickEvent(routerState$);
				document.addEventListener('click', interceptClickEventInstance);

				// react to HTML5 go back and forward events 
				window.onpopstate = function (event) {
					if (event.state) {
						var _event$state = event.state,
						route = _event$state.route,
						query = _event$state.query;

						dispatchRouteChange(routerState$, route, query);
					}
				};
			}

			// this is an element that shows it's content only if the expected route is met 
			function Router(_ref, children$) {
				var router$ = _ref.router$,
				route = _ref.route;

				if (!router$) {
					console.log('The Router component needs the routerState$ as attribute.');
					return null;
				}
				if (!route) {
					console.log('The Router component needs the route as attribute.');
					return null;
				}
				// Register the route 
				// this is necessary to decide on a default route 
				router$.$('routes')
				// routes can be attached async so we check if the route exists and if not add it 
				.map(function (routes) {
					return routes.indexOf(route) === -1 && router$.patch({ routes: routes.concat(route) });
				});

				// check if no registered route was hit and set default if so 
				var sanitizedRoute$ = router$.map(function (_ref2) {
					var route = _ref2.route,
					routes = _ref2.routes;

					if (routes.indexOf(route) === -1) {
						if (routes.indexOf('/404') !== -1) {
							return '/404';
						}
						return '/';
					}
					return route;
				});

				var routeWasHit$ = sanitizedRoute$.is(route).distinct();
				return (0, _zliq.merge$)([routeWasHit$, children$]).map(function (_ref3) {
					var _ref4 = _slicedToArray(_ref3, 2),
					wasHit = _ref4[0],
					children = _ref4[1];

					return wasHit ? children : [];
				});
			}

			// provide location for testing purposes 
			function initRouter() {
				var location = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.location;

				var routerState$ = (0, _zliq.stream)({
					route: '',
					params: {},
					routes: ['/'] });


				interceptLinks(routerState$);

				// react to initial routing info 
				if (location.pathname !== '/' || location.search !== "") {
					// construct initial routing link 
					var _parseLink2 = parseLink('' + (location.pathname || '') + (location.search || '') + (location.hash || '')),
					route = _parseLink2.route,
					query = _parseLink2.query;

					dispatchRouteChange(routerState$, route, query);
				}

				routerState$.go = function () {
					for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
						args[_key] = arguments[_key];
					}

					if (args.length > 0 && typeof args[0] === 'string') {
						pushRoute(routerState$, parseLink(args[0]));
					} else {
						pushRoute.apply(undefined, [routerState$].concat(args));
					}
				};

				return routerState$;
			}

			function queryToObject() {
				var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

				return query.split('&').map(function (pair) {
					return pair.split('=');
				}).reduce(function (params, _ref5) {
					var _ref6 = _slicedToArray(_ref5, 2),
					key = _ref6[0],
					value = _ref6[1];

					params[key] = value;
					return params;
				}, {});
			}

			// matching links in the form of /route/subroute?param1=a&param2=b#anchor 
			function parseLink(link) {
				var regexp = /((\/\w*)*)?(\?((\w+=\w*)(&(\w+=\w*)+)*))?(#(\w+))?/;
				var matchArr = regexp.exec(link);
				// console.log(link, matchArr)
				return {
					anchor: matchArr[9],
					route: matchArr[1],
					query: matchArr[4] };

			}

			// callback for HTML5 navigation events 
			// save the routing info in the routerState 
			function dispatchRouteChange(routerState$, route, query) {
				routerState$.patch({
					route: route || '',
					params: queryToObject(query) });

			}

			function pushRoute(routerState$, _ref7) {
				var route = _ref7.route,
				query = _ref7.query,
				anchor = _ref7.anchor;

				var url = '' + (route || '/') + (query ? '?' + query : '');
				history.pushState({ anchor: anchor, route: route, query: query }, '', '' + route + (query ? '?' + query : ''));
				if (anchor) {
					location.hash = '#' + anchor;
				}
				dispatchRouteChange(routerState$, route, query);
			}

			/***/},
		/* 1 */
		/***/function (module, exports, __webpack_require__) {

			"use strict";


			module.exports = __webpack_require__(2);

			/***/},
		/* 2 */
		/***/function (module, exports, __webpack_require__) {

			"use strict";


			var _typeof2 = typeof Symbol === "function" && _typeof3(Symbol.iterator) === "symbol" ? function (obj) {return typeof obj === 'undefined' ? 'undefined' : _typeof3(obj);} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof3(obj);};

			module.exports =
			/******/function (modules) {
				// webpackBootstrap
				/******/ // The module cache
				/******/var installedModules = {};
				/******/
				/******/ // The require function
				/******/function __webpack_require__(moduleId) {
					/******/
					/******/ // Check if module is in cache
					/******/if (installedModules[moduleId]) {
						/******/return installedModules[moduleId].exports;
						/******/
					}
					/******/ // Create a new module (and put it into the cache)
					/******/var module = installedModules[moduleId] = {
						/******/i: moduleId,
						/******/l: false,
						/******/exports: {}
						/******/ };
					/******/
					/******/ // Execute the module function
					/******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
					/******/
					/******/ // Flag the module as loaded
					/******/module.l = true;
					/******/
					/******/ // Return the exports of the module
					/******/return module.exports;
					/******/
				}
				/******/
				/******/
				/******/ // expose the modules object (__webpack_modules__)
				/******/__webpack_require__.m = modules;
				/******/
				/******/ // expose the module cache
				/******/__webpack_require__.c = installedModules;
				/******/
				/******/ // identity function for calling harmony imports with the correct context
				/******/__webpack_require__.i = function (value) {
					return value;
				};
				/******/
				/******/ // define getter function for harmony exports
				/******/__webpack_require__.d = function (exports, name, getter) {
					/******/if (!__webpack_require__.o(exports, name)) {
						/******/Object.defineProperty(exports, name, {
							/******/configurable: false,
							/******/enumerable: true,
							/******/get: getter
							/******/ });
						/******/
					}
					/******/
				};
				/******/
				/******/ // getDefaultExport function for compatibility with non-harmony modules
				/******/__webpack_require__.n = function (module) {
					/******/var getter = module && module.__esModule ?
					/******/function getDefault() {
						return module['default'];
					} :
					/******/function getModuleExports() {
						return module;
					};
					/******/__webpack_require__.d(getter, 'a', getter);
					/******/return getter;
					/******/
				};
				/******/
				/******/ // Object.prototype.hasOwnProperty.call
				/******/__webpack_require__.o = function (object, property) {
					return Object.prototype.hasOwnProperty.call(object, property);
				};
				/******/
				/******/ // __webpack_public_path__
				/******/__webpack_require__.p = "";
				/******/
				/******/ // Load entry module and return exports
				/******/return __webpack_require__(__webpack_require__.s = 2);
				/******/
			}(
			/************************************************************************/
			/******/[
			/* 0 */
			/***/function (module, exports, __webpack_require__) {

				"use strict";

				Object.defineProperty(exports, "__esModule", {
					value: true });

				exports.stream = undefined;

				var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
					return typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
				} : function (obj) {
					return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
				};

				exports.merge$ = merge$;
				exports.isStream = isStream;

				var _deepEqual = __webpack_require__(5);

				var _deepEqual2 = _interopRequireDefault(_deepEqual);

				function _interopRequireDefault(obj) {
					return obj && obj.__esModule ? obj : { default: obj };
				}

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
					return new Promise(function (resolve) {
						if (partialChange === null || (typeof partialChange === 'undefined' ? 'undefined' : _typeof(partialChange)) !== 'object' || _typeof(parent$.value) !== 'object') {
							parent$(partialChange);
						} else {
							parent$(Object.assign({}, parent$.value, partialChange));
						}
						resolve(parent$);
						// setImmediate(() => {
						// })
					});
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

				/***/
			},
			/* 1 */
			/***/function (module, exports, __webpack_require__) {

				"use strict";

				Object.defineProperty(exports, "__esModule", {
					value: true });


				var _streamy = __webpack_require__(0);

				Object.keys(_streamy).forEach(function (key) {
					if (key === "default" || key === "__esModule") return;
					Object.defineProperty(exports, key, {
						enumerable: true,
						get: function get() {
							return _streamy[key];
						} });

				});

				var _streamyDom = __webpack_require__(3);

				Object.keys(_streamyDom).forEach(function (key) {
					if (key === "default" || key === "__esModule") return;
					Object.defineProperty(exports, key, {
						enumerable: true,
						get: function get() {
							return _streamyDom[key];
						} });

				});

				var _streamyHyperscript = __webpack_require__(9);

				Object.keys(_streamyHyperscript).forEach(function (key) {
					if (key === "default" || key === "__esModule") return;
					Object.defineProperty(exports, key, {
						enumerable: true,
						get: function get() {
							return _streamyHyperscript[key];
						} });

				});

				var _streamyHelpers = __webpack_require__(8);

				Object.keys(_streamyHelpers).forEach(function (key) {
					if (key === "default" || key === "__esModule") return;
					Object.defineProperty(exports, key, {
						enumerable: true,
						get: function get() {
							return _streamyHelpers[key];
						} });

				});

				/***/
			},
			/* 2 */
			/***/function (module, exports, __webpack_require__) {

				"use strict";

				Object.defineProperty(exports, "__esModule", {
					value: true });


				var _utils = __webpack_require__(1);

				Object.keys(_utils).forEach(function (key) {
					if (key === "default" || key === "__esModule") return;
					Object.defineProperty(exports, key, {
						enumerable: true,
						get: function get() {
							return _utils[key];
						} });

				});

				var _testComponent = __webpack_require__(4);

				Object.keys(_testComponent).forEach(function (key) {
					if (key === "default" || key === "__esModule") return;
					Object.defineProperty(exports, key, {
						enumerable: true,
						get: function get() {
							return _testComponent[key];
						} });

				});

				/***/
			},
			/* 3 */
			/***/function (module, exports, __webpack_require__) {

				"use strict";

				Object.defineProperty(exports, "__esModule", {
					value: true });


				var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
					return typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
				} : function (obj) {
					return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
				};

				exports.render = render;
				exports.diff = diff;
				exports.createNode = createNode;

				var _streamy = __webpack_require__(0);

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
						var newElement = diff(oldElement, { tag: tag, props: props, children: children, version: version }, { children: oldChildren, version: oldVersion }, keyContainer);

						// signalise mount of root element on initial render
						if (parentElement && version === 0) {
							triggerLifecycle(oldElement, props, 'mounted');
						}

						return {
							element: newElement,
							version: version,
							children: copyChildren(children),
							keyContainer: keyContainer };

					}, {
						element: null,
						version: -1,
						children: [],
						keyContainer: {} });

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
								children: [] } };


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
					var remaining = parentElements.childNodes.length;
					if (oldChildren.length !== remaining) {
						console.warn("ZLIQ: Something other then ZLIQ has manipulated the children of the element", parentElements, ". This can lead to sideffects. Please check your code.");
					}

					for (; remaining > newChildren.length; remaining--) {
						var childToRemove = parentElements.childNodes[remaining - 1];
						parentElements.removeChild(childToRemove);

						if (oldChildren.length < remaining) {
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

						if (props && props.cycle && props.cycle.mounted) {
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
								version: 0 };

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

				/***/
			},
			/* 4 */
			/***/function (module, exports, __webpack_require__) {

				"use strict";

				Object.defineProperty(exports, "__esModule", {
					value: true });

				exports.testRender = testRender;
				exports.test$ = test$;

				var _src = __webpack_require__(2);

				function testRender(vdom$, schedule, done) {
					var attach = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

					var container = document.createElement('div');
					if (attach) {
						document.body.appendChild(container);
					}
					return test$((0, _src.render)(vdom$, container, 0), schedule, done);
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

				/***/
			},
			/* 5 */
			/***/function (module, exports, __webpack_require__) {

				"use strict";

				var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
					return typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
				} : function (obj) {
					return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
				};

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

				/***/
			},
			/* 6 */
			/***/function (module, exports, __webpack_require__) {

				"use strict";

				var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
					return typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
				} : function (obj) {
					return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
				};

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

				/***/
			},
			/* 7 */
			/***/function (module, exports, __webpack_require__) {

				"use strict";

				exports = module.exports = typeof Object.keys === 'function' ? Object.keys : shim;

				exports.shim = shim;
				function shim(obj) {
					var keys = [];
					for (var key in obj) {
						keys.push(key);
					}return keys;
				}

				/***/
			},
			/* 8 */
			/***/function (module, exports, __webpack_require__) {

				"use strict";

				Object.defineProperty(exports, "__esModule", {
					value: true });

				exports.promise$ = undefined;
				exports.if$ = if$;
				exports.join$ = join$;

				var _ = __webpack_require__(1);

				// wrapper around promises to provide an indicator if the promise is running
				var promise$ = exports.promise$ = function promise$(promise) {
					var output$ = (0, _.stream)({
						loading: true,
						error: null,
						data: null });


					promise.then(function (result) {
						output$.patch({
							loading: false,
							data: result });

					}, function (error) {
						output$.patch({
							loading: false,
							error: error });

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

				/***/
			},
			/* 9 */
			/***/function (module, exports, __webpack_require__) {

				"use strict";

				Object.defineProperty(exports, "__esModule", {
					value: true });

				exports.h = undefined;

				var _slicedToArray = function () {
					function sliceIterator(arr, i) {
						var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
							for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
								_arr.push(_s.value);if (i && _arr.length === i) break;
							}
						} catch (err) {
							_d = true;_e = err;
						} finally {
							try {
								if (!_n && _i["return"]) _i["return"]();
							} finally {
								if (_d) throw _e;
							}
						}return _arr;
					}return function (arr, i) {
						if (Array.isArray(arr)) {
							return arr;
						} else if (Symbol.iterator in Object(arr)) {
							return sliceIterator(arr, i);
						} else {
							throw new TypeError("Invalid attempt to destructure non-iterable instance");
						}
					};
				}();

				exports.flatten = flatten;

				var _streamy = __webpack_require__(0);

				var _streamyDom = __webpack_require__(3);

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
							version: ++version };

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
						if (obj[key] && (0, _streamy.isStream)(obj[key])) {
							return [{
								parent: obj,
								key: key,
								stream: obj[key] }];

						}
						return [];
					}));
				}

				/***/
			}]);
			//# sourceMappingURL=zliq.js.map

			/***/},
		/* 3 */
		/***/function (module, exports, __webpack_require__) {

			"use strict";


			Object.defineProperty(exports, "__esModule", {
				value: true });


			var _router = __webpack_require__(0);

			Object.keys(_router).forEach(function (key) {
				if (key === "default" || key === "__esModule") return;
				Object.defineProperty(exports, key, {
					enumerable: true,
					get: function get() {
						return _router[key];
					} });

			});

			/***/}]));

});
//# sourceMappingURL=zliq-router.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)(module)))

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};(function webpackUniversalModuleDefinition(root, factory) {
  if (( false ? 'undefined' : _typeof(exports)) === 'object' && ( false ? 'undefined' : _typeof(module)) === 'object')
  module.exports = factory();else
  if (true)
  !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else
  if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object')
  exports["zliq-router"] = factory();else

  root["zliq-router"] = factory();
})(undefined, function () {
  return (/******/function (modules) {// webpackBootstrap
      /******/ // The module cache
      /******/var installedModules = {};
      /******/
      /******/ // The require function
      /******/function __webpack_require__(moduleId) {
        /******/
        /******/ // Check if module is in cache
        /******/if (installedModules[moduleId]) {
          /******/return installedModules[moduleId].exports;
          /******/}
        /******/ // Create a new module (and put it into the cache)
        /******/var module = installedModules[moduleId] = {
          /******/i: moduleId,
          /******/l: false,
          /******/exports: {}
          /******/ };
        /******/
        /******/ // Execute the module function
        /******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        /******/
        /******/ // Flag the module as loaded
        /******/module.l = true;
        /******/
        /******/ // Return the exports of the module
        /******/return module.exports;
        /******/}
      /******/
      /******/
      /******/ // expose the modules object (__webpack_modules__)
      /******/__webpack_require__.m = modules;
      /******/
      /******/ // expose the module cache
      /******/__webpack_require__.c = installedModules;
      /******/
      /******/ // identity function for calling harmony imports with the correct context
      /******/__webpack_require__.i = function (value) {return value;};
      /******/
      /******/ // define getter function for harmony exports
      /******/__webpack_require__.d = function (exports, name, getter) {
        /******/if (!__webpack_require__.o(exports, name)) {
          /******/Object.defineProperty(exports, name, {
            /******/configurable: false,
            /******/enumerable: true,
            /******/get: getter
            /******/ });
          /******/}
        /******/};
      /******/
      /******/ // getDefaultExport function for compatibility with non-harmony modules
      /******/__webpack_require__.n = function (module) {
        /******/var getter = module && module.__esModule ?
        /******/function getDefault() {return module['default'];} :
        /******/function getModuleExports() {return module;};
        /******/__webpack_require__.d(getter, 'a', getter);
        /******/return getter;
        /******/};
      /******/
      /******/ // Object.prototype.hasOwnProperty.call
      /******/__webpack_require__.o = function (object, property) {return Object.prototype.hasOwnProperty.call(object, property);};
      /******/
      /******/ // __webpack_public_path__
      /******/__webpack_require__.p = "";
      /******/
      /******/ // Load entry module and return exports
      /******/return __webpack_require__(__webpack_require__.s = 9);
      /******/}(
    /************************************************************************/
    /******/[
    /* 0 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";


      /* -*- Mode: js; js-indent-level: 2; -*- */
      /*
                                                   * Copyright 2011 Mozilla Foundation and contributors
                                                   * Licensed under the New BSD license. See LICENSE or:
                                                   * http://opensource.org/licenses/BSD-3-Clause
                                                   */

      /**
                                                       * This is a helper function for getting values from parameter/options
                                                       * objects.
                                                       *
                                                       * @param args The object we are extracting values from
                                                       * @param name The name of the property we are getting.
                                                       * @param defaultValue An optional value to return if the property is missing
                                                       * from the object. If this is not specified and the property is missing, an
                                                       * error will be thrown.
                                                       */
      function getArg(aArgs, aName, aDefaultValue) {
        if (aName in aArgs) {
          return aArgs[aName];
        } else if (arguments.length === 3) {
          return aDefaultValue;
        } else {
          throw new Error('"' + aName + '" is a required argument.');
        }
      }
      exports.getArg = getArg;

      var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.]*)(?::(\d+))?(\S*)$/;
      var dataUrlRegexp = /^data:.+\,.+$/;

      function urlParse(aUrl) {
        var match = aUrl.match(urlRegexp);
        if (!match) {
          return null;
        }
        return {
          scheme: match[1],
          auth: match[2],
          host: match[3],
          port: match[4],
          path: match[5] };

      }
      exports.urlParse = urlParse;

      function urlGenerate(aParsedUrl) {
        var url = '';
        if (aParsedUrl.scheme) {
          url += aParsedUrl.scheme + ':';
        }
        url += '//';
        if (aParsedUrl.auth) {
          url += aParsedUrl.auth + '@';
        }
        if (aParsedUrl.host) {
          url += aParsedUrl.host;
        }
        if (aParsedUrl.port) {
          url += ":" + aParsedUrl.port;
        }
        if (aParsedUrl.path) {
          url += aParsedUrl.path;
        }
        return url;
      }
      exports.urlGenerate = urlGenerate;

      /**
                                          * Normalizes a path, or the path portion of a URL:
                                          *
                                          * - Replaces consecutive slashes with one slash.
                                          * - Removes unnecessary '.' parts.
                                          * - Removes unnecessary '<dir>/..' parts.
                                          *
                                          * Based on code in the Node.js 'path' core module.
                                          *
                                          * @param aPath The path or url to normalize.
                                          */
      function normalize(aPath) {
        var path = aPath;
        var url = urlParse(aPath);
        if (url) {
          if (!url.path) {
            return aPath;
          }
          path = url.path;
        }
        var isAbsolute = exports.isAbsolute(path);

        var parts = path.split(/\/+/);
        for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
          part = parts[i];
          if (part === '.') {
            parts.splice(i, 1);
          } else if (part === '..') {
            up++;
          } else if (up > 0) {
            if (part === '') {
              // The first part is blank if the path is absolute. Trying to go
              // above the root is a no-op. Therefore we can remove all '..' parts
              // directly after the root.
              parts.splice(i + 1, up);
              up = 0;
            } else {
              parts.splice(i, 2);
              up--;
            }
          }
        }
        path = parts.join('/');

        if (path === '') {
          path = isAbsolute ? '/' : '.';
        }

        if (url) {
          url.path = path;
          return urlGenerate(url);
        }
        return path;
      }
      exports.normalize = normalize;

      /**
                                      * Joins two paths/URLs.
                                      *
                                      * @param aRoot The root path or URL.
                                      * @param aPath The path or URL to be joined with the root.
                                      *
                                      * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
                                      *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
                                      *   first.
                                      * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
                                      *   is updated with the result and aRoot is returned. Otherwise the result
                                      *   is returned.
                                      *   - If aPath is absolute, the result is aPath.
                                      *   - Otherwise the two paths are joined with a slash.
                                      * - Joining for example 'http://' and 'www.example.com' is also supported.
                                      */
      function join(aRoot, aPath) {
        if (aRoot === "") {
          aRoot = ".";
        }
        if (aPath === "") {
          aPath = ".";
        }
        var aPathUrl = urlParse(aPath);
        var aRootUrl = urlParse(aRoot);
        if (aRootUrl) {
          aRoot = aRootUrl.path || '/';
        }

        // `join(foo, '//www.example.org')`
        if (aPathUrl && !aPathUrl.scheme) {
          if (aRootUrl) {
            aPathUrl.scheme = aRootUrl.scheme;
          }
          return urlGenerate(aPathUrl);
        }

        if (aPathUrl || aPath.match(dataUrlRegexp)) {
          return aPath;
        }

        // `join('http://', 'www.example.com')`
        if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
          aRootUrl.host = aPath;
          return urlGenerate(aRootUrl);
        }

        var joined = aPath.charAt(0) === '/' ? aPath : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

        if (aRootUrl) {
          aRootUrl.path = joined;
          return urlGenerate(aRootUrl);
        }
        return joined;
      }
      exports.join = join;

      exports.isAbsolute = function (aPath) {
        return aPath.charAt(0) === '/' || !!aPath.match(urlRegexp);
      };

      /**
          * Make a path relative to a URL or another path.
          *
          * @param aRoot The root path or URL.
          * @param aPath The path or URL to be made relative to aRoot.
          */
      function relative(aRoot, aPath) {
        if (aRoot === "") {
          aRoot = ".";
        }

        aRoot = aRoot.replace(/\/$/, '');

        // It is possible for the path to be above the root. In this case, simply
        // checking whether the root is a prefix of the path won't work. Instead, we
        // need to remove components from the root one by one, until either we find
        // a prefix that fits, or we run out of components to remove.
        var level = 0;
        while (aPath.indexOf(aRoot + '/') !== 0) {
          var index = aRoot.lastIndexOf("/");
          if (index < 0) {
            return aPath;
          }

          // If the only part of the root that is left is the scheme (i.e. http://,
          // file:///, etc.), one or more slashes (/), or simply nothing at all, we
          // have exhausted all components, so the path is not relative to the root.
          aRoot = aRoot.slice(0, index);
          if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
            return aPath;
          }

          ++level;
        }

        // Make sure we add a "../" for each component we removed from the root.
        return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
      }
      exports.relative = relative;

      var supportsNullProto = function () {
        var obj = Object.create(null);
        return !('__proto__' in obj);
      }();

      function identity(s) {
        return s;
      }

      /**
         * Because behavior goes wacky when you set `__proto__` on objects, we
         * have to prefix all the strings in our set with an arbitrary character.
         *
         * See https://github.com/mozilla/source-map/pull/31 and
         * https://github.com/mozilla/source-map/issues/30
         *
         * @param String aStr
         */
      function toSetString(aStr) {
        if (isProtoString(aStr)) {
          return '$' + aStr;
        }

        return aStr;
      }
      exports.toSetString = supportsNullProto ? identity : toSetString;

      function fromSetString(aStr) {
        if (isProtoString(aStr)) {
          return aStr.slice(1);
        }

        return aStr;
      }
      exports.fromSetString = supportsNullProto ? identity : fromSetString;

      function isProtoString(s) {
        if (!s) {
          return false;
        }

        var length = s.length;

        if (length < 9 /* "__proto__".length */) {
            return false;
          }

        if (s.charCodeAt(length - 1) !== 95 /* '_' */ || s.charCodeAt(length - 2) !== 95 /* '_' */ || s.charCodeAt(length - 3) !== 111 /* 'o' */ || s.charCodeAt(length - 4) !== 116 /* 't' */ || s.charCodeAt(length - 5) !== 111 /* 'o' */ || s.charCodeAt(length - 6) !== 114 /* 'r' */ || s.charCodeAt(length - 7) !== 112 /* 'p' */ || s.charCodeAt(length - 8) !== 95 /* '_' */ || s.charCodeAt(length - 9) !== 95 /* '_' */) {
            return false;
          }

        for (var i = length - 10; i >= 0; i--) {
          if (s.charCodeAt(i) !== 36 /* '$' */) {
              return false;
            }
        }

        return true;
      }

      /**
         * Comparator between two mappings where the original positions are compared.
         *
         * Optionally pass in `true` as `onlyCompareGenerated` to consider two
         * mappings with the same original source/line/column, but different generated
         * line and column the same. Useful when searching for a mapping with a
         * stubbed out mapping.
         */
      function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
        var cmp = mappingA.source - mappingB.source;
        if (cmp !== 0) {
          return cmp;
        }

        cmp = mappingA.originalLine - mappingB.originalLine;
        if (cmp !== 0) {
          return cmp;
        }

        cmp = mappingA.originalColumn - mappingB.originalColumn;
        if (cmp !== 0 || onlyCompareOriginal) {
          return cmp;
        }

        cmp = mappingA.generatedColumn - mappingB.generatedColumn;
        if (cmp !== 0) {
          return cmp;
        }

        cmp = mappingA.generatedLine - mappingB.generatedLine;
        if (cmp !== 0) {
          return cmp;
        }

        return mappingA.name - mappingB.name;
      }
      exports.compareByOriginalPositions = compareByOriginalPositions;

      /**
                                                                        * Comparator between two mappings with deflated source and name indices where
                                                                        * the generated positions are compared.
                                                                        *
                                                                        * Optionally pass in `true` as `onlyCompareGenerated` to consider two
                                                                        * mappings with the same generated line and column, but different
                                                                        * source/name/original line and column the same. Useful when searching for a
                                                                        * mapping with a stubbed out mapping.
                                                                        */
      function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
        var cmp = mappingA.generatedLine - mappingB.generatedLine;
        if (cmp !== 0) {
          return cmp;
        }

        cmp = mappingA.generatedColumn - mappingB.generatedColumn;
        if (cmp !== 0 || onlyCompareGenerated) {
          return cmp;
        }

        cmp = mappingA.source - mappingB.source;
        if (cmp !== 0) {
          return cmp;
        }

        cmp = mappingA.originalLine - mappingB.originalLine;
        if (cmp !== 0) {
          return cmp;
        }

        cmp = mappingA.originalColumn - mappingB.originalColumn;
        if (cmp !== 0) {
          return cmp;
        }

        return mappingA.name - mappingB.name;
      }
      exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;

      function strcmp(aStr1, aStr2) {
        if (aStr1 === aStr2) {
          return 0;
        }

        if (aStr1 > aStr2) {
          return 1;
        }

        return -1;
      }

      /**
         * Comparator between two mappings with inflated source and name strings where
         * the generated positions are compared.
         */
      function compareByGeneratedPositionsInflated(mappingA, mappingB) {
        var cmp = mappingA.generatedLine - mappingB.generatedLine;
        if (cmp !== 0) {
          return cmp;
        }

        cmp = mappingA.generatedColumn - mappingB.generatedColumn;
        if (cmp !== 0) {
          return cmp;
        }

        cmp = strcmp(mappingA.source, mappingB.source);
        if (cmp !== 0) {
          return cmp;
        }

        cmp = mappingA.originalLine - mappingB.originalLine;
        if (cmp !== 0) {
          return cmp;
        }

        cmp = mappingA.originalColumn - mappingB.originalColumn;
        if (cmp !== 0) {
          return cmp;
        }

        return strcmp(mappingA.name, mappingB.name);
      }
      exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;

      /***/},
    /* 1 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";


      Object.defineProperty(exports, "__esModule", {
        value: true });

      exports.shrinkStacktrace = shrinkStacktrace;

      var _sourcemappedStacktrace = __webpack_require__(8);

      /*
                                                            * ATTENTION: Enable sourcemaps in Chrome!!
                                                            * ATTENTION: Use "devtool: '#eval-source-map'" for webpack
                                                            */
      function shrinkStacktrace() {
        var blackList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : /node_modules\/zliq/;
        var whiteList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : /.*/;

        return function (error) {
          try {
            // map stacktrace with source maps
            (0, _sourcemappedStacktrace.mapStackTrace)(error.stack, function (mappedStack) {
              var filteredStack = mappedStack.filter(function (line) {
                // we check the sourcemapped frames for filenames blacklisted / whitelisted
                return blackList.test(line) ? false : whiteList.test(line);
              }
              // the resolved path does not match the correct path to the file in Chrome
              // here we fix this path
              );var fixedWebpackPathStack = filteredStack.map(function (line) {
                var webpackPrefix = 'webpack:///';
                if (line.indexOf(webpackPrefix) !== -1) {
                  return line.replace(webpackPrefix, webpackPrefix + './');
                }
                return line;
              });
              console.error('ZLIQ (stripped stacktrace):', error.message + '\n' + fixedWebpackPathStack.join('\n'));
            });
          } catch (e) {
            console.error('ZLIQ (failed to process error):', e);
          }

          // disable native error output
          return true;
        };
      }

      /***/},
    /* 2 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";


      /* -*- Mode: js; js-indent-level: 2; -*- */
      /*
                                                   * Copyright 2011 Mozilla Foundation and contributors
                                                   * Licensed under the New BSD license. See LICENSE or:
                                                   * http://opensource.org/licenses/BSD-3-Clause
                                                   */

      var util = __webpack_require__(0);
      var has = Object.prototype.hasOwnProperty;

      /**
                                                  * A data structure which is a combination of an array and a set. Adding a new
                                                  * member is O(1), testing for membership is O(1), and finding the index of an
                                                  * element is O(1). Removing elements from the set is not supported. Only
                                                  * strings are supported for membership.
                                                  */
      function ArraySet() {
        this._array = [];
        this._set = Object.create(null);
      }

      /**
         * Static method for creating ArraySet instances from an existing array.
         */
      ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
        var set = new ArraySet();
        for (var i = 0, len = aArray.length; i < len; i++) {
          set.add(aArray[i], aAllowDuplicates);
        }
        return set;
      };

      /**
          * Return how many unique items are in this ArraySet. If duplicates have been
          * added, than those do not count towards the size.
          *
          * @returns Number
          */
      ArraySet.prototype.size = function ArraySet_size() {
        return Object.getOwnPropertyNames(this._set).length;
      };

      /**
          * Add the given string to this set.
          *
          * @param String aStr
          */
      ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
        var sStr = util.toSetString(aStr);
        var isDuplicate = has.call(this._set, sStr);
        var idx = this._array.length;
        if (!isDuplicate || aAllowDuplicates) {
          this._array.push(aStr);
        }
        if (!isDuplicate) {
          this._set[sStr] = idx;
        }
      };

      /**
          * Is the given string a member of this set?
          *
          * @param String aStr
          */
      ArraySet.prototype.has = function ArraySet_has(aStr) {
        var sStr = util.toSetString(aStr);
        return has.call(this._set, sStr);
      };

      /**
          * What is the index of the given string in the array?
          *
          * @param String aStr
          */
      ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
        var sStr = util.toSetString(aStr);
        if (has.call(this._set, sStr)) {
          return this._set[sStr];
        }
        throw new Error('"' + aStr + '" is not in the set.');
      };

      /**
          * What is the element at the given index?
          *
          * @param Number aIdx
          */
      ArraySet.prototype.at = function ArraySet_at(aIdx) {
        if (aIdx >= 0 && aIdx < this._array.length) {
          return this._array[aIdx];
        }
        throw new Error('No element indexed by ' + aIdx);
      };

      /**
          * Returns the array representation of this set (which has the proper indices
          * indicated by indexOf). Note that this is a copy of the internal array used
          * for storing the members so that no one can mess with internal state.
          */
      ArraySet.prototype.toArray = function ArraySet_toArray() {
        return this._array.slice();
      };

      exports.ArraySet = ArraySet;

      /***/},
    /* 3 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";


      /* -*- Mode: js; js-indent-level: 2; -*- */
      /*
                                                   * Copyright 2011 Mozilla Foundation and contributors
                                                   * Licensed under the New BSD license. See LICENSE or:
                                                   * http://opensource.org/licenses/BSD-3-Clause
                                                   *
                                                   * Based on the Base 64 VLQ implementation in Closure Compiler:
                                                   * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
                                                   *
                                                   * Copyright 2011 The Closure Compiler Authors. All rights reserved.
                                                   * Redistribution and use in source and binary forms, with or without
                                                   * modification, are permitted provided that the following conditions are
                                                   * met:
                                                   *
                                                   *  * Redistributions of source code must retain the above copyright
                                                   *    notice, this list of conditions and the following disclaimer.
                                                   *  * Redistributions in binary form must reproduce the above
                                                   *    copyright notice, this list of conditions and the following
                                                   *    disclaimer in the documentation and/or other materials provided
                                                   *    with the distribution.
                                                   *  * Neither the name of Google Inc. nor the names of its
                                                   *    contributors may be used to endorse or promote products derived
                                                   *    from this software without specific prior written permission.
                                                   *
                                                   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
                                                   * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
                                                   * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
                                                   * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
                                                   * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
                                                   * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
                                                   * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
                                                   * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
                                                   * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
                                                   * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
                                                   * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
                                                   */

      var base64 = __webpack_require__(4);

      // A single base 64 digit can contain 6 bits of data. For the base 64 variable
      // length quantities we use in the source map spec, the first bit is the sign,
      // the next four bits are the actual value, and the 6th bit is the
      // continuation bit. The continuation bit tells us whether there are more
      // digits in this value following this digit.
      //
      //   Continuation
      //   |    Sign
      //   |    |
      //   V    V
      //   101011

      var VLQ_BASE_SHIFT = 5;

      // binary: 100000
      var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

      // binary: 011111
      var VLQ_BASE_MASK = VLQ_BASE - 1;

      // binary: 100000
      var VLQ_CONTINUATION_BIT = VLQ_BASE;

      /**
                                            * Converts from a two-complement value to a value where the sign bit is
                                            * placed in the least significant bit.  For example, as decimals:
                                            *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
                                            *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
                                            */
      function toVLQSigned(aValue) {
        return aValue < 0 ? (-aValue << 1) + 1 : (aValue << 1) + 0;
      }

      /**
         * Converts to a two-complement value from a value where the sign bit is
         * placed in the least significant bit.  For example, as decimals:
         *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
         *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
         */
      function fromVLQSigned(aValue) {
        var isNegative = (aValue & 1) === 1;
        var shifted = aValue >> 1;
        return isNegative ? -shifted : shifted;
      }

      /**
         * Returns the base 64 VLQ encoded value.
         */
      exports.encode = function base64VLQ_encode(aValue) {
        var encoded = "";
        var digit;

        var vlq = toVLQSigned(aValue);

        do {
          digit = vlq & VLQ_BASE_MASK;
          vlq >>>= VLQ_BASE_SHIFT;
          if (vlq > 0) {
            // There are still more digits in this value, so we must make sure the
            // continuation bit is marked.
            digit |= VLQ_CONTINUATION_BIT;
          }
          encoded += base64.encode(digit);
        } while (vlq > 0);

        return encoded;
      };

      /**
          * Decodes the next base 64 VLQ value from the given string and returns the
          * value and the rest of the string via the out parameter.
          */
      exports.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
        var strLen = aStr.length;
        var result = 0;
        var shift = 0;
        var continuation, digit;

        do {
          if (aIndex >= strLen) {
            throw new Error("Expected more digits in base 64 VLQ value.");
          }

          digit = base64.decode(aStr.charCodeAt(aIndex++));
          if (digit === -1) {
            throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
          }

          continuation = !!(digit & VLQ_CONTINUATION_BIT);
          digit &= VLQ_BASE_MASK;
          result = result + (digit << shift);
          shift += VLQ_BASE_SHIFT;
        } while (continuation);

        aOutParam.value = fromVLQSigned(result);
        aOutParam.rest = aIndex;
      };

      /***/},
    /* 4 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";


      /* -*- Mode: js; js-indent-level: 2; -*- */
      /*
                                                   * Copyright 2011 Mozilla Foundation and contributors
                                                   * Licensed under the New BSD license. See LICENSE or:
                                                   * http://opensource.org/licenses/BSD-3-Clause
                                                   */

      var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

      /**
                                                                                                        * Encode an integer in the range of 0 to 63 to a single base 64 digit.
                                                                                                        */
      exports.encode = function (number) {
        if (0 <= number && number < intToCharMap.length) {
          return intToCharMap[number];
        }
        throw new TypeError("Must be between 0 and 63: " + number);
      };

      /**
          * Decode a single base 64 character code digit to an integer. Returns -1 on
          * failure.
          */
      exports.decode = function (charCode) {
        var bigA = 65; // 'A'
        var bigZ = 90; // 'Z'

        var littleA = 97; // 'a'
        var littleZ = 122; // 'z'

        var zero = 48; // '0'
        var nine = 57; // '9'

        var plus = 43; // '+'
        var slash = 47; // '/'

        var littleOffset = 26;
        var numberOffset = 52;

        // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
        if (bigA <= charCode && charCode <= bigZ) {
          return charCode - bigA;
        }

        // 26 - 51: abcdefghijklmnopqrstuvwxyz
        if (littleA <= charCode && charCode <= littleZ) {
          return charCode - littleA + littleOffset;
        }

        // 52 - 61: 0123456789
        if (zero <= charCode && charCode <= nine) {
          return charCode - zero + numberOffset;
        }

        // 62: +
        if (charCode == plus) {
          return 62;
        }

        // 63: /
        if (charCode == slash) {
          return 63;
        }

        // Invalid base64 digit.
        return -1;
      };

      /***/},
    /* 5 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";


      /* -*- Mode: js; js-indent-level: 2; -*- */
      /*
                                                   * Copyright 2011 Mozilla Foundation and contributors
                                                   * Licensed under the New BSD license. See LICENSE or:
                                                   * http://opensource.org/licenses/BSD-3-Clause
                                                   */

      exports.GREATEST_LOWER_BOUND = 1;
      exports.LEAST_UPPER_BOUND = 2;

      /**
                                      * Recursive implementation of binary search.
                                      *
                                      * @param aLow Indices here and lower do not contain the needle.
                                      * @param aHigh Indices here and higher do not contain the needle.
                                      * @param aNeedle The element being searched for.
                                      * @param aHaystack The non-empty array being searched.
                                      * @param aCompare Function which takes two elements and returns -1, 0, or 1.
                                      * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
                                      *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
                                      *     closest element that is smaller than or greater than the one we are
                                      *     searching for, respectively, if the exact element cannot be found.
                                      */
      function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
        // This function terminates when one of the following is true:
        //
        //   1. We find the exact element we are looking for.
        //
        //   2. We did not find the exact element, but we can return the index of
        //      the next-closest element.
        //
        //   3. We did not find the exact element, and there is no next-closest
        //      element than the one we are searching for, so we return -1.
        var mid = Math.floor((aHigh - aLow) / 2) + aLow;
        var cmp = aCompare(aNeedle, aHaystack[mid], true);
        if (cmp === 0) {
          // Found the element we are looking for.
          return mid;
        } else if (cmp > 0) {
          // Our needle is greater than aHaystack[mid].
          if (aHigh - mid > 1) {
            // The element is in the upper half.
            return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
          }

          // The exact needle element was not found in this haystack. Determine if
          // we are in termination case (3) or (2) and return the appropriate thing.
          if (aBias == exports.LEAST_UPPER_BOUND) {
            return aHigh < aHaystack.length ? aHigh : -1;
          } else {
            return mid;
          }
        } else {
          // Our needle is less than aHaystack[mid].
          if (mid - aLow > 1) {
            // The element is in the lower half.
            return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
          }

          // we are in termination case (3) or (2) and return the appropriate thing.
          if (aBias == exports.LEAST_UPPER_BOUND) {
            return mid;
          } else {
            return aLow < 0 ? -1 : aLow;
          }
        }
      }

      /**
         * This is an implementation of binary search which will always try and return
         * the index of the closest element if there is no exact hit. This is because
         * mappings between original and generated line/col pairs are single points,
         * and there is an implicit region between each of them, so a miss just means
         * that you aren't on the very start of a region.
         *
         * @param aNeedle The element you are looking for.
         * @param aHaystack The array that is being searched.
         * @param aCompare A function which takes the needle and an element in the
         *     array and returns -1, 0, or 1 depending on whether the needle is less
         *     than, equal to, or greater than the element, respectively.
         * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
         *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
         *     closest element that is smaller than or greater than the one we are
         *     searching for, respectively, if the exact element cannot be found.
         *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
         */
      exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
        if (aHaystack.length === 0) {
          return -1;
        }

        var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack, aCompare, aBias || exports.GREATEST_LOWER_BOUND);
        if (index < 0) {
          return -1;
        }

        // We have found either the exact element, or the next-closest element than
        // the one we are searching for. However, there may be more than one such
        // element. Make sure we always return the smallest of these.
        while (index - 1 >= 0) {
          if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
            break;
          }
          --index;
        }

        return index;
      };

      /***/},
    /* 6 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";


      /* -*- Mode: js; js-indent-level: 2; -*- */
      /*
                                                   * Copyright 2011 Mozilla Foundation and contributors
                                                   * Licensed under the New BSD license. See LICENSE or:
                                                   * http://opensource.org/licenses/BSD-3-Clause
                                                   */

      // It turns out that some (most?) JavaScript engines don't self-host
      // `Array.prototype.sort`. This makes sense because C++ will likely remain
      // faster than JS when doing raw CPU-intensive sorting. However, when using a
      // custom comparator function, calling back and forth between the VM's C++ and
      // JIT'd JS is rather slow *and* loses JIT type information, resulting in
      // worse generated code for the comparator function than would be optimal. In
      // fact, when sorting with a comparator, these costs outweigh the benefits of
      // sorting in C++. By using our own JS-implemented Quick Sort (below), we get
      // a ~3500ms mean speed-up in `bench/bench.html`.

      /**
       * Swap the elements indexed by `x` and `y` in the array `ary`.
       *
       * @param {Array} ary
       *        The array.
       * @param {Number} x
       *        The index of the first item.
       * @param {Number} y
       *        The index of the second item.
       */
      function swap(ary, x, y) {
        var temp = ary[x];
        ary[x] = ary[y];
        ary[y] = temp;
      }

      /**
         * Returns a random integer within the range `low .. high` inclusive.
         *
         * @param {Number} low
         *        The lower bound on the range.
         * @param {Number} high
         *        The upper bound on the range.
         */
      function randomIntInRange(low, high) {
        return Math.round(low + Math.random() * (high - low));
      }

      /**
         * The Quick Sort algorithm.
         *
         * @param {Array} ary
         *        An array to sort.
         * @param {function} comparator
         *        Function to use to compare two items.
         * @param {Number} p
         *        Start index of the array
         * @param {Number} r
         *        End index of the array
         */
      function doQuickSort(ary, comparator, p, r) {
        // If our lower bound is less than our upper bound, we (1) partition the
        // array into two pieces and (2) recurse on each half. If it is not, this is
        // the empty array and our base case.

        if (p < r) {
          // (1) Partitioning.
          //
          // The partitioning chooses a pivot between `p` and `r` and moves all
          // elements that are less than or equal to the pivot to the before it, and
          // all the elements that are greater than it after it. The effect is that
          // once partition is done, the pivot is in the exact place it will be when
          // the array is put in sorted order, and it will not need to be moved
          // again. This runs in O(n) time.

          // Always choose a random pivot so that an input array which is reverse
          // sorted does not cause O(n^2) running time.
          var pivotIndex = randomIntInRange(p, r);
          var i = p - 1;

          swap(ary, pivotIndex, r);
          var pivot = ary[r];

          // Immediately after `j` is incremented in this loop, the following hold
          // true:
          //
          //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
          //
          //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
          for (var j = p; j < r; j++) {
            if (comparator(ary[j], pivot) <= 0) {
              i += 1;
              swap(ary, i, j);
            }
          }

          swap(ary, i + 1, j);
          var q = i + 1;

          // (2) Recurse on each half.

          doQuickSort(ary, comparator, p, q - 1);
          doQuickSort(ary, comparator, q + 1, r);
        }
      }

      /**
         * Sort the given array in-place with the given comparator function.
         *
         * @param {Array} ary
         *        An array to sort.
         * @param {function} comparator
         *        Function to use to compare two items.
         */
      exports.quickSort = function (ary, comparator) {
        doQuickSort(ary, comparator, 0, ary.length - 1);
      };

      /***/},
    /* 7 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";


      /* -*- Mode: js; js-indent-level: 2; -*- */
      /*
                                                   * Copyright 2011 Mozilla Foundation and contributors
                                                   * Licensed under the New BSD license. See LICENSE or:
                                                   * http://opensource.org/licenses/BSD-3-Clause
                                                   */

      var util = __webpack_require__(0);
      var binarySearch = __webpack_require__(5);
      var ArraySet = __webpack_require__(2).ArraySet;
      var base64VLQ = __webpack_require__(3);
      var quickSort = __webpack_require__(6).quickSort;

      function SourceMapConsumer(aSourceMap) {
        var sourceMap = aSourceMap;
        if (typeof aSourceMap === 'string') {
          sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
        }

        return sourceMap.sections != null ? new IndexedSourceMapConsumer(sourceMap) : new BasicSourceMapConsumer(sourceMap);
      }

      SourceMapConsumer.fromSourceMap = function (aSourceMap) {
        return BasicSourceMapConsumer.fromSourceMap(aSourceMap);
      };

      /**
          * The version of the source mapping spec that we are consuming.
          */
      SourceMapConsumer.prototype._version = 3;

      // `__generatedMappings` and `__originalMappings` are arrays that hold the
      // parsed mapping coordinates from the source map's "mappings" attribute. They
      // are lazily instantiated, accessed via the `_generatedMappings` and
      // `_originalMappings` getters respectively, and we only parse the mappings
      // and create these arrays once queried for a source location. We jump through
      // these hoops because there can be many thousands of mappings, and parsing
      // them is expensive, so we only want to do it if we must.
      //
      // Each object in the arrays is of the form:
      //
      //     {
      //       generatedLine: The line number in the generated code,
      //       generatedColumn: The column number in the generated code,
      //       source: The path to the original source file that generated this
      //               chunk of code,
      //       originalLine: The line number in the original source that
      //                     corresponds to this chunk of generated code,
      //       originalColumn: The column number in the original source that
      //                       corresponds to this chunk of generated code,
      //       name: The name of the original symbol which generated this chunk of
      //             code.
      //     }
      //
      // All properties except for `generatedLine` and `generatedColumn` can be
      // `null`.
      //
      // `_generatedMappings` is ordered by the generated positions.
      //
      // `_originalMappings` is ordered by the original positions.

      SourceMapConsumer.prototype.__generatedMappings = null;
      Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
        get: function get() {
          if (!this.__generatedMappings) {
            this._parseMappings(this._mappings, this.sourceRoot);
          }

          return this.__generatedMappings;
        } });


      SourceMapConsumer.prototype.__originalMappings = null;
      Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
        get: function get() {
          if (!this.__originalMappings) {
            this._parseMappings(this._mappings, this.sourceRoot);
          }

          return this.__originalMappings;
        } });


      SourceMapConsumer.prototype._charIsMappingSeparator = function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
        var c = aStr.charAt(index);
        return c === ";" || c === ",";
      };

      /**
          * Parse the mappings in a string in to a data structure which we can easily
          * query (the ordered arrays in the `this.__generatedMappings` and
          * `this.__originalMappings` properties).
          */
      SourceMapConsumer.prototype._parseMappings = function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
        throw new Error("Subclasses must implement _parseMappings");
      };

      SourceMapConsumer.GENERATED_ORDER = 1;
      SourceMapConsumer.ORIGINAL_ORDER = 2;

      SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
      SourceMapConsumer.LEAST_UPPER_BOUND = 2;

      /**
                                                * Iterate over each mapping between an original source/line/column and a
                                                * generated line/column in this source map.
                                                *
                                                * @param Function aCallback
                                                *        The function that is called with each mapping.
                                                * @param Object aContext
                                                *        Optional. If specified, this object will be the value of `this` every
                                                *        time that `aCallback` is called.
                                                * @param aOrder
                                                *        Either `SourceMapConsumer.GENERATED_ORDER` or
                                                *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
                                                *        iterate over the mappings sorted by the generated file's line/column
                                                *        order or the original's source/line/column order, respectively. Defaults to
                                                *        `SourceMapConsumer.GENERATED_ORDER`.
                                                */
      SourceMapConsumer.prototype.eachMapping = function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
        var context = aContext || null;
        var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

        var mappings;
        switch (order) {
          case SourceMapConsumer.GENERATED_ORDER:
            mappings = this._generatedMappings;
            break;
          case SourceMapConsumer.ORIGINAL_ORDER:
            mappings = this._originalMappings;
            break;
          default:
            throw new Error("Unknown order of iteration.");}


        var sourceRoot = this.sourceRoot;
        mappings.map(function (mapping) {
          var source = mapping.source === null ? null : this._sources.at(mapping.source);
          if (source != null && sourceRoot != null) {
            source = util.join(sourceRoot, source);
          }
          return {
            source: source,
            generatedLine: mapping.generatedLine,
            generatedColumn: mapping.generatedColumn,
            originalLine: mapping.originalLine,
            originalColumn: mapping.originalColumn,
            name: mapping.name === null ? null : this._names.at(mapping.name) };

        }, this).forEach(aCallback, context);
      };

      /**
          * Returns all generated line and column information for the original source,
          * line, and column provided. If no column is provided, returns all mappings
          * corresponding to a either the line we are searching for or the next
          * closest line that has any mappings. Otherwise, returns all mappings
          * corresponding to the given line and either the column we are searching for
          * or the next closest column that has any offsets.
          *
          * The only argument is an object with the following properties:
          *
          *   - source: The filename of the original source.
          *   - line: The line number in the original source.
          *   - column: Optional. the column number in the original source.
          *
          * and an array of objects is returned, each with the following properties:
          *
          *   - line: The line number in the generated source, or null.
          *   - column: The column number in the generated source, or null.
          */
      SourceMapConsumer.prototype.allGeneratedPositionsFor = function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
        var line = util.getArg(aArgs, 'line');

        // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
        // returns the index of the closest mapping less than the needle. By
        // setting needle.originalColumn to 0, we thus find the last mapping for
        // the given line, provided such a mapping exists.
        var needle = {
          source: util.getArg(aArgs, 'source'),
          originalLine: line,
          originalColumn: util.getArg(aArgs, 'column', 0) };


        if (this.sourceRoot != null) {
          needle.source = util.relative(this.sourceRoot, needle.source);
        }
        if (!this._sources.has(needle.source)) {
          return [];
        }
        needle.source = this._sources.indexOf(needle.source);

        var mappings = [];

        var index = this._findMapping(needle, this._originalMappings, "originalLine", "originalColumn", util.compareByOriginalPositions, binarySearch.LEAST_UPPER_BOUND);
        if (index >= 0) {
          var mapping = this._originalMappings[index];

          if (aArgs.column === undefined) {
            var originalLine = mapping.originalLine;

            // Iterate until either we run out of mappings, or we run into
            // a mapping for a different line than the one we found. Since
            // mappings are sorted, this is guaranteed to find all mappings for
            // the line we found.
            while (mapping && mapping.originalLine === originalLine) {
              mappings.push({
                line: util.getArg(mapping, 'generatedLine', null),
                column: util.getArg(mapping, 'generatedColumn', null),
                lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null) });


              mapping = this._originalMappings[++index];
            }
          } else {
            var originalColumn = mapping.originalColumn;

            // Iterate until either we run out of mappings, or we run into
            // a mapping for a different line than the one we were searching for.
            // Since mappings are sorted, this is guaranteed to find all mappings for
            // the line we are searching for.
            while (mapping && mapping.originalLine === line && mapping.originalColumn == originalColumn) {
              mappings.push({
                line: util.getArg(mapping, 'generatedLine', null),
                column: util.getArg(mapping, 'generatedColumn', null),
                lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null) });


              mapping = this._originalMappings[++index];
            }
          }
        }

        return mappings;
      };

      exports.SourceMapConsumer = SourceMapConsumer;

      /**
                                                      * A BasicSourceMapConsumer instance represents a parsed source map which we can
                                                      * query for information about the original file positions by giving it a file
                                                      * position in the generated source.
                                                      *
                                                      * The only parameter is the raw source map (either as a JSON string, or
                                                      * already parsed to an object). According to the spec, source maps have the
                                                      * following attributes:
                                                      *
                                                      *   - version: Which version of the source map spec this map is following.
                                                      *   - sources: An array of URLs to the original source files.
                                                      *   - names: An array of identifiers which can be referrenced by individual mappings.
                                                      *   - sourceRoot: Optional. The URL root from which all sources are relative.
                                                      *   - sourcesContent: Optional. An array of contents of the original source files.
                                                      *   - mappings: A string of base64 VLQs which contain the actual mappings.
                                                      *   - file: Optional. The generated file this source map is associated with.
                                                      *
                                                      * Here is an example source map, taken from the source map spec[0]:
                                                      *
                                                      *     {
                                                      *       version : 3,
                                                      *       file: "out.js",
                                                      *       sourceRoot : "",
                                                      *       sources: ["foo.js", "bar.js"],
                                                      *       names: ["src", "maps", "are", "fun"],
                                                      *       mappings: "AA,AB;;ABCDE;"
                                                      *     }
                                                      *
                                                      * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
                                                      */
      function BasicSourceMapConsumer(aSourceMap) {
        var sourceMap = aSourceMap;
        if (typeof aSourceMap === 'string') {
          sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
        }

        var version = util.getArg(sourceMap, 'version');
        var sources = util.getArg(sourceMap, 'sources');
        // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
        // requires the array) to play nice here.
        var names = util.getArg(sourceMap, 'names', []);
        var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
        var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
        var mappings = util.getArg(sourceMap, 'mappings');
        var file = util.getArg(sourceMap, 'file', null);

        // Once again, Sass deviates from the spec and supplies the version as a
        // string rather than a number, so we use loose equality checking here.
        if (version != this._version) {
          throw new Error('Unsupported version: ' + version);
        }

        sources = sources.map(String
        // Some source maps produce relative source paths like "./foo.js" instead of
        // "foo.js".  Normalize these first so that future comparisons will succeed.
        // See bugzil.la/1090768.
        ).map(util.normalize
        // Always ensure that absolute sources are internally stored relative to
        // the source root, if the source root is absolute. Not doing this would
        // be particularly problematic when the source root is a prefix of the
        // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
        ).map(function (source) {
          return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source) ? util.relative(sourceRoot, source) : source;
        });

        // Pass `true` below to allow duplicate names and sources. While source maps
        // are intended to be compressed and deduplicated, the TypeScript compiler
        // sometimes generates source maps with duplicates in them. See Github issue
        // #72 and bugzil.la/889492.
        this._names = ArraySet.fromArray(names.map(String), true);
        this._sources = ArraySet.fromArray(sources, true);

        this.sourceRoot = sourceRoot;
        this.sourcesContent = sourcesContent;
        this._mappings = mappings;
        this.file = file;
      }

      BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
      BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;

      /**
                                                                      * Create a BasicSourceMapConsumer from a SourceMapGenerator.
                                                                      *
                                                                      * @param SourceMapGenerator aSourceMap
                                                                      *        The source map that will be consumed.
                                                                      * @returns BasicSourceMapConsumer
                                                                      */
      BasicSourceMapConsumer.fromSourceMap = function SourceMapConsumer_fromSourceMap(aSourceMap) {
        var smc = Object.create(BasicSourceMapConsumer.prototype);

        var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
        var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
        smc.sourceRoot = aSourceMap._sourceRoot;
        smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(), smc.sourceRoot);
        smc.file = aSourceMap._file;

        // Because we are modifying the entries (by converting string sources and
        // names to indices into the sources and names ArraySets), we have to make
        // a copy of the entry or else bad things happen. Shared mutable state
        // strikes again! See github issue #191.

        var generatedMappings = aSourceMap._mappings.toArray().slice();
        var destGeneratedMappings = smc.__generatedMappings = [];
        var destOriginalMappings = smc.__originalMappings = [];

        for (var i = 0, length = generatedMappings.length; i < length; i++) {
          var srcMapping = generatedMappings[i];
          var destMapping = new Mapping();
          destMapping.generatedLine = srcMapping.generatedLine;
          destMapping.generatedColumn = srcMapping.generatedColumn;

          if (srcMapping.source) {
            destMapping.source = sources.indexOf(srcMapping.source);
            destMapping.originalLine = srcMapping.originalLine;
            destMapping.originalColumn = srcMapping.originalColumn;

            if (srcMapping.name) {
              destMapping.name = names.indexOf(srcMapping.name);
            }

            destOriginalMappings.push(destMapping);
          }

          destGeneratedMappings.push(destMapping);
        }

        quickSort(smc.__originalMappings, util.compareByOriginalPositions);

        return smc;
      };

      /**
          * The version of the source mapping spec that we are consuming.
          */
      BasicSourceMapConsumer.prototype._version = 3;

      /**
                                                      * The list of original sources.
                                                      */
      Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
        get: function get() {
          return this._sources.toArray().map(function (s) {
            return this.sourceRoot != null ? util.join(this.sourceRoot, s) : s;
          }, this);
        } });


      /**
               * Provide the JIT with a nice shape / hidden class.
               */
      function Mapping() {
        this.generatedLine = 0;
        this.generatedColumn = 0;
        this.source = null;
        this.originalLine = null;
        this.originalColumn = null;
        this.name = null;
      }

      /**
         * Parse the mappings in a string in to a data structure which we can easily
         * query (the ordered arrays in the `this.__generatedMappings` and
         * `this.__originalMappings` properties).
         */
      BasicSourceMapConsumer.prototype._parseMappings = function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
        var generatedLine = 1;
        var previousGeneratedColumn = 0;
        var previousOriginalLine = 0;
        var previousOriginalColumn = 0;
        var previousSource = 0;
        var previousName = 0;
        var length = aStr.length;
        var index = 0;
        var cachedSegments = {};
        var temp = {};
        var originalMappings = [];
        var generatedMappings = [];
        var mapping, str, segment, end, value;

        while (index < length) {
          if (aStr.charAt(index) === ';') {
            generatedLine++;
            index++;
            previousGeneratedColumn = 0;
          } else if (aStr.charAt(index) === ',') {
            index++;
          } else {
            mapping = new Mapping();
            mapping.generatedLine = generatedLine;

            // Because each offset is encoded relative to the previous one,
            // many segments often have the same encoding. We can exploit this
            // fact by caching the parsed variable length fields of each segment,
            // allowing us to avoid a second parse if we encounter the same
            // segment again.
            for (end = index; end < length; end++) {
              if (this._charIsMappingSeparator(aStr, end)) {
                break;
              }
            }
            str = aStr.slice(index, end);

            segment = cachedSegments[str];
            if (segment) {
              index += str.length;
            } else {
              segment = [];
              while (index < end) {
                base64VLQ.decode(aStr, index, temp);
                value = temp.value;
                index = temp.rest;
                segment.push(value);
              }

              if (segment.length === 2) {
                throw new Error('Found a source, but no line and column');
              }

              if (segment.length === 3) {
                throw new Error('Found a source and line, but no column');
              }

              cachedSegments[str] = segment;
            }

            // Generated column.
            mapping.generatedColumn = previousGeneratedColumn + segment[0];
            previousGeneratedColumn = mapping.generatedColumn;

            if (segment.length > 1) {
              // Original source.
              mapping.source = previousSource + segment[1];
              previousSource += segment[1];

              // Original line.
              mapping.originalLine = previousOriginalLine + segment[2];
              previousOriginalLine = mapping.originalLine;
              // Lines are stored 0-based
              mapping.originalLine += 1;

              // Original column.
              mapping.originalColumn = previousOriginalColumn + segment[3];
              previousOriginalColumn = mapping.originalColumn;

              if (segment.length > 4) {
                // Original name.
                mapping.name = previousName + segment[4];
                previousName += segment[4];
              }
            }

            generatedMappings.push(mapping);
            if (typeof mapping.originalLine === 'number') {
              originalMappings.push(mapping);
            }
          }
        }

        quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
        this.__generatedMappings = generatedMappings;

        quickSort(originalMappings, util.compareByOriginalPositions);
        this.__originalMappings = originalMappings;
      };

      /**
          * Find the mapping that best matches the hypothetical "needle" mapping that
          * we are searching for in the given "haystack" of mappings.
          */
      BasicSourceMapConsumer.prototype._findMapping = function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName, aColumnName, aComparator, aBias) {
        // To return the position we are searching for, we must first find the
        // mapping for the given position and then return the opposite position it
        // points to. Because the mappings are sorted, we can use binary search to
        // find the best mapping.

        if (aNeedle[aLineName] <= 0) {
          throw new TypeError('Line must be greater than or equal to 1, got ' + aNeedle[aLineName]);
        }
        if (aNeedle[aColumnName] < 0) {
          throw new TypeError('Column must be greater than or equal to 0, got ' + aNeedle[aColumnName]);
        }

        return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
      };

      /**
          * Compute the last column for each generated mapping. The last column is
          * inclusive.
          */
      BasicSourceMapConsumer.prototype.computeColumnSpans = function SourceMapConsumer_computeColumnSpans() {
        for (var index = 0; index < this._generatedMappings.length; ++index) {
          var mapping = this._generatedMappings[index];

          // Mappings do not contain a field for the last generated columnt. We
          // can come up with an optimistic estimate, however, by assuming that
          // mappings are contiguous (i.e. given two consecutive mappings, the
          // first mapping ends where the second one starts).
          if (index + 1 < this._generatedMappings.length) {
            var nextMapping = this._generatedMappings[index + 1];

            if (mapping.generatedLine === nextMapping.generatedLine) {
              mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
              continue;
            }
          }

          // The last mapping for each line spans the entire line.
          mapping.lastGeneratedColumn = Infinity;
        }
      };

      /**
          * Returns the original source, line, and column information for the generated
          * source's line and column positions provided. The only argument is an object
          * with the following properties:
          *
          *   - line: The line number in the generated source.
          *   - column: The column number in the generated source.
          *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
          *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
          *     closest element that is smaller than or greater than the one we are
          *     searching for, respectively, if the exact element cannot be found.
          *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
          *
          * and an object is returned with the following properties:
          *
          *   - source: The original source file, or null.
          *   - line: The line number in the original source, or null.
          *   - column: The column number in the original source, or null.
          *   - name: The original identifier, or null.
          */
      BasicSourceMapConsumer.prototype.originalPositionFor = function SourceMapConsumer_originalPositionFor(aArgs) {
        var needle = {
          generatedLine: util.getArg(aArgs, 'line'),
          generatedColumn: util.getArg(aArgs, 'column') };


        var index = this._findMapping(needle, this._generatedMappings, "generatedLine", "generatedColumn", util.compareByGeneratedPositionsDeflated, util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND));

        if (index >= 0) {
          var mapping = this._generatedMappings[index];

          if (mapping.generatedLine === needle.generatedLine) {
            var source = util.getArg(mapping, 'source', null);
            if (source !== null) {
              source = this._sources.at(source);
              if (this.sourceRoot != null) {
                source = util.join(this.sourceRoot, source);
              }
            }
            var name = util.getArg(mapping, 'name', null);
            if (name !== null) {
              name = this._names.at(name);
            }
            return {
              source: source,
              line: util.getArg(mapping, 'originalLine', null),
              column: util.getArg(mapping, 'originalColumn', null),
              name: name };

          }
        }

        return {
          source: null,
          line: null,
          column: null,
          name: null };

      };

      /**
          * Return true if we have the source content for every source in the source
          * map, false otherwise.
          */
      BasicSourceMapConsumer.prototype.hasContentsOfAllSources = function BasicSourceMapConsumer_hasContentsOfAllSources() {
        if (!this.sourcesContent) {
          return false;
        }
        return this.sourcesContent.length >= this._sources.size() && !this.sourcesContent.some(function (sc) {
          return sc == null;
        });
      };

      /**
          * Returns the original source content. The only argument is the url of the
          * original source file. Returns null if no original source content is
          * available.
          */
      BasicSourceMapConsumer.prototype.sourceContentFor = function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
        if (!this.sourcesContent) {
          return null;
        }

        if (this.sourceRoot != null) {
          aSource = util.relative(this.sourceRoot, aSource);
        }

        if (this._sources.has(aSource)) {
          return this.sourcesContent[this._sources.indexOf(aSource)];
        }

        var url;
        if (this.sourceRoot != null && (url = util.urlParse(this.sourceRoot))) {
          // XXX: file:// URIs and absolute paths lead to unexpected behavior for
          // many users. We can help them out when they expect file:// URIs to
          // behave like it would if they were running a local HTTP server. See
          // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
          var fileUriAbsPath = aSource.replace(/^file:\/\//, "");
          if (url.scheme == "file" && this._sources.has(fileUriAbsPath)) {
            return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)];
          }

          if ((!url.path || url.path == "/") && this._sources.has("/" + aSource)) {
            return this.sourcesContent[this._sources.indexOf("/" + aSource)];
          }
        }

        // This function is used recursively from
        // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
        // don't want to throw if we can't find the source - we just want to
        // return null, so we provide a flag to exit gracefully.
        if (nullOnMissing) {
          return null;
        } else {
          throw new Error('"' + aSource + '" is not in the SourceMap.');
        }
      };

      /**
          * Returns the generated line and column information for the original source,
          * line, and column positions provided. The only argument is an object with
          * the following properties:
          *
          *   - source: The filename of the original source.
          *   - line: The line number in the original source.
          *   - column: The column number in the original source.
          *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
          *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
          *     closest element that is smaller than or greater than the one we are
          *     searching for, respectively, if the exact element cannot be found.
          *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
          *
          * and an object is returned with the following properties:
          *
          *   - line: The line number in the generated source, or null.
          *   - column: The column number in the generated source, or null.
          */
      BasicSourceMapConsumer.prototype.generatedPositionFor = function SourceMapConsumer_generatedPositionFor(aArgs) {
        var source = util.getArg(aArgs, 'source');
        if (this.sourceRoot != null) {
          source = util.relative(this.sourceRoot, source);
        }
        if (!this._sources.has(source)) {
          return {
            line: null,
            column: null,
            lastColumn: null };

        }
        source = this._sources.indexOf(source);

        var needle = {
          source: source,
          originalLine: util.getArg(aArgs, 'line'),
          originalColumn: util.getArg(aArgs, 'column') };


        var index = this._findMapping(needle, this._originalMappings, "originalLine", "originalColumn", util.compareByOriginalPositions, util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND));

        if (index >= 0) {
          var mapping = this._originalMappings[index];

          if (mapping.source === needle.source) {
            return {
              line: util.getArg(mapping, 'generatedLine', null),
              column: util.getArg(mapping, 'generatedColumn', null),
              lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null) };

          }
        }

        return {
          line: null,
          column: null,
          lastColumn: null };

      };

      exports.BasicSourceMapConsumer = BasicSourceMapConsumer;

      /**
                                                                * An IndexedSourceMapConsumer instance represents a parsed source map which
                                                                * we can query for information. It differs from BasicSourceMapConsumer in
                                                                * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
                                                                * input.
                                                                *
                                                                * The only parameter is a raw source map (either as a JSON string, or already
                                                                * parsed to an object). According to the spec for indexed source maps, they
                                                                * have the following attributes:
                                                                *
                                                                *   - version: Which version of the source map spec this map is following.
                                                                *   - file: Optional. The generated file this source map is associated with.
                                                                *   - sections: A list of section definitions.
                                                                *
                                                                * Each value under the "sections" field has two fields:
                                                                *   - offset: The offset into the original specified at which this section
                                                                *       begins to apply, defined as an object with a "line" and "column"
                                                                *       field.
                                                                *   - map: A source map definition. This source map could also be indexed,
                                                                *       but doesn't have to be.
                                                                *
                                                                * Instead of the "map" field, it's also possible to have a "url" field
                                                                * specifying a URL to retrieve a source map from, but that's currently
                                                                * unsupported.
                                                                *
                                                                * Here's an example source map, taken from the source map spec[0], but
                                                                * modified to omit a section which uses the "url" field.
                                                                *
                                                                *  {
                                                                *    version : 3,
                                                                *    file: "app.js",
                                                                *    sections: [{
                                                                *      offset: {line:100, column:10},
                                                                *      map: {
                                                                *        version : 3,
                                                                *        file: "section.js",
                                                                *        sources: ["foo.js", "bar.js"],
                                                                *        names: ["src", "maps", "are", "fun"],
                                                                *        mappings: "AAAA,E;;ABCDE;"
                                                                *      }
                                                                *    }],
                                                                *  }
                                                                *
                                                                * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
                                                                */
      function IndexedSourceMapConsumer(aSourceMap) {
        var sourceMap = aSourceMap;
        if (typeof aSourceMap === 'string') {
          sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
        }

        var version = util.getArg(sourceMap, 'version');
        var sections = util.getArg(sourceMap, 'sections');

        if (version != this._version) {
          throw new Error('Unsupported version: ' + version);
        }

        this._sources = new ArraySet();
        this._names = new ArraySet();

        var lastOffset = {
          line: -1,
          column: 0 };

        this._sections = sections.map(function (s) {
          if (s.url) {
            // The url field will require support for asynchronicity.
            // See https://github.com/mozilla/source-map/issues/16
            throw new Error('Support for url field in sections not implemented.');
          }
          var offset = util.getArg(s, 'offset');
          var offsetLine = util.getArg(offset, 'line');
          var offsetColumn = util.getArg(offset, 'column');

          if (offsetLine < lastOffset.line || offsetLine === lastOffset.line && offsetColumn < lastOffset.column) {
            throw new Error('Section offsets must be ordered and non-overlapping.');
          }
          lastOffset = offset;

          return {
            generatedOffset: {
              // The offset fields are 0-based, but we use 1-based indices when
              // encoding/decoding from VLQ.
              generatedLine: offsetLine + 1,
              generatedColumn: offsetColumn + 1 },

            consumer: new SourceMapConsumer(util.getArg(s, 'map')) };

        });
      }

      IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
      IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;

      /**
                                                                           * The version of the source mapping spec that we are consuming.
                                                                           */
      IndexedSourceMapConsumer.prototype._version = 3;

      /**
                                                        * The list of original sources.
                                                        */
      Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
        get: function get() {
          var sources = [];
          for (var i = 0; i < this._sections.length; i++) {
            for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
              sources.push(this._sections[i].consumer.sources[j]);
            }
          }
          return sources;
        } });


      /**
               * Returns the original source, line, and column information for the generated
               * source's line and column positions provided. The only argument is an object
               * with the following properties:
               *
               *   - line: The line number in the generated source.
               *   - column: The column number in the generated source.
               *
               * and an object is returned with the following properties:
               *
               *   - source: The original source file, or null.
               *   - line: The line number in the original source, or null.
               *   - column: The column number in the original source, or null.
               *   - name: The original identifier, or null.
               */
      IndexedSourceMapConsumer.prototype.originalPositionFor = function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
        var needle = {
          generatedLine: util.getArg(aArgs, 'line'),
          generatedColumn: util.getArg(aArgs, 'column') };


        // Find the section containing the generated position we're trying to map
        // to an original position.
        var sectionIndex = binarySearch.search(needle, this._sections, function (needle, section) {
          var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
          if (cmp) {
            return cmp;
          }

          return needle.generatedColumn - section.generatedOffset.generatedColumn;
        });
        var section = this._sections[sectionIndex];

        if (!section) {
          return {
            source: null,
            line: null,
            column: null,
            name: null };

        }

        return section.consumer.originalPositionFor({
          line: needle.generatedLine - (section.generatedOffset.generatedLine - 1),
          column: needle.generatedColumn - (section.generatedOffset.generatedLine === needle.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
          bias: aArgs.bias });

      };

      /**
          * Return true if we have the source content for every source in the source
          * map, false otherwise.
          */
      IndexedSourceMapConsumer.prototype.hasContentsOfAllSources = function IndexedSourceMapConsumer_hasContentsOfAllSources() {
        return this._sections.every(function (s) {
          return s.consumer.hasContentsOfAllSources();
        });
      };

      /**
          * Returns the original source content. The only argument is the url of the
          * original source file. Returns null if no original source content is
          * available.
          */
      IndexedSourceMapConsumer.prototype.sourceContentFor = function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
        for (var i = 0; i < this._sections.length; i++) {
          var section = this._sections[i];

          var content = section.consumer.sourceContentFor(aSource, true);
          if (content) {
            return content;
          }
        }
        if (nullOnMissing) {
          return null;
        } else {
          throw new Error('"' + aSource + '" is not in the SourceMap.');
        }
      };

      /**
          * Returns the generated line and column information for the original source,
          * line, and column positions provided. The only argument is an object with
          * the following properties:
          *
          *   - source: The filename of the original source.
          *   - line: The line number in the original source.
          *   - column: The column number in the original source.
          *
          * and an object is returned with the following properties:
          *
          *   - line: The line number in the generated source, or null.
          *   - column: The column number in the generated source, or null.
          */
      IndexedSourceMapConsumer.prototype.generatedPositionFor = function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
        for (var i = 0; i < this._sections.length; i++) {
          var section = this._sections[i];

          // Only consider this section if the requested source is in the list of
          // sources of the consumer.
          if (section.consumer.sources.indexOf(util.getArg(aArgs, 'source')) === -1) {
            continue;
          }
          var generatedPosition = section.consumer.generatedPositionFor(aArgs);
          if (generatedPosition) {
            var ret = {
              line: generatedPosition.line + (section.generatedOffset.generatedLine - 1),
              column: generatedPosition.column + (section.generatedOffset.generatedLine === generatedPosition.line ? section.generatedOffset.generatedColumn - 1 : 0) };

            return ret;
          }
        }

        return {
          line: null,
          column: null };

      };

      /**
          * Parse the mappings in a string in to a data structure which we can easily
          * query (the ordered arrays in the `this.__generatedMappings` and
          * `this.__originalMappings` properties).
          */
      IndexedSourceMapConsumer.prototype._parseMappings = function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
        this.__generatedMappings = [];
        this.__originalMappings = [];
        for (var i = 0; i < this._sections.length; i++) {
          var section = this._sections[i];
          var sectionMappings = section.consumer._generatedMappings;
          for (var j = 0; j < sectionMappings.length; j++) {
            var mapping = sectionMappings[j];

            var source = section.consumer._sources.at(mapping.source);
            if (section.consumer.sourceRoot !== null) {
              source = util.join(section.consumer.sourceRoot, source);
            }
            this._sources.add(source);
            source = this._sources.indexOf(source);

            var name = section.consumer._names.at(mapping.name);
            this._names.add(name);
            name = this._names.indexOf(name);

            // The mappings coming from the consumer for the section have
            // generated positions relative to the start of the section, so we
            // need to offset them to be relative to the start of the concatenated
            // generated file.
            var adjustedMapping = {
              source: source,
              generatedLine: mapping.generatedLine + (section.generatedOffset.generatedLine - 1),
              generatedColumn: mapping.generatedColumn + (section.generatedOffset.generatedLine === mapping.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
              originalLine: mapping.originalLine,
              originalColumn: mapping.originalColumn,
              name: name };


            this.__generatedMappings.push(adjustedMapping);
            if (typeof adjustedMapping.originalLine === 'number') {
              this.__originalMappings.push(adjustedMapping);
            }
          }
        }

        quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
        quickSort(this.__originalMappings, util.compareByOriginalPositions);
      };

      exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;

      /***/},
    /* 8 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";
      var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

      /*
                                                                        * sourcemapped-stacktrace.js
                                                                        * created by James Salter <iteration@gmail.com> (2014)
                                                                        *
                                                                        * https://github.com/novocaine/sourcemapped-stacktrace
                                                                        *
                                                                        * Licensed under the New BSD license. See LICENSE or:
                                                                        * http://opensource.org/licenses/BSD-3-Clause
                                                                        */

      /*global define */

      // note we only include source-map-consumer, not the whole source-map library,
      // which includes gear for generating source maps that we don't need
      !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(7)], __WEBPACK_AMD_DEFINE_RESULT__ = function (source_map_consumer) {

        var global_mapForUri = {};

        /**
                                    * Re-map entries in a stacktrace using sourcemaps if available.
                                    *
                                    * @param {Array} stack - Array of strings from the browser's stack
                                    *                        representation. Currently only Chrome
                                    *                        format is supported.
                                    * @param {function} done - Callback invoked with the transformed stacktrace
                                    *                          (an Array of Strings) passed as the first
                                    *                          argument
                                    * @param {Object} [opts] - Optional options object.
                                    * @param {Function} [opts.filter] - Filter function applied to each stackTrace line.
                                    *                                   Lines which do not pass the filter won't be processesd.
                                    * @param {boolean} [opts.cacheGlobally] - Whether to cache sourcemaps globally across multiple calls.
                                    */
        var mapStackTrace = function mapStackTrace(stack, done, opts) {
          var lines;
          var line;
          var mapForUri = {};
          var rows = {};
          var fields;
          var uri;
          var expected_fields;
          var regex;
          var skip_lines;

          var fetcher = new Fetcher(function () {
            var result = processSourceMaps(lines, rows, fetcher.mapForUri);
            done(result);
          }, opts);

          if (isChromeOrEdge() || isIE11Plus()) {
            regex = /^ +at.+\((.*):([0-9]+):([0-9]+)/;
            expected_fields = 4;
            // (skip first line containing exception message)
            skip_lines = 1;
          } else if (isFirefox() || isSafari()) {
            regex = /@(.*):([0-9]+):([0-9]+)/;
            expected_fields = 4;
            skip_lines = 0;
          } else {
            throw new Error("unknown browser :(");
          }

          lines = stack.split("\n").slice(skip_lines);

          for (var i = 0; i < lines.length; i++) {
            line = lines[i];
            if (opts && opts.filter && !opts.filter(line)) continue;

            fields = line.match(regex);
            if (fields && fields.length === expected_fields) {
              rows[i] = fields;
              uri = fields[1];
              if (!uri.match(/<anonymous>/)) {
                fetcher.fetchScript(uri);
              }
            }
          }

          // if opts.cacheGlobally set, all maps could have been cached already,
          // thus we need to call done callback right away
          if (fetcher.sem === 0) {
            fetcher.done(fetcher.mapForUri);
          }
        };

        var isChromeOrEdge = function isChromeOrEdge() {
          return navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
        };

        var isFirefox = function isFirefox() {
          return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        };

        var isSafari = function isSafari() {
          return navigator.userAgent.toLowerCase().indexOf('safari') > -1;
        };

        var isIE11Plus = function isIE11Plus() {
          return document.documentMode && document.documentMode >= 11;
        };

        var Fetcher = function Fetcher(done, opts) {
          this.sem = 0;
          this.mapForUri = opts && opts.cacheGlobally ? global_mapForUri : {};
          this.done = done;
        };

        Fetcher.prototype.fetchScript = function (uri) {
          if (!(uri in this.mapForUri)) {
            this.sem++;
            this.mapForUri[uri] = null;
          } else {
            return;
          }

          var xhr = createXMLHTTPObject();
          var that = this;
          xhr.onreadystatechange = function (e) {
            that.onScriptLoad.call(that, e, uri);
          };
          xhr.open("GET", uri, true);
          xhr.send();
        };

        var absUrlRegex = new RegExp('^(?:[a-z]+:)?//', 'i');

        Fetcher.prototype.onScriptLoad = function (e, uri) {
          if (e.target.readyState !== 4) {
            return;
          }

          if (e.target.status === 200 || uri.slice(0, 7) === "file://" && e.target.status === 0) {
            // find .map in file.
            //
            // attempt to find it at the very end of the file, but tolerate trailing
            // whitespace inserted by some packers.
            var match = e.target.responseText.match("//# [s]ourceMappingURL=(.*)[\\s]*$", "m");
            if (match && match.length === 2) {
              // get the map
              var mapUri = match[1];

              var embeddedSourceMap = mapUri.match("data:application/json;(charset=[^;]+;)?base64,(.*)");

              if (embeddedSourceMap && embeddedSourceMap[2]) {
                this.mapForUri[uri] = new source_map_consumer.SourceMapConsumer(atob(embeddedSourceMap[2]));
                this.done(this.mapForUri);
              } else {
                if (!absUrlRegex.test(mapUri)) {
                  // relative url; according to sourcemaps spec is 'source origin'
                  var origin;
                  var lastSlash = uri.lastIndexOf('/');
                  if (lastSlash !== -1) {
                    origin = uri.slice(0, lastSlash + 1);
                    mapUri = origin + mapUri;
                    // note if lastSlash === -1, actual script uri has no slash
                    // somehow, so no way to use it as a prefix... we give up and try
                    // as absolute
                  }
                }

                var xhrMap = createXMLHTTPObject();
                var that = this;
                xhrMap.onreadystatechange = function () {
                  if (xhrMap.readyState === 4) {
                    that.sem--;
                    if (xhrMap.status === 200 || mapUri.slice(0, 7) === "file://" && xhrMap.status === 0) {
                      that.mapForUri[uri] = new source_map_consumer.SourceMapConsumer(xhrMap.responseText);
                    }
                    if (that.sem === 0) {
                      that.done(that.mapForUri);
                    }
                  }
                };

                xhrMap.open("GET", mapUri, true);
                xhrMap.send();
              }
            } else {
              // no map
              this.sem--;
            }
          } else {
            // HTTP error fetching uri of the script
            this.sem--;
          }

          if (this.sem === 0) {
            this.done(this.mapForUri);
          }
        };

        var processSourceMaps = function processSourceMaps(lines, rows, mapForUri) {
          var result = [];
          var map;
          for (var i = 0; i < lines.length; i++) {
            var row = rows[i];
            if (row) {
              var uri = row[1];
              var line = parseInt(row[2], 10);
              var column = parseInt(row[3], 10);
              map = mapForUri[uri];

              if (map) {
                // we think we have a map for that uri. call source-map library
                var origPos = map.originalPositionFor({ line: line, column: column });
                result.push(formatOriginalPosition(origPos.source, origPos.line, origPos.column, origPos.name || origName(lines[i])));
              } else {
                // we can't find a map for that url, but we parsed the row.
                // reformat unchanged line for consistency with the sourcemapped
                // lines.
                result.push(formatOriginalPosition(uri, line, column, origName(lines[i])));
              }
            } else {
              // we weren't able to parse the row, push back what we were given
              result.push(lines[i]);
            }
          }

          return result;
        };

        function origName(origLine) {
          var match = String(origLine).match(isChromeOrEdge() || isIE11Plus() ? / +at +([^ ]*).*/ : /([^@]*)@.*/);
          return match && match[1];
        }

        var formatOriginalPosition = function formatOriginalPosition(source, line, column, name) {
          // mimic chrome's format
          return "    at " + (name ? name : "(unknown)") + " (" + source + ":" + line + ":" + column + ")";
        };

        // xmlhttprequest boilerplate
        var XMLHttpFactories = [function () {
          return new XMLHttpRequest();
        }, function () {
          return new ActiveXObject("Msxml2.XMLHTTP");
        }, function () {
          return new ActiveXObject("Msxml3.XMLHTTP");
        }, function () {
          return new ActiveXObject("Microsoft.XMLHTTP");
        }];

        function createXMLHTTPObject() {
          var xmlhttp = false;
          for (var i = 0; i < XMLHttpFactories.length; i++) {
            try {
              xmlhttp = XMLHttpFactories[i]();
            } catch (e) {
              continue;
            }
            break;
          }
          return xmlhttp;
        }

        return {
          mapStackTrace: mapStackTrace };

      }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
      __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

      /***/},
    /* 9 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";


      Object.defineProperty(exports, "__esModule", {
        value: true });


      var _shrinkStacktrace = __webpack_require__(1);

      Object.keys(_shrinkStacktrace).forEach(function (key) {
        if (key === "default" || key === "__esModule") return;
        Object.defineProperty(exports, key, {
          enumerable: true,
          get: function get() {
            return _shrinkStacktrace[key];
          } });

      });

      /***/}]));

});
//# sourceMappingURL=zliq-stacktrace.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)(module)))

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__(15);


var _src = __webpack_require__(0);


var _subheader = __webpack_require__(3);
var _infos = __webpack_require__(11);
var _header = __webpack_require__(10);
var _tutorial = __webpack_require__(13);
var _playground = __webpack_require__(12);


__webpack_require__(14);


var _zliqStacktrace = __webpack_require__(9);








var _zliqRouter = __webpack_require__(5); //styles
// core
var errorHandler = (0, _zliqStacktrace.shrinkStacktrace)(/(src\/utils|bootstrap|null:null:null|bundle\.js)/); // We can add the error handler whereever we catch an error
// Here we explicitly want the errors in ZLIQ for testing purposes
// window.onerror = (messageOrEvent, source, lineno, colno, error) =>
// 	errorHandler(error)
//plugins
// components
// dependencies
var router$ = (0, _zliqRouter.initRouter)(); // main render function for the application
// render provided hyperscript into a parent element
// zliq passes around HTMLElement elements so you can decide what to do with them
var app = (0, _src.h)('div', null, [(0, _src.h)(_header.Header, null, []), (0, _src.h)('div', { 'class': 'container' }, [(0, _src.h)('a', { href: 'https://github.com/faboweb/zliq' }, [(0, _src.h)('img', { style: 'position: absolute; top: 0; right: 0; border: 0;', src: 'https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67', alt: 'Fork me on GitHub', 'data-canonical-src': 'https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png' }, [])]), (0, _src.h)(_infos.Infos, null, []), (0, _src.h)('div', { 'class': 'section' }, [(0, _src.h)(_subheader.Subheader, { title: 'Motivation', subtitle: 'Why yet another web framework?', id: 'motivation' }, []),

			(0, _src.h)('div', { 'class': 'row' }, [
				(0, _src.h)('p', null, ['Modern web frameworks got really big (React + Redux 139Kb and Angular 2 + Rx 766Kb, ', (0, _src.h)('a', { href: 'https://gist.github.com/Restuta/cda69e50a853aa64912d' }, ['src']), '). As a developer I came into the (un)pleasant situation to teach people how these work. But I couldn\'t really say, as I haven\'t actually understood each line of code in these beasts. But not only that, they also have a lot of structures I as a developer have to learn to get where I want to go. It feels like learning programming again just to be able to render some data.']),
				(0, _src.h)('p', null, ['ZLIQ tries to be something simple. Something that reads in an evening. But that is still so powerful you can just go and display complex UIs with it. Something that feels more JS less Java.']),
				(0, _src.h)('p', null, ['Still ZLIQ doesn\'t try to be the next React or Angular! ZLIQ has a decent render speed even up to several hundred simultaneous updates but it\'s not as fast as ', (0, _src.h)('a', { href: '(https://preactjs.com/' }, ['Preact']), '. And it on purpose does not solve every problem you will ever have. ZLIQ is a tool to help you create the solution that fits your need.'])])]),


		(0, _src.h)(_tutorial.Tutorial, { router$: router$ }, []),
		(0, _src.h)(_playground.Playground, null, [])])]);


(0, _src.render)(app, document.querySelector('#app'), {
	config: {
		value: 'abc',
		url: 'www' } });

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.Output = exports.Markup = undefined;var _prismjs = __webpack_require__(43);var _prismjs2 = _interopRequireDefault(_prismjs);
__webpack_require__(42);
__webpack_require__(47);
var _src = __webpack_require__(0);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var Markup = exports.Markup = function Markup(props, children$) {
    // children are always arrays of arrays to allow children that stream arrays
    var code$ = (0, _src.stream)('');
    setTimeout(function () {
        children$.map(function (children) {
            var code = children[0];
            var strippedMarginCode = code.
            split('\n').
            filter(function (line) {return line.trim() !== '';}).
            map(function (line) {return line.trim().substr(1);}).
            join('\n');
            var html = _prismjs2.default.highlight(strippedMarginCode, _prismjs2.default.languages.jsx);
            return html;
        }).map(code$);
    }, 10);
    return (0, _src.h)('pre', { 'class': 'language-jsx' }, [
        (0, _src.h)('code', { 'class': 'language-jsx', innerHTML: code$ }, [])]);

};

var Output = exports.Output = function Output(props, children) {
    return (0, _src.h)('pre', { 'class': 'example-output' }, [
        children]);

};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.promise$ = undefined;exports.


























if$ = if$;exports.








join$ = join$;var _ = __webpack_require__(6); // wrapper around promises to provide an indicator if the promise is running
var promise$ = exports.promise$ = function promise$(promise) {var output$ = (0, _.stream)({ loading: true, error: null, data: null });promise.then(function (result) {output$.patch({ loading: false, data: result });}, function (error) {output$.patch({ loading: false, error: error });});return output$;}; // provide easy switched on boolean streams
// example use case: <button onclick={()=>open$(!open$())}>{if$(open$, 'Close', 'Open')}</button>
function if$(boolean$) {var onTrue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;var onFalse = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;if (boolean$ === undefined || !(0, _.isStream)(boolean$)) {return (0, _.stream)(boolean$ ? onTrue : onFalse);}return boolean$.map(function (x) {return x ? onTrue : onFalse;});} // join a mixed array of strings and streams of strings
// example use case: <div class={join$('container', if$(open$, 'open', 'closed'))} />
function join$() {for (var _len = arguments.length, $arr = Array(_len), _key = 0; _key < _len; _key++) {$arr[_key] = arguments[_key];}return (0, _.merge$)($arr).map(function (arr) {return arr.join(' ');});}

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.h = undefined;var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();exports.































































flatten = flatten;var _streamy = __webpack_require__(4);var _streamyDom = __webpack_require__(7); /*
                                                                                                  * wrap hyperscript elements in reactive streams dependent on their children streams
                                                                                                  * the hyperscript function returns a constructor so we can pass down globals from the renderer to the components
                                                                                                  */var h = exports.h = function h(tag, props) {for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {children[_key - 2] = arguments[_key];}var elementConstructor = function elementConstructor(globals) {var component = void 0;var version = -1;var constructedChildren = resolveChildren(children, globals);var mergedChildren$ = mergeChildren$(constructedChildren); // jsx usually resolves known tags as strings and unknown tags as functions
		// if it is a function it is treated as a componen and will resolve it
		// props are not automatically resolved
		if (typeof tag === 'function') {return tag(props || {}, mergedChildren$, globals)(globals);}return (0, _streamy.merge$)([wrapProps$(props), mergedChildren$.map(flatten)]).map(function (_ref) {var _ref2 = _slicedToArray(_ref, 2),props = _ref2[0],children = _ref2[1];return { tag: tag, props: props, children: children, version: ++version };});};elementConstructor.IS_ELEMENT_CONSTRUCTOR = true;return elementConstructor;}; /*
                                                                                                                                                                                                                                                                                                                                                                                                                                        * wrap all children in streams and merge those
                                                                                                                                                                                                                                                                                                                                                                                                                                        * we make sure that all children streams are flat arrays to make processing uniform
                                                                                                                                                                                                                                                                                                                                                                                                                                        * input: [stream]
                                                                                                                                                                                                                                                                                                                                                                                                                                        * output: stream([])
                                                                                                                                                                                                                                                                                                                                                                                                                                        */function mergeChildren$(children) {if (!Array.isArray(children)) {children = [children];}children = flatten(children).filter(function (_) {return _ !== null;});var childrenVdom$arr = children.map(function (child) {if ((0, _streamy.isStream)(child)) {return child.flatMap(mergeChildren$);}return child;});return (0, _streamy.merge$)(childrenVdom$arr);} // flattens an array
function flatten(array, mutable) {var toString = Object.prototype.toString;var arrayTypeStr = '[object Array]';var result = [];var nodes = mutable && array || array.slice();var node;if (!array.length) {return result;}node = nodes.pop();

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
	var updateStreams = nestedStreams.map(function makeNestedStreamUpdateProps(_ref3) {var parent = _ref3.parent,key = _ref3.key,stream = _ref3.stream;
		return stream.
		distinct()
		// here we produce a sideeffect on the props object -> low GC
		// to trigger the merge we also need to return sth (as undefined does not trigger listeners)
		.map(function (value) {
			parent[key] = value;
			return value;
		});
	});
	return (0, _streamy.merge$)(updateStreams).map(function (_) {return props;});
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
				stream: obj[key] }];

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
		return child.map(function (x) {return resolveChildren(x, globals);});
	}
}

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.

testRender = testRender;exports.























test$ = test$;var _src = __webpack_require__(0);function testRender(vdom$, schedule, done) {var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { attach: false, debounce: 0, globals: {} };var container = document.createElement('div');if (options.attach) {document.body.appendChild(container);} // enable to just define the expected html in the render schedule
    schedule = schedule.map(function (fn) {if (typeof fn === 'string') {return function (_ref) {var element = _ref.element;return expect(element.outerHTML).toBe(fn);};}return fn;});return test$((0, _src.render)(vdom$, container, options.globals, options.debounce), schedule, done);}function test$(stream, schedule, done) {return stream.reduce(function (iteration, value) {
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
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, ".big-header, img, h3 {\n  transition: all 0.5s; }\n\n.big-header {\n  padding-top: 2rem;\n  cursor: pointer; }\n  .big-header h1 {\n    font-family: 'Rubik Mono One', sans-serif;\n    font-size: 10rem; }\n  .big-header img {\n    height: 17rem; }\n  @media all and (max-width: 569px) {\n    .big-header h1 {\n      font-size: 6rem; }\n    .big-header img {\n      height: 10rem; }\n    .big-header h3 {\n      font-size: 1.8rem; } }\n\n.link-list {\n  padding-top: 2rem;\n  padding-bottom: 1rem; }\n  .link-list a {\n    color: #188C71;\n    padding: 0 1rem;\n    line-height: 2rem;\n    font-weight: bold;\n    display: inline-block; }\n  @media all and (max-width: 569px) {\n    .link-list {\n      display: none; } }\n\n.hidden {\n  position: fixed;\n  z-index: 100;\n  padding: 0;\n  width: 100%; }\n  .hidden * {\n    margin-top: 0;\n    margin-bottom: 0; }\n  .hidden h3, .hidden img {\n    height: 0;\n    overflow: hidden; }\n  .hidden + .container {\n    padding-top: 37rem; }\n    @media all and (max-width: 569px) {\n      .hidden + .container {\n        padding-top: 30rem; } }\n  .hidden.big-header h1 {\n    font-size: 4rem; }\n  .hidden .link-list {\n    padding-top: 0.5rem;\n    padding-bottom: 0.5rem; }\n", ""]);

// exports


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "iframe {\n  height: 270px; }\n", ""]);

// exports


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "body {\n  margin-bottom: 4rem; }\n\n.anchor {\n  visibility: hidden;\n  position: relative;\n  top: -8rem; }\n\n.highlight {\n  color: #07684F !important; }\n\n.highlight-less {\n  color: #188C71 !important; }\n\n.highlight-background {\n  background-color: #FBD9BC !important; }\n\n.caption {\n  margin-bottom: 10px; }\n\npre {\n  padding-top: 2rem !important;\n  background-color: initial !important;\n  border-color: #FBD9BC; }\n  pre:before {\n    background: #FBD9BC !important;\n    color: #07684F !important; }\n", ""]);

// exports


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, ".tutorial h6 {\n  text-decoration: underline;\n  margin-top: 3rem; }\n", ""]);

// exports


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, ".materialize-red {\n  background-color: #e51c23 !important; }\n\n.materialize-red-text {\n  color: #e51c23 !important; }\n\n.materialize-red.lighten-5 {\n  background-color: #fdeaeb !important; }\n\n.materialize-red-text.text-lighten-5 {\n  color: #fdeaeb !important; }\n\n.materialize-red.lighten-4 {\n  background-color: #f8c1c3 !important; }\n\n.materialize-red-text.text-lighten-4 {\n  color: #f8c1c3 !important; }\n\n.materialize-red.lighten-3 {\n  background-color: #f3989b !important; }\n\n.materialize-red-text.text-lighten-3 {\n  color: #f3989b !important; }\n\n.materialize-red.lighten-2 {\n  background-color: #ee6e73 !important; }\n\n.materialize-red-text.text-lighten-2 {\n  color: #ee6e73 !important; }\n\n.materialize-red.lighten-1 {\n  background-color: #ea454b !important; }\n\n.materialize-red-text.text-lighten-1 {\n  color: #ea454b !important; }\n\n.materialize-red.darken-1 {\n  background-color: #d0181e !important; }\n\n.materialize-red-text.text-darken-1 {\n  color: #d0181e !important; }\n\n.materialize-red.darken-2 {\n  background-color: #b9151b !important; }\n\n.materialize-red-text.text-darken-2 {\n  color: #b9151b !important; }\n\n.materialize-red.darken-3 {\n  background-color: #a21318 !important; }\n\n.materialize-red-text.text-darken-3 {\n  color: #a21318 !important; }\n\n.materialize-red.darken-4 {\n  background-color: #8b1014 !important; }\n\n.materialize-red-text.text-darken-4 {\n  color: #8b1014 !important; }\n\n.red {\n  background-color: #F44336 !important; }\n\n.red-text {\n  color: #F44336 !important; }\n\n.red.lighten-5 {\n  background-color: #FFEBEE !important; }\n\n.red-text.text-lighten-5 {\n  color: #FFEBEE !important; }\n\n.red.lighten-4 {\n  background-color: #FFCDD2 !important; }\n\n.red-text.text-lighten-4 {\n  color: #FFCDD2 !important; }\n\n.red.lighten-3 {\n  background-color: #EF9A9A !important; }\n\n.red-text.text-lighten-3 {\n  color: #EF9A9A !important; }\n\n.red.lighten-2 {\n  background-color: #E57373 !important; }\n\n.red-text.text-lighten-2 {\n  color: #E57373 !important; }\n\n.red.lighten-1 {\n  background-color: #EF5350 !important; }\n\n.red-text.text-lighten-1 {\n  color: #EF5350 !important; }\n\n.red.darken-1 {\n  background-color: #E53935 !important; }\n\n.red-text.text-darken-1 {\n  color: #E53935 !important; }\n\n.red.darken-2 {\n  background-color: #D32F2F !important; }\n\n.red-text.text-darken-2 {\n  color: #D32F2F !important; }\n\n.red.darken-3 {\n  background-color: #C62828 !important; }\n\n.red-text.text-darken-3 {\n  color: #C62828 !important; }\n\n.red.darken-4 {\n  background-color: #B71C1C !important; }\n\n.red-text.text-darken-4 {\n  color: #B71C1C !important; }\n\n.red.accent-1 {\n  background-color: #FF8A80 !important; }\n\n.red-text.text-accent-1 {\n  color: #FF8A80 !important; }\n\n.red.accent-2 {\n  background-color: #FF5252 !important; }\n\n.red-text.text-accent-2 {\n  color: #FF5252 !important; }\n\n.red.accent-3 {\n  background-color: #FF1744 !important; }\n\n.red-text.text-accent-3 {\n  color: #FF1744 !important; }\n\n.red.accent-4 {\n  background-color: #D50000 !important; }\n\n.red-text.text-accent-4 {\n  color: #D50000 !important; }\n\n.pink {\n  background-color: #e91e63 !important; }\n\n.pink-text {\n  color: #e91e63 !important; }\n\n.pink.lighten-5 {\n  background-color: #fce4ec !important; }\n\n.pink-text.text-lighten-5 {\n  color: #fce4ec !important; }\n\n.pink.lighten-4 {\n  background-color: #f8bbd0 !important; }\n\n.pink-text.text-lighten-4 {\n  color: #f8bbd0 !important; }\n\n.pink.lighten-3 {\n  background-color: #f48fb1 !important; }\n\n.pink-text.text-lighten-3 {\n  color: #f48fb1 !important; }\n\n.pink.lighten-2 {\n  background-color: #f06292 !important; }\n\n.pink-text.text-lighten-2 {\n  color: #f06292 !important; }\n\n.pink.lighten-1 {\n  background-color: #ec407a !important; }\n\n.pink-text.text-lighten-1 {\n  color: #ec407a !important; }\n\n.pink.darken-1 {\n  background-color: #d81b60 !important; }\n\n.pink-text.text-darken-1 {\n  color: #d81b60 !important; }\n\n.pink.darken-2 {\n  background-color: #c2185b !important; }\n\n.pink-text.text-darken-2 {\n  color: #c2185b !important; }\n\n.pink.darken-3 {\n  background-color: #ad1457 !important; }\n\n.pink-text.text-darken-3 {\n  color: #ad1457 !important; }\n\n.pink.darken-4 {\n  background-color: #880e4f !important; }\n\n.pink-text.text-darken-4 {\n  color: #880e4f !important; }\n\n.pink.accent-1 {\n  background-color: #ff80ab !important; }\n\n.pink-text.text-accent-1 {\n  color: #ff80ab !important; }\n\n.pink.accent-2 {\n  background-color: #ff4081 !important; }\n\n.pink-text.text-accent-2 {\n  color: #ff4081 !important; }\n\n.pink.accent-3 {\n  background-color: #f50057 !important; }\n\n.pink-text.text-accent-3 {\n  color: #f50057 !important; }\n\n.pink.accent-4 {\n  background-color: #c51162 !important; }\n\n.pink-text.text-accent-4 {\n  color: #c51162 !important; }\n\n.purple {\n  background-color: #9c27b0 !important; }\n\n.purple-text {\n  color: #9c27b0 !important; }\n\n.purple.lighten-5 {\n  background-color: #f3e5f5 !important; }\n\n.purple-text.text-lighten-5 {\n  color: #f3e5f5 !important; }\n\n.purple.lighten-4 {\n  background-color: #e1bee7 !important; }\n\n.purple-text.text-lighten-4 {\n  color: #e1bee7 !important; }\n\n.purple.lighten-3 {\n  background-color: #ce93d8 !important; }\n\n.purple-text.text-lighten-3 {\n  color: #ce93d8 !important; }\n\n.purple.lighten-2 {\n  background-color: #ba68c8 !important; }\n\n.purple-text.text-lighten-2 {\n  color: #ba68c8 !important; }\n\n.purple.lighten-1 {\n  background-color: #ab47bc !important; }\n\n.purple-text.text-lighten-1 {\n  color: #ab47bc !important; }\n\n.purple.darken-1 {\n  background-color: #8e24aa !important; }\n\n.purple-text.text-darken-1 {\n  color: #8e24aa !important; }\n\n.purple.darken-2 {\n  background-color: #7b1fa2 !important; }\n\n.purple-text.text-darken-2 {\n  color: #7b1fa2 !important; }\n\n.purple.darken-3 {\n  background-color: #6a1b9a !important; }\n\n.purple-text.text-darken-3 {\n  color: #6a1b9a !important; }\n\n.purple.darken-4 {\n  background-color: #4a148c !important; }\n\n.purple-text.text-darken-4 {\n  color: #4a148c !important; }\n\n.purple.accent-1 {\n  background-color: #ea80fc !important; }\n\n.purple-text.text-accent-1 {\n  color: #ea80fc !important; }\n\n.purple.accent-2 {\n  background-color: #e040fb !important; }\n\n.purple-text.text-accent-2 {\n  color: #e040fb !important; }\n\n.purple.accent-3 {\n  background-color: #d500f9 !important; }\n\n.purple-text.text-accent-3 {\n  color: #d500f9 !important; }\n\n.purple.accent-4 {\n  background-color: #a0f !important; }\n\n.purple-text.text-accent-4 {\n  color: #a0f !important; }\n\n.deep-purple {\n  background-color: #673ab7 !important; }\n\n.deep-purple-text {\n  color: #673ab7 !important; }\n\n.deep-purple.lighten-5 {\n  background-color: #ede7f6 !important; }\n\n.deep-purple-text.text-lighten-5 {\n  color: #ede7f6 !important; }\n\n.deep-purple.lighten-4 {\n  background-color: #d1c4e9 !important; }\n\n.deep-purple-text.text-lighten-4 {\n  color: #d1c4e9 !important; }\n\n.deep-purple.lighten-3 {\n  background-color: #b39ddb !important; }\n\n.deep-purple-text.text-lighten-3 {\n  color: #b39ddb !important; }\n\n.deep-purple.lighten-2 {\n  background-color: #9575cd !important; }\n\n.deep-purple-text.text-lighten-2 {\n  color: #9575cd !important; }\n\n.deep-purple.lighten-1 {\n  background-color: #7e57c2 !important; }\n\n.deep-purple-text.text-lighten-1 {\n  color: #7e57c2 !important; }\n\n.deep-purple.darken-1 {\n  background-color: #5e35b1 !important; }\n\n.deep-purple-text.text-darken-1 {\n  color: #5e35b1 !important; }\n\n.deep-purple.darken-2 {\n  background-color: #512da8 !important; }\n\n.deep-purple-text.text-darken-2 {\n  color: #512da8 !important; }\n\n.deep-purple.darken-3 {\n  background-color: #4527a0 !important; }\n\n.deep-purple-text.text-darken-3 {\n  color: #4527a0 !important; }\n\n.deep-purple.darken-4 {\n  background-color: #311b92 !important; }\n\n.deep-purple-text.text-darken-4 {\n  color: #311b92 !important; }\n\n.deep-purple.accent-1 {\n  background-color: #b388ff !important; }\n\n.deep-purple-text.text-accent-1 {\n  color: #b388ff !important; }\n\n.deep-purple.accent-2 {\n  background-color: #7c4dff !important; }\n\n.deep-purple-text.text-accent-2 {\n  color: #7c4dff !important; }\n\n.deep-purple.accent-3 {\n  background-color: #651fff !important; }\n\n.deep-purple-text.text-accent-3 {\n  color: #651fff !important; }\n\n.deep-purple.accent-4 {\n  background-color: #6200ea !important; }\n\n.deep-purple-text.text-accent-4 {\n  color: #6200ea !important; }\n\n.indigo {\n  background-color: #3f51b5 !important; }\n\n.indigo-text {\n  color: #3f51b5 !important; }\n\n.indigo.lighten-5 {\n  background-color: #e8eaf6 !important; }\n\n.indigo-text.text-lighten-5 {\n  color: #e8eaf6 !important; }\n\n.indigo.lighten-4 {\n  background-color: #c5cae9 !important; }\n\n.indigo-text.text-lighten-4 {\n  color: #c5cae9 !important; }\n\n.indigo.lighten-3 {\n  background-color: #9fa8da !important; }\n\n.indigo-text.text-lighten-3 {\n  color: #9fa8da !important; }\n\n.indigo.lighten-2 {\n  background-color: #7986cb !important; }\n\n.indigo-text.text-lighten-2 {\n  color: #7986cb !important; }\n\n.indigo.lighten-1 {\n  background-color: #5c6bc0 !important; }\n\n.indigo-text.text-lighten-1 {\n  color: #5c6bc0 !important; }\n\n.indigo.darken-1 {\n  background-color: #3949ab !important; }\n\n.indigo-text.text-darken-1 {\n  color: #3949ab !important; }\n\n.indigo.darken-2 {\n  background-color: #303f9f !important; }\n\n.indigo-text.text-darken-2 {\n  color: #303f9f !important; }\n\n.indigo.darken-3 {\n  background-color: #283593 !important; }\n\n.indigo-text.text-darken-3 {\n  color: #283593 !important; }\n\n.indigo.darken-4 {\n  background-color: #1a237e !important; }\n\n.indigo-text.text-darken-4 {\n  color: #1a237e !important; }\n\n.indigo.accent-1 {\n  background-color: #8c9eff !important; }\n\n.indigo-text.text-accent-1 {\n  color: #8c9eff !important; }\n\n.indigo.accent-2 {\n  background-color: #536dfe !important; }\n\n.indigo-text.text-accent-2 {\n  color: #536dfe !important; }\n\n.indigo.accent-3 {\n  background-color: #3d5afe !important; }\n\n.indigo-text.text-accent-3 {\n  color: #3d5afe !important; }\n\n.indigo.accent-4 {\n  background-color: #304ffe !important; }\n\n.indigo-text.text-accent-4 {\n  color: #304ffe !important; }\n\n.blue {\n  background-color: #2196F3 !important; }\n\n.blue-text {\n  color: #2196F3 !important; }\n\n.blue.lighten-5 {\n  background-color: #E3F2FD !important; }\n\n.blue-text.text-lighten-5 {\n  color: #E3F2FD !important; }\n\n.blue.lighten-4 {\n  background-color: #BBDEFB !important; }\n\n.blue-text.text-lighten-4 {\n  color: #BBDEFB !important; }\n\n.blue.lighten-3 {\n  background-color: #90CAF9 !important; }\n\n.blue-text.text-lighten-3 {\n  color: #90CAF9 !important; }\n\n.blue.lighten-2 {\n  background-color: #64B5F6 !important; }\n\n.blue-text.text-lighten-2 {\n  color: #64B5F6 !important; }\n\n.blue.lighten-1 {\n  background-color: #42A5F5 !important; }\n\n.blue-text.text-lighten-1 {\n  color: #42A5F5 !important; }\n\n.blue.darken-1 {\n  background-color: #1E88E5 !important; }\n\n.blue-text.text-darken-1 {\n  color: #1E88E5 !important; }\n\n.blue.darken-2 {\n  background-color: #1976D2 !important; }\n\n.blue-text.text-darken-2 {\n  color: #1976D2 !important; }\n\n.blue.darken-3 {\n  background-color: #1565C0 !important; }\n\n.blue-text.text-darken-3 {\n  color: #1565C0 !important; }\n\n.blue.darken-4 {\n  background-color: #0D47A1 !important; }\n\n.blue-text.text-darken-4 {\n  color: #0D47A1 !important; }\n\n.blue.accent-1 {\n  background-color: #82B1FF !important; }\n\n.blue-text.text-accent-1 {\n  color: #82B1FF !important; }\n\n.blue.accent-2 {\n  background-color: #448AFF !important; }\n\n.blue-text.text-accent-2 {\n  color: #448AFF !important; }\n\n.blue.accent-3 {\n  background-color: #2979FF !important; }\n\n.blue-text.text-accent-3 {\n  color: #2979FF !important; }\n\n.blue.accent-4 {\n  background-color: #2962FF !important; }\n\n.blue-text.text-accent-4 {\n  color: #2962FF !important; }\n\n.light-blue {\n  background-color: #03a9f4 !important; }\n\n.light-blue-text {\n  color: #03a9f4 !important; }\n\n.light-blue.lighten-5 {\n  background-color: #e1f5fe !important; }\n\n.light-blue-text.text-lighten-5 {\n  color: #e1f5fe !important; }\n\n.light-blue.lighten-4 {\n  background-color: #b3e5fc !important; }\n\n.light-blue-text.text-lighten-4 {\n  color: #b3e5fc !important; }\n\n.light-blue.lighten-3 {\n  background-color: #81d4fa !important; }\n\n.light-blue-text.text-lighten-3 {\n  color: #81d4fa !important; }\n\n.light-blue.lighten-2 {\n  background-color: #4fc3f7 !important; }\n\n.light-blue-text.text-lighten-2 {\n  color: #4fc3f7 !important; }\n\n.light-blue.lighten-1 {\n  background-color: #29b6f6 !important; }\n\n.light-blue-text.text-lighten-1 {\n  color: #29b6f6 !important; }\n\n.light-blue.darken-1 {\n  background-color: #039be5 !important; }\n\n.light-blue-text.text-darken-1 {\n  color: #039be5 !important; }\n\n.light-blue.darken-2 {\n  background-color: #0288d1 !important; }\n\n.light-blue-text.text-darken-2 {\n  color: #0288d1 !important; }\n\n.light-blue.darken-3 {\n  background-color: #0277bd !important; }\n\n.light-blue-text.text-darken-3 {\n  color: #0277bd !important; }\n\n.light-blue.darken-4 {\n  background-color: #01579b !important; }\n\n.light-blue-text.text-darken-4 {\n  color: #01579b !important; }\n\n.light-blue.accent-1 {\n  background-color: #80d8ff !important; }\n\n.light-blue-text.text-accent-1 {\n  color: #80d8ff !important; }\n\n.light-blue.accent-2 {\n  background-color: #40c4ff !important; }\n\n.light-blue-text.text-accent-2 {\n  color: #40c4ff !important; }\n\n.light-blue.accent-3 {\n  background-color: #00b0ff !important; }\n\n.light-blue-text.text-accent-3 {\n  color: #00b0ff !important; }\n\n.light-blue.accent-4 {\n  background-color: #0091ea !important; }\n\n.light-blue-text.text-accent-4 {\n  color: #0091ea !important; }\n\n.cyan {\n  background-color: #00bcd4 !important; }\n\n.cyan-text {\n  color: #00bcd4 !important; }\n\n.cyan.lighten-5 {\n  background-color: #e0f7fa !important; }\n\n.cyan-text.text-lighten-5 {\n  color: #e0f7fa !important; }\n\n.cyan.lighten-4 {\n  background-color: #b2ebf2 !important; }\n\n.cyan-text.text-lighten-4 {\n  color: #b2ebf2 !important; }\n\n.cyan.lighten-3 {\n  background-color: #80deea !important; }\n\n.cyan-text.text-lighten-3 {\n  color: #80deea !important; }\n\n.cyan.lighten-2 {\n  background-color: #4dd0e1 !important; }\n\n.cyan-text.text-lighten-2 {\n  color: #4dd0e1 !important; }\n\n.cyan.lighten-1 {\n  background-color: #26c6da !important; }\n\n.cyan-text.text-lighten-1 {\n  color: #26c6da !important; }\n\n.cyan.darken-1 {\n  background-color: #00acc1 !important; }\n\n.cyan-text.text-darken-1 {\n  color: #00acc1 !important; }\n\n.cyan.darken-2 {\n  background-color: #0097a7 !important; }\n\n.cyan-text.text-darken-2 {\n  color: #0097a7 !important; }\n\n.cyan.darken-3 {\n  background-color: #00838f !important; }\n\n.cyan-text.text-darken-3 {\n  color: #00838f !important; }\n\n.cyan.darken-4 {\n  background-color: #006064 !important; }\n\n.cyan-text.text-darken-4 {\n  color: #006064 !important; }\n\n.cyan.accent-1 {\n  background-color: #84ffff !important; }\n\n.cyan-text.text-accent-1 {\n  color: #84ffff !important; }\n\n.cyan.accent-2 {\n  background-color: #18ffff !important; }\n\n.cyan-text.text-accent-2 {\n  color: #18ffff !important; }\n\n.cyan.accent-3 {\n  background-color: #00e5ff !important; }\n\n.cyan-text.text-accent-3 {\n  color: #00e5ff !important; }\n\n.cyan.accent-4 {\n  background-color: #00b8d4 !important; }\n\n.cyan-text.text-accent-4 {\n  color: #00b8d4 !important; }\n\n.teal {\n  background-color: #009688 !important; }\n\n.teal-text {\n  color: #009688 !important; }\n\n.teal.lighten-5 {\n  background-color: #e0f2f1 !important; }\n\n.teal-text.text-lighten-5 {\n  color: #e0f2f1 !important; }\n\n.teal.lighten-4 {\n  background-color: #b2dfdb !important; }\n\n.teal-text.text-lighten-4 {\n  color: #b2dfdb !important; }\n\n.teal.lighten-3 {\n  background-color: #80cbc4 !important; }\n\n.teal-text.text-lighten-3 {\n  color: #80cbc4 !important; }\n\n.teal.lighten-2 {\n  background-color: #4db6ac !important; }\n\n.teal-text.text-lighten-2 {\n  color: #4db6ac !important; }\n\n.teal.lighten-1 {\n  background-color: #26a69a !important; }\n\n.teal-text.text-lighten-1 {\n  color: #26a69a !important; }\n\n.teal.darken-1 {\n  background-color: #00897b !important; }\n\n.teal-text.text-darken-1 {\n  color: #00897b !important; }\n\n.teal.darken-2 {\n  background-color: #00796b !important; }\n\n.teal-text.text-darken-2 {\n  color: #00796b !important; }\n\n.teal.darken-3 {\n  background-color: #00695c !important; }\n\n.teal-text.text-darken-3 {\n  color: #00695c !important; }\n\n.teal.darken-4 {\n  background-color: #004d40 !important; }\n\n.teal-text.text-darken-4 {\n  color: #004d40 !important; }\n\n.teal.accent-1 {\n  background-color: #a7ffeb !important; }\n\n.teal-text.text-accent-1 {\n  color: #a7ffeb !important; }\n\n.teal.accent-2 {\n  background-color: #64ffda !important; }\n\n.teal-text.text-accent-2 {\n  color: #64ffda !important; }\n\n.teal.accent-3 {\n  background-color: #1de9b6 !important; }\n\n.teal-text.text-accent-3 {\n  color: #1de9b6 !important; }\n\n.teal.accent-4 {\n  background-color: #00bfa5 !important; }\n\n.teal-text.text-accent-4 {\n  color: #00bfa5 !important; }\n\n.green {\n  background-color: #4CAF50 !important; }\n\n.green-text {\n  color: #4CAF50 !important; }\n\n.green.lighten-5 {\n  background-color: #E8F5E9 !important; }\n\n.green-text.text-lighten-5 {\n  color: #E8F5E9 !important; }\n\n.green.lighten-4 {\n  background-color: #C8E6C9 !important; }\n\n.green-text.text-lighten-4 {\n  color: #C8E6C9 !important; }\n\n.green.lighten-3 {\n  background-color: #A5D6A7 !important; }\n\n.green-text.text-lighten-3 {\n  color: #A5D6A7 !important; }\n\n.green.lighten-2 {\n  background-color: #81C784 !important; }\n\n.green-text.text-lighten-2 {\n  color: #81C784 !important; }\n\n.green.lighten-1 {\n  background-color: #66BB6A !important; }\n\n.green-text.text-lighten-1 {\n  color: #66BB6A !important; }\n\n.green.darken-1 {\n  background-color: #43A047 !important; }\n\n.green-text.text-darken-1 {\n  color: #43A047 !important; }\n\n.green.darken-2 {\n  background-color: #388E3C !important; }\n\n.green-text.text-darken-2 {\n  color: #388E3C !important; }\n\n.green.darken-3 {\n  background-color: #2E7D32 !important; }\n\n.green-text.text-darken-3 {\n  color: #2E7D32 !important; }\n\n.green.darken-4 {\n  background-color: #1B5E20 !important; }\n\n.green-text.text-darken-4 {\n  color: #1B5E20 !important; }\n\n.green.accent-1 {\n  background-color: #B9F6CA !important; }\n\n.green-text.text-accent-1 {\n  color: #B9F6CA !important; }\n\n.green.accent-2 {\n  background-color: #69F0AE !important; }\n\n.green-text.text-accent-2 {\n  color: #69F0AE !important; }\n\n.green.accent-3 {\n  background-color: #00E676 !important; }\n\n.green-text.text-accent-3 {\n  color: #00E676 !important; }\n\n.green.accent-4 {\n  background-color: #00C853 !important; }\n\n.green-text.text-accent-4 {\n  color: #00C853 !important; }\n\n.light-green {\n  background-color: #8bc34a !important; }\n\n.light-green-text {\n  color: #8bc34a !important; }\n\n.light-green.lighten-5 {\n  background-color: #f1f8e9 !important; }\n\n.light-green-text.text-lighten-5 {\n  color: #f1f8e9 !important; }\n\n.light-green.lighten-4 {\n  background-color: #dcedc8 !important; }\n\n.light-green-text.text-lighten-4 {\n  color: #dcedc8 !important; }\n\n.light-green.lighten-3 {\n  background-color: #c5e1a5 !important; }\n\n.light-green-text.text-lighten-3 {\n  color: #c5e1a5 !important; }\n\n.light-green.lighten-2 {\n  background-color: #aed581 !important; }\n\n.light-green-text.text-lighten-2 {\n  color: #aed581 !important; }\n\n.light-green.lighten-1 {\n  background-color: #9ccc65 !important; }\n\n.light-green-text.text-lighten-1 {\n  color: #9ccc65 !important; }\n\n.light-green.darken-1 {\n  background-color: #7cb342 !important; }\n\n.light-green-text.text-darken-1 {\n  color: #7cb342 !important; }\n\n.light-green.darken-2 {\n  background-color: #689f38 !important; }\n\n.light-green-text.text-darken-2 {\n  color: #689f38 !important; }\n\n.light-green.darken-3 {\n  background-color: #558b2f !important; }\n\n.light-green-text.text-darken-3 {\n  color: #558b2f !important; }\n\n.light-green.darken-4 {\n  background-color: #33691e !important; }\n\n.light-green-text.text-darken-4 {\n  color: #33691e !important; }\n\n.light-green.accent-1 {\n  background-color: #ccff90 !important; }\n\n.light-green-text.text-accent-1 {\n  color: #ccff90 !important; }\n\n.light-green.accent-2 {\n  background-color: #b2ff59 !important; }\n\n.light-green-text.text-accent-2 {\n  color: #b2ff59 !important; }\n\n.light-green.accent-3 {\n  background-color: #76ff03 !important; }\n\n.light-green-text.text-accent-3 {\n  color: #76ff03 !important; }\n\n.light-green.accent-4 {\n  background-color: #64dd17 !important; }\n\n.light-green-text.text-accent-4 {\n  color: #64dd17 !important; }\n\n.lime {\n  background-color: #cddc39 !important; }\n\n.lime-text {\n  color: #cddc39 !important; }\n\n.lime.lighten-5 {\n  background-color: #f9fbe7 !important; }\n\n.lime-text.text-lighten-5 {\n  color: #f9fbe7 !important; }\n\n.lime.lighten-4 {\n  background-color: #f0f4c3 !important; }\n\n.lime-text.text-lighten-4 {\n  color: #f0f4c3 !important; }\n\n.lime.lighten-3 {\n  background-color: #e6ee9c !important; }\n\n.lime-text.text-lighten-3 {\n  color: #e6ee9c !important; }\n\n.lime.lighten-2 {\n  background-color: #dce775 !important; }\n\n.lime-text.text-lighten-2 {\n  color: #dce775 !important; }\n\n.lime.lighten-1 {\n  background-color: #d4e157 !important; }\n\n.lime-text.text-lighten-1 {\n  color: #d4e157 !important; }\n\n.lime.darken-1 {\n  background-color: #c0ca33 !important; }\n\n.lime-text.text-darken-1 {\n  color: #c0ca33 !important; }\n\n.lime.darken-2 {\n  background-color: #afb42b !important; }\n\n.lime-text.text-darken-2 {\n  color: #afb42b !important; }\n\n.lime.darken-3 {\n  background-color: #9e9d24 !important; }\n\n.lime-text.text-darken-3 {\n  color: #9e9d24 !important; }\n\n.lime.darken-4 {\n  background-color: #827717 !important; }\n\n.lime-text.text-darken-4 {\n  color: #827717 !important; }\n\n.lime.accent-1 {\n  background-color: #f4ff81 !important; }\n\n.lime-text.text-accent-1 {\n  color: #f4ff81 !important; }\n\n.lime.accent-2 {\n  background-color: #eeff41 !important; }\n\n.lime-text.text-accent-2 {\n  color: #eeff41 !important; }\n\n.lime.accent-3 {\n  background-color: #c6ff00 !important; }\n\n.lime-text.text-accent-3 {\n  color: #c6ff00 !important; }\n\n.lime.accent-4 {\n  background-color: #aeea00 !important; }\n\n.lime-text.text-accent-4 {\n  color: #aeea00 !important; }\n\n.yellow {\n  background-color: #ffeb3b !important; }\n\n.yellow-text {\n  color: #ffeb3b !important; }\n\n.yellow.lighten-5 {\n  background-color: #fffde7 !important; }\n\n.yellow-text.text-lighten-5 {\n  color: #fffde7 !important; }\n\n.yellow.lighten-4 {\n  background-color: #fff9c4 !important; }\n\n.yellow-text.text-lighten-4 {\n  color: #fff9c4 !important; }\n\n.yellow.lighten-3 {\n  background-color: #fff59d !important; }\n\n.yellow-text.text-lighten-3 {\n  color: #fff59d !important; }\n\n.yellow.lighten-2 {\n  background-color: #fff176 !important; }\n\n.yellow-text.text-lighten-2 {\n  color: #fff176 !important; }\n\n.yellow.lighten-1 {\n  background-color: #ffee58 !important; }\n\n.yellow-text.text-lighten-1 {\n  color: #ffee58 !important; }\n\n.yellow.darken-1 {\n  background-color: #fdd835 !important; }\n\n.yellow-text.text-darken-1 {\n  color: #fdd835 !important; }\n\n.yellow.darken-2 {\n  background-color: #fbc02d !important; }\n\n.yellow-text.text-darken-2 {\n  color: #fbc02d !important; }\n\n.yellow.darken-3 {\n  background-color: #f9a825 !important; }\n\n.yellow-text.text-darken-3 {\n  color: #f9a825 !important; }\n\n.yellow.darken-4 {\n  background-color: #f57f17 !important; }\n\n.yellow-text.text-darken-4 {\n  color: #f57f17 !important; }\n\n.yellow.accent-1 {\n  background-color: #ffff8d !important; }\n\n.yellow-text.text-accent-1 {\n  color: #ffff8d !important; }\n\n.yellow.accent-2 {\n  background-color: #ff0 !important; }\n\n.yellow-text.text-accent-2 {\n  color: #ff0 !important; }\n\n.yellow.accent-3 {\n  background-color: #ffea00 !important; }\n\n.yellow-text.text-accent-3 {\n  color: #ffea00 !important; }\n\n.yellow.accent-4 {\n  background-color: #ffd600 !important; }\n\n.yellow-text.text-accent-4 {\n  color: #ffd600 !important; }\n\n.amber {\n  background-color: #ffc107 !important; }\n\n.amber-text {\n  color: #ffc107 !important; }\n\n.amber.lighten-5 {\n  background-color: #fff8e1 !important; }\n\n.amber-text.text-lighten-5 {\n  color: #fff8e1 !important; }\n\n.amber.lighten-4 {\n  background-color: #ffecb3 !important; }\n\n.amber-text.text-lighten-4 {\n  color: #ffecb3 !important; }\n\n.amber.lighten-3 {\n  background-color: #ffe082 !important; }\n\n.amber-text.text-lighten-3 {\n  color: #ffe082 !important; }\n\n.amber.lighten-2 {\n  background-color: #ffd54f !important; }\n\n.amber-text.text-lighten-2 {\n  color: #ffd54f !important; }\n\n.amber.lighten-1 {\n  background-color: #ffca28 !important; }\n\n.amber-text.text-lighten-1 {\n  color: #ffca28 !important; }\n\n.amber.darken-1 {\n  background-color: #ffb300 !important; }\n\n.amber-text.text-darken-1 {\n  color: #ffb300 !important; }\n\n.amber.darken-2 {\n  background-color: #ffa000 !important; }\n\n.amber-text.text-darken-2 {\n  color: #ffa000 !important; }\n\n.amber.darken-3 {\n  background-color: #ff8f00 !important; }\n\n.amber-text.text-darken-3 {\n  color: #ff8f00 !important; }\n\n.amber.darken-4 {\n  background-color: #ff6f00 !important; }\n\n.amber-text.text-darken-4 {\n  color: #ff6f00 !important; }\n\n.amber.accent-1 {\n  background-color: #ffe57f !important; }\n\n.amber-text.text-accent-1 {\n  color: #ffe57f !important; }\n\n.amber.accent-2 {\n  background-color: #ffd740 !important; }\n\n.amber-text.text-accent-2 {\n  color: #ffd740 !important; }\n\n.amber.accent-3 {\n  background-color: #ffc400 !important; }\n\n.amber-text.text-accent-3 {\n  color: #ffc400 !important; }\n\n.amber.accent-4 {\n  background-color: #ffab00 !important; }\n\n.amber-text.text-accent-4 {\n  color: #ffab00 !important; }\n\n.orange {\n  background-color: #ff9800 !important; }\n\n.orange-text {\n  color: #ff9800 !important; }\n\n.orange.lighten-5 {\n  background-color: #fff3e0 !important; }\n\n.orange-text.text-lighten-5 {\n  color: #fff3e0 !important; }\n\n.orange.lighten-4 {\n  background-color: #ffe0b2 !important; }\n\n.orange-text.text-lighten-4 {\n  color: #ffe0b2 !important; }\n\n.orange.lighten-3 {\n  background-color: #ffcc80 !important; }\n\n.orange-text.text-lighten-3 {\n  color: #ffcc80 !important; }\n\n.orange.lighten-2 {\n  background-color: #ffb74d !important; }\n\n.orange-text.text-lighten-2 {\n  color: #ffb74d !important; }\n\n.orange.lighten-1 {\n  background-color: #ffa726 !important; }\n\n.orange-text.text-lighten-1 {\n  color: #ffa726 !important; }\n\n.orange.darken-1 {\n  background-color: #fb8c00 !important; }\n\n.orange-text.text-darken-1 {\n  color: #fb8c00 !important; }\n\n.orange.darken-2 {\n  background-color: #f57c00 !important; }\n\n.orange-text.text-darken-2 {\n  color: #f57c00 !important; }\n\n.orange.darken-3 {\n  background-color: #ef6c00 !important; }\n\n.orange-text.text-darken-3 {\n  color: #ef6c00 !important; }\n\n.orange.darken-4 {\n  background-color: #e65100 !important; }\n\n.orange-text.text-darken-4 {\n  color: #e65100 !important; }\n\n.orange.accent-1 {\n  background-color: #ffd180 !important; }\n\n.orange-text.text-accent-1 {\n  color: #ffd180 !important; }\n\n.orange.accent-2 {\n  background-color: #ffab40 !important; }\n\n.orange-text.text-accent-2 {\n  color: #ffab40 !important; }\n\n.orange.accent-3 {\n  background-color: #ff9100 !important; }\n\n.orange-text.text-accent-3 {\n  color: #ff9100 !important; }\n\n.orange.accent-4 {\n  background-color: #ff6d00 !important; }\n\n.orange-text.text-accent-4 {\n  color: #ff6d00 !important; }\n\n.deep-orange {\n  background-color: #ff5722 !important; }\n\n.deep-orange-text {\n  color: #ff5722 !important; }\n\n.deep-orange.lighten-5 {\n  background-color: #fbe9e7 !important; }\n\n.deep-orange-text.text-lighten-5 {\n  color: #fbe9e7 !important; }\n\n.deep-orange.lighten-4 {\n  background-color: #ffccbc !important; }\n\n.deep-orange-text.text-lighten-4 {\n  color: #ffccbc !important; }\n\n.deep-orange.lighten-3 {\n  background-color: #ffab91 !important; }\n\n.deep-orange-text.text-lighten-3 {\n  color: #ffab91 !important; }\n\n.deep-orange.lighten-2 {\n  background-color: #ff8a65 !important; }\n\n.deep-orange-text.text-lighten-2 {\n  color: #ff8a65 !important; }\n\n.deep-orange.lighten-1 {\n  background-color: #ff7043 !important; }\n\n.deep-orange-text.text-lighten-1 {\n  color: #ff7043 !important; }\n\n.deep-orange.darken-1 {\n  background-color: #f4511e !important; }\n\n.deep-orange-text.text-darken-1 {\n  color: #f4511e !important; }\n\n.deep-orange.darken-2 {\n  background-color: #e64a19 !important; }\n\n.deep-orange-text.text-darken-2 {\n  color: #e64a19 !important; }\n\n.deep-orange.darken-3 {\n  background-color: #d84315 !important; }\n\n.deep-orange-text.text-darken-3 {\n  color: #d84315 !important; }\n\n.deep-orange.darken-4 {\n  background-color: #bf360c !important; }\n\n.deep-orange-text.text-darken-4 {\n  color: #bf360c !important; }\n\n.deep-orange.accent-1 {\n  background-color: #ff9e80 !important; }\n\n.deep-orange-text.text-accent-1 {\n  color: #ff9e80 !important; }\n\n.deep-orange.accent-2 {\n  background-color: #ff6e40 !important; }\n\n.deep-orange-text.text-accent-2 {\n  color: #ff6e40 !important; }\n\n.deep-orange.accent-3 {\n  background-color: #ff3d00 !important; }\n\n.deep-orange-text.text-accent-3 {\n  color: #ff3d00 !important; }\n\n.deep-orange.accent-4 {\n  background-color: #dd2c00 !important; }\n\n.deep-orange-text.text-accent-4 {\n  color: #dd2c00 !important; }\n\n.brown {\n  background-color: #795548 !important; }\n\n.brown-text {\n  color: #795548 !important; }\n\n.brown.lighten-5 {\n  background-color: #efebe9 !important; }\n\n.brown-text.text-lighten-5 {\n  color: #efebe9 !important; }\n\n.brown.lighten-4 {\n  background-color: #d7ccc8 !important; }\n\n.brown-text.text-lighten-4 {\n  color: #d7ccc8 !important; }\n\n.brown.lighten-3 {\n  background-color: #bcaaa4 !important; }\n\n.brown-text.text-lighten-3 {\n  color: #bcaaa4 !important; }\n\n.brown.lighten-2 {\n  background-color: #a1887f !important; }\n\n.brown-text.text-lighten-2 {\n  color: #a1887f !important; }\n\n.brown.lighten-1 {\n  background-color: #8d6e63 !important; }\n\n.brown-text.text-lighten-1 {\n  color: #8d6e63 !important; }\n\n.brown.darken-1 {\n  background-color: #6d4c41 !important; }\n\n.brown-text.text-darken-1 {\n  color: #6d4c41 !important; }\n\n.brown.darken-2 {\n  background-color: #5d4037 !important; }\n\n.brown-text.text-darken-2 {\n  color: #5d4037 !important; }\n\n.brown.darken-3 {\n  background-color: #4e342e !important; }\n\n.brown-text.text-darken-3 {\n  color: #4e342e !important; }\n\n.brown.darken-4 {\n  background-color: #3e2723 !important; }\n\n.brown-text.text-darken-4 {\n  color: #3e2723 !important; }\n\n.blue-grey {\n  background-color: #607d8b !important; }\n\n.blue-grey-text {\n  color: #607d8b !important; }\n\n.blue-grey.lighten-5 {\n  background-color: #eceff1 !important; }\n\n.blue-grey-text.text-lighten-5 {\n  color: #eceff1 !important; }\n\n.blue-grey.lighten-4 {\n  background-color: #cfd8dc !important; }\n\n.blue-grey-text.text-lighten-4 {\n  color: #cfd8dc !important; }\n\n.blue-grey.lighten-3 {\n  background-color: #b0bec5 !important; }\n\n.blue-grey-text.text-lighten-3 {\n  color: #b0bec5 !important; }\n\n.blue-grey.lighten-2 {\n  background-color: #90a4ae !important; }\n\n.blue-grey-text.text-lighten-2 {\n  color: #90a4ae !important; }\n\n.blue-grey.lighten-1 {\n  background-color: #78909c !important; }\n\n.blue-grey-text.text-lighten-1 {\n  color: #78909c !important; }\n\n.blue-grey.darken-1 {\n  background-color: #546e7a !important; }\n\n.blue-grey-text.text-darken-1 {\n  color: #546e7a !important; }\n\n.blue-grey.darken-2 {\n  background-color: #455a64 !important; }\n\n.blue-grey-text.text-darken-2 {\n  color: #455a64 !important; }\n\n.blue-grey.darken-3 {\n  background-color: #37474f !important; }\n\n.blue-grey-text.text-darken-3 {\n  color: #37474f !important; }\n\n.blue-grey.darken-4 {\n  background-color: #263238 !important; }\n\n.blue-grey-text.text-darken-4 {\n  color: #263238 !important; }\n\n.grey {\n  background-color: #9e9e9e !important; }\n\n.grey-text {\n  color: #9e9e9e !important; }\n\n.grey.lighten-5 {\n  background-color: #fafafa !important; }\n\n.grey-text.text-lighten-5 {\n  color: #fafafa !important; }\n\n.grey.lighten-4 {\n  background-color: #f5f5f5 !important; }\n\n.grey-text.text-lighten-4 {\n  color: #f5f5f5 !important; }\n\n.grey.lighten-3 {\n  background-color: #eee !important; }\n\n.grey-text.text-lighten-3 {\n  color: #eee !important; }\n\n.grey.lighten-2 {\n  background-color: #e0e0e0 !important; }\n\n.grey-text.text-lighten-2 {\n  color: #e0e0e0 !important; }\n\n.grey.lighten-1 {\n  background-color: #bdbdbd !important; }\n\n.grey-text.text-lighten-1 {\n  color: #bdbdbd !important; }\n\n.grey.darken-1 {\n  background-color: #757575 !important; }\n\n.grey-text.text-darken-1 {\n  color: #757575 !important; }\n\n.grey.darken-2 {\n  background-color: #616161 !important; }\n\n.grey-text.text-darken-2 {\n  color: #616161 !important; }\n\n.grey.darken-3 {\n  background-color: #424242 !important; }\n\n.grey-text.text-darken-3 {\n  color: #424242 !important; }\n\n.grey.darken-4 {\n  background-color: #212121 !important; }\n\n.grey-text.text-darken-4 {\n  color: #212121 !important; }\n\n.black {\n  background-color: #000 !important; }\n\n.black-text {\n  color: #000 !important; }\n\n.white {\n  background-color: #fff !important; }\n\n.white-text {\n  color: #fff !important; }\n\n.transparent {\n  background-color: transparent !important; }\n\n.transparent-text {\n  color: transparent !important; }\n\n/*! normalize.css v3.0.3 | MIT License | github.com/necolas/normalize.css */\nhtml {\n  font-family: sans-serif;\n  -ms-text-size-adjust: 100%;\n  -webkit-text-size-adjust: 100%; }\n\nbody {\n  margin: 0; }\n\narticle, aside, details, figcaption, figure, footer, header, hgroup, main, menu, nav, section, summary {\n  display: block; }\n\naudio, canvas, progress, video {\n  display: inline-block;\n  vertical-align: baseline; }\n\naudio:not([controls]) {\n  display: none;\n  height: 0; }\n\n[hidden], template {\n  display: none; }\n\na {\n  background-color: transparent; }\n\na:active, a:hover {\n  outline: 0; }\n\nabbr[title] {\n  border-bottom: 1px dotted; }\n\nb, strong {\n  font-weight: bold; }\n\ndfn {\n  font-style: italic; }\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0; }\n\nmark {\n  background: #ff0;\n  color: #000; }\n\nsmall {\n  font-size: 80%; }\n\nsub, sup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline; }\n\nsup {\n  top: -0.5em; }\n\nsub {\n  bottom: -0.25em; }\n\nimg {\n  border: 0; }\n\nsvg:not(:root) {\n  overflow: hidden; }\n\nfigure {\n  margin: 1em 40px; }\n\nhr {\n  box-sizing: content-box;\n  height: 0; }\n\npre {\n  overflow: auto; }\n\ncode, kbd, pre, samp {\n  font-family: monospace, monospace;\n  font-size: 1em; }\n\nbutton, input, optgroup, select, textarea {\n  color: inherit;\n  font: inherit;\n  margin: 0; }\n\nbutton {\n  overflow: visible; }\n\nbutton, select {\n  text-transform: none; }\n\nbutton, html input[type=\"button\"], input[type=\"reset\"], input[type=\"submit\"] {\n  -webkit-appearance: button;\n  cursor: pointer; }\n\nbutton[disabled], html input[disabled] {\n  cursor: default; }\n\nbutton::-moz-focus-inner, input::-moz-focus-inner {\n  border: 0;\n  padding: 0; }\n\ninput {\n  line-height: normal; }\n\ninput[type=\"checkbox\"], input[type=\"radio\"] {\n  box-sizing: border-box;\n  padding: 0; }\n\ninput[type=\"number\"]::-webkit-inner-spin-button, input[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto; }\n\ninput[type=\"search\"] {\n  -webkit-appearance: textfield;\n  box-sizing: content-box; }\n\ninput[type=\"search\"]::-webkit-search-cancel-button, input[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none; }\n\nfieldset {\n  border: 1px solid #c0c0c0;\n  margin: 0 2px;\n  padding: 0.35em 0.625em 0.75em; }\n\nlegend {\n  border: 0;\n  padding: 0; }\n\ntextarea {\n  overflow: auto; }\n\noptgroup {\n  font-weight: bold; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n\ntd, th {\n  padding: 0; }\n\nhtml {\n  box-sizing: border-box; }\n\n*, *:before, *:after {\n  box-sizing: inherit; }\n\nul:not(.browser-default) {\n  padding-left: 0;\n  list-style-type: none; }\n\nul:not(.browser-default) li {\n  list-style-type: none; }\n\na {\n  color: #039be5;\n  text-decoration: none;\n  -webkit-tap-highlight-color: transparent; }\n\n.valign-wrapper, body.themes .themes-section {\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-align-items: center;\n  -ms-flex-align: center;\n  align-items: center; }\n\n.clearfix {\n  clear: both; }\n\n.z-depth-0 {\n  box-shadow: none !important; }\n\n.z-depth-1, nav, .card-panel, .card, .toast, .btn, .btn-large, .btn-floating, .dropdown-content, .collapsible, .side-nav {\n  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2); }\n\n.z-depth-1-half, .btn:hover, .btn-large:hover, .btn-floating:hover {\n  box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14), 0 1px 7px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -1px rgba(0, 0, 0, 0.2); }\n\n.z-depth-2 {\n  box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.3); }\n\n.z-depth-3 {\n  box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.3); }\n\n.z-depth-4, .modal {\n  box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.3); }\n\n.z-depth-5 {\n  box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.3); }\n\n.hoverable {\n  transition: box-shadow .25s;\n  box-shadow: 0; }\n\n.hoverable:hover {\n  transition: box-shadow .25s;\n  box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); }\n\n.divider {\n  height: 1px;\n  overflow: hidden;\n  background-color: #e0e0e0; }\n\nblockquote {\n  margin: 20px 0;\n  padding-left: 1.5rem;\n  border-left: 5px solid #ee6e73; }\n\ni {\n  line-height: inherit; }\n\ni.left {\n  float: left;\n  margin-right: 15px; }\n\ni.right {\n  float: right;\n  margin-left: 15px; }\n\ni.tiny {\n  font-size: 1rem; }\n\ni.small {\n  font-size: 2rem; }\n\ni.medium {\n  font-size: 4rem; }\n\ni.large {\n  font-size: 6rem; }\n\nimg.responsive-img, video.responsive-video {\n  max-width: 100%;\n  height: auto; }\n\n.pagination li {\n  display: inline-block;\n  border-radius: 2px;\n  text-align: center;\n  vertical-align: top;\n  height: 30px; }\n\n.pagination li a {\n  color: #444;\n  display: inline-block;\n  font-size: 1.2rem;\n  padding: 0 10px;\n  line-height: 30px; }\n\n.pagination li.active a {\n  color: #fff; }\n\n.pagination li.active {\n  background-color: #ee6e73; }\n\n.pagination li.disabled a {\n  cursor: default;\n  color: #999; }\n\n.pagination li i {\n  font-size: 2rem; }\n\n.pagination li.pages ul li {\n  display: inline-block;\n  float: none; }\n\n@media only screen and (max-width: 992px) {\n  .pagination {\n    width: 100%; }\n  .pagination li.prev, .pagination li.next {\n    width: 10%; }\n  .pagination li.pages {\n    width: 80%;\n    overflow: hidden;\n    white-space: nowrap; } }\n\n.breadcrumb {\n  font-size: 18px;\n  color: rgba(255, 255, 255, 0.7); }\n\n.breadcrumb i, .breadcrumb [class^=\"mdi-\"], .breadcrumb [class*=\"mdi-\"], .breadcrumb i.material-icons {\n  display: inline-block;\n  float: left;\n  font-size: 24px; }\n\n.breadcrumb:before {\n  content: '\\E5CC';\n  color: rgba(255, 255, 255, 0.7);\n  vertical-align: top;\n  display: inline-block;\n  font-family: 'Material Icons';\n  font-weight: normal;\n  font-style: normal;\n  font-size: 25px;\n  margin: 0 10px 0 8px;\n  -webkit-font-smoothing: antialiased; }\n\n.breadcrumb:first-child:before {\n  display: none; }\n\n.breadcrumb:last-child {\n  color: #fff; }\n\n.parallax-container {\n  position: relative;\n  overflow: hidden;\n  height: 500px; }\n\n.parallax {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: -1; }\n\n.parallax img {\n  display: none;\n  position: absolute;\n  left: 50%;\n  bottom: 0;\n  min-width: 100%;\n  min-height: 100%;\n  -webkit-transform: translate3d(0, 0, 0);\n  transform: translate3d(0, 0, 0);\n  -webkit-transform: translateX(-50%);\n  transform: translateX(-50%); }\n\n.pin-top, .pin-bottom {\n  position: relative; }\n\n.pinned {\n  position: fixed !important; }\n\nul.staggered-list li {\n  opacity: 0; }\n\n.fade-in {\n  opacity: 0;\n  -webkit-transform-origin: 0 50%;\n  transform-origin: 0 50%; }\n\n@media only screen and (max-width: 600px) {\n  .hide-on-small-only, .tabs-wrapper, .hide-on-small-and-down {\n    display: none !important; } }\n\n@media only screen and (max-width: 992px) {\n  .hide-on-med-and-down {\n    display: none !important; } }\n\n@media only screen and (min-width: 601px) {\n  .hide-on-med-and-up {\n    display: none !important; } }\n\n@media only screen and (min-width: 600px) and (max-width: 992px) {\n  .hide-on-med-only {\n    display: none !important; } }\n\n@media only screen and (min-width: 993px) {\n  .hide-on-large-only {\n    display: none !important; } }\n\n@media only screen and (min-width: 993px) {\n  .show-on-large {\n    display: block !important; } }\n\n@media only screen and (min-width: 600px) and (max-width: 992px) {\n  .show-on-medium {\n    display: block !important; } }\n\n@media only screen and (max-width: 600px) {\n  .show-on-small {\n    display: block !important; } }\n\n@media only screen and (min-width: 601px) {\n  .show-on-medium-and-up {\n    display: block !important; } }\n\n@media only screen and (max-width: 992px) {\n  .show-on-medium-and-down {\n    display: block !important; } }\n\n@media only screen and (max-width: 600px) {\n  .center-on-small-only {\n    text-align: center; } }\n\n.page-footer {\n  padding-top: 20px;\n  background-color: #ee6e73; }\n\n.page-footer .footer-copyright {\n  overflow: hidden;\n  min-height: 50px;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-align-items: center;\n  -ms-flex-align: center;\n  align-items: center;\n  padding: 10px 0px;\n  color: rgba(255, 255, 255, 0.8);\n  background-color: rgba(51, 51, 51, 0.08); }\n\ntable, th, td {\n  border: none; }\n\ntable {\n  width: 100%;\n  display: table; }\n\ntable.bordered > thead > tr, table.bordered > tbody > tr {\n  border-bottom: 1px solid #d0d0d0; }\n\ntable.striped > tbody > tr:nth-child(odd) {\n  background-color: #f2f2f2; }\n\ntable.striped > tbody > tr > td {\n  border-radius: 0; }\n\ntable.highlight > tbody > tr {\n  transition: background-color .25s ease; }\n\ntable.highlight > tbody > tr:hover {\n  background-color: #f2f2f2; }\n\ntable.centered thead tr th, table.centered tbody tr td {\n  text-align: center; }\n\nthead {\n  border-bottom: 1px solid #d0d0d0; }\n\ntd, th {\n  padding: 15px 5px;\n  display: table-cell;\n  text-align: left;\n  vertical-align: middle;\n  border-radius: 2px; }\n\n@media only screen and (max-width: 992px) {\n  table.responsive-table {\n    width: 100%;\n    border-collapse: collapse;\n    border-spacing: 0;\n    display: block;\n    position: relative; }\n  table.responsive-table td:empty:before {\n    content: '\\A0'; }\n  table.responsive-table th, table.responsive-table td {\n    margin: 0;\n    vertical-align: top; }\n  table.responsive-table th {\n    text-align: left; }\n  table.responsive-table thead {\n    display: block;\n    float: left; }\n  table.responsive-table thead tr {\n    display: block;\n    padding: 0 10px 0 0; }\n  table.responsive-table thead tr th::before {\n    content: \"\\A0\"; }\n  table.responsive-table tbody {\n    display: block;\n    width: auto;\n    position: relative;\n    overflow-x: auto;\n    white-space: nowrap; }\n  table.responsive-table tbody tr {\n    display: inline-block;\n    vertical-align: top; }\n  table.responsive-table th {\n    display: block;\n    text-align: right; }\n  table.responsive-table td {\n    display: block;\n    min-height: 1.25em;\n    text-align: left; }\n  table.responsive-table tr {\n    padding: 0 10px; }\n  table.responsive-table thead {\n    border: 0;\n    border-right: 1px solid #d0d0d0; }\n  table.responsive-table.bordered th {\n    border-bottom: 0;\n    border-left: 0; }\n  table.responsive-table.bordered td {\n    border-left: 0;\n    border-right: 0;\n    border-bottom: 0; }\n  table.responsive-table.bordered tr {\n    border: 0; }\n  table.responsive-table.bordered tbody tr {\n    border-right: 1px solid #d0d0d0; } }\n\n.collection {\n  margin: .5rem 0 1rem 0;\n  border: 1px solid #e0e0e0;\n  border-radius: 2px;\n  overflow: hidden;\n  position: relative; }\n\n.collection .collection-item {\n  background-color: #fff;\n  line-height: 1.5rem;\n  padding: 10px 20px;\n  margin: 0;\n  border-bottom: 1px solid #e0e0e0; }\n\n.collection .collection-item.avatar {\n  min-height: 84px;\n  padding-left: 72px;\n  position: relative; }\n\n.collection .collection-item.avatar .circle {\n  position: absolute;\n  width: 42px;\n  height: 42px;\n  overflow: hidden;\n  left: 15px;\n  display: inline-block;\n  vertical-align: middle; }\n\n.collection .collection-item.avatar i.circle {\n  font-size: 18px;\n  line-height: 42px;\n  color: #fff;\n  background-color: #999;\n  text-align: center; }\n\n.collection .collection-item.avatar .title {\n  font-size: 16px; }\n\n.collection .collection-item.avatar p {\n  margin: 0; }\n\n.collection .collection-item.avatar .secondary-content {\n  position: absolute;\n  top: 16px;\n  right: 16px; }\n\n.collection .collection-item:last-child {\n  border-bottom: none; }\n\n.collection .collection-item.active {\n  background-color: #26a69a;\n  color: #eafaf9; }\n\n.collection .collection-item.active .secondary-content {\n  color: #fff; }\n\n.collection a.collection-item {\n  display: block;\n  transition: .25s;\n  color: #26a69a; }\n\n.collection a.collection-item:not(.active):hover {\n  background-color: #ddd; }\n\n.collection.with-header .collection-header {\n  background-color: #fff;\n  border-bottom: 1px solid #e0e0e0;\n  padding: 10px 20px; }\n\n.collection.with-header .collection-item {\n  padding-left: 30px; }\n\n.collection.with-header .collection-item.avatar {\n  padding-left: 72px; }\n\n.secondary-content {\n  float: right;\n  color: #26a69a; }\n\n.collapsible .collection {\n  margin: 0;\n  border: none; }\n\n.video-container {\n  position: relative;\n  padding-bottom: 56.25%;\n  height: 0;\n  overflow: hidden; }\n\n.video-container iframe, .video-container object, .video-container embed {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%; }\n\n.progress {\n  position: relative;\n  height: 4px;\n  display: block;\n  width: 100%;\n  background-color: #acece6;\n  border-radius: 2px;\n  margin: .5rem 0 1rem 0;\n  overflow: hidden; }\n\n.progress .determinate {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  background-color: #26a69a;\n  transition: width .3s linear; }\n\n.progress .indeterminate {\n  background-color: #26a69a; }\n\n.progress .indeterminate:before {\n  content: '';\n  position: absolute;\n  background-color: inherit;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  will-change: left, right;\n  -webkit-animation: indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;\n  animation: indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite; }\n\n.progress .indeterminate:after {\n  content: '';\n  position: absolute;\n  background-color: inherit;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  will-change: left, right;\n  -webkit-animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;\n  animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;\n  -webkit-animation-delay: 1.15s;\n  animation-delay: 1.15s; }\n\n@-webkit-keyframes indeterminate {\n  0% {\n    left: -35%;\n    right: 100%; }\n  60% {\n    left: 100%;\n    right: -90%; }\n  100% {\n    left: 100%;\n    right: -90%; } }\n\n@keyframes indeterminate {\n  0% {\n    left: -35%;\n    right: 100%; }\n  60% {\n    left: 100%;\n    right: -90%; }\n  100% {\n    left: 100%;\n    right: -90%; } }\n\n@-webkit-keyframes indeterminate-short {\n  0% {\n    left: -200%;\n    right: 100%; }\n  60% {\n    left: 107%;\n    right: -8%; }\n  100% {\n    left: 107%;\n    right: -8%; } }\n\n@keyframes indeterminate-short {\n  0% {\n    left: -200%;\n    right: 100%; }\n  60% {\n    left: 107%;\n    right: -8%; }\n  100% {\n    left: 107%;\n    right: -8%; } }\n\n.hide {\n  display: none !important; }\n\n.left-align {\n  text-align: left; }\n\n.right-align {\n  text-align: right; }\n\n.center, .center-align {\n  text-align: center; }\n\n.left {\n  float: left !important; }\n\n.right {\n  float: right !important; }\n\n.no-select, input[type=range], input[type=range] + .thumb {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.circle {\n  border-radius: 50%; }\n\n.center-block {\n  display: block;\n  margin-left: auto;\n  margin-right: auto; }\n\n.truncate {\n  display: block;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis; }\n\n.no-padding {\n  padding: 0 !important; }\n\nspan.badge {\n  min-width: 3rem;\n  padding: 0 6px;\n  margin-left: 14px;\n  text-align: center;\n  font-size: 1rem;\n  line-height: 22px;\n  height: 22px;\n  color: #757575;\n  float: right;\n  box-sizing: border-box; }\n\nspan.badge.new {\n  font-weight: 300;\n  font-size: 0.8rem;\n  color: #fff;\n  background-color: #26a69a;\n  border-radius: 2px; }\n\nspan.badge.new:after {\n  content: \" new\"; }\n\nspan.badge[data-badge-caption]::after {\n  content: \" \" attr(data-badge-caption); }\n\nnav ul a span.badge {\n  display: inline-block;\n  float: none;\n  margin-left: 4px;\n  line-height: 22px;\n  height: 22px; }\n\n.collection-item span.badge {\n  margin-top: calc(.75rem - 11px); }\n\n.collapsible span.badge {\n  margin-top: calc(1.5rem - 11px); }\n\n.side-nav span.badge {\n  margin-top: calc(24px - 11px); }\n\n.material-icons {\n  text-rendering: optimizeLegibility;\n  -webkit-font-feature-settings: 'liga';\n  -moz-font-feature-settings: 'liga';\n  font-feature-settings: 'liga'; }\n\n.container {\n  margin: 0 auto;\n  max-width: 1280px;\n  width: 90%; }\n\n@media only screen and (min-width: 601px) {\n  .container {\n    width: 85%; } }\n\n@media only screen and (min-width: 993px) {\n  .container {\n    width: 70%; } }\n\n.container .row {\n  margin-left: -.75rem;\n  margin-right: -.75rem; }\n\n.section {\n  padding-top: 1rem;\n  padding-bottom: 1rem; }\n\n.section.no-pad {\n  padding: 0; }\n\n.section.no-pad-bot {\n  padding-bottom: 0; }\n\n.section.no-pad-top {\n  padding-top: 0; }\n\n.row {\n  margin-left: auto;\n  margin-right: auto;\n  margin-bottom: 20px; }\n\n.row:after {\n  content: \"\";\n  display: table;\n  clear: both; }\n\n.row .col {\n  float: left;\n  box-sizing: border-box;\n  padding: 0 .75rem;\n  min-height: 1px; }\n\n.row .col[class*=\"push-\"], .row .col[class*=\"pull-\"] {\n  position: relative; }\n\n.row .col.s1 {\n  width: 8.3333333333%;\n  margin-left: auto;\n  left: auto;\n  right: auto; }\n\n.row .col.s2 {\n  width: 16.6666666667%;\n  margin-left: auto;\n  left: auto;\n  right: auto; }\n\n.row .col.s3 {\n  width: 25%;\n  margin-left: auto;\n  left: auto;\n  right: auto; }\n\n.row .col.s4 {\n  width: 33.3333333333%;\n  margin-left: auto;\n  left: auto;\n  right: auto; }\n\n.row .col.s5 {\n  width: 41.6666666667%;\n  margin-left: auto;\n  left: auto;\n  right: auto; }\n\n.row .col.s6 {\n  width: 50%;\n  margin-left: auto;\n  left: auto;\n  right: auto; }\n\n.row .col.s7 {\n  width: 58.3333333333%;\n  margin-left: auto;\n  left: auto;\n  right: auto; }\n\n.row .col.s8 {\n  width: 66.6666666667%;\n  margin-left: auto;\n  left: auto;\n  right: auto; }\n\n.row .col.s9 {\n  width: 75%;\n  margin-left: auto;\n  left: auto;\n  right: auto; }\n\n.row .col.s10 {\n  width: 83.3333333333%;\n  margin-left: auto;\n  left: auto;\n  right: auto; }\n\n.row .col.s11 {\n  width: 91.6666666667%;\n  margin-left: auto;\n  left: auto;\n  right: auto; }\n\n.row .col.s12 {\n  width: 100%;\n  margin-left: auto;\n  left: auto;\n  right: auto; }\n\n.row .col.offset-s1 {\n  margin-left: 8.3333333333%; }\n\n.row .col.pull-s1 {\n  right: 8.3333333333%; }\n\n.row .col.push-s1 {\n  left: 8.3333333333%; }\n\n.row .col.offset-s2 {\n  margin-left: 16.6666666667%; }\n\n.row .col.pull-s2 {\n  right: 16.6666666667%; }\n\n.row .col.push-s2 {\n  left: 16.6666666667%; }\n\n.row .col.offset-s3 {\n  margin-left: 25%; }\n\n.row .col.pull-s3 {\n  right: 25%; }\n\n.row .col.push-s3 {\n  left: 25%; }\n\n.row .col.offset-s4 {\n  margin-left: 33.3333333333%; }\n\n.row .col.pull-s4 {\n  right: 33.3333333333%; }\n\n.row .col.push-s4 {\n  left: 33.3333333333%; }\n\n.row .col.offset-s5 {\n  margin-left: 41.6666666667%; }\n\n.row .col.pull-s5 {\n  right: 41.6666666667%; }\n\n.row .col.push-s5 {\n  left: 41.6666666667%; }\n\n.row .col.offset-s6 {\n  margin-left: 50%; }\n\n.row .col.pull-s6 {\n  right: 50%; }\n\n.row .col.push-s6 {\n  left: 50%; }\n\n.row .col.offset-s7 {\n  margin-left: 58.3333333333%; }\n\n.row .col.pull-s7 {\n  right: 58.3333333333%; }\n\n.row .col.push-s7 {\n  left: 58.3333333333%; }\n\n.row .col.offset-s8 {\n  margin-left: 66.6666666667%; }\n\n.row .col.pull-s8 {\n  right: 66.6666666667%; }\n\n.row .col.push-s8 {\n  left: 66.6666666667%; }\n\n.row .col.offset-s9 {\n  margin-left: 75%; }\n\n.row .col.pull-s9 {\n  right: 75%; }\n\n.row .col.push-s9 {\n  left: 75%; }\n\n.row .col.offset-s10 {\n  margin-left: 83.3333333333%; }\n\n.row .col.pull-s10 {\n  right: 83.3333333333%; }\n\n.row .col.push-s10 {\n  left: 83.3333333333%; }\n\n.row .col.offset-s11 {\n  margin-left: 91.6666666667%; }\n\n.row .col.pull-s11 {\n  right: 91.6666666667%; }\n\n.row .col.push-s11 {\n  left: 91.6666666667%; }\n\n.row .col.offset-s12 {\n  margin-left: 100%; }\n\n.row .col.pull-s12 {\n  right: 100%; }\n\n.row .col.push-s12 {\n  left: 100%; }\n\n@media only screen and (min-width: 601px) {\n  .row .col.m1 {\n    width: 8.3333333333%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.m2 {\n    width: 16.6666666667%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.m3 {\n    width: 25%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.m4 {\n    width: 33.3333333333%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.m5 {\n    width: 41.6666666667%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.m6 {\n    width: 50%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.m7 {\n    width: 58.3333333333%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.m8 {\n    width: 66.6666666667%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.m9 {\n    width: 75%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.m10 {\n    width: 83.3333333333%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.m11 {\n    width: 91.6666666667%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.m12 {\n    width: 100%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.offset-m1 {\n    margin-left: 8.3333333333%; }\n  .row .col.pull-m1 {\n    right: 8.3333333333%; }\n  .row .col.push-m1 {\n    left: 8.3333333333%; }\n  .row .col.offset-m2 {\n    margin-left: 16.6666666667%; }\n  .row .col.pull-m2 {\n    right: 16.6666666667%; }\n  .row .col.push-m2 {\n    left: 16.6666666667%; }\n  .row .col.offset-m3 {\n    margin-left: 25%; }\n  .row .col.pull-m3 {\n    right: 25%; }\n  .row .col.push-m3 {\n    left: 25%; }\n  .row .col.offset-m4 {\n    margin-left: 33.3333333333%; }\n  .row .col.pull-m4 {\n    right: 33.3333333333%; }\n  .row .col.push-m4 {\n    left: 33.3333333333%; }\n  .row .col.offset-m5 {\n    margin-left: 41.6666666667%; }\n  .row .col.pull-m5 {\n    right: 41.6666666667%; }\n  .row .col.push-m5 {\n    left: 41.6666666667%; }\n  .row .col.offset-m6 {\n    margin-left: 50%; }\n  .row .col.pull-m6 {\n    right: 50%; }\n  .row .col.push-m6 {\n    left: 50%; }\n  .row .col.offset-m7 {\n    margin-left: 58.3333333333%; }\n  .row .col.pull-m7 {\n    right: 58.3333333333%; }\n  .row .col.push-m7 {\n    left: 58.3333333333%; }\n  .row .col.offset-m8 {\n    margin-left: 66.6666666667%; }\n  .row .col.pull-m8 {\n    right: 66.6666666667%; }\n  .row .col.push-m8 {\n    left: 66.6666666667%; }\n  .row .col.offset-m9 {\n    margin-left: 75%; }\n  .row .col.pull-m9 {\n    right: 75%; }\n  .row .col.push-m9 {\n    left: 75%; }\n  .row .col.offset-m10 {\n    margin-left: 83.3333333333%; }\n  .row .col.pull-m10 {\n    right: 83.3333333333%; }\n  .row .col.push-m10 {\n    left: 83.3333333333%; }\n  .row .col.offset-m11 {\n    margin-left: 91.6666666667%; }\n  .row .col.pull-m11 {\n    right: 91.6666666667%; }\n  .row .col.push-m11 {\n    left: 91.6666666667%; }\n  .row .col.offset-m12 {\n    margin-left: 100%; }\n  .row .col.pull-m12 {\n    right: 100%; }\n  .row .col.push-m12 {\n    left: 100%; } }\n\n@media only screen and (min-width: 993px) {\n  .row .col.l1 {\n    width: 8.3333333333%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.l2 {\n    width: 16.6666666667%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.l3 {\n    width: 25%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.l4 {\n    width: 33.3333333333%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.l5 {\n    width: 41.6666666667%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.l6 {\n    width: 50%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.l7 {\n    width: 58.3333333333%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.l8 {\n    width: 66.6666666667%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.l9 {\n    width: 75%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.l10 {\n    width: 83.3333333333%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.l11 {\n    width: 91.6666666667%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.l12 {\n    width: 100%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.offset-l1 {\n    margin-left: 8.3333333333%; }\n  .row .col.pull-l1 {\n    right: 8.3333333333%; }\n  .row .col.push-l1 {\n    left: 8.3333333333%; }\n  .row .col.offset-l2 {\n    margin-left: 16.6666666667%; }\n  .row .col.pull-l2 {\n    right: 16.6666666667%; }\n  .row .col.push-l2 {\n    left: 16.6666666667%; }\n  .row .col.offset-l3 {\n    margin-left: 25%; }\n  .row .col.pull-l3 {\n    right: 25%; }\n  .row .col.push-l3 {\n    left: 25%; }\n  .row .col.offset-l4 {\n    margin-left: 33.3333333333%; }\n  .row .col.pull-l4 {\n    right: 33.3333333333%; }\n  .row .col.push-l4 {\n    left: 33.3333333333%; }\n  .row .col.offset-l5 {\n    margin-left: 41.6666666667%; }\n  .row .col.pull-l5 {\n    right: 41.6666666667%; }\n  .row .col.push-l5 {\n    left: 41.6666666667%; }\n  .row .col.offset-l6 {\n    margin-left: 50%; }\n  .row .col.pull-l6 {\n    right: 50%; }\n  .row .col.push-l6 {\n    left: 50%; }\n  .row .col.offset-l7 {\n    margin-left: 58.3333333333%; }\n  .row .col.pull-l7 {\n    right: 58.3333333333%; }\n  .row .col.push-l7 {\n    left: 58.3333333333%; }\n  .row .col.offset-l8 {\n    margin-left: 66.6666666667%; }\n  .row .col.pull-l8 {\n    right: 66.6666666667%; }\n  .row .col.push-l8 {\n    left: 66.6666666667%; }\n  .row .col.offset-l9 {\n    margin-left: 75%; }\n  .row .col.pull-l9 {\n    right: 75%; }\n  .row .col.push-l9 {\n    left: 75%; }\n  .row .col.offset-l10 {\n    margin-left: 83.3333333333%; }\n  .row .col.pull-l10 {\n    right: 83.3333333333%; }\n  .row .col.push-l10 {\n    left: 83.3333333333%; }\n  .row .col.offset-l11 {\n    margin-left: 91.6666666667%; }\n  .row .col.pull-l11 {\n    right: 91.6666666667%; }\n  .row .col.push-l11 {\n    left: 91.6666666667%; }\n  .row .col.offset-l12 {\n    margin-left: 100%; }\n  .row .col.pull-l12 {\n    right: 100%; }\n  .row .col.push-l12 {\n    left: 100%; } }\n\n@media only screen and (min-width: 1201px) {\n  .row .col.xl1 {\n    width: 8.3333333333%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.xl2 {\n    width: 16.6666666667%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.xl3 {\n    width: 25%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.xl4 {\n    width: 33.3333333333%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.xl5 {\n    width: 41.6666666667%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.xl6 {\n    width: 50%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.xl7 {\n    width: 58.3333333333%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.xl8 {\n    width: 66.6666666667%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.xl9 {\n    width: 75%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.xl10 {\n    width: 83.3333333333%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.xl11 {\n    width: 91.6666666667%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.xl12 {\n    width: 100%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.offset-xl1 {\n    margin-left: 8.3333333333%; }\n  .row .col.pull-xl1 {\n    right: 8.3333333333%; }\n  .row .col.push-xl1 {\n    left: 8.3333333333%; }\n  .row .col.offset-xl2 {\n    margin-left: 16.6666666667%; }\n  .row .col.pull-xl2 {\n    right: 16.6666666667%; }\n  .row .col.push-xl2 {\n    left: 16.6666666667%; }\n  .row .col.offset-xl3 {\n    margin-left: 25%; }\n  .row .col.pull-xl3 {\n    right: 25%; }\n  .row .col.push-xl3 {\n    left: 25%; }\n  .row .col.offset-xl4 {\n    margin-left: 33.3333333333%; }\n  .row .col.pull-xl4 {\n    right: 33.3333333333%; }\n  .row .col.push-xl4 {\n    left: 33.3333333333%; }\n  .row .col.offset-xl5 {\n    margin-left: 41.6666666667%; }\n  .row .col.pull-xl5 {\n    right: 41.6666666667%; }\n  .row .col.push-xl5 {\n    left: 41.6666666667%; }\n  .row .col.offset-xl6 {\n    margin-left: 50%; }\n  .row .col.pull-xl6 {\n    right: 50%; }\n  .row .col.push-xl6 {\n    left: 50%; }\n  .row .col.offset-xl7 {\n    margin-left: 58.3333333333%; }\n  .row .col.pull-xl7 {\n    right: 58.3333333333%; }\n  .row .col.push-xl7 {\n    left: 58.3333333333%; }\n  .row .col.offset-xl8 {\n    margin-left: 66.6666666667%; }\n  .row .col.pull-xl8 {\n    right: 66.6666666667%; }\n  .row .col.push-xl8 {\n    left: 66.6666666667%; }\n  .row .col.offset-xl9 {\n    margin-left: 75%; }\n  .row .col.pull-xl9 {\n    right: 75%; }\n  .row .col.push-xl9 {\n    left: 75%; }\n  .row .col.offset-xl10 {\n    margin-left: 83.3333333333%; }\n  .row .col.pull-xl10 {\n    right: 83.3333333333%; }\n  .row .col.push-xl10 {\n    left: 83.3333333333%; }\n  .row .col.offset-xl11 {\n    margin-left: 91.6666666667%; }\n  .row .col.pull-xl11 {\n    right: 91.6666666667%; }\n  .row .col.push-xl11 {\n    left: 91.6666666667%; }\n  .row .col.offset-xl12 {\n    margin-left: 100%; }\n  .row .col.pull-xl12 {\n    right: 100%; }\n  .row .col.push-xl12 {\n    left: 100%; } }\n\nnav {\n  color: #fff;\n  background-color: #ee6e73;\n  width: 100%;\n  height: 56px;\n  line-height: 56px; }\n\nnav.nav-extended {\n  height: auto; }\n\nnav.nav-extended .nav-wrapper {\n  min-height: 56px;\n  height: auto; }\n\nnav.nav-extended .nav-content {\n  position: relative;\n  line-height: normal; }\n\nnav a {\n  color: #fff; }\n\nnav i, nav [class^=\"mdi-\"], nav [class*=\"mdi-\"], nav i.material-icons {\n  display: block;\n  font-size: 24px;\n  height: 56px;\n  line-height: 56px; }\n\nnav .nav-wrapper {\n  position: relative;\n  height: 100%; }\n\n@media only screen and (min-width: 993px) {\n  nav a.button-collapse {\n    display: none; } }\n\nnav .button-collapse {\n  float: left;\n  position: relative;\n  z-index: 1;\n  height: 56px;\n  margin: 0 18px; }\n\nnav .button-collapse i {\n  height: 56px;\n  line-height: 56px; }\n\nnav .brand-logo {\n  position: absolute;\n  color: #fff;\n  display: inline-block;\n  font-size: 2.1rem;\n  padding: 0;\n  white-space: nowrap; }\n\nnav .brand-logo.center {\n  left: 50%;\n  -webkit-transform: translateX(-50%);\n  transform: translateX(-50%); }\n\n@media only screen and (max-width: 992px) {\n  nav .brand-logo {\n    left: 50%;\n    -webkit-transform: translateX(-50%);\n    transform: translateX(-50%); }\n  nav .brand-logo.left, nav .brand-logo.right {\n    padding: 0;\n    -webkit-transform: none;\n    transform: none; }\n  nav .brand-logo.left {\n    left: 0.5rem; }\n  nav .brand-logo.right {\n    right: 0.5rem;\n    left: auto; } }\n\nnav .brand-logo.right {\n  right: 0.5rem;\n  padding: 0; }\n\nnav .brand-logo i, nav .brand-logo [class^=\"mdi-\"], nav .brand-logo [class*=\"mdi-\"], nav .brand-logo i.material-icons {\n  float: left;\n  margin-right: 15px; }\n\nnav .nav-title {\n  display: inline-block;\n  font-size: 32px;\n  padding: 28px 0; }\n\nnav ul {\n  margin: 0; }\n\nnav ul li {\n  transition: background-color .3s;\n  float: left;\n  padding: 0; }\n\nnav ul li.active {\n  background-color: rgba(0, 0, 0, 0.1); }\n\nnav ul a {\n  transition: background-color .3s;\n  font-size: 1rem;\n  color: #fff;\n  display: block;\n  padding: 0 15px;\n  cursor: pointer; }\n\nnav ul a.btn, nav ul a.btn-large, nav ul a.btn-large, nav ul a.btn-flat, nav ul a.btn-floating {\n  margin-top: -2px;\n  margin-left: 15px;\n  margin-right: 15px; }\n\nnav ul a.btn > .material-icons, nav ul a.btn-large > .material-icons, nav ul a.btn-large > .material-icons, nav ul a.btn-flat > .material-icons, nav ul a.btn-floating > .material-icons {\n  height: inherit;\n  line-height: inherit; }\n\nnav ul a:hover {\n  background-color: rgba(0, 0, 0, 0.1); }\n\nnav ul.left {\n  float: left; }\n\nnav form {\n  height: 100%; }\n\nnav .input-field {\n  margin: 0;\n  height: 100%; }\n\nnav .input-field input {\n  height: 100%;\n  font-size: 1.2rem;\n  border: none;\n  padding-left: 2rem; }\n\nnav .input-field input:focus, nav .input-field input[type=text]:valid, nav .input-field input[type=password]:valid, nav .input-field input[type=email]:valid, nav .input-field input[type=url]:valid, nav .input-field input[type=date]:valid {\n  border: none;\n  box-shadow: none; }\n\nnav .input-field label {\n  top: 0;\n  left: 0; }\n\nnav .input-field label i {\n  color: rgba(255, 255, 255, 0.7);\n  transition: color .3s; }\n\nnav .input-field label.active i {\n  color: #fff; }\n\n.navbar-fixed {\n  position: relative;\n  height: 56px;\n  z-index: 997; }\n\n.navbar-fixed nav {\n  position: fixed; }\n\n@media only screen and (min-width: 601px) {\n  nav.nav-extended .nav-wrapper {\n    min-height: 64px; }\n  nav, nav .nav-wrapper i, nav a.button-collapse, nav a.button-collapse i {\n    height: 64px;\n    line-height: 64px; }\n  .navbar-fixed {\n    height: 64px; } }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: local(Roboto Thin), url(" + __webpack_require__(41) + ") format(\"woff2\"), url(" + __webpack_require__(40) + ") format(\"woff\");\n  font-weight: 100; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: local(Roboto Light), url(" + __webpack_require__(35) + ") format(\"woff2\"), url(" + __webpack_require__(34) + ") format(\"woff\");\n  font-weight: 300; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: local(Roboto Regular), url(" + __webpack_require__(39) + ") format(\"woff2\"), url(" + __webpack_require__(38) + ") format(\"woff\");\n  font-weight: 400; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: local(Roboto Medium), url(" + __webpack_require__(37) + ") format(\"woff2\"), url(" + __webpack_require__(36) + ") format(\"woff\");\n  font-weight: 500; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: local(Roboto Bold), url(" + __webpack_require__(33) + ") format(\"woff2\"), url(" + __webpack_require__(32) + ") format(\"woff\");\n  font-weight: 700; }\n\na {\n  text-decoration: none; }\n\nhtml {\n  line-height: 1.5;\n  font-family: \"Roboto\", sans-serif;\n  font-weight: normal;\n  color: rgba(0, 0, 0, 0.87); }\n\n@media only screen and (min-width: 0) {\n  html {\n    font-size: 14px; } }\n\n@media only screen and (min-width: 992px) {\n  html {\n    font-size: 14.5px; } }\n\n@media only screen and (min-width: 1200px) {\n  html {\n    font-size: 15px; } }\n\nh1, h2, h3, h4, h5, h6 {\n  font-weight: 400;\n  line-height: 1.1; }\n\nh1 a, h2 a, h3 a, h4 a, h5 a, h6 a {\n  font-weight: inherit; }\n\nh1 {\n  font-size: 4.2rem;\n  line-height: 110%;\n  margin: 2.1rem 0 1.68rem 0; }\n\nh2 {\n  font-size: 3.56rem;\n  line-height: 110%;\n  margin: 1.78rem 0 1.424rem 0; }\n\nh3 {\n  font-size: 2.92rem;\n  line-height: 110%;\n  margin: 1.46rem 0 1.168rem 0; }\n\nh4 {\n  font-size: 2.28rem;\n  line-height: 110%;\n  margin: 1.14rem 0 .912rem 0; }\n\nh5 {\n  font-size: 1.64rem;\n  line-height: 110%;\n  margin: .82rem 0 .656rem 0; }\n\nh6 {\n  font-size: 1rem;\n  line-height: 110%;\n  margin: .5rem 0 .4rem 0; }\n\nem {\n  font-style: italic; }\n\nstrong {\n  font-weight: 500; }\n\nsmall {\n  font-size: 75%; }\n\n.light, .page-footer .footer-copyright {\n  font-weight: 300; }\n\n.thin {\n  font-weight: 200; }\n\n.flow-text {\n  font-weight: 300; }\n\n@media only screen and (min-width: 360px) {\n  .flow-text {\n    font-size: 1.2rem; } }\n\n@media only screen and (min-width: 390px) {\n  .flow-text {\n    font-size: 1.224rem; } }\n\n@media only screen and (min-width: 420px) {\n  .flow-text {\n    font-size: 1.248rem; } }\n\n@media only screen and (min-width: 450px) {\n  .flow-text {\n    font-size: 1.272rem; } }\n\n@media only screen and (min-width: 480px) {\n  .flow-text {\n    font-size: 1.296rem; } }\n\n@media only screen and (min-width: 510px) {\n  .flow-text {\n    font-size: 1.32rem; } }\n\n@media only screen and (min-width: 540px) {\n  .flow-text {\n    font-size: 1.344rem; } }\n\n@media only screen and (min-width: 570px) {\n  .flow-text {\n    font-size: 1.368rem; } }\n\n@media only screen and (min-width: 600px) {\n  .flow-text {\n    font-size: 1.392rem; } }\n\n@media only screen and (min-width: 630px) {\n  .flow-text {\n    font-size: 1.416rem; } }\n\n@media only screen and (min-width: 660px) {\n  .flow-text {\n    font-size: 1.44rem; } }\n\n@media only screen and (min-width: 690px) {\n  .flow-text {\n    font-size: 1.464rem; } }\n\n@media only screen and (min-width: 720px) {\n  .flow-text {\n    font-size: 1.488rem; } }\n\n@media only screen and (min-width: 750px) {\n  .flow-text {\n    font-size: 1.512rem; } }\n\n@media only screen and (min-width: 780px) {\n  .flow-text {\n    font-size: 1.536rem; } }\n\n@media only screen and (min-width: 810px) {\n  .flow-text {\n    font-size: 1.56rem; } }\n\n@media only screen and (min-width: 840px) {\n  .flow-text {\n    font-size: 1.584rem; } }\n\n@media only screen and (min-width: 870px) {\n  .flow-text {\n    font-size: 1.608rem; } }\n\n@media only screen and (min-width: 900px) {\n  .flow-text {\n    font-size: 1.632rem; } }\n\n@media only screen and (min-width: 930px) {\n  .flow-text {\n    font-size: 1.656rem; } }\n\n@media only screen and (min-width: 960px) {\n  .flow-text {\n    font-size: 1.68rem; } }\n\n@media only screen and (max-width: 360px) {\n  .flow-text {\n    font-size: 1.2rem; } }\n\n.scale-transition {\n  transition: -webkit-transform 0.3s cubic-bezier(0.53, 0.01, 0.36, 1.63) !important;\n  transition: transform 0.3s cubic-bezier(0.53, 0.01, 0.36, 1.63) !important;\n  transition: transform 0.3s cubic-bezier(0.53, 0.01, 0.36, 1.63), -webkit-transform 0.3s cubic-bezier(0.53, 0.01, 0.36, 1.63) !important; }\n\n.scale-transition.scale-out {\n  -webkit-transform: scale(0);\n  transform: scale(0);\n  transition: -webkit-transform .2s !important;\n  transition: transform .2s !important;\n  transition: transform .2s, -webkit-transform .2s !important; }\n\n.scale-transition.scale-in {\n  -webkit-transform: scale(1);\n  transform: scale(1); }\n\n.card-panel {\n  transition: box-shadow .25s;\n  padding: 24px;\n  margin: .5rem 0 1rem 0;\n  border-radius: 2px;\n  background-color: #fff; }\n\n.card {\n  position: relative;\n  margin: .5rem 0 1rem 0;\n  background-color: #fff;\n  transition: box-shadow .25s;\n  border-radius: 2px; }\n\n.card .card-title {\n  font-size: 24px;\n  font-weight: 300; }\n\n.card .card-title.activator {\n  cursor: pointer; }\n\n.card.small, .card.medium, .card.large {\n  position: relative; }\n\n.card.small .card-image, .card.medium .card-image, .card.large .card-image {\n  max-height: 60%;\n  overflow: hidden; }\n\n.card.small .card-image + .card-content, .card.medium .card-image + .card-content, .card.large .card-image + .card-content {\n  max-height: 40%; }\n\n.card.small .card-content, .card.medium .card-content, .card.large .card-content {\n  max-height: 100%;\n  overflow: hidden; }\n\n.card.small .card-action, .card.medium .card-action, .card.large .card-action {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0; }\n\n.card.small {\n  height: 300px; }\n\n.card.medium {\n  height: 400px; }\n\n.card.large {\n  height: 500px; }\n\n.card.horizontal {\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex; }\n\n.card.horizontal.small .card-image, .card.horizontal.medium .card-image, .card.horizontal.large .card-image {\n  height: 100%;\n  max-height: none;\n  overflow: visible; }\n\n.card.horizontal.small .card-image img, .card.horizontal.medium .card-image img, .card.horizontal.large .card-image img {\n  height: 100%; }\n\n.card.horizontal .card-image {\n  max-width: 50%; }\n\n.card.horizontal .card-image img {\n  border-radius: 2px 0 0 2px;\n  max-width: 100%;\n  width: auto; }\n\n.card.horizontal .card-stacked {\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-flex-direction: column;\n  -ms-flex-direction: column;\n  flex-direction: column;\n  -webkit-flex: 1;\n  -ms-flex: 1;\n  flex: 1;\n  position: relative; }\n\n.card.horizontal .card-stacked .card-content {\n  -webkit-flex-grow: 1;\n  -ms-flex-positive: 1;\n  flex-grow: 1; }\n\n.card.sticky-action .card-action {\n  z-index: 2; }\n\n.card.sticky-action .card-reveal {\n  z-index: 1;\n  padding-bottom: 64px; }\n\n.card .card-image {\n  position: relative; }\n\n.card .card-image img {\n  display: block;\n  border-radius: 2px 2px 0 0;\n  position: relative;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  width: 100%; }\n\n.card .card-image .card-title {\n  color: #fff;\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  max-width: 100%;\n  padding: 24px; }\n\n.card .card-content {\n  padding: 24px;\n  border-radius: 0 0 2px 2px; }\n\n.card .card-content p {\n  margin: 0;\n  color: inherit; }\n\n.card .card-content .card-title {\n  display: block;\n  line-height: 32px;\n  margin-bottom: 8px; }\n\n.card .card-content .card-title i {\n  line-height: 32px; }\n\n.card .card-action {\n  position: relative;\n  background-color: inherit;\n  border-top: 1px solid rgba(160, 160, 160, 0.2);\n  padding: 16px 24px; }\n\n.card .card-action:last-child {\n  border-radius: 0 0 2px 2px; }\n\n.card .card-action a:not(.btn):not(.btn-large):not(.btn-large):not(.btn-floating) {\n  color: #ffab40;\n  margin-right: 24px;\n  transition: color .3s ease;\n  text-transform: uppercase; }\n\n.card .card-action a:not(.btn):not(.btn-large):not(.btn-large):not(.btn-floating):hover {\n  color: #ffd8a6; }\n\n.card .card-reveal {\n  padding: 24px;\n  position: absolute;\n  background-color: #fff;\n  width: 100%;\n  overflow-y: auto;\n  left: 0;\n  top: 100%;\n  height: 100%;\n  z-index: 3;\n  display: none; }\n\n.card .card-reveal .card-title {\n  cursor: pointer;\n  display: block; }\n\n#toast-container {\n  display: block;\n  position: fixed;\n  z-index: 10000; }\n\n@media only screen and (max-width: 600px) {\n  #toast-container {\n    min-width: 100%;\n    bottom: 0%; } }\n\n@media only screen and (min-width: 601px) and (max-width: 992px) {\n  #toast-container {\n    left: 5%;\n    bottom: 7%;\n    max-width: 90%; } }\n\n@media only screen and (min-width: 993px) {\n  #toast-container {\n    top: 10%;\n    right: 7%;\n    max-width: 86%; } }\n\n.toast {\n  border-radius: 2px;\n  top: 35px;\n  width: auto;\n  clear: both;\n  margin-top: 10px;\n  position: relative;\n  max-width: 100%;\n  height: auto;\n  min-height: 48px;\n  line-height: 1.5em;\n  word-break: break-all;\n  background-color: #323232;\n  padding: 10px 25px;\n  font-size: 1.1rem;\n  font-weight: 300;\n  color: #fff;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-align-items: center;\n  -ms-flex-align: center;\n  align-items: center;\n  -webkit-justify-content: space-between;\n  -ms-flex-pack: justify;\n  justify-content: space-between; }\n\n.toast .btn, .toast .btn-large, .toast .btn-flat {\n  margin: 0;\n  margin-left: 3rem; }\n\n.toast.rounded {\n  border-radius: 24px; }\n\n@media only screen and (max-width: 600px) {\n  .toast {\n    width: 100%;\n    border-radius: 0; } }\n\n@media only screen and (min-width: 601px) and (max-width: 992px) {\n  .toast {\n    float: left; } }\n\n@media only screen and (min-width: 993px) {\n  .toast {\n    float: right; } }\n\n.tabs {\n  position: relative;\n  overflow-x: auto;\n  overflow-y: hidden;\n  height: 48px;\n  width: 100%;\n  background-color: #fff;\n  margin: 0 auto;\n  white-space: nowrap; }\n\n.tabs.tabs-transparent {\n  background-color: transparent; }\n\n.tabs.tabs-transparent .tab a, .tabs.tabs-transparent .tab.disabled a, .tabs.tabs-transparent .tab.disabled a:hover {\n  color: rgba(255, 255, 255, 0.7); }\n\n.tabs.tabs-transparent .tab a:hover, .tabs.tabs-transparent .tab a.active {\n  color: #fff; }\n\n.tabs.tabs-transparent .indicator {\n  background-color: #fff; }\n\n.tabs.tabs-fixed-width {\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex; }\n\n.tabs.tabs-fixed-width .tab {\n  -webkit-flex-grow: 1;\n  -ms-flex-positive: 1;\n  flex-grow: 1; }\n\n.tabs .tab {\n  display: inline-block;\n  text-align: center;\n  line-height: 48px;\n  height: 48px;\n  padding: 0;\n  margin: 0;\n  text-transform: uppercase; }\n\n.tabs .tab a {\n  color: rgba(238, 110, 115, 0.7);\n  display: block;\n  width: 100%;\n  height: 100%;\n  padding: 0 24px;\n  font-size: 14px;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  transition: color .28s ease; }\n\n.tabs .tab a:hover, .tabs .tab a.active {\n  background-color: transparent;\n  color: #ee6e73; }\n\n.tabs .tab.disabled a, .tabs .tab.disabled a:hover {\n  color: rgba(238, 110, 115, 0.7);\n  cursor: default; }\n\n.tabs .indicator {\n  position: absolute;\n  bottom: 0;\n  height: 2px;\n  background-color: #f6b2b5;\n  will-change: left, right; }\n\n@media only screen and (max-width: 992px) {\n  .tabs {\n    display: -webkit-flex;\n    display: -ms-flexbox;\n    display: flex; }\n  .tabs .tab {\n    -webkit-flex-grow: 1;\n    -ms-flex-positive: 1;\n    flex-grow: 1; }\n  .tabs .tab a {\n    padding: 0 12px; } }\n\n.material-tooltip {\n  padding: 10px 8px;\n  font-size: 1rem;\n  z-index: 2000;\n  background-color: transparent;\n  border-radius: 2px;\n  color: #fff;\n  min-height: 36px;\n  line-height: 120%;\n  opacity: 0;\n  position: absolute;\n  text-align: center;\n  max-width: calc(100% - 4px);\n  overflow: hidden;\n  left: 0;\n  top: 0;\n  pointer-events: none;\n  visibility: hidden; }\n\n.backdrop {\n  position: absolute;\n  opacity: 0;\n  height: 7px;\n  width: 14px;\n  border-radius: 0 0 50% 50%;\n  background-color: #323232;\n  z-index: -1;\n  -webkit-transform-origin: 50% 0%;\n  transform-origin: 50% 0%;\n  visibility: hidden; }\n\n.btn, .btn-large, .btn-flat {\n  border: none;\n  border-radius: 2px;\n  display: inline-block;\n  height: 36px;\n  line-height: 36px;\n  padding: 0 2rem;\n  text-transform: uppercase;\n  vertical-align: middle;\n  -webkit-tap-highlight-color: transparent; }\n\n.btn.disabled, .disabled.btn-large, .btn-floating.disabled, .btn-large.disabled, .btn-flat.disabled, .btn:disabled, .btn-large:disabled, .btn-floating:disabled, .btn-large:disabled, .btn-flat:disabled, .btn[disabled], [disabled].btn-large, .btn-floating[disabled], .btn-large[disabled], .btn-flat[disabled] {\n  pointer-events: none;\n  background-color: #DFDFDF !important;\n  box-shadow: none;\n  color: #9F9F9F !important;\n  cursor: default; }\n\n.btn.disabled:hover, .disabled.btn-large:hover, .btn-floating.disabled:hover, .btn-large.disabled:hover, .btn-flat.disabled:hover, .btn:disabled:hover, .btn-large:disabled:hover, .btn-floating:disabled:hover, .btn-large:disabled:hover, .btn-flat:disabled:hover, .btn[disabled]:hover, [disabled].btn-large:hover, .btn-floating[disabled]:hover, .btn-large[disabled]:hover, .btn-flat[disabled]:hover {\n  background-color: #DFDFDF !important;\n  color: #9F9F9F !important; }\n\n.btn, .btn-large, .btn-floating, .btn-large, .btn-flat {\n  font-size: 1rem;\n  outline: 0; }\n\n.btn i, .btn-large i, .btn-floating i, .btn-large i, .btn-flat i {\n  font-size: 1.3rem;\n  line-height: inherit; }\n\n.btn:focus, .btn-large:focus, .btn-floating:focus {\n  background-color: #1d7d74; }\n\n.btn, .btn-large {\n  text-decoration: none;\n  color: #fff;\n  background-color: #26a69a;\n  text-align: center;\n  letter-spacing: .5px;\n  transition: .2s ease-out;\n  cursor: pointer; }\n\n.btn:hover, .btn-large:hover {\n  background-color: #2bbbad; }\n\n.btn-floating {\n  display: inline-block;\n  color: #fff;\n  position: relative;\n  overflow: hidden;\n  z-index: 1;\n  width: 40px;\n  height: 40px;\n  line-height: 40px;\n  padding: 0;\n  background-color: #26a69a;\n  border-radius: 50%;\n  transition: .3s;\n  cursor: pointer;\n  vertical-align: middle; }\n\n.btn-floating:hover {\n  background-color: #26a69a; }\n\n.btn-floating:before {\n  border-radius: 0; }\n\n.btn-floating.btn-large {\n  width: 56px;\n  height: 56px; }\n\n.btn-floating.btn-large.halfway-fab {\n  bottom: -28px; }\n\n.btn-floating.btn-large i {\n  line-height: 56px; }\n\n.btn-floating.halfway-fab {\n  position: absolute;\n  right: 24px;\n  bottom: -20px; }\n\n.btn-floating.halfway-fab.left {\n  right: auto;\n  left: 24px; }\n\n.btn-floating i {\n  width: inherit;\n  display: inline-block;\n  text-align: center;\n  color: #fff;\n  font-size: 1.6rem;\n  line-height: 40px; }\n\nbutton.btn-floating {\n  border: none; }\n\n.fixed-action-btn {\n  position: fixed;\n  right: 23px;\n  bottom: 23px;\n  padding-top: 15px;\n  margin-bottom: 0;\n  z-index: 998; }\n\n.fixed-action-btn.active ul {\n  visibility: visible; }\n\n.fixed-action-btn.horizontal {\n  padding: 0 0 0 15px; }\n\n.fixed-action-btn.horizontal ul {\n  text-align: right;\n  right: 64px;\n  top: 50%;\n  -webkit-transform: translateY(-50%);\n  transform: translateY(-50%);\n  height: 100%;\n  left: auto;\n  width: 500px; }\n\n.fixed-action-btn.horizontal ul li {\n  display: inline-block;\n  margin: 15px 15px 0 0; }\n\n.fixed-action-btn.toolbar {\n  padding: 0;\n  height: 56px; }\n\n.fixed-action-btn.toolbar.active > a i {\n  opacity: 0; }\n\n.fixed-action-btn.toolbar ul {\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  top: 0;\n  bottom: 0; }\n\n.fixed-action-btn.toolbar ul li {\n  -webkit-flex: 1;\n  -ms-flex: 1;\n  flex: 1;\n  display: inline-block;\n  margin: 0;\n  height: 100%;\n  transition: none; }\n\n.fixed-action-btn.toolbar ul li a {\n  display: block;\n  overflow: hidden;\n  position: relative;\n  width: 100%;\n  height: 100%;\n  background-color: transparent;\n  box-shadow: none;\n  color: #fff;\n  line-height: 56px;\n  z-index: 1; }\n\n.fixed-action-btn.toolbar ul li a i {\n  line-height: inherit; }\n\n.fixed-action-btn ul {\n  left: 0;\n  right: 0;\n  text-align: center;\n  position: absolute;\n  bottom: 64px;\n  margin: 0;\n  visibility: hidden; }\n\n.fixed-action-btn ul li {\n  margin-bottom: 15px; }\n\n.fixed-action-btn ul a.btn-floating {\n  opacity: 0; }\n\n.fixed-action-btn .fab-backdrop {\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: -1;\n  width: 40px;\n  height: 40px;\n  background-color: #26a69a;\n  border-radius: 50%;\n  -webkit-transform: scale(0);\n  transform: scale(0); }\n\n.btn-flat {\n  box-shadow: none;\n  background-color: transparent;\n  color: #343434;\n  cursor: pointer;\n  transition: background-color .2s; }\n\n.btn-flat:focus, .btn-flat:active {\n  background-color: transparent; }\n\n.btn-flat:focus, .btn-flat:hover {\n  background-color: rgba(0, 0, 0, 0.1);\n  box-shadow: none; }\n\n.btn-flat:active {\n  background-color: rgba(0, 0, 0, 0.2); }\n\n.btn-flat.disabled {\n  background-color: transparent !important;\n  color: #b3b3b3 !important;\n  cursor: default; }\n\n.btn-large {\n  height: 54px;\n  line-height: 54px; }\n\n.btn-large i {\n  font-size: 1.6rem; }\n\n.btn-block {\n  display: block; }\n\n.dropdown-content {\n  background-color: #fff;\n  margin: 0;\n  display: none;\n  min-width: 100px;\n  max-height: 650px;\n  overflow-y: auto;\n  opacity: 0;\n  position: absolute;\n  z-index: 999;\n  will-change: width, height; }\n\n.dropdown-content li {\n  clear: both;\n  color: rgba(0, 0, 0, 0.87);\n  cursor: pointer;\n  min-height: 50px;\n  line-height: 1.5rem;\n  width: 100%;\n  text-align: left;\n  text-transform: none; }\n\n.dropdown-content li:hover, .dropdown-content li.active, .dropdown-content li.selected {\n  background-color: #eee; }\n\n.dropdown-content li.active.selected {\n  background-color: #e1e1e1; }\n\n.dropdown-content li.divider {\n  min-height: 0;\n  height: 1px; }\n\n.dropdown-content li > a, .dropdown-content li > span {\n  font-size: 16px;\n  color: #26a69a;\n  display: block;\n  line-height: 22px;\n  padding: 14px 16px; }\n\n.dropdown-content li > span > label {\n  top: 1px;\n  left: 0;\n  height: 18px; }\n\n.dropdown-content li > a > i {\n  height: inherit;\n  line-height: inherit;\n  float: left;\n  margin: 0 24px 0 0;\n  width: 24px; }\n\n.input-field.col .dropdown-content [type=\"checkbox\"] + label {\n  top: 1px;\n  left: 0;\n  height: 18px; }\n\n/*!\n * Waves v0.6.0\n * http://fian.my.id/Waves\n *\n * Copyright 2014 Alfiana E. Sibuea and other contributors\n * Released under the MIT license\n * https://github.com/fians/Waves/blob/master/LICENSE\n */\n.waves-effect {\n  position: relative;\n  cursor: pointer;\n  display: inline-block;\n  overflow: hidden;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  -webkit-tap-highlight-color: transparent;\n  vertical-align: middle;\n  z-index: 1;\n  transition: .3s ease-out; }\n\n.waves-effect .waves-ripple {\n  position: absolute;\n  border-radius: 50%;\n  width: 20px;\n  height: 20px;\n  margin-top: -10px;\n  margin-left: -10px;\n  opacity: 0;\n  background: rgba(0, 0, 0, 0.2);\n  transition: all 0.7s ease-out;\n  transition-property: opacity, -webkit-transform;\n  transition-property: transform, opacity;\n  transition-property: transform, opacity, -webkit-transform;\n  -webkit-transform: scale(0);\n  transform: scale(0);\n  pointer-events: none; }\n\n.waves-effect.waves-light .waves-ripple {\n  background-color: rgba(255, 255, 255, 0.45); }\n\n.waves-effect.waves-red .waves-ripple {\n  background-color: rgba(244, 67, 54, 0.7); }\n\n.waves-effect.waves-yellow .waves-ripple {\n  background-color: rgba(255, 235, 59, 0.7); }\n\n.waves-effect.waves-orange .waves-ripple {\n  background-color: rgba(255, 152, 0, 0.7); }\n\n.waves-effect.waves-purple .waves-ripple {\n  background-color: rgba(156, 39, 176, 0.7); }\n\n.waves-effect.waves-green .waves-ripple {\n  background-color: rgba(76, 175, 80, 0.7); }\n\n.waves-effect.waves-teal .waves-ripple {\n  background-color: rgba(0, 150, 136, 0.7); }\n\n.waves-effect input[type=\"button\"], .waves-effect input[type=\"reset\"], .waves-effect input[type=\"submit\"] {\n  border: 0;\n  font-style: normal;\n  font-size: inherit;\n  text-transform: inherit;\n  background: none; }\n\n.waves-effect img {\n  position: relative;\n  z-index: -1; }\n\n.waves-notransition {\n  transition: none !important; }\n\n.waves-circle {\n  -webkit-transform: translateZ(0);\n  transform: translateZ(0);\n  -webkit-mask-image: -webkit-radial-gradient(circle, #fff 100%, #000 100%); }\n\n.waves-input-wrapper {\n  border-radius: 0.2em;\n  vertical-align: bottom; }\n\n.waves-input-wrapper .waves-button-input {\n  position: relative;\n  top: 0;\n  left: 0;\n  z-index: 1; }\n\n.waves-circle {\n  text-align: center;\n  width: 2.5em;\n  height: 2.5em;\n  line-height: 2.5em;\n  border-radius: 50%;\n  -webkit-mask-image: none; }\n\n.waves-block {\n  display: block; }\n\n.waves-effect .waves-ripple {\n  z-index: -1; }\n\n.modal {\n  display: none;\n  position: fixed;\n  left: 0;\n  right: 0;\n  background-color: #fafafa;\n  padding: 0;\n  max-height: 70%;\n  width: 55%;\n  margin: auto;\n  overflow-y: auto;\n  border-radius: 2px;\n  will-change: top, opacity; }\n\n@media only screen and (max-width: 992px) {\n  .modal {\n    width: 80%; } }\n\n.modal h1, .modal h2, .modal h3, .modal h4 {\n  margin-top: 0; }\n\n.modal .modal-content {\n  padding: 24px; }\n\n.modal .modal-close {\n  cursor: pointer; }\n\n.modal .modal-footer {\n  border-radius: 0 0 2px 2px;\n  background-color: #fafafa;\n  padding: 4px 6px;\n  height: 56px;\n  width: 100%; }\n\n.modal .modal-footer .btn, .modal .modal-footer .btn-large, .modal .modal-footer .btn-flat {\n  float: right;\n  margin: 6px 0; }\n\n.modal-overlay {\n  position: fixed;\n  z-index: 999;\n  top: -100px;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  height: 125%;\n  width: 100%;\n  background: #000;\n  display: none;\n  will-change: opacity; }\n\n.modal.modal-fixed-footer {\n  padding: 0;\n  height: 70%; }\n\n.modal.modal-fixed-footer .modal-content {\n  position: absolute;\n  height: calc(100% - 56px);\n  max-height: 100%;\n  width: 100%;\n  overflow-y: auto; }\n\n.modal.modal-fixed-footer .modal-footer {\n  border-top: 1px solid rgba(0, 0, 0, 0.1);\n  position: absolute;\n  bottom: 0; }\n\n.modal.bottom-sheet {\n  top: auto;\n  bottom: -100%;\n  margin: 0;\n  width: 100%;\n  max-height: 45%;\n  border-radius: 0;\n  will-change: bottom, opacity; }\n\n.collapsible {\n  border-top: 1px solid #ddd;\n  border-right: 1px solid #ddd;\n  border-left: 1px solid #ddd;\n  margin: .5rem 0 1rem 0; }\n\n.collapsible-header {\n  display: block;\n  cursor: pointer;\n  min-height: 3rem;\n  line-height: 3rem;\n  padding: 0 1rem;\n  background-color: #fff;\n  border-bottom: 1px solid #ddd; }\n\n.collapsible-header i {\n  width: 2rem;\n  font-size: 1.6rem;\n  line-height: 3rem;\n  display: block;\n  float: left;\n  text-align: center;\n  margin-right: 1rem; }\n\n.collapsible-body {\n  display: none;\n  border-bottom: 1px solid #ddd;\n  box-sizing: border-box;\n  padding: 2rem; }\n\n.side-nav .collapsible, .side-nav.fixed .collapsible {\n  border: none;\n  box-shadow: none; }\n\n.side-nav .collapsible li, .side-nav.fixed .collapsible li {\n  padding: 0; }\n\n.side-nav .collapsible-header, .side-nav.fixed .collapsible-header {\n  background-color: transparent;\n  border: none;\n  line-height: inherit;\n  height: inherit;\n  padding: 0 16px; }\n\n.side-nav .collapsible-header:hover, .side-nav.fixed .collapsible-header:hover {\n  background-color: rgba(0, 0, 0, 0.05); }\n\n.side-nav .collapsible-header i, .side-nav.fixed .collapsible-header i {\n  line-height: inherit; }\n\n.side-nav .collapsible-body, .side-nav.fixed .collapsible-body {\n  border: 0;\n  background-color: #fff; }\n\n.side-nav .collapsible-body li a, .side-nav.fixed .collapsible-body li a {\n  padding: 0 23.5px 0 31px; }\n\n.collapsible.popout {\n  border: none;\n  box-shadow: none; }\n\n.collapsible.popout > li {\n  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n  margin: 0 24px;\n  transition: margin 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94); }\n\n.collapsible.popout > li.active {\n  box-shadow: 0 5px 11px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15);\n  margin: 16px 0; }\n\n.chip {\n  display: inline-block;\n  height: 32px;\n  font-size: 13px;\n  font-weight: 500;\n  color: rgba(0, 0, 0, 0.6);\n  line-height: 32px;\n  padding: 0 12px;\n  border-radius: 16px;\n  background-color: #e4e4e4;\n  margin-bottom: 5px;\n  margin-right: 5px; }\n\n.chip > img {\n  float: left;\n  margin: 0 8px 0 -12px;\n  height: 32px;\n  width: 32px;\n  border-radius: 50%; }\n\n.chip .close {\n  cursor: pointer;\n  float: right;\n  font-size: 16px;\n  line-height: 32px;\n  padding-left: 8px; }\n\n.chips {\n  border: none;\n  border-bottom: 1px solid #9e9e9e;\n  box-shadow: none;\n  margin: 0 0 20px 0;\n  min-height: 45px;\n  outline: none;\n  transition: all .3s; }\n\n.chips.focus {\n  border-bottom: 1px solid #26a69a;\n  box-shadow: 0 1px 0 0 #26a69a; }\n\n.chips:hover {\n  cursor: text; }\n\n.chips .chip.selected {\n  background-color: #26a69a;\n  color: #fff; }\n\n.chips .input {\n  background: none;\n  border: 0;\n  color: rgba(0, 0, 0, 0.6);\n  display: inline-block;\n  font-size: 1rem;\n  height: 3rem;\n  line-height: 32px;\n  outline: 0;\n  margin: 0;\n  padding: 0 !important;\n  width: 120px !important; }\n\n.chips .input:focus {\n  border: 0 !important;\n  box-shadow: none !important; }\n\n.chips .autocomplete-content {\n  margin-top: 0; }\n\n.prefix ~ .chips {\n  margin-left: 3rem;\n  width: 92%;\n  width: calc(100% - 3rem); }\n\n.chips:empty ~ label {\n  font-size: 0.8rem;\n  -webkit-transform: translateY(-140%);\n  transform: translateY(-140%); }\n\n.materialboxed {\n  display: block;\n  cursor: -webkit-zoom-in;\n  cursor: zoom-in;\n  position: relative;\n  transition: opacity .4s;\n  -webkit-backface-visibility: hidden; }\n\n.materialboxed:hover:not(.active) {\n  opacity: .8; }\n\n.materialboxed.active {\n  cursor: -webkit-zoom-out;\n  cursor: zoom-out; }\n\n#materialbox-overlay {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  background-color: #292929;\n  z-index: 1000;\n  will-change: opacity; }\n\n.materialbox-caption {\n  position: fixed;\n  display: none;\n  color: #fff;\n  line-height: 50px;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  text-align: center;\n  padding: 0% 15%;\n  height: 50px;\n  z-index: 1000;\n  -webkit-font-smoothing: antialiased; }\n\nselect:focus {\n  outline: 1px solid #c9f3ef; }\n\nbutton:focus {\n  outline: none;\n  background-color: #2ab7a9; }\n\nlabel {\n  font-size: .8rem;\n  color: #9e9e9e; }\n\n::-webkit-input-placeholder {\n  color: #d1d1d1; }\n\n:-moz-placeholder {\n  color: #d1d1d1; }\n\n::-moz-placeholder {\n  color: #d1d1d1; }\n\n:-ms-input-placeholder {\n  color: #d1d1d1; }\n\ninput:not([type]), input[type=text], input[type=password], input[type=email], input[type=url], input[type=time], input[type=date], input[type=datetime], input[type=datetime-local], input[type=tel], input[type=number], input[type=search], textarea.materialize-textarea {\n  background-color: transparent;\n  border: none;\n  border-bottom: 1px solid #9e9e9e;\n  border-radius: 0;\n  outline: none;\n  height: 3rem;\n  width: 100%;\n  font-size: 1rem;\n  margin: 0 0 20px 0;\n  padding: 0;\n  box-shadow: none;\n  box-sizing: content-box;\n  transition: all 0.3s; }\n\ninput:not([type]):disabled, input:not([type])[readonly=\"readonly\"], input[type=text]:disabled, input[type=text][readonly=\"readonly\"], input[type=password]:disabled, input[type=password][readonly=\"readonly\"], input[type=email]:disabled, input[type=email][readonly=\"readonly\"], input[type=url]:disabled, input[type=url][readonly=\"readonly\"], input[type=time]:disabled, input[type=time][readonly=\"readonly\"], input[type=date]:disabled, input[type=date][readonly=\"readonly\"], input[type=datetime]:disabled, input[type=datetime][readonly=\"readonly\"], input[type=datetime-local]:disabled, input[type=datetime-local][readonly=\"readonly\"], input[type=tel]:disabled, input[type=tel][readonly=\"readonly\"], input[type=number]:disabled, input[type=number][readonly=\"readonly\"], input[type=search]:disabled, input[type=search][readonly=\"readonly\"], textarea.materialize-textarea:disabled, textarea.materialize-textarea[readonly=\"readonly\"] {\n  color: rgba(0, 0, 0, 0.26);\n  border-bottom: 1px dotted rgba(0, 0, 0, 0.26); }\n\ninput:not([type]):disabled + label, input:not([type])[readonly=\"readonly\"] + label, input[type=text]:disabled + label, input[type=text][readonly=\"readonly\"] + label, input[type=password]:disabled + label, input[type=password][readonly=\"readonly\"] + label, input[type=email]:disabled + label, input[type=email][readonly=\"readonly\"] + label, input[type=url]:disabled + label, input[type=url][readonly=\"readonly\"] + label, input[type=time]:disabled + label, input[type=time][readonly=\"readonly\"] + label, input[type=date]:disabled + label, input[type=date][readonly=\"readonly\"] + label, input[type=datetime]:disabled + label, input[type=datetime][readonly=\"readonly\"] + label, input[type=datetime-local]:disabled + label, input[type=datetime-local][readonly=\"readonly\"] + label, input[type=tel]:disabled + label, input[type=tel][readonly=\"readonly\"] + label, input[type=number]:disabled + label, input[type=number][readonly=\"readonly\"] + label, input[type=search]:disabled + label, input[type=search][readonly=\"readonly\"] + label, textarea.materialize-textarea:disabled + label, textarea.materialize-textarea[readonly=\"readonly\"] + label {\n  color: rgba(0, 0, 0, 0.26); }\n\ninput:not([type]):focus:not([readonly]), input[type=text]:focus:not([readonly]), input[type=password]:focus:not([readonly]), input[type=email]:focus:not([readonly]), input[type=url]:focus:not([readonly]), input[type=time]:focus:not([readonly]), input[type=date]:focus:not([readonly]), input[type=datetime]:focus:not([readonly]), input[type=datetime-local]:focus:not([readonly]), input[type=tel]:focus:not([readonly]), input[type=number]:focus:not([readonly]), input[type=search]:focus:not([readonly]), textarea.materialize-textarea:focus:not([readonly]) {\n  border-bottom: 1px solid #26a69a;\n  box-shadow: 0 1px 0 0 #26a69a; }\n\ninput:not([type]):focus:not([readonly]) + label, input[type=text]:focus:not([readonly]) + label, input[type=password]:focus:not([readonly]) + label, input[type=email]:focus:not([readonly]) + label, input[type=url]:focus:not([readonly]) + label, input[type=time]:focus:not([readonly]) + label, input[type=date]:focus:not([readonly]) + label, input[type=datetime]:focus:not([readonly]) + label, input[type=datetime-local]:focus:not([readonly]) + label, input[type=tel]:focus:not([readonly]) + label, input[type=number]:focus:not([readonly]) + label, input[type=search]:focus:not([readonly]) + label, textarea.materialize-textarea:focus:not([readonly]) + label {\n  color: #26a69a; }\n\ninput:not([type]).valid, input:not([type]):focus.valid, input[type=text].valid, input[type=text]:focus.valid, input[type=password].valid, input[type=password]:focus.valid, input[type=email].valid, input[type=email]:focus.valid, input[type=url].valid, input[type=url]:focus.valid, input[type=time].valid, input[type=time]:focus.valid, input[type=date].valid, input[type=date]:focus.valid, input[type=datetime].valid, input[type=datetime]:focus.valid, input[type=datetime-local].valid, input[type=datetime-local]:focus.valid, input[type=tel].valid, input[type=tel]:focus.valid, input[type=number].valid, input[type=number]:focus.valid, input[type=search].valid, input[type=search]:focus.valid, textarea.materialize-textarea.valid, textarea.materialize-textarea:focus.valid {\n  border-bottom: 1px solid #4CAF50;\n  box-shadow: 0 1px 0 0 #4CAF50; }\n\ninput:not([type]).valid + label:after, input:not([type]):focus.valid + label:after, input[type=text].valid + label:after, input[type=text]:focus.valid + label:after, input[type=password].valid + label:after, input[type=password]:focus.valid + label:after, input[type=email].valid + label:after, input[type=email]:focus.valid + label:after, input[type=url].valid + label:after, input[type=url]:focus.valid + label:after, input[type=time].valid + label:after, input[type=time]:focus.valid + label:after, input[type=date].valid + label:after, input[type=date]:focus.valid + label:after, input[type=datetime].valid + label:after, input[type=datetime]:focus.valid + label:after, input[type=datetime-local].valid + label:after, input[type=datetime-local]:focus.valid + label:after, input[type=tel].valid + label:after, input[type=tel]:focus.valid + label:after, input[type=number].valid + label:after, input[type=number]:focus.valid + label:after, input[type=search].valid + label:after, input[type=search]:focus.valid + label:after, textarea.materialize-textarea.valid + label:after, textarea.materialize-textarea:focus.valid + label:after {\n  content: attr(data-success);\n  color: #4CAF50;\n  opacity: 1; }\n\ninput:not([type]).invalid, input:not([type]):focus.invalid, input[type=text].invalid, input[type=text]:focus.invalid, input[type=password].invalid, input[type=password]:focus.invalid, input[type=email].invalid, input[type=email]:focus.invalid, input[type=url].invalid, input[type=url]:focus.invalid, input[type=time].invalid, input[type=time]:focus.invalid, input[type=date].invalid, input[type=date]:focus.invalid, input[type=datetime].invalid, input[type=datetime]:focus.invalid, input[type=datetime-local].invalid, input[type=datetime-local]:focus.invalid, input[type=tel].invalid, input[type=tel]:focus.invalid, input[type=number].invalid, input[type=number]:focus.invalid, input[type=search].invalid, input[type=search]:focus.invalid, textarea.materialize-textarea.invalid, textarea.materialize-textarea:focus.invalid {\n  border-bottom: 1px solid #F44336;\n  box-shadow: 0 1px 0 0 #F44336; }\n\ninput:not([type]).invalid + label:after, input:not([type]):focus.invalid + label:after, input[type=text].invalid + label:after, input[type=text]:focus.invalid + label:after, input[type=password].invalid + label:after, input[type=password]:focus.invalid + label:after, input[type=email].invalid + label:after, input[type=email]:focus.invalid + label:after, input[type=url].invalid + label:after, input[type=url]:focus.invalid + label:after, input[type=time].invalid + label:after, input[type=time]:focus.invalid + label:after, input[type=date].invalid + label:after, input[type=date]:focus.invalid + label:after, input[type=datetime].invalid + label:after, input[type=datetime]:focus.invalid + label:after, input[type=datetime-local].invalid + label:after, input[type=datetime-local]:focus.invalid + label:after, input[type=tel].invalid + label:after, input[type=tel]:focus.invalid + label:after, input[type=number].invalid + label:after, input[type=number]:focus.invalid + label:after, input[type=search].invalid + label:after, input[type=search]:focus.invalid + label:after, textarea.materialize-textarea.invalid + label:after, textarea.materialize-textarea:focus.invalid + label:after {\n  content: attr(data-error);\n  color: #F44336;\n  opacity: 1; }\n\ninput:not([type]).validate + label, input[type=text].validate + label, input[type=password].validate + label, input[type=email].validate + label, input[type=url].validate + label, input[type=time].validate + label, input[type=date].validate + label, input[type=datetime].validate + label, input[type=datetime-local].validate + label, input[type=tel].validate + label, input[type=number].validate + label, input[type=search].validate + label, textarea.materialize-textarea.validate + label {\n  width: 100%;\n  pointer-events: none; }\n\ninput:not([type]) + label:after, input[type=text] + label:after, input[type=password] + label:after, input[type=email] + label:after, input[type=url] + label:after, input[type=time] + label:after, input[type=date] + label:after, input[type=datetime] + label:after, input[type=datetime-local] + label:after, input[type=tel] + label:after, input[type=number] + label:after, input[type=search] + label:after, textarea.materialize-textarea + label:after {\n  display: block;\n  content: \"\";\n  position: absolute;\n  top: 60px;\n  opacity: 0;\n  transition: .2s opacity ease-out, .2s color ease-out; }\n\n.input-field {\n  position: relative;\n  margin-top: 1rem; }\n\n.input-field.inline {\n  display: inline-block;\n  vertical-align: middle;\n  margin-left: 5px; }\n\n.input-field.inline input, .input-field.inline .select-dropdown {\n  margin-bottom: 1rem; }\n\n.input-field.col label {\n  left: .75rem; }\n\n.input-field.col .prefix ~ label, .input-field.col .prefix ~ .validate ~ label {\n  width: calc(100% - 3rem - 1.5rem); }\n\n.input-field label {\n  color: #9e9e9e;\n  position: absolute;\n  top: 0.8rem;\n  left: 0;\n  font-size: 1rem;\n  cursor: text;\n  transition: .2s ease-out;\n  text-align: initial; }\n\n.input-field label:not(.label-icon).active {\n  font-size: .8rem;\n  -webkit-transform: translateY(-140%);\n  transform: translateY(-140%); }\n\n.input-field .prefix {\n  position: absolute;\n  width: 3rem;\n  font-size: 2rem;\n  transition: color .2s; }\n\n.input-field .prefix.active {\n  color: #26a69a; }\n\n.input-field .prefix ~ input, .input-field .prefix ~ textarea, .input-field .prefix ~ label, .input-field .prefix ~ .validate ~ label, .input-field .prefix ~ .autocomplete-content {\n  margin-left: 3rem;\n  width: 92%;\n  width: calc(100% - 3rem); }\n\n.input-field .prefix ~ label {\n  margin-left: 3rem; }\n\n@media only screen and (max-width: 992px) {\n  .input-field .prefix ~ input {\n    width: 86%;\n    width: calc(100% - 3rem); } }\n\n@media only screen and (max-width: 600px) {\n  .input-field .prefix ~ input {\n    width: 80%;\n    width: calc(100% - 3rem); } }\n\n.input-field input[type=search] {\n  display: block;\n  line-height: inherit;\n  padding-left: 4rem;\n  width: calc(100% - 4rem); }\n\n.input-field input[type=search]:focus {\n  background-color: #fff;\n  border: 0;\n  box-shadow: none;\n  color: #444; }\n\n.input-field input[type=search]:focus + label i, .input-field input[type=search]:focus ~ .mdi-navigation-close, .input-field input[type=search]:focus ~ .material-icons {\n  color: #444; }\n\n.input-field input[type=search] + label {\n  left: 1rem; }\n\n.input-field input[type=search] ~ .mdi-navigation-close, .input-field input[type=search] ~ .material-icons {\n  position: absolute;\n  top: 0;\n  right: 1rem;\n  color: transparent;\n  cursor: pointer;\n  font-size: 2rem;\n  transition: .3s color; }\n\ntextarea {\n  width: 100%;\n  height: 3rem;\n  background-color: transparent; }\n\ntextarea.materialize-textarea {\n  overflow-y: hidden;\n  padding: .8rem 0 1.6rem 0;\n  resize: none;\n  min-height: 3rem; }\n\n.hiddendiv {\n  display: none;\n  white-space: pre-wrap;\n  word-wrap: break-word;\n  overflow-wrap: break-word;\n  padding-top: 1.2rem;\n  position: absolute;\n  top: 0; }\n\n.autocomplete-content {\n  margin-top: -20px;\n  display: block;\n  opacity: 1;\n  position: static; }\n\n.autocomplete-content li .highlight {\n  color: #444; }\n\n.autocomplete-content li img {\n  height: 40px;\n  width: 40px;\n  margin: 5px 15px; }\n\n[type=\"radio\"]:not(:checked), [type=\"radio\"]:checked {\n  position: absolute;\n  left: -9999px;\n  opacity: 0; }\n\n[type=\"radio\"]:not(:checked) + label, [type=\"radio\"]:checked + label {\n  position: relative;\n  padding-left: 35px;\n  cursor: pointer;\n  display: inline-block;\n  height: 25px;\n  line-height: 25px;\n  font-size: 1rem;\n  transition: .28s ease;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n[type=\"radio\"] + label:before, [type=\"radio\"] + label:after {\n  content: '';\n  position: absolute;\n  left: 0;\n  top: 0;\n  margin: 4px;\n  width: 16px;\n  height: 16px;\n  z-index: 0;\n  transition: .28s ease; }\n\n[type=\"radio\"]:not(:checked) + label:before, [type=\"radio\"]:not(:checked) + label:after, [type=\"radio\"]:checked + label:before, [type=\"radio\"]:checked + label:after, [type=\"radio\"].with-gap:checked + label:before, [type=\"radio\"].with-gap:checked + label:after {\n  border-radius: 50%; }\n\n[type=\"radio\"]:not(:checked) + label:before, [type=\"radio\"]:not(:checked) + label:after {\n  border: 2px solid #5a5a5a; }\n\n[type=\"radio\"]:not(:checked) + label:after {\n  -webkit-transform: scale(0);\n  transform: scale(0); }\n\n[type=\"radio\"]:checked + label:before {\n  border: 2px solid transparent; }\n\n[type=\"radio\"]:checked + label:after, [type=\"radio\"].with-gap:checked + label:before, [type=\"radio\"].with-gap:checked + label:after {\n  border: 2px solid #26a69a; }\n\n[type=\"radio\"]:checked + label:after, [type=\"radio\"].with-gap:checked + label:after {\n  background-color: #26a69a; }\n\n[type=\"radio\"]:checked + label:after {\n  -webkit-transform: scale(1.02);\n  transform: scale(1.02); }\n\n[type=\"radio\"].with-gap:checked + label:after {\n  -webkit-transform: scale(0.5);\n  transform: scale(0.5); }\n\n[type=\"radio\"].tabbed:focus + label:before {\n  box-shadow: 0 0 0 10px rgba(0, 0, 0, 0.1); }\n\n[type=\"radio\"].with-gap:disabled:checked + label:before {\n  border: 2px solid rgba(0, 0, 0, 0.26); }\n\n[type=\"radio\"].with-gap:disabled:checked + label:after {\n  border: none;\n  background-color: rgba(0, 0, 0, 0.26); }\n\n[type=\"radio\"]:disabled:not(:checked) + label:before, [type=\"radio\"]:disabled:checked + label:before {\n  background-color: transparent;\n  border-color: rgba(0, 0, 0, 0.26); }\n\n[type=\"radio\"]:disabled + label {\n  color: rgba(0, 0, 0, 0.26); }\n\n[type=\"radio\"]:disabled:not(:checked) + label:before {\n  border-color: rgba(0, 0, 0, 0.26); }\n\n[type=\"radio\"]:disabled:checked + label:after {\n  background-color: rgba(0, 0, 0, 0.26);\n  border-color: #BDBDBD; }\n\nform p {\n  margin-bottom: 10px;\n  text-align: left; }\n\nform p:last-child {\n  margin-bottom: 0; }\n\n[type=\"checkbox\"]:not(:checked), [type=\"checkbox\"]:checked {\n  position: absolute;\n  left: -9999px;\n  opacity: 0; }\n\n[type=\"checkbox\"] + label {\n  position: relative;\n  padding-left: 35px;\n  cursor: pointer;\n  display: inline-block;\n  height: 25px;\n  line-height: 25px;\n  font-size: 1rem;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -khtml-user-select: none;\n  -ms-user-select: none; }\n\n[type=\"checkbox\"] + label:before, [type=\"checkbox\"]:not(.filled-in) + label:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 18px;\n  height: 18px;\n  z-index: 0;\n  border: 2px solid #5a5a5a;\n  border-radius: 1px;\n  margin-top: 2px;\n  transition: .2s; }\n\n[type=\"checkbox\"]:not(.filled-in) + label:after {\n  border: 0;\n  -webkit-transform: scale(0);\n  transform: scale(0); }\n\n[type=\"checkbox\"]:not(:checked):disabled + label:before {\n  border: none;\n  background-color: rgba(0, 0, 0, 0.26); }\n\n[type=\"checkbox\"].tabbed:focus + label:after {\n  -webkit-transform: scale(1);\n  transform: scale(1);\n  border: 0;\n  border-radius: 50%;\n  box-shadow: 0 0 0 10px rgba(0, 0, 0, 0.1);\n  background-color: rgba(0, 0, 0, 0.1); }\n\n[type=\"checkbox\"]:checked + label:before {\n  top: -4px;\n  left: -5px;\n  width: 12px;\n  height: 22px;\n  border-top: 2px solid transparent;\n  border-left: 2px solid transparent;\n  border-right: 2px solid #26a69a;\n  border-bottom: 2px solid #26a69a;\n  -webkit-transform: rotate(40deg);\n  transform: rotate(40deg);\n  -webkit-backface-visibility: hidden;\n  backface-visibility: hidden;\n  -webkit-transform-origin: 100% 100%;\n  transform-origin: 100% 100%; }\n\n[type=\"checkbox\"]:checked:disabled + label:before {\n  border-right: 2px solid rgba(0, 0, 0, 0.26);\n  border-bottom: 2px solid rgba(0, 0, 0, 0.26); }\n\n[type=\"checkbox\"]:indeterminate + label:before {\n  top: -11px;\n  left: -12px;\n  width: 10px;\n  height: 22px;\n  border-top: none;\n  border-left: none;\n  border-right: 2px solid #26a69a;\n  border-bottom: none;\n  -webkit-transform: rotate(90deg);\n  transform: rotate(90deg);\n  -webkit-backface-visibility: hidden;\n  backface-visibility: hidden;\n  -webkit-transform-origin: 100% 100%;\n  transform-origin: 100% 100%; }\n\n[type=\"checkbox\"]:indeterminate:disabled + label:before {\n  border-right: 2px solid rgba(0, 0, 0, 0.26);\n  background-color: transparent; }\n\n[type=\"checkbox\"].filled-in + label:after {\n  border-radius: 2px; }\n\n[type=\"checkbox\"].filled-in + label:before, [type=\"checkbox\"].filled-in + label:after {\n  content: '';\n  left: 0;\n  position: absolute;\n  transition: border .25s, background-color .25s, width .20s .1s, height .20s .1s, top .20s .1s, left .20s .1s;\n  z-index: 1; }\n\n[type=\"checkbox\"].filled-in:not(:checked) + label:before {\n  width: 0;\n  height: 0;\n  border: 3px solid transparent;\n  left: 6px;\n  top: 10px;\n  -webkit-transform: rotateZ(37deg);\n  transform: rotateZ(37deg);\n  -webkit-transform-origin: 20% 40%;\n  transform-origin: 100% 100%; }\n\n[type=\"checkbox\"].filled-in:not(:checked) + label:after {\n  height: 20px;\n  width: 20px;\n  background-color: transparent;\n  border: 2px solid #5a5a5a;\n  top: 0px;\n  z-index: 0; }\n\n[type=\"checkbox\"].filled-in:checked + label:before {\n  top: 0;\n  left: 1px;\n  width: 8px;\n  height: 13px;\n  border-top: 2px solid transparent;\n  border-left: 2px solid transparent;\n  border-right: 2px solid #fff;\n  border-bottom: 2px solid #fff;\n  -webkit-transform: rotateZ(37deg);\n  transform: rotateZ(37deg);\n  -webkit-transform-origin: 100% 100%;\n  transform-origin: 100% 100%; }\n\n[type=\"checkbox\"].filled-in:checked + label:after {\n  top: 0;\n  width: 20px;\n  height: 20px;\n  border: 2px solid #26a69a;\n  background-color: #26a69a;\n  z-index: 0; }\n\n[type=\"checkbox\"].filled-in.tabbed:focus + label:after {\n  border-radius: 2px;\n  border-color: #5a5a5a;\n  background-color: rgba(0, 0, 0, 0.1); }\n\n[type=\"checkbox\"].filled-in.tabbed:checked:focus + label:after {\n  border-radius: 2px;\n  background-color: #26a69a;\n  border-color: #26a69a; }\n\n[type=\"checkbox\"].filled-in:disabled:not(:checked) + label:before {\n  background-color: transparent;\n  border: 2px solid transparent; }\n\n[type=\"checkbox\"].filled-in:disabled:not(:checked) + label:after {\n  border-color: transparent;\n  background-color: #BDBDBD; }\n\n[type=\"checkbox\"].filled-in:disabled:checked + label:before {\n  background-color: transparent; }\n\n[type=\"checkbox\"].filled-in:disabled:checked + label:after {\n  background-color: #BDBDBD;\n  border-color: #BDBDBD; }\n\n.switch, .switch * {\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -khtml-user-select: none;\n  -ms-user-select: none; }\n\n.switch label {\n  cursor: pointer; }\n\n.switch label input[type=checkbox] {\n  opacity: 0;\n  width: 0;\n  height: 0; }\n\n.switch label input[type=checkbox]:checked + .lever {\n  background-color: #84c7c1; }\n\n.switch label input[type=checkbox]:checked + .lever:after {\n  background-color: #26a69a;\n  left: 24px; }\n\n.switch label .lever {\n  content: \"\";\n  display: inline-block;\n  position: relative;\n  width: 40px;\n  height: 15px;\n  background-color: #818181;\n  border-radius: 15px;\n  margin-right: 10px;\n  transition: background 0.3s ease;\n  vertical-align: middle;\n  margin: 0 16px; }\n\n.switch label .lever:after {\n  content: \"\";\n  position: absolute;\n  display: inline-block;\n  width: 21px;\n  height: 21px;\n  background-color: #F1F1F1;\n  border-radius: 21px;\n  box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.4);\n  left: -5px;\n  top: -3px;\n  transition: left 0.3s ease, background .3s ease, box-shadow 0.1s ease; }\n\ninput[type=checkbox]:checked:not(:disabled) ~ .lever:active::after, input[type=checkbox]:checked:not(:disabled).tabbed:focus ~ .lever::after {\n  box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.4), 0 0 0 15px rgba(38, 166, 154, 0.1); }\n\ninput[type=checkbox]:not(:disabled) ~ .lever:active:after, input[type=checkbox]:not(:disabled).tabbed:focus ~ .lever::after {\n  box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.4), 0 0 0 15px rgba(0, 0, 0, 0.08); }\n\n.switch input[type=checkbox][disabled] + .lever {\n  cursor: default; }\n\n.switch label input[type=checkbox][disabled] + .lever:after, .switch label input[type=checkbox][disabled]:checked + .lever:after {\n  background-color: #BDBDBD; }\n\nselect {\n  display: none; }\n\nselect.browser-default {\n  display: block; }\n\nselect {\n  background-color: rgba(255, 255, 255, 0.9);\n  width: 100%;\n  padding: 5px;\n  border: 1px solid #f2f2f2;\n  border-radius: 2px;\n  height: 3rem; }\n\n.select-label {\n  position: absolute; }\n\n.select-wrapper {\n  position: relative; }\n\n.select-wrapper input.select-dropdown {\n  position: relative;\n  cursor: pointer;\n  background-color: transparent;\n  border: none;\n  border-bottom: 1px solid #9e9e9e;\n  outline: none;\n  height: 3rem;\n  line-height: 3rem;\n  width: 100%;\n  font-size: 1rem;\n  margin: 0 0 20px 0;\n  padding: 0;\n  display: block; }\n\n.select-wrapper span.caret {\n  color: initial;\n  position: absolute;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  height: 10px;\n  margin: auto 0;\n  font-size: 10px;\n  line-height: 10px; }\n\n.select-wrapper span.caret.disabled {\n  color: rgba(0, 0, 0, 0.26); }\n\n.select-wrapper + label {\n  position: absolute;\n  top: -14px;\n  font-size: .8rem; }\n\nselect:disabled {\n  color: rgba(0, 0, 0, 0.3); }\n\n.select-wrapper input.select-dropdown:disabled {\n  color: rgba(0, 0, 0, 0.3);\n  cursor: default;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.3); }\n\n.select-wrapper i {\n  color: rgba(0, 0, 0, 0.3); }\n\n.select-dropdown li.disabled, .select-dropdown li.disabled > span, .select-dropdown li.optgroup {\n  color: rgba(0, 0, 0, 0.3);\n  background-color: transparent; }\n\n.prefix ~ .select-wrapper {\n  margin-left: 3rem;\n  width: 92%;\n  width: calc(100% - 3rem); }\n\n.prefix ~ label {\n  margin-left: 3rem; }\n\n.select-dropdown li img {\n  height: 40px;\n  width: 40px;\n  margin: 5px 15px;\n  float: right; }\n\n.select-dropdown li.optgroup {\n  border-top: 1px solid #eee; }\n\n.select-dropdown li.optgroup.selected > span {\n  color: rgba(0, 0, 0, 0.7); }\n\n.select-dropdown li.optgroup > span {\n  color: rgba(0, 0, 0, 0.4); }\n\n.select-dropdown li.optgroup ~ li.optgroup-option {\n  padding-left: 1rem; }\n\n.file-field {\n  position: relative; }\n\n.file-field .file-path-wrapper {\n  overflow: hidden;\n  padding-left: 10px; }\n\n.file-field input.file-path {\n  width: 100%; }\n\n.file-field .btn, .file-field .btn-large {\n  float: left;\n  height: 3rem;\n  line-height: 3rem; }\n\n.file-field span {\n  cursor: pointer; }\n\n.file-field input[type=file] {\n  position: absolute;\n  top: 0;\n  right: 0;\n  left: 0;\n  bottom: 0;\n  width: 100%;\n  margin: 0;\n  padding: 0;\n  font-size: 20px;\n  cursor: pointer;\n  opacity: 0;\n  filter: alpha(opacity=0); }\n\n.range-field {\n  position: relative; }\n\ninput[type=range], input[type=range] + .thumb {\n  cursor: pointer; }\n\ninput[type=range] {\n  position: relative;\n  background-color: transparent;\n  border: none;\n  outline: none;\n  width: 100%;\n  margin: 15px 0;\n  padding: 0; }\n\ninput[type=range]:focus {\n  outline: none; }\n\ninput[type=range] + .thumb {\n  position: absolute;\n  top: 10px;\n  left: 0;\n  border: none;\n  height: 0;\n  width: 0;\n  border-radius: 50%;\n  background-color: #26a69a;\n  margin-left: 7px;\n  -webkit-transform-origin: 50% 50%;\n  transform-origin: 50% 50%;\n  -webkit-transform: rotate(-45deg);\n  transform: rotate(-45deg); }\n\ninput[type=range] + .thumb .value {\n  display: block;\n  width: 30px;\n  text-align: center;\n  color: #26a69a;\n  font-size: 0;\n  -webkit-transform: rotate(45deg);\n  transform: rotate(45deg); }\n\ninput[type=range] + .thumb.active {\n  border-radius: 50% 50% 50% 0; }\n\ninput[type=range] + .thumb.active .value {\n  color: #fff;\n  margin-left: -1px;\n  margin-top: 8px;\n  font-size: 10px; }\n\ninput[type=range] {\n  -webkit-appearance: none; }\n\ninput[type=range]::-webkit-slider-runnable-track {\n  height: 3px;\n  background: #c2c0c2;\n  border: none; }\n\ninput[type=range]::-webkit-slider-thumb {\n  -webkit-appearance: none;\n  border: none;\n  height: 14px;\n  width: 14px;\n  border-radius: 50%;\n  background-color: #26a69a;\n  -webkit-transform-origin: 50% 50%;\n  transform-origin: 50% 50%;\n  margin: -5px 0 0 0;\n  transition: .3s; }\n\ninput[type=range]:focus::-webkit-slider-runnable-track {\n  background: #ccc; }\n\ninput[type=range] {\n  border: 1px solid white; }\n\ninput[type=range]::-moz-range-track {\n  height: 3px;\n  background: #ddd;\n  border: none; }\n\ninput[type=range]::-moz-range-thumb {\n  border: none;\n  height: 14px;\n  width: 14px;\n  border-radius: 50%;\n  background: #26a69a;\n  margin-top: -5px; }\n\ninput[type=range]:-moz-focusring {\n  outline: 1px solid #fff;\n  outline-offset: -1px; }\n\ninput[type=range]:focus::-moz-range-track {\n  background: #ccc; }\n\ninput[type=range]::-ms-track {\n  height: 3px;\n  background: transparent;\n  border-color: transparent;\n  border-width: 6px 0;\n  color: transparent; }\n\ninput[type=range]::-ms-fill-lower {\n  background: #777; }\n\ninput[type=range]::-ms-fill-upper {\n  background: #ddd; }\n\ninput[type=range]::-ms-thumb {\n  border: none;\n  height: 14px;\n  width: 14px;\n  border-radius: 50%;\n  background: #26a69a; }\n\ninput[type=range]:focus::-ms-fill-lower {\n  background: #888; }\n\ninput[type=range]:focus::-ms-fill-upper {\n  background: #ccc; }\n\n.table-of-contents.fixed {\n  position: fixed; }\n\n.table-of-contents li {\n  padding: 2px 0; }\n\n.table-of-contents a {\n  display: inline-block;\n  font-weight: 300;\n  color: #757575;\n  padding-left: 20px;\n  height: 1.5rem;\n  line-height: 1.5rem;\n  letter-spacing: .4;\n  display: inline-block; }\n\n.table-of-contents a:hover {\n  color: #a8a8a8;\n  padding-left: 19px;\n  border-left: 1px solid #ee6e73; }\n\n.table-of-contents a.active {\n  font-weight: 500;\n  padding-left: 18px;\n  border-left: 2px solid #ee6e73; }\n\n.side-nav {\n  position: fixed;\n  width: 300px;\n  left: 0;\n  top: 0;\n  margin: 0;\n  -webkit-transform: translateX(-100%);\n  transform: translateX(-100%);\n  height: 100%;\n  height: calc(100% + 60px);\n  height: -moz-calc(100%);\n  padding-bottom: 60px;\n  background-color: #fff;\n  z-index: 999;\n  overflow-y: auto;\n  will-change: transform;\n  -webkit-backface-visibility: hidden;\n  backface-visibility: hidden;\n  -webkit-transform: translateX(-105%);\n  transform: translateX(-105%); }\n\n.side-nav.right-aligned {\n  right: 0;\n  -webkit-transform: translateX(105%);\n  transform: translateX(105%);\n  left: auto;\n  -webkit-transform: translateX(100%);\n  transform: translateX(100%); }\n\n.side-nav .collapsible {\n  margin: 0; }\n\n.side-nav li {\n  float: none;\n  line-height: 48px; }\n\n.side-nav li.active {\n  background-color: rgba(0, 0, 0, 0.05); }\n\n.side-nav li > a {\n  color: rgba(0, 0, 0, 0.87);\n  display: block;\n  font-size: 14px;\n  font-weight: 500;\n  height: 48px;\n  line-height: 48px;\n  padding: 0 32px; }\n\n.side-nav li > a:hover {\n  background-color: rgba(0, 0, 0, 0.05); }\n\n.side-nav li > a.btn, .side-nav li > a.btn-large, .side-nav li > a.btn-large, .side-nav li > a.btn-flat, .side-nav li > a.btn-floating {\n  margin: 10px 15px; }\n\n.side-nav li > a.btn, .side-nav li > a.btn-large, .side-nav li > a.btn-large, .side-nav li > a.btn-floating {\n  color: #fff; }\n\n.side-nav li > a.btn-flat {\n  color: #343434; }\n\n.side-nav li > a.btn:hover, .side-nav li > a.btn-large:hover, .side-nav li > a.btn-large:hover {\n  background-color: #2bbbad; }\n\n.side-nav li > a.btn-floating:hover {\n  background-color: #26a69a; }\n\n.side-nav li > a > i, .side-nav li > a > [class^=\"mdi-\"], .side-nav li > a li > a > [class*=\"mdi-\"], .side-nav li > a > i.material-icons {\n  float: left;\n  height: 48px;\n  line-height: 48px;\n  margin: 0 32px 0 0;\n  width: 24px;\n  color: rgba(0, 0, 0, 0.54); }\n\n.side-nav .divider {\n  margin: 8px 0 0 0; }\n\n.side-nav .subheader {\n  cursor: initial;\n  pointer-events: none;\n  color: rgba(0, 0, 0, 0.54);\n  font-size: 14px;\n  font-weight: 500;\n  line-height: 48px; }\n\n.side-nav .subheader:hover {\n  background-color: transparent; }\n\n.side-nav .userView {\n  position: relative;\n  padding: 32px 32px 0;\n  margin-bottom: 8px; }\n\n.side-nav .userView > a {\n  height: auto;\n  padding: 0; }\n\n.side-nav .userView > a:hover {\n  background-color: transparent; }\n\n.side-nav .userView .background {\n  overflow: hidden;\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: -1; }\n\n.side-nav .userView .circle, .side-nav .userView .name, .side-nav .userView .email {\n  display: block; }\n\n.side-nav .userView .circle {\n  height: 64px;\n  width: 64px; }\n\n.side-nav .userView .name, .side-nav .userView .email {\n  font-size: 14px;\n  line-height: 24px; }\n\n.side-nav .userView .name {\n  margin-top: 16px;\n  font-weight: 500; }\n\n.side-nav .userView .email {\n  padding-bottom: 16px;\n  font-weight: 400; }\n\n.drag-target {\n  height: 100%;\n  width: 10px;\n  position: fixed;\n  top: 0;\n  z-index: 998; }\n\n.side-nav.fixed {\n  left: 0;\n  -webkit-transform: translateX(0);\n  transform: translateX(0);\n  position: fixed; }\n\n.side-nav.fixed.right-aligned {\n  right: 0;\n  left: auto; }\n\n@media only screen and (max-width: 992px) {\n  .side-nav.fixed {\n    -webkit-transform: translateX(-105%);\n    transform: translateX(-105%); }\n  .side-nav.fixed.right-aligned {\n    -webkit-transform: translateX(105%);\n    transform: translateX(105%); }\n  .side-nav a {\n    padding: 0 16px; }\n  .side-nav .userView {\n    padding: 16px 16px 0; } }\n\n.side-nav .collapsible-body > ul:not(.collapsible) > li.active, .side-nav.fixed .collapsible-body > ul:not(.collapsible) > li.active {\n  background-color: #ee6e73; }\n\n.side-nav .collapsible-body > ul:not(.collapsible) > li.active a, .side-nav.fixed .collapsible-body > ul:not(.collapsible) > li.active a {\n  color: #fff; }\n\n.side-nav .collapsible-body {\n  padding: 0; }\n\n#sidenav-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 120vh;\n  background-color: rgba(0, 0, 0, 0.5);\n  z-index: 997;\n  will-change: opacity; }\n\n.preloader-wrapper {\n  display: inline-block;\n  position: relative;\n  width: 50px;\n  height: 50px; }\n\n.preloader-wrapper.small {\n  width: 36px;\n  height: 36px; }\n\n.preloader-wrapper.big {\n  width: 64px;\n  height: 64px; }\n\n.preloader-wrapper.active {\n  -webkit-animation: container-rotate 1568ms linear infinite;\n  animation: container-rotate 1568ms linear infinite; }\n\n@-webkit-keyframes container-rotate {\n  to {\n    -webkit-transform: rotate(360deg); } }\n\n@keyframes container-rotate {\n  to {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg); } }\n\n.spinner-layer {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  opacity: 0;\n  border-color: #26a69a; }\n\n.spinner-blue, .spinner-blue-only {\n  border-color: #4285f4; }\n\n.spinner-red, .spinner-red-only {\n  border-color: #db4437; }\n\n.spinner-yellow, .spinner-yellow-only {\n  border-color: #f4b400; }\n\n.spinner-green, .spinner-green-only {\n  border-color: #0f9d58; }\n\n.active .spinner-layer.spinner-blue {\n  -webkit-animation: fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both, blue-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;\n  animation: fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both, blue-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both; }\n\n.active .spinner-layer.spinner-red {\n  -webkit-animation: fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both, red-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;\n  animation: fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both, red-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both; }\n\n.active .spinner-layer.spinner-yellow {\n  -webkit-animation: fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both, yellow-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;\n  animation: fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both, yellow-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both; }\n\n.active .spinner-layer.spinner-green {\n  -webkit-animation: fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both, green-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;\n  animation: fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both, green-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both; }\n\n.active .spinner-layer, .active .spinner-layer.spinner-blue-only, .active .spinner-layer.spinner-red-only, .active .spinner-layer.spinner-yellow-only, .active .spinner-layer.spinner-green-only {\n  opacity: 1;\n  -webkit-animation: fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;\n  animation: fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both; }\n\n@-webkit-keyframes fill-unfill-rotate {\n  12.5% {\n    -webkit-transform: rotate(135deg); }\n  25% {\n    -webkit-transform: rotate(270deg); }\n  37.5% {\n    -webkit-transform: rotate(405deg); }\n  50% {\n    -webkit-transform: rotate(540deg); }\n  62.5% {\n    -webkit-transform: rotate(675deg); }\n  75% {\n    -webkit-transform: rotate(810deg); }\n  87.5% {\n    -webkit-transform: rotate(945deg); }\n  to {\n    -webkit-transform: rotate(1080deg); } }\n\n@keyframes fill-unfill-rotate {\n  12.5% {\n    -webkit-transform: rotate(135deg);\n    transform: rotate(135deg); }\n  25% {\n    -webkit-transform: rotate(270deg);\n    transform: rotate(270deg); }\n  37.5% {\n    -webkit-transform: rotate(405deg);\n    transform: rotate(405deg); }\n  50% {\n    -webkit-transform: rotate(540deg);\n    transform: rotate(540deg); }\n  62.5% {\n    -webkit-transform: rotate(675deg);\n    transform: rotate(675deg); }\n  75% {\n    -webkit-transform: rotate(810deg);\n    transform: rotate(810deg); }\n  87.5% {\n    -webkit-transform: rotate(945deg);\n    transform: rotate(945deg); }\n  to {\n    -webkit-transform: rotate(1080deg);\n    transform: rotate(1080deg); } }\n\n@-webkit-keyframes blue-fade-in-out {\n  from {\n    opacity: 1; }\n  25% {\n    opacity: 1; }\n  26% {\n    opacity: 0; }\n  89% {\n    opacity: 0; }\n  90% {\n    opacity: 1; }\n  100% {\n    opacity: 1; } }\n\n@keyframes blue-fade-in-out {\n  from {\n    opacity: 1; }\n  25% {\n    opacity: 1; }\n  26% {\n    opacity: 0; }\n  89% {\n    opacity: 0; }\n  90% {\n    opacity: 1; }\n  100% {\n    opacity: 1; } }\n\n@-webkit-keyframes red-fade-in-out {\n  from {\n    opacity: 0; }\n  15% {\n    opacity: 0; }\n  25% {\n    opacity: 1; }\n  50% {\n    opacity: 1; }\n  51% {\n    opacity: 0; } }\n\n@keyframes red-fade-in-out {\n  from {\n    opacity: 0; }\n  15% {\n    opacity: 0; }\n  25% {\n    opacity: 1; }\n  50% {\n    opacity: 1; }\n  51% {\n    opacity: 0; } }\n\n@-webkit-keyframes yellow-fade-in-out {\n  from {\n    opacity: 0; }\n  40% {\n    opacity: 0; }\n  50% {\n    opacity: 1; }\n  75% {\n    opacity: 1; }\n  76% {\n    opacity: 0; } }\n\n@keyframes yellow-fade-in-out {\n  from {\n    opacity: 0; }\n  40% {\n    opacity: 0; }\n  50% {\n    opacity: 1; }\n  75% {\n    opacity: 1; }\n  76% {\n    opacity: 0; } }\n\n@-webkit-keyframes green-fade-in-out {\n  from {\n    opacity: 0; }\n  65% {\n    opacity: 0; }\n  75% {\n    opacity: 1; }\n  90% {\n    opacity: 1; }\n  100% {\n    opacity: 0; } }\n\n@keyframes green-fade-in-out {\n  from {\n    opacity: 0; }\n  65% {\n    opacity: 0; }\n  75% {\n    opacity: 1; }\n  90% {\n    opacity: 1; }\n  100% {\n    opacity: 0; } }\n\n.gap-patch {\n  position: absolute;\n  top: 0;\n  left: 45%;\n  width: 10%;\n  height: 100%;\n  overflow: hidden;\n  border-color: inherit; }\n\n.gap-patch .circle {\n  width: 1000%;\n  left: -450%; }\n\n.circle-clipper {\n  display: inline-block;\n  position: relative;\n  width: 50%;\n  height: 100%;\n  overflow: hidden;\n  border-color: inherit; }\n\n.circle-clipper .circle {\n  width: 200%;\n  height: 100%;\n  border-width: 3px;\n  border-style: solid;\n  border-color: inherit;\n  border-bottom-color: transparent !important;\n  border-radius: 50%;\n  -webkit-animation: none;\n  animation: none;\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0; }\n\n.circle-clipper.left .circle {\n  left: 0;\n  border-right-color: transparent !important;\n  -webkit-transform: rotate(129deg);\n  transform: rotate(129deg); }\n\n.circle-clipper.right .circle {\n  left: -100%;\n  border-left-color: transparent !important;\n  -webkit-transform: rotate(-129deg);\n  transform: rotate(-129deg); }\n\n.active .circle-clipper.left .circle {\n  -webkit-animation: left-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;\n  animation: left-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both; }\n\n.active .circle-clipper.right .circle {\n  -webkit-animation: right-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;\n  animation: right-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both; }\n\n@-webkit-keyframes left-spin {\n  from {\n    -webkit-transform: rotate(130deg); }\n  50% {\n    -webkit-transform: rotate(-5deg); }\n  to {\n    -webkit-transform: rotate(130deg); } }\n\n@keyframes left-spin {\n  from {\n    -webkit-transform: rotate(130deg);\n    transform: rotate(130deg); }\n  50% {\n    -webkit-transform: rotate(-5deg);\n    transform: rotate(-5deg); }\n  to {\n    -webkit-transform: rotate(130deg);\n    transform: rotate(130deg); } }\n\n@-webkit-keyframes right-spin {\n  from {\n    -webkit-transform: rotate(-130deg); }\n  50% {\n    -webkit-transform: rotate(5deg); }\n  to {\n    -webkit-transform: rotate(-130deg); } }\n\n@keyframes right-spin {\n  from {\n    -webkit-transform: rotate(-130deg);\n    transform: rotate(-130deg); }\n  50% {\n    -webkit-transform: rotate(5deg);\n    transform: rotate(5deg); }\n  to {\n    -webkit-transform: rotate(-130deg);\n    transform: rotate(-130deg); } }\n\n#spinnerContainer.cooldown {\n  -webkit-animation: container-rotate 1568ms linear infinite, fade-out 400ms cubic-bezier(0.4, 0, 0.2, 1);\n  animation: container-rotate 1568ms linear infinite, fade-out 400ms cubic-bezier(0.4, 0, 0.2, 1); }\n\n@-webkit-keyframes fade-out {\n  from {\n    opacity: 1; }\n  to {\n    opacity: 0; } }\n\n@keyframes fade-out {\n  from {\n    opacity: 1; }\n  to {\n    opacity: 0; } }\n\n.slider {\n  position: relative;\n  height: 400px;\n  width: 100%; }\n\n.slider.fullscreen {\n  height: 100%;\n  width: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0; }\n\n.slider.fullscreen ul.slides {\n  height: 100%; }\n\n.slider.fullscreen ul.indicators {\n  z-index: 2;\n  bottom: 30px; }\n\n.slider .slides {\n  background-color: #9e9e9e;\n  margin: 0;\n  height: 400px; }\n\n.slider .slides li {\n  opacity: 0;\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 1;\n  width: 100%;\n  height: inherit;\n  overflow: hidden; }\n\n.slider .slides li img {\n  height: 100%;\n  width: 100%;\n  background-size: cover;\n  background-position: center; }\n\n.slider .slides li .caption {\n  color: #fff;\n  position: absolute;\n  top: 15%;\n  left: 15%;\n  width: 70%;\n  opacity: 0; }\n\n.slider .slides li .caption p {\n  color: #e0e0e0; }\n\n.slider .slides li.active {\n  z-index: 2; }\n\n.slider .indicators {\n  position: absolute;\n  text-align: center;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  margin: 0; }\n\n.slider .indicators .indicator-item {\n  display: inline-block;\n  position: relative;\n  cursor: pointer;\n  height: 16px;\n  width: 16px;\n  margin: 0 12px;\n  background-color: #e0e0e0;\n  transition: background-color .3s;\n  border-radius: 50%; }\n\n.slider .indicators .indicator-item.active {\n  background-color: #4CAF50; }\n\n.carousel {\n  overflow: hidden;\n  position: relative;\n  width: 100%;\n  height: 400px;\n  -webkit-perspective: 500px;\n  perspective: 500px;\n  -webkit-transform-style: preserve-3d;\n  transform-style: preserve-3d;\n  -webkit-transform-origin: 0% 50%;\n  transform-origin: 0% 50%; }\n\n.carousel.carousel-slider {\n  top: 0;\n  left: 0;\n  height: 0; }\n\n.carousel.carousel-slider .carousel-fixed-item {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 20px;\n  z-index: 1; }\n\n.carousel.carousel-slider .carousel-fixed-item.with-indicators {\n  bottom: 68px; }\n\n.carousel.carousel-slider .carousel-item {\n  width: 100%;\n  height: 100%;\n  min-height: 400px;\n  position: absolute;\n  top: 0;\n  left: 0; }\n\n.carousel.carousel-slider .carousel-item h2 {\n  font-size: 24px;\n  font-weight: 500;\n  line-height: 32px; }\n\n.carousel.carousel-slider .carousel-item p {\n  font-size: 15px; }\n\n.carousel .carousel-item {\n  display: none;\n  width: 200px;\n  height: 200px;\n  position: absolute;\n  top: 0;\n  left: 0; }\n\n.carousel .carousel-item > img {\n  width: 100%; }\n\n.carousel .indicators {\n  position: absolute;\n  text-align: center;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  margin: 0; }\n\n.carousel .indicators .indicator-item {\n  display: inline-block;\n  position: relative;\n  cursor: pointer;\n  height: 8px;\n  width: 8px;\n  margin: 24px 4px;\n  background-color: rgba(255, 255, 255, 0.5);\n  transition: background-color .3s;\n  border-radius: 50%; }\n\n.carousel .indicators .indicator-item.active {\n  background-color: #fff; }\n\n.carousel.scrolling .carousel-item .materialboxed, .carousel .carousel-item:not(.active) .materialboxed {\n  pointer-events: none; }\n\n.tap-target-wrapper {\n  width: 800px;\n  height: 800px;\n  position: fixed;\n  z-index: 1000;\n  visibility: hidden;\n  transition: visibility 0s .3s; }\n\n.tap-target-wrapper.open {\n  visibility: visible;\n  transition: visibility 0s; }\n\n.tap-target-wrapper.open .tap-target {\n  -webkit-transform: scale(1);\n  transform: scale(1);\n  opacity: .95;\n  transition: opacity 0.3s cubic-bezier(0.42, 0, 0.58, 1), -webkit-transform 0.3s cubic-bezier(0.42, 0, 0.58, 1);\n  transition: transform 0.3s cubic-bezier(0.42, 0, 0.58, 1), opacity 0.3s cubic-bezier(0.42, 0, 0.58, 1);\n  transition: transform 0.3s cubic-bezier(0.42, 0, 0.58, 1), opacity 0.3s cubic-bezier(0.42, 0, 0.58, 1), -webkit-transform 0.3s cubic-bezier(0.42, 0, 0.58, 1); }\n\n.tap-target-wrapper.open .tap-target-wave::before {\n  -webkit-transform: scale(1);\n  transform: scale(1); }\n\n.tap-target-wrapper.open .tap-target-wave::after {\n  visibility: visible;\n  -webkit-animation: pulse-animation 1s cubic-bezier(0.24, 0, 0.38, 1) infinite;\n  animation: pulse-animation 1s cubic-bezier(0.24, 0, 0.38, 1) infinite;\n  transition: opacity .3s, visibility 0s 1s, -webkit-transform .3s;\n  transition: opacity .3s, transform .3s, visibility 0s 1s;\n  transition: opacity .3s, transform .3s, visibility 0s 1s, -webkit-transform .3s; }\n\n.tap-target {\n  position: absolute;\n  font-size: 1rem;\n  border-radius: 50%;\n  background-color: #ee6e73;\n  box-shadow: 0 20px 20px 0 rgba(0, 0, 0, 0.14), 0 10px 50px 0 rgba(0, 0, 0, 0.12), 0 30px 10px -20px rgba(0, 0, 0, 0.2);\n  width: 100%;\n  height: 100%;\n  opacity: 0;\n  -webkit-transform: scale(0);\n  transform: scale(0);\n  transition: opacity 0.3s cubic-bezier(0.42, 0, 0.58, 1), -webkit-transform 0.3s cubic-bezier(0.42, 0, 0.58, 1);\n  transition: transform 0.3s cubic-bezier(0.42, 0, 0.58, 1), opacity 0.3s cubic-bezier(0.42, 0, 0.58, 1);\n  transition: transform 0.3s cubic-bezier(0.42, 0, 0.58, 1), opacity 0.3s cubic-bezier(0.42, 0, 0.58, 1), -webkit-transform 0.3s cubic-bezier(0.42, 0, 0.58, 1); }\n\n.tap-target-content {\n  position: relative;\n  display: table-cell; }\n\n.tap-target-wave {\n  position: absolute;\n  border-radius: 50%;\n  z-index: 10001; }\n\n.tap-target-wave::before, .tap-target-wave::after {\n  content: '';\n  display: block;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  border-radius: 50%;\n  background-color: #ffffff; }\n\n.tap-target-wave::before {\n  -webkit-transform: scale(0);\n  transform: scale(0);\n  transition: -webkit-transform .3s;\n  transition: transform .3s;\n  transition: transform .3s, -webkit-transform .3s; }\n\n.tap-target-wave::after {\n  visibility: hidden;\n  transition: opacity .3s, visibility 0s, -webkit-transform .3s;\n  transition: opacity .3s, transform .3s, visibility 0s;\n  transition: opacity .3s, transform .3s, visibility 0s, -webkit-transform .3s;\n  z-index: -1; }\n\n.tap-target-origin {\n  top: 50%;\n  left: 50%;\n  -webkit-transform: translate(-50%, -50%);\n  transform: translate(-50%, -50%);\n  z-index: 10002;\n  position: absolute !important; }\n\n.tap-target-origin:not(.btn):not(.btn-large), .tap-target-origin:not(.btn):not(.btn-large):hover {\n  background: none; }\n\n@media only screen and (max-width: 600px) {\n  .tap-target, .tap-target-wrapper {\n    width: 600px;\n    height: 600px; } }\n\n.pulse {\n  overflow: initial;\n  position: relative; }\n\n.pulse::before {\n  content: '';\n  display: block;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  background-color: inherit;\n  border-radius: inherit;\n  transition: opacity .3s, -webkit-transform .3s;\n  transition: opacity .3s, transform .3s;\n  transition: opacity .3s, transform .3s, -webkit-transform .3s;\n  -webkit-animation: pulse-animation 1s cubic-bezier(0.24, 0, 0.38, 1) infinite;\n  animation: pulse-animation 1s cubic-bezier(0.24, 0, 0.38, 1) infinite;\n  z-index: -1; }\n\n@-webkit-keyframes pulse-animation {\n  0% {\n    opacity: 1;\n    -webkit-transform: scale(1);\n    transform: scale(1); }\n  50% {\n    opacity: 0;\n    -webkit-transform: scale(1.5);\n    transform: scale(1.5); }\n  100% {\n    opacity: 0;\n    -webkit-transform: scale(1.5);\n    transform: scale(1.5); } }\n\n@keyframes pulse-animation {\n  0% {\n    opacity: 1;\n    -webkit-transform: scale(1);\n    transform: scale(1); }\n  50% {\n    opacity: 0;\n    -webkit-transform: scale(1.5);\n    transform: scale(1.5); }\n  100% {\n    opacity: 0;\n    -webkit-transform: scale(1.5);\n    transform: scale(1.5); } }\n\n.picker {\n  font-size: 16px;\n  text-align: left;\n  line-height: 1.2;\n  color: #000000;\n  position: absolute;\n  z-index: 10000;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.picker__input {\n  cursor: default; }\n\n.picker__input.picker__input--active {\n  border-color: #0089ec; }\n\n.picker__holder {\n  width: 100%;\n  overflow-y: auto;\n  -webkit-overflow-scrolling: touch; }\n\n/*!\n * Default mobile-first, responsive styling for pickadate.js\n * Demo: http://amsul.github.io/pickadate.js\n */\n.picker__holder, .picker__frame {\n  bottom: 0;\n  left: 0;\n  right: 0;\n  top: 100%; }\n\n.picker__holder {\n  position: fixed;\n  transition: background 0.15s ease-out, top 0s 0.15s;\n  -webkit-backface-visibility: hidden; }\n\n.picker__frame {\n  position: absolute;\n  margin: 0 auto;\n  min-width: 256px;\n  width: 300px;\n  max-height: 350px;\n  -ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)\";\n  filter: alpha(opacity=0);\n  -moz-opacity: 0;\n  opacity: 0;\n  transition: all 0.15s ease-out; }\n\n@media (min-height: 28.875em) {\n  .picker__frame {\n    overflow: visible;\n    top: auto;\n    bottom: -100%;\n    max-height: 80%; } }\n\n@media (min-height: 40.125em) {\n  .picker__frame {\n    margin-bottom: 7.5%; } }\n\n.picker__wrap {\n  display: table;\n  width: 100%;\n  height: 100%; }\n\n@media (min-height: 28.875em) {\n  .picker__wrap {\n    display: block; } }\n\n.picker__box {\n  background: #ffffff;\n  display: table-cell;\n  vertical-align: middle; }\n\n@media (min-height: 28.875em) {\n  .picker__box {\n    display: block;\n    border: 1px solid #777777;\n    border-top-color: #898989;\n    border-bottom-width: 0;\n    border-radius: 5px 5px 0 0;\n    box-shadow: 0 12px 36px 16px rgba(0, 0, 0, 0.24); } }\n\n.picker--opened .picker__holder {\n  top: 0;\n  background: transparent;\n  -ms-filter: \"progid:DXImageTransform.Microsoft.gradient(startColorstr=#1E000000,endColorstr=#1E000000)\";\n  zoom: 1;\n  background: rgba(0, 0, 0, 0.32);\n  transition: background 0.15s ease-out; }\n\n.picker--opened .picker__frame {\n  top: 0;\n  -ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=100)\";\n  filter: alpha(opacity=100);\n  -moz-opacity: 1;\n  opacity: 1; }\n\n@media (min-height: 35.875em) {\n  .picker--opened .picker__frame {\n    top: 10%;\n    bottom: auto; } }\n\n.picker__input.picker__input--active {\n  border-color: #E3F2FD; }\n\n.picker__frame {\n  margin: 0 auto;\n  max-width: 325px; }\n\n@media (min-height: 38.875em) {\n  .picker--opened .picker__frame {\n    top: 10%;\n    bottom: auto; } }\n\n.picker__box {\n  padding: 0 1em; }\n\n.picker__header {\n  text-align: center;\n  position: relative;\n  margin-top: .75em; }\n\n.picker__month, .picker__year {\n  display: inline-block;\n  margin-left: .25em;\n  margin-right: .25em; }\n\n.picker__select--month, .picker__select--year {\n  height: 2em;\n  padding: 0;\n  margin-left: .25em;\n  margin-right: .25em; }\n\n.picker__select--month.browser-default {\n  display: inline;\n  background-color: #FFFFFF;\n  width: 40%; }\n\n.picker__select--year.browser-default {\n  display: inline;\n  background-color: #FFFFFF;\n  width: 26%; }\n\n.picker__select--month:focus, .picker__select--year:focus {\n  border-color: rgba(0, 0, 0, 0.05); }\n\n.picker__nav--prev, .picker__nav--next {\n  position: absolute;\n  padding: .5em 1.25em;\n  width: 1em;\n  height: 1em;\n  box-sizing: content-box;\n  top: -0.25em; }\n\n.picker__nav--prev {\n  left: -1em;\n  padding-right: 1.25em; }\n\n.picker__nav--next {\n  right: -1em;\n  padding-left: 1.25em; }\n\n.picker__nav--disabled, .picker__nav--disabled:hover, .picker__nav--disabled:before, .picker__nav--disabled:before:hover {\n  cursor: default;\n  background: none;\n  border-right-color: #f5f5f5;\n  border-left-color: #f5f5f5; }\n\n.picker__table {\n  text-align: center;\n  border-collapse: collapse;\n  border-spacing: 0;\n  table-layout: fixed;\n  font-size: 1rem;\n  width: 100%;\n  margin-top: .75em;\n  margin-bottom: .5em; }\n\n.picker__table th, .picker__table td {\n  text-align: center; }\n\n.picker__table td {\n  margin: 0;\n  padding: 0; }\n\n.picker__weekday {\n  width: 14.285714286%;\n  font-size: .75em;\n  padding-bottom: .25em;\n  color: #999999;\n  font-weight: 500; }\n\n@media (min-height: 33.875em) {\n  .picker__weekday {\n    padding-bottom: .5em; } }\n\n.picker__day--today {\n  position: relative;\n  color: #595959;\n  letter-spacing: -.3;\n  padding: .75rem 0;\n  font-weight: 400;\n  border: 1px solid transparent; }\n\n.picker__day--disabled:before {\n  border-top-color: #aaaaaa; }\n\n.picker__day--infocus:hover {\n  cursor: pointer;\n  color: #000;\n  font-weight: 500; }\n\n.picker__day--outfocus {\n  display: none;\n  padding: .75rem 0;\n  color: #fff; }\n\n.picker__day--outfocus:hover {\n  cursor: pointer;\n  color: #dddddd;\n  font-weight: 500; }\n\n.picker__day--highlighted:hover, .picker--focused .picker__day--highlighted {\n  cursor: pointer; }\n\n.picker__day--selected, .picker__day--selected:hover, .picker--focused .picker__day--selected {\n  border-radius: 50%;\n  -webkit-transform: scale(0.75);\n  transform: scale(0.75);\n  background: #0089ec;\n  color: #ffffff; }\n\n.picker__day--disabled, .picker__day--disabled:hover, .picker--focused .picker__day--disabled {\n  background: #f5f5f5;\n  border-color: #f5f5f5;\n  color: #dddddd;\n  cursor: default; }\n\n.picker__day--highlighted.picker__day--disabled, .picker__day--highlighted.picker__day--disabled:hover {\n  background: #bbbbbb; }\n\n.picker__footer {\n  text-align: center;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-align-items: center;\n  -ms-flex-align: center;\n  align-items: center;\n  -webkit-justify-content: space-between;\n  -ms-flex-pack: justify;\n  justify-content: space-between; }\n\n.picker__button--today, .picker__button--clear, .picker__button--close {\n  border: 1px solid #ffffff;\n  background: #ffffff;\n  font-size: .8em;\n  padding: .66em 0;\n  font-weight: bold;\n  width: 33%;\n  display: inline-block;\n  vertical-align: bottom; }\n\n.picker__button--today:hover, .picker__button--clear:hover, .picker__button--close:hover {\n  cursor: pointer;\n  color: #000000;\n  background: #b1dcfb;\n  border-bottom-color: #b1dcfb; }\n\n.picker__button--today:focus, .picker__button--clear:focus, .picker__button--close:focus {\n  background: #b1dcfb;\n  border-color: rgba(0, 0, 0, 0.05);\n  outline: none; }\n\n.picker__button--today:before, .picker__button--clear:before, .picker__button--close:before {\n  position: relative;\n  display: inline-block;\n  height: 0; }\n\n.picker__button--today:before, .picker__button--clear:before {\n  content: \" \";\n  margin-right: .45em; }\n\n.picker__button--today:before {\n  top: -0.05em;\n  width: 0;\n  border-top: 0.66em solid #0059bc;\n  border-left: .66em solid transparent; }\n\n.picker__button--clear:before {\n  top: -0.25em;\n  width: .66em;\n  border-top: 3px solid #ee2200; }\n\n.picker__button--close:before {\n  content: \"\\D7\";\n  top: -0.1em;\n  vertical-align: top;\n  font-size: 1.1em;\n  margin-right: .35em;\n  color: #777777; }\n\n.picker__button--today[disabled], .picker__button--today[disabled]:hover {\n  background: #f5f5f5;\n  border-color: #f5f5f5;\n  color: #dddddd;\n  cursor: default; }\n\n.picker__button--today[disabled]:before {\n  border-top-color: #aaaaaa; }\n\n.picker__box {\n  border-radius: 2px;\n  overflow: hidden; }\n\n.picker__date-display {\n  text-align: center;\n  background-color: #26a69a;\n  color: #fff;\n  padding-bottom: 15px;\n  font-weight: 300; }\n\n.picker__nav--prev:hover, .picker__nav--next:hover {\n  cursor: pointer;\n  color: #000000;\n  background: #a1ded8; }\n\n.picker__weekday-display {\n  background-color: #1f897f;\n  padding: 10px;\n  font-weight: 200;\n  letter-spacing: .5;\n  font-size: 1rem;\n  margin-bottom: 15px; }\n\n.picker__month-display {\n  text-transform: uppercase;\n  font-size: 2rem; }\n\n.picker__day-display {\n  font-size: 4.5rem;\n  font-weight: 400; }\n\n.picker__year-display {\n  font-size: 1.8rem;\n  color: rgba(255, 255, 255, 0.4); }\n\n.picker__box {\n  padding: 0; }\n\n.picker__calendar-container {\n  padding: 0 1rem; }\n\n.picker__calendar-container thead {\n  border: none; }\n\n.picker__table {\n  margin-top: 0;\n  margin-bottom: .5em; }\n\n.picker__day--infocus {\n  color: #595959;\n  letter-spacing: -.3;\n  padding: .75rem 0;\n  font-weight: 400;\n  border: 1px solid transparent; }\n\n.picker__day.picker__day--today {\n  color: #26a69a; }\n\n.picker__day.picker__day--today.picker__day--selected {\n  color: #fff; }\n\n.picker__weekday {\n  font-size: .9rem; }\n\n.picker__day--selected, .picker__day--selected:hover, .picker--focused .picker__day--selected {\n  border-radius: 50%;\n  -webkit-transform: scale(0.9);\n  transform: scale(0.9);\n  background-color: #26a69a;\n  color: #ffffff; }\n\n.picker__day--selected.picker__day--outfocus, .picker__day--selected:hover.picker__day--outfocus, .picker--focused .picker__day--selected.picker__day--outfocus {\n  background-color: #a1ded8; }\n\n.picker__footer {\n  text-align: right;\n  padding: 5px 10px; }\n\n.picker__close, .picker__today {\n  font-size: 1.1rem;\n  padding: 0 1rem;\n  color: #26a69a; }\n\n.picker__nav--prev:before, .picker__nav--next:before {\n  content: \" \";\n  border-top: .5em solid transparent;\n  border-bottom: .5em solid transparent;\n  border-right: 0.75em solid #676767;\n  width: 0;\n  height: 0;\n  display: block;\n  margin: 0 auto; }\n\n.picker__nav--next:before {\n  border-right: 0;\n  border-left: 0.75em solid #676767; }\n\nbutton.picker__today:focus, button.picker__clear:focus, button.picker__close:focus {\n  background-color: #a1ded8; }\n\n.picker__list {\n  list-style: none;\n  padding: 0.75em 0 4.2em;\n  margin: 0; }\n\n.picker__list-item {\n  border-bottom: 1px solid #dddddd;\n  border-top: 1px solid #dddddd;\n  margin-bottom: -1px;\n  position: relative;\n  background: #ffffff;\n  padding: .75em 1.25em; }\n\n@media (min-height: 46.75em) {\n  .picker__list-item {\n    padding: .5em 1em; } }\n\n.picker__list-item:hover {\n  cursor: pointer;\n  color: #000000;\n  background: #b1dcfb;\n  border-color: #0089ec;\n  z-index: 10; }\n\n.picker__list-item--highlighted {\n  border-color: #0089ec;\n  z-index: 10; }\n\n.picker__list-item--highlighted:hover, .picker--focused .picker__list-item--highlighted {\n  cursor: pointer;\n  color: #000000;\n  background: #b1dcfb; }\n\n.picker__list-item--selected, .picker__list-item--selected:hover, .picker--focused .picker__list-item--selected {\n  background: #0089ec;\n  color: #ffffff;\n  z-index: 10; }\n\n.picker__list-item--disabled, .picker__list-item--disabled:hover, .picker--focused .picker__list-item--disabled {\n  background: #f5f5f5;\n  border-color: #f5f5f5;\n  color: #dddddd;\n  cursor: default;\n  border-color: #dddddd;\n  z-index: auto; }\n\n.picker--time .picker__button--clear {\n  display: block;\n  width: 80%;\n  margin: 1em auto 0;\n  padding: 1em 1.25em;\n  background: none;\n  border: 0;\n  font-weight: 500;\n  font-size: .67em;\n  text-align: center;\n  text-transform: uppercase;\n  color: #666; }\n\n.picker--time .picker__button--clear:hover, .picker--time .picker__button--clear:focus {\n  color: #000000;\n  background: #b1dcfb;\n  background: #ee2200;\n  border-color: #ee2200;\n  cursor: pointer;\n  color: #ffffff;\n  outline: none; }\n\n.picker--time .picker__button--clear:before {\n  top: -0.25em;\n  color: #666;\n  font-size: 1.25em;\n  font-weight: bold; }\n\n.picker--time .picker__button--clear:hover:before, .picker--time .picker__button--clear:focus:before {\n  color: #ffffff; }\n\n.picker--time .picker__frame {\n  min-width: 256px;\n  max-width: 320px; }\n\n.picker--time .picker__box {\n  font-size: 1em;\n  background: #f2f2f2;\n  padding: 0; }\n\n@media (min-height: 40.125em) {\n  .picker--time .picker__box {\n    margin-bottom: 5em; } }\n\nbody {\n  background-color: #fcfcfc; }\n\np.box {\n  padding: 20px; }\n\np {\n  color: rgba(0, 0, 0, 0.71);\n  padding: 0;\n  -webkit-font-smoothing: antialiased; }\n\nh1, h2, h3, h4, h5, h6 {\n  -webkit-font-smoothing: antialiased; }\n\nh5 > span {\n  font-size: 14px;\n  margin-left: 15px;\n  color: #777; }\n\nnav a {\n  -webkit-font-smoothing: antialiased; }\n\nnav ul li a:hover, nav ul li.active {\n  background-color: #ea454b; }\n\n.header {\n  color: #ee6e73;\n  font-weight: 300; }\n\n.caption {\n  font-size: 1.25rem;\n  font-weight: 300;\n  margin-bottom: 30px; }\n\n.preview {\n  background-color: #FFF;\n  border: 1px solid #eee;\n  padding: 20px 20px; }\n\nheader, main, footer {\n  padding-left: 300px; }\n\n.parallax-demo header, .parallax-demo main, .parallax-demo footer {\n  padding-left: 0; }\n\nfooter.example {\n  padding-left: 0; }\n\n@media only screen and (max-width: 992px) {\n  header, main, footer {\n    padding-left: 0; }\n  h5 > span {\n    display: block;\n    margin: 0 0 15px 0; } }\n\nul.side-nav.fixed li.logo {\n  text-align: center;\n  margin-top: 32px;\n  margin-bottom: 80px; }\n\nul.side-nav.fixed li.logo:hover, ul.side-nav.fixed li.logo #logo-container:hover {\n  background-color: transparent; }\n\nul.side-nav.fixed {\n  overflow: hidden; }\n\nul.side-nav.fixed li {\n  line-height: 44px; }\n\nul.side-nav.fixed li.active {\n  background-color: rgba(0, 0, 0, 0.05); }\n\nul.side-nav.fixed li a {\n  font-size: 13px;\n  line-height: 44px;\n  height: 44px;\n  padding: 0 30px; }\n\nul.side-nav.fixed ul.collapsible-accordion {\n  background-color: #FFF; }\n\nul.side-nav.fixed ul.collapsible-accordion a.collapsible-header {\n  padding: 0 30px; }\n\nul.side-nav.fixed ul.collapsible-accordion .collapsible-body li a {\n  font-weight: 400;\n  padding: 0 37.5px 0 45px; }\n\nul.side-nav.fixed:hover {\n  overflow-y: auto; }\n\n.bold > a {\n  font-weight: bold; }\n\n#logo-container {\n  height: 57px;\n  margin-bottom: 32px; }\n\nnav.top-nav {\n  height: 122px;\n  box-shadow: none; }\n\nnav.top-nav a.page-title {\n  line-height: 122px;\n  font-size: 48px; }\n\na.button-collapse.top-nav {\n  position: absolute;\n  text-align: center;\n  height: 48px;\n  width: 48px;\n  left: 7.5%;\n  top: 0;\n  float: none;\n  margin-left: 1.5rem;\n  color: #fff;\n  font-size: 36px;\n  z-index: 2; }\n\na.button-collapse.top-nav.full {\n  line-height: 122px; }\n\na.button-collapse.top-nav i {\n  font-size: 32px; }\n\n@media only screen and (max-width: 600px) {\n  a.button-collapse.top-nav {\n    left: 5%; } }\n\n@media only screen and (max-width: 992px) {\n  nav .nav-wrapper {\n    text-align: center; }\n  nav .nav-wrapper a.page-title {\n    font-size: 36px; } }\n\n@media only screen and (min-width: 993px) {\n  .container {\n    width: 85%; } }\n\n#front-page-logo {\n  display: inline-block;\n  height: 100%;\n  pointer-events: none; }\n\n@media only screen and (max-width: 992px) {\n  #front-page-nav ul.side-nav li {\n    float: none;\n    padding: 0 15px; }\n  #front-page-nav ul.side-nav li:hover {\n    background-color: #ddd; }\n  #front-page-nav ul.side-nav li .active {\n    background-color: transparent; }\n  #front-page-nav ul.side-nav a {\n    color: #444; } }\n\n#responsive-img {\n  width: 80%;\n  display: block;\n  margin: 0 auto; }\n\n#index-banner {\n  background-color: #ee6e73; }\n\n#index-banner .container {\n  position: relative; }\n\n#index-banner .header {\n  color: #FFF; }\n\n#index-banner h4 {\n  margin-bottom: 40px; }\n\n#index-banner h1 {\n  margin-top: 16px; }\n\n@media only screen and (max-width: 992px) {\n  #index-banner h1 {\n    margin-top: 60px; }\n  #index-banner h4 {\n    margin-bottom: 15px; } }\n\n@media only screen and (max-width: 600px) {\n  #index-banner h4 {\n    margin-bottom: 0; } }\n\n.github-commit {\n  padding: 14px 0;\n  height: 64px;\n  line-height: 36px;\n  background-color: #5c5757;\n  color: #e6e6e6;\n  font-size: .9rem; }\n\n@media only screen and (max-width: 992px) {\n  .github-commit {\n    text-align: center; } }\n\n#github-button {\n  background-color: #6f6d6d;\n  transition: .25s ease; }\n\n#github-button:hover {\n  background-color: #797777; }\n\n.sha {\n  color: #f0f0f0;\n  margin: 0 6px 0 6px; }\n\n#download-button {\n  background-color: #f3989b;\n  width: 260px;\n  height: 70px;\n  line-height: 70px;\n  font-size: 18px;\n  font-weight: 400; }\n\n#download-button:hover {\n  background-color: #f5a5a8; }\n\n.promo {\n  width: 100%; }\n\n.promo i {\n  margin: 40px 0;\n  color: #ee6e73;\n  font-size: 7rem;\n  display: block; }\n\n.promo-caption {\n  font-size: 1.7rem;\n  font-weight: 500;\n  margin-top: 5px;\n  margin-bottom: 0; }\n\n#front-page-nav {\n  background-color: #FFF;\n  position: relative; }\n\n#front-page-nav a {\n  color: #ee6e73; }\n\n#front-page-nav li:hover {\n  background-color: #fdeaeb; }\n\n#front-page-nav li.active {\n  background-color: #fdeaeb; }\n\n#front-page-nav .container {\n  height: inherit; }\n\n.col.grid-example {\n  border: 1px solid #eee;\n  margin: 7px 0;\n  text-align: center;\n  line-height: 50px;\n  font-size: 28px;\n  background-color: tomato;\n  color: white;\n  padding: 0; }\n\n.col.grid-example span {\n  font-weight: 100;\n  line-height: 50px; }\n\n.promo-example {\n  overflow: hidden; }\n\n#site-layout-example-left {\n  background-color: #90a4ae;\n  height: 300px; }\n\n#site-layout-example-right {\n  background-color: #26a69a;\n  height: 300px; }\n\n#site-layout-example-top {\n  background-color: #E57373;\n  height: 42px; }\n\n.flat-text-header {\n  height: 35px;\n  width: 80%;\n  background-color: rgba(255, 255, 255, 0.15);\n  display: block;\n  margin: 27px auto; }\n\n.flat-text {\n  height: 25px;\n  width: 80%;\n  background-color: rgba(0, 0, 0, 0.15);\n  display: block;\n  margin: 27px auto; }\n\n.flat-text.small {\n  width: 25%;\n  height: 25px;\n  background-color: rgba(0, 0, 0, 0.15); }\n\n.flat-text.full-width {\n  width: 100%; }\n\n.browser-window {\n  text-align: left;\n  width: 100%;\n  height: auto;\n  display: inline-block;\n  border-radius: 5px 5px 2px 2px;\n  background-color: #fff;\n  margin: 20px 0px;\n  overflow: hidden; }\n\n.browser-window .top-bar {\n  height: 30px;\n  border-radius: 5px 5px 0 0;\n  border-top: thin solid #eaeae9;\n  border-bottom: thin solid #dfdfde;\n  background: linear-gradient(#e7e7e6, #E2E2E1); }\n\n.browser-window .circle {\n  height: 10px;\n  width: 10px;\n  display: inline-block;\n  border-radius: 50%;\n  background-color: #fff;\n  margin-right: 1px; }\n\n#close-circle {\n  background-color: #FF5C5A; }\n\n#minimize-circle {\n  background-color: #FFBB50; }\n\n#maximize-circle {\n  background-color: #1BC656; }\n\n.browser-window .circles {\n  margin: 5px 12px; }\n\n.browser-window .content {\n  margin: 0;\n  width: 100%;\n  display: inline-block;\n  border-radius: 0 0 5px 5px;\n  background-color: #fafafa; }\n\n.browser-window .row {\n  margin: 0; }\n\n.clear {\n  clear: both; }\n\n.dynamic-color .red, .dynamic-color .pink, .dynamic-color .purple, .dynamic-color .deep-purple, .dynamic-color .indigo, .dynamic-color .blue, .dynamic-color .light-blue, .dynamic-color .cyan, .dynamic-color .teal, .dynamic-color .green, .dynamic-color .light-green, .dynamic-color .lime, .dynamic-color .yellow, .dynamic-color .amber, .dynamic-color .orange, .dynamic-color .deep-orange, .dynamic-color .brown, .dynamic-color .grey, .dynamic-color .blue-grey, .dynamic-color .black, .dynamic-color .white, .dynamic-color .transparent {\n  height: 55px;\n  width: 100%;\n  padding: 0 15px;\n  line-height: 55px;\n  font-weight: 500;\n  font-size: 12px;\n  display: block;\n  box-sizing: border-box; }\n\n.dynamic-color .col {\n  margin-bottom: 55px; }\n\n.center {\n  text-align: center;\n  vertical-align: middle; }\n\n.material-icons.icon-demo {\n  line-height: 50px; }\n\n.icon-container i {\n  font-size: 3em;\n  margin-bottom: 10px; }\n\n.icon-container .icon-preview {\n  height: 120px;\n  text-align: center; }\n\n.icon-container span {\n  display: block; }\n\n.icon-holder {\n  display: block;\n  text-align: center;\n  width: 150px;\n  height: 115px;\n  float: left;\n  margin: 0 0px 15px 0px; }\n\n.icon-holder p {\n  margin: 0 0; }\n\n.tabs-wrapper {\n  position: relative;\n  height: 48px; }\n\n.tabs-wrapper .row.pinned {\n  position: fixed;\n  width: 100%;\n  top: 0;\n  z-index: 10; }\n\n.shadow-demo {\n  background-color: #26a69a;\n  width: 100px;\n  height: 100px;\n  margin: 20px auto; }\n\n@media only screen and (max-width: 600px) {\n  .shadow-demo {\n    width: 150px;\n    height: 150px; } }\n\n.parallax-container .text-center {\n  position: absolute;\n  top: 50%;\n  left: 0;\n  right: 0;\n  margin-top: -27px; }\n\nul.table-of-contents {\n  margin-top: 0;\n  padding-top: 48px; }\n\ncode, pre {\n  position: relative;\n  font-size: 1.1rem; }\n\n.directory-markup {\n  font-size: 1rem;\n  line-height: 1.1rem !important; }\n\n:not(pre) > code[class*=\"language-\"] {\n  padding: .1em .25em;\n  border: solid 1px rgba(51, 51, 51, 0.12); }\n\npre[class*=\"language-\"] {\n  padding: 25px 12px 7px 12px;\n  border: solid 1px rgba(51, 51, 51, 0.12); }\n\npre[class*=\"language-\"]:before {\n  position: absolute;\n  padding: 1px 5px;\n  background: #e8e6e3;\n  top: 0;\n  left: 0;\n  font-family: \"Roboto\", sans-serif;\n  -webkit-font-smoothing: antialiased;\n  color: #555;\n  content: attr(class);\n  font-size: .9rem;\n  border: solid 1px rgba(51, 51, 51, 0.12);\n  border-top: none;\n  border-left: none; }\n\n.toc-wrapper {\n  position: relative;\n  margin-top: 42px; }\n\n.toc-wrapper.pin-bottom {\n  margin-top: 84px; }\n\n#carbonads {\n  max-width: 150px;\n  display: inline-block;\n  position: relative;\n  text-align: left;\n  -webkit-font-smoothing: antialiased; }\n\n#carbonads > span, #carbonads span.carbon-wrap {\n  height: 100px;\n  display: block; }\n\n#carbonads a.carbon-img {\n  height: 100px;\n  display: inline-block;\n  margin-right: 10px; }\n\n#carbonads a.carbon-text, #carbonads input[type=\"submit\"] {\n  position: relative;\n  top: 0;\n  width: 150px;\n  vertical-align: top;\n  display: inline-block;\n  font-size: 13px;\n  color: #E57373; }\n\n#carbonads a.carbon-poweredby {\n  position: relative;\n  left: 28px;\n  font-size: 11px;\n  color: #EF9A9A; }\n\n.buysellads #carbonads > span, .buysellads #carbonads span.carbon-wrap {\n  height: auto; }\n\n.buysellads #carbonads a.carbon-text {\n  top: 5px;\n  left: 0;\n  width: 130px;\n  display: block;\n  font-size: 13px;\n  -webkit-font-smoothing: antialiased;\n  color: #E57373; }\n\n.buysellads #carbonads a.carbon-poweredby {\n  top: 5px; }\n\n.buysellads-header #carbonads > span, .buysellads-header #carbonads span.carbon-wrap {\n  height: auto; }\n\n.buysellads-header #carbonads a.carbon-text {\n  color: #fff; }\n\n.buysellads-header #carbonads a.carbon-poweredby {\n  color: rgba(255, 255, 255, 0.8); }\n\n.buysellads-homepage #carbonads {\n  display: block;\n  overflow: hidden;\n  margin: 4em auto 0;\n  padding: 1em;\n  max-width: 360px;\n  border-radius: 2px;\n  background-color: rgba(255, 255, 255, 0.13); }\n\n.buysellads-homepage #carbonads span {\n  position: relative;\n  display: block;\n  overflow: hidden; }\n\n.buysellads-homepage #carbonads .carbon-img {\n  float: left;\n  margin-right: 1em; }\n\n.buysellads-homepage #carbonads .carbon-text {\n  max-width: calc(100% - 135px - 1em);\n  width: auto; }\n\n.buysellads-homepage #carbonads .carbon-poweredby {\n  position: absolute;\n  left: auto;\n  right: 0;\n  bottom: -4px; }\n\n.buysellads {\n  -webkit-font-smoothing: antialiased;\n  position: relative; }\n\n.buysellads.buysellads-demo {\n  bottom: 20px;\n  right: 20px;\n  position: fixed;\n  padding: 10px;\n  background-color: rgba(255, 255, 255, 0.9);\n  z-index: 1000; }\n\n.buysellads.buysellads-demo #carbonads a.carbon-img {\n  margin-right: 0; }\n\n.buysellads.buysellads-demo #carbonads a.carbon-text {\n  top: 0; }\n\n.buysellads.buysellads-demo a.close {\n  text-align: center;\n  background-color: #fff;\n  border-radius: 50%;\n  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);\n  height: 24px;\n  width: 24px;\n  position: absolute;\n  top: -6px;\n  right: -6px;\n  z-index: 1;\n  transition: background-color .2s; }\n\n.buysellads.buysellads-demo a.close:hover {\n  background-color: #ddd; }\n\n.buysellads.buysellads-demo a.close .material-icons {\n  font-size: 18px;\n  line-height: 24px; }\n\n.buysellads .bsa_it.one {\n  width: 130px;\n  position: absolute;\n  left: 0;\n  top: 50px; }\n\n.buysellads .bsa_it.one .bsa_it_p {\n  left: 0;\n  bottom: -15px; }\n\n.buysellads .bsa_it.one .bsa_it_ad .bsa_it_t {\n  color: #E57373; }\n\n.buysellads .bsa_it.one .bsa_it_ad .bsa_it_d {\n  color: #EF9A9A; }\n\n.buysellads .bsa_it_ad a {\n  display: block;\n  width: 130px; }\n\n.buysellads-header {\n  margin-top: 30px; }\n\n.buysellads-header .bsa_it.one .bsa_it_p {\n  bottom: -20px; }\n\n.bsa_it.one {\n  min-width: 230px;\n  max-width: 270px;\n  display: inline-block;\n  text-align: left; }\n\n.bsa_it.one .bsa_it_ad {\n  border: 0;\n  padding: 0;\n  background-color: transparent; }\n\n.bsa_it.one .bsa_it_ad .bsa_it_t {\n  color: #fff; }\n\n.bsa_it.one .bsa_it_ad .bsa_it_d {\n  color: #FFCDD2; }\n\n.bsa_it.one .bsa_it_p {\n  right: auto;\n  left: 40px;\n  bottom: -5px; }\n\n.bsa_it.one .bsa_it_p a {\n  color: #FFCDD2; }\n\nfooter {\n  font-size: .9rem; }\n\nbody.parallax-demo footer {\n  margin-top: 0; }\n\n.image-container {\n  width: 100%; }\n\n.image-container img {\n  max-width: 100%; }\n\n@media only screen and (max-width: 600px) {\n  .mobile-image {\n    max-width: 100%; } }\n\n.waves-color-demo .collection-item {\n  height: 37px;\n  line-height: 37px;\n  box-sizing: content-box; }\n\n.waves-color-demo .collection-item code {\n  line-height: 37px; }\n\n.waves-color-demo .btn:not(.waves-light), .waves-color-demo .btn-large:not(.waves-light) {\n  background-color: #fff;\n  color: #212121; }\n\n.card-panel span, .card-content p {\n  -webkit-font-smoothing: antialiased; }\n\n#images .card-panel .row {\n  margin-bottom: 0; }\n\n.pushpin-demo {\n  position: relative;\n  height: 100px; }\n\n#pushpin-demo-1 {\n  display: block;\n  height: inherit;\n  background-color: #ddd; }\n\n.valign-demo {\n  height: 400px;\n  background-color: #ddd; }\n\n.talign-demo {\n  height: 100px;\n  background-color: #ddd; }\n\n#staggered-test li, #image-test {\n  opacity: 0; }\n\n#tx-live-lang-container {\n  background-color: #fcfcfc;\n  z-index: 999; }\n\n#tx-live-lang-container #tx-live-lang-picker {\n  background-color: #fcfcfc; }\n\n#tx-live-lang-container #tx-live-lang-picker li {\n  color: rgba(0, 0, 0, 0.87); }\n\n#tx-live-lang-container #tx-live-lang-picker li:hover {\n  color: inherit;\n  background-color: #fdeaeb; }\n\n#tx-live-lang-container .txlive-langselector-toggle {\n  border-bottom: 2px solid #ee6e73; }\n\n#tx-live-lang-container .txlive-langselector-current {\n  color: rgba(0, 0, 0, 0.87); }\n\n#tx-live-lang-container .txlive-langselector-marker {\n  border-bottom: 4px solid rgba(0, 0, 0, 0.61); }\n\n#download-thanks {\n  display: none; }\n\n#twitter-widget-0 {\n  width: 300px !important; }\n\n#nav-mobile li.search {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 120px;\n  margin-top: 1px;\n  padding: 1px 0 0 0;\n  z-index: 2; }\n\n#nav-mobile li.search:hover {\n  background-color: #fff; }\n\n#nav-mobile li.search .search-wrapper {\n  margin: 0 12px;\n  transition: margin .25s ease; }\n\n#nav-mobile li.search .search-wrapper.focused {\n  margin: 0; }\n\n#nav-mobile li.search .search-wrapper input#search {\n  display: block;\n  font-size: 16px;\n  font-weight: 300;\n  width: 100%;\n  height: 45px;\n  margin: 0;\n  padding: 0 45px 0 15px;\n  border: 0; }\n\n#nav-mobile li.search .search-wrapper input#search:focus {\n  outline: none;\n  box-shadow: none; }\n\n#nav-mobile li.search .search-wrapper i.material-icons {\n  position: absolute;\n  top: 10px;\n  right: 10px;\n  cursor: pointer; }\n\n#nav-mobile li.search .search-results {\n  margin: 0;\n  border-top: 1px solid #e9e9e9;\n  background-color: #fff; }\n\n#nav-mobile li.search .search-results a {\n  font-size: 12px;\n  white-space: nowrap;\n  display: block; }\n\n#nav-mobile li.search .search-results a:hover, #nav-mobile li.search .search-results a.focused {\n  background-color: #eee;\n  outline: none; }\n\nbody.themes .themes-section {\n  padding: 60px 0 40px 0; }\n\nbody.themes .themes-section .theme-preview {\n  width: 100%; }\n\nbody.themes .themes-section h4 {\n  margin-top: 0; }\n\n.shopify-buy-frame, .shopify-btn {\n  float: left; }\n\n.shopify-buy-frame {\n  width: 105px; }\n\n.shopify-btn {\n  background-color: #78B657;\n  font-size: 15px;\n  font-family: 'Helvetica Neue';\n  letter-spacing: .3px;\n  border-radius: 2px;\n  color: #fff;\n  padding: 10px 20px;\n  transition: background .2s;\n  margin: 20px 0 0 5px;\n  -webkit-font-smoothing: antialiased; }\n\n.shopify-btn:hover {\n  background-color: #5f9d3e; }\n\n.themes-banner {\n  text-align: center;\n  background-color: #5f5f5f;\n  padding: 30px 0; }\n\n.themes-banner p {\n  font-size: 18px;\n  color: #fff; }\n\n.themes-banner a {\n  color: #baef74; }\n", ""]);

// exports


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "/*\n Solarized Color Schemes originally by Ethan Schoonover\n http://ethanschoonover.com/solarized\n\n Ported for PrismJS by Hector Matos\n Website: https://krakendev.io\n Twitter Handle: https://twitter.com/allonsykraken)\n*/\n/*\nSOLARIZED HEX\n--------- -------\nbase03    #002b36\nbase02    #073642\nbase01    #586e75\nbase00    #657b83\nbase0     #839496\nbase1     #93a1a1\nbase2     #eee8d5\nbase3     #fdf6e3\nyellow    #b58900\norange    #cb4b16\nred       #dc322f\nmagenta   #d33682\nviolet    #6c71c4\nblue      #268bd2\ncyan      #2aa198\ngreen     #859900\n*/\ncode[class*=\"language-\"],\npre[class*=\"language-\"] {\n  color: #657b83;\n  /* base00 */\n  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;\n  text-align: left;\n  white-space: pre;\n  word-spacing: normal;\n  word-break: normal;\n  word-wrap: normal;\n  line-height: 1.5;\n  -moz-tab-size: 4;\n  -o-tab-size: 4;\n  tab-size: 4;\n  -webkit-hyphens: none;\n  -moz-hyphens: none;\n  -ms-hyphens: none;\n  hyphens: none; }\n\npre[class*=\"language-\"]::-moz-selection, pre[class*=\"language-\"] ::-moz-selection,\ncode[class*=\"language-\"]::-moz-selection, code[class*=\"language-\"] ::-moz-selection {\n  background: #073642;\n  /* base02 */ }\n\npre[class*=\"language-\"]::selection, pre[class*=\"language-\"] ::selection,\ncode[class*=\"language-\"]::selection, code[class*=\"language-\"] ::selection {\n  background: #073642;\n  /* base02 */ }\n\n/* Code blocks */\npre[class*=\"language-\"] {\n  padding: 1em;\n  margin: .5em 0;\n  overflow: auto;\n  border-radius: 0.3em; }\n\n:not(pre) > code[class*=\"language-\"],\npre[class*=\"language-\"] {\n  background-color: #fdf6e3;\n  /* base3 */ }\n\n/* Inline code */\n:not(pre) > code[class*=\"language-\"] {\n  padding: .1em;\n  border-radius: .3em; }\n\n.token.comment,\n.token.prolog,\n.token.doctype,\n.token.cdata {\n  color: #93a1a1;\n  /* base1 */ }\n\n.token.punctuation {\n  color: #586e75;\n  /* base01 */ }\n\n.namespace {\n  opacity: .7; }\n\n.token.property,\n.token.tag,\n.token.boolean,\n.token.number,\n.token.constant,\n.token.symbol,\n.token.deleted {\n  color: #268bd2;\n  /* blue */ }\n\n.token.selector,\n.token.attr-name,\n.token.string,\n.token.char,\n.token.builtin,\n.token.url,\n.token.inserted {\n  color: #2aa198;\n  /* cyan */ }\n\n.token.entity {\n  color: #657b83;\n  /* base00 */\n  background: #eee8d5;\n  /* base2 */ }\n\n.token.atrule,\n.token.attr-value,\n.token.keyword {\n  color: #859900;\n  /* green */ }\n\n.token.function {\n  color: #b58900;\n  /* yellow */ }\n\n.token.regex,\n.token.important,\n.token.variable {\n  color: #cb4b16;\n  /* orange */ }\n\n.token.important,\n.token.bold {\n  font-weight: bold; }\n\n.token.italic {\n  font-style: italic; }\n\n.token.entity {\n  cursor: help; }\n", ""]);

// exports


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var pSlice = Array.prototype.slice;
var objectKeys = __webpack_require__(31);
var isArguments = __webpack_require__(30);

var deepEqual = module.exports = function (actual, expected, opts) {
  if (!opts) opts = {};
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();

  // 7.3. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!actual || !expected || typeof actual != 'object' && typeof expected != 'object') {
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
}

function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

function isBuffer (x) {
  if (!x || typeof x !== 'object' || typeof x.length !== 'number') return false;
  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
    return false;
  }
  if (x.length > 0 && typeof x[0] !== 'number') return false;
  return true;
}

function objEquiv(a, b, opts) {
  var i, key;
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
    return false;
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
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!deepEqual(a[key], b[key], opts)) return false;
  }
  return typeof a === typeof b;
}


/***/ }),
/* 30 */
/***/ (function(module, exports) {

var supportsArgumentsClass = (function(){
  return Object.prototype.toString.call(arguments)
})() == '[object Arguments]';

exports = module.exports = supportsArgumentsClass ? supported : unsupported;

exports.supported = supported;
function supported(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
};

exports.unsupported = unsupported;
function unsupported(object){
  return object &&
    typeof object == 'object' &&
    typeof object.length == 'number' &&
    Object.prototype.hasOwnProperty.call(object, 'callee') &&
    !Object.prototype.propertyIsEnumerable.call(object, 'callee') ||
    false;
};


/***/ }),
/* 31 */
/***/ (function(module, exports) {

exports = module.exports = typeof Object.keys === 'function'
  ? Object.keys : shim;

exports.shim = shim;
function shim (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}


/***/ }),
/* 32 */
/***/ (function(module, exports) {

// empty (null-loader)

/***/ }),
/* 33 */
/***/ (function(module, exports) {

// empty (null-loader)

/***/ }),
/* 34 */
/***/ (function(module, exports) {

// empty (null-loader)

/***/ }),
/* 35 */
/***/ (function(module, exports) {

// empty (null-loader)

/***/ }),
/* 36 */
/***/ (function(module, exports) {

// empty (null-loader)

/***/ }),
/* 37 */
/***/ (function(module, exports) {

// empty (null-loader)

/***/ }),
/* 38 */
/***/ (function(module, exports) {

// empty (null-loader)

/***/ }),
/* 39 */
/***/ (function(module, exports) {

// empty (null-loader)

/***/ }),
/* 40 */
/***/ (function(module, exports) {

// empty (null-loader)

/***/ }),
/* 41 */
/***/ (function(module, exports) {

// empty (null-loader)

/***/ }),
/* 42 */
/***/ (function(module, exports) {

(function(Prism) {

var javascript = Prism.util.clone(Prism.languages.javascript);

Prism.languages.jsx = Prism.languages.extend('markup', javascript);
Prism.languages.jsx.tag.pattern= /<\/?[\w\.:-]+\s*(?:\s+[\w\.:-]+(?:=(?:("|')(\\?[\w\W])*?\1|[^\s'">=]+|(\{[\w\W]*?\})))?\s*)*\/?>/i;

Prism.languages.jsx.tag.inside['attr-value'].pattern = /=[^\{](?:('|")[\w\W]*?(\1)|[^\s>]+)/i;

var jsxExpression = Prism.util.clone(Prism.languages.jsx);

delete jsxExpression.punctuation

jsxExpression = Prism.languages.insertBefore('jsx', 'operator', {
  'punctuation': /=(?={)|[{}[\];(),.:]/
}, { jsx: jsxExpression });

Prism.languages.insertBefore('inside', 'attr-value',{
	'script': {
		// Allow for one level of nesting
		pattern: /=(\{(?:\{[^}]*\}|[^}])+\})/i,
		inside: jsxExpression,
		'alias': 'language-javascript'
	}
}, Prism.languages.jsx.tag);

}(Prism));


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {
/* **********************************************
     Begin prism-core.js
********************************************** */

var _self = (typeof window !== 'undefined')
	? window   // if in browser
	: (
		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
		? self // if in worker
		: {}   // if in node js
	);

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

var Prism = (function(){

// Private helper vars
var lang = /\blang(?:uage)?-(\w+)\b/i;
var uniqueId = 0;

var _ = _self.Prism = {
	util: {
		encode: function (tokens) {
			if (tokens instanceof Token) {
				return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
			} else if (_.util.type(tokens) === 'Array') {
				return tokens.map(_.util.encode);
			} else {
				return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
			}
		},

		type: function (o) {
			return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
		},

		objId: function (obj) {
			if (!obj['__id']) {
				Object.defineProperty(obj, '__id', { value: ++uniqueId });
			}
			return obj['__id'];
		},

		// Deep clone a language definition (e.g. to extend it)
		clone: function (o) {
			var type = _.util.type(o);

			switch (type) {
				case 'Object':
					var clone = {};

					for (var key in o) {
						if (o.hasOwnProperty(key)) {
							clone[key] = _.util.clone(o[key]);
						}
					}

					return clone;

				case 'Array':
					// Check for existence for IE8
					return o.map && o.map(function(v) { return _.util.clone(v); });
			}

			return o;
		}
	},

	languages: {
		extend: function (id, redef) {
			var lang = _.util.clone(_.languages[id]);

			for (var key in redef) {
				lang[key] = redef[key];
			}

			return lang;
		},

		/**
		 * Insert a token before another token in a language literal
		 * As this needs to recreate the object (we cannot actually insert before keys in object literals),
		 * we cannot just provide an object, we need anobject and a key.
		 * @param inside The key (or language id) of the parent
		 * @param before The key to insert before. If not provided, the function appends instead.
		 * @param insert Object with the key/value pairs to insert
		 * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
		 */
		insertBefore: function (inside, before, insert, root) {
			root = root || _.languages;
			var grammar = root[inside];

			if (arguments.length == 2) {
				insert = arguments[1];

				for (var newToken in insert) {
					if (insert.hasOwnProperty(newToken)) {
						grammar[newToken] = insert[newToken];
					}
				}

				return grammar;
			}

			var ret = {};

			for (var token in grammar) {

				if (grammar.hasOwnProperty(token)) {

					if (token == before) {

						for (var newToken in insert) {

							if (insert.hasOwnProperty(newToken)) {
								ret[newToken] = insert[newToken];
							}
						}
					}

					ret[token] = grammar[token];
				}
			}

			// Update references in other language definitions
			_.languages.DFS(_.languages, function(key, value) {
				if (value === root[inside] && key != inside) {
					this[key] = ret;
				}
			});

			return root[inside] = ret;
		},

		// Traverse a language definition with Depth First Search
		DFS: function(o, callback, type, visited) {
			visited = visited || {};
			for (var i in o) {
				if (o.hasOwnProperty(i)) {
					callback.call(o, i, o[i], type || i);

					if (_.util.type(o[i]) === 'Object' && !visited[_.util.objId(o[i])]) {
						visited[_.util.objId(o[i])] = true;
						_.languages.DFS(o[i], callback, null, visited);
					}
					else if (_.util.type(o[i]) === 'Array' && !visited[_.util.objId(o[i])]) {
						visited[_.util.objId(o[i])] = true;
						_.languages.DFS(o[i], callback, i, visited);
					}
				}
			}
		}
	},
	plugins: {},

	highlightAll: function(async, callback) {
		var env = {
			callback: callback,
			selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
		};

		_.hooks.run("before-highlightall", env);

		var elements = env.elements || document.querySelectorAll(env.selector);

		for (var i=0, element; element = elements[i++];) {
			_.highlightElement(element, async === true, env.callback);
		}
	},

	highlightElement: function(element, async, callback) {
		// Find language
		var language, grammar, parent = element;

		while (parent && !lang.test(parent.className)) {
			parent = parent.parentNode;
		}

		if (parent) {
			language = (parent.className.match(lang) || [,''])[1].toLowerCase();
			grammar = _.languages[language];
		}

		// Set language on the element, if not present
		element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

		// Set language on the parent, for styling
		parent = element.parentNode;

		if (/pre/i.test(parent.nodeName)) {
			parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
		}

		var code = element.textContent;

		var env = {
			element: element,
			language: language,
			grammar: grammar,
			code: code
		};

		_.hooks.run('before-sanity-check', env);

		if (!env.code || !env.grammar) {
			if (env.code) {
				env.element.textContent = env.code;
			}
			_.hooks.run('complete', env);
			return;
		}

		_.hooks.run('before-highlight', env);

		if (async && _self.Worker) {
			var worker = new Worker(_.filename);

			worker.onmessage = function(evt) {
				env.highlightedCode = evt.data;

				_.hooks.run('before-insert', env);

				env.element.innerHTML = env.highlightedCode;

				callback && callback.call(env.element);
				_.hooks.run('after-highlight', env);
				_.hooks.run('complete', env);
			};

			worker.postMessage(JSON.stringify({
				language: env.language,
				code: env.code,
				immediateClose: true
			}));
		}
		else {
			env.highlightedCode = _.highlight(env.code, env.grammar, env.language);

			_.hooks.run('before-insert', env);

			env.element.innerHTML = env.highlightedCode;

			callback && callback.call(element);

			_.hooks.run('after-highlight', env);
			_.hooks.run('complete', env);
		}
	},

	highlight: function (text, grammar, language) {
		var tokens = _.tokenize(text, grammar);
		return Token.stringify(_.util.encode(tokens), language);
	},

	tokenize: function(text, grammar, language) {
		var Token = _.Token;

		var strarr = [text];

		var rest = grammar.rest;

		if (rest) {
			for (var token in rest) {
				grammar[token] = rest[token];
			}

			delete grammar.rest;
		}

		tokenloop: for (var token in grammar) {
			if(!grammar.hasOwnProperty(token) || !grammar[token]) {
				continue;
			}

			var patterns = grammar[token];
			patterns = (_.util.type(patterns) === "Array") ? patterns : [patterns];

			for (var j = 0; j < patterns.length; ++j) {
				var pattern = patterns[j],
					inside = pattern.inside,
					lookbehind = !!pattern.lookbehind,
					greedy = !!pattern.greedy,
					lookbehindLength = 0,
					alias = pattern.alias;

				if (greedy && !pattern.pattern.global) {
					// Without the global flag, lastIndex won't work
					var flags = pattern.pattern.toString().match(/[imuy]*$/)[0];
					pattern.pattern = RegExp(pattern.pattern.source, flags + "g");
				}

				pattern = pattern.pattern || pattern;

				// Don’t cache length as it changes during the loop
				for (var i=0, pos = 0; i<strarr.length; pos += strarr[i].length, ++i) {

					var str = strarr[i];

					if (strarr.length > text.length) {
						// Something went terribly wrong, ABORT, ABORT!
						break tokenloop;
					}

					if (str instanceof Token) {
						continue;
					}

					pattern.lastIndex = 0;

					var match = pattern.exec(str),
					    delNum = 1;

					// Greedy patterns can override/remove up to two previously matched tokens
					if (!match && greedy && i != strarr.length - 1) {
						pattern.lastIndex = pos;
						match = pattern.exec(text);
						if (!match) {
							break;
						}

						var from = match.index + (lookbehind ? match[1].length : 0),
						    to = match.index + match[0].length,
						    k = i,
						    p = pos;

						for (var len = strarr.length; k < len && p < to; ++k) {
							p += strarr[k].length;
							// Move the index i to the element in strarr that is closest to from
							if (from >= p) {
								++i;
								pos = p;
							}
						}

						/*
						 * If strarr[i] is a Token, then the match starts inside another Token, which is invalid
						 * If strarr[k - 1] is greedy we are in conflict with another greedy pattern
						 */
						if (strarr[i] instanceof Token || strarr[k - 1].greedy) {
							continue;
						}

						// Number of tokens to delete and replace with the new match
						delNum = k - i;
						str = text.slice(pos, p);
						match.index -= pos;
					}

					if (!match) {
						continue;
					}

					if(lookbehind) {
						lookbehindLength = match[1].length;
					}

					var from = match.index + lookbehindLength,
					    match = match[0].slice(lookbehindLength),
					    to = from + match.length,
					    before = str.slice(0, from),
					    after = str.slice(to);

					var args = [i, delNum];

					if (before) {
						args.push(before);
					}

					var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias, match, greedy);

					args.push(wrapped);

					if (after) {
						args.push(after);
					}

					Array.prototype.splice.apply(strarr, args);
				}
			}
		}

		return strarr;
	},

	hooks: {
		all: {},

		add: function (name, callback) {
			var hooks = _.hooks.all;

			hooks[name] = hooks[name] || [];

			hooks[name].push(callback);
		},

		run: function (name, env) {
			var callbacks = _.hooks.all[name];

			if (!callbacks || !callbacks.length) {
				return;
			}

			for (var i=0, callback; callback = callbacks[i++];) {
				callback(env);
			}
		}
	}
};

var Token = _.Token = function(type, content, alias, matchedStr, greedy) {
	this.type = type;
	this.content = content;
	this.alias = alias;
	// Copy of the full string this token was created from
	this.length = (matchedStr || "").length|0;
	this.greedy = !!greedy;
};

Token.stringify = function(o, language, parent) {
	if (typeof o == 'string') {
		return o;
	}

	if (_.util.type(o) === 'Array') {
		return o.map(function(element) {
			return Token.stringify(element, language, o);
		}).join('');
	}

	var env = {
		type: o.type,
		content: Token.stringify(o.content, language, parent),
		tag: 'span',
		classes: ['token', o.type],
		attributes: {},
		language: language,
		parent: parent
	};

	if (env.type == 'comment') {
		env.attributes['spellcheck'] = 'true';
	}

	if (o.alias) {
		var aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias];
		Array.prototype.push.apply(env.classes, aliases);
	}

	_.hooks.run('wrap', env);

	var attributes = Object.keys(env.attributes).map(function(name) {
		return name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
	}).join(' ');

	return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + (attributes ? ' ' + attributes : '') + '>' + env.content + '</' + env.tag + '>';

};

if (!_self.document) {
	if (!_self.addEventListener) {
		// in Node.js
		return _self.Prism;
	}
 	// In worker
	_self.addEventListener('message', function(evt) {
		var message = JSON.parse(evt.data),
		    lang = message.language,
		    code = message.code,
		    immediateClose = message.immediateClose;

		_self.postMessage(_.highlight(code, _.languages[lang], lang));
		if (immediateClose) {
			_self.close();
		}
	}, false);

	return _self.Prism;
}

//Get current script and highlight
var script = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();

if (script) {
	_.filename = script.src;

	if (document.addEventListener && !script.hasAttribute('data-manual')) {
		if(document.readyState !== "loading") {
			if (window.requestAnimationFrame) {
				window.requestAnimationFrame(_.highlightAll);
			} else {
				window.setTimeout(_.highlightAll, 16);
			}
		}
		else {
			document.addEventListener('DOMContentLoaded', _.highlightAll);
		}
	}
}

return _self.Prism;

})();

if (typeof module !== 'undefined' && module.exports) {
	module.exports = Prism;
}

// hack for components to work correctly in node.js
if (typeof global !== 'undefined') {
	global.Prism = Prism;
}


/* **********************************************
     Begin prism-markup.js
********************************************** */

Prism.languages.markup = {
	'comment': /<!--[\w\W]*?-->/,
	'prolog': /<\?[\w\W]+?\?>/,
	'doctype': /<!DOCTYPE[\w\W]+?>/i,
	'cdata': /<!\[CDATA\[[\w\W]*?]]>/i,
	'tag': {
		pattern: /<\/?(?!\d)[^\s>\/=$<]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\w\W])*\1|[^\s'">=]+))?)*\s*\/?>/i,
		inside: {
			'tag': {
				pattern: /^<\/?[^\s>\/]+/i,
				inside: {
					'punctuation': /^<\/?/,
					'namespace': /^[^\s>\/:]+:/
				}
			},
			'attr-value': {
				pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/i,
				inside: {
					'punctuation': /[=>"']/
				}
			},
			'punctuation': /\/?>/,
			'attr-name': {
				pattern: /[^\s>\/]+/,
				inside: {
					'namespace': /^[^\s>\/:]+:/
				}
			}

		}
	},
	'entity': /&#?[\da-z]{1,8};/i
};

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add('wrap', function(env) {

	if (env.type === 'entity') {
		env.attributes['title'] = env.content.replace(/&amp;/, '&');
	}
});

Prism.languages.xml = Prism.languages.markup;
Prism.languages.html = Prism.languages.markup;
Prism.languages.mathml = Prism.languages.markup;
Prism.languages.svg = Prism.languages.markup;


/* **********************************************
     Begin prism-css.js
********************************************** */

Prism.languages.css = {
	'comment': /\/\*[\w\W]*?\*\//,
	'atrule': {
		pattern: /@[\w-]+?.*?(;|(?=\s*\{))/i,
		inside: {
			'rule': /@[\w-]+/
			// See rest below
		}
	},
	'url': /url\((?:(["'])(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
	'selector': /[^\{\}\s][^\{\};]*?(?=\s*\{)/,
	'string': {
		pattern: /("|')(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'property': /(\b|\B)[\w-]+(?=\s*:)/i,
	'important': /\B!important\b/i,
	'function': /[-a-z0-9]+(?=\()/i,
	'punctuation': /[(){};:]/
};

Prism.languages.css['atrule'].inside.rest = Prism.util.clone(Prism.languages.css);

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'style': {
			pattern: /(<style[\w\W]*?>)[\w\W]*?(?=<\/style>)/i,
			lookbehind: true,
			inside: Prism.languages.css,
			alias: 'language-css'
		}
	});
	
	Prism.languages.insertBefore('inside', 'attr-value', {
		'style-attr': {
			pattern: /\s*style=("|').*?\1/i,
			inside: {
				'attr-name': {
					pattern: /^\s*style/i,
					inside: Prism.languages.markup.tag.inside
				},
				'punctuation': /^\s*=\s*['"]|['"]\s*$/,
				'attr-value': {
					pattern: /.+/i,
					inside: Prism.languages.css
				}
			},
			alias: 'language-css'
		}
	}, Prism.languages.markup.tag);
}

/* **********************************************
     Begin prism-clike.js
********************************************** */

Prism.languages.clike = {
	'comment': [
		{
			pattern: /(^|[^\\])\/\*[\w\W]*?\*\//,
			lookbehind: true
		},
		{
			pattern: /(^|[^\\:])\/\/.*/,
			lookbehind: true
		}
	],
	'string': {
		pattern: /(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'class-name': {
		pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,
		lookbehind: true,
		inside: {
			punctuation: /(\.|\\)/
		}
	},
	'keyword': /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
	'boolean': /\b(true|false)\b/,
	'function': /[a-z0-9_]+(?=\()/i,
	'number': /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,
	'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
	'punctuation': /[{}[\];(),.:]/
};


/* **********************************************
     Begin prism-javascript.js
********************************************** */

Prism.languages.javascript = Prism.languages.extend('clike', {
	'keyword': /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
	'number': /\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,
	// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
	'function': /[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/i,
	'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*\*?|\/|~|\^|%|\.{3}/
});

Prism.languages.insertBefore('javascript', 'keyword', {
	'regex': {
		pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
		lookbehind: true,
		greedy: true
	}
});

Prism.languages.insertBefore('javascript', 'string', {
	'template-string': {
		pattern: /`(?:\\\\|\\?[^\\])*?`/,
		greedy: true,
		inside: {
			'interpolation': {
				pattern: /\$\{[^}]+\}/,
				inside: {
					'interpolation-punctuation': {
						pattern: /^\$\{|\}$/,
						alias: 'punctuation'
					},
					rest: Prism.languages.javascript
				}
			},
			'string': /[\s\S]+/
		}
	}
});

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'script': {
			pattern: /(<script[\w\W]*?>)[\w\W]*?(?=<\/script>)/i,
			lookbehind: true,
			inside: Prism.languages.javascript,
			alias: 'language-javascript'
		}
	});
}

Prism.languages.js = Prism.languages.javascript;

/* **********************************************
     Begin prism-file-highlight.js
********************************************** */

(function () {
	if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
		return;
	}

	self.Prism.fileHighlight = function() {

		var Extensions = {
			'js': 'javascript',
			'py': 'python',
			'rb': 'ruby',
			'ps1': 'powershell',
			'psm1': 'powershell',
			'sh': 'bash',
			'bat': 'batch',
			'h': 'c',
			'tex': 'latex'
		};

		if(Array.prototype.forEach) { // Check to prevent error in IE8
			Array.prototype.slice.call(document.querySelectorAll('pre[data-src]')).forEach(function (pre) {
				var src = pre.getAttribute('data-src');

				var language, parent = pre;
				var lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;
				while (parent && !lang.test(parent.className)) {
					parent = parent.parentNode;
				}

				if (parent) {
					language = (pre.className.match(lang) || [, ''])[1];
				}

				if (!language) {
					var extension = (src.match(/\.(\w+)$/) || [, ''])[1];
					language = Extensions[extension] || extension;
				}

				var code = document.createElement('code');
				code.className = 'language-' + language;

				pre.textContent = '';

				code.textContent = 'Loading…';

				pre.appendChild(code);

				var xhr = new XMLHttpRequest();

				xhr.open('GET', src, true);

				xhr.onreadystatechange = function () {
					if (xhr.readyState == 4) {

						if (xhr.status < 400 && xhr.responseText) {
							code.textContent = xhr.responseText;

							Prism.highlightElement(code);
						}
						else if (xhr.status >= 400) {
							code.textContent = '✖ Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;
						}
						else {
							code.textContent = '✖ Error: File does not exist or is empty';
						}
					}
				};

				xhr.send(null);
			});
		}

	};

	document.addEventListener('DOMContentLoaded', self.Prism.fileHighlight);

})();

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(48)))

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(23);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(2)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js!./header.scss", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js!./header.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(24);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(2)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js!./playground.scss", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js!./playground.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(26);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(2)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js!./tutorial.scss", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js!./tutorial.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(28);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(2)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../css-loader/index.js!../../sass-loader/lib/loader.js!./prism-solarizedlight.css", function() {
			var newContent = require("!!../../css-loader/index.js!../../sass-loader/lib/loader.js!./prism-solarizedlight.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 48 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map