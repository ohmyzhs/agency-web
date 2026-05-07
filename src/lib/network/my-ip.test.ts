import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { pickClientIpFromHeaders } from "./my-ip";

function headers(values: Record<string, string>): Headers {
  return new Headers(values);
}

describe("pickClientIpFromHeaders", () => {
  it("prefers trusted proxy headers over outbound server lookup results", () => {
    const result = pickClientIpFromHeaders(
      headers({
        "x-forwarded-for": "61.82.99.181, 10.0.0.12",
      }),
    );

    assert.deepEqual(result, {
      ip: "61.82.99.181",
      source: "x-forwarded-for",
    });
  });

  it("parses the standardized Forwarded header", () => {
    const result = pickClientIpFromHeaders(
      headers({
        forwarded: "for=\"[2001:4860:4860::8888]\";proto=https, for=10.0.0.12",
      }),
    );

    assert.deepEqual(result, {
      ip: "2001:4860:4860::8888",
      source: "forwarded",
    });
  });

  it("skips private or loopback proxy hops", () => {
    const result = pickClientIpFromHeaders(
      headers({
        "x-forwarded-for": "127.0.0.1, 192.168.0.15, 61.82.99.181",
      }),
    );

    assert.deepEqual(result, {
      ip: "61.82.99.181",
      source: "x-forwarded-for",
    });
  });
});
