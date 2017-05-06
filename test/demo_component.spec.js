import { h, stream, list, UPDATE_DONE } from '../src';
import assert from 'assert';

describe('Components', () => {
	it('should show a component', () => {
		let element = <p>HELLO WORLD</p>;
		assert.equal(element.outerHTML, '<p>HELLO WORLD</p>');
	});

	it('should react to inputs', () => {
		let clicks$ = stream(3);
		let DoubleClicks = ({clicks$}) =>
			<p>Clicks times 2: {clicks$.map(clicks => 2*clicks)}</p>;
		let component = <DoubleClicks clicks$={clicks$} />;
		assert.equal(component.outerHTML, '<p>Clicks times 2: 6</p>');
	});

	it('CleverComponent should update on input stream update', () => {
		let clicks$ = stream(3);
		let DoubleClicks = ({clicks$}) =>
			<p>Clicks times 2: {clicks$.map(clicks => 2*clicks)}</p>;
		let component = <DoubleClicks clicks$={clicks$} />;
		assert.equal(component.outerHTML, '<p>Clicks times 2: 6</p>');
		clicks$(6);
		assert.equal(component.outerHTML, '<p>Clicks times 2: 12</p>');
	});

	it('should react to attached events', () => {
		let DumbComponent = ({clicks$}) => 
			<div>
				<button onclick={clicks$(clicks$() + 1)}>Click to emit event</button>
			</div>;
		let clicks$ = stream(0);
		// this component fires a action on the store when clicked
		let element = <DumbComponent clicks$={clicks$} />;
		// perform the actions on the element
		element.querySelector('button').click();

		assert.equal(clicks$(), 1);
	});
	
	it('should handle input changes', () => {
		let value$ = stream('');
		let update = function() {
			value$(this.value);
		};
		let input = <input oninput={update} />;
		input.value = 'Test';
		input.dispatchEvent(new Event('input'));

		assert.equal(value$(), 'Test');
	});

	it('should render a list of changes in an animationframe', (done) => {
		var arr = [];
		var length = 20;
		for (let i = 0; i < length; i++) {
			arr.push({ name: i });
		}
		let listElems = arr.map(x => <li>{x.name}</li>);
		let listElem = <ul>
			{ listElems }
		</ul>;
		// list items are not rendered yet as they are bundled into one animation frame
		assert.equal(listElem.querySelectorAll('li').length, 0);
		// we wait for the updates on the parent to have happened
		listElem.addEventListener(UPDATE_DONE, () => {
			assert.equal(listElem.querySelectorAll('li').length, length);
			done();
		});
	}); 
});