function isAuthenticated(token$) {
	return (res) => {
		if (res.status === 401) {
			token$ && token$(null);
		}
		return res;
	};
}

// interface Request {
// 	url: string;
// 	method: string;
// 	headers?: any;
// 	cache?: string;
// }

export const easyFetch = (store, token$) => (request, actionType) => {
	store.dispatch({ type: actionType + '_LOADING'});

	let options = {
		method: request.method || 'GET',
		headers: Object.assign(token$ && token$() ? {
			'Authentication': `Bearer ${token$()}`
		} : {}, request.headers),
		mode: 'cors',
		cache: request.cache || 'default'
	};

	fetch(request.url, options)
		.then(isAuthenticated(token$))
		.then(res => res.json())
		.then(body => {
			store.dispatch({ type: actionType + '_SUCCESS', payload: body });
		});
};

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