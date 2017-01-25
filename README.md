# ZLIQ

ZLIQ is the intent to create an easy to understand, easy to use web framework. It is based on virtual-dom, redux, reactive-streams.

### Tech

ZLIQ only uses a only view dependencies:
 - [virtual-dom](https://github.com/Matt-Esch/virtual-dom)
 - [deep-equal](https://github.com/substack/node-deep-equal) to diff states
 
ZLIQ is written with:
 - [Typescript](https://github.com/Microsoft/TypeScript) to make transpilation easy
 - [Rollup](https://github.com/rollup/rollup) for build
 - [JSX](https://facebook.github.io/jsx/) to make writing templates more comfortable

ZLIQ implementes itself in a slim way:
 - streams
 - redux
 - virtual-dom rendering for streams

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

### Development

Want to contribute? Great!

Dillinger uses Rollup for fast developing.
Make a change in your file and instantanously see your updates!

Open your favorite Terminal and run these commands.

First Tab:
```sh
$ npm run build
```

Second Tab:
```sh
$ npm run serve
```


### Todos

 - Add Code Comments
 - Add Documentation
 - Add Tests
 - Make NPM Module

License
----

MIT
