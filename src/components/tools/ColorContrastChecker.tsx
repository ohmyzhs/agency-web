"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/providers";

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

function normalizeHex(value: string): string {
  const parsed = parseHex(value);
  if (!parsed) return value;
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(parsed.r)}${toHex(parsed.g)}${toHex(parsed.b)}`;
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

const inputClass = "block w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm focus:border-primary focus:outline-none";

type ColorFieldProps = {
  label: string;
  value: string;
  onChange: (next: string) => void;
};

function ColorField({ label, value, onChange }: ColorFieldProps) {
  const safeForPicker = useMemo(() => {
    const parsed = parseHex(value);
    if (!parsed) return "#000000";
    const toHex = (n: number) => n.toString(16).padStart(2, "0");
    return `#${toHex(parsed.r)}${toHex(parsed.g)}${toHex(parsed.b)}`;
  }, [value]);

  return (
    <div className="space-y-1">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={`${label} picker`}
          value={safeForPicker}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-12 cursor-pointer rounded-lg border border-border bg-background"
        />
        <input
          aria-label={`${label} hex`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onChange(normalizeHex(e.target.value))}
          className={inputClass}
        />
      </div>
    </div>
  );
}

export default function ColorContrastChecker() {
  const { locale } = useLocale();
  const [foreground, setForeground] = useState("#181514");
  const [background, setBackground] = useState("#f3efe7");

  const result = useMemo(() => {
    const fg = parseHex(foreground);
    const bg = parseHex(background);
    if (!fg || !bg) return null;
    const ratio = contrastRatio(fg, bg);
    return { ratio, aaNormal: ratio >= 4.5, aaaNormal: ratio >= 7, aaLarge: ratio >= 3 };
  }, [background, foreground]);

  const t = locale === "ko"
    ? { fg: "전경", bg: "배경", preview: "본문 텍스트, 버튼, 라벨이 이렇게 보입니다.", placeholder: "#181514, #fff, 또는 3·6자리 hex 값을 입력하세요.", ratio: "대비 비율", aa: "WCAG AA 본문", aaa: "WCAG AAA 본문", large: "큰 텍스트 / UI", pass: "통과", fail: "주의" }
    : { fg: "Foreground", bg: "Background", preview: "Body text, buttons, and labels look like this.", placeholder: "Enter colors as #181514, #fff, or another 3/6 digit hex value.", ratio: "Contrast ratio", aa: "WCAG AA normal text", aaa: "WCAG AAA normal text", large: "Large text / UI", pass: "Pass", fail: "Fail" };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ColorField label={t.fg} value={foreground} onChange={setForeground} />
        <ColorField label={t.bg} value={background} onChange={setBackground} />
      </div>

      {result ? (
        <>
          <div className="rounded-lg p-6" style={{ color: foreground, backgroundColor: background }}>
            <strong className="block text-lg">Readable text preview</strong>
            <span className="text-sm">{t.preview}</span>
          </div>
          <output className="block rounded-lg bg-accent p-4">
            <strong className="block text-xl">{result.ratio.toFixed(2)}:1</strong>
            <span className="text-sm text-muted">{t.ratio}</span>
          </output>
          <div className="space-y-1.5">
            {[
              [t.aa, result.aaNormal],
              [t.aaa, result.aaaNormal],
              [t.large, result.aaLarge],
            ].map(([label, ok]) => (
              <div key={String(label)} className="flex items-center justify-between rounded-lg border border-border px-4 py-2">
                <span className="text-sm text-muted">{label as string}</span>
                <strong className={`text-sm ${ok ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  {ok ? t.pass : t.fail}
                </strong>
              </div>
            ))}
          </div>
        </>
      ) : (
        <output className="block rounded-lg bg-accent p-4 text-sm text-muted">
          {t.placeholder}
        </output>
      )}
    </div>
  );
}
