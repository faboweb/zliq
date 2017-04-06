# ZLIQ

ZLIQ is the intent to create an easy to understand, easy to use web framework. It is based on redux, reactive-streams and reactive-dom-rendering. ZLIQ has few lines of code (~650 March 2017).

### Live
[Test Online](https://cleaner-tortoise-23337.netlify.com/)

### Tech

ZLIQ only uses a view dependencies:
 - [odiff](https://github.com/Tixit/odiff) to diff arrays
 
ZLIQ is written with:
 - [Webpack](https://github.com/webpack/webpack) for building
 - [Babel](https://github.com/babel/babel) for transpilation
 - [Mocha](https://github.com/mochajs/mocha) for testing
 - [JSX](https://facebook.github.io/jsx/) to make writing templates more comfortable

ZLIQ implementes itself in a slim way:
 - streams
 - redux
 - change based rendering

### How It Works

Every component is a function returning a dom element (written in jsx)! Changes will trigger a rerender of that element. 

```js
export const DumbComponent = ({sinks: {store}}) =>
	<button onclick={() => store.dispatch({type: SUBTRACKED})}>subtracked</button>;
```

You can also return a stream of dom elements. ZLIQ will wrap children anyway in streams.

```js
export const CleverComponent = ({sinks: {store}}) => {
	return store.$('clicks.clicks').map(clicks => {
		return <div>Clicks again {clicks}</div>;
	});
};
```

For long lists there is a helper, that will rerender only changes in an array.

```js
export const ListComponent = ({sinks: {store}}) =>
	<ul> 
		{
			list(store.$('items'), 'items', (item, {selected}) =>
				<li>{item.name} {selected ? '<--' : ''}</li>
			)
		}
	</ul>;
```

Please check out 'src/demo_app.jsx' if you want to see how an application is set up.

### Development

Open your favorite Terminal and run:

```sh
$ npm start
```

### Todos

 - Refactor to make easier to understand (need reviewers)
 - Test NPM Module in the wild
 - Make rendering of long lists faster

License
----

MIT
