import { resolveTag } from "../src";

describe("Hyperscript", () => {
  it("should resolve tag", () => {
    expect(resolveTag("tag-x")).toEqual({
      tag: "tag-x",
      classes: [],
      id: undefined
    });

    expect(resolveTag("tag")).toEqual({
      tag: "tag",
      classes: [],
      id: undefined
    });

    expect(resolveTag("tag_2")).toEqual({
      tag: "tag_2",
      classes: [],
      id: undefined
    });

    expect(resolveTag("tag_2-x")).toEqual({
      tag: "tag_2-x",
      classes: [],
      id: undefined
    });
  });

  it("should resolve classes", () => {
    expect(resolveTag("tag.class1.class-2.class_3-a")).toEqual({
      tag: "tag",
      classes: ["class1", "class-2", "class_3-a"],
      id: undefined
    });
  });

  it("should resolve an id", () => {
    expect(resolveTag("tag#id")).toEqual({
      tag: "tag",
      classes: [],
      id: "id"
    });
  });

  it("should resolve an id and classes", () => {
    expect(resolveTag("tag.class1.class-2.class_3-a#id")).toEqual({
      tag: "tag",
      classes: ["class1", "class-2", "class_3-a"],
      id: "id"
    });
  });

  it("should fail if two ids are set", () => {
    expect(resolveTag.bind(null, "tag#id1#id2")).toThrow();
  });

  it("should set div as default tag", () => {
    expect(resolveTag(".class1#id")).toEqual({
      tag: "div",
      classes: ["class1"],
      id: "id"
    });
  });
});
