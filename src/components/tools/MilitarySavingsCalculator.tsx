"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/providers";
import NumberStepper from "@/components/tools/shared/NumberStepper";
import SegmentedTabs from "@/components/tools/shared/SegmentedTabs";
import {
  MILITARY_BANKS,
  calculateMilitarySavings,
  type MilitaryRateType,
} from "@/lib/calculators/financial";

function formatManwon(value: number) {
  if (value >= 10_000) {
    const eok = Math.floor(value / 10_000);
    const rest = value % 10_000;
    return rest === 0 ? `${eok}억` : `${eok}억 ${rest.toLocaleString()}만`;
  }
  return `${value.toLocaleString()}만`;
}

export default function MilitarySavingsCalculator() {
  const { locale } = useLocale();
  const isKo = locale === "ko";
  const [bankId, setBankId] = useState(MILITARY_BANKS[0]?.id ?? "woori");
  const [rateType, setRateType] = useState<MilitaryRateType>("base");
  const [monthlyDepositManwon, setMonthlyDepositManwon] = useState(20);
  const [months, setMonths] = useState(18);

  const result = useMemo(
    () => calculateMilitarySavings({ bankId, rateType, monthlyDepositManwon, months }),
    [bankId, months, monthlyDepositManwon, rateType],
  );

  const rateTypeOptions: { value: MilitaryRateType; label: string }[] = isKo
    ? [
        { value: "base", label: "기본금리" },
        { value: "preferential", label: "우대금리" },
      ]
    : [
        { value: "base", label: "Base" },
        { value: "preferential", label: "Preferential" },
      ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-accent p-4 text-sm text-muted leading-relaxed">
        {isKo
          ? "장병내일준비적금의 월납입, 은행별 금리, 정부 매칭지원금을 빠르게 추정합니다. 실제 가입 가능 은행, 우대조건, 복무기간별 한도는 최신 공식 안내를 다시 확인해야 합니다."
          : "Estimate Korean military savings maturity with bank rate assumptions and government matching support."}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-border p-4">
          <label className="grid gap-1 text-sm">
            <span className="font-medium">{isKo ? "가입은행" : "Bank"}</span>
            <select value={bankId} onChange={(e) => setBankId(e.target.value)} className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none">
              {MILITARY_BANKS.map((bank) => (
                <option key={bank.id} value={bank.id}>
                  {bank.name}
                </option>
              ))}
            </select>
          </label>
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
              {isKo ? "금리종류" : "Rate type"}
            </p>
            <SegmentedTabs<MilitaryRateType>
              ariaLabel={isKo ? "금리종류" : "Rate type"}
              value={rateType}
              onChange={setRateType}
              size="sm"
              options={rateTypeOptions}
            />
          </div>
          <NumberStepper
            value={monthlyDepositManwon}
            onChange={(next) => setMonthlyDepositManwon(Math.min(20, Math.max(0, next)))}
            min={0}
            max={20}
            step={1}
            suffix={isKo ? "만 원" : "KRW 10k"}
            ariaLabel={isKo ? "월납입액" : "Monthly deposit"}
            label={isKo ? "월납입액" : "Monthly deposit"}
          />
          <NumberStepper
            value={months}
            onChange={(next) => setMonths(Math.min(24, Math.max(6, next)))}
            min={6}
            max={24}
            step={1}
            suffix={isKo ? "개월" : "months"}
            ariaLabel={isKo ? "납입개월수" : "Contribution months"}
            label={isKo ? "납입개월수" : "Contribution months"}
          />
        </div>

        <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <MetricCard label={isKo ? "만기 예상 수령액" : "Estimated maturity"} value={formatManwon(result.maturityAmountManwon)} />
          <div className="grid gap-3 sm:grid-cols-2">
            <MetricCard label={isKo ? "총 납입액" : "Total deposit"} value={formatManwon(result.totalDepositManwon)} />
            <MetricCard label={isKo ? "정부 매칭지원금" : "Government match"} value={formatManwon(result.governmentMatchManwon)} />
            <MetricCard label={isKo ? "예상 이자" : "Estimated interest"} value={formatManwon(result.totalInterestManwon)} />
            <MetricCard label={isKo ? "적용 연이율" : "Applied annual rate"} value={`${result.annualRate.toFixed(1)}%`} />
          </div>
          <div className="rounded-xl bg-accent p-4 text-sm text-muted leading-relaxed">
            {isKo
              ? `현재 ${result.bank.name} 기준 ${months < 12 ? "6~12개월 미만" : months < 15 ? "12~15개월 미만" : "15개월 이상"} 금리를 적용했습니다. 우대금리 선택 시 은행별 추가 조건 충족 여부를 따로 확인해야 합니다.`
              : `Using ${result.bank.name} rate band for the selected service length. Preferential mode assumes you satisfy the bank's bonus-rate conditions.`}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-muted">{label}</p>
      <strong className="mt-2 block text-2xl font-black text-foreground">{value}</strong>
    </div>
  );
}
