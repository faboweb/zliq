
<img src="icon.png" alt="zliq logo" title="zliq" align="center" width="150" height="150" height="150px"/>

# ZLIQ

[![Dependencies][dependencyci-badge]][dependencyci]
[![version][version-badge]][package]
[![downloads][downloads-badge]][npm-stat]
[![MIT License][license-badge]][LICENSE]
<!--[![Examples][examples-badge]][examples]-->

[![gzip size][tiny-gzip-badge]][unpkg-dist]
[![size][tiny-size-badge]][unpkg-dist]
[![module formats: es][module-formats-badge]][unpkg-dist]

[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)
[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]

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

Thanks goes to these wonderful people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars2.githubusercontent.com/u/5869273?v=3" width="100px;"/><br /><sub>Fabian</sub>](https://github.com/faboweb)<br />[💻](https://github.com/Fabian Weber/zliq/commits?author=faboweb "Code") [🎨](#design-faboweb "Design") [📖](https://github.com/Fabian Weber/zliq/commits?author=faboweb "Documentation") [⚠️](https://github.com/Fabian Weber/zliq/commits?author=faboweb "Tests") | [<img src="https://avatars0.githubusercontent.com/u/1215719?v=3" width="100px;"/><br /><sub>Ferit Topcu</sub>](http://www.ftopcu.de)<br />[📖](https://github.com/Fabian Weber/zliq/commits?author=fokusferit "Documentation") |
| :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification. Contributions of any kind welcome!

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[dependencyci-badge]: https://dependencyci.com/github/faboweb/zliq/badge?style=flat-square
[dependencyci]: https://dependencyci.com/github/faboweb/zliq
[version-badge]: https://img.shields.io/npm/v/zliq.svg?style=flat-square
[package]: https://www.npmjs.com/package/zliq
[downloads-badge]: https://img.shields.io/npm/dm/zliq.svg?style=flat-square
[npm-stat]: http://npm-stat.com/charts.html?package=zliq
[license-badge]: https://img.shields.io/npm/l/zliq.svg?style=flat-square
[license]: https://github.com/faboweb/zliq/blob/master/LICENSE
[github-watch-badge]: https://img.shields.io/github/watchers/faboweb/zliq.svg?style=social
[github-watch]: https://github.com/faboweb/zliq/watchers
[github-star-badge]: https://img.shields.io/github/stars/faboweb/zliq.svg?style=social
[github-star]: https://github.com/faboweb/zliq/stargazers
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
[gzip-badge]: http://img.badgesize.io/https://unpkg.com/zliq/lib/zliq.js?compression=gzip&label=gzip%20size&style=flat-square
[size-badge]: http://img.badgesize.io/https://unpkg.com/zliq/lib/zliq.js?label=size&style=flat-square
[tiny-gzip-badge]: http://img.badgesize.io/https://unpkg.com/zliq/lib/zliq.min.js?compression=gzip&label=gzip%20size&style=flat-square
[tiny-size-badge]: http://img.badgesize.io/https://unpkg.com/zliq/lib/zliq.min.js?label=size&style=flat-square
[unpkg-dist]: https://unpkg.com/zliq/
[module-formats-badge]: https://img.shields.io/badge/module%20formats-es-green.svg?style=flat-square