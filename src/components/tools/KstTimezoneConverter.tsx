"use client";

import { useMemo, useState } from "react";

const zones = [
  { label: "UTC", timeZone: "UTC" },
  { label: "Seoul", timeZone: "Asia/Seoul" },
  { label: "Tokyo", timeZone: "Asia/Tokyo" },
  { label: "Singapore", timeZone: "Asia/Singapore" },
  { label: "London", timeZone: "Europe/London" },
  { label: "New York", timeZone: "America/New_York" },
  { label: "Los Angeles", timeZone: "America/Los_Angeles" },
];

export default function KstTimezoneConverter() {
  const [datetime, setDatetime] = useState("2026-05-01T09:00");

  const converted = useMemo(() => {
    const date = new Date(`${datetime}:00+09:00`);
    if (Number.isNaN(date.getTime())) return [];

    return zones.map((zone) => ({
      ...zone,
      value: new Intl.DateTimeFormat("en-US", {
        timeZone: zone.timeZone,
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date),
    }));
  }, [datetime]);

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium">KST date and time</span>
        <input
          type="datetime-local"
          value={datetime}
          onChange={(e) => setDatetime(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </label>

      <div className="space-y-2">
        {converted.length === 0 ? (
          <output className="block rounded-lg bg-accent p-4 text-sm text-muted">
            Enter a valid KST date and time.
          </output>
        ) : (
          converted.map((zone) => (
            <div key={zone.timeZone} className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5">
              <span className="text-sm text-muted">{zone.label}</span>
              <strong className="text-sm">{zone.value}</strong>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
