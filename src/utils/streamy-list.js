import {Queue} from './queue';
import { stream, merge$} from './streamy';
import {processLargeArrayAsync, iterateAsync} from './array-utils';
var ChangeWorker = require("worker-loader!./change-worker.js");

export function list(input$, listSelector, renderFunc) {
	let output$ = stream([]);
	let queue = Queue();
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
		queue.add(function() {
			let chunk = [];
			return processLargeArrayAsync(
				changes, 
				({subIndex, item}) => {
					chunk.push({
						subIndex,
						elem: item != null ? renderFunc(item, inputs) : null
					});
				}, 
				200, 
				() => {
					output$(chunk);
					chunk = [];
				});
		}());
	});
	output$.IS_CHANGE_STREAM = true;
	return output$;
}

// calculate the difference in the array
// do the calculation in a worker to not block UI-thread
function listChanges$(arr$) {
	let oldValue = [];
	let changes$ = stream([]);
	let changeWorker = new ChangeWorker();
	changeWorker.onmessage = ({ data: { changes }}) => {
		changes$(changes.map(({index, item}) => {
			return {
				subIndex: index,
				item
			};
		}));
	}
	arr$.map(arr => {
		changeWorker.postMessage({ newArr: arr, oldArr: oldValue });
		oldValue = arr;
	});
	return changes$;
}