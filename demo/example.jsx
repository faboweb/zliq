import Prism from 'prismjs';
import 'prismjs/components/prism-jsx.js';
import { h, easyFetch, Router, UPDATE_DONE, stream } from '../src';
import { CLICK, SUBTRACKED } from './reducers/clicks';
import { CleverComponent, DumbComponent, SuperDumbComponent } from './demo_component.jsx';
import './example.scss';

export function Examples({store}) {
    let activeExample$ = stream(0);
    let exampleSection =
        <div class='section'>
            <div class="row center">
                <h3 class="light header highlight">Examples</h3>
                <p class="col s12 m8 offset-m2 caption">Play around with it. See the reactive changes.</p>
            </div>
            <div class="row">
                <div class="col s12">
                    <ul class="collapsible" data-collapsible="accordion">
                        <Example exampleId={0} title="Render a simple sub component" activeExample$={activeExample$}>
                            { Markup(`
                                    // definition
                                    export const SuperDumbComponent = () =>
                                        <p>HELLO WORLD</p>;
                                    
                                    // usage
                                    <SuperDumbComponent />
                                `) }
                            <Output>
                                <SuperDumbComponent />
                            </Output>
                        </Example>
                        <Example exampleId={1} title="Manipulate the state/store and display the data" activeExample$={activeExample$}>
                            { 
                                Markup(`
                                    <button onclick={e => store.dispatch({ type: CLICK })}>+1</button>
                                    <button onclick={e => store.dispatch({ type: SUBTRACKED })}>-1</button>
                                    <p>Counter: {store.$('clicks.clicks')}</p>
                                `) 
                            }
                            <Output>
                                <button class="btn waves-effect waves-light highlight highlight-background" onclick={e => store.dispatch({ type: CLICK })}>+1</button>
                                <button class="btn waves-effect waves-light highlight highlight-background" onclick={e => store.dispatch({ type: SUBTRACKED })}>-1</button>
                                <p>Counter: {store.$('clicks.clicks')}</p>
                            </Output>
                        </Example>
                        <Example exampleId={2} title="Properties can be streams as well" activeExample$={activeExample$}>
                            { 
                                Markup(`
                                    <p class={store.$('clicks.clicks').map(clicks => 'clicks-' + clicks)}
                                        style={{
                                            'color': store.$('clicks.clicks').map(clicks => clicks > 0 ? 'red' : 'blue')
                                        }}>
                                        This is red when the counter is greater 0 and blue if not.
                                    </p>
                                    <button onclick={e => store.dispatch({ type: CLICK })}>+1</button>
                                `) 
                            }
                            <Output>
                                <p class={store.$('clicks.clicks').map(clicks => 'clicks-' + clicks)}
                                    style={{
                                        'color': store.$('clicks.clicks').map(clicks => clicks > 0 ? 'red' : 'blue')
                                    }}>
                                    This is red when the counter is greater 0 and blue if not.
                                </p>
                                <button class="btn waves-effect waves-light highlight highlight-background" onclick={e => store.dispatch({ type: CLICK })}>+1</button>
                            </Output>
                        </Example>
                        <Example exampleId={3} title="Fetching data from a remote source is a breeze" activeExample$={activeExample$}>
                            { 
                                Markup(`
                                    <button onclick={e => fetchStuff(store)}>Fetch Quote</button>
                                    {
                                        store
                                            .$(['clicks.fetched_loading', 'clicks.fetched_error', 'clicks.fetched'])
                                            .map(([fetched_loading, fetched_error, fetched]) => {
                                                if (fetched_loading) {
                                                    return 'Loading ...';
                                                }
                                                if (fetched_error != null) {
                                                    return <p>An error occurred: {fetched_error}</p>;
                                                }
                                                if (fetched != null) {
                                                    return <p>Fetched quote: {JSON.stringify(fetched)}</p>;
                                                }
                                            })
                                    }
                                `) 
                            }
                            <Output>
                                <button class="btn waves-effect waves-light highlight highlight-background" onclick={e => fetchStuff(store)}>Fetch Quote</button>
                                {
                                    store
                                        .$(['clicks.fetched_loading', 'clicks.fetched_error', 'clicks.fetched'])
                                        .map(([fetched_loading, fetched_error, fetched]) => {
                                            if (fetched_loading) {
                                                return 'Loading ...';
                                            }
                                            if (fetched_error != null) {
                                                return <p>An error occurred: {fetched_error}</p>;
                                            }
                                            if (fetched != null) {
                                                return <p>Fetched quote: {JSON.stringify(fetched)}</p>;
                                            }
                                        })
                                }
                            </Output>
                        </Example>
                        <Example exampleId={4} title="Components can have a nested state" activeExample$={activeExample$}>
                            { 
                                Markup(`
                                    // definition
                                    export const CleverComponent = ({store}) => {
                                        let clicksTimes2 = store.$('clicks.clicks').map(clicks => clicks * 2);
                                        return <p>Clicks times 2: {clicksTimes2}</p>;
                                    };

                                    // usage
                                    <CleverComponent store={store} />
                                    <button onclick={e => store.dispatch({ type: CLICK })}>+1</button>
                                `) 
                            }
                            <Output>
                                <CleverComponent store={store} />
                                <button class="btn waves-effect waves-light highlight highlight-background" onclick={e => store.dispatch({ type: CLICK })}>+1</button>
                            </Output>
                        </Example>
                        <Example exampleId={5} title="Components can manipulate any stream (or redux store) given to them" activeExample$={activeExample$}>
                            { 
                                Markup(`
                                    // definition
                                    export const DumbComponent = ({store}) =>
                                        <p>
                                            <button onclick={() => store.dispatch({type: SUBTRACKED})}>-1</button>
                                        </p>;

                                    // usage
                                    <DumbComponent store={store} />
                                    <p>Counter: {store.$('clicks.clicks')}</p>
                                `) 
                            }
                            <Output>
                                <DumbComponent store={store} />
                                <p>Counter: {store.$('clicks.clicks')}</p>
                            </Output>
                        </Example>
                        <Example exampleId={6} title="ZLIQ provides a basic router" activeExample$={activeExample$}>
                            { 
                                Markup(`
                                    // the router catches local routes and prevents a page refresh
                                    <a class="btn" href='/?foo=bar'>Go to '/?foo=bar'</a>

                                    // access route and param information from the store
                                    <p>
                                        You are currently at route '{store.$('router.route')}' 
                                        with params '{store.$('router.params').map(params => JSON.stringify(params))}'.
                                    </p>

                                    // the router has a ready to use element to display content only for certain routes
                                    <Router store={store} route={'/subroute'}>
                                        This will not be visible.
                                    </Router>
                                `) 
                            }
                            <Output>
                                <a class="btn highlight highlight-background" href='/?foo=bar'>Go to '/?foo=bar'</a>
                                <p>
                                    You are currently at route '{store.$('router.route')}' 
                                    with params '{store.$('router.params').map(params => JSON.stringify(params))}'.
                                </p>
                                <Router store={store} route={'/subroute'}>
                                    This will not be visible.
                                </Router>
                            </Output>
                        </Example>
                    </ul>
                </div>
            </div>
        </div>;

    return exampleSection;
};

function Markup(code) {
    return <pre>
        <code class="language-jsx">{code}</code>
    </pre>;
}

function Output(props, children) {
    return <pre class="example-output">
        {children}
    </pre>;
}

function Example({exampleId, title, activeExample$}, children) {
    return <li>
            <div 
                className={activeExample$.map(active => `collapsible-header ${active === exampleId ? 'active' : ''}`)}
                onclick={() => activeExample$(exampleId)}
            >
                {title}
            </div>
            <div class="collapsible-body">
                { children }
            </div>
        </li>;
}

// easy fetch is a little helper to handle requests and how they are handled by redux
// it has a counterpart in your reducer to listen for the actions
// it sets the {x}_loading and {x}_message properties in the store
function fetchStuff(store) {
	easyFetch(store, null)({
		method: 'GET',
		url: 'http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1'
	}, 'FETCHED');
}