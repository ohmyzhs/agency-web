import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildTypingSurfaceParts } from "./surface-render";

function rendered(target: string, typed: string): string {
  return buildTypingSurfaceParts(target, typed, false).parts.map((part) => part.text).join("");
}

describe("buildTypingSurfaceParts", () => {
  it("renders Hangul syllable progress as composed syllable cells", () => {
    const target = "안녕";
    assert.equal(rendered(target, "ㅇ"), "ㅇ녕");
    assert.equal(rendered(target, "아"), "아녕");
    assert.equal(rendered(target, "안"), "안녕");
    assert.equal(rendered(target, "안ㄴ"), "안ㄴ");
    assert.equal(rendered(target, "안녀"), "안녀");
    assert.equal(rendered(target, "안녕"), "안녕");
  });
});
