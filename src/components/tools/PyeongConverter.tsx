"use client";

import { useMemo, useState } from "react";
import { pyeongToSquareMeters, squareMetersToPyeong } from "@/lib/calculators/conversions";

export default function PyeongConverter() {
  const [mode, setMode] = useState<"pyeong-to-m2" | "m2-to-pyeong">("pyeong-to-m2");
  const [value, setValue] = useState("24");

  const numericValue = Number(value);
  const isValid = value.trim() !== "" && Number.isFinite(numericValue) && numericValue >= 0;
  const result = useMemo(() => {
    if (!isValid) return null;
    return mode === "pyeong-to-m2" ? pyeongToSquareMeters(numericValue) : squareMetersToPyeong(numericValue);
  }, [isValid, mode, numericValue]);

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-lg border border-border" role="group" aria-label="Conversion direction">
        <button
          type="button"
          className={`rounded-l-lg px-4 py-2 text-sm font-medium transition-colors ${mode === "pyeong-to-m2" ? "bg-primary text-white" : "hover:bg-card"}`}
          onClick={() => setMode("pyeong-to-m2")}
        >
          평 &rarr; m&sup2;
        </button>
        <button
          type="button"
          className={`rounded-r-lg px-4 py-2 text-sm font-medium transition-colors ${mode === "m2-to-pyeong" ? "bg-primary text-white" : "hover:bg-card"}`}
          onClick={() => setMode("m2-to-pyeong")}
        >
          m&sup2; &rarr; 평
        </button>
      </div>

      <label className="block">
        <span className="text-sm font-medium">{mode === "pyeong-to-m2" ? "Pyeong" : "Square meters"}</span>
        <input
          inputMode="decimal"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={mode === "pyeong-to-m2" ? "24" : "84"}
          className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </label>

      <output className="block rounded-lg bg-accent p-4">
        {result === null ? (
          <span className="text-sm text-muted">Enter a positive number.</span>
        ) : mode === "pyeong-to-m2" ? (
          <>
            <strong className="block text-xl">{result.toLocaleString()} m&sup2;</strong>
            <span className="text-sm text-muted">Using 1평 = 3.305785 m&sup2;</span>
          </>
        ) : (
          <>
            <strong className="block text-xl">{result.toLocaleString()}평</strong>
            <span className="text-sm text-muted">Rounded to two decimals for quick reading.</span>
          </>
        )}
      </output>
    </div>
  );
}
