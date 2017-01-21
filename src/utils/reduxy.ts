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