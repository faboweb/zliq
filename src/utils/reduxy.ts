import flyd from 'flyd';

export function reduxy(reducers) {
	let action$ = flyd.stream({type: 'INIT'});
	let state$ = flyd.combine(function(action$, self) {
		reduce(self, reducers, action$());
	}, [action$]);

	flyd.combine((action$) => {
		console.log('Action called:', action$());
	}, [action$]);

	return {
		$: state$,
		dispatch: (action) => action$(action)
	};
}

function reduce(state$, reducers, action) {
	let reducerNames = Object.getOwnPropertyNames(reducers);
	state$(reducerNames.reduce((state$, reducer) => {
		let newState = {};
		newState[reducer] = reducers[reducer](state$.map(state => state[reducer])(), action);
		return newState;
	}, state$));
}

export function fetchMiddleware(prefix: string, reducer) {
	return (state, {type, payload}) => {
		let output = Object.assign({}, state);
		switch (type) {
			case prefix + '_LOAD':
				output[prefix.toLowerCase() + '_loading'] = true;
			case prefix + '_SUCCESS':
				output[prefix.toLowerCase() + '_loading'] = false;

				type = prefix;
			case prefix + '_FAILURE':
				output[prefix.toLowerCase() + '_loading'] = false;
				output[prefix.toLowerCase() + '_message'] = payload.message;
		}
		return reducer(output, {type, payload});
	}
}