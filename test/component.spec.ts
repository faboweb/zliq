import { create } from 'virtual-dom';
import { clicks } from './../src/reducers/clicks';
import { CleverComponent } from './../src/component';
import { expect } from 'chai';
import { mockStore } from './mockStore';

describe('CleverComponent', () => {
	it('should show clicks', () => {
		// to test components we just manipulate the input streams
		let store = mockStore({clicks: { clicks: 5 }});
		let component$ = CleverComponent({ sinks: { store }});
		// then we render the result of the hyperscript stream and check the dom result
		let elem = create(component$(), null);
		expect(elem.innerText).to.contain('5');
	});
});