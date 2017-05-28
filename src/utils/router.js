import {stream } from './';

function interceptLinks(routerState$) {
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

                let anchorSearch = RegExp(/[\/\w]+(\?\w+=\w*(&\w+=\w*))?#(\w+)/g).exec(href);
                if (anchorSearch != null && anchorSearch[3] != null) {
                    setTimeout(() => {
                        let anchorElem = document.getElementById(anchorSearch[3]);
                        anchorElem && anchorElem.scrollIntoView();
                    }, 1);
                }

                //tell the browser not to respond to the link click
                e.preventDefault();
            }
        }
    }

    // callback for HTML5 navigation events
    // save the routing info in the routerState
    function dispatchRouteChange() {
        // remove hash
        let href = location.hash.substr(1, location.hash.length - 1);

        routerState$.patch({
            route: href === '' ? '/' : href.split('?')[0],
            params: getUrlParams(href, location.search)
        });
    }

    // react to HTML5 go back and forward events
    window.onpopstate = function() {
        dispatchRouteChange();
    };

    // listen for link click events at the document level
    document.addEventListener('click', interceptClickEvent);

    // react to initial routing info
    if (location.hash != '' || location.search != '') {
        dispatchRouteChange();
    }
}

function getUrlParams(hash, search) {
    // match query params in urls like:
    // http://localhost:8080/?code=e4a4f94f008a92f12221&code2=abc#/location?code=e4a4f94f008a92f12221&code2=abc
    // the query could be set internaly; then it would be behind the #
    // the query could be set at start; then it would be before the #
    let urlRegex = /(#\/\w*)?(\?(\w+=.*)(&\w+=.*)*)+/g;
    let regExResultHash = RegExp(urlRegex).exec(hash);
    let regExResultSearch = RegExp(urlRegex).exec(search);

    // merge all query params before and after the hash
    let vars = regExResultHash && regExResultHash[3] != null ? regExResultHash[3].split('&') : [];
    vars = regExResultSearch && regExResultSearch[3] != null ? vars.concat(regExResultSearch[3].split('&')) : vars;

    let params = {};
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
export function Router({router$, route}, children) {
    if (router$ == null) {
        console.log('The Router component needs the routerState$ as attribute.')
        return null;
    }
    if (route == null) {
        console.log('The Router component needs the route as attribute.')
        return null;
    }
    // Register the route
    // this is necessary to decide on a default route
    router$.patch({ routes: router$().routes.concat(route) });

    // check if no registered route was hit and set default if so
    let sanitizedRoute$ = router$
        .map(({route, routes}) => {
            if (routes.indexOf(route) === -1) {
                return '/';
            }
            return route;
        });

    let routeWasHit$ = sanitizedRoute$
        .map(curRoute => curRoute === route);
    return routeWasHit$
        .map(hitRoute => hitRoute ? children : []);
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