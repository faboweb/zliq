import {fetchMiddleware} from '../../src/utils/fetch-helper';

export const CLICK = 'CLICK';
export const FETCHED = 'FETCHED';
export const SUBTRACKED = 'SUBTRACKED';

const INITIAL_STORE = {
	clicks: 0,
	fetched: null
};

function clicksReducer(_state, {type, payload}) {
	let state = _state || INITIAL_STORE;
	switch (type) {
		case CLICK: return Object.assign({}, state, {
			clicks: ++state.clicks
		});
		case SUBTRACKED: return Object.assign({}, state, {
			clicks: --state.clicks
		});
		case FETCHED: return Object.assign({}, state, {
			fetched: payload
		});
	}

	return state;
}

export const clicks = fetchMiddleware(FETCHED, clicksReducer);