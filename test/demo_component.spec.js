import h from 'virtual-dom/h';
import { CleverComponent, SuperDumbComponent } from '../src/demo_component.jsx';
import chai, { expect } from 'chai';
import chaiVirtualDom from 'chai-virtual-dom';
chai.use(chaiVirtualDom);
import { mockStore } from './mockStore';
 
describe('Components', () => {
	it('SuperDumpComponent should show', () => {
		let component$ = SuperDumbComponent();
		// for DOM outputs we just say how the result show look like
		let expected = h('p', [
			'HELLO WORLD'
		])
		expect(component$()).to.look.like(expected);
	});
	it('CleverComponent should show clicks', () => {
		// to test components dependend on state we just manipulate the input streams
		let store = mockStore({ clicks: { clicks: 5 }});
		// clever components return a stream of streams
		let component$ = CleverComponent({ sinks: { store }})();
		let expected = h('div', [
			'Clicks again ', '5'
		]);
		expect(component$()).to.look.like(expected);
	});
});