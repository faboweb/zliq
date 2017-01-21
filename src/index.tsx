import { h } from './utils/flyd-hyperscript';
import { render } from './utils/flyd-render';
import { reduxy } from './utils/reduxy';
import { easyFetch } from './utils/fetch-helper';
import { clicks, CLICK } from './reducers/clicks';
import flyd from 'flyd';
import { deepSelect } from './utils/flyd-utils';

let store = reduxy({
	clicks
});

render(
	<div id='foo' className='bar'>
		<span>Hello World</span>
		<span>{deepSelect(store.$, 'clicks.clicks')}</span>
		<button onclick={e => {
			store.dispatch({ type: CLICK });
		}}>Click Me</button>
		<button onclick={e => {
			fetchStuff();
		}}>Click Me</button>
		<span>{deepSelect(store.$, 'clicks.fetched').map(payload => JSON.stringify(payload))}</span>
	</div>
, document.querySelector('app'));

function fetchStuff() {
	easyFetch(store, null)({
		method: 'GET',
		url: 'http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1'
	}, 'FETCHED');
}