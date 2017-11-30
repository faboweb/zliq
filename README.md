
<p align="center">
    <img src="icon.png" alt="zliq logo" title="zliq" width="150" />
</p>

# ZLIQ

[![Dependencies][dependencyci-badge]][dependencyci]
[![CircleCI](https://circleci.com/gh/faboweb/zliq.svg?style=shield)](https://circleci.com/gh/faboweb/zliq)
[![version][version-badge]][package]
[![downloads][downloads-badge]][npm-stat]
[![MIT License][license-badge]][LICENSE]
<!--[![Examples][examples-badge]][examples]--> 

[![Code Climate](https://codeclimate.com/github/faboweb/zliq.png)](https://codeclimate.com/github/faboweb/zliq)
[![Test Coverage](https://codeclimate.com/github/faboweb/zliq/badges/coverage.svg)](https://codeclimate.com/github/faboweb/zliq/coverage)
[![gzip size][tiny-gzip-badge]][unpkg-dist]
[![size][tiny-size-badge]][unpkg-dist]
[![module formats: es, umd][module-formats-badge]][unpkg-dist]

[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)
[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]

ZLIQ is the intent to create an easy to understand, easy to use web framework. It is based on reactive-streams and reactive-dom-rendering. ZLIQ has few lines of code (~580 November 2017).

## [Website](https://faboweb.github.io/zliq/)

## Why yet another web framework?
Modern web frameworks got really big (React + Redux 139Kb and Angular 2 + Rx 766Kb, [[src]](https://gist.github.com/Restuta/cda69e50a853aa64912d)). As a developer I came into the (un)pleasent situation to teach people how these work. But I couldn't really say, as I haven't actually understood each line of code in these beasts. But not only that, they also have a lot of structures I as a developer have to learn to get where I want to go. It feels like learning programming again just to be able to render some data.

ZLIQ tries to be sth simple. Sth that reads in an evening. But that is still so powerful you can just go and display complex UIs with it. Sth that feels more JS less Java.

Still ZLIQ doesn't try to be the next React or Angular! ZLIQ has a decent render speed even up to several hundred simultaneous updates but it's not as fast as [Preact](https://preactjs.com/). And it on purpose does not solve every problem you will ever have. ZLIQ is a tool to help you create the solution that fits your need.

## Quickstart
To play around with ZLIQ fork this repo and start the demo page at `localhost:8080`:
```bash
$ npm start
```

To use ZLIQ in your project, first install it as an dependency:
```bash
$ npm install --save zliq
```

Then create your app component and add it to the DOM:
```js
import {h, render} from 'zliq';

let app = <div>
        <span>Hello World</span>
    </div>;
render(app, document.querySelector('#app');
```

ZLIQ includes streams similar to [flyd](https://github.com/paldepind/flyd) to make state easy to handle:
```js
import {h, render} from 'zliq';

// define a stream of state
let state$ = stream({ clicks: 0 });

// Redux like action
let increment = (state$) => () => {
    state$.patch({ clicks: state$.$('clicks')() + 1 })
};
            
let app = <div>
    // display from state
    <p>Clicks: {state$.$('clicks')}</p>
    // interact with state
    <button onclick={increment(state$)}>Click + 1</button>
</div>;
render(app, document.querySelector('#app');
```

Make sure your stack converts [JSX](https://facebook.github.io/jsx/) to [Hyperscript](https://github.com/hyperhype/hyperscript) syntax. In the ZLIQ project this is achieved with [Babel](https://babeljs.io) and the [transform-h-jsx](https://github.com/jchook/babel-plugin-transform-h-jsx) plugin used in [webpack](https://webpack.js.org/). Alternative you can use [Babel in the browser](https://babeljs.io/docs/setup/#installation), like I did in the [ZLIQ playground](http://jsfiddle.net/faboweb/hvbee8m9).

If you don't want to use JSX you can still write plain Hyperscript:
```js
let app = h('div', null, [
    h('span', null, ["Hello World"])
]);
```

## Dive in
Checkout the [Git Page](https://faboweb.github.io/zliq/) as a live example of a ZLIQ app (the code lives under `./demo`). There you will also find a tutorial and more detailed descriptions on ZLIQs parts.

## Plugins
There are some plugins available to enhance the zliq experience:
- [ZLIQ-Router](https://github.com/fabweb/zliq-router): A simple stream based router
- [ZLIQ-Stacktrace](https://github.com/fabweb/zliq-stacktrace): A wrapper around [Sourcemapped-Stacktrace](https://github.com/novocaine/sourcemapped-stacktrace) to prune the stacktrace to only the necessary

## Contributors

Thanks goes to these wonderful people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars2.githubusercontent.com/u/5869273?v=3" width="100px;"/><br /><sub>Fabian</sub>](https://github.com/faboweb)<br />[💻](https://github.com/faboweb/zliq/commits?author=faboweb "Code") [🎨](#design-faboweb "Design") [📖](https://github.com/faboweb/zliq/commits?author=faboweb "Documentation") [⚠️](https://github.com/faboweb/zliq/commits?author=faboweb "Tests") | [<img src="https://avatars0.githubusercontent.com/u/1215719?v=3" width="100px;"/><br /><sub>Ferit Topcu</sub>](http://www.ftopcu.de)<br />[📖](https://github.com/faboweb/zliq/commits?author=fokusferit "Documentation") |
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
[module-formats-badge]: https://img.shields.io/badge/module%20formats-es%20umd-green.svg?style=flat-square

Logo based on: http://www.iconsfind.com/2015/11/25/candy-dessert-food-sweet-baby-icon/
