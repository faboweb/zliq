import {stream} from '../src/utils/streamy';

export const mockStore = (store_value) => {
	return {
		$: (query) => stream(store_value),
		dispatch: (action) => {
			return;
		}
	};
};
