"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/providers";
import NumberStepper from "@/components/tools/shared/NumberStepper";
import SegmentedTabs from "@/components/tools/shared/SegmentedTabs";
import {
  DOLLAR_RATE_PRESETS,
  calculateDollarExchange,
  type DollarDirection,
  type DollarRateMode,
} from "@/lib/calculators/financial";

function formatKrw(value: number) {
  return `${Math.round(value).toLocaleString()}원`;
}

function formatUsd(value: number) {
  return `${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}USD`;
}

export default function DollarExchangeCalculator() {
  const { locale } = useLocale();
  const isKo = locale === "ko";
  const [direction, setDirection] = useState<DollarDirection>("usd-to-krw");
  const [rateMode, setRateMode] = useState<DollarRateMode>("base");
  const [amount, setAmount] = useState(1);
  const [manualRate, setManualRate] = useState<number | null>(null);

  const result = useMemo(
    () => calculateDollarExchange({ direction, amount, rateMode, manualRate }),
    [amount, direction, manualRate, rateMode],
  );

  const directionOptions: { value: DollarDirection; label: string }[] = isKo
    ? [
        { value: "usd-to-krw", label: "달러 → 원화" },
        { value: "krw-to-usd", label: "원화 → 달러" },
      ]
    : [
        { value: "usd-to-krw", label: "USD → KRW" },
        { value: "krw-to-usd", label: "KRW → USD" },
      ];

  const rateOptions: { value: DollarRateMode; label: string }[] = isKo
    ? [
        { value: "base", label: "매매기준율" },
        { value: "buy", label: "달러를 살때" },
        { value: "sell", label: "달러를 팔때" },
        { value: "receive", label: "송금 받을때" },
        { value: "send", label: "송금 보낼때" },
      ]
    : [
        { value: "base", label: "Base" },
        { value: "buy", label: "Buy USD" },
        { value: "sell", label: "Sell USD" },
        { value: "receive", label: "Receive wire" },
        { value: "send", label: "Send wire" },
      ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-accent p-4 text-sm text-muted leading-relaxed">
        {isKo
          ? "달러를 살 때, 팔 때, 송금받을 때, 송금보낼 때 기준 환율 차이를 빠르게 비교하는 계산기입니다. 기본 프리셋은 원본 사이트 관찰값 기준 고정값이며 실시간 환율은 아닙니다."
          : "Compare USD/KRW outcomes across base, buy, sell, receive, and send-wire scenarios. Presets mirror the source-site snapshot and are not live quotes."}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-border p-4">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
              {isKo ? "환전 방향" : "Direction"}
            </p>
            <SegmentedTabs<DollarDirection>
              ariaLabel={isKo ? "환전 방향" : "Direction"}
              value={direction}
              onChange={setDirection}
              size="sm"
              options={directionOptions}
            />
          </div>
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
              {isKo ? "환율 기준" : "Rate mode"}
            </p>
            <select
              value={rateMode}
              onChange={(e) => {
                setRateMode(e.target.value as DollarRateMode);
                setManualRate(null);
              }}
              className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              {rateOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <NumberStepper
            value={amount}
            onChange={setAmount}
            min={0}
            max={1_000_000_000}
            step={direction === "usd-to-krw" ? 1 : 1000}
            suffix={direction === "usd-to-krw" ? (isKo ? "달러" : "USD") : isKo ? "원" : "KRW"}
            ariaLabel={isKo ? "금액" : "Amount"}
            label={isKo ? "금액" : "Amount"}
          />
          <NumberStepper
            value={manualRate ?? DOLLAR_RATE_PRESETS[rateMode]}
            onChange={(next) => setManualRate(next)}
            min={0}
            max={5000}
            step={0.01}
            suffix={isKo ? "원 / USD" : "KRW / USD"}
            ariaLabel={isKo ? "직접 입력 환율" : "Manual rate"}
            label={isKo ? "직접 입력 환율" : "Manual rate"}
            formatValue={(value) => value.toFixed(2)}
          />
        </div>

        <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <MetricCard
            label={direction === "usd-to-krw" ? (isKo ? "예상 원화 금액" : "Estimated KRW") : isKo ? "예상 달러 금액" : "Estimated USD"}
            value={direction === "usd-to-krw" ? formatKrw(result.krwAmount) : formatUsd(result.usdAmount)}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <MetricCard label={isKo ? "적용 환율" : "Applied rate"} value={`${result.appliedRate.toLocaleString(undefined, { maximumFractionDigits: 2 })} KRW`} />
            <MetricCard label={isKo ? "기준 프리셋" : "Preset mode"} value={rateOptions.find((option) => option.value === rateMode)?.label ?? rateMode} />
          </div>
          <div className="rounded-xl bg-accent p-4 text-sm text-muted leading-relaxed">
            {isKo
              ? "실무에서는 은행 스프레드, 우대환율, 송금수수료, 외화계좌 입출금 조건을 함께 확인해야 실제 체감 금액을 정확히 알 수 있습니다."
              : "In real banking flows, spread discounts, transfer fees, and account conditions can materially change the final amount."}
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
