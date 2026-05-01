"use client";

import { useMemo, useState } from "react";

const inputClass = "mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none";

export default function KrwCurrencyCalculator() {
  const [foreignAmount, setForeignAmount] = useState("100");
  const [rate, setRate] = useState("1350");
  const [feePercent, setFeePercent] = useState("1.5");

  const estimate = useMemo(() => {
    const amount = Number(foreignAmount);
    const exchangeRate = Number(rate);
    const fee = Number(feePercent);

    if (![amount, exchangeRate, fee].every(Number.isFinite) || amount < 0 || exchangeRate < 0 || fee < 0) {
      return null;
    }

    const beforeFee = amount * exchangeRate;
    const feeAmount = beforeFee * (fee / 100);
    return { beforeFee, feeAmount, afterFee: beforeFee - feeAmount };
  }, [feePercent, foreignAmount, rate]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <label className="block">
          <span className="text-sm font-medium">Foreign amount</span>
          <input inputMode="decimal" value={foreignAmount} onChange={(e) => setForeignAmount(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">KRW per 1 unit</span>
          <input inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Fee / spread %</span>
          <input inputMode="decimal" value={feePercent} onChange={(e) => setFeePercent(e.target.value)} className={inputClass} />
        </label>
      </div>

      <output className="block rounded-lg bg-accent p-4">
        {estimate === null ? (
          <span className="text-sm text-muted">Enter positive numbers for amount, rate, and fee.</span>
        ) : (
          <div className="space-y-1">
            <strong className="block text-xl">{Math.round(estimate.afterFee).toLocaleString()} KRW</strong>
            <span className="block text-sm text-muted">Before fee: {Math.round(estimate.beforeFee).toLocaleString()} KRW</span>
            <span className="block text-sm text-muted">Estimated fee/spread: {Math.round(estimate.feeAmount).toLocaleString()} KRW</span>
          </div>
        )}
      </output>

      <p className="text-xs text-muted">This is not a live quote. Enter the rate your bank, card, or exchange service gives you.</p>
    </div>
  );
}
