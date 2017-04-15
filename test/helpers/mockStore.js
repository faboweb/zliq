import {stream} from '../../src/utils/streamy';
import {queryStore} from '../../src/utils/reduxy';

// store without reducers and direct access to internals
export const mockStore = (store_value) => {
	let state$ = stream(store_value);
	let action$ = stream();
	return {
		$: (query) => state$.$(query).distinct(),
		dispatch: (action) => {
			action$(action);
			// on actions just dispatch the initial value again
			state$(store_value);
			return;
		},
		// for ease of use we provide the state$ for easy changes
		state$,
		// we provide the action$ to check if actions are performed
		action$
	};
};
