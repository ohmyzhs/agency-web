"use client";

import { useMemo, useState } from "react";

const presets = ["0 9 * * *", "*/15 * * * *", "30 18 * * 1-5", "0 0 1 * *", "0 */6 * * *"];

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

type CronExplanation = { ok: boolean; summary: string; parts: string[]; warnings: string[] };

function explainField(field: string, label: string, min: number, max: number, names?: string[]): string {
  if (field === "*") return `${label}: every allowed value`;
  if (field.startsWith("*/")) return `${label}: every ${field.slice(2)} units`;
  if (field.includes(",")) return `${label}: at ${field.split(",").map((item) => explainToken(item, names)).join(", ")}`;
  if (field.includes("-")) {
    const [start, end] = field.split("-");
    return `${label}: from ${explainToken(start, names)} through ${explainToken(end, names)}`;
  }
  if (/^\d+$/.test(field)) {
    const numeric = Number(field);
    if (numeric < min || numeric > max) return `${label}: ${field} (outside usual ${min}-${max} range)`;
    return `${label}: ${explainToken(field, names)}`;
  }
  return `${label}: ${field}`;
}

function explainToken(token: string, names?: string[]): string {
  const numeric = Number(token);
  if (names && Number.isInteger(numeric) && names[numeric]) return names[numeric];
  if (names && Number.isInteger(numeric) && names[numeric - 1]) return names[numeric - 1];
  return token;
}

function buildSummary(minute: string, hour: string, dayOfMonth: string, month: string, dayOfWeek: string): string {
  const time = minute !== "*" && hour !== "*" && /^\d+$/.test(minute) && /^\d+$/.test(hour)
    ? `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`
    : null;

  if (time && dayOfMonth === "*" && month === "*" && dayOfWeek === "*") return `Every day at ${time}.`;
  if (time && dayOfMonth === "*" && month === "*" && dayOfWeek !== "*") return `At ${time} on selected weekdays (${dayOfWeek}).`;
  if (minute.startsWith("*/") && hour === "*" && dayOfMonth === "*" && month === "*" && dayOfWeek === "*") return `Every ${minute.slice(2)} minutes.`;
  if (minute === "0" && hour.startsWith("*/")) return `Every ${hour.slice(2)} hours on the hour.`;
  if (time && dayOfMonth !== "*" && month === "*" && dayOfWeek === "*") return `At ${time} on day ${dayOfMonth} of each month.`;
  return "Custom schedule. Review each field below before using it in production.";
}

function explainCron(expression: string): CronExplanation {
  const fields = expression.trim().split(/\s+/).filter(Boolean);
  if (fields.length !== 5) {
    return {
      ok: false,
      summary: "Use a traditional five-field cron expression: minute hour day-of-month month day-of-week.",
      parts: [],
      warnings: fields.length === 6 ? ["This looks like a six-field cron with seconds. Remove the seconds field for traditional cron."] : [],
    };
  }

  const [minute, hour, dayOfMonth, month, dayOfWeek] = fields;
  const warnings: string[] = [];
  if (dayOfMonth !== "*" && dayOfWeek !== "*") {
    warnings.push("Both day-of-month and day-of-week are restricted. Different cron implementations may treat that combination differently.");
  }

  return {
    ok: true,
    summary: buildSummary(minute, hour, dayOfMonth, month, dayOfWeek),
    parts: [
      explainField(minute, "Minute", 0, 59),
      explainField(hour, "Hour", 0, 23),
      explainField(dayOfMonth, "Day of month", 1, 31),
      explainField(month, "Month", 1, 12, monthNames),
      explainField(dayOfWeek, "Day of week", 0, 7, dayNames),
    ],
    warnings,
  };
}

export default function CronExplainer() {
  const [expression, setExpression] = useState("0 9 * * *");
  const explanation = useMemo(() => explainCron(expression), [expression]);

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium">Cron expression</span>
        <input
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          spellCheck={false}
          className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm focus:border-primary focus:outline-none"
        />
      </label>
      <div className="flex flex-wrap gap-1.5">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setExpression(preset)}
            className="rounded-md bg-card px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:bg-accent hover:text-foreground"
          >
            {preset}
          </button>
        ))}
      </div>

      <div className={`rounded-lg p-4 ${explanation.ok ? "bg-accent" : "bg-yellow-50 dark:bg-yellow-950/30"}`}>
        <p className="text-xs font-medium uppercase tracking-wider text-muted">schedule</p>
        <strong className="mt-1 block">{explanation.summary}</strong>
        {explanation.parts.length > 0 && (
          <ul className="mt-2 space-y-1 text-sm text-muted">
            {explanation.parts.map((part) => (
              <li key={part}>{part}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-lg border border-border p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">ops notes</p>
        <strong className="mt-1 block text-sm">Before deploying</strong>
        <ul className="mt-2 space-y-1 text-sm text-muted">
          <li>Confirm the scheduler timezone. Server cron often uses the machine timezone, not the user&apos;s local timezone.</li>
          <li>Use the KST timezone converter when Korea-facing delivery time matters.</li>
          {explanation.warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
