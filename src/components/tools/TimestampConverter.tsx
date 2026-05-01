"use client";

import { useMemo, useState } from "react";

function parseTimestamp(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (/^\d{13}$/.test(trimmed)) return new Date(Number(trimmed));
  if (/^\d{10}$/.test(trimmed)) return new Date(Number(trimmed) * 1000);
  const numeric = Number(trimmed);
  if (Number.isFinite(numeric) && numeric > 0) return new Date(numeric > 9_999_999_999 ? numeric : numeric * 1000);
  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatInZone(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "medium",
    hour12: false,
    timeZone,
  }).format(date);
}

export default function TimestampConverter() {
  const [input, setInput] = useState("1735689600");
  const parsed = useMemo(() => parseTimestamp(input), [input]);

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium">Unix timestamp or readable date</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm focus:border-primary focus:outline-none"
        />
      </label>

      {parsed ? (
        <>
          <output className="block rounded-lg bg-accent p-4">
            <strong className="block text-xl">{Math.floor(parsed.getTime() / 1000).toLocaleString()}</strong>
            <span className="text-sm text-muted">Unix seconds</span>
          </output>
          <div className="space-y-1.5">
            {[
              ["Unix milliseconds", parsed.getTime().toLocaleString()],
              ["UTC", formatInZone(parsed, "UTC")],
              ["KST", formatInZone(parsed, "Asia/Seoul")],
              ["Local", formatInZone(parsed, Intl.DateTimeFormat().resolvedOptions().timeZone)],
              ["ISO", parsed.toISOString()],
            ].map(([label, val]) => (
              <div key={label} className="flex items-center justify-between rounded-lg border border-border px-4 py-2">
                <span className="text-sm text-muted">{label}</span>
                <strong className="text-sm">{val}</strong>
              </div>
            ))}
          </div>
        </>
      ) : (
        <output className="block rounded-lg bg-accent p-4 text-sm text-muted">
          Enter Unix seconds, Unix milliseconds, or a date string such as 2026-05-01T09:00:00+09:00.
        </output>
      )}

      <p className="text-xs text-muted">Ten-digit values are usually Unix seconds. Thirteen-digit values are usually Unix milliseconds.</p>
    </div>
  );
}
