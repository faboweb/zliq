/*
* middleware to log the user out if not authorized
* returns a middleware that sets the token stream value to null if the request is not authenticated
*/
function isAuthenticated(token$) {
	return (res) => {
		if (res.status === 401) {
			token$ && token$(null);
		}
		return res;
	};
}

/*
* wrapper for LOADING -> SUCCESS / FAILED actions
* also adds oauth header for a provided oauth-token stream
*/
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

/*
* enrich a reducer with LOADING -> SUCCESS / FAILED for a certain prefix
* sets a {prefix}_loading flag
* sets a {prefix}_message on errors
* on success provides a action of type {prefix} to the wrapped reducer
* use like: fetchMiddleware('users', usersReducer)
*/
export function fetchMiddleware(prefix, reducer) {
	return (state, {type, payload}) => {
		let output = state;
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
	};
}