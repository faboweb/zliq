import { diff, createNode, render } from "../../src";

export function testRender(
  vdom$,
  schedule,
  done,
  options = {
    attach: false,
    debounce: 0,
    globals: {}
  }
) {
  let container = document.createElement("div");
  if (options.attach) {
    document.body.appendChild(container);
  }
  // enable to just define the expected html in the render schedule
  schedule = schedule.map(fn => {
    if (typeof fn === "string") {
      return ({ element }) => expect(element.outerHTML).toBe(fn);
    }
    return fn;
  });
  return test$(
    render(vdom$, container, options.globals, options.debounce),
    schedule,
    done
  );
}

export function test$(stream, schedule, done) {
  return stream.schedule(
    schedule.map(iteration => value =>
      testIteration(iteration, value).then(done, done.fail)
    ),
    done
  );
}

function testIteration(iteration, value, done) {
  return new Promise((resolve, reject) => {
    // tests produce async behaviour often syncronous
    // this can cause race effects on stream declarations
    // here the iterations are made asynchronous to prevent this
    setTimeout(function() {
      try {
        if (typeof iteration === "function") {
          iteration(value);
        } else {
          expect(value).toEqual(iteration);
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}
