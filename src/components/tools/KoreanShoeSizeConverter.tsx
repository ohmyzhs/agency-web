"use client";

import { useMemo, useState } from "react";
import { findNearestKoreanShoeSize } from "@/lib/calculators/conversions";

export default function KoreanShoeSizeConverter() {
  const [size, setSize] = useState("270");
  const numericSize = Number(size);
  const isValid = Number.isFinite(numericSize) && numericSize >= 200 && numericSize <= 320;
  const nearest = useMemo(() => (isValid ? findNearestKoreanShoeSize(numericSize) : null), [isValid, numericSize]);

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium">Korean size in millimeters</span>
        <input
          inputMode="numeric"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          placeholder="270"
          className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </label>

      <output className="block rounded-lg bg-accent p-4">
        {!nearest ? (
          <span className="text-sm text-muted">Enter a size between 200 and 320 mm.</span>
        ) : (
          <div className="space-y-1">
            <strong className="block text-xl">{nearest.krMm} mm nearest reference</strong>
            <span className="block text-sm text-muted">JP: {nearest.jpCm} cm</span>
            <span className="block text-sm text-muted">EU: {nearest.eu ?? "brand dependent"}</span>
            <span className="block text-sm text-muted">UK: {nearest.uk ?? "brand dependent"}</span>
            <span className="block text-sm text-muted">US men: {nearest.usMen ?? "n/a"}</span>
            <span className="block text-sm text-muted">US women: {nearest.usWomen ?? "n/a"}</span>
          </div>
        )}
      </output>

      <p className="text-xs text-muted">
        Shoe size conversions vary by brand. Use this as a shopping reference, not a fit guarantee.
      </p>
    </div>
  );
}
