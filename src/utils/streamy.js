import deepEqual from 'deep-equal';

/*
* stream constructor
* constructor returns a stream
* get the current value of stream like: stream()
*/
export const stream = function(init_value) {
	function s(value) {
		if (arguments.length === 0) return s.value;
		update(s, value);
		return s;
	}

	s.IS_STREAM = true;
	s.value = init_value !== null ? init_value : null;
	s.listeners = [];

	s.map = (fn) => map(s, fn);
	s.flatMap = (fn) => flatMap(s, fn);
	s.filter = (fn) => filter(s, fn);
	s.deepSelect = (fn) => deepSelect(s, fn);
	s.distinct = (fn) => distinct(s, fn);
	s.notEmpty = () => notEmpty(s);
	s.$ = (selectorArr) => query(s, selectorArr);
	s.patch = (partialChange) => patch(s, partialChange);

	return s;
};

/*
* wrapper for the diffing of stream values
*/
function valuesChanged(oldValue, newValue) {
	return !deepEqual(oldValue, newValue);
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
	let newStream = stream(fn(parent$.value));
	parent$.listeners.push(function mapValue(value) {
		newStream(fn(value));
	});
	return newStream;
}

/*
* provides a new stream applying a transformation function to the value of a parent stream
*/
function flatMap(parent$, fn) {
	let newStream = stream(fn(parent$.value)());
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
	let newStream = stream(fn(parent$.value) ? parent$.value : null);
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
	let selectors = selector.split('.');

	function select(parent, selectors) {
		return selectors.reduce((input, selector) => {
			return input[selector];
		}, parent);
	}

	let newStream = stream(select(parent$.value, selectors));
	parent$.listeners.push(function deepSelectValue(newValue) {
		newStream(select(newValue, selectors), newStream.value);
	});
	return newStream;
};

function query(parent$, selectorArr) {
	if(!Array.isArray(selectorArr)) {
		return deepSelect(parent$, selectorArr);
	}
	return merge$(...selectorArr.map(selector => deepSelect(parent$, selector)));
}

// TODO: maybe refactor with filter
/*
* provide a new stream that only notifys its children if the containing value actualy changes
*/
function distinct(parent$, fn = (a, b) => valuesChanged(a, b)) {
	let newStream = stream(parent$.value);
	parent$.listeners.push(function deepSelectValue(value) {
		if (fn(newStream.value, value)) {
			newStream(value, newStream.value);
		}
	});
	return newStream;
}

function patch(parent$, partialChange) {
	if (parent$.value == null) {
		parent$(partialChange);
		return;
	}
	parent$(Object.assign({}, parent$.value, partialChange));
}

/*
* merge several streams into one stream providing the values of all streams as an array
*/
export function merge$(...streams) {
	let values = streams.map(parent$ => parent$.value);
	let newStream = stream(values);
	streams.forEach(function triggerMergedStreamUpdate(parent$, index) {
		parent$.listeners.push(function updateMergedStream(value) {
			newStream(streams.map(parent$ => parent$.value));
		});
	});
	return newStream;
}

export function isStream(parent$) {
	return parent$ != null && !!parent$.IS_STREAM;
}