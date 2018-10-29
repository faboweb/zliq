import { zx } from "../src";
import { Router } from "zliq-router";
import { Subheader } from "./subheader.jsx";
import { Markup } from "./utils.jsx";
import "./tutorial.scss";

export const Tutorial = ({ router$ }, children, globals) => zx`
  <div class="section tutorial">
    ${Subheader({
      title: "Writing Components",
      subtitle: "Hello World here we come",
      id: "tutorial"
    })}

    <p>
      ZLIQ is leveraging ES2015 to read easier and to be readable by everybody.
      ZLIQ is using <a href="https://facebook.github.io/jsx/">JSX</a> as a DOM
      abstraction in JS. This allows templating of the components and allows
      ZLIQ to define how properties and children are rendered.
    </p>

    <p>A component in ZLIQ can look like this:</p>

    ${Markup(
      `
      |import {h} from 'zliq';
      |
      |// insert values in the markup with {x}
      |export const Highlight = (props, children) =>
      |    <span class='highlight'>{props.text}</span>;
      `
    )}

    <p>
      You need to always provide the <code>h</code> function. JSX gets
      transformed to Hyperscript and the <code>h</code> is what gets evaluated
      by ZLIQ.
    </p>

    ${Markup(
      `
      |// before
      |export const Highlight = ({text}) =>
      |    <span class="highlight">{text}</span>;
      |
      |// after
      |export const Highlight = ({text}) =>
      |    h('span', {'class': 'highlight'}, [text]);
      `
    )}

    <p>
      ZLIQ is a reactive view rendering framework. Much like React. Reactivity
      enables the developer to define how the rendering performs without needing
      to know when or where the data is coming from. Separating the concerns.
      ZLIQ will rerender the above component every time the input changes.
      Displaying it with the new content.
    </p>

    <p>
      To use components in other components just import the function and use the
      function name as a tag name:
    </p>

    ${Markup(
      `
      |import {h} from 'zliq';
      |import {Highlight} from './highlight.js';
      |
      |let app = <div>
      |        <Highlight text="Hello World!!!"></Highlight>
      |    </div>;
      |...
      `
    )}

    <p>Insert the generated element into the DOM where you please:</p>

    ${Markup(
      `
      |import {render} from 'zliq';
      |
      |render(app, document.querySelector('#app'));
      `
    )}

    <p>
      ZLIQ doesn't enforce the parent element rule known from React. Do whatever
      you like with an element array.
    </p>

    ${Markup(
      `
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
      `
    )}

    <p>ZLIQ allows HTML style event binding to elements:</p>

    ${Markup(
      `
      |let button = <button onclick={() => console.log('got clicked')}>Click me</button>;
      `
    )}

    ${Subheader({ title: "Streams", subtitle: "Feel the flow", id: "streams" })}

    <p>
      To render static content, we don't need a framework... Actual user
      interaction with our application will change the state at several
      occasions over time. Stream-librarys like{" "}
      <a href="https://github.com/Reactive-Extensions/RxJS">RXJS</a> are there
      explicitly for that scenario. ZLIQ includes a very lite implementation of
      streams inspired by RXJS and{" "}
      <a href="https://github.com/paldepind/flyd">Flyd</a>.
    </p>

    ${Markup(
      `
      |import {stream} from 'zliq';
      |
      |// streams are objects with changing values that will call listeners on new values
      |// create a new stream with an optional starting value
      |let newStream = stream(5);
      |// retrieve the current value of the stream with stream() or stream.value
      |console.log(newStream()); // 5
      |// update the stream
      |newStream(6);
      |console.log(newStream.value); // 6
      |
      |// a stream update returns the stream, so you can chain updats easy
      |newStream(7)(8)(9);
      |
      |// to debug your streams you can use the .log helper
      |newStream.log() // 9, 10, 11, 12
      |newStream(10)(11)(12);
      `
    )}

    <p>The map function is the easiest way to add a listener to the stream</p>

    ${Markup(
      `
      |newStream.map(value => console.log(value));
      |
      |// the map function return a stream of values returned by the listener function
      |let times2 = newStream.map(x => 2*x)
      |times2.log() // 10
      |newStream(5)
      `
    )}

    <p>
      The format of the stream as a function makes it easy to pipe events into
      streams.
    </p>

    ${Markup(
      `
      |element.attachEventListener('click', eventStream);
      |// or pipe streams into streams
      |newStream.map(otherStream);
      `
    )}

    <p>
      There are a bunch of stream manipulation functions available:{" "}
      <code>.map</code>, <code>.is</code>, <code>.filter</code>,{" "}
      <code>.distinct</code> and <code>.reduce</code>. Checkout{" "}
      <code>src/utils/streamy.js</code> for descriptions.
    </p>

    ${Markup(
      `
      |let myStream = stream(5)
      |
      |// check for a certain value
      |myStream.is(5).log() // false, true...
      |myStream(5)
      |
      |// only output filtered values
      |newStream.filter(x => x > 4).log() // 5, 7, 8...
      |newStream(3)(7)(8)
      |
      |// react to previous values
      |newStream.reduce((sum, cur) => sum + cur, 0).log() // 8, 17, 27...
      |newStream(9)(10)
      |
      |// only react to changed values
      |newStream.distinct().log() // 10, 11, 10...
      |newStream(10)(10)(11)(10)
      `
    )}

    <p>You can also combine streams:</p>

    ${Markup(
      `
      |import {merge$} from 'zliq'
      |
      |let myStream = stream(5)
      |let sndStream = stream(3)
      |let thrdStream = stream(4)
      |
      |// you can fuse several streams into one
      |merge$([myStream, sndStream, thrdStream]).log() // [5, 3, 4]...
      |
      |// you can also flatten nested streams into one stream
      |myStream.flatMap(x => {
      |    if (x > 5) return sndStream
      |    return thrdStream
      |}).log() // 4, 7, 6, 9
      |sndStream(6)
      |thrdStream(7)
      |myStream(8)
      |sndStream(9)
      `
    )}

    <p>
      A special manipulation is the <code>.$()</code> query selector. As a
      developer I often want to react to changes on a specific nested property.
      The query selector takes one or more property paths and will return a new
      stream with the current selected properties:
    </p>

    ${Markup(
      `
      |let newStream = stream({
      |    propA: 1,
      |    propB: {
      |        propBA: 2
      |    }
      |});
      |newStream.$('propA').log() // 1
      |newStream.$(['propA', 'propB.propBA']).log() // [1,2]
      `
    )}

    <p>
      The counterpart is the <code>.patch</code> functions. It will assume the
      stream to be a state object and it updates just parts of the object:
    </p>

    ${Markup(
      `
      |let newStream = stream({
      |    propA: 1
      |})
      |newStream.log() // { propA: 1 }, { propA: 1, propB: 2 }
      |newStream.patch({ propB: 2})
      `
    )}

    <p>
      ZLIQ recognizes passed streams in the Hyperscript and updates the DOM on
      new stream values:
    </p>

    ${Markup(
      `
      |let newStream = stream('Hello World')
      |let app = <span>{newStream}</span>
      |render(app).map(({element}) => element.outerHTML).log()
      |// <span>Hello World</span>
      |newStream('Bye World')
      |// <span>Bye World</span>
      `
    )}

    <p>
      ZLIQ streams are always hot, meaning they will send their last value on
      hooking into it. BUT the streams will not emit \`undefined\`!
    </p>

    ${Markup(
      `
      |let newStream = stream()
      |assert(newStream() === undefined)
      |newStream.log() // 'Hallo World', ...
      |newStream('Hallo World')
      |newStream.log() // 'Hallo World', ...
      `
    )}

    ${Subheader({
      title: "State Management",
      subtitle: "F*** Redux. ZLIQ &#9829; streams",
      id: "state"
    })}

    <p>
      A core reason for web UI frameworks is the automatic updating of the UI
      according to some state. This is handled very different in the known
      frameworks. ZLIQ has no dedicated state management. We already saw that
      ZLIQ reacts to streams in the Hyperscript. This way you are free to decide
      if you want to put the state locally or globally or where ever.
    </p>

    <p>
      For a component based on state like used in the most MV* frameworks just
      define a state stream locally.
    </p>

    ${Markup(
      `
      |let state$ = stream({ clicks: 0 });
      |let Component = () => <div>
      |  Clicks: {state$.$('clicks')}
      |</div>;
      `
    )}

    <p>
      As developers are lazy and don't want to repet code like \`state$.$(...)\`
      in the code the whole time, there is also a simpler way. You just return a
      function that will be executed with the resolved attributes:
    </p>

    ${Markup(
      `
      |let state$ = stream({ clicks: 0 });
      |let Component = () => ({clicks}) => <div>
      |  Clicks: {clicks}
      |</div>;
      `
    )}

    <p>
      For a centralized state like in <a href="http://redux.js.org/">Redux</a>{" "}
      define a state for the application and then pass it on to each component.
    </p>

    ${Markup(
      `
      |let state$ = stream({ clicks: 0 });
      |
      |let Component = (props, children, {state$}) => <div>
      |  Clicks: {state$.$('clicks')}
      |</div>;
      |
      |let app = <Component />;
      |// pass the state$ as a global to all sub-components
      |render(app, document.querySelector('#app'), {state$})
      `
    )}

    <p>
      To manipulate the local or global state you can emit a completely new
      state to the state stream. Or use the \`.patch\` function to update only
      parts of the state:
    </p>

    ${Markup(
      `
      |// Redux like action
      |let increment = (state$) => () => {
      |    state$.patch({ clicks: state$.$('clicks')() + 1 })
      |};
      |
      |let app = <div>
      |    <button onclick={increment(state$)}>Click + 1</button>
      |</div>;
      `
    )}

    ${Subheader({
      title: "Helpers",
      subtitle: "Because in some situation you need a friend",
      id: "helpers"
    })}

    <p>
      ZLIQ acknowledges that a web developer has a bunch of tasks he performs
      frequently. With ZLIQ this developer could build his own helpers. But we
      developers are lazy, so ZLIQ provides some basics you probably will use in
      you ZLIQ application.
    </p>

    <h6>if$ - boolean switch</h6>

    <p>Often you want to show content dependent on boolean-state:</p>

    ${Markup(
      `
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
      `
    )}

    <p>ZLIQ provides a boolean switch for these cases:</p>

    ${Markup(
      `
      |<div>
      |    {
      |        if$(open$,
      |            <span>Open</span>,
      |            <span>Closed</span>)
      |    }
      |</div>
      `
    )}

    <h6>join$ - string merge</h6>

    <p>Performing class manipulation on an element can be a pain:</p>

    ${Markup(
      `
      |<div class={open$.map(open => 'container ' + open ? 'open' : 'closed')}>
      |</div>
      `
    )}

    <p>
      Imagine this with more then one condition... ZLIQ provides a helper for
      joining strings even from streams:
    </p>

    ${Markup(
      `
      |<div class={join$('container', if$(open$, 'open', 'closed'))}>
      |</div>
      `
    )}

    <h6>promise$ - promise enhancer</h6>

    <p>
      ZLIQ provides a little wrapper around promises. It provides a flag for the
      ongoing request. This way you can show loading bars easily:
    </p>

    ${Markup(
      `
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
      `
    )}

    ${Subheader({
      title: "Routing",
      subtitle: "Put your state where your URL is",
      id: "routing"
    })}

    <p>
      ZLIQ provides a small router as a package 'zliq-router' to be installed
      via npm. It plugs very natural into native links. It provides you with the
      routing as a stream so you can use it as an input to your view. It also
      provides a component to switch on certain routes. Check it out on{" "}
      <a href="http://github.com/faboweb/zliq-router">GitHub</a>
    </p>

    ${Markup(
      `
      |import {Router, initRouter}
      |
      |let router$ = initRouter()
      |router$.log() // {route: '/', params: {}, routes: [...]}
      |
      |let app = <div>
      |    <a href="/cats">Go the cats</a>
      |    <a href="/">Go away from cats</a>
      |    <Router route="/" router$={router$}>
      |        No Cats here. :-(
      |    </Router>
      |    <Router route="/cats" router$={router$}>
      |        Miau! Miau!
      |    </Router>
      |</div>
      `
    )}

    ${Subheader({
      title: "Lifecycle",
      subtitle: "To cleanup your s*** after your done",
      id: "lifecycle"
    })}

    <p>
      ZLIQ integrates lifecycle event. You can add an attribute cycle to any
      component holding functions for the lifecycle events \`created\`, \`mounted\`,
      \`updated\` and \`removed\`. This way you can perform actions like
      initialization jQuery plugins on the element.
    </p>

    ${Markup(
      `
      |let cycle = {
      |    mounted: element => {} // do sth with the element here
      |}
      |let app = <div cycle={cycle}><div>
      `
    )}

    <p>
      In rare cases you want to prevent ZLIQ from updating renderer children.
      For example if yome external plugin handles a renderer element. To do so
      you just add the \`isolated\` attribute to the element.
    </p>

    ${Markup(
      `
      |let state$ = stream({ clicks: 0 });
      |let app = <div isolated>
      |  Clicks: {state$.$('clicks')}
      |</div>
      |render(app).map(({element}) => element.outerHTML).log()
      |// <div>Clicks: 0</div>
      |// <div>Clicks: 0</div>
      |state$.patch({clicks: 1})
      `
    )}

    ${Subheader({
      title: "Testing",
      subtitle: "A good framework is easy to test",
      id: "testing"
    })}

    <p>
      ZLIQ provides a helper to test the output of your components over time:
    </p>

    ${Markup(
      `
      |import {h, stream, testRender} from 'zliq';
      |
      |let text$ = stream('Hello World!!!');
      |testRender(<p>{text$}></p>, [
      |    // on each update of an element, we can test it
      |    ({element}) => assert.equal(element.outerHTML, '<p>Hello World!!!</p>'),
      |    // it is enough to just provide the expected html
      |    '<p>Bye World!!!</p>',
      |]);
      |text$('Bye World!!!');
      `
    )}

    <p>For streams you can also just provide the sequence of values:</p>

    ${Markup(
      `
      |import {stream, test$} from 'zliq';
      |
      |let value$ = stream({value: 1});
      |test$(value$, [
      |    {value: 1},
      |    2,
      |    false
      |]);
      |value$(2)(false);
      `
    )}

    <p>
      If you need an easy test setup checkout how the ZLIQ project uses 
      <a href="https://facebook.github.io/jest/">Jest</a> with almost 0
      configuration.
    </p>
  </div>
`;
