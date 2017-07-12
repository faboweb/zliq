import { h, stream, if$, merge$, initRouter, CHILDREN_CHANGED, ADDED, REMOVED, UPDATED } from '../src';
import { test } from './helpers/test-component';
import assert from 'assert';

describe('Components', () => {
	it('should show a component', done => {
		test(<p>HELLO WORLD</p>, [
			element => assert.equal(element.outerHTML, '<p>HELLO WORLD</p>')
		], done);
	});

	it('should work with React style hyperscript', done => {
		test(h('p', null, 'this', ' and ', 'that'), [
			element => assert.equal(element.outerHTML, '<p>this and that</p>')
		], done);
	});

	it('should work with Preact style hyperscript', done => {
		test(h('p', null, ['this', ' and ', 'that']), [
			element => assert.equal(element.outerHTML, '<p>this and that</p>')
		], done);
	});

	let DoubleClicks = ({clicks$}) =>
		<p>Clicks times 2: {clicks$.map(clicks => 2*clicks)}</p>;
	it('should react to inputs', done => {
		let clicks$ = stream(3);
		let component = <DoubleClicks clicks$={clicks$} />;
		test(component, [
			element => assert.equal(element.outerHTML, '<p>Clicks times 2: 6</p>')
		], done);
	});

	it('CleverComponent should update on input stream update', done => {
		let clicks$ = stream(3);
		let component = <DoubleClicks clicks$={clicks$} />;
		test(component, [
			element => assert.equal(element.outerHTML, '<p>Clicks times 2: 6</p>'),
			element => assert.equal(element.outerHTML, '<p>Clicks times 2: 12</p>'),
		], done);
		clicks$(6);
	});

	it('should react to attached events', done => {
		// input streams are scoped to be able to remove the listener if the element gets removed
		// this means you can not manipulate the stream from the inside to the outside but need to use a callback function
		let DumbComponent = ({clicks$, onclick}) =>
			<div>
				<button onclick={onclick(clicks$() + 1)}>Click to emit event</button>
			</div>;
		let clicks$ = stream(0);
		// this component fires a action on the store when clicked
		let component = <DumbComponent clicks$={clicks$} onclick={x=>clicks$(x)} />;
		test(component, [
			// perform the actions on the element
			element => {
				element.querySelector('button').click();
				assert.equal(clicks$(), 1);
			},
		], done);
	});

	xit('should render a list of changes in an animationframe', done => {
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
		listElem.addEventListener(CHILDREN_CHANGED, () => {
			assert.equal(listElem.querySelectorAll('li').length, length);
			done();
		});
	});

	xit('should send added lifecycle events', (done)=> {
		var container;
		let switch$ = stream(false);
		let Child = ()=>{
			let elem = <div class="child"></div>;
			elem.addEventListener(ADDED, ()=>{
				assert(container.querySelectorAll('.child').length, 1);
				done();
			});
			return elem;
		};
		container = <div class="parent">
			{switch$.map(x=>x?<Child />:null)}
		</div>;
		setTimeout(()=>switch$(true),1);
	})

	xit('should send removed lifecycle events', (done)=> {
		var container;
		let switch$ = stream(true);
		let Child = ()=>{
			let elem = <div class="child"></div>;
			elem.addEventListener(REMOVED, ()=>{
				assert(container.querySelectorAll('.child').length === 0, true);
				done();
			});
			return elem;
		};
		container = <div class="parent">
			{switch$.map(x=>x?<Child />:null)}
		</div>;
		setTimeout(()=>switch$(false),10);
	})

	it('should update lists correctly', done => {
		var arr = [];
		var length = 3;
		for (let i = 0; i < length; i++) {
			arr.push({ name: i });
		}
		let list$ = stream(arr);
		let listElems$ = list$.map(arr => arr.map(x => <li>{x.name}</li>));
		let component = <ul>
			{ listElems$ }
		</ul>;

		test(component, [
			element => {
				assert.equal(element.querySelectorAll('li').length, 3);
				assert.equal(element.querySelectorAll('li')[2].innerHTML, '2');
				arr.pop();
				list$(arr);
			},
			element => {
				assert.equal(element.querySelectorAll('li').length, 2);
				assert.equal(element.querySelectorAll('li')[1].innerHTML, '1');
			},
		], done);
	});

	it('should remove attributes on null or undefined value', done => {
		let value$ = stream();
		let component = <div disabled={value$}></div>;
		test(component, [
			element => {
				assert(element.getAttribute('disabled'), false);
				value$(true)
			},
			element => {
				assert(element.getAttribute('disabled'), true);
				value$(null)
			},
			element => {
				assert(element.getAttribute('disabled'), false);
			},
		], done);
	});

    xit('should cleanup component stream subscriptions', (done) => {
        const myMock = jest.fn();
        let my$ = stream('HALLO');
        let trigger$ = stream(true);
        let Elem = ({some$}, children, deleted$) => {
            let another$ = some$.map(myMock);
			deleted$.map((deleted) => {
				if (deleted) {
					expect(my$.listeners.length).toBe(0);
					done();
				}
			})
            return <div />
        }
        let elem = <Elem some$={my$} />;
        let app = <div>
            {if$(trigger$, elem)}
        </div>;
        expect(my$.listeners.length).toBe(1);
        trigger$(false);
    })

	xit('should evaluate streams on dom attachment', () => {
        const myMock = jest.fn();
		let control$ = stream(false);
        let trigger$ = stream(true);
        let my$ = stream('HALLO').until(trigger$);
        let app = <div>
            {if$(control$, my$)}
        </div>;
        expect(app.outerHTML).toBe('<div></div>');
        control$(true);
        expect(app.outerHTML).toBe('<div></div>');
        trigger$(false);
        expect(app.outerHTML).toBe('<div>HALLO</div>');
    })
});