import { render } from 'preact';
import { h } from 'preact-flyd';
import ph from './preact-hyperscript-helpers';
const { div, span, button} = ph(h);
import { reduxy } from './reduxy';
import { clicks, CLICK } from './reducers/clicks';
import flyd from 'flyd';
import { deepSelect } from './flyd-utils';

let { action$, state$ } = reduxy({
	clicks
});

render(
	div('#foo.bar', [
		span('Hello, world!'),
		span(deepSelect(state$, 'clicks.clicks')),
		button({
			onclick: e => {
				console.log('clicked');
				action$({ type: CLICK });
			}
		}, 'Click Me'),
	])
, document.querySelector('app'));