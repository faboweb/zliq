import { render, zx, stream, if$, isStream, join$, Component } from "../src";
import { testRender, test$ } from "./helpers/test-component";
import { setTimeout } from "timers";

// TODO remove hyperscript tests in favor of zx

describe("Components", () => {
  it("should show a component", done => {
    testRender(zx`<p>HELLO WORLD</p>`, ["<p>HELLO WORLD</p>"], done);
  });

  it("should return a constructor function", () => {
    let constructor = zx`<p>HELLO WORLD</p>`;
    expect(constructor).toBeInstanceOf(Component);
  });

  it("should return a virtual dom stream when constructed", () => {
    let component = zx`<p>HELLO WORLD</p>`;
    let vdom$ = component.build({});
    expect(isStream(vdom$)).toBe(true);
    expect(vdom$.value.tag).toBe("p");
    expect(vdom$.value.props).toEqual({});
    expect(vdom$.value.children).toEqual(["HELLO WORLD"]);
  });

  it("should render into a parentElement provided", done => {
    let container = document.createElement("div");
    test$(
      render(zx`<p>HELLO WORLD</p>`, container),
      [
        ({ element }) =>
          expect(container.innerHTML).toEqual("<p>HELLO WORLD</p>")
      ],
      done
    );
  });

  it("should render without a parentElement provided", done => {
    test$(
      render(zx`<p>HELLO WORLD</p>`, null),
      [({ element }) => expect(element.outerHTML).toBe("<p>HELLO WORLD</p>")],
      done
    );
  });

  let DoubleClicks = ({ clicks$ }) => zx`
    <p>Clicks times 2: ${clicks$.map(clicks => 2 * clicks)}</p>
  `;
  it("should react to inputs", done => {
    let clicks$ = stream(3);
    testRender(
      DoubleClicks({ clicks$ }),
      [
        ({ element }) =>
          expect(element.outerHTML).toBe("<p>Clicks times 2: 6</p>")
      ],
      done
    );
  });

  it("CleverComponent should update on input stream update", done => {
    let clicks$ = stream(3);
    testRender(
      DoubleClicks({ clicks$ }),
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

  xit("Components should have access to the provided globals", done => {
    const ShowGlobals = (props, children, globals) => {
      return zx`<p>${globals.value}</p>`;
    };
    let component = zx`<div>
        ${ShowGlobals}
      </div>`;
    testRender(component, ["<div><p>GLOBAL TEXT</p></div>"], done, {
      globals: {
        value: "GLOBAL TEXT"
      }
    });
  });

  it("should update elements with textnodes", done => {
    let trigger$ = stream(true);
    testRender(
      zx`<p>${if$(trigger$, zx`<div />`, "HELLO WORLD")}</p>`,
      ["<p><div></div></p>", "<p>HELLO WORLD</p>"],
      done
    ).schedule([() => trigger$(false), null]);
  });

  it("should set the class", done => {
    let class$ = stream("x");
    let app = zx`<div class=${class$} />`;
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

  it("should resolve nested streams in props", done => {
    let trigger$ = stream(false);
    let style = {
      display: if$(trigger$, "block", "none")
    };
    let app = zx`<div>
        <div style=${style} />
      </div>`;
    testRender(
      app,
      [
        '<div><div style="display: none;"></div></div>',
        '<div><div style="display: block;"></div></div>'
      ],
      done
    );
    setTimeout(() => {
      trigger$(true);
    }, 10);
  });

  it("should allow returning streams from components", done => {
    let Component = () => stream(zx`<p>Hello World</p>`);
    let app = zx`
      <div>
        ${Component()}
      </div>
    `;
    testRender(app, ["<div><p>Hello World</p></div>"], done);
  });

  it("should allow returning arrays of subcomponents from components", done => {
    let Component = () => [zx`<p>Hello</p>`, zx`<p>World</p>`];
    let app = zx`
      <div>
        ${Component()}
      </div>
    `;
    testRender(app, ["<div><p>Hello</p><p>World</p></div>"], done);
  });

  it("should allow simple components that just receive resolved props", done => {
    let component = props =>
      new Component(
        globals => zx`
      <div>
        ${props.hello} ${globals.bye}
      </div>
    `
      );
    let app = zx`
      <div>
        ${component({ hello: "world" })}
      </div>
    `;
    testRender(app, ["<div><div>world cu</div></div>"], done, {
      globals: {
        bye: "cu"
      }
    });
  });

  it("should set style in different ways", done => {
    let style$ = stream("width: 100px;");
    let app = zx`<div style=${style$} />`;
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
      // this component fires a action on the store when clicked
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

  it("should remove attributes on null value", done => {
    let value$ = stream(true);
    let component = zx`<div disabled=${value$} />`;
    testRender(
      component,
      [
        ({ element }) => {
          expect(element.disabled).toBe(true);
          value$(null);
        },
        ({ element }) => {
          expect(element.disabled).toBe(undefined);
        }
      ],
      done
    );
  });

  it("should remove attributes on updates if not available anymore", done => {
    let trigger$ = stream(true);
    let app = zx`
      <div>
        ${if$(
          trigger$,
          zx`<img src="img_girl.jpg" width="500" height="600" />`,
          zx`<img src="img_girl.jpg" height="600" />`
        )}
      </div>
    `;
    testRender(
      app,
      [
        ({ element }) => {
          expect(element.querySelector("img").getAttribute("width")).toBe(
            "500"
          );
          trigger$(false);
        },
        ({ element }) => {
          expect(element.querySelector("img").getAttribute("width")).toBe(null);
        }
      ],
      done
    );
  });

  it("should trigger lifecycle events on nested components", done => {
    const mountedMock = jest.fn();
    const createdMock = jest.fn();
    const removedMock = jest.fn();
    let trigger$ = stream(true);
    let cycle = {
      mounted: mountedMock,
      created: createdMock,
      removed: removedMock
    };
    const component = zx`<div id="test" cycle=${cycle} />`;

    let app = zx`<div>${if$(trigger$, component)}</div>`;

    testRender(
      app,
      [
        () => trigger$(false),
        () => trigger$(true),
        () => {
          expect(mountedMock.mock.calls.length).toBe(2);
          expect(createdMock.mock.calls.length).toBe(1);
          expect(removedMock.mock.calls.length).toBe(1);
        }
      ],
      done
    );
  });

  it("should isolate children from updates", done => {
    let trigger$ = stream(true);
    let app = zx`<div isolated>${if$(
      trigger$,
      "HALLO WORLD",
      "BYE WORLD"
    )}</div>`;
    testRender(
      app,
      ["<div>HALLO WORLD</div>", "<div>HALLO WORLD</div>"],
      done
    ).schedule([
      () => {
        trigger$(false);
      },
      null
    ]);
  });

  it("should increment versions up to the root", done => {
    let content$ = stream("");
    let app = zx`
      <div>
        <div>${content$}</div>
      </div>
    `;
    testRender(
      app,
      [
        ({ element, version }) => {
          expect(version).toBe(0);
          content$("text");
        },
        ({ element, version }) => {
          expect(version).toBe(1);
        }
      ],
      done
    );
  });

  it("should save id elements to reuse them", done => {
    let content$ = stream("");
    let app = zx`
      <div>
        <div id="test">${content$}</div>
      </div>
    `;
    let i;
    testRender(
      app,
      [
        ({ keyContainer }) => {
          expect(keyContainer["test"].element.outerHTML).toMatchSnapshot();
          expect(keyContainer["test"].version).toBe(0);
          content$("text");
        },
        ({ keyContainer }) => {
          expect(keyContainer["test"].element.outerHTML).toMatchSnapshot();
          expect(keyContainer["test"].version).toBe(1);
        }
      ],
      done
    );
  });

  it("should reuse id elements on rerenderings", done => {
    let content$ = stream("");
    let app = zx`
      <div>
        ${content$}
        <div id="test" />
      </div>
    `;
    testRender(
      app,
      [
        ({ element, keyContainer }) => {
          // manipulating the dom to prove update
          element.replaceChild(
            document.createElement("div"),
            keyContainer["test"].element
          );
          // manipulating the stored element
          keyContainer["test"].element.setAttribute("id", "updated");
          content$("text");
        },
        ({ element, keyContainer }) => {
          expect(element.querySelector("#updated")).not.toBe(null);
        }
      ],
      done
    );
  });

  it("should debounce renderings", done => {
    let content$ = stream("");
    let app = zx`<div>${content$}</div>`;
    const myMock = jest.fn();
    testRender(
      app,
      [
        () => {
          setImmediate(() => content$("text"));
          setImmediate(() => content$("text2"));
        },
        () => {
          // render only ran twice for 3 values
        }
      ],
      done,
      {
        debounce: 50
      }
    );
  });

  it("should replace idd elements again", done => {
    let trigger$ = stream(false);
    let app = zx`
      <div>
        <img />
        ${if$(
          trigger$,
          zx`<i id="x" />`,
          zx`<div>
            <div />
          </div>`
        )}
      </div>
    `;

    testRender(
      app,
      [
        ({ element }) => {
          expect(element.querySelector("#x")).toBeNull();
        },
        ({ element }) => {
          expect(element.querySelector("#x")).not.toBeNull();
        },
        ({ element }) => {
          expect(element.querySelector("#x")).toBeNull();
        }
      ],
      done
    ).schedule([() => trigger$(true), () => trigger$(false), null]);
  });

  it("should print a warning if the child nodes have been removed/added outside of zliq", done => {
    let trigger$ = stream(false);
    let app = zx`
      <div>
        <div id="remove"></div>
        <div id="stays"></div>
        ${if$(trigger$, zx`<div id="added"></div>`)}
      </div>
    `;
    let spy = jest.spyOn(global.console, "warn");

    testRender(
      app,
      [
        ({ element }) => {
          console.log(element.outerHTML);
          element.querySelector("#remove").remove();
        },
        ({ element }) => {
          expect(spy).toHaveBeenCalled();
          element.appendChild(document.createElement("div"));
        },
        () => {}
      ],
      done
    ).schedule([() => trigger$(true), () => trigger$(false), null]);
  });

  it("should resolve in streams nested elements with streams", done => {
    let trigger$ = stream(false);
    let trigger2$ = stream(false);
    let app = zx`
      <div>${if$(
        trigger$,
        zx`<div class=${join$(if$(trigger2$, "bold"))} />`
      )}</div>
    `;
    testRender(
      app,
      [
        "<div></div>",
        '<div><div class=""></div></div>',
        '<div><div class="bold"></div></div>'
      ],
      done
    ).schedule([() => trigger$(true), () => trigger2$(true), null]);
  });
});
