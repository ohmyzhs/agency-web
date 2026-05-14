"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/providers";
import NumberStepper from "@/components/tools/shared/NumberStepper";
import SegmentedTabs from "@/components/tools/shared/SegmentedTabs";
import {
  calculateLoanSchedule,
  type LoanRepaymentMode,
} from "@/lib/calculators/financial";

function formatMoneyManwon(value: number) {
  if (value >= 10_000) {
    const eok = Math.floor(value / 10_000);
    const rest = value % 10_000;
    return rest === 0 ? `${eok}억` : `${eok}억 ${rest.toLocaleString()}만`;
  }
  return `${value.toLocaleString()}만`;
}

export default function LoanInterestCalculator() {
  const { locale } = useLocale();
  const isKo = locale === "ko";
  const [principalManwon, setPrincipalManwon] = useState(10_000);
  const [annualRate, setAnnualRate] = useState(4.7);
  const [months, setMonths] = useState(36);
  const [graceMonths, setGraceMonths] = useState(0);
  const [repaymentMode, setRepaymentMode] = useState<LoanRepaymentMode>("equal-payment");

  const result = useMemo(
    () =>
      calculateLoanSchedule({
        principalManwon,
        annualRate,
        months,
        graceMonths,
        repaymentMode,
      }),
    [annualRate, graceMonths, months, principalManwon, repaymentMode],
  );

  const modeOptions: { value: LoanRepaymentMode; label: string }[] = isKo
    ? [
        { value: "equal-payment", label: "원리금균등" },
        { value: "equal-principal", label: "원금균등" },
        { value: "bullet", label: "만기일시" },
      ]
    : [
        { value: "equal-payment", label: "Equal payment" },
        { value: "equal-principal", label: "Equal principal" },
        { value: "bullet", label: "Bullet" },
      ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-accent p-4 text-sm text-muted leading-relaxed">
        {isKo
          ? "원리금균등, 원금균등, 만기일시상환을 빠르게 비교하는 대출 이자 계산기입니다. 실제 실행금리, 인지세, 중도상환수수료, 거치조건은 금융사 상품설명서를 다시 확인해야 합니다."
          : "Compare equal-payment, equal-principal, and bullet repayment scenarios. Real products can differ due to fees, grace rules, and lender-specific pricing."}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-border p-4">
          <NumberStepper
            value={principalManwon}
            onChange={setPrincipalManwon}
            min={0}
            max={500_000}
            step={principalManwon >= 100_000 ? 10_000 : 1_000}
            suffix={isKo ? "만 원" : "KRW 10k"}
            ariaLabel={isKo ? "대출금액" : "Loan principal"}
            label={isKo ? "대출금액" : "Loan principal"}
          />
          <NumberStepper
            value={annualRate}
            onChange={setAnnualRate}
            min={0}
            max={30}
            step={0.1}
            suffix="%"
            ariaLabel={isKo ? "대출금리" : "Annual rate"}
            label={isKo ? "대출금리" : "Annual rate"}
            formatValue={(value) => value.toFixed(1)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberStepper
              value={months}
              onChange={setMonths}
              min={1}
              max={480}
              step={1}
              suffix={isKo ? "개월" : "months"}
              ariaLabel={isKo ? "대출기간" : "Loan period"}
              label={isKo ? "대출기간" : "Loan period"}
            />
            <NumberStepper
              value={graceMonths}
              onChange={(next) => setGraceMonths(Math.min(Math.max(0, next), Math.max(0, months - 1)))}
              min={0}
              max={Math.max(0, months - 1)}
              step={1}
              suffix={isKo ? "개월" : "months"}
              ariaLabel={isKo ? "거치기간" : "Grace period"}
              label={isKo ? "거치기간" : "Grace period"}
            />
          </div>
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
              {isKo ? "상환방식" : "Repayment method"}
            </p>
            <SegmentedTabs<LoanRepaymentMode>
              ariaLabel={isKo ? "상환방식" : "Repayment method"}
              value={repaymentMode}
              onChange={setRepaymentMode}
              size="sm"
              options={modeOptions}
            />
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <MetricCard
            label={isKo ? "대표 월 상환액" : "Typical monthly payment"}
            value={formatMoneyManwon(result.monthlyPaymentManwon)}
            suffix={isKo ? "/ 월" : "/ month"}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <MetricCard
              label={isKo ? "총 이자" : "Total interest"}
              value={formatMoneyManwon(result.totalInterestManwon)}
            />
            <MetricCard
              label={isKo ? "총 상환액" : "Total repayment"}
              value={formatMoneyManwon(result.totalPaymentManwon)}
            />
          </div>
          <div className="rounded-xl bg-accent p-4 text-sm text-muted leading-relaxed">
            {repaymentMode === "equal-principal"
              ? isKo
                ? "원금균등은 초반 월납입액이 높지만 시간이 갈수록 이자 부담이 빠르게 줄어듭니다."
                : "Equal-principal plans start heavier and decline over time as interest falls faster."
              : repaymentMode === "bullet"
                ? isKo
                  ? "만기일시는 월 부담이 낮지만 만기 원금 상환 자금을 따로 준비해야 합니다."
                  : "Bullet loans keep monthly cost low but require a large final principal payment."
                : isKo
                  ? "원리금균등은 매달 비슷한 현금흐름을 유지하기 쉬워 가장 흔한 비교 기준이 됩니다."
                  : "Equal-payment plans keep cash flow stable and are the most common benchmark."}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted">
              {isKo ? "초기 상환 스케줄" : "Early repayment schedule"}
            </p>
            <p className="text-sm text-muted">
              {isKo ? "첫 12개월 기준으로 원금·이자 흐름을 보여줍니다." : "Shows the first 12 months of principal and interest flow."}
            </p>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-muted">
              <tr>
                <th className="px-3 py-2">{isKo ? "월" : "Month"}</th>
                <th className="px-3 py-2">{isKo ? "납입액" : "Payment"}</th>
                <th className="px-3 py-2">{isKo ? "원금" : "Principal"}</th>
                <th className="px-3 py-2">{isKo ? "이자" : "Interest"}</th>
                <th className="px-3 py-2">{isKo ? "잔액" : "Balance"}</th>
              </tr>
            </thead>
            <tbody>
              {result.rows.slice(0, 12).map((row) => (
                <tr key={row.month} className="border-t border-border/60">
                  <td className="px-3 py-2">{row.month}</td>
                  <td className="px-3 py-2">{formatMoneyManwon(row.payment)}</td>
                  <td className="px-3 py-2">{formatMoneyManwon(row.principal)}</td>
                  <td className="px-3 py-2">{formatMoneyManwon(row.interest)}</td>
                  <td className="px-3 py-2">{formatMoneyManwon(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, suffix }: { label: string; value: string; suffix?: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-muted">{label}</p>
      <strong className="mt-2 block text-2xl font-black text-foreground">
        {value}
        {suffix ? <span className="text-base font-semibold text-muted"> {suffix}</span> : null}
      </strong>
    </div>
  );
}
