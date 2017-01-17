import { stream, merge, scan } from 'flyd';
import React from 'react';
import ReactDOM from 'react-dom';
// eslint-disable-next-line import/no-unresolved
import { reactive } from 'react-flyd-class';

const Span = reactive('span');

const plusClick$ = stream();
const minusClick$ = stream();

const action$ = merge(
  plusClick$.map(() => 1),
  minusClick$.map(() => -1)
);

const count$ = scan((x, y) => x + y, 0, action$);


class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { normalState: false };
  }

  render() {
    const { normalState } = this.state;

    return (
      <div>
        <div>
          <button id="plus" onClick={(e) => plusClick$(e)}>+</button>
          <button id="minus" onClick={(e) => minusClick$(e)}>-</button>
        </div>
        <div>
          Count:
          <Span
            mount={count$.map(x => x < 10)}
            style={{ color: normalState ? 'red' : 'blue' }}
          >
            <span>This is the count </span>
            {count$}
            <span> Cool coount, right?</span>
          </Span>
          <button
            onClick={() => this.setState({ normalState: !normalState })}
          >
            Toggle State
          </button>
          <Span>
            <br />
            {count$.map(x => 10 - x)}
            <span> away from disappearing</span>
          </Span>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Counter />, document.getElementById('mount'));
