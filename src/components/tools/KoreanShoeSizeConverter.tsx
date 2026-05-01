"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/providers";
import NumberStepper from "@/components/tools/shared/NumberStepper";
import SegmentedTabs from "@/components/tools/shared/SegmentedTabs";
import {
  findNearestKoreanShoeSize,
  koreanShoeSizeReferences,
  type ShoeSizeReference,
} from "@/lib/calculators/conversions";

type Basis = "kr-mm" | "us-men" | "us-women" | "eu";

const basisStepConfig: Record<Basis, { min: number; max: number; step: number; default: number; suffix: string }> = {
  "kr-mm": { min: 150, max: 320, step: 5, default: 270, suffix: "mm" },
  "us-men": { min: 4, max: 15, step: 0.5, default: 9, suffix: "US M" },
  "us-women": { min: 4, max: 13, step: 0.5, default: 8, suffix: "US W" },
  eu: { min: 32, max: 50, step: 1, default: 42, suffix: "EU" },
};

function findByField(field: keyof ShoeSizeReference, value: number): ShoeSizeReference {
  return koreanShoeSizeReferences.reduce((nearest, current) => {
    const cv = current[field];
    const nv = nearest[field];
    if (cv === undefined) return nearest;
    if (nv === undefined) return current;
    return Math.abs((cv as number) - value) < Math.abs((nv as number) - value) ? current : nearest;
  });
}

export default function KoreanShoeSizeConverter() {
  const { locale } = useLocale();
  const [basis, setBasis] = useState<Basis>("kr-mm");
  const config = basisStepConfig[basis];
  const [value, setValue] = useState<number>(config.default);

  const reference = useMemo(() => {
    switch (basis) {
      case "kr-mm":
        return findNearestKoreanShoeSize(value);
      case "us-men":
        return findByField("usMen", value);
      case "us-women":
        return findByField("usWomen", value);
      case "eu":
        return findByField("eu", value);
    }
  }, [basis, value]);

  const handleBasisChange = (next: Basis) => {
    setBasis(next);
    setValue(basisStepConfig[next].default);
  };

  const optionLabels: { value: Basis; label: string }[] = [
    { value: "kr-mm", label: locale === "ko" ? "한국 mm" : "KR mm" },
    { value: "us-men", label: "US Men" },
    { value: "us-women", label: "US Women" },
    { value: "eu", label: "EU" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
          {locale === "ko" ? "입력 기준" : "Input basis"}
        </p>
        <SegmentedTabs<Basis>
          ariaLabel={locale === "ko" ? "사이즈 기준" : "Size basis"}
          value={basis}
          options={optionLabels}
          onChange={handleBasisChange}
        />
      </div>

      <NumberStepper
        value={value}
        onChange={setValue}
        min={config.min}
        max={config.max}
        step={config.step}
        suffix={config.suffix}
        ariaLabel="shoe size value"
        label={locale === "ko" ? "사이즈" : "Size"}
        formatValue={(v) => (Number.isInteger(v) ? String(v) : v.toFixed(1))}
      />

      <output className="block rounded-lg bg-accent p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          {locale === "ko" ? "근접 환산값" : "Closest reference"}
        </p>
        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <span className="text-muted">KR mm</span>
          <strong>{reference.krMm} mm</strong>
          <span className="text-muted">JP</span>
          <strong>{reference.jpCm} cm</strong>
          <span className="text-muted">EU</span>
          <strong>{reference.eu ?? (locale === "ko" ? "브랜드별 차이" : "brand dependent")}</strong>
          <span className="text-muted">UK</span>
          <strong>{reference.uk ?? (locale === "ko" ? "브랜드별 차이" : "brand dependent")}</strong>
          <span className="text-muted">US Men</span>
          <strong>{reference.usMen ?? "—"}</strong>
          <span className="text-muted">US Women</span>
          <strong>{reference.usWomen ?? "—"}</strong>
        </div>
      </output>

      <p className="text-xs text-muted leading-relaxed">
        {locale === "ko"
          ? "브랜드별 라스트와 성별 스케일 차이로 ±0.5~1 사이즈 차이가 흔합니다. 결과는 참고 시작점으로 사용하세요."
          : "Brand last shape and gender scaling can shift the recommended size by ±0.5–1. Treat as a starting reference, not a fit guarantee."}
      </p>
    </div>
  );
}
