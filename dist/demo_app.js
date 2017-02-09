define(["require", "exports", "./utils/streamy-hyperscript", "./utils/streamy-render", "./utils/reduxy", "./utils/fetch-helper", "./reducers/clicks", "./component"], function (require, exports, streamy_hyperscript_1, streamy_render_1, reduxy_1, fetch_helper_1, clicks_1, component_1) {
    "use strict";
    // create the store providing reducers
    var store = reduxy_1.reduxy({
        clicks: clicks_1.clicks
    });
    // main render function for the application
    // render provided hyperscript into a parent element
    streamy_render_1.render(streamy_hyperscript_1.h("div", { id: 'foo', className: 'bar' },
        streamy_hyperscript_1.h("p", { className: store.$('clicks.clicks').map(function (clicks) { return 'clicks-' + clicks; }), style: {
                'color': store.$('clicks.clicks').map(function (clicks) { return clicks > 0 ? 'red' : 'blue'; })
            } }, "Hello World"),
        streamy_hyperscript_1.h("button", { onclick: function (e) { return store.dispatch({ type: clicks_1.CLICK }); } }, "Click To Count"),
        streamy_hyperscript_1.h("p", null, store.$('clicks.clicks')),
        streamy_hyperscript_1.h("hr", null),
        streamy_hyperscript_1.h("button", { onclick: function (e) { return fetchStuff(); } }, "Fetch Quote"),
        streamy_hyperscript_1.h("p", null, store.$('clicks.fetched').map(function (payload) { return !payload ? null : JSON.stringify(payload); })),
        streamy_hyperscript_1.h("hr", null),
        streamy_hyperscript_1.h(component_1.CleverComponent, { sinks: { store: store } }),
        streamy_hyperscript_1.h(component_1.DumbComponent, { sinks: { store: store } })), document.querySelector('app'));
    function fetchStuff() {
        fetch_helper_1.easyFetch(store, null)({
            method: 'GET',
            url: 'http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1'
        }, 'FETCHED');
    }
});
//# sourceMappingURL=demo_app.js.map