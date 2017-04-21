<p align="center">
[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors)
<img src="https://github.com/faboweb/zliq/blob/master/icon.png"  height="150px"/>
</p>

# ZLIQ

ZLIQ is the intent to create an easy to understand, easy to use web framework. It is based on redux, reactive-streams and reactive-dom-rendering. ZLIQ has few lines of code (~690 April 2017).

### Live
[Test Online](https://faboweb.github.io/zliq/)

### Tech

ZLIQ only uses a view dependencies:
 - [deep-equal](https://github.com/substack/node-deep-equal) to diff objects
 
ZLIQ is written with:
 - [Webpack](https://github.com/webpack/webpack) for building
 - [Babel](https://github.com/babel/babel) for transpilation
 - [Karma](https://karma-runner.github.io) for testing
 - [JSX](https://facebook.github.io/jsx/) to make writing templates more comfortable

ZLIQ implementes itself in a slim way:
 - streams
 - redux
 - change based rendering
 - basic routing

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

Please check out 'src/demo_app.jsx' if you want to see how an application is set up.

### Development

Open your favorite Terminal and run:

```sh
$ npm start
```

### Todos

 - Make a lazy loaded list work -> better rendering for many elements 
 - Need Reviewers
 - Add Code Playground to Page
 
License
----

MIT

Logo based on: http://www.iconsfind.com/2015/11/25/candy-dessert-food-sweet-baby-icon/

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section --><!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!