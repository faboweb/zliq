import { h, stream, promise$, if$, merge$, join$, is$ } from "../src";
import assert from "assert";

describe("Helpers", () => {
  describe("if$", () => {
    it("should switch on boolean streams", done => {
      let result$ = stream(false);
      let call = 0;
      if$(result$, "True", "False").map(output => {
        if (call === 0) {
          assert.equal(output, "False");
          done();
        }
        if (call === 1) {
          assert.equal(output, "True");
          result$(true);
        }
        call++;
      });
    });
    it("should switch on empty streams", done => {
      let result$ = stream(null);
      let call = 0;
      if$(result$, "True", "False").map(output => {
        if (call === 0) {
          assert.equal(output, "False");
          done();
        }
        if (call === 1) {
          assert.equal(output, "True");
          result$({ param: "value" });
        }
        call++;
      });
    });
    it("should also allow undefined and boolean as input", () => {
      expect(if$(null, true, false).value).toBe(false);
      expect(if$(true, true, false).value).toBe(true);
      expect(if$({ x: 1 }, true, false).value).toBe(true);
    });
  });

  describe("join$", () => {
    it("should join string", done => {
      join$("a", "b").map(x => {
        assert.equal(x, "a b");
        done();
      });
    });
    it("should join mixed content", done => {
      join$("a", stream("b")).map(x => {
        assert.equal(x, "a b");
        done();
      });
    });
  });
});
