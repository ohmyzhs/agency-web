"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/providers";
import NumberStepper from "@/components/tools/shared/NumberStepper";
import SegmentedTabs from "@/components/tools/shared/SegmentedTabs";
import {
  calculateDepositMaturity,
  type DepositInterestMode,
} from "@/lib/calculators/financial";

function formatManwon(value: number) {
  if (value >= 10_000) {
    const eok = Math.floor(value / 10_000);
    const rest = value % 10_000;
    return rest === 0 ? `${eok}억` : `${eok}억 ${rest.toLocaleString()}만`;
  }
  return `${value.toLocaleString()}만`;
}

export default function DepositInterestCalculator() {
  const { locale } = useLocale();
  const isKo = locale === "ko";
  const [principalManwon, setPrincipalManwon] = useState(1_000);
  const [annualRate, setAnnualRate] = useState(3.2);
  const [months, setMonths] = useState(12);
  const [interestMode, setInterestMode] = useState<DepositInterestMode>("simple");

  const result = useMemo(
    () => calculateDepositMaturity({ principalManwon, annualRate, months, interestMode }),
    [annualRate, interestMode, months, principalManwon],
  );

  const modeOptions: { value: DepositInterestMode; label: string }[] = isKo
    ? [
        { value: "simple", label: "단리" },
        { value: "compound-monthly", label: "월 복리" },
        { value: "compound-yearly", label: "연 복리" },
      ]
    : [
        { value: "simple", label: "Simple" },
        { value: "compound-monthly", label: "Monthly compound" },
        { value: "compound-yearly", label: "Yearly compound" },
      ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-accent p-4 text-sm text-muted leading-relaxed">
        {isKo
          ? "단리, 월 복리, 연 복리를 빠르게 비교하는 예금 이자 계산기입니다. 세전 단순 추정치이며 실제 세후 수령액과 우대금리는 상품 조건에 따라 달라집니다."
          : "Compare simple, monthly compound, and yearly compound deposit outcomes. This is a simplified pre-tax estimate only."}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-border p-4">
          <NumberStepper
            value={principalManwon}
            onChange={setPrincipalManwon}
            min={0}
            max={1_000_000}
            step={principalManwon >= 100_000 ? 10_000 : 1_000}
            suffix={isKo ? "만 원" : "KRW 10k"}
            ariaLabel={isKo ? "예금액" : "Deposit amount"}
            label={isKo ? "예금액" : "Deposit amount"}
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
            ariaLabel={isKo ? "예금기간" : "Term"}
            label={isKo ? "예금기간" : "Term"}
          />
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
              {isKo ? "계산 방식" : "Interest mode"}
            </p>
            <SegmentedTabs<DepositInterestMode>
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
            <MetricCard label={isKo ? "원금" : "Principal"} value={formatManwon(principalManwon)} />
            <MetricCard label={isKo ? "총 이자" : "Total interest"} value={formatManwon(result.totalInterestManwon)} />
          </div>
          <div className="rounded-xl bg-accent p-4 text-sm text-muted leading-relaxed">
            {interestMode === "simple"
              ? isKo
                ? "단리는 원금 기준으로만 이자가 붙어 구조가 가장 직관적입니다."
                : "Simple interest stays easiest to read because interest is based on principal only."
              : interestMode === "compound-monthly"
                ? isKo
                  ? "월 복리는 이자가 다시 원금에 합산되어 장기일수록 효과가 커집니다."
                  : "Monthly compounding snowballs faster because interest gets reinvested every month."
                : isKo
                  ? "연 복리는 월 복리보다 단순하지만 장기 예금 비교에는 여전히 유용합니다."
                  : "Yearly compounding is simpler than monthly compounding but still useful for longer terms."}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          {isKo ? "기간별 추정" : "Projection by period"}
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-muted">
              <tr>
                <th className="px-3 py-2">{isKo ? "기간" : "Period"}</th>
                <th className="px-3 py-2">{isKo ? "누적 이자" : "Accumulated interest"}</th>
                <th className="px-3 py-2">{isKo ? "예상 잔액" : "Estimated balance"}</th>
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row) => (
                <tr key={row.period} className="border-t border-border/60">
                  <td className="px-3 py-2">{row.period}</td>
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
