import { h } from '../src';
import {Subheader} from './subheader.jsx';
import {Markup} from './utils.jsx';
import './tutorial.scss';

export const Tutorial = () =>
    <div class="section tutorial">
        <Subheader title="Writing Components" subtitle="Hello World here we come" id="tutorial"/>

        <p>ZLIQ is leveraging ES2015 to read easier and to be readable by everybody.
        ZLIQ is using <a href="https://facebook.github.io/jsx/">JSX</a> as a DOM abstraction in JS. This allows templating of the components and allows ZLIQ to define how properties and children are rendered.</p>

        <p>A component in ZLIQ can look like this:</p>

        <Markup>
            {`
            |import {h} from 'zliq';
            |
            |// insert values in the markup with {x}
            |export const Highlight = (props, children) =>
            |    <span class='highlight'>{props.text}</span>;
            `}
        </Markup>

        <p>You need to always provide the <code>h</code> function. JSX gets transformed to Hyperscript and the <code>h</code> is what gets evaluated by ZLIQ.</p>

        <Markup>
            {`
            |// before
            |export const Highlight = ({text}) =>
            |    <span class="highlight">{text}</span>;
            |
            |// after
            |export const Highlight = ({text}) =>
            |    h('span', {'class': 'highlight'}, [text]);
            `}
        </Markup>

        <p>ZLIQ is a reactive view rendering framework. Much like React. Reactivity enables the developer to define how the rendering performs without needing to know when or where the data is coming from. Separating the concerns.
        ZLIQ will rerender the above component every time the input changes. Displaying it with the new content.</p>

        <p>To use components in other components just import the function and use the function name as a tag name:</p>

        <Markup>
            {`
            |import {h} from 'zliq';
            |import {Highlight} from './highlight.js';
            |
            |let app = <div>
            |        <Highlight text="Hello World!!!"></Highlight>
            |    </div>;
            |...
            `}
        </Markup>

        <p>Insert the generated element into the DOM where you please:</p>

        <Markup>
            |document.querySelector('#app').appendChild(app);
        </Markup>

        <p>ZLIQ doesn't enforce the parent element rule known from React. Do whatever you like with an element array.</p>

        <Markup>
            {`
            |import {h} from 'zliq';
            |
            |export const ListItems = () => {
            |    return [
            |        <li>I am 1</li>,
            |        <li>I am 2</li>
            |    ]
            |}
            |
            |let list = <ul><ListItems /></ul>;
            `}
        </Markup>

        <p>ZLIQ allows HTML style event binding to elements:</p>

        <Markup>{`|let button = <button onclick={() => console.log('got clicked')}>Click me</button>;`}
        </Markup>

        <Subheader title="Streams" subtitle="Feel the flow" id="streams" />

        <p>To render static content, we don't need to framework... Actual user interaction with our application will change the state at several occasions over time. Stream-librarys like <a href="https://github.com/Reactive-Extensions/RxJS">RXJS</a> are there explicitly for that scenario. ZLIQ includes a very lite implementation of streams inspired by RXJS and <a href="https://github.com/paldepind/flyd">Flyd</a>.</p>

        <Markup>
            {`
            |import {stream} from 'zliq';
            |
            |// streams are objects with changing values
            |let newStream = stream(5);
            |console.log(newStream()); // 5
            |newStream(6);
            |console.log(newStream()); // 6
            |
            |// the map function is the easy way to manipulate or interact with values of the stream
            |newStream.map(value => console.log(value));
            |// 6
            |newStream(7);
            |// 7
            `}
        </Markup>

        <p>Available stream manipulation functions are <code>.map</code>, <code>.flatMap</code>, <code>.filter</code>, <code>.deepSelect</code>, <code>.distinct</code>, <code>.$</code>, <code>.patch</code> and <code>.reduce</code>. Checkout <code>src/utils/streamy.js</code> for descriptions.</p>

        <p>A special manipulation is the <code>.$()</code> query selector. As a developer I often want to react to changes on a specific nested property. The query selector takes one or more property paths and will return a new stream with the current selected properties:</p>

        <Markup>
            {`
            |let newStream = stream({
            |    propA: 1,
            |    propB: {
            |        propBA: 2
            |    }
            |});
            |console.log(newStream.$('propA')()); // 1
            |console.log(newStream.$(['propA', 'propB.propBA')()); // [1,2]
            `}
        </Markup>

        <p>The counterpart is the <code>.patch</code> functions. It will update just parts of the object:</p>

        <Markup>
            {`
            |let newStream = stream({
            |    propA: 1
            |});
            |console.log(JSON.stringify(newStream())); // { propA: 1 }
            |newStream.patch({ propB: 2});
            |console.log(JSON.stringify(newStream())); // { propA: 1, propB: 2 }
            `}
        </Markup>

        <p>ZLIQ recognizes passed streams in the Hyperscript and updates the DOM on new stream values:</p>

        <Markup>
            {`
            |let newStream = stream('Hello World');
            |let app <span>{newStream}</span>;
            |assert(app.outerHTML === '<span>Hello World</span>');
            |newStream('Bye World');
            |assert(app.outerHTML === '<span>Bye World</span>');
            `}
        </Markup>

        <p>An important difference to RXJS is that streams in ZLIQ always have a value. This actually simplifies the way we think about streams as we always have to expect null values instead of guessing when to expect null values and when not.</p>

        <Markup>
            {`
            |let newStream = stream();
            |assert(newStream() == null);
            |let filteredStream = newStream.filter(x => x != null);
            |assert(filteredStream() == null);
            `}
        </Markup>

        <Subheader title="State Management" subtitle="F*** Redux. ZLIQ &#9829; streams" id="state" />

        <p>A core reason for web UI frameworks is the automatic updating of the UI according to some state. This is handled very different in the known frameworks. ZLIQ has no dedicated state management. We already saw that ZLIQ reacts to streams in the Hyperscript. This way you are free to decide if you want to put the state locally or globally or where ever.</p>

        <p>For a component based state like in used in the most MV* frameworks just define a state stream locally.</p>

        <Markup>
            {`
            |let state$ = stream({ clicks: 0 });
            |let Component = () => <div>
            |  Clicks: {state$.$('clicks')}
            |</div>;
            `}
        </Markup>

        <p>For a centralized state like in [Redux](http://redux.js.org/) define a state for the application and then pass it on to each component.</p>

        <Markup>
            {`
            |let state$ = stream({ clicks: 0 });
            |
            |let Component = ({state$}) => <div>
            |  Clicks: {state$.$('clicks')}
            |</div>;
            |
            |let app = <Component state$={state$} />;
            `}
        </Markup>

        <p>To manipulate the local or global state you can emit a completely new state to the state stream. Or use the `.patch` function to update only parts of the state:</p>

        <Markup>
            {`
            |// Redux like action
            |let increment = (state$) => () => {
            |    state$.patch({ clicks: state$.$('clicks')() + 1 })
            |};
            |
            |let app = <div>
            |    <button onclick={increment(state$)}>Click + 1</button>
            |</div>;
            `}
        </Markup>

        <Subheader title="Helpers" subtitle="Because in some situation you need a friend" id="helpers" />

        <p>ZLIQ acknowledges that a web developer has a bunch of tasks he performs frequently. With ZLIQ this developer could build his own helpers. But we developers are lazy, so ZLIQ provides some basics you probably will use in you ZLIQ application.</p>

        <h6>if$ - boolean switch</h6>

        <p>Often you want to show content dependent on boolean-state:</p>

        <Markup>
            {`
            |<div>
            |    {
            |        open$.map(open => {
            |            if (open) {
            |                return <span>Open</span>;
            |            } else {
            |                return <span>Closed</span>;
            |            }
            |        })
            |    }
            |</div>
            `}
        </Markup>

        <p>ZLIQ provides a boolean switch for these cases:</p>

        <Markup>
            {`
            |<div>
            |    {
            |        if$(open$,
            |            <span>Open</span>,
            |            <span>Closed</span>)
            |    }
            |</div>
            `}
        </Markup>

        <h6>join$ - string merge</h6>

        <p>Performing class manipulation on an element can be a pain:</p>

        <Markup>
            {`
            |<div class={open$.map(open => 'container ' + open ? 'open' : 'closed')}>
            |</div>
            `}
        </Markup>

        <p>Imagine this with more then one condition... ZLIQ provides a helper for joining strings even from streams:</p>

        <Markup>
            {`
            |<div class={join$('container', if$(open$, 'open', 'closed'))}>
            |</div>
            `}
        </Markup>

        <h6>promise$ - promise enhancer</h6>

        <p>ZLIQ provides a little wrapper around promises. It provides a flag for the ongoing request. This way you can show loading bars easily:</p>

        <Markup>
            {`
            |import { promise$ } from '../src';
            |
            |let fetchQuote = (into$) => () => {
            |	promise$(fetch('http://quotes.rest/qod.json?category=inspire')
            |        .then(res => res.json())
            |        .then(data => {
            |		    return {
            |		    	quote: data.contents.quotes["0"].quote,
            |		    	author: data.contents.quotes["0"].author
            |		    };
            |	}).map(into$);
            |}
            |let quoteRequest$ = stream({initial: true});
            |
            |let app = <div>
            |    <button onclick={fetchQuote(quoteRequest$)}>Get Quote of the Day</button>
            |    <p>
            |        {
            |            quoteRequest$.map(({initial, data, loading}) => {
            |                if (initial) {
            |                   return null;
            |                }
            |                if (loading) {
            |                    return 'Loading...';
            |                }
            |                return <p>{data.quote} - {data.author}</p>;
            |            })
            |        }
            |    </p>
            |</div>;
            `}
        </Markup>

        <Subheader title="Routing" subtitle="To allow deeplinks and browser history" id="routing" />

        <p>ZLIQ currently has a basic router. The router prevents page reloading for local links and gives you a stream for the current routing information:</p>

        <Markup>
            {`
            |import { initRouter } from '../src';
            |let router$ = initRouter();
            `}
        </Markup>

        <p>The router element is the counterpart in the Hyperscript. It registers a provided route in the global router so we can decide on routes where we need them, in the view:</p>

        <Markup>
            {`
            |import { Router } from '../src';
            |let routes = [
            |    <Router router$={router$} route={'/'}>
            |        <a href='/place?foo=bar'>Go to place bar</a>
            |    </Router>,
            |    <Router router$={router$} route={'/place'}>
            |        You are at place {router$.$('params.foo')}.
            |        <a href='/'>Go home</a>
            |    </Router>
            |];
            `}
        </Markup>

        <p>The router is currently not allowing for some kind of child-routes.</p>

        <p>Test the router on this page: <a href="/subpage?foo=bar">Go to Subpage</a></p>

        <Subheader title="Lifecycle" subtitle="To cleanup your s*** after your done" id="lifecycle" />

        <p>ZLIQ dispatches lifecycle events `CHILDREN_CHANGED`, `ADDED`, `REMOVED` and `UPDATED` on the element. This way you can perform actions like initialization jQuery plugins on the element.</p>

        <Markup>
            {`
            |let Child = () => {
            |    let elem = <div class="child"></div>;
            |    elem.addEventListener(ADDED, () => {
            |        // manipulate element
            |    });
            |    elem.addEventListener(REMOVED, () => {
            |        // cleanup
            |    });
            |    return elem;
            |};
            `}
        </Markup>

        <p>ZLIQ batches changes that exceed a certain threshold together. This batch then is the rendered in a browser <a href="https://developer.mozilla.org/de/docs/Web/API/window/requestAnimationFrame">animationframe</a>. Those changes are not immediately applied to the returned element. In those cases we can wait for a ZLIQ generated `CHILDREN_CHANGED` event. </p>

        <Markup>
            {`
            |let listElems = // has many li-elements.
            |let listElem = <ul>
            |    { listElems }
            |</ul>;
            |// list items are not rendered yet as they are bundled into one animation frame
            |assert.equal(listElem.querySelectorAll('li').length, 0);
            |// we wait for the updates on the parent to have happened
            |listElem.addEventListener(CHILDREN_CHANGED, () => {
            |    assert.equal(listElem.querySelectorAll('li').length, length);
            |    done();
            |});
            `}
        </Markup>

        <Subheader title="Testing" subtitle="A good framework is easy to test" id="testing" />

        <p>ZLIQ returns the actual DOM element. This enables you to easily test the components:</p>

        <Markup>
            {`
            |import {Highlight} from './highlight.js';
            |let element = <Highlight text="Hello World!!!"></Highlight>;
            |assert.equal(element.outerHTML, '<p>Hello World!!!</p>');
            `}
        </Markup>

        <p>ATTENTION: The `CHILDREN_CHANGED` event is async for long lists of elements. Checkout the list example above.</p>

        <p>If you need an easy test setup checkout how the ZLIQ project uses <a href="https://facebook.github.io/jest/">Jest</a> with almost 0 configuration.</p>
    </div>