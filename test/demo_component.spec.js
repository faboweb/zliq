import { h, stream, list, UPDATE_EVENT } from '../src';
import { CleverComponent, DumbComponent, SuperDumbComponent, ListComponent } from '../src/demo_component.jsx';
import assert from 'assert';
import { mockStore } from './helpers/mockStore';

// ATTENTION
// the rendering of children is sometimes deferred to an animationframe (if there are to many changes)
// in that case we have to wait till the children are rendered
// checkout the list example for this case

describe('Components', () => {
	it('SuperDumpComponent should show', () => {
		let element = <SuperDumbComponent />;
		// here they are not yet there
		assert.equal(element.outerHTML, '<p>HELLO WORLD</p>');
	});
	it('CleverComponent should perform inner operation and show result', () => {
		// to test components dependend on state we just manipulate the input streams
		// for the store we use a mocking object
		let store = mockStore({ clicks: { clicks: 3 }});
		// this component calculates the clicks * 2 inside and shows the result
		let component = <CleverComponent sinks={ {store} } />;
		assert.equal(component.outerHTML, '<div>Clicks times 2: 6</div>');
	});

	it('CleverComponent should update on store update', () => {
		// to test that components react to their inputs we just manipulate the input streams
		let store = mockStore({ clicks: { clicks: 3 }});
		let component = <CleverComponent sinks={ {store} } />;
		assert.equal(component.outerHTML, '<div>Clicks times 2: 6</div>');
		store.state$({ clicks: { clicks: 6 }});
		assert.equal(component.outerHTML, '<div>Clicks times 2: 12</div>');
	});

	it('should react to attached events', (done) => {
		let store = mockStore({});
		// this component fires a action on the store when clicked
		let element = <DumbComponent sinks= { { store }} />;
		// perform the actions on the element
		element.click();

		// we can listen on the action$ to test this happening
		store.action$.map(action => {
			if (action == null) return;
			assert.equal(action.type, 'SUBTRACKED');
			done();
		});
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
		// we wait for the updates on the parent to have happend
		listElem.addEventListener(UPDATE_EVENT.DONE, () => {
			assert.equal(listElem.querySelectorAll('li').length, length);
			done();
		});
	}); 
});