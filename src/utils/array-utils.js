/*
* replaces a value at a specific index in an array
*/
export function replace(arr, index, value) {
	let newArr = [].concat(arr);
	newArr.splice(index, 1, value);
	return newArr;
}

export function processLargeArrayAsync(array, fn, maxTimePerChunk, onChunk) {
	return iterateAsync(array.length, function iterateElem(index) {
		return fn(array[index], index)
	}, maxTimePerChunk, onChunk);
}

export function iterateAsync(length, fn, maxTimePerChunk, onChunk) {
	return new Promise((resolve, reject) => {
		maxTimePerChunk = maxTimePerChunk || 200;
		var index = 0;
		var startTime = now();

		function now() {
			return new Date().getTime();
		}

		// TODO refactor
		function doChunk() {
			if (index < length && (now() - startTime) <= maxTimePerChunk) {
				let result = fn(index++);
				if (result != null && result.then != null) {
					return result.then(() => doChunk());
				} else {
					return doChunk();
				}
			} else {
				onChunk && onChunk();
				if (index < length) {
					startTime = now();
					// set Timeout for async iteration
					setTimeout(doChunk, 1);
				} else {
					resolve();
				}
			}
		}    
		setTimeout(doChunk, 1);
	});
}
