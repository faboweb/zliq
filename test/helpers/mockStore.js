import {stream} from '../../src/utils/streamy';
import {queryStore} from '../../src/utils/reduxy';

// store without reducers
export const mockStore = (store_value) => {
	let state$ = stream(store_value);
	let action$ = stream();
	return {
		$: (query) => queryStore(state$, query).distinct(),
		dispatch: (action) => {
			action$(action);
			// on actions just dispatch the initial value again
			state$(store_value);
			return;
		},
		state$,
		action$
	};
};
