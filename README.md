
<p align="center">
    <img src="icon.png" alt="zliq logo" title="zliq" width="150" height="150" height="150px"/>
</p>

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

## Test Live
[Git Page](https://faboweb.github.io/zliq/)

## Why yet another web framework?
Modern web frameworks got really big (React + Redux 139Kb and Angular 2 + Rx 766Kb, [[src]](https://gist.github.com/Restuta/cda69e50a853aa64912d)). As a developer I came into the (un)pleasent situation to teach people how these work. But I couldn't really say, as I haven't actually understood each line of code in these beasts. But not only that, they also have a lot of structures I as a developer have to learn to get where I want to go. It feels like learning programming again just to be able to render some data.

ZLIQ tries to be sth simple. Sth that reads in an evening. But that is still so powerfull you can just go and display complex UIs with it. Sth that feels more JS less Java.

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
import {h} from 'zliq';

let app = <div>
        <span>Hello World</span>
    </div>;
document.querySelector('#app').appendChild(app);
```

Make sure your stack converts [JSX](https://facebook.github.io/jsx/) to [Hyperscript](https://github.com/hyperhype/hyperscript). In the ZLIQ project this is archieved with [Babel](https://github.com/babel/babel) and the [transform-h-jsx](https://github.com/jchook/babel-plugin-transform-h-jsx) plugin. If you don't want to use JSX you can still write plain Hyperscript:
```js
let app = h('div', null, [
    h('span', null, ["Hello World"])
]);
```

## Tutorial

### Writing Components

ZLIQ is leveraging ES2015 to read easier and reducing the transfer from normal ES5 developers already know.
ZLIQ is using [JSX](https://facebook.github.io/jsx/) as a DOM abstraction in JS. This allows templating of the components and allows ZLIQ to define how properties and children are rendered.

A component in ZLIQ can look like this:
```js
import {h} from 'zliq';

// insert values with {x}
export const Highlight = ({text}) => 
    <span class="highlight">{text}</span>;
```

You need to always provide the `h` function. JSX gets transformed to Hyperscript and the `h` is what gets evaluated by ZLIQ.
```js
// before
export const Highlight = ({text}) => 
    <span class="highlight">{text}</span>;

// after
export const Highlight = ({text}) => 
    h('span', {'class': 'highlight'}, [text]);
```

ZLIQ is a reactive view rendering framework. Much like React. Reactivitiy enables the developer to define how the rendering performs without needing to know when or where the data is coming from. Separating the concerns.
ZLIQ will rerender the above component everytime the input changes. Displaying it with the new content.

To use components in other components just import the function and use the function name as a tag name:
```js
import {h} from 'zliq';
import {Highlight} from './highlight.js';

let app = <div>
        <Highlight text="Hello World!!!"></Highlight>
    </div>;
...
```

Insert the generated element into the DOM where you please:
```js
document.querySelector('#app').appendChild(app);
```

ZLIQ doesn't enforce the parent element rule known from React. Do whatever you like with an element array.
```js
import {h} from 'zliq';

export const Listitems = () => {
    return [
        <li>I am 1</li>,
        <li>I am 2</li>
    ]
}

let list = <ul><ListItems /></ul>;
```

ZLIQ allows HTML style event binding to elements:
```js
let button = <button onclick={() => console.log('got clicked')}>Click me</button>;
```

### Streams

But to render static content, we don't need to framework... Actual user interaction with our application will change the state at several occasions over time. Stream-librarys like [RXJs](https://github.com/Reactive-Extensions/RxJS) are there explicitly for that scenario. ZLIQ includes a very lite implementation of streams inspried by RXJs and [Flyd](https://github.com/paldepind/flyd).

```js
import {stream} from 'zliq';

// streams are objects with changing values
// for simplicity streams in ZLIQ always have a value; default is NULL
let newStream = stream(5);
console.log(newStream()); // 5
newStream(6);
console.log(newStream()); // 6

// the map function is the easy way to manipulate or interact with values of the stream
newStream.map(value => console.log(value)); 
// 6
newStream(7);
// 7
```

Available stream manipulation functions are `.map`, `.flatMap`, `.filter`, `.deepSelect`, `.distinct`, `.$`, `.patch` and `.reduce`. Checkout `src/utils/streamy.js` for descriptions.

A special manipulation is the `.$()` query selector. As a developer I often want to react to changes on a specific nested property. The query selector takes one or more property paths and will return a new stream with the current selected properties:
```js
let newStream = stream({
    propA: 1,
    propB: {
        propBA: 2
    }
});
console.log(newStream.$('propA')()); // 1
console.log(newStream.$(['propA', 'propB.propBA')()); // [1,2]
```

The counterpart is the `.patch` functions. It will update just parts of the object:
```js
let newStream = stream({
    propA: 1
});
console.log(JSON.stringify(newStream())); // { propA: 1 }
newStream.patch({ propB: 2});
console.log(JSON.stringify(newStream())); // { propA: 1, propB: 2 }
```

### Redux

States across multiple components and along multiple server requests gets unpredictable. As a developer in these situations you catch yourself not knowing where to debug now. ZLIQ inclued a very lite [Redux](http://redux.js.org/docs/introduction/Motivation.html) implementation to enable centralised state management. (If you don't know Redux please read up on it.)

Create the store providing reducers:
```js
import { reduxy } from '../src';
import { clicks } from './reducers/clicks';

let store = reduxy({
    clicks
});
```

Dispatch actions on the store object you pass to your components:
```js
let app = <div>
    <button onclick={() => store.dispatch({type: CLICK})}>Click + 1</button>
</div>;
```

### Routing

ZLIQ currently has a basic router. The router prevents page reloading for local links and sends routing information to the Redux store.

Attach the router to the Redux store to receive and persist routing info. Then initialise the captchering of links:
```js
// 
import { reduxy, routerReducer, initRouter, Router } from '../src';
let store = reduxy({
    router: routerReducer
});
initRouter(store);
```

In the app we can then easyly display content according to the routing information:
```js
let routes = [
        <Router store={store} route={'/'}>
            <a href='/place?foo=bar'>Go to place bar</a>
        </Router>,
        <Router store={store} route={'/place'}>
            You are at place {store.$('router.params.foo')}.
            <a href='/'>Go home</a>
        </Router>
    ];
```

### Testing

ZLIQ returns the actual DOM element. This enables you to easyily test the components:
```js
import {Highlight} from './highlight.js';
let element = <Highlight text="Hello World!!!"></Highlight>;
assert.equal(element.outerHTML, '<p>Hello World!!!</p>');
```

 ZLIQ batches changes that exceed a certain trashhold together. This batch then is the rendered in a browser [animationframe](https://developer.mozilla.org/de/docs/Web/API/window/requestAnimationFrame). Those changes are not immediatly applied to the returned element. In those cases we can wait for a ZLIQ generated "UPDATED" event. 

```js
let listElems = // has many li-elements.
let listElem = <ul>
    { listElems }
</ul>;
// list items are not rendered yet as they are bundled into one animation frame
assert.equal(listElem.querySelectorAll('li').length, 0);
// we wait for the updates on the parent to have happend
listElem.addEventListener(UPDATE_DONE, () => {
    assert.equal(listElem.querySelectorAll('li').length, length);
    done();
});
```

If you need an easy test setup checkout how the ZLIQ project uses [Karma](https://karma-runner.github.io).

### Dependencies

Dependencies add a lot of magic to a project. Sometimes that is desired as you don't want to reinvent the wheel every day. But I think if you are building on top of a rocketship, you want to know how it flys. ZLIQ therefor has only one small dependency. All the rest is part of ZLIQ and easyly accessable.

### An actual project

Checkout the [GitHub Page](https://faboweb.github.io/zliq/) and the corresponding code at `./demo`.

## Todos

 - Make a lazy loaded list work -> better rendering for many elements 
 - Need Reviewers
 - Add Code Playground to Page

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
[module-formats-badge]: https://img.shields.io/badge/module%20formats-es-green.svg?style=flat-square

Logo based on: http://www.iconsfind.com/2015/11/25/candy-dessert-food-sweet-baby-icon/