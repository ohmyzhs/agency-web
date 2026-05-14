"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/providers";
import NumberStepper from "@/components/tools/shared/NumberStepper";
import SegmentedTabs from "@/components/tools/shared/SegmentedTabs";
import {
  calculateHousingPension,
  type HousingPensionHomeType,
  type HousingPensionPaymentType,
} from "@/lib/calculators/housing-pension";

type TermYears = 10 | 15 | 20;
type TermYearsKey = "10" | "15" | "20";

const inputClass =
  "block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none";

function formatManwon(value: number) {
  if (value >= 10_000) {
    const eok = Math.floor(value / 10_000);
    const rest = value % 10_000;
    return rest === 0 ? `${eok}억` : `${eok}억 ${rest.toLocaleString()}만`;
  }
  return `${value.toLocaleString()}만`;
}

function formatBirthDate(value: string) {
  if (!value) return "";
  const [year = "", month = "", day = ""] = value.split("-");
  return `${year}.${month}.${day}`;
}

export default function HousingPensionCalculator() {
  const { locale } = useLocale();
  const isKo = locale === "ko";

  const [homeType, setHomeType] = useState<HousingPensionHomeType>("general");
  const [homeValueManwon, setHomeValueManwon] = useState(30_000);
  const [ownerBirthDate, setOwnerBirthDate] = useState("1958-06-15");
  const [spouseEnabled, setSpouseEnabled] = useState(true);
  const [spouseBirthDate, setSpouseBirthDate] = useState("1960-03-10");
  const [paymentType, setPaymentType] = useState<HousingPensionPaymentType>("lifetime-fixed");
  const [termYears, setTermYears] = useState<TermYears>(20);
  const termYearsKey = String(termYears) as TermYearsKey;
  const [outstandingLoanManwon, setOutstandingLoanManwon] = useState(0);

  const result = useMemo(
    () =>
      calculateHousingPension({
        homeType,
        homeValueManwon,
        ownerBirthDate,
        spouseEnabled,
        spouseBirthDate: spouseEnabled ? spouseBirthDate : null,
        paymentType,
        termYears: paymentType === "term-fixed" ? termYears : null,
        outstandingLoanManwon: paymentType === "loan-repayment" ? outstandingLoanManwon : 0,
      }),
    [homeType, homeValueManwon, ownerBirthDate, spouseEnabled, spouseBirthDate, paymentType, termYears, outstandingLoanManwon],
  );

  const homeTypeOptions: { value: HousingPensionHomeType; label: string }[] = isKo
    ? [
        { value: "general", label: "일반주택" },
        { value: "senior", label: "노인복지주택" },
        { value: "officetel", label: "오피스텔" },
      ]
    : [
        { value: "general", label: "General housing" },
        { value: "senior", label: "Senior welfare housing" },
        { value: "officetel", label: "Officetel" },
      ];

  const paymentOptions: { value: HousingPensionPaymentType; label: string }[] = isKo
    ? [
        { value: "lifetime-fixed", label: "종신지급 · 정액형" },
        { value: "lifetime-increase", label: "종신지급 · 정기증가형" },
        { value: "lifetime-frontloaded-3", label: "종신지급 · 초기증액형(3년)" },
        { value: "lifetime-frontloaded-5", label: "종신지급 · 초기증액형(5년)" },
        { value: "lifetime-frontloaded-7", label: "종신지급 · 초기증액형(7년)" },
        { value: "lifetime-frontloaded-10", label: "종신지급 · 초기증액형(10년)" },
        { value: "mixed", label: "종신혼합형" },
        { value: "term-fixed", label: "확정기간형" },
        { value: "loan-repayment", label: "대출상환형" },
        { value: "preferential-fixed", label: "우대지급형" },
        { value: "preferential-mixed", label: "우대혼합형" },
      ]
    : [
        { value: "lifetime-fixed", label: "Lifetime · fixed" },
        { value: "lifetime-increase", label: "Lifetime · stepped increase" },
        { value: "lifetime-frontloaded-3", label: "Lifetime · front-loaded (3y)" },
        { value: "lifetime-frontloaded-5", label: "Lifetime · front-loaded (5y)" },
        { value: "lifetime-frontloaded-7", label: "Lifetime · front-loaded (7y)" },
        { value: "lifetime-frontloaded-10", label: "Lifetime · front-loaded (10y)" },
        { value: "mixed", label: "Lifetime mixed" },
        { value: "term-fixed", label: "Fixed term" },
        { value: "loan-repayment", label: "Loan repayment" },
        { value: "preferential-fixed", label: "Preferential fixed" },
        { value: "preferential-mixed", label: "Preferential mixed" },
      ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-accent p-4 text-sm text-muted leading-relaxed">
        {isKo
          ? "주택연금 월지급금 구조를 빠르게 가늠하기 위한 추정 계산기입니다. 실제 가입 심사에서는 한국주택금융공사의 평가 방식, 보증료, 금리, 주택가격 인정 범위, 우대형 자격 조건이 함께 반영됩니다."
          : "A quick estimator for housing pension monthly payouts. Actual enrollment depends on Korea Housing Finance Corporation rules, guarantee fees, rates, valuation, and preferential eligibility checks."}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-border p-4">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
              {isKo ? "주택 종류" : "Home type"}
            </p>
            <SegmentedTabs<HousingPensionHomeType>
              ariaLabel={isKo ? "주택 종류" : "Home type"}
              value={homeType}
              onChange={setHomeType}
              size="sm"
              options={homeTypeOptions}
            />
          </div>

          <NumberStepper
            value={homeValueManwon}
            onChange={setHomeValueManwon}
            min={0}
            max={120_000}
            step={homeValueManwon >= 10_000 ? 1_000 : 100}
            suffix={isKo ? "만 원" : "KRW 10k"}
            ariaLabel={isKo ? "주택 가격" : "Home value"}
            label={isKo ? "주택 공시가격" : "Official home value"}
          />
          <div className="flex flex-wrap gap-2">
            {[5_000, 10_000, 50_000, 100_000].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setHomeValueManwon((current) => Math.min(120_000, current + value))}
                className="rounded-full border border-border px-3 py-1.5 text-sm hover:bg-accent"
              >
                +{formatManwon(value)}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1 text-sm">
              <span className="font-medium">{isKo ? "주택소유자 생년월일" : "Owner birth date"}</span>
              <input type="date" value={ownerBirthDate} onChange={(e) => setOwnerBirthDate(e.target.value)} className={inputClass} />
              <span className="text-xs text-muted">
                {isKo ? `만 ${result.ownerAge}세` : `Age ${result.ownerAge}`}
              </span>
            </label>

            <div className="grid gap-2 text-sm">
              <span className="font-medium">{isKo ? "배우자 정보" : "Spouse"}</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSpouseEnabled(true)}
                  className={`rounded-full border px-3 py-1.5 ${spouseEnabled ? "border-primary bg-primary text-white" : "border-border hover:bg-accent"}`}
                >
                  {isKo ? "배우자 있음" : "With spouse"}
                </button>
                <button
                  type="button"
                  onClick={() => setSpouseEnabled(false)}
                  className={`rounded-full border px-3 py-1.5 ${!spouseEnabled ? "border-primary bg-primary text-white" : "border-border hover:bg-accent"}`}
                >
                  {isKo ? "배우자 없음" : "No spouse"}
                </button>
              </div>
              {spouseEnabled ? (
                <>
                  <input type="date" value={spouseBirthDate} onChange={(e) => setSpouseBirthDate(e.target.value)} className={inputClass} />
                  <span className="text-xs text-muted">
                    {isKo
                      ? `배우자 만 ${result.spouseAge ?? 0}세 · 연소자 만 ${result.youngestAge}세`
                      : `Spouse age ${result.spouseAge ?? 0} · youngest age ${result.youngestAge}`}
                  </span>
                </>
              ) : (
                <span className="text-xs text-muted">
                  {isKo ? "단독 명의 기준으로 계산합니다." : "Estimating under a single-owner scenario."}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-border p-4">
          <label className="grid gap-1 text-sm">
            <span className="font-medium">{isKo ? "지급방식" : "Payout method"}</span>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value as HousingPensionPaymentType)}
              className={inputClass}
            >
              {paymentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          {paymentType === "term-fixed" ? (
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
                {isKo ? "확정 지급기간" : "Fixed payout term"}
              </p>
              <SegmentedTabs<TermYearsKey>
                ariaLabel={isKo ? "확정 지급기간" : "Fixed payout term"}
                value={termYearsKey}
                onChange={(next) => setTermYears(Number(next) as TermYears)}
                size="sm"
                options={[
                  { value: "10", label: isKo ? "10년" : "10 years" },
                  { value: "15", label: isKo ? "15년" : "15 years" },
                  { value: "20", label: isKo ? "20년" : "20 years" },
                ]}
              />
            </div>
          ) : null}

          {paymentType === "loan-repayment" ? (
            <NumberStepper
              value={outstandingLoanManwon}
              onChange={setOutstandingLoanManwon}
              min={0}
              max={120_000}
              step={100}
              suffix={isKo ? "만 원" : "KRW 10k"}
              ariaLabel={isKo ? "상환 대상 대출" : "Loan to repay"}
              label={isKo ? "상환할 주택담보대출" : "Mortgage balance to repay"}
            />
          ) : null}

          <div className="rounded-xl bg-accent p-4 text-sm text-muted leading-relaxed">
            {paymentType === "term-fixed"
              ? isKo
                ? "확정기간형은 월지급금이 더 높게 나오는 대신 종신형보다 지급 기간이 짧습니다. 부부 중 연소자가 만 55~74세여야 한다는 점을 함께 확인해야 합니다."
                : "Fixed-term payouts tend to be higher monthly than lifetime plans, but they end after the selected term and require the younger spouse to be 55–74."
              : paymentType === "loan-repayment"
                ? isKo
                  ? "대출상환형은 대출을 먼저 줄이는 구조라 월지급금이 낮아질 수 있습니다. 초기 인출한도는 일반적으로 더 큽니다."
                  : "Loan-repayment type allocates more value to paying off an existing mortgage, so monthly payouts can be lower while upfront withdrawal capacity is larger."
                : paymentType === "preferential-fixed" || paymentType === "preferential-mixed"
                  ? isKo
                    ? "우대형은 실제 자격 확인이 가장 중요합니다. 기초연금 수급권, 2억 원 미만 1주택 여부 등 공식 조건을 만족해야 합니다."
                    : "Preferential types depend heavily on formal eligibility checks such as basic pension status and holding a single lower-value home."
                  : isKo
                    ? "종신형은 평생 지급이 핵심이므로 월지급금은 확정기간형보다 낮을 수 있지만 장기 안정성을 중시할 때 자주 검토됩니다."
                    : "Lifetime plans prioritize lifelong payouts, so monthly amounts can be lower than fixed-term plans but often suit longevity-focused planning."}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            {isKo ? "예상 월지급금" : "Estimated monthly payout"}
          </p>
          {result.eligible ? (
            <>
              <strong className="mt-2 block text-3xl font-black text-foreground">
                {formatManwon(result.payoutMonthly)}
                {isKo ? " / 월" : " / month"}
              </strong>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  label={isKo ? "주택가격" : "Home value"}
                  value={formatManwon(homeValueManwon)}
                  hint={isKo ? "공시가격 입력 기준" : "Official value input"}
                />
                <MetricCard
                  label={isKo ? "지급기간" : "Payout period"}
                  value={result.payoutYearsLabel}
                  hint={isKo ? "종신 또는 선택 연수" : "Lifetime or selected term"}
                />
                <MetricCard
                  label={isKo ? "초기 인출한도" : "Upfront withdrawal"}
                  value={result.upfrontWithdrawalLimit > 0 ? formatManwon(result.upfrontWithdrawalLimit) : isKo ? "없음" : "None"}
                  hint={isKo ? "혼합형·대출상환형 중심" : "Mostly mixed / loan type"}
                />
                <MetricCard
                  label={isKo ? "계산 기준 연령" : "Youngest age"}
                  value={isKo ? `만 ${result.youngestAge}세` : `${result.youngestAge}`}
                  hint={isKo ? "부부 중 연소자 기준" : "Based on younger spouse"}
                />
              </div>
            </>
          ) : (
            <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
              <p className="font-semibold text-red-200">{isKo ? "입력 조건을 다시 확인해 주세요." : "Please review the eligibility inputs."}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {result.errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            {isKo ? "해석 가이드" : "How to read this estimate"}
          </p>
          <div className="mt-3 space-y-3 text-sm text-muted leading-relaxed">
            <p>
              {isKo
                ? `주택소유자 ${formatBirthDate(ownerBirthDate)}${spouseEnabled ? ` · 배우자 ${formatBirthDate(spouseBirthDate)}` : ""} 기준으로 계산했습니다.`
                : `Estimated from owner ${formatBirthDate(ownerBirthDate)}${spouseEnabled ? ` and spouse ${formatBirthDate(spouseBirthDate)}` : ""}.`}
            </p>
            <p>
              {isKo
                ? `기본 월지급 산식값은 ${formatManwon(result.baseMonthly)} 수준이며, 선택한 지급방식 계수 ${result.monthlyMultiplier.toFixed(2)}를 반영했습니다.`
                : `The base monthly estimate is about ${formatManwon(result.baseMonthly)} with a payout-mode multiplier of ${result.monthlyMultiplier.toFixed(2)}.`}
            </p>
            <ul className="list-disc space-y-2 pl-5">
              {result.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted">{label}</p>
      <strong className="mt-2 block text-lg font-bold text-foreground">{value}</strong>
      <span className="mt-1 block text-xs text-muted">{hint}</span>
    </div>
  );
}
