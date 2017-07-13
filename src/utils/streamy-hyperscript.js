import {stream, merge$, isStream} from './streamy';
import {createElement, REMOVED, ADDED} from './streamy-dom';

/*
* wrap hyperscript elements in reactive streams dependent on their children streams
*/
export const h = (tag, props, ...children) => {
	let deleted$ = stream(false);
	let component;

	// let childrenWithDetacher = addStreamDetacher(flatten(children), deleted$);
	let mergedChildren$ = mergeChildren$(flatten(children));
	// jsx usually resolves known tags as strings and unknown tags as functions
	// if it is a sub component, resolve that component
	if (typeof tag === 'function') {
		component = tag(
			props,
			mergedChildren$,
			deleted$
		);
	} else {
		// add detachers to props
		props !== null && Object.keys(props).map((propName, index) => {
			if (isStream(props[propName])) {
				props[propName] = props[propName].until(deleted$);
			}
		});
		component = {
			vdom$: merge$(
					wrapProps$(props, deleted$).distinct(),
					mergedChildren$.map(flatten)
				).map(([props, children]) => {
					return {
						tag,
						props,
						children,
						version: guid()
				}})
		};
	}

	return component;
};

function addStreamDetacher(obj, deleted$) {
	if (obj === null || obj === undefined) return obj;
	if (Array.isArray(obj)) {
		return obj.map(item => {
			if (isStream(item)) {
				return item.until(deleted$);
			}
			return item;
		});
	}
	Object.keys(obj).map((propName, index) => {
		if (isStream(obj[propName])) {
			obj[propName] = obj[propName].until(deleted$);
		}
	});
	return obj;
}


// input has format [stream | {vdom$}]
function mergeChildren$(children) {
	if (!Array.isArray(children)) {
		children = [children];
	}
	children = flatten(children);
	let childrenVdom$arr = children.map(child => {
		if (isStream(child)) {
			return child
			.flatMap(mergeChildren$);
		}
		return child.vdom$ || child;
	})

	return mixedMerge$(...childrenVdom$arr);
}

/*
* wrap all children in streams and merge those
* we make sure that all children streams are flat arrays to make processing uniform
* output: stream([stream([])])
*/
function getChildrenVdom$arr(childrenArr, deleted$) {
	// flatten children arr
	// needed to make react style hyperscript (children as arguments) working parallel to preact style hyperscript (children as array)
	childrenArr = [].concat(...childrenArr);
	// only handle vdom for now
	let children$Arr = childrenArr.map(component => {
		// TODO
		// if (component.IS_STREAM) {
		// 	return
		// }
		// if there is no vdom$ it is a string or number
		if (component.vdom$ === undefined) {
			return stream(component);
		}
		return component.vdom$
	});

	return children$Arr
		// unsubscribe on the child when deleted
		.map(vdom$ => vdom$.until(deleted$))
		// make sure children are arrays and not nest
		.map(_ => makeArray(_)
			.map(flatten))
		// so we can easily merge them
		.map(vdom$ => vdom$.flatMap(vdomArr =>
				mixedMerge$(...vdomArr)));
}

// make sure all children are handled as streams
// so we can later easily merge them
function makeStreams(childrenArr) {
	return childrenArr.map(child => {
		if (child === null || !isStream(child)) {
			return stream(child);
		}
		return child;
	});
}

// converts an input into an array
function makeArray(stream) {
	return stream.map(value => {
		if (value == null) {
			return [];
		}
		if (!Array.isArray(value)) {
			return [value];
		}
		return value;
	})
}

// flattens an array
export function flatten(arr) {
	while (arr.some(value => Array.isArray(value))) {
		arr = [].concat(...arr);
	}
	return arr;
}

/*
* Wrap props into one stream
*/
function wrapProps$(props, deleted$) {
	if (props === null) return stream({});
	if (isStream(props)) {
		return props.until(deleted$);
	}

	// go through all the props and make them a stream
	// if they are objects, traverse them to check if they include streams
	let props$Arr = Object.keys(props).map((propName, index) => {
		let value = props[propName];
		if (isStream(value)) {
			return value.until(deleted$).map(value => {
				return {
					key: propName,
					value
				};
			});
		} else {
			// if it's an object, traverse the sub-object making it a stream
			if (value !== null && typeof value === 'object') {
				return wrapProps$(value, deleted$).map(value => {
					return {
						key: propName,
						value
					};
				});
			}
			// if it's a plain value wrap it in a stream
			return stream({
				key: propName,
				value
			});
		}
	});
	// merge streams of all properties
	// on changes, reconstruct the properties object from the properties
	return merge$(...props$Arr).map(props => {
		return props.reduce((obj, {key, value}) => {
			obj[key] = value;
			return obj;
		}, {});
	});
}

export function mixedMerge$(...potentialStreams) {
	let values = potentialStreams.map(parent$ => parent$.IS_STREAM ? parent$.value : parent$);
	let actualStreams = potentialStreams.reduce((streams, potentialStream, index) => {
		if (potentialStream.IS_STREAM) {
			streams.push({
				stream: potentialStream,
				index
			})
		}
		return streams;
	}, []);
	let newStream = stream(values.indexOf(undefined) === -1 ? values : undefined);
	actualStreams.forEach(function triggerMergedStreamUpdate({stream, index}) {
		stream.listeners.push(function updateMergedStream(value) {
			values[index] = value;
			newStream(values.indexOf(undefined) === -1 ? values : undefined);
		});
	});
	return newStream;
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}