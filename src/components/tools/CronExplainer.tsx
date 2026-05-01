"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/providers";
import SegmentedTabs from "@/components/tools/shared/SegmentedTabs";

type SchedulePattern =
  | "every-n-minutes"
  | "hourly-at-minute"
  | "daily-at-time"
  | "weekdays-at-time"
  | "weekly-at-time"
  | "monthly-at-time";

const dayNamesEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const dayNamesKo = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function clampInt(value: string, min: number, max: number, fallback: number): number {
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

type ScheduleState = {
  pattern: SchedulePattern;
  everyMinutes: number;
  minuteOfHour: number;
  hour: number;
  minute: number;
  dayOfWeek: number;
  dayOfMonth: number;
};

function buildCron(state: ScheduleState): { expression: string; humanKo: string; humanEn: string } {
  const { pattern, everyMinutes, minuteOfHour, hour, minute, dayOfWeek, dayOfMonth } = state;
  switch (pattern) {
    case "every-n-minutes": {
      const n = Math.max(1, Math.min(59, everyMinutes));
      return {
        expression: `*/${n} * * * *`,
        humanKo: `매 ${n}분마다 실행`,
        humanEn: `Every ${n} minutes`,
      };
    }
    case "hourly-at-minute": {
      const m = Math.max(0, Math.min(59, minuteOfHour));
      return {
        expression: `${m} * * * *`,
        humanKo: `매 시 ${pad2(m)}분에 실행`,
        humanEn: `Every hour at minute ${pad2(m)}`,
      };
    }
    case "daily-at-time": {
      return {
        expression: `${minute} ${hour} * * *`,
        humanKo: `매일 ${pad2(hour)}:${pad2(minute)}에 실행`,
        humanEn: `Every day at ${pad2(hour)}:${pad2(minute)}`,
      };
    }
    case "weekdays-at-time": {
      return {
        expression: `${minute} ${hour} * * 1-5`,
        humanKo: `평일 ${pad2(hour)}:${pad2(minute)}에 실행`,
        humanEn: `Weekdays at ${pad2(hour)}:${pad2(minute)}`,
      };
    }
    case "weekly-at-time": {
      return {
        expression: `${minute} ${hour} * * ${dayOfWeek}`,
        humanKo: `매주 ${dayNamesKo[dayOfWeek]} ${pad2(hour)}:${pad2(minute)}에 실행`,
        humanEn: `Every ${dayNamesEn[dayOfWeek]} at ${pad2(hour)}:${pad2(minute)}`,
      };
    }
    case "monthly-at-time": {
      const d = Math.max(1, Math.min(31, dayOfMonth));
      return {
        expression: `${minute} ${hour} ${d} * *`,
        humanKo: `매월 ${d}일 ${pad2(hour)}:${pad2(minute)}에 실행`,
        humanEn: `On day ${d} each month at ${pad2(hour)}:${pad2(minute)}`,
      };
    }
  }
}

const inputClass = "mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none";

export default function CronExplainer() {
  const { locale } = useLocale();
  const [state, setState] = useState<ScheduleState>({
    pattern: "daily-at-time",
    everyMinutes: 15,
    minuteOfHour: 0,
    hour: 9,
    minute: 0,
    dayOfWeek: 1,
    dayOfMonth: 1,
  });
  const [copied, setCopied] = useState(false);

  const cron = useMemo(() => buildCron(state), [state]);
  const human = locale === "ko" ? cron.humanKo : cron.humanEn;

  const update = <K extends keyof ScheduleState>(key: K, value: ScheduleState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(cron.expression);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const patternOptions: { value: SchedulePattern; label: string }[] = [
    { value: "every-n-minutes", label: locale === "ko" ? "N분마다" : "Every N minutes" },
    { value: "hourly-at-minute", label: locale === "ko" ? "매 시 N분" : "Hourly at minute" },
    { value: "daily-at-time", label: locale === "ko" ? "매일 시각" : "Daily at time" },
    { value: "weekdays-at-time", label: locale === "ko" ? "평일 시각" : "Weekdays at time" },
    { value: "weekly-at-time", label: locale === "ko" ? "매주" : "Weekly" },
    { value: "monthly-at-time", label: locale === "ko" ? "매월" : "Monthly" },
  ];

  const dayLabels = locale === "ko" ? dayNamesKo : dayNamesEn;
  const t = locale === "ko"
    ? { schedule: "스케줄", expression: "Cron 표현식", copy: "복사", copied: "복사됨", explanation: "설명", timezoneNote: "서버 cron은 보통 머신 시간대를 사용합니다. 한국 기준이 필요한 작업은 KST 변환 결과와 비교해 확인하세요.", everyMin: "분 간격", minOfHour: "분(0–59)", hour: "시", minute: "분", weekday: "요일", day: "일자" }
    : { schedule: "Schedule", expression: "Cron expression", copy: "Copy", copied: "Copied", explanation: "Explanation", timezoneNote: "Server cron typically uses the machine timezone. For Korea-facing schedules, double check against the KST converter.", everyMin: "Interval (minutes)", minOfHour: "Minute (0–59)", hour: "Hour", minute: "Minute", weekday: "Weekday", day: "Day" };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted">{t.schedule}</p>
        <div className="mt-2">
          <SegmentedTabs<SchedulePattern>
            ariaLabel={t.schedule}
            value={state.pattern}
            onChange={(next) => update("pattern", next)}
            options={patternOptions}
            size="sm"
          />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {state.pattern === "every-n-minutes" && (
          <label className="block">
            <span className="text-sm font-medium">{t.everyMin}</span>
            <input
              type="number"
              min={1}
              max={59}
              value={state.everyMinutes}
              onChange={(e) => update("everyMinutes", clampInt(e.target.value, 1, 59, 15))}
              className={inputClass}
            />
          </label>
        )}

        {state.pattern === "hourly-at-minute" && (
          <label className="block">
            <span className="text-sm font-medium">{t.minOfHour}</span>
            <input
              type="number"
              min={0}
              max={59}
              value={state.minuteOfHour}
              onChange={(e) => update("minuteOfHour", clampInt(e.target.value, 0, 59, 0))}
              className={inputClass}
            />
          </label>
        )}

        {(state.pattern === "daily-at-time" ||
          state.pattern === "weekdays-at-time" ||
          state.pattern === "weekly-at-time" ||
          state.pattern === "monthly-at-time") && (
          <>
            <label className="block">
              <span className="text-sm font-medium">{t.hour}</span>
              <input
                type="number"
                min={0}
                max={23}
                value={state.hour}
                onChange={(e) => update("hour", clampInt(e.target.value, 0, 23, 0))}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">{t.minute}</span>
              <input
                type="number"
                min={0}
                max={59}
                value={state.minute}
                onChange={(e) => update("minute", clampInt(e.target.value, 0, 59, 0))}
                className={inputClass}
              />
            </label>
          </>
        )}

        {state.pattern === "weekly-at-time" && (
          <label className="block">
            <span className="text-sm font-medium">{t.weekday}</span>
            <select
              value={state.dayOfWeek}
              onChange={(e) => update("dayOfWeek", clampInt(e.target.value, 0, 6, 1))}
              className={inputClass}
            >
              {dayLabels.map((name, idx) => (
                <option key={name} value={idx}>{name}</option>
              ))}
            </select>
          </label>
        )}

        {state.pattern === "monthly-at-time" && (
          <label className="block">
            <span className="text-sm font-medium">{t.day}</span>
            <input
              type="number"
              min={1}
              max={31}
              value={state.dayOfMonth}
              onChange={(e) => update("dayOfMonth", clampInt(e.target.value, 1, 31, 1))}
              className={inputClass}
            />
          </label>
        )}
      </div>

      <div className="rounded-lg bg-accent p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">{t.expression}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <code className="rounded-md bg-background px-3 py-1.5 font-mono text-sm">{cron.expression}</code>
          <button
            type="button"
            onClick={onCopy}
            className="rounded-md border border-border bg-background px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-foreground hover:text-foreground"
          >
            {copied ? t.copied : t.copy}
          </button>
        </div>
        <p className="mt-3 text-sm text-muted">
          <span className="font-medium text-foreground">{t.explanation}: </span>
          {human}
        </p>
      </div>

      <div className="rounded-lg border border-border p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">notes</p>
        <p className="mt-1 text-sm text-muted">{t.timezoneNote}</p>
      </div>
    </div>
  );
}
