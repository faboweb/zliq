import {fetchMiddleware} from '../utils/fetch-helper';

export const CLICK = 'CLICK';
export const FETCHED = 'FETCHED';
export const SUBTRACKED = 'SUBTRACKED';

const INITIAL_STORE = {
	nice_message: 'You are beautiful',
	clicks: 0
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