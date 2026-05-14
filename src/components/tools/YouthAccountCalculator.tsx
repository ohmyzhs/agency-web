"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/providers";
import NumberStepper from "@/components/tools/shared/NumberStepper";
import SegmentedTabs from "@/components/tools/shared/SegmentedTabs";
import {
  YOUTH_BANKS,
  YOUTH_INCOME_BRACKETS,
  calculateYouthAccount,
  type YouthRateType,
} from "@/lib/calculators/financial";

function formatManwon(value: number) {
  if (value >= 10_000) {
    const eok = Math.floor(value / 10_000);
    const rest = value % 10_000;
    return rest === 0 ? `${eok}억` : `${eok}억 ${rest.toLocaleString()}만`;
  }
  return `${value.toLocaleString()}만`;
}

export default function YouthAccountCalculator() {
  const { locale } = useLocale();
  const isKo = locale === "ko";
  const [bankId, setBankId] = useState(YOUTH_BANKS[0]?.id ?? "kb");
  const [rateType, setRateType] = useState<YouthRateType>("base");
  const [incomeBracketId, setIncomeBracketId] = useState(YOUTH_INCOME_BRACKETS[1]?.id ?? "under-3600");
  const [monthlyDepositManwon, setMonthlyDepositManwon] = useState(50);

  const result = useMemo(
    () => calculateYouthAccount({ bankId, rateType, incomeBracketId, monthlyDepositManwon }),
    [bankId, incomeBracketId, monthlyDepositManwon, rateType],
  );

  const rateTypeOptions: { value: YouthRateType; label: string }[] = isKo
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
          ? "청년도약계좌의 월납입액, 은행별 금리, 소득구간별 정부기여금 효과를 빠르게 비교합니다. 실제 가입 자격, 중위소득 기준, 비과세 요건은 공식 공고를 다시 확인해야 합니다."
          : "Compare youth account maturity under bank-rate and income-bracket assumptions, including government contribution effects."}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-border p-4">
          <label className="grid gap-1 text-sm">
            <span className="font-medium">{isKo ? "가입은행" : "Bank"}</span>
            <select value={bankId} onChange={(e) => setBankId(e.target.value)} className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none">
              {YOUTH_BANKS.map((bank) => (
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
            <SegmentedTabs<YouthRateType>
              ariaLabel={isKo ? "금리종류" : "Rate type"}
              value={rateType}
              onChange={setRateType}
              size="sm"
              options={rateTypeOptions}
            />
          </div>
          <label className="grid gap-1 text-sm">
            <span className="font-medium">{isKo ? "개인소득 구간" : "Income bracket"}</span>
            <select value={incomeBracketId} onChange={(e) => setIncomeBracketId(e.target.value)} className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none">
              {YOUTH_INCOME_BRACKETS.map((bracket) => (
                <option key={bracket.id} value={bracket.id}>
                  {isKo
                    ? `${bracket.label} · 월 한도 ${bracket.monthlyContributionCapManwon}만`
                    : `${bracket.label} · cap ${bracket.monthlyContributionCapManwon} x10k KRW/mo`}
                </option>
              ))}
            </select>
          </label>
          <NumberStepper
            value={monthlyDepositManwon}
            onChange={setMonthlyDepositManwon}
            min={0}
            max={70}
            step={1}
            suffix={isKo ? "만 원" : "KRW 10k"}
            ariaLabel={isKo ? "월 납입액" : "Monthly deposit"}
            label={isKo ? "월 납입액" : "Monthly deposit"}
          />
        </div>

        <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <MetricCard label={isKo ? "5년 만기 예상액" : "Estimated 5-year maturity"} value={formatManwon(result.maturityAmountManwon)} />
          <div className="grid gap-3 sm:grid-cols-2">
            <MetricCard label={isKo ? "총 납입원금" : "Total contribution"} value={formatManwon(result.totalContributionManwon)} />
            <MetricCard label={isKo ? "정부기여금" : "Government contribution"} value={formatManwon(result.governmentContributionManwon)} />
            <MetricCard label={isKo ? "예상 이자" : "Estimated interest"} value={formatManwon(result.totalInterestManwon)} />
            <MetricCard label={isKo ? "적용 연이율" : "Applied annual rate"} value={`${result.annualRate.toFixed(1)}%`} />
          </div>
          <div className="rounded-xl bg-accent p-4 text-sm text-muted leading-relaxed">
            {isKo
              ? `선택한 소득구간에서는 월 ${result.bracket.monthlyContributionCapManwon}만 원까지 반영하며, 정부기여금은 월 최대 ${result.bracket.governmentMatchCapManwon.toFixed(1)}만 원 기준으로 추정합니다.`
              : `This income bracket reflects up to ${result.bracket.monthlyContributionCapManwon} x10k KRW per month, with estimated government support capped at ${result.bracket.governmentMatchCapManwon.toFixed(1)} x10k KRW monthly.`}
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
