import { render } from "../../src";

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
  schedule = schedule.map(expected => {
    if (typeof expected === "string") {
      return ({ element }) =>
        // we trim line breaks to make outerHTML more like the visible DOM
        expect(trimWhitespaces(element.outerHTML)).toBe(
          trimWhitespaces(expected)
        );
    }
    return expected;
  });
  return test$(
    render(vdom$, container, options.globals, options.debounce),
    schedule,
    done
  );
}

// trims whitespaces between tags and strings
function trimWhitespaces(html) {
  let trimmed = html.replace(/\>(\s*)(.*)(\s*)\</g, ">$2<");
  return trimmed;
}

export function test$(stream, schedule, done) {
  return stream.schedule(
    schedule.map(iteration => async value => {
      await testIteration(iteration, value).catch(done.fail);
      return value;
    }),
    done
  );
}

function testIteration(iteration, value) {
  return new Promise((resolve, reject) => {
    // tests produce async behavior often synchronous
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
