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
