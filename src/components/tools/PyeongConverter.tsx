"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/providers";
import NumberStepper from "@/components/tools/shared/NumberStepper";
import SegmentedTabs from "@/components/tools/shared/SegmentedTabs";
import { pyeongToSquareMeters, squareMetersToPyeong } from "@/lib/calculators/conversions";

type Mode = "pyeong-to-m2" | "m2-to-pyeong";

const apartmentBadges = [
  { area: 59, hint: { ko: "보통 24평형", en: "≈ 24평 class" } },
  { area: 75, hint: { ko: "보통 30평형 전후", en: "≈ 30평 class" } },
  { area: 84, hint: { ko: "보통 34평형", en: "≈ 34평 class" } },
  { area: 99, hint: { ko: "보통 39~40평형", en: "≈ 39–40평 class" } },
];

export default function PyeongConverter() {
  const { locale } = useLocale();
  const [mode, setMode] = useState<Mode>("pyeong-to-m2");
  const [value, setValue] = useState<number>(24);

  const pyeongLabel = locale === "ko" ? "평" : "pyeong";

  const result = useMemo(() => {
    if (!Number.isFinite(value) || value < 0) return null;
    return mode === "pyeong-to-m2" ? pyeongToSquareMeters(value) : squareMetersToPyeong(value);
  }, [mode, value]);

  const onBadgeClick = (area: number) => {
    setMode("m2-to-pyeong");
    setValue(area);
  };

  const handleModeChange = (next: Mode) => {
    setMode(next);
    setValue(next === "pyeong-to-m2" ? 24 : 84);
  };

  return (
    <div className="space-y-5">
      <SegmentedTabs<Mode>
        ariaLabel={locale === "ko" ? "변환 방향" : "Conversion direction"}
        value={mode}
        onChange={handleModeChange}
        options={[
          { value: "pyeong-to-m2", label: "평 → ㎡" },
          { value: "m2-to-pyeong", label: "㎡ → 평" },
        ]}
      />

      <NumberStepper
        value={value}
        onChange={setValue}
        min={0}
        max={mode === "pyeong-to-m2" ? 1000 : 5000}
        step={mode === "pyeong-to-m2" ? 1 : 1}
        suffix={mode === "pyeong-to-m2" ? pyeongLabel : "㎡"}
        ariaLabel={mode === "pyeong-to-m2" ? `${pyeongLabel}` : "square meters"}
        label={
          mode === "pyeong-to-m2"
            ? locale === "ko"
              ? "평수"
              : "Pyeong"
            : locale === "ko"
              ? "제곱미터"
              : "Square meters"
        }
      />

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
          {locale === "ko" ? "아파트 공급면적 빠른 입력" : "Apartment area quick fill"}
        </p>
        <div className="flex flex-wrap gap-2">
          {apartmentBadges.map((badge) => (
            <button
              key={badge.area}
              type="button"
              onClick={() => onBadgeClick(badge.area)}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-foreground"
              title={locale === "ko" ? badge.hint.ko : badge.hint.en}
            >
              {badge.area}㎡
            </button>
          ))}
        </div>
      </div>

      <output className="block rounded-lg bg-accent p-4">
        {result === null ? (
          <span className="text-sm text-muted">
            {locale === "ko" ? "0 이상의 숫자를 입력하세요." : "Enter a non-negative number."}
          </span>
        ) : mode === "pyeong-to-m2" ? (
          <>
            <strong className="block text-xl">{result.toLocaleString()} ㎡</strong>
            <span className="text-sm text-muted">
              {locale === "ko" ? "1평 = 3.305785㎡ 비율 사용" : "Using 1평 = 3.305785 m²"}
            </span>
          </>
        ) : (
          <>
            <strong className="block text-xl">
              {result.toLocaleString()}
              {pyeongLabel}
            </strong>
            <span className="text-sm text-muted">
              {locale === "ko"
                ? "소수점 둘째 자리에서 반올림한 참고값입니다."
                : "Rounded to two decimals for quick reading."}
            </span>
          </>
        )}
      </output>

      <p className="text-xs text-muted leading-relaxed">
        {locale === "ko"
          ? "광고에서 “34평”이라고 부르는 단위는 보통 전용면적 84㎡에 해당합니다. 실제 계약·세무 기준은 전용/공급/계약면적이 표기된 공식 서류를 따릅니다."
          : "“34평” marketing labels usually correspond to 84㎡ exclusive area. For contracts and taxes, refer to 전용/공급/계약면적 on official documents."}
      </p>
    </div>
  );
}
