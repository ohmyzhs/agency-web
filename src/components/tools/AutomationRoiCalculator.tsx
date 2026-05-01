"use client";

import { useMemo, useState } from "react";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const inputClass = "mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none";

function parseNumber(value: string) {
  const parsed = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export default function AutomationRoiCalculator() {
  const [hoursSaved, setHoursSaved] = useState("2");
  const [runsPerMonth, setRunsPerMonth] = useState("20");
  const [hourlyValue, setHourlyValue] = useState("45");
  const [buildCost, setBuildCost] = useState("2500");
  const [monthlyMaintenance, setMonthlyMaintenance] = useState("150");
  const [failureBuffer, setFailureBuffer] = useState("10");

  const roi = useMemo(() => {
    const saved = parseNumber(hoursSaved);
    const runs = parseNumber(runsPerMonth);
    const value = parseNumber(hourlyValue);
    const build = parseNumber(buildCost);
    const maintenance = parseNumber(monthlyMaintenance);
    const buffer = parseNumber(failureBuffer);

    if (saved === null || runs === null || value === null || build === null || maintenance === null || buffer === null || buffer > 100) {
      return null;
    }

    const grossMonthlyValue = saved * runs * value;
    const bufferCost = grossMonthlyValue * (buffer / 100);
    const netMonthlyValue = grossMonthlyValue - maintenance - bufferCost;
    const paybackMonths = netMonthlyValue > 0 ? build / netMonthlyValue : null;
    const firstYearNet = netMonthlyValue * 12 - build;
    const firstYearRoi = build > 0 ? (firstYearNet / build) * 100 : null;
    const breakEvenRuns = saved * value > 0 ? (maintenance + bufferCost) / (saved * value) : null;

    return { grossMonthlyValue, bufferCost, netMonthlyValue, paybackMonths, firstYearNet, firstYearRoi, breakEvenRuns };
  }, [buildCost, failureBuffer, hourlyValue, hoursSaved, monthlyMaintenance, runsPerMonth]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <label className="block">
          <span className="text-sm font-medium">Hours saved / run</span>
          <input inputMode="decimal" value={hoursSaved} onChange={(e) => setHoursSaved(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Runs / month</span>
          <input inputMode="decimal" value={runsPerMonth} onChange={(e) => setRunsPerMonth(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Hourly value $</span>
          <input inputMode="decimal" value={hourlyValue} onChange={(e) => setHourlyValue(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Build cost $</span>
          <input inputMode="decimal" value={buildCost} onChange={(e) => setBuildCost(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Monthly maintenance $</span>
          <input inputMode="decimal" value={monthlyMaintenance} onChange={(e) => setMonthlyMaintenance(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Failure buffer %</span>
          <input inputMode="decimal" value={failureBuffer} onChange={(e) => setFailureBuffer(e.target.value)} className={inputClass} />
        </label>
      </div>

      {roi === null ? (
        <output className="block rounded-lg bg-accent p-4 text-sm text-muted">
          Enter non-negative numbers. Failure buffer must be between 0 and 100.
        </output>
      ) : (
        <>
          <output className="block rounded-lg bg-accent p-4">
            <strong className="block text-xl">{roi.netMonthlyValue > 0 ? usd.format(roi.netMonthlyValue) : "$0"}</strong>
            <span className="text-sm text-muted">Estimated net monthly value after maintenance and failure buffer.</span>
          </output>

          <div className="space-y-1.5">
            {[
              ["Gross monthly value", usd.format(roi.grossMonthlyValue)],
              ["Failure buffer", usd.format(roi.bufferCost)],
              ["Payback period", roi.paybackMonths === null ? "No payback" : `${roi.paybackMonths.toFixed(1)} months`],
              ["First-year net", usd.format(roi.firstYearNet)],
              ["First-year ROI", roi.firstYearRoi === null ? "n/a" : `${roi.firstYearRoi.toFixed(0)}%`],
              ["Maintenance break-even", roi.breakEvenRuns === null ? "n/a" : `${Math.ceil(roi.breakEvenRuns).toLocaleString()} runs/month`],
            ].map(([label, val]) => (
              <div key={label} className="flex items-center justify-between rounded-lg border border-border px-4 py-2">
                <span className="text-sm text-muted">{label}</span>
                <strong className="text-sm">{val}</strong>
              </div>
            ))}
          </div>
        </>
      )}

      <p className="text-xs text-muted">
        Treat this as a decision aid, not a promise. Add risk, compliance, quality, and opportunity-cost notes before green-lighting an automation.
      </p>
    </div>
  );
}
