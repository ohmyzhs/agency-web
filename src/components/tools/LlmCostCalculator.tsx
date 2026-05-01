"use client";

import { useMemo, useState } from "react";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 4,
});

const inputClass = "mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none";

function parsePositive(value: string) {
  const parsed = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export default function LlmCostCalculator() {
  const [inputTokens, setInputTokens] = useState("2500");
  const [outputTokens, setOutputTokens] = useState("800");
  const [requestsPerDay, setRequestsPerDay] = useState("1000");
  const [inputPrice, setInputPrice] = useState("0.15");
  const [outputPrice, setOutputPrice] = useState("0.60");
  const [cacheDiscount, setCacheDiscount] = useState("0");

  const estimate = useMemo(() => {
    const inTokens = parsePositive(inputTokens);
    const outTokens = parsePositive(outputTokens);
    const runs = parsePositive(requestsPerDay);
    const inRate = parsePositive(inputPrice);
    const outRate = parsePositive(outputPrice);
    const discount = parsePositive(cacheDiscount);

    if (inTokens === null || outTokens === null || runs === null || inRate === null || outRate === null || discount === null || discount > 100) {
      return null;
    }

    const effectiveInputRate = inRate * (1 - discount / 100);
    const inputCostPerRequest = (inTokens / 1_000_000) * effectiveInputRate;
    const outputCostPerRequest = (outTokens / 1_000_000) * outRate;
    const costPerRequest = inputCostPerRequest + outputCostPerRequest;
    const dailyCost = costPerRequest * runs;
    const monthlyCost = dailyCost * 30;
    const yearlyCost = dailyCost * 365;

    return {
      costPerRequest,
      dailyCost,
      monthlyCost,
      yearlyCost,
      inputShare: costPerRequest === 0 ? 0 : (inputCostPerRequest / costPerRequest) * 100,
      outputShare: costPerRequest === 0 ? 0 : (outputCostPerRequest / costPerRequest) * 100,
      monthlyTokens: (inTokens + outTokens) * runs * 30,
    };
  }, [cacheDiscount, inputPrice, inputTokens, outputPrice, outputTokens, requestsPerDay]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <label className="block">
          <span className="text-sm font-medium">Input tokens / request</span>
          <input inputMode="decimal" value={inputTokens} onChange={(e) => setInputTokens(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Output tokens / request</span>
          <input inputMode="decimal" value={outputTokens} onChange={(e) => setOutputTokens(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Requests / day</span>
          <input inputMode="decimal" value={requestsPerDay} onChange={(e) => setRequestsPerDay(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Input $ / 1M tokens</span>
          <input inputMode="decimal" value={inputPrice} onChange={(e) => setInputPrice(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Output $ / 1M tokens</span>
          <input inputMode="decimal" value={outputPrice} onChange={(e) => setOutputPrice(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Input cache discount %</span>
          <input inputMode="decimal" value={cacheDiscount} onChange={(e) => setCacheDiscount(e.target.value)} className={inputClass} />
        </label>
      </div>

      {estimate === null ? (
        <output className="block rounded-lg bg-accent p-4 text-sm text-muted">
          Enter non-negative numbers. Cache discount must be between 0 and 100.
        </output>
      ) : (
        <>
          <output className="block rounded-lg bg-accent p-4">
            <strong className="block text-xl">{money.format(estimate.monthlyCost)}</strong>
            <span className="text-sm text-muted">Estimated monthly API spend at 30 days.</span>
          </output>

          <div className="space-y-1.5">
            {[
              ["Per request", money.format(estimate.costPerRequest)],
              ["Per day", money.format(estimate.dailyCost)],
              ["Per year", money.format(estimate.yearlyCost)],
              ["Monthly tokens", Math.round(estimate.monthlyTokens).toLocaleString()],
              ["Input/output split", `${estimate.inputShare.toFixed(0)}% / ${estimate.outputShare.toFixed(0)}%`],
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
        Prices change by provider and model. Use the exact published price for input and output tokens, then add your own safety margin for retries and prompt growth.
      </p>
    </div>
  );
}
