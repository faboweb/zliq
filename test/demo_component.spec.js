import { h, stream, list } from '../src';
import { CleverComponent, DumbComponent, SuperDumbComponent, ListComponent } from '../src/demo_component.jsx';
// import chai, { expect } from 'chai';
import assert from 'assert';
import { mockStore } from './helpers/mockStore';

describe('Components', () => {
	it('SuperDumpComponent should show', (done) => {
		let element = SuperDumbComponent();
		// for DOM outputs we just say how the result show look like
		setTimeout(() => {
			debugger;
			assert.equal(element.outerHTML, '<p>HELLO WORLD</p>');
			done();
		});
	});
	it('CleverComponent should calc and show clicks', (done) => {
		// to test components dependend on state we just manipulate the input streams
		let store = mockStore({ clicks: { clicks: 3 }});
		// clever components return a stream of streams
		let component = CleverComponent({ sinks: { store }});
		setTimeout(() => {
			assert.equal(component().outerHTML, '<div>Clicks time 2: 6</div>');

			// it should update if we change the store value
			store.state$({ clicks: { clicks: 6 }});
			setTimeout(() => {
				assert.equal(component().outerHTML, '<div>Clicks time 2: 12</div>');
				done();
			});
		});
	});

	it('should react to attached events', (done) => {
		let store = mockStore({});
		// clever components return a stream of streams
		let element = DumbComponent({ sinks: { store }});
		setTimeout(() => {
			element.click();

			store.action$.map(action => {
				if (action == null) return;
				assert.equal(action.type, 'SUBTRACKED');
				done();
			});
		});
	});

	it('should render a long array fast', (done) => {
		var arr = [];
		var length = 500;
		for (let i = 0; i < length; i++) {
			arr.push({ name: i });
		}
		let store = mockStore({ items: { items: arr, selected: arr[50] }});
		let listElem = ListComponent({sinks: { store }});
		// TODO: PART FAILS!
		// it should render iteratively for a better user expirience
		// setTimeout(() => {
		// 	var curLength = listElem.querySelectorAll('li').length;
		// 	assert.ok(curLength > 0 && curLength < length);
		// }, 200);
		setTimeout(() => {
			assert.equal(listElem.querySelectorAll('li').length, length);
			assert.equal(listElem.querySelectorAll('li')[50].outerHTML, '<li>50 X</li>');
			done();
		}, 700);
	}).timeout(1000);
});