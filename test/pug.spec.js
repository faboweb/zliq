import {
  render,
  h,
  stream,
  if$,
  merge$,
  initRouter,
  CHILDREN_CHANGED,
  ADDED,
  REMOVED,
  UPDATED,
  isStream,
  join$
} from "../src";
import { testRender, test$ } from "./helpers/test-component";
import assert from "assert";
import { setTimeout } from "timers";
import { pug } from "../src/utils/zliq-pug.js";

describe("Zliq-Pug", () => {
  it("should create vdom from pug", done => {
    test$(
      pug`p HELLO WORLD`({}, [], {}),
      [
        {
          tag: "p",
          props: {},
          children: [
            { tag: "#text", props: {}, children: ["HELLO WORLD"], version: 0 }
          ],
          version: 0
        }
      ],
      done
    );
  });

  it("should render multiple classes", done => {
    test$(
      pug`.class1.class2`({}, [], {}),
      [
        {
          tag: "div",
          props: { class: "class1 class2" },
          children: [],
          version: 0
        }
      ],
      done
    );
  });

  it("should allow attribtues", () => {
    // rendered templates return a stream
    expect(pug`p(data='foo')`({}, [], {}).value).toEqual({
      tag: "p",
      props: { data: "foo" },
      children: [],
      version: 0
    });

    expect(pug`p(data="1")`({}, [], {}).value).toEqual({
      tag: "p",
      props: { data: "1" },
      children: [],
      version: 0
    });
  });

  it("should use props", () => {
    expect(pug`p(data=foo)`({ foo: "abc" }).value).toEqual({
      tag: "p",
      props: { data: "abc" },
      children: [],
      version: 0
    });
  });

  it("should use globals", () => {
    expect(pug`p(data=globals.foo)`({}, [], { foo: "abc" }).value).toEqual({
      tag: "p",
      props: { data: "abc" },
      children: [],
      version: 0
    });
  });

  it("should render children", () => {
    expect(
      pug`p
  children
      `({}, [{ tag: "span" }]).value
    ).toEqual({
      tag: "p",
      props: {},
      children: [{ tag: "span" }],
      version: 0
    });
  });

  it("should show a component", done => {
    testRender(pug`p HELLO WORLD`, ["<p>HELLO WORLD</p>"], done);
  });

  it("should allow iteration", done => {
    testRender(
      pug`ul
  each val in [1, 2, 3, 4, 5]
    li= val`,
      [`<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ul>`],
      done
    );
  });

  it("should allow iteration with index", done => {
    testRender(
      pug`ul
  each val, index in [1, 2, 3, 4, 5]
    li= index + 1`,
      [`<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ul>`],
      done
    );
  });

  it("should allow conditions", () => {
    expect(
      pug`if condition
  p Hello
else
  p World`({ condition: true }).value
    ).toEqual({
      tag: "p",
      children: [
        {
          children: ["Hello"],
          props: {},
          tag: "#text",
          version: 0
        }
      ],
      props: {},
      version: 0
    });
    expect(
      pug`if condition
  p Hello
else
  p World`({ condition: false }).value
    ).toEqual({
      tag: "p",
      children: [
        {
          children: ["World"],
          props: {},
          tag: "#text",
          version: 0
        }
      ],
      props: {},
      version: 0
    });
  });

  it("should allow usage of components", done => {
    let Component = () => pug`p Hello`;
    testRender(
      pug({ Component })`
    div
      Component
  `,
      ["<div><p>Hello</p></div>"],
      done
    );
  });

  it("should allow stream as variables", done => {
    let condition$ = stream(true);
    testRender(
      pug`if globals.condition$
  p Hello
else
  p World`,
      ["<p>Hello</p>", "<p>World</p>"],
      done,
      { globals: { condition$ } }
    ).schedule([() => condition$(false)]);
  });
});
