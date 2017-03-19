import { stream, merge$} from './streamy';
import {processLargeArrayAsync, iterateAsync} from './array-utils';
var ChangeWorker = require("worker-loader!./change-worker.js");

export function list(input$, listSelector, renderFunc) {
	let output$ = stream([]);
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
		.map(function renderChanges([changes, inputs]) {
			let renderedChanges = [];
			processLargeArrayAsync(changes, function renderChange({index, val, vals, type, num, path }) {
				if (type === 'add') {
					let renderedAddElems = [];
					return processLargeArrayAsync(vals, function renderElement(val) { 
							renderedAddElems.push(renderFunc(val, inputs));
						}, 100, function onRenderedAddPatially() {
							if (renderedAddElems.length == 0) {
								return;
							}
							renderedChanges.push({
								type,
								index,
								elems: renderedAddElems,
							});
							index += renderedAddElems.length;
							renderedAddElems = [];
						});
				}
				if (type == 'rm') {
					renderedChanges.push({
						type,
						index,
						num
					});
				}
				if (type == 'set') {
					renderedChanges.push({
						type,
						index,
						elems: val != null ? [renderFunc(val, inputs)] : null
					});
				}
			}, 200, function onRenderedBatch() {
				output$(renderedChanges);
				renderedChanges = [];
			});
		});
	output$.IS_CHANGE_STREAM = true;
	return output$;
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
