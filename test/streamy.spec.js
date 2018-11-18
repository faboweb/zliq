import { h, stream, merge$, if$, REMOVED } from "../src";
import { test$ } from "./helpers/test-component.js";

describe("Streamy", () => {
  it("should trigger listeners on initial value", done => {
    const myMock = jest.fn();
    let myStream = stream({ test: 1 });
    myStream.map(myMock);
    myStream.flatMap(value => stream(value).map(myMock));
    myStream.filter(myMock);
    myStream.deepSelect("test").map(myMock);
    // myStream.distinct().map(myMock);
    myStream.reduce(myMock, null);
    merge$([myStream]).map(myMock);
    myStream.map(() => {
      expect(myMock.mock.calls.length).toBe(6);
      done();
    });
  });

  it("shouldnt trigger listeners on undefined", done => {
    const myMock = jest.fn();
    let myStream = stream();
    myStream.map(myMock);
    myStream.flatMap(value => stream(value).map(myMock));
    myStream.filter(myMock);
    myStream.deepSelect("test").map(myMock);
    // myStream.distinct().map(myMock);
    myStream.reduce(myMock, null);
    merge$([myStream]).map(myMock);
    merge$([myStream, stream()]).map(myMock);

    expect(myMock.mock.calls.length).toBe(0);
    myStream.map(() => {
      expect(myMock.mock.calls.length).toBe(7);
      done();
    });
    myStream({ test: 1 });
  });

  it("shouldnt trigger listeners for negative .until triggers", () => {
    const myMock = jest.fn();
    let myStream = stream("HALLO");
    let myTrigger = stream();
    myStream.until(myTrigger).map(myMock);
    expect(myStream.listeners.length).toBe(1);
    expect(myMock.mock.calls.length).toBe(1);
    myTrigger(true);
    expect(myStream.listeners.length).toBe(0);
    myStream("WORLD");
    expect(myMock.mock.calls.length).toBe(1);
    myTrigger(false);
    expect(myStream.listeners.length).toBe(1);
    expect(myMock.mock.calls.length).toBe(2);
    myStream("BYE");
    expect(myMock.mock.calls.length).toBe(3);

    myTrigger = stream(true);
    myStream = stream("HALLO");
    let newMock = jest.fn();
    myStream.until(myTrigger).map(newMock);
    expect(myStream.listeners.length).toBe(0);
    expect(newMock.mock.calls.length).toBe(0);
  });

  it("should execute the schedule", done => {
    let myStream = stream(1);
    let schedule$ = myStream.schedule([() => "ONE", "TWO"]);
    test$(schedule$, ["ONE", "TWO"], done);
    myStream(2);
  });

  it("should trigger the flatMap on child update", done => {
    let myStream = stream("HALLO");
    let secondStream = stream("MARK");
    let flatMap$ = myStream.flatMap(x => {
      return secondStream.map(y => x + " YOU " + y);
    });
    test$(
      flatMap$,
      ["HALLO YOU MARK", "BYE YOU MARK", "BYE YOU FABO"],
      done
    ).schedule([() => myStream("BYE"), () => secondStream("FABO"), null]);
  });

  it("should trigger only on distinct values", done => {
    let myStream = stream("HALLO");
    test$(myStream.distinct(), ["HALLO", "HOMEY"], done);
    myStream("HALLO")("HOMEY");
  });

  it("should filter the stream", done => {
    let myStream = stream("HALLO");
    test$(myStream.filter(x => x.startsWith("H")), ["HALLO", "HOMEY"], done);
    myStream("BYE")("HOMEY");
  });

  it("should log the stream", done => {
    console.log = jest.fn();
    let myStream = stream("HALLO");
    test$(
      myStream.log(),
      [
        x => {
          expect(x).toBe("HALLO");
          expect(console.log).toHaveBeenCalledWith("Stream:", "HALLO");
        }
      ],
      done
    );
  });

  describe("is-operator", () => {
    it("should emit true if value is matched", done => {
      stream("foo")
        .is("foo")
        .map(x => {
          expect(x).toBe(true);
          done();
        });
    });
    it("should emit false if value is not matched", done => {
      stream("foo")
        .is("bar")
        .map(x => {
          expect(x).toBe(false);
          done();
        });
    });
  });

  it("should patch an object", done => {
    let myStream = stream();
    test$(
      myStream,
      [{ foo: { bar: 123 } }, { foo: { bar: 345 } }, null, { x: 1 }],
      done
    );
    myStream
      .patch({ foo: { bar: 123 } })
      .patch({ foo: { bar: 345 } })
      .patch(null)
      .patch({ x: 1 });
  });

  it("should deep query an object", done => {
    let myStream = stream();
    test$(myStream.query("foo.bar"), [123, null, null], done);
    myStream({ foo: { bar: 123 } })(null)({});
  });

  it("should query several propertys", done => {
    let myStream = stream();
    test$(
      myStream.query(["foo.bar", "foo.to", "foo"]),
      [
        [123, 456, { bar: 123, to: 456 }],
        [null, null, null],
        [null, null, null]
      ],
      done
    );
    myStream({ foo: { bar: 123, to: 456 } })(null)({});
  });

  it("should notify on new values", done => {
    let myStream = stream();
    test$(myStream.$("foo.bar"), [123, null, "abc"], done);
    myStream({ foo: { bar: 123 } })(null)({})({ foo: { bar: "abc" } });
  });

  it("should emit aggregates on reduce", done => {
    let myStream = stream();
    let agg$ = myStream.reduce((agg, cur) => {
      return agg + cur;
    }, 0);
    test$(agg$, [1, 3], done);
    myStream(1)(2);
  });

  it("should debounce values", done => {
    let myStream = stream();
    const myMock = jest.fn();
    let debounced$ = myStream.debounce(50);
    test$(debounced$, [1], done);
    myStream(3)(2)(1);
  });
});
