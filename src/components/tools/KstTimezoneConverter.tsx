"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/components/providers";

type CityZone = {
  id: string;
  city: string;
  cityKo: string;
  country: string;
  countryKo: string;
  timeZone: string;
  observesDst?: boolean;
};

const availableZones: CityZone[] = [
  { id: "utc", city: "UTC", cityKo: "UTC", country: "Reference", countryKo: "기준", timeZone: "UTC" },
  { id: "new-york", city: "New York", cityKo: "뉴욕", country: "USA", countryKo: "미국", timeZone: "America/New_York", observesDst: true },
  { id: "los-angeles", city: "Los Angeles", cityKo: "로스앤젤레스", country: "USA", countryKo: "미국", timeZone: "America/Los_Angeles", observesDst: true },
  { id: "san-francisco", city: "San Francisco", cityKo: "샌프란시스코", country: "USA", countryKo: "미국", timeZone: "America/Los_Angeles", observesDst: true },
  { id: "london", city: "London", cityKo: "런던", country: "UK", countryKo: "영국", timeZone: "Europe/London", observesDst: true },
  { id: "paris", city: "Paris", cityKo: "파리", country: "France", countryKo: "프랑스", timeZone: "Europe/Paris", observesDst: true },
  { id: "berlin", city: "Berlin", cityKo: "베를린", country: "Germany", countryKo: "독일", timeZone: "Europe/Berlin", observesDst: true },
  { id: "tokyo", city: "Tokyo", cityKo: "도쿄", country: "Japan", countryKo: "일본", timeZone: "Asia/Tokyo" },
  { id: "singapore", city: "Singapore", cityKo: "싱가포르", country: "Singapore", countryKo: "싱가포르", timeZone: "Asia/Singapore" },
  { id: "sydney", city: "Sydney", cityKo: "시드니", country: "Australia", countryKo: "호주", timeZone: "Australia/Sydney", observesDst: true },
  { id: "dubai", city: "Dubai", cityKo: "두바이", country: "UAE", countryKo: "아랍에미리트", timeZone: "Asia/Dubai" },
];

const defaultSelected = ["new-york", "los-angeles", "london", "tokyo", "singapore", "sydney", "utc"];

function partsToObject(parts: Intl.DateTimeFormatPart[]): Record<string, string> {
  return parts.reduce<Record<string, string>>((acc, part) => {
    if (part.type !== "literal") acc[part.type] = part.value;
    return acc;
  }, {});
}

function getZoneTime(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    weekday: "short",
  });
  const parts = partsToObject(formatter.formatToParts(date));
  const hour = Number(parts.hour) % 24;
  const minute = Number(parts.minute);
  const second = Number(parts.second);
  return {
    hour,
    minute,
    second,
    weekday: parts.weekday ?? "",
    dateLabel: `${parts.year}-${parts.month}-${parts.day}`,
    timeLabel: `${parts.hour}:${parts.minute}:${parts.second}`,
  };
}

function AnalogClock({ hour, minute, second }: { hour: number; minute: number; second: number }) {
  const hourAngle = ((hour % 12) + minute / 60 + second / 3600) * 30;
  const minuteAngle = (minute + second / 60) * 6;
  const secondAngle = second * 6;
  return (
    <svg viewBox="0 0 100 100" className="h-24 w-24" aria-hidden="true">
      <circle cx="50" cy="50" r="46" className="fill-background stroke-border" strokeWidth="2" />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = 50 + Math.sin(angle) * 40;
        const y1 = 50 - Math.cos(angle) * 40;
        const x2 = 50 + Math.sin(angle) * 44;
        const y2 = 50 - Math.cos(angle) * 44;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            className="stroke-muted"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        );
      })}
      <line
        x1="50"
        y1="50"
        x2={50 + Math.sin((hourAngle * Math.PI) / 180) * 24}
        y2={50 - Math.cos((hourAngle * Math.PI) / 180) * 24}
        className="stroke-foreground"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="50"
        x2={50 + Math.sin((minuteAngle * Math.PI) / 180) * 34}
        y2={50 - Math.cos((minuteAngle * Math.PI) / 180) * 34}
        className="stroke-foreground"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="50"
        x2={50 + Math.sin((secondAngle * Math.PI) / 180) * 38}
        y2={50 - Math.cos((secondAngle * Math.PI) / 180) * 38}
        className="stroke-primary"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="50" cy="50" r="2.5" className="fill-foreground" />
    </svg>
  );
}

function buildKstNow(): Date {
  return new Date();
}

function nowToKstInputValue(date: Date): string {
  const parts = partsToObject(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(date),
  );
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

export default function KstTimezoneConverter() {
  const { locale } = useLocale();
  const [realtime, setRealtime] = useState(true);
  const [now, setNow] = useState<Date>(buildKstNow);
  const [manualValue, setManualValue] = useState<string>(() => nowToKstInputValue(buildKstNow()));
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultSelected);

  useEffect(() => {
    if (!realtime) return;
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, [realtime]);

  const sourceDate = useMemo(() => {
    if (realtime) return now;
    const parsed = new Date(`${manualValue}:00+09:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }, [manualValue, now, realtime]);

  const kstDisplay = useMemo(() => {
    if (!sourceDate) return null;
    return getZoneTime(sourceDate, "Asia/Seoul");
  }, [sourceDate]);

  const selectedZones = useMemo(
    () => availableZones.filter((zone) => selectedIds.includes(zone.id) && zone.timeZone !== "Asia/Seoul"),
    [selectedIds],
  );

  const toggleZone = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((c) => c !== id) : [...current, id],
    );
  };

  const onRealtimeToggle = (next: boolean) => {
    setRealtime(next);
    if (!next) {
      setManualValue(nowToKstInputValue(now));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={realtime}
            onChange={(e) => onRealtimeToggle(e.target.checked)}
            className="h-4 w-4"
          />
          <span className="font-medium">
            {locale === "ko" ? "실시간" : "Realtime"}
          </span>
          <span className="text-muted">
            {locale === "ko" ? "(매초 갱신)" : "(updates every second)"}
          </span>
        </label>
        {!realtime && (
          <label className="inline-flex items-center gap-2 text-sm">
            <span className="font-medium">{locale === "ko" ? "KST 시각" : "KST time"}</span>
            <input
              type="datetime-local"
              value={manualValue}
              onChange={(e) => setManualValue(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
            />
          </label>
        )}
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          {locale === "ko" ? "기준 (서울 KST)" : "Source (Seoul KST)"}
        </p>
        {kstDisplay ? (
          <p className="mt-1 text-lg font-semibold tabular-nums">
            {kstDisplay.dateLabel} {kstDisplay.weekday} {kstDisplay.timeLabel}
          </p>
        ) : (
          <p className="mt-1 text-sm text-muted">
            {locale === "ko" ? "유효한 KST 시간을 입력하세요." : "Enter a valid KST time."}
          </p>
        )}
      </div>

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
          {locale === "ko" ? "표시할 도시" : "Visible cities"}
        </p>
        <div className="flex flex-wrap gap-2">
          {availableZones
            .filter((zone) => zone.timeZone !== "Asia/Seoul")
            .map((zone) => {
              const active = selectedIds.includes(zone.id);
              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => toggleZone(zone.id)}
                  aria-pressed={active}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    active
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-background text-muted hover:bg-card hover:text-foreground"
                  }`}
                >
                  {locale === "ko" ? zone.cityKo : zone.city}
                </button>
              );
            })}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {sourceDate &&
          selectedZones.map((zone) => {
            const t = getZoneTime(sourceDate, zone.timeZone);
            return (
              <div
                key={zone.id}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
              >
                <AnalogClock hour={t.hour} minute={t.minute} second={t.second} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {locale === "ko" ? zone.cityKo : zone.city}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {locale === "ko" ? zone.countryKo : zone.country}
                  </p>
                  <p className="mt-1 text-xs text-muted tabular-nums">
                    {t.dateLabel} {t.weekday}
                  </p>
                  <p className="text-base font-semibold tabular-nums">{t.timeLabel}</p>
                  {zone.observesDst && (
                    <p className="mt-1 text-[10px] uppercase tracking-wider text-muted">DST</p>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      <p className="text-xs text-muted leading-relaxed">
        {locale === "ko"
          ? "한국은 일광 절약 시간을 적용하지 않습니다. DST 표시가 있는 도시는 계절에 따라 1시간 차이가 변동될 수 있습니다."
          : "Korea does not observe daylight saving. Cities marked DST shift by an hour seasonally."}
      </p>
    </div>
  );
}
