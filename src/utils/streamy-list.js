import { stream, merge$} from './streamy';
import {processLargeArrayAsync, iterateAsync} from './array-utils';
import {Queue, batchAsyncQueue} from './queue';
var ChangeWorker = require("worker-loader!./change-worker.js");

export function list(input$, listSelector, renderFunc) {
	let output$ = stream([]);
	let changeQueue = new Queue();
	let startTime = new Date();
	merge$(
			listChanges$(input$.map(value => value != null ? value[listSelector] : null)),
			input$.map(value => {
				if (value == null) { return null; }
				let copiedValue = Object.assign({}, value);
				delete copiedValue[listSelector];
				return copiedValue;
			})
				.distinct()
		)
		.map(([changes, inputs]) => {
			changeQueue.add(function renderChanges() {
				return batchAsyncQueue(changes.map(change => () => {
					return renderChange(change, inputs, renderFunc, output$);
				}));
			});
		});
	output$.IS_CHANGE_STREAM = true;
	return output$;
}

function renderChange({index, val, vals, type, num, path }, inputs, renderFunc, batchCallback) {
	if (type === 'add') {
		let renderedAddElems = [];
		let queue = new Queue();
		let startTime = now();
		return batchAsyncQueue(vals.map(val => () => {
			return renderFunc(val, inputs);
		}), elems => {
			let partialAdd = {
				type,
				index,
				elems,
			};
			index += elems.length;
			batchCallback([partialAdd]);
		});
	}
	if (type == 'rm') {
		batchCallback([{
			type,
			index,
			num
		}]);
	}
	if (type == 'set') {
		batchCallback([{
			type: 'add',
			index,
			elems: val != null ? [renderFunc(val, inputs)] : null
		}]);
	}
	return Promise.resolve();
}

// export function list(input$, listSelector, renderFunc) {
// 	let output$ = stream([]);
// 	merge$(
// 		listChanges$(input$.map(value => value != null ? value[listSelector] : null)),
// 		input$.map(value => {
// 			if (value == null) { return null; }
// 			let copiedValue = Object.assign({}, value);
// 			delete copiedValue[listSelector];
// 			return copiedValue;
// 		})
// 			.distinct()
// 	)
// 	.map(([changes, inputs]) => {
// 		let chunk = [];
// 		return processLargeArrayAsync(
// 			changes, 
// 			({subIndex, item}) => {
// 				chunk.push({
// 					subIndex,
// 					elem: item != null ? renderFunc(item, inputs) : null
// 				});
// 			}, 
// 			200, 
// 			() => {
// 				output$(chunk);
// 				chunk = [];
// 			});
// 	});
// 	output$.IS_CHANGE_STREAM = true;
// 	return output$;
// }

// calculate the difference in the array
// do the calculation in a worker to not block UI-thread
function listChanges$(arr$) {
	let oldValue = [];
	let changes$ = stream([]);
	let changeWorker = new ChangeWorker();
	changeWorker.onmessage = ({ data: { changes }}) => {
		changes$(changes);
	}
	arr$.map(arr => {
		changeWorker.postMessage({ newArr: arr, oldArr: oldValue });
		oldValue = arr;
	});
	return changes$;
}
			
function now() {
	return new Date().getTime();
}
