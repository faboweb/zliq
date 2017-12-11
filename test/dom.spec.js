import { render, h, stream, if$, merge$, initRouter, CHILDREN_CHANGED, ADDED, REMOVED, UPDATED, isStream } from '../src';
import { testRender, test$ } from './helpers/test-component';
import assert from 'assert';

describe('Components', () => {
	it('should show a component', done => {
		testRender(<p>HELLO WORLD</p>, [
			'<p>HELLO WORLD</p>'
		], done);
	});

	it('should work with React style hyperscript', done => {
		testRender(h('p', null, 'this', ' and ', 'that'), [
			'<p>this and that</p>'
		], done);
	});

	it('should work with Preact style hyperscript', done => {
		testRender(h('p', null, ['this', ' and ', 'that']), [
			'<p>this and that</p>'
		], done);
	});
	
	it('should return a constructor function', () => {
		let constructor = <p>HELLO WORLD</p>;
		expect(typeof constructor).toBe('function')
	});
	
	it('should return a virtualdom stream when constructed', () => {
		let constructor = <p>HELLO WORLD</p>;
		let vdom$ = constructor({});
		expect(isStream(vdom$)).toBe(true)
		expect(vdom$.value.tag).toBe('p')
		expect(vdom$.value.props).toEqual({})
		expect(vdom$.value.children).toEqual(['HELLO WORLD'])
	});

	it('should render into a parentElement provided', done => {
		let container = document.createElement('div')
		test$(render(<p>HELLO WORLD</p>, container), [
			({element}) => expect(container.innerHTML).toEqual('<p>HELLO WORLD</p>')
		], done);
	});

	it('should render without a parentElement provided', done => {
		test$(render(<p>HELLO WORLD</p>, null), [
			({element}) => assert.equal(element.outerHTML, '<p>HELLO WORLD</p>')
		], done);
	});

	let DoubleClicks = ({clicks$}) =>
		<p>Clicks times 2: {clicks$.map(clicks => 2*clicks)}</p>;
	it('should react to inputs', done => {
		let clicks$ = stream(3);
		let component = <DoubleClicks clicks$={clicks$} />;
		testRender(component, [
			({element}) => assert.equal(element.outerHTML, '<p>Clicks times 2: 6</p>')
		], done);
	});

	it('CleverComponent should update on input stream update', done => {
		let clicks$ = stream(3);
		let component = <DoubleClicks clicks$={clicks$} />;
		testRender(component, [
			({element}) => {
				assert.equal(element.outerHTML, '<p>Clicks times 2: 6</p>');
				clicks$(6);
			},
			({element}) => assert.equal(element.outerHTML, '<p>Clicks times 2: 12</p>')
		], done);
	});

	it('Components should have access to the provided globals', done => {
		const ShowGlobals = (props, children, globals) => {
			return <p>{globals.value}</p>
		}
		let clicks$ = stream(3);
		let component = <div><ShowGlobals /></div>;
		testRender(component, [
			'<div><p>GLOBAL TEXT</p></div>'
		], done, {
			globals: {
				value: 'GLOBAL TEXT'
			}
		});
	});

	it('should update elements with textnodes', done => {
		let trigger$ = stream()
		testRender(<p>{if$(trigger$, <div></div>, 'HELLO WORLD')}</p>, [
			'<p><div></div></p>',
			'<p>HELLO WORLD</p>'
		], done);
		trigger$(true)
		setTimeout(() => {
			trigger$(false)
		}, 10)
	});

	it('should set the class', done => {
		let class$ = stream('x')
		let app = <div class={class$} />
		testRender(app, [
			({element}) => {
				expect(element.classList).toContain('x');
				class$(null)
			},
			({element}) => {
				expect(element.classList).not.toContain('x');
			}
		], done)
	})

	it('should resolve nested streams in props', done => {
		let trigger$ = stream(false)
		let style = {
			display: if$(trigger$, 'block', 'none')
		}
		let app = <div>
			<div style={style} />
		</div>
		testRender(app, [
			'<div><div style="display: none;"></div></div>',
			'<div><div style="display: block;"></div></div>'
		], done)
		setTimeout(() => {
			trigger$(true)
		}, 10)
	})

	it('should set style in different ways', done => {
		let style$ = stream('width: 100px;')
		let app = <div style={style$} />
		testRender(app, [
			({element}) => {
				expect(element.style.width).toBe('100px');
				style$({height: '200px'})
			},
			({element}) => {
				expect(element.style.width).toBe('');
				expect(element.style.height).toBe('200px');
				style$(null)
			},
			({element}) => {
				expect(element.style.width).toBe('');
				expect(element.style.height).toBe('');
			}
		], done)
	})

	it('should react to attached events', done => {
		// input streams are scoped to be able to remove the listener if the element gets removed
		// this means you can not manipulate the stream from the inside to the outside but need to use a callback function
		let DumbComponent = ({clicks$, onclick}) =>
			<div>
				<button onclick={() => onclick(clicks$() + 1)}>Click to emit event</button>
			</div>;
		let clicks$ = stream(0);
		// this component fires a action on the store when clicked
		let component = <DumbComponent clicks$={clicks$} onclick={x => clicks$(x)} />;
		testRender(component, [
			// perform the actions on the element
			({element}) => {
				element.querySelector('button').click();
				assert.equal(clicks$(), 1);
			}
		], done);
	});

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

		testRender(component, [
			({element}) => {
				assert.equal(element.querySelectorAll('li').length, 3);
				assert.equal(element.querySelectorAll('li')[2].innerHTML, '2');
				let newArr = arr.slice(1);
				list$(newArr);
			},
			({element}) => {
				assert.equal(element.querySelectorAll('li').length, 2);
				assert.equal(element.querySelectorAll('li')[1].innerHTML, '2');
			}
		], done);

	});

	it('should remove attributes on null value', done => {
		let value$ = stream(true);
		let component = <div disabled={value$}></div>;
		testRender(component, [
			({element}) => {
				expect(element.disabled).toBe(true);
				value$(null);
			},
			({element}) => {
				expect(element.disabled).toBe(undefined);
			}
		], done);
	});

	it('should remove attributes on updates if not available anymore', done => {
		let trigger$ = stream(true);
		let app = <div>
			{
				if$(trigger$,
					<img src="img_girl.jpg" width="500" height="600" />,
					<img src="img_girl.jpg" height="600" />)
			}
		</div>;
		testRender(app, [
			({element}) => {
				expect(element.querySelector('img').getAttribute('width')).toBe("500");
				trigger$(false);
			},
			({element}) => {
				expect(element.querySelector('img').getAttribute('width')).toBe(null);
			}
		], done);
	});

	// TODO
	xit('should trigger lifecycle events on nested components', done => {
		const mountedMock = jest.fn();
		const createdMock = jest.fn();
		const removedMock = jest.fn();
		let trigger$ = stream(true);
		let cycle = {
			mounted: mountedMock,
			created: createdMock,
			removed: removedMock
		}
		const component = <div cycle={cycle} />;

		let app = <div>
			{
				if$(trigger$, component)
			}
		</div>;

		testRender(app, [
			() => trigger$(false),
			() => trigger$(true),
			() => {
				expect(mountedMock.mock.calls.length).toBe(2);
				expect(createdMock.mock.calls.length).toBe(2);
				expect(removedMock.mock.calls.length).toBe(1);
			}
		], done);
	})

	it('should increment versions up to the root', done => {
		let content$ = stream('');
		let app = <div>
			<div>{content$}</div>
		</div>;
		testRender(app, [
			({element, version}) => {
				expect(version).toBe(0);
				content$('text');
			},
			({element, version}) => {
				expect(version).toBe(1);
			}
		], done);
	});

	it('should save id elements to reuse them', done => {
		let content$ = stream('');
		let app = <div>
			<div id="test">{content$}</div>
		</div>;
		let i;
		testRender(app, [
			({keyContainer}) => {
				expect(keyContainer['test'].element.outerHTML).toMatchSnapshot();
				expect(keyContainer['test'].version).toBe(0);
				content$('text');
			},
			({keyContainer}) => {
				expect(keyContainer['test'].element.outerHTML).toMatchSnapshot();
				expect(keyContainer['test'].version).toBe(1);
			}
		], done)
	});
	
	it('should reuse id elements on rerenderings', done => {
		let content$ = stream('');
		let app = <div>
			{content$}
			<div id="test"></div>
		</div>;
		testRender(app, [
			({element, keyContainer}) => {
				// manipulating the dom to prove update
				element.replaceChild(document.createElement('div'), keyContainer['test'].element);
				// manipulating the stored element
				keyContainer['test'].element.setAttribute('id', 'updated');
				content$('text');
			},
			({element, keyContainer}) => {
				expect(element.querySelector('#updated')).not.toBe(null);
			}
		], done)
	});

	it('should debounce renderings', done => {
		let content$ = stream('');
		let app = <div>
			{content$}
		</div>;
		const myMock = jest.fn();
		render(app, document.createElement('div'), {}, 50)
		.map(myMock);
		setTimeout(() => {
			expect(myMock.mock.calls.length).toBe(2);
			// two updates signaled in between
			expect(myMock.mock.calls[1][0].version).toBe(2);
			done();
		}, 150);
		setTimeout(() => {
			content$('text');
			setTimeout(() => {
				content$('text2');
			}, 30);
		}, 60);
	});
	
	it('should replace idd elements again', done => {
		let trigger$ = stream(false);
		let app = <div>
			<img />
			{
				if$(trigger$,
					<i id="x"></i>,
					<div>
						<div></div>
					</div>
				)
			}
		</div>;

		testRender(app, [
			({element}) => {
				expect(element.querySelector('#x')).toBeNull()
				trigger$(true)
			},
			({element}) => {
				expect(element.querySelector('#x')).not.toBeNull()
				trigger$(false)
			},
			({element}) => {
				expect(element.querySelector('#x')).toBeNull()
			}
		], done)
	})

	it('should print a warning if the child nodes have been removed/added outside of zliq', done => {
		let trigger$ = stream(false)
		let app = <div>
			<div id="remove" />
			<div id="stays" />
			{
				if$(trigger$,
					<div id="added" />)
			}
		</div>
		global.console = {warn: jest.fn()}

		testRender(app, [
			({element}) => {
				element.querySelector('#remove').remove()
				trigger$(true)
			},
			({element}) => {
				expect(global.console.warn).toHaveBeenCalled()
				element.appendChild(document.createElement('div'))
				trigger$(false)
			},
			() => {}
		], done)
	})
});