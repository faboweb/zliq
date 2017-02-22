import { h } from './utils/streamy-hyperscript';
import { SUBTRACKED } from './reducers/clicks';
import './demo_component.scss';

// component which content is based on store values
export const CleverComponent = ({sinks: {store}}) => {
	return store.$([
		'clicks.nice_message',
		'clicks.clicks'
	]).flatMap(([message, clicks]) => {
		return <div>{message}. Your click count is {clicks}.</div>;
	});
};

// component returning a hyperscript element but interacting with the state
export const DumbComponent = ({sinks: {store, clicks}}) =>
	<button onclick={() => store.dispatch({type: SUBTRACKED})}>subtracked from {clicks}</button>;

// component not interacting with anything -> plain hyperscript
export const SuperDumbComponent = () =>
	<p>HELLO WORLD</p>;