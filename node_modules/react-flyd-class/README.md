# React Flyd Class
> A thin layer between Flyd and React.  Ported from [react-reactive-class](https://github.com/jas-chen/react-reactive-class.git).

## What?
With React Flyd Class, you can create Reactive Components, which
subscribe to flyd streams and re-render themselves.

## Counter example

You can compare this example to [Counter example of Cycle.js](https://github.com/cyclejs/cycle-examples/blob/master/counter/src/main.js) and [Counter example of Yolk](https://github.com/yolkjs/yolk#example).

```javascript
import { stream, merge, scan } from 'flyd';
import React from 'react';
import ReactDOM from 'react-dom';
import { reactive } from 'react-flyd-class';

const Span = createReactiveClass('span');

function Counter () {
  const plusClick$ = stream();
  const minusClick$ = stream();

  const action$ = merge(
    plusClick$.map(() => 1),
    minusClick$.map(() => -1)
  );

  const count$ = scan((x, y) => x + y, 0, action$);

  return (
    <div>
      <div>
        <button id="plus" onClick={ (e) => plusClick$(e) }>+</button>
        <button id="minus" onClick={ (e) => minusClick$(e) }>-</button>
      </div>
      <div>
        Count: <Span>{ count$ }</Span>
      </div>
    </div>
  )
}

ReactDOM.render(<Counter />, document.getElementById('root'));
```

## Features

- **Reactive wrapper**: A higher order component to wrap a React component to be a Reactive Component.

## Installation
```
npm install --save react-flyd-class
```

## Usage

### Use Reactive wrapper

Take full control of component lifecycle.

```
reactive(ReactClass): ReactClass
```

Example:

```javascript
import { stream } from 'flyd';
import every from 'flyd/module/every';
import React from 'react';
import ReactDOM from 'react-dom';
import { reactive } from 'react-flyd-class';

class Text extends React.Component {
  componentWillMount() {
    console.log('Text will mount.');
  }
  render() {
    console.log('Text rendered.');

    return (
      <div>{this.props.children}</div>
    );
  }
  componentWillUnmount() {
    console.log('Text will unmount.');
  }
}

const ReactiveText = reactive(Text);


const currentTime$ = every(1000)
  .map((t) => new Date(t).toLocaleString());

ReactDOM.render(
  <ReactiveText>{ currentTime$ }</ReactiveText>,
  document.getElementById('root')
);
```

### Mount/unmount Reactive Component

You can use `mount` attribute to mount/unmount a component.

```javascript
// Unmount this component if length of incoming text is 0.
<Span mount={ text$.map(text => text.length) }>
  {text$}
</Span>
```

## Child component constraint
Source must be the only child when using observable as child component.
```javascript
// This will not work
<Span>
  Hello {name$}, how are you?
</Span>

// This will work
<span>
  Hello <Span>{name$}</Span>, how are you?
</span>
```

## Feedbacks are welcome!
Feel free to ask questions or submit pull requests!

## License
The MIT License (MIT)
