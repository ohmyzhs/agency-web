import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { countCorrectJamo } from "./jamo-count.ts";
import { keyHintForChar } from "./korean-keyboard.ts";

describe("mixed Korean prompts with Latin acronyms", () => {
  it("counts lowercase input as correct for uppercase Latin target text", () => {
    assert.deepEqual(countCorrectJamo("AI 기술", "ai"), {
      jamoCorrect: 2,
      jamoIncorrect: 0,
      jamoTyped: 2,
    });
  });

  it("shows a keyboard hint for Latin acronym letters without requiring shift", () => {
    const hint = keyHintForChar("A");
    assert.equal(hint?.code, "KeyA");
    assert.equal(hint?.requiredShift, false);
  });
});
