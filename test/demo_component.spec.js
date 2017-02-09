import { create } from 'virtual-dom';
import { clicks } from '../src/reducers/clicks';
import { CleverComponent, SuperDumbComponent } from '../src/demo_component.jsx';
import { expect } from 'chai';
import { mockStore } from './mockStore';

describe('Components', () => {
	it('SuperDumpComponent should show', () => {
		let component$ = SuperDumbComponent();
		// then we render the result of the hyperscript stream and check the dom result
		let elem = create(component$());
		console.log(elem);
		expect(elem.innerHtml).to.contain(5);
	});
	// it('CleverComponent should show clicks', () => {
	// 	// to test components we just manipulate the input streams
	// 	let store = mockStore({clicks: { clicks: 5 }});
	// 	let component$ = CleverComponent({ sinks: { store }});
	// 	// then we render the result of the hyperscript stream and check the dom result
	// 	let elem = create(component$());
	// 	expect(elem.innerText).to.contain(5);
	// });
});