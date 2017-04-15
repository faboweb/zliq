import {h} from '../utils/streamy-hyperscript';

export const NEW_ROUTE = 'NEW_ROUTE';

const INITIAL_STORE = {
	route: '/',
	params: {}
};

// we use a reducer to unify the way we check for information
export function routerReducer(_state, {type, payload}) {
	let state = _state || INITIAL_STORE;
	switch (type) {
		case NEW_ROUTE: return Object.assign({}, state, {
			route: payload.route,
			params: payload.params
		});
	}

	return state;
}

export function initRouter(store) {
    // intercepts clicks on links
    // if the link is local '/...' we change the location hash instead
	function interceptClickEvent(e) {
        var href;
        var target = e.target || e.srcElement;
        if (target.tagName === 'A') {
            href = target.getAttribute('href');
            let isLocal = href != null && href.startsWith('/');

            //put your logic here...
            if (isLocal) {
                location.hash = href;

                //tell the browser not to respond to the link click
                e.preventDefault();
            }
        }
    }

    // callback for HTML5 navigation events
    // save the routing info in the store
    function dispatchRouteChange() {
        let href = location.hash.substr(1, location.hash.length - 1);
        store.dispatch({ type: NEW_ROUTE, payload: {
            route: href === '' ? '/' : href.split('?')[0],
            params: getUrlParams(href)
        }});
    }

    // react to HTML5 go back and forward events
    window.onpopstate = function() {
        dispatchRouteChange();
    };

    // listen for link click events at the document level
    document.addEventListener('click', interceptClickEvent);

    // react to initial routing info
    if (location.hash != '') {
        dispatchRouteChange();
    }
}

// src: http://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-get-parameters
function getUrlParams(href) {
    var params = {};
    if (href === '') {
        return params;
    };
    let splitHref = href.split('?');
    if (splitHref.length == 0) {
        return params;
    }
    var query = splitHref[1];
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
            // If first entry with this name
        if (typeof params[pair[0]] === "undefined") {
            params[pair[0]] = decodeURIComponent(pair[1]);
            // If second entry with this name
        } else if (typeof params[pair[0]] === "string") {
            var arr = [ params[pair[0]],decodeURIComponent(pair[1]) ];
            params[pair[0]] = arr;
            // If third or later entry with this name
        } else {
            params[pair[0]].push(decodeURIComponent(pair[1]));
        }
    } 
    return params;
}

// this is an element that shows it's content only if the expected route is met
export function Router({store, route}, children) {
    if (store == null) {
        console.log('The Router component needs the store as attribute.')
        return null;
    }
    if (route == null) {
        console.log('The Router component needs the route as attribute.')
        return null;
    }
    return store.$('router.route').map(curRoute => curRoute === route)
        .map(hitRoute => hitRoute ? children : []);
}