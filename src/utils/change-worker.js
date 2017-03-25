import odiff from 'odiff';

onmessage = function({data: {
	newArr, oldArr
}}) {
    let changes = odiff(oldArr, newArr);
    changes = changes.map(change => {
        // changes in arrays are currently analysed deep
        // but we only need the changed element
        if (change.type === 'set' && change.path && typeof change.path[0] === 'number') {
            let index = change.path[0];
            change.val = newArr[index];
            change.index = index;
            // we interprete set like add to reduce complexity
            change.type === 'add';
        }
        return change;
    });
    postMessage({
        changes: changes
    });
}