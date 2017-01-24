import { h } from './utils/streamy-hyperscript';
import { render } from './utils/streamy-render';
import { reduxy } from './utils/reduxy';
import { easyFetch } from './utils/fetch-helper';
import { stream, merge$} from './utils/streamy';
import { clicks, CLICK } from './reducers/clicks';
import {CleverComponent, DumbComponent} from './component';


let store = reduxy({
	clicks
});

render(
	<div id='foo' className='bar'>
		<p className={store.$('clicks.clicks').map(clicks => 'clicks-' + clicks)}
			style={{
				'color': store.$('clicks.clicks').map(clicks => clicks > 0 ? 'red' : 'blue')
			}}>Hello World</p>
		<button onclick={e => {
			store.dispatch({ type: CLICK });
		}}>Click To Count</button>
		<p>{store.$('clicks.clicks')}</p>
		<hr />
		<button onclick={e => {
			fetchStuff();
		}}>Fetch Quote</button>
		<p>{store.$('clicks.fetched').map(payload => !payload ? null : JSON.stringify(payload))}</p>
		<hr />
		<CleverComponent sinks={{store}} />
		<DumbComponent sinks={{store}} />
	</div>
, document.querySelector('app'));

function fetchStuff() {
	easyFetch(store, null)({
		method: 'GET',
		url: 'http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1'
	}, 'FETCHED');
}