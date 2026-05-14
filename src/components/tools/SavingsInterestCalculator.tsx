"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/providers";
import NumberStepper from "@/components/tools/shared/NumberStepper";
import SegmentedTabs from "@/components/tools/shared/SegmentedTabs";
import {
  calculateSavingsMaturity,
  type SavingsInterestMode,
} from "@/lib/calculators/financial";

function formatManwon(value: number) {
  if (value >= 10_000) {
    const eok = Math.floor(value / 10_000);
    const rest = value % 10_000;
    return rest === 0 ? `${eok}억` : `${eok}억 ${rest.toLocaleString()}만`;
  }
  return `${value.toLocaleString()}만`;
}

export default function SavingsInterestCalculator() {
  const { locale } = useLocale();
  const isKo = locale === "ko";
  const [monthlyDepositManwon, setMonthlyDepositManwon] = useState(10);
  const [annualRate, setAnnualRate] = useState(4.0);
  const [months, setMonths] = useState(12);
  const [interestMode, setInterestMode] = useState<SavingsInterestMode>("simple");

  const result = useMemo(
    () => calculateSavingsMaturity({ monthlyDepositManwon, annualRate, months, interestMode }),
    [annualRate, interestMode, monthlyDepositManwon, months],
  );

  const modeOptions: { value: SavingsInterestMode; label: string }[] = isKo
    ? [
        { value: "simple", label: "단리" },
        { value: "compound-monthly", label: "복리" },
      ]
    : [
        { value: "simple", label: "Simple" },
        { value: "compound-monthly", label: "Compound" },
      ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-accent p-4 text-sm text-muted leading-relaxed">
        {isKo
          ? "월납입 적금의 만기 예상액과 누적 이자를 빠르게 보는 계산기입니다. 실제 우대금리, 세후이자, 자유적립 조건은 상품별로 차이가 있습니다."
          : "Estimate maturity amount and total interest for recurring savings. Preferential rates and after-tax amounts vary by product."}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-border p-4">
          <NumberStepper
            value={monthlyDepositManwon}
            onChange={setMonthlyDepositManwon}
            min={0}
            max={1_000}
            step={1}
            suffix={isKo ? "만 원" : "KRW 10k"}
            ariaLabel={isKo ? "월납입액" : "Monthly deposit"}
            label={isKo ? "월납입액" : "Monthly deposit"}
          />
          <NumberStepper
            value={annualRate}
            onChange={setAnnualRate}
            min={0}
            max={30}
            step={0.1}
            suffix="%"
            ariaLabel={isKo ? "금리" : "Annual rate"}
            label={isKo ? "금리" : "Annual rate"}
            formatValue={(value) => value.toFixed(1)}
          />
          <NumberStepper
            value={months}
            onChange={setMonths}
            min={1}
            max={120}
            step={1}
            suffix={isKo ? "개월" : "months"}
            ariaLabel={isKo ? "납입기간" : "Term"}
            label={isKo ? "납입기간" : "Term"}
          />
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
              {isKo ? "계산 방식" : "Interest mode"}
            </p>
            <SegmentedTabs<SavingsInterestMode>
              ariaLabel={isKo ? "계산 방식" : "Interest mode"}
              value={interestMode}
              onChange={setInterestMode}
              size="sm"
              options={modeOptions}
            />
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <MetricCard label={isKo ? "만기 예상액" : "Estimated maturity"} value={formatManwon(result.maturityAmountManwon)} />
          <div className="grid gap-3 sm:grid-cols-2">
            <MetricCard label={isKo ? "총 납입원금" : "Total contribution"} value={formatManwon(result.totalContributionManwon)} />
            <MetricCard label={isKo ? "총 이자" : "Total interest"} value={formatManwon(result.totalInterestManwon)} />
          </div>
          <div className="rounded-xl bg-accent p-4 text-sm text-muted leading-relaxed">
            {interestMode === "simple"
              ? isKo
                ? "단리는 각 회차 납입액에 대해 남은 기간만큼 이자를 단순 계산합니다."
                : "Simple mode applies straightforward interest to each deposit for its remaining term."
              : isKo
                ? "복리는 누적 잔액 전체에 월 단위로 이자가 붙으므로 기간이 길수록 차이가 커집니다."
                : "Compound mode accrues interest on the growing balance each month, widening the gap over time."}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          {isKo ? "월별 누적 흐름" : "Monthly accumulation"}
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-muted">
              <tr>
                <th className="px-3 py-2">{isKo ? "월" : "Month"}</th>
                <th className="px-3 py-2">{isKo ? "누적 납입" : "Contribution"}</th>
                <th className="px-3 py-2">{isKo ? "누적 이자" : "Interest"}</th>
                <th className="px-3 py-2">{isKo ? "예상 잔액" : "Balance"}</th>
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row) => (
                <tr key={row.period} className="border-t border-border/60">
                  <td className="px-3 py-2">{row.period}</td>
                  <td className="px-3 py-2">{formatManwon(row.contribution)}</td>
                  <td className="px-3 py-2">{formatManwon(row.interest)}</td>
                  <td className="px-3 py-2">{formatManwon(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
