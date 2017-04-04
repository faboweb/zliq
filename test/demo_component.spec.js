import { h, stream, list, UPDATE_EVENT } from '../src';
import { CleverComponent, DumbComponent, SuperDumbComponent, ListComponent } from '../src/demo_component.jsx';
// import chai, { expect } from 'chai';
import assert from 'assert';
import { mockStore } from './helpers/mockStore';

describe('Components', () => {
	it('SuperDumpComponent should show', (done) => {
		let element = <SuperDumbComponent />;
		// for DOM outputs we just say how the result show look like
		element.addEventListener(UPDATE_EVENT.DONE, () => {
			assert.equal(element.outerHTML, '<p>HELLO WORLD</p>');
			done();
		});
	});
	it('CleverComponent should perform inner operation and show result', (done) => {
		// to test components dependend on state we just manipulate the input streams
		let store = mockStore({ clicks: { clicks: 3 }});
		// clever components return a stream of streams
		let component = <CleverComponent sinks={ {store} } />;
		component.addEventListener(UPDATE_EVENT.DONE, () => {
			assert.equal(component.outerHTML, '<div>Clicks times 2: 6</div>');
			done();
		});
	});

	it('CleverComponent should update on store update', (done) => {
		// to test components dependend on state we just manipulate the input streams
		let store = mockStore({ clicks: { clicks: 3 }});
		let component = <CleverComponent sinks={ {store} } />;
		let run = 0;
		component.addEventListener(UPDATE_EVENT.DONE, () => {
			if (++run == 1) {
				assert.equal(component.outerHTML, '<div>Clicks times 2: 6</div>');
				store.state$({ clicks: { clicks: 6 }});
			} else {
				assert.equal(component.outerHTML, '<div>Clicks times 2: 12</div>');
				done();
			}
		});
	});

	it('should react to attached events', (done) => {
		let store = mockStore({});
		// clever components return a stream of streams
		let element = <DumbComponent sinks= { { store }} />;
		element.click();

		store.action$.map(action => {
			if (action == null) return;
			assert.equal(action.type, 'SUBTRACKED');
			done();
		});
	});

	it('should render a long array fast', (done) => {
		var arr = [];
		var length = 500;
		for (let i = 0; i < length; i++) {
			arr.push({ name: i });
		}
		let store = mockStore({ items: { items: arr, selected: arr[50] }});
		let listElem = <ListComponent sinks= { { store }} />;
		// it should render iteratively for a better user expirience
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