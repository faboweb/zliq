import { h } from '../src/utils/streamy-hyperscript';
import { CLICK, SUBTRACKED } from './reducers/clicks';
import { Router } from '../src/reducers/router';
import { CleverComponent, DumbComponent, SuperDumbComponent } from './demo_component.jsx';
import { easyFetch } from '../src/utils/fetch-helper';

export function Example({store}) {
    return <div class='section'>
        <div class="row center">
            <h3 class="light header">Examples</h3>
            <p class="col s12 m8 offset-m2 caption">Play around with it. See the reactive changes.</p>
        </div>
        <div class="row">
            <div class="col s12">
                <h5>Render a simple sub component</h5>
                <SuperDumbComponent />
			    <div class="divider"></div>
                <h5>Manipulate the state/store and display the data</h5>
                <button class="btn waves-effect waves-light" onclick={e => store.dispatch({ type: CLICK })}>+1</button>
                <button class="btn waves-effect waves-light" onclick={e => store.dispatch({ type: SUBTRACKED })}>-1</button>
                <p>Counter: {store.$('clicks.clicks')}</p>
			    <div class="divider"></div>
                <h5>Properties can be streams as well</h5>
                <p class={store.$('clicks.clicks').map(clicks => 'clicks-' + clicks)}
                    style={{
                        'color': store.$('clicks.clicks').map(clicks => clicks > 0 ? 'red' : 'blue')
                    }}>This is red when the counter is greater 0 and blue if not.</p>
			    <div class="divider"></div>
                <h5>Fetching data from a remote source is a breeze</h5>
                <button class="btn waves-effect waves-light" onclick={e => fetchStuff(store)}>Fetch Quote</button>
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
			    <div class="divider"></div>
                <h5>Components can have a nested state</h5>
                <CleverComponent store={store} />
			    <div class="divider"></div>
                <h5>Components can manipulate any stream (or redux store) given to them</h5>
                <DumbComponent store={store} />
			    <div class="divider"></div>
                <h5>ZLIQ has a basic router</h5>
                <p>
                    You are currently at route '{store.$('router.route')}' 
                    with params '{store.$('router.params').map(params => JSON.stringify(params))}'.
                </p>
                <a class="btn" href='/?foo=bar'>Go to '/?foo=bar'</a>
            </div>
        </div>
	</div>;
};

// easy fetch is a little helper to handle requests and how they are handled by redux
// it has a counterpart in your reducer to listen for the actions
// it sets the {x}_loading and {x}_message properties in the store
function fetchStuff(store) {
	easyFetch(store, null)({
		method: 'GET',
		url: 'http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1'
	}, 'FETCHED');
}