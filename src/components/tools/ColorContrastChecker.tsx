"use client";

import { useMemo, useState } from "react";

type Rgb = { r: number; g: number; b: number };

function parseHex(value: string): Rgb | null {
  const clean = value.trim().replace(/^#/, "");
  if (!/^[0-9a-f]{3}$|^[0-9a-f]{6}$/i.test(clean)) return null;
  const full = clean.length === 3 ? clean.split("").map((char) => char + char).join("") : clean;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function luminance({ r, g, b }: Rgb) {
  const values = [r, g, b].map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
}

function contrastRatio(foreground: Rgb, background: Rgb) {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

const inputClass = "mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none";

export default function ColorContrastChecker() {
  const [foreground, setForeground] = useState("#181514");
  const [background, setBackground] = useState("#f3efe7");

  const result = useMemo(() => {
    const fg = parseHex(foreground);
    const bg = parseHex(background);
    if (!fg || !bg) return null;
    const ratio = contrastRatio(fg, bg);
    return { ratio, aaNormal: ratio >= 4.5, aaaNormal: ratio >= 7, aaLarge: ratio >= 3 };
  }, [background, foreground]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm font-medium">Foreground</span>
          <input value={foreground} onChange={(e) => setForeground(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Background</span>
          <input value={background} onChange={(e) => setBackground(e.target.value)} className={inputClass} />
        </label>
      </div>

      {result ? (
        <>
          <div className="rounded-lg p-6" style={{ color: foreground, backgroundColor: background }}>
            <strong className="block text-lg">Readable text preview</strong>
            <span className="text-sm">Buttons, labels, and article text should remain legible on mobile screens.</span>
          </div>
          <output className="block rounded-lg bg-accent p-4">
            <strong className="block text-xl">{result.ratio.toFixed(2)}:1</strong>
            <span className="text-sm text-muted">Contrast ratio</span>
          </output>
          <div className="space-y-1.5">
            {[
              ["WCAG AA normal text", result.aaNormal ? "Pass" : "Fail"],
              ["WCAG AAA normal text", result.aaaNormal ? "Pass" : "Fail"],
              ["Large text / UI", result.aaLarge ? "Pass" : "Fail"],
            ].map(([label, val]) => (
              <div key={label} className="flex items-center justify-between rounded-lg border border-border px-4 py-2">
                <span className="text-sm text-muted">{label}</span>
                <strong className={`text-sm ${val === "Pass" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>{val}</strong>
              </div>
            ))}
          </div>
        </>
      ) : (
        <output className="block rounded-lg bg-accent p-4 text-sm text-muted">
          Enter colors as #181514, #fff, or another 3/6 digit hex value.
        </output>
      )}
    </div>
  );
}
