import flyd from 'flyd';
import filter from 'flyd-filter';

export function fetchy(token$?) {
	let request$ = flyd.stream();
	let respons$ = flyd.combine(function(request$, self) {
		makeRequest(request$(), self, token$);
	}, [request$]);

	return (request) => {
		request$(request);
		// filter response for request
		return filter((response) => equalRequests(request, response), respons$);
	};
}

function equalRequests(a, b) {
	return a.url === b.url
		&& a.method === b.method;
}

function makeRequest({url, method, headers, cache}, respons$, token$?) {
	let options = {
		method: method || 'GET',
		headers: Object.assign(token$ && token$() ? {
			'Authentication': `Bearer ${token$()}`
		} : {}, headers),
		mode: 'cors',
		cache: cache || 'default'
	};

	fetch(url, options)
		.then(isAuthenticated(token$))
		.then(res => res.json())
		.then(body => respons$({
			url,
			method,
			headers,
			cache,
			body
		}));
}

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
