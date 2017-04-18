import {stream, merge$} from './streamy';

/*
* simple action -> reducers -> state mashine
*/
export function reduxy(reducers) {
	let action$ = stream({type: 'INIT'});
	let state$ = stream();
	action$.map((action, self) => reduce(state$, reducers, action));
	// action$.map((action) => console.log('Action called:', action));
	// state$.map((state) => console.log('New State:', state));

	return {
		// query a value from the store
		// as we probably render according to the values of this store only serve distinct values
		// query format: {reducer}.{property}.{subproperty}
		$: (query) => state$.$(query).distinct(),
		dispatch: (action) => {
			action$(action);
			return;
		}
	};
}

/*
* applies reducers to an action for a state stream
* the resulting store object has the format { {reducerName}: {reducerValue} }
*/
function reduce(state$, reducers, action) {
	let reducerNames = Object.getOwnPropertyNames(reducers);
	state$(reducerNames.reduce((state, reducer) => {
		let newState = state || {};
		newState[reducer] = reducers[reducer](newState[reducer], action);
		return newState;
	}, state$()));
}

/*
* query a value from the streams value
* query format: {reducer}.{property}.{subproperty}
*/
export function queryStore(state$, query) {
	if (!query) return state$;
	return state$.deepSelect(query);
};