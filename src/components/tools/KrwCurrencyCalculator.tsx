"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale } from "@/components/providers";
import NumberStepper from "@/components/tools/shared/NumberStepper";

type Rates = Record<string, number>;

type RateState = {
  rates: Rates | null;
  base: string;
  timestamp: number | null;
  source: string;
  error: string | null;
  loading: boolean;
};

const supportedCurrencies = [
  "KRW",
  "USD",
  "EUR",
  "JPY",
  "CNY",
  "GBP",
  "CAD",
  "AUD",
  "HKD",
  "SGD",
  "TWD",
  "THB",
  "VND",
  "CHF",
];

const RATE_API = "https://open.er-api.com/v6/latest/USD";

export default function KrwCurrencyCalculator() {
  const { locale } = useLocale();
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("KRW");
  const [amount, setAmount] = useState<number>(100);
  const [feePercent, setFeePercent] = useState<number>(0);
  const [manualRate, setManualRate] = useState<number | null>(null);

  const [rateState, setRateState] = useState<RateState>({
    rates: null,
    base: "USD",
    timestamp: null,
    source: "open.er-api.com",
    error: null,
    loading: true,
  });

  const fetchRates = useCallback(async () => {
    setRateState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await fetch(RATE_API, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.result !== "success" || !data.rates) {
        throw new Error(data["error-type"] ?? "Invalid response");
      }
      setRateState({
        rates: data.rates as Rates,
        base: data.base_code ?? "USD",
        timestamp: (data.time_last_update_unix ?? Math.floor(Date.now() / 1000)) * 1000,
        source: "open.er-api.com",
        error: null,
        loading: false,
      });
    } catch (err) {
      setRateState((s) => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : "Failed to fetch rates",
      }));
    }
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  const liveRate = useMemo(() => {
    if (!rateState.rates) return null;
    const fromRate = rateState.rates[from];
    const toRate = rateState.rates[to];
    if (!fromRate || !toRate) return null;
    return toRate / fromRate;
  }, [from, to, rateState.rates]);

  const effectiveRate = manualRate ?? liveRate;

  const result = useMemo(() => {
    if (effectiveRate === null || !Number.isFinite(amount)) return null;
    const before = amount * effectiveRate;
    const fee = before * (feePercent / 100);
    return { before, fee, after: before - fee };
  }, [amount, effectiveRate, feePercent]);

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
    setManualRate(null);
  };

  const formatAmount = (value: number, currency: string) => {
    const isKrw = currency === "KRW" || currency === "JPY" || currency === "VND";
    return value.toLocaleString(undefined, {
      minimumFractionDigits: isKrw ? 0 : 2,
      maximumFractionDigits: isKrw ? 0 : 2,
    });
  };

  const timestampLabel = useMemo(() => {
    if (!rateState.timestamp) return null;
    const d = new Date(rateState.timestamp);
    return d.toLocaleString(locale === "ko" ? "ko-KR" : "en-US", {
      timeZone: "Asia/Seoul",
      dateStyle: "medium",
      timeStyle: "short",
    });
  }, [rateState.timestamp, locale]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="krw-from-currency">
            {locale === "ko" ? "원본 통화" : "From"}
          </label>
          <select
            id="krw-from-currency"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              setManualRate(null);
            }}
            className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
          >
            {supportedCurrencies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end justify-center pb-1">
          <button
            type="button"
            onClick={handleSwap}
            aria-label={locale === "ko" ? "통화 바꾸기" : "Swap currencies"}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm transition-colors hover:bg-card"
          >
            ⇄
          </button>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="krw-to-currency">
            {locale === "ko" ? "대상 통화" : "To"}
          </label>
          <select
            id="krw-to-currency"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              setManualRate(null);
            }}
            className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
          >
            {supportedCurrencies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <NumberStepper
          value={amount}
          onChange={setAmount}
          min={0}
          max={1_000_000_000}
          step={amount >= 1000 ? 100 : 1}
          suffix={from}
          ariaLabel="amount"
          label={locale === "ko" ? "금액" : "Amount"}
        />
        <NumberStepper
          value={feePercent}
          onChange={setFeePercent}
          min={0}
          max={10}
          step={0.1}
          suffix="%"
          ariaLabel="fee or spread"
          label={locale === "ko" ? "수수료/스프레드" : "Fee / spread"}
          formatValue={(v) => v.toFixed(1)}
        />
      </div>

      <output className="block rounded-lg bg-accent p-4">
        {rateState.loading && !rateState.rates ? (
          <span className="text-sm text-muted">
            {locale === "ko" ? "환율을 불러오는 중..." : "Fetching exchange rates..."}
          </span>
        ) : effectiveRate === null ? (
          <span className="text-sm text-muted">
            {locale === "ko"
              ? "환율을 불러오지 못했습니다. 아래에서 환율을 직접 입력해 주세요."
              : "Could not load rates. Enter a rate manually below."}
          </span>
        ) : result ? (
          <div className="space-y-1">
            <strong className="block text-2xl">
              {formatAmount(result.after, to)} {to}
            </strong>
            <span className="block text-sm text-muted">
              {locale === "ko" ? "수수료 전" : "Before fee"}: {formatAmount(result.before, to)} {to}
            </span>
            <span className="block text-sm text-muted">
              {locale === "ko" ? "수수료/스프레드" : "Fee / spread"}: {formatAmount(result.fee, to)} {to}
            </span>
            <span className="block text-xs text-muted">
              1 {from} = {effectiveRate.toLocaleString(undefined, { maximumFractionDigits: 6 })} {to}
              {manualRate !== null && (
                <span className="ml-2">({locale === "ko" ? "수동 입력" : "manual"})</span>
              )}
            </span>
          </div>
        ) : null}
      </output>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
        <div>
          {rateState.error ? (
            <span className="text-red-500">
              {locale === "ko" ? "환율 가져오기 실패" : "Rate fetch failed"}: {rateState.error}
            </span>
          ) : timestampLabel ? (
            <span>
              {locale === "ko" ? "기준 시각" : "Updated"}: {timestampLabel} · {locale === "ko" ? "출처" : "Source"}: {rateState.source}
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={fetchRates}
          disabled={rateState.loading}
          className="rounded-lg border border-border bg-background px-3 py-1.5 font-medium transition-colors hover:bg-card disabled:opacity-50"
        >
          {rateState.loading
            ? locale === "ko"
              ? "갱신 중..."
              : "Refreshing..."
            : locale === "ko"
              ? "환율 새로고침"
              : "Refresh rate"}
        </button>
      </div>

      <details className="rounded-lg border border-border bg-card p-3 text-xs">
        <summary className="cursor-pointer font-medium">
          {locale === "ko" ? "환율 직접 입력" : "Override rate manually"}
        </summary>
        <div className="mt-3 flex items-center gap-2">
          <input
            type="number"
            inputMode="decimal"
            placeholder={liveRate ? liveRate.toFixed(4) : "0"}
            value={manualRate ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "") {
                setManualRate(null);
                return;
              }
              const n = Number(v);
              if (Number.isFinite(n) && n >= 0) setManualRate(n);
            }}
            className="block w-32 rounded-lg border border-border bg-background px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
          />
          <span className="text-muted">
            {to} {locale === "ko" ? "/ 1" : "per 1"} {from}
          </span>
          {manualRate !== null && (
            <button
              type="button"
              onClick={() => setManualRate(null)}
              className="rounded border border-border px-2 py-0.5 hover:bg-background"
            >
              {locale === "ko" ? "초기화" : "Reset"}
            </button>
          )}
        </div>
      </details>

      <p className="text-xs text-muted leading-relaxed">
        {locale === "ko"
          ? "실제 카드·은행 결제에는 별도 스프레드와 해외이용수수료가 추가될 수 있습니다. 결과는 예산 추정용으로 사용하세요."
          : "Card and bank conversions add their own spread and fees. Use the result as a budgeting estimate, not a settlement number."}
      </p>
    </div>
  );
}
