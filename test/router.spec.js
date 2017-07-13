import { initRouter, h } from '../src';
import { test } from './helpers/test-component';

describe('Router', ()=> {
	it('should react to initial routing', (done) => {
		Object.defineProperty(location, 'pathname', {
			value: '/route',
			configurable: true
		});

		let router$ = initRouter();
		router$.map(({route, params}) => {
			expect(route).toBe('/route');
			done();
		})
	});

	it('should react to initial query parameters', (done) => {
		Object.defineProperty(location, 'search', {
			value: '?param=value',
			configurable: true
		});

		let router$ = initRouter();
		router$.map(({route, params}) => {
			expect(params.param).toBe('value');
			done();
		})
	});

	it('should react to clicks on internal links', (done) => {
		let link = <a href="/route?param=value" />

		let router$ = initRouter();

		test(link, [
			element => element.click()
		], ()=>{});

		router$.map(({route, params}) => {
			expect(route).toBe('/route');
			expect(params.param).toBe('value');
			done();
		});
	});

    it('should react to browser go back events', (done)=> {
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