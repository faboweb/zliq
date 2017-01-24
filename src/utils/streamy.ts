import deepEqual from 'deep-equal';
import {replace} from './array-utils';

export const stream = function(init_value?) {
	function s(value) {
		if (arguments.length === 0) return s.value;
		update(s, value);
		return s;
	}

	s.IS_STREAM = true;
	s.value = init_value !== null ? init_value : null;
	s.listeners = [];

	s.map = (fn) => map(s, fn);
	s.filter = (fn) => filter(s, fn);
	s.deepSelect = (fn) => deepSelect(s, fn);
	s.distinct = (fn) => distinct(s, fn);
	s.notEmpty = () => notEmpty(s);

	return s;
};

function valuesChanged(oldValue, newValue) {
	return !deepEqual(oldValue, newValue);
}

function update(parent$, newValue) {
	if (newValue === undefined) {
		return parent$.value;
	}
	parent$.value = newValue;
	notifyListeners(parent$.listeners, newValue);
};

function notifyListeners(listeners, value) {
	listeners.forEach(function notifyListener(listener) {
		listener(value);
	});
}

function map(parent$, fn) {
	let newStream = stream(fn(parent$.value));
	parent$.listeners.push(function mapValue(value) {
		newStream(fn(value));
	});
	return newStream;
}

function filter(parent$, fn) {
	let newStream = stream(fn(parent$.value) ? parent$.value : null);
	parent$.listeners.push(function filterValue(value) {
		if (fn(value)) {
			newStream(value);
		}
	});
	return newStream;
}

// TODO
function deepSelect(parent$, selector) {
	let selectors = selector.split('.');

	function select(parent, selectors) {
		return selectors.reduce((input, selector) => {
			return input[selector];
		}, parent);
	}

	let newStream = stream(select(parent$.value, selectors));
	parent$.listeners.push(function deepSelectValue(value) {
		newStream(select(value, selectors));
	});
	return newStream;
};

// TODO: maybe refactor with filter
function distinct(parent$, fn = (a, b) => valuesChanged(a, b)) {
	let newStream = stream(parent$.value);
	parent$.listeners.push(function deepSelectValue(value) {
		if (fn(newStream.value, value)) {
			newStream(value);
		}
	});
	return newStream;
}

export function merge$(...streams) {
	let values = streams.map(parent$ => parent$());
	let newStream = stream(values);
	streams.forEach(function triggerMergedStreamUpdate(parent$, index) {
		parent$.listeners.push(function updateMergedStream(value) {
			newStream(replace(values, index, value));
		});
	});
	return newStream;
}

export function isStream(parent$) {
	return parent$ != null && !!parent$.IS_STREAM;
}