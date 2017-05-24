import { stream } from './';

/*
* middleware to log the user out if not authorized
* returns a middleware that sets the token stream value to null if the request is not authenticated
*/
function isAuthenticated(auth$) {
	return (res) => {
		if (res.status === 401) {
			auth$ && auth$(null);
		}
		return res;
	};
}

export const promise$ = (promise) => {
	let output$ = stream({
		loading: true,
		error: null,
		data: null
	});

	promise
	.then(result => {
		output$.patch({
			loading: false,
			data
		});
	}, error => {
		output$.patch({
			loading: false,
			error
		});
	});

	return output$;
}

/*
* TODO
* wrapper for LOADING -> SUCCESS / FAILED actions
* also adds oauth header for a provided oauth-token stream
*/
export const fetchy = (request, extractData, auth$) => {
	extractData = extractData || (a => a);

	let options = {
		method: request.method || 'GET',
		headers: Object.assign(auth$ && auth$() ? {
			'Authentication': auth$()
		} : {}, request.headers),
		mode: 'cors',
		cache: request.cache || 'default'
	};

	return promise$(
		fetch(request.url, options)
			.then(isAuthenticated(auth$))
			.then(res => res.json())
			.then(body => extractData(body))
	);
};
