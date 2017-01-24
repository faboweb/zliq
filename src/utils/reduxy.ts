import {stream, merge$} from './streamy';

export function reduxy(reducers) {
	let action$ = stream({type: 'INIT'});
	let state$ = stream();
	action$.map((action, self) => reduce(state$, reducers, action));
	// action$.map((action) => console.log('Action called:', action));
	// state$.map((state) => console.log('New State:', state));

	return {
		$: (query) => queryStore(state$, query).distinct(),
		dispatch: (action) => {
			action$(action);
			return;
		}
	};
}

function reduce(state$, reducers, action) {
	let reducerNames = Object.getOwnPropertyNames(reducers);
	state$(reducerNames.reduce((state, reducer) => {
		let newState = state || {};
		newState[reducer] = reducers[reducer](newState[reducer], action);
		return newState;
	}, state$()));
}

function queryStore(state$, query) {
	if (!query) return state$;
	return state$.deepSelect(query);
};