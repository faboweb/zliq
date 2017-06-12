import { h, stream, if$, merge$, initRouter, CHILDREN_CHANGED, ADDED, REMOVED, UPDATED } from '../src';
import assert from 'assert';

describe('Components', () => {
	it('should show a component', () => {
		let element = <p>HELLO WORLD</p>;
		assert.equal(element.outerHTML, '<p>HELLO WORLD</p>');
	});

	it('should work with React style hyperscript', () => {
		let element = h('p', null, 'this', ' and ', 'that');
		assert.equal(element.outerHTML, '<p>this and that</p>');
	});

	it('should work with Preact style hyperscript', () => {
		let element = h('p', null, ['this', ' and ', 'that']);
		assert.equal(element.outerHTML, '<p>this and that</p>');
	});

	let DoubleClicks = ({clicks$}) =>
		<p>Clicks times 2: {clicks$.map(clicks => 2*clicks)}</p>;
	it('should react to inputs', () => {
		let clicks$ = stream(3);
		let component = <DoubleClicks clicks$={clicks$} />;
		assert.equal(component.outerHTML, '<p>Clicks times 2: 6</p>');
	});

	it('CleverComponent should update on store update', () => {
		let clicks$ = stream(3);
		let component = <DoubleClicks clicks$={clicks$} />;
		assert.equal(component.outerHTML, '<p>Clicks times 2: 6</p>');
		clicks$(6);
		assert.equal(component.outerHTML, '<p>Clicks times 2: 12</p>');
	});

	it('should react to attached events', () => {
		// input streams are scoped to be able to remove the listener if the element gets removed
		// this means you can not manipulate the stream from the inside to the outside but need to use a callback function
		let DumbComponent = ({clicks$, onclick}) =>
			<div>
				<button onclick={onclick(clicks$() + 1)}>Click to emit event</button>
			</div>;
		let clicks$ = stream(0);
		// this component fires a action on the store when clicked
		let element = <DumbComponent clicks$={clicks$} onclick={x=>clicks$(x)} />;
		// perform the actions on the element
		element.querySelector('button').click();

		assert.equal(clicks$(), 1);
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
		listElem.addEventListener(CHILDREN_CHANGED, () => {
			assert.equal(listElem.querySelectorAll('li').length, length);
			done();
		});
	});

	it('should send added lifecycle events', (done)=> {
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

	it('should send removed lifecycle events', (done)=> {
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

	it('should update lists correctly', ()=> {
		var arr = [];
		var length = 3;
		for (let i = 0; i < length; i++) {
			arr.push({ name: i });
		}
		let list$ = stream(arr);
		let listElems$ = list$.map(arr => arr.map(x => <li>{x.name}</li>));
		let listElem = <ul>
			{ listElems$ }
		</ul>;

		assert.equal(listElem.querySelectorAll('li').length, 3);
		assert.equal(listElem.querySelectorAll('li')[2].innerHTML, '2');
		arr.pop();
		list$(arr);
		assert.equal(listElem.querySelectorAll('li').length, 2);
		assert.equal(listElem.querySelectorAll('li')[1].innerHTML, '1');
	});

	it('should remove attributes on null or undefined value', () => {
		let elem = <div disabled={stream(true)}></div>;
		assert(elem.getAttribute('disabled'), true);
		let elem2 = <div disabled={stream(null)}></div>;
		assert(elem.getAttribute('disabled'), false);
		let elem3 = <div disabled={stream()}></div>;
		assert(elem.getAttribute('disabled'), false);
	});

    it('should cleanup component stream subscriptions', (done) => {
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

	it('should evaluate streams on dom attachment', () => {
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