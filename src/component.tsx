import { h } from './utils/streamy-hyperscript';
import { SUBTRACKED } from './reducers/clicks';
import './component.scss';

// component returning a stream
export const CleverComponent = ({sinks: {store}}) => {
	return store.$('clicks.clicks').map(clicks => {
		return <div>Clicks again {clicks}</div>;
	});
};

// component returning a hyperscript element but interacting with the state
export const DumbComponent = ({sinks: {store}}) =>
	<button onclick={() => store.dispatch({type: SUBTRACKED})}>subtracked</button>;

// component not interacting with anything -> plain hyperscript
export const SuperDumbComponent =
	<p>HELLO WORLD</p>;