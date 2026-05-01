"use client";

import { useMemo, useState } from "react";

const samplePayload = `{
  "id": "evt_01HXTOOLS",
  "event": "payment.success",
  "created_at": "2026-05-01T09:00:00+09:00",
  "data": {
    "customer_id": "cus_123",
    "amount": 49000,
    "currency": "KRW"
  },
  "signature": "sha256=example"
}`;

type FieldHit = { path: string; value: string };

type PayloadResult =
  | { ok: true; formatted: string; interesting: FieldHit[]; size: number; topLevelKeys: string[] }
  | { ok: false; error: string };

function flattenJson(value: unknown, prefix = ""): FieldHit[] {
  if (value === null || typeof value !== "object") {
    return [{ path: prefix || "root", value: String(value) }];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => flattenJson(item, `${prefix}[${index}]`));
  }
  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
    flattenJson(child, prefix ? `${prefix}.${key}` : key),
  );
}

function findInterestingFields(value: unknown): FieldHit[] {
  const flattened = flattenJson(value);
  const patterns = [/event/i, /type/i, /id$/i, /created/i, /time/i, /timestamp/i, /signature/i, /amount/i, /currency/i];
  return flattened.filter((field) => patterns.some((pattern) => pattern.test(field.path))).slice(0, 12);
}

export default function WebhookPayloadFormatter() {
  const [payload, setPayload] = useState(samplePayload);

  const result = useMemo<PayloadResult>(() => {
    try {
      const parsed = JSON.parse(payload);
      const formatted = JSON.stringify(parsed, null, 2);
      const interesting = findInterestingFields(parsed);
      return {
        ok: true,
        formatted,
        interesting,
        size: new Blob([payload]).size,
        topLevelKeys: parsed && typeof parsed === "object" && !Array.isArray(parsed) ? Object.keys(parsed as Record<string, unknown>) : [],
      };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : "Unknown JSON parse error" };
    }
  }, [payload]);

  return (
    <div className="space-y-4">
      <textarea
        rows={12}
        value={payload}
        onChange={(e) => setPayload(e.target.value)}
        spellCheck={false}
        className="block w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm focus:border-primary focus:outline-none"
      />

      {result.ok ? (
        <>
          <div className="rounded-lg bg-accent p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted">parsed</p>
            <strong className="mt-1 block">Valid webhook JSON</strong>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Payload size</span>
                <strong>{result.size.toLocaleString()} bytes</strong>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Top-level keys</span>
                <strong>{result.topLevelKeys.length ? result.topLevelKeys.join(", ") : "n/a"}</strong>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted">debug fields</p>
            <strong className="mt-1 block text-sm">Fields to inspect first</strong>
            {result.interesting.length ? (
              <div className="mt-2 space-y-1">
                {result.interesting.map((field) => (
                  <div className="flex items-center justify-between text-sm" key={`${field.path}-${field.value}`}>
                    <span className="text-muted">{field.path}</span>
                    <code className="text-xs">{field.value}</code>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-1 text-sm text-muted">No event, id, timestamp, amount, currency, or signature fields were detected.</p>
            )}
          </div>

          <div className="rounded-lg border border-border">
            <div className="flex items-center justify-between border-b border-border px-4 py-2 text-sm">
              <span>Formatted payload</span>
              <span className="text-muted">JSON</span>
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-sm">{result.formatted}</pre>
          </div>
        </>
      ) : (
        <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-950/30">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">invalid</p>
          <strong className="mt-1 block">Payload is not valid JSON</strong>
          <p className="mt-1 text-sm text-muted">{result.error}</p>
          <p className="mt-2 text-xs text-muted">Most webhook bodies are JSON. Check trailing commas, quotes, and copied log prefixes.</p>
        </div>
      )}
    </div>
  );
}
