export const CLICK = 'CLICK';

const INITIAL_STORE = {
	clicks: 0
};

export function clicks(_state, {type, payload}) {
	let state = _state || INITIAL_STORE;
	switch (type) {
		case CLICK: return Object.assign({}, state, {
			clicks: ++state.clicks
		});
	}

	return state;
}