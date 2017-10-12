import { initRouter, h } from '../src';
import { testRender, test$ } from './helpers/test-component';

let location = {pathname: '/route', search: '?param=value', hash: ''};

describe('Router', ()=> {
	it('should react to initial routing', (done) => {
		let router$ = initRouter(location);
		
		test$(router$, [
			() => {}, // TODO should not be
			({route, params}) => {
				expect(route).toBe('/route');
			}
		], done)
	});

	it('should react to initial query parameters', (done) => {
		let router$ = initRouter(location);

		test$(router$, [
			() => {},
			({route, params}) => {
				expect(params.param).toBe('value');
			}
		], done);
	});

	it('should react to clicks on internal links', (done) => {
		let link = <a href="/route?param=value" />

		let router$ = initRouter();

		testRender(link, [
			({element}) => element.click()
		]);

		test$(router$, [
			({route, params}) => {
				expect(route).toBe('/route');
				expect(params.param).toBe('value');
			}
		], done);
	});

	// jsdom fails here
	xit('should react to browser go back events', (done)=> {
		let router$ = initRouter();

		history.pushState({}, "", "/route?param=value");
		history.back();

		router$.map(({route, params}) => {
			expect(route).toBe('/route');
			expect(params.param).toBe('value');
			done();
		});
	})
})