/*
* replaces a value at a specific index in an array
*/
export function replace(arr, index, value) {
	let newArr = [].concat(arr);
	newArr.splice(index, 1, value);
	return newArr;
}
