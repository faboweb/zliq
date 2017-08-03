import {stream, if$, merge$, flatten} from './';

function interceptLinks(routerState$) {
    // intercepts clicks on links
    // if the link is local '/...' we change the location hash instead
	function interceptClickEvent(e) {
        let target = e.target || e.srcElement;
        if(target.tagName === 'A') {
            let href = target.getAttribute('href');
            let isLocal = href != null && href.startsWith('/');
            let isAnchor = href != null && href.startsWith('#');

            if(isLocal || isAnchor) {
                let {anchor, route, query} = parseLink(href);
                if(route === undefined) {
                    route = routerState$.value.route;
                }
                goTo(routerState$, anchor, route, query);
                //tell the browser not to respond to the link click
                e.preventDefault();
            }
        }
    }

    // react to HTML5 go back and forward events
    window.onpopstate = function(event) {
        if(event.state) {
            let {route, query} = event.state;
            dispatchRouteChange(routerState$, route, query);
        }
    };

    // listen for link click events at the document level
    document.addEventListener('click', interceptClickEvent);

    // react to initial routing info
    if(location.pathname !== '/' || location.search !== "") {
        // construct initial routing link
        let href = location.pathname + location.search + location.hash;
        let {route, query} = parseLink(location.pathname + location.search + location.hash);
        dispatchRouteChange(routerState$, route, query);
    }
}


// TODO refactor
function getUrlParams(hash, search) {
    // match query params in urls like:
    // http://localhost:8080/?code=e4a4f94f008a92f12221&code2=abc#/location?code=e4a4f94f008a92f12221&code2=abc
    // the query could be set internaly; then it would be behind the #
    // the query could be set at start; then it would be before the #
    let urlRegex = /(#\/\w*)?(\?(\w+=\w*)(&\w+=\w*)*)+(#\w+)?/g;
    let regExResultHash = RegExp(urlRegex).exec(hash);
    let regExResultSearch = RegExp(urlRegex).exec(search);

    // merge all query params before and after the hash
    let vars = regExResultHash && regExResultHash[3] != null ? regExResultHash[3].split('&') : [];
    vars = regExResultSearch && regExResultSearch[3] != null ? vars.concat(regExResultSearch[3].split('&')) : vars;

    let params = {};
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
            // If first entry with this name
        if(typeof params[pair[0]] === "undefined") {
            params[pair[0]] = decodeURIComponent(pair[1]);
            // If second entry with this name
        } else if(typeof params[pair[0]] === "string") {
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
export function Router({router$, route}, children$) {
    if(router$ == null) {
        console.log('The Router component needs the routerState$ as attribute.')
        return null;
    }
    if(route == null) {
        console.log('The Router component needs the route as attribute.')
        return null;
    }
    // Register the route
    // this is necessary to decide on a default route
    router$.$('routes')
    // routes can be attached async so we check if the route exists and if not add it
    .map((routes) => routes.indexOf(route) === -1 && router$.patch({ routes: routes.concat(route) }));

    // check if no registered route was hit and set default if so
    let sanitizedRoute$ = router$
        .map(({route, routes}) => {
            if(routes.indexOf(route) === -1) {
                return '/';
            }
            return route;
        });

    let routeWasHit$ = sanitizedRoute$.is(route).distinct();
    return merge$([routeWasHit$, children$]).map(([wasHit, children]) => {
        return wasHit ? children : []
    });
}

export function initRouter() {
    let routerState$ = stream({
        route: '',
        params: {},
        routes: ['/']
    });

    interceptLinks(routerState$);

    return routerState$;
}

// matching links in the form of /route/subroute?param1=a&param2=b#anchor
function parseLink(link) {
    let regexp = /((\/\w*)*)?(\?((\w+=\w*)(&(\w+=\w*)+)*))?(#(\w+))?/;
    let matchArr = regexp.exec(link);
    return {
        anchor: matchArr[9],
        route: matchArr[1],
        query: matchArr[4]
    }
}

// callback for HTML5 navigation events
// save the routing info in the routerState
function dispatchRouteChange(routerState$, route, query) {
    // remove hash
    let href = location.hash.substr(1);
    routerState$.patch({
        route: route || '',
        params: getUrlParams(href, location.search)
    });
}

function goTo(routerState$, anchor, route, query) {
    history.pushState({anchor, route, query}, '', `/${route ? route.substr(1) : ''}${query ? '?' + query : ''}`);
    if(anchor) {
       location.hash = '#' + anchor;
    }
    dispatchRouteChange(routerState$, route, query);
}