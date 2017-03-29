import { stream, merge$} from './streamy';
import {PromiseQueue, timedBatchProcessing} from './promise-queue';
var ChangeWorker = require("worker-loader!./change-worker.js");

export function list(input$, listSelector, renderFunc) {
	let output$ = stream([]);
	let changeQueue = new PromiseQueue();
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
			changes.forEach(change => {
				changeQueue.add(() => {
					return renderChange(change, inputs, renderFunc, (partialRenderedChange) => {
						// console.log('outputting rendered change', renderedChange);
						output$(partialRenderedChange);
					})
					// .then(() => {
					// 	console.log('rendered change', change);
					// });
				})
				// .then(() => {
				// 	console.log('resolved changes', changes);
				// })
			});
		});
	output$.IS_CHANGE_STREAM = true;
	return output$;
}

function renderChange({index, val, vals, type, num, path }, inputs, renderFunc, batchCallback) {
	if (type === 'add' || type === 'set') {
		let renderedAddElems = [];
		let queue = new PromiseQueue();
		let startTime = now();
		return timedBatchProcessing(vals.map(val => () => {
			return renderFunc(val, inputs);
		}), elems => {
			let partialChange = {
				type,
				index,
				elems,
			};
			index += elems.length;
			batchCallback([partialChange]);
		})
		// .then(() => {
		// 	console.log('finished rendering add bulk', vals);
		// });
	}
	if (type == 'rm') {
		batchCallback([{
			type,
			index,
			num
		}]);
	}
	return Promise.resolve();
}

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
