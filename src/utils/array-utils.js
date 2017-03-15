/*
* replaces a value at a specific index in an array
*/
export function replace(arr, index, value) {
	let newArr = [].concat(arr);
	newArr.splice(index, 1, value);
	return newArr;
}

export function processLargeArrayAsync(array, fn, maxTimePerChunk, onChunk) {
	return iterateAsync(array.length, index => {
		fn(array[index], index)
	}, maxTimePerChunk, onChunk);
}

export function iterateAsync(length, fn, maxTimePerChunk, onChunk) {
	return new Promise((resolve, reject) => {
		maxTimePerChunk = maxTimePerChunk || 200;
		var index = 0;

		function now() {
			return new Date().getTime();
		}

		function doChunk() {
			var startTime = now();
			while (index < length && (now() - startTime) <= maxTimePerChunk) {
				fn(index);
				++index;
			}
			onChunk && onChunk();
			if (index < length) {
				// set Timeout for async iteration
				setTimeout(doChunk, 1);
			} else {
				resolve();
			}
		}    
		setTimeout(doChunk, 1);
	});
}
