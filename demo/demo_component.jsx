import { h, list } from '../src/utils';
import { SUBTRACKED } from './reducers/clicks';
import './demo_component.scss';

// component with a local state
export const CleverComponent = ({store}) => {
	let clicksTimes2 = store.$('clicks.clicks').map(clicks => clicks * 2);
	return <p>Clicks times 2: {clicksTimes2}</p>;
};

// component returning an element that interacts with the state
export const DumbComponent = ({store}) =>
	<p>
		<button class="btn waves-effect waves-light" onclick={() => store.dispatch({type: SUBTRACKED})}>-1</button>
	</p>;

// component not interacting with anything -> plain hyperscript returns an element
export const SuperDumbComponent = () =>
	<p>HELLO WORLD</p>;