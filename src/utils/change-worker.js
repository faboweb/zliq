import deepEqual from 'deep-equal';

onmessage = function({data: {
	newArr, oldArr
}}) {
    var totalLength = newArr.length > oldArr.length ? newArr.length : oldArr.length;
    var changes = [];
    for(var index = 0; index < totalLength; index++) {
        if (!deepEqual(newArr[index], oldArr[index])) {
            changes.push({
                index,
                item: newArr[index]
            });
        }
    }
    postMessage({
        changes: changes
    });
}