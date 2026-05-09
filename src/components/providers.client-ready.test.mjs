import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/providers.tsx", "utf8");

test("AppProvider exposes client context after hydration", () => {
  assert.match(
    source,
    /const getMountedClient = \(\) => false/,
    "the external-store client snapshot must start false so hydration sees a server-compatible snapshot",
  );
  assert.match(
    source,
    /useEffect\(\(\) => \{[\S\s]*queueMicrotask\(\(\) => setMounted\(true\)\);[\S\s]*\}, \[\]\);/,
    "the provider should flip to mounted in an effect after hydration",
  );
});
