import { h } from '../src';
import {Subheader} from './subheader.jsx';
import {Markup} from './utils.jsx';

export const Tutorial = () => 
    <div class="section">
        <Subheader title="Writing Components" subtitle="Hello World here we come" />

        <p>ZLIQ is leveraging ES2015 to read easier and to be readable by everybody.
        ZLIQ is using <a href="https://facebook.github.io/jsx/">JSX</a> as a DOM abstraction in JS. This allows templating of the components and allows ZLIQ to define how properties and children are rendered.</p>

        <p>A component in ZLIQ can look like this:</p>

        <Markup>
            {`import {h} from 'zliq';

// insert values with {x}
export const Highlight = ({text}) => 
    <span class='highlight'>{text}</span>;`}
        </Markup>

        <p>You need to always provide the <code>h</code> function. JSX gets transformed to Hyperscript and the <code>h</code> is what gets evaluated by ZLIQ.</p>

        <Markup>{`// before
export const Highlight = ({text}) => 
    <span class="highlight">{text}</span>;

// after
export const Highlight = ({text}) => 
    h('span', {'class': 'highlight'}, [text]);`}
        </Markup>

        <p>ZLIQ is a reactive view rendering framework. Much like React. Reactivity enables the developer to define how the rendering performs without needing to know when or where the data is coming from. Separating the concerns.
        ZLIQ will rerender the above component every time the input changes. Displaying it with the new content.</p>

        <p>To use components in other components just import the function and use the function name as a tag name:</p>

        <Markup>{`import {h} from 'zliq';
import {Highlight} from './highlight.js';

let app = <div>
        <Highlight text="Hello World!!!"></Highlight>
    </div>;
...`}
        </Markup>

        <p>Insert the generated element into the DOM where you please:</p>

        <Markup>document.querySelector('#app').appendChild(app);
        </Markup>

        <p>ZLIQ doesn't enforce the parent element rule known from React. Do whatever you like with an element array.</p>

        <Markup>{`import {h} from 'zliq';

export const Listitems = () => {
    return [
        <li>I am 1</li>,
        <li>I am 2</li>
    ]
}

let list = <ul><ListItems /></ul>;`}
        </Markup>

        <p>ZLIQ allows HTML style event binding to elements:</p>

        <Markup>{`let button = <button onclick={() => console.log('got clicked')}>Click me</button>;`}
        </Markup>

        <Subheader title="Streams" subtitle="Feel the flow" />

        <p>To render static content, we don't need to framework... Actual user interaction with our application will change the state at several occasions over time. Stream-librarys like <a href="https://github.com/Reactive-Extensions/RxJS">RXJs</a> are there explicitly for that scenario. ZLIQ includes a very lite implementation of streams inspired by RXJs and <a href="https://github.com/paldepind/flyd">Flyd</a>.</p>

        <Markup>{`import {stream} from 'zliq';

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
// 7`}
        </Markup>

        <p>Available stream manipulation functions are <code>.map</code>, <code>.flatMap</code>, <code>.filter</code>, <code>.deepSelect</code>, <code>.distinct</code>, <code>.$</code>, <code>.patch</code> and <code>.reduce</code>. Checkout <code>src/utils/streamy.js</code> for descriptions.</p>

        <p>A special manipulation is the <code>.$()</code> query selector. As a developer I often want to react to changes on a specific nested property. The query selector takes one or more property paths and will return a new stream with the current selected properties:</p>

        <Markup>{`let newStream = stream({
    propA: 1,
    propB: {
        propBA: 2
    }
});
console.log(newStream.$('propA')()); // 1
console.log(newStream.$(['propA', 'propB.propBA')()); // [1,2]`}
        </Markup>

        <p>The counterpart is the <code>.patch</code> functions. It will update just parts of the object:</p>

        <Markup>{`let newStream = stream({
    propA: 1
});
console.log(JSON.stringify(newStream())); // { propA: 1 }
newStream.patch({ propB: 2});
console.log(JSON.stringify(newStream())); // { propA: 1, propB: 2 }`}
        </Markup>

        <Subheader title="Redux" subtitle="ZLIQs redux implementation" />

        <p>States across multiple components and along multiple server requests gets unpredictable. As a developer in these situations you catch yourself not knowing where to debug now. ZLIQ include a very lite <a href="http://redux.js.org/docs/introduction/Motivation.html">Redux</a> implementation to enable centralised state management. (If you don't know Redux please read up on it.)</p>

        <p>Create the store providing reducers:</p>

        <Markup>{`import { reduxy } from '../src';
import { clicks } from './reducers/clicks';

let store = reduxy({
    clicks
});`}
        </Markup>

        <p>The store exposes the query function known from ZLIQs streams:</p>

        <Markup>{`let app = <div>
    <span>Clicks: {store.$('clicks.clicks')}</span>
</div>;`}
        </Markup>

        <p>Dispatch actions on the store object you pass to your components:</p>

        <Markup>{`let app = <div>
    <button onclick={() => store.dispatch({type: CLICK})}>Click + 1</button>
</div>;`}
        </Markup>

        <Subheader title="Routing" subtitle="To allow deeplinks and browser history" />

        <p>ZLIQ currently has a basic router. The router prevents page reloading for local links and sends routing information to the Redux store.</p>

        <p>Attach the router to the Redux store to receive and persist routing info. Then initialize the capturing of links:</p>

        <Markup>{`// 
import { reduxy, routerReducer, initRouter, Router } from '../src';
let store = reduxy({
    router: routerReducer
});
initRouter(store);`}
        </Markup>

        <p>In the app we can then easily display content according to the routing information:</p>

        <Markup>{`let routes = [
    <Router store={store} route={'/'}>
        <a href='/place?foo=bar'>Go to place bar</a>
    </Router>,
    <Router store={store} route={'/place'}>
        You are at place {store.$('router.params.foo')}.
        <a href='/'>Go home</a>
    </Router>
];`}
        </Markup>

        <Subheader title="Testing" subtitle="A good framework is easy to test" />

        <p>ZLIQ returns the actual DOM element. This enables you to easily test the components:</p>

        <Markup>{`import {Highlight} from './highlight.js';
let element = <Highlight text="Hello World!!!"></Highlight>;
assert.equal(element.outerHTML, '<p>Hello World!!!</p>');`}
        </Markup>

        <p>ZLIQ batches changes that exceed a certain threshold together. This batch then is the rendered in a browser <a href="https://developer.mozilla.org/de/docs/Web/API/window/requestAnimationFrame">animationframe</a>. Those changes are not immediately applied to the returned element. In those cases we can wait for a ZLIQ generated "UPDATED" event. </p>

        <Markup>{`let listElems = // has many li-elements.
let listElem = <ul>
    { listElems }
</ul>;
// list items are not rendered yet as they are bundled into one animation frame
assert.equal(listElem.querySelectorAll('li').length, 0);
// we wait for the updates on the parent to have happened
listElem.addEventListener(UPDATE_DONE, () => {
    assert.equal(listElem.querySelectorAll('li').length, length);
    done();
});`}
        </Markup>

        <p>If you need an easy test setup checkout how the ZLIQ project uses <a href="https://karma-runner.github.io">Karma</a>.</p>
    </div>