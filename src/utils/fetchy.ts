import * as flyd from 'flyd';

export function fetchy(token) {
    let request$ = flyd.stream();
    let respons$ = flyd.combine(function(request$, self) {
        makeRequest(request$(), token(), self);
    }, [request$]);

    return {
        request$,
        respons$
    }
}

function makeRequest({url, method, headers, cache}, token, respons$) {
    let options = { 
        method: method || 'GET',
        headers: Object.assign({
            'Authentication': `Bearer ${token}`
        }, headers),
        mode: 'cors',
        cache: cache || 'default' 
    };

    fetch(url, options)
        .then(isAuthenticated)
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
            token$(null);
        }
        return res;
    }
}