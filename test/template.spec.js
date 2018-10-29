import { zx, stream } from "../src";
import { testRender, test$ } from "./helpers/test-component";

describe("Template", () => {
  it("should resolve a template", done => {
    testRender(zx`<div>HALLO WORLD</div>`, [`<div>HALLO WORLD</div>`], done);
  });

  let DoubleClicks = ({ clicks$ }) => zx`
    <p>Clicks times 2: ${clicks$.map(clicks => 2 * clicks)}</p>
  `;
  it("should allow sub components", done => {
    let clicks$ = stream(3);
    let component = zx`${DoubleClicks({ clicks$ })}`;
    testRender(
      component,
      [
        ({ element }) =>
          expect(element.outerHTML).toBe("<p>Clicks times 2: 6</p>")
      ],
      done
    );
  });

  it("should allow interactive sub components", done => {
    let clicks$ = stream(3);
    let component = zx`${DoubleClicks({ clicks$ })}`;
    testRender(
      component,
      [
        ({ element }) => {
          expect(element.outerHTML).toBe("<p>Clicks times 2: 6</p>");
          clicks$(6);
        },
        ({ element }) =>
          expect(element.outerHTML).toBe("<p>Clicks times 2: 12</p>")
      ],
      done
    );
  });

  it("should set the class", done => {
    let class$ = stream("x");
    let app = zx`<div class="${class$}"></div>`;
    testRender(
      app,
      [
        ({ element }) => {
          expect(element.classList).toContain("x");
          class$(null);
        },
        ({ element }) => {
          expect(element.classList).not.toContain("x");
        }
      ],
      done
    );
  });

  it("should allow templates in streams", done => {
    const Component = () => stream(zx`<p>Hello World</p>`);
    const app = zx`
      <div>${Component()}</div>
    `;
    testRender(app, ["<div><p>Hello World</p></div>"], done);
  });

  xit("should allow arrays of elements in templates", done => {
    const Component = zx`<p>Hello</p><p>World</p>`;
    console.log(Component);
    const app = zx`
      <div>
        ${Component}
      </div>
    `;
    testRender(app, ["<div><p>Hello</p><p>World</p></div>"], done);
  });

  it("should allow simple components that just receive resolved props", done => {
    const Component = (props, children, globals) => zx`
      <div>${props.hello} ${globals.bye}</div>
    `;
    const app = (props, children, globals) => zx`
      <div>${Component({ hello: "world" }, [], globals)}</div>
    `;
    testRender(app, ["<div><div>world cu</div></div>"], done, {
      globals: {
        bye: "cu"
      }
    });
  });

  it("should set style in different ways", done => {
    let style$ = stream("width: 100px;");
    const app = zx`<div style=${style$}></div>`;
    testRender(
      app,
      [
        ({ element }) => {
          expect(element.style.width).toBe("100px");
          style$({ height: "200px" });
        },
        ({ element }) => {
          expect(element.style.width).toBe("");
          expect(element.style.height).toBe("200px");
          style$(null);
        },
        ({ element }) => {
          expect(element.style.width).toBe("");
          expect(element.style.height).toBe("");
        }
      ],
      done
    );
  });

  it("should react to attached events", done => {
    // input streams are scoped to be able to remove the listener if the element gets removed
    // this means you can not manipulate the stream from the inside to the outside but need to use a callback function
    let DumbComponent = ({ clicks$, onclick }) => zx`
      <div>
        <button onclick=${() => onclick(clicks$() + 1)}>
          Click to emit event
        </button>
      </div>
    `;
    let clicks$ = stream(0);
    testRender(
      DumbComponent({ clicks$, onclick: x => clicks$(x) }),
      [
        // perform the actions on the element
        ({ element }) => {
          element.querySelector("button").click();
          expect(clicks$()).toBe(1);
        }
      ],
      done
    );
  });

  it("should update lists correctly", done => {
    var arr = [];
    var length = 3;
    for (let i = 0; i < length; i++) {
      arr.push({ name: i });
    }
    let list$ = stream(arr);
    let listElems$ = list$.map(arr => arr.map(x => zx`<li>${x.name}</li>`));
    let component = zx`<ul>${listElems$}</ul>`;

    testRender(
      component,
      [
        ({ element }) => {
          expect(element.querySelectorAll("li").length).toBe(3);
          expect(element.querySelectorAll("li")[2].innerHTML).toBe("2");
          let newArr = arr.slice(1);
          list$(newArr);
        },
        ({ element }) => {
          expect(element.querySelectorAll("li").length).toBe(2);
          expect(element.querySelectorAll("li")[1].innerHTML).toBe("2");
        }
      ],
      done
    );
  });
});
