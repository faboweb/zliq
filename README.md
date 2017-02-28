# ZLIQ [BROKEN -> streams returning elem arrays not working]

ZLIQ is the intent to create an easy to understand, easy to use web framework. It is based on redux, reactive-streams and reactive-dom-rendering.

### Tech

ZLIQ only uses a only view dependencies:
 - [deep-equal](https://github.com/substack/node-deep-equal) to diff states

ZLIQ is written with:
 - [Webpack](https://github.com/webpack/webpack) for building
 - [Babel](https://github.com/babel/babel) for transpilation
 - [Mocha](https://github.com/mochajs/mocha) for testing
 - [JSX](https://facebook.github.io/jsx/) to make writing templates more comfortable

ZLIQ implementes itself in a slim way:
 - streams
 - redux
 - dom rendering and updates for streams

### How It Works

Every component is a function returning a stream of vdom-nodes!

```js
export const CleverComponent = ({sinks: {store}}) => {
	return store.$('clicks.clicks').map(clicks => {
		return <div>Clicks again {clicks}</div>;
	});
};
```

You can also just return a vdom-node. ZLIQ will wrap it in a stream for you.

```js
export const DumbComponent = ({sinks: {store}}) =>
	<button onclick={() => store.dispatch({type: SUBTRACKED})}>subtracked</button>;
```

Please check out 'src/demo_app.jsx' if you want to see, how an application is set up.

### Development

Open your favorite Terminal and run:

```sh
$ npm start
```

### Todos

 - Refactor to make easier to understand
 - Make NPM Module
 - Fix Testing

License
----

MIT
