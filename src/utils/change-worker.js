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
            return {
                val: newArr[index],
                index,
                type: change.type
            };
        }
        return change;
    });
    // set changes are singular changes
    // aggregate those to be able to batch process them
    let aggregatedSetChange;
    changes = changes.reduce((_changes_, cur) => {
        if (cur.type === 'set') {
            if (aggregatedSetChange == null) {
                aggregatedSetChange = {
                    index: [],
                    vals: [],
                    type: 'set'
                }
            }
            aggregatedSetChange.index.push(cur.index);
            aggregatedSetChange.vals.push(cur.val);
            return _changes_;
        }
        if (aggregatedSetChange != null) {
            _changes_ = _changes_.concat(aggregatedSetChange);
            aggregatedSetChange = null;
        }
        return _changes_.concat(cur);
    }, []);
    if (aggregatedSetChange != null) {
        changes = changes.concat(aggregatedSetChange);
    }
    
    postMessage({
        changes: changes
    });
}