import deepEqual from 'deep-equal';
import {replace} from './array-utils';

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
<<<<<<< HEAD
	parent$.value = newValue;
	notifyListeners(parent$.listeners, newValue);
=======
	notifyListeners(parent$.listeners, newValue, parent$.value);
	parent$.value = newValue;
>>>>>>> parent of 7bcb3a3... cleanup
};

/*
* provide a new value to all listeners registered for a stream
*/
function notifyListeners(listeners, newValue, oldValue) {
	listeners.forEach(function notifyListener(listener) {
<<<<<<< HEAD
		listener(value);
=======
		listener(newValue, oldValue);
>>>>>>> parent of 7bcb3a3... cleanup
	});
}

/*
* provides a new stream applying a transformation function to the value of a parent stream
*/
function map(parent$, fn) {
<<<<<<< HEAD
	let newStream = stream(fn(parent$.value));
	parent$.listeners.push(function mapValue(value) {
		newStream(fn(value));
=======
	let newStream = stream(fn(parent$.value, null));
	parent$.listeners.push(function mapValue(newValue, oldValue) {
		newStream(fn(newValue, oldValue));
>>>>>>> parent of 7bcb3a3... cleanup
	});
	return newStream;
}

/*
* provides a new stream applying a transformation function to the value of a parent stream
*/
function flatMap(parent$, fn) {
<<<<<<< HEAD
	let newStream = stream(fn(parent$.value)());
	parent$.listeners.push(function mapValue(value) {
		fn(value).map(function updateOuterStream(result) {
			newStream(result);
=======
	let newStream = stream(fn(parent$.value, null)());
	parent$.listeners.push(function mapValue(newValue) {
		fn(newValue, newStream.value).map(function updateOuterStream(newResult, oldResult) {
			newStream(newResult, oldResult);
>>>>>>> parent of 7bcb3a3... cleanup
		});
	});
	return newStream;
}

/*
* provides a new stream that only serves the values that a filter function returns true for
* still a stream ALWAYS has a value -> so it starts at least with NULL
*/
function filter(parent$, fn) {
<<<<<<< HEAD
	let newStream = stream(fn(parent$.value) ? parent$.value : null);
	parent$.listeners.push(function filterValue(value) {
		if (fn(value)) {
			newStream(value);
=======
	let newStream = stream(fn(parent$.value, null) ? parent$.value : null);
	parent$.listeners.push(function filterValue(newValue) {
		if (fn(newValue, newStream.value)) {
			newStream(newValue, newStream.value);
>>>>>>> parent of 7bcb3a3... cleanup
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

/*
* merge several streams into one stream providing the values of all streams as an array
*/
export function merge$(...streams) {
	let values = streams.map(parent$ => parent$.value);
	let newStream = stream(values);
	streams.forEach(function triggerMergedStreamUpdate(parent$, index) {
		parent$.listeners.push(function updateMergedStream(value) {
<<<<<<< HEAD
			newStream(streams.map(parent$ => parent$.value));
=======
			let newValues = streams.map(parent$ => parent$.value);
			newStream(newValues, newStream.value);
>>>>>>> parent of 7bcb3a3... cleanup
		});
	});
	return newStream;
}

export function isStream(parent$) {
	return parent$ != null && !!parent$.IS_STREAM;
}