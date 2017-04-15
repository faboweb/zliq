import { h, list } from './utils';
import { SUBTRACKED } from './reducers/demo_clicks';
import './demo_component.scss';

// component with a local state
export const CleverComponent = ({store}) => {
	let clicksTimes2 = store.$('clicks.clicks').map(clicks => clicks * 2);
	return <div>Clicks times 2: {clicksTimes2}</div>;
};

// component returning an element that interacts with the state
export const DumbComponent = ({store}) =>
	<button onclick={() => store.dispatch({type: SUBTRACKED})}>subtracked</button>;

// component not interacting with anything -> plain hyperscript returns an element
export const SuperDumbComponent = () =>
	<p>HELLO WORLD</p>;