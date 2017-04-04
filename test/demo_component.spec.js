import { h, stream, list, UPDATE_EVENT } from '../src';
import { CleverComponent, DumbComponent, SuperDumbComponent, ListComponent } from '../src/demo_component.jsx';
import assert from 'assert';
import { mockStore } from './helpers/mockStore';

describe('Components', () => {
	it('SuperDumpComponent should show', (done) => {
		let element = <SuperDumbComponent />;
		// the rendering of children is deferred, we have to wait till the children are rendered
		// here they are not yet there
		assert.equal(element.outerHTML, '<p></p>');
		// we can listen to zliq genereated update events to wait for an element to be rendered
		element.addEventListener(UPDATE_EVENT.DONE, () => {
			// for DOM outputs we just say how the result show look like
			assert.equal(element.outerHTML, '<p>HELLO WORLD</p>');
			done();
		});
	});
	it('CleverComponent should perform inner operation and show result', (done) => {
		// to test components dependend on state we just manipulate the input streams
		// for the store there we use a mokking obect
		let store = mockStore({ clicks: { clicks: 3 }});
		// this component calculates the clicks * 2 inside and shows the result
		let component = <CleverComponent sinks={ {store} } />;
		component.addEventListener(UPDATE_EVENT.DONE, () => {
			assert.equal(component.outerHTML, '<div>Clicks times 2: 6</div>');
			done();
		});
	});

	it('CleverComponent should update on store update', (done) => {
		// to test that components react to their inputs we just manipulate the input streams
		let store = mockStore({ clicks: { clicks: 3 }});
		let component = <CleverComponent sinks={ {store} } />;
		// we use a counter to check which update we are currently testing
		let update = 0;
		component.addEventListener(UPDATE_EVENT.DONE, () => {
			if (++update == 1) {
				assert.equal(component.outerHTML, '<div>Clicks times 2: 6</div>');
				// here we can activate consecutive updates
				store.state$({ clicks: { clicks: 6 }});
			} else {
				assert.equal(component.outerHTML, '<div>Clicks times 2: 12</div>');
				done();
			}
		});
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

	it('should render a long array faster', (done) => {
		var arr = [];
		var length = 500;
		for (let i = 0; i < length; i++) {
			arr.push({ name: i });
		}
		let store = mockStore({ items: { items: arr, selected: arr[50] }});
		// this component renders a list of items dependend on the store
		let listElem = <ListComponent sinks= { { store }} />;
		// it renders the array iteratively for a better user expirience
		// on those iterations it emits also an event
		listElem.addEventListener(UPDATE_EVENT.PARTIAL, () => {
			var curLength = listElem.querySelectorAll('li').length;
			assert.ok(curLength > 0 && curLength < length);
		});
		listElem.addEventListener(UPDATE_EVENT.DONE, () => {
			assert.equal(listElem.querySelectorAll('li').length, length);
			assert.equal(listElem.querySelectorAll('li')[50].outerHTML, '<li>50 X</li>');
			done();
		});
	}); 
});