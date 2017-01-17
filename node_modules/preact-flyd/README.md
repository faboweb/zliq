preact-flyd
=========================

Inspired by [theadam/react-flyd](https://github.com/theadam/react-flyd)

Allows for flyd streams to be embedded directly into JSX, and to update content when the streams fire events.

### List Example

```jsx
import { render } from 'preact';
import { h } from 'preact-flyd';
import { stream, scan, merge} from 'flyd';

let items$ = stream([1,2,3,4,5,])

function List() {
  return (
    <div>
      <div>
        <button id="plus" onClick={e => items$(items$().concat(Math.random()))}>+</button>
      </div>
      <ul>
        {items$.map(items => items.map(item => <li key={item}>{item}</li>))}
      </ul>
    </div>
  );
}

render(<List />, document.getElementById('app'));
```

### Several Concept:

**Self Control Element**
a `self control element` means a valid vnode stream like: `{item$.map(item => <div>{item}</div>)}`. In fact, it runs like this:

```jsx
<div>
  {item$.map(item => <div>{item}</div>)}
</div>

// will be like

class ReactiveClass extends Component {
  ...
  some lifecycle methods to manage the stream as state
  ...
  render() {
    return <div {...this.props}>{this.state.item}</div>
  }
}
<div><ReactiveClass /></div>
```

Since `render` returning a string is accepted in `preact`, a string stream is also be treated as a self control element.

**Parent Control Element**
a `parent control element` means a not valid vnode stream like: `{list$.map(list => list.map(item => <li key={item}>{item}</li>))}`. In fact, it runs like:
```jsx
<ul>
  {list$.map(list => list.map(item => <li key={item}>{item}</li>))}
</ul>

// will be like

class ReactiveClass extends Component {
  ...
  some lifecycle methods to manage the stream as state
  ...
  render() {
    return <ul>{this.state.children}</ul> // we have change the children from a stream to it's value
  }
}
<ReactiveClass />
```

And of course, `self control element` consume less than `parent control element`, but just a little. You needn't worry about it too much.

### IMPORTANT

~~use streams created in render method rather than outter streams... Just see the example `use_streams_created_in_render_rather_than_out_of_it`~~

Terribly sorry about above description, it's wrong. I must be drunk when I wrote it even though I do not drink alcohol. Well, in fact, what I want to notice you is **BE CAREFUL OF MEMORY LEAKING**.

There is an example. Some tips is:

1. Don't transform the stream's component type:

```jsx
a$(<div />)
<div>{a$}</div>   
// now, a$ will be treated as a self control element, then you can
a$('abc')
a$(<span />)
// but you cann't
a$(1)
a$([1,2,3])
a$([<div></div>, <div></div>])
```

    the rule is: the init value will define the stream's component type. If it's null, string, preact vnode, it's a self control element. Otherwise, it's parent control element. A self control element can only has valid value(null, string, vnode), but a parent control element can has any type value.
    
2. Be careful of memory leaking:
    
    
    A self control element stream can be created in `render` method with just one `stream.map`(no more than one level). But a parent control element must be created outside of `render`.