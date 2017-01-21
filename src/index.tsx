// import { render } from 'preact';
// import { h } from 'preact-flyd';
import { h } from './utils/flyd-hyperscript';
import { render } from './utils/flyd-render';
import ph from './utils/preact-hyperscript-helpers';
const { div, span, button } = ph(h);
import { reduxy } from './utils/reduxy';
import { clicks, CLICK } from './reducers/clicks';
import flyd from 'flyd';
import { deepSelect } from './utils/flyd-utils';

let { action$, state$ } = reduxy({
	clicks
});

render(
	// div('#foo.bar', [
	// 	span('Hello, world!'),
	// 	span(deepSelect(state$, 'clicks.clicks')),
	// 	button({
	// 		onclick: e => {
	// 			console.log('clicked');
	// 			action$({ type: CLICK });
	// 		}
	// 	}, 'Click Me'),
	// ])
	<div id='foo' className='bar'>
		<span>Hello World</span>
		<span>{deepSelect(state$, 'clicks.clicks')}</span>
		<button onclick={e => {
			console.log('clicked');
			action$({ type: CLICK });
		}}>Click Me</button>
	</div>
, document.querySelector('app'));
