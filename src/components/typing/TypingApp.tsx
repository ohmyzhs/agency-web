"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SegmentedTabs from "@/components/tools/shared/SegmentedTabs";
import { useLocale } from "@/components/providers";
import KoreanKeyboard from "./KoreanKeyboard";
import TargetText from "./TargetText";
import TypingInput from "./TypingInput";
import ProblemKeys from "./ProblemKeys";
import { computeLiveMetrics } from "@/lib/typing/metrics";
import {
  buildWordStream,
  englishPassages,
  englishSentences,
  koreanPassages,
  koreanSentences,
  pickRandom,
  zoneLessons,
  type ZoneLessonId,
} from "@/lib/typing/packs";
import {
  decomposeForKeystrokes,
  getKeyByCode,
  codeForHangul,
  type KeyDef,
  type ZoneId,
} from "@/lib/typing/korean-keyboard";
import {
  loadKeyStats,
  mergeKeyStats,
  recordPracticeSeconds,
  saveBestIfBetter,
  loadBestScores,
  bestKey,
} from "@/lib/typing/storage";
import type { PerKeyStat, TypingLanguage, TypingMode, TypingResult } from "@/lib/typing/types";

type SpeedDuration = 15 | 30 | 60 | 120;

type ZoneState = {
  lessonId: ZoneLessonId;
};

type SpeedState = {
  duration: SpeedDuration;
};

const MODE_OPTIONS_KO: { value: TypingMode; label: string }[] = [
  { value: "keyboard-zone", label: "자리연습" },
  { value: "word", label: "낱말연습" },
  { value: "sentence", label: "단문연습" },
  { value: "longform", label: "장문/필사" },
  { value: "speed-test", label: "60초 속도" },
];

const MODE_OPTIONS_EN: { value: TypingMode; label: string }[] = [
  { value: "keyboard-zone", label: "Zones" },
  { value: "word", label: "Words" },
  { value: "sentence", label: "Sentence" },
  { value: "longform", label: "Long-form" },
  { value: "speed-test", label: "Speed" },
];

export default function TypingApp() {
  const { locale } = useLocale();
  const lang = locale;

  const [mode, setMode] = useState<TypingMode>("sentence");
  const [language, setLanguage] = useState<TypingLanguage>("ko");
  const [zone, setZone] = useState<ZoneState>({ lessonId: "home" });
  const [speed, setSpeed] = useState<SpeedState>({ duration: 60 });

  const [target, setTarget] = useState<string>("");
  const [typed, setTyped] = useState<string>("");
  const [isComposing, setIsComposing] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const [pendingExpected, setPendingExpected] = useState<KeyDef | undefined>(undefined);
  const [perKeyAccum, setPerKeyAccum] = useState<Record<string, PerKeyStat>>({});
  const [storedKeyStats, setStoredKeyStats] = useState<Record<string, PerKeyStat>>({});
  const [bestNote, setBestNote] = useState<string | null>(null);
  const [tick, setTick] = useState(0); // forces live metrics re-render
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Build initial target & refresh whenever mode/lesson/duration/language changes.
  const generateTarget = useCallback((): string => {
    if (mode === "keyboard-zone") {
      const lesson = zoneLessons.find((l) => l.id === zone.lessonId) ?? zoneLessons[0];
      return lesson.drill;
    }
    if (mode === "word") {
      return buildWordStream(language, 25);
    }
    if (mode === "sentence") {
      const pool = language === "ko" ? koreanSentences : englishSentences;
      return pickRandom(pool);
    }
    if (mode === "longform") {
      const pool = language === "ko" ? koreanPassages : englishPassages;
      return pickRandom(pool);
    }
    // speed-test
    return buildWordStream(language, 60);
  }, [mode, zone.lessonId, language]);

  const reset = useCallback(
    (nextTarget?: string) => {
      const t = nextTarget ?? generateTarget();
      setTarget(t);
      setTyped("");
      setStartedAt(null);
      setFinishedAt(null);
      setIsComposing(false);
      setPerKeyAccum({});
      setBestNote(null);
      setPendingExpected(undefined);
      setTick((n) => n + 1);
      setTimeout(() => inputRef.current?.focus(), 0);
    },
    [generateTarget],
  );

  // Reset whenever core config changes.
  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, language, zone.lessonId, speed.duration]);

  // Load stored per-key stats once.
  useEffect(() => {
    setStoredKeyStats(loadKeyStats());
  }, []);

  // Live tick for metrics while running.
  useEffect(() => {
    if (startedAt === null || finishedAt !== null) return;
    const id = window.setInterval(() => setTick((n) => n + 1), 250);
    return () => window.clearInterval(id);
  }, [startedAt, finishedAt]);

  // Speed-test auto-finish on duration elapsed.
  useEffect(() => {
    if (mode !== "speed-test" || startedAt === null || finishedAt !== null) return;
    const remaining = speed.duration * 1000 - (Date.now() - startedAt);
    if (remaining <= 0) {
      finish();
      return;
    }
    const id = window.setTimeout(() => finish(), remaining);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, startedAt, finishedAt, speed.duration, tick]);

  const liveMetrics = useMemo(
    () =>
      computeLiveMetrics({
        target,
        typed,
        startedAt,
        finishedAt,
      }),
    // tick keeps elapsed updated
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [target, typed, startedAt, finishedAt, tick],
  );

  const isRunning = startedAt !== null && finishedAt === null;

  // Determine the next expected jamo/letter for keyboard hinting.
  useEffect(() => {
    if (mode === "keyboard-zone") {
      // For zone drills the target is jamo characters separated by spaces.
      // The next expected character is the next non-space char in target after typed.length.
      const nextChar = target[typed.length];
      if (!nextChar) {
        setPendingExpected(undefined);
        return;
      }
      if (nextChar === " ") {
        setPendingExpected(undefined);
        return;
      }
      const code = codeForHangul(nextChar);
      setPendingExpected(code ? getKeyByCode(code) : undefined);
    } else {
      // For composed text we hint based on the next jamo in the next syllable.
      const remainingTarget = target.slice(typed.length);
      const seq = decomposeForKeystrokes(remainingTarget);
      const next = seq[0];
      if (!next || next === " ") {
        setPendingExpected(undefined);
        return;
      }
      const code = codeForHangul(next);
      setPendingExpected(code ? getKeyByCode(code) : undefined);
    }
  }, [target, typed, mode]);

  const finish = useCallback(() => {
    const fin = Date.now();
    setFinishedAt(fin);
    const m = computeLiveMetrics({ target, typed, startedAt, finishedAt: fin });
    const result: TypingResult = {
      mode,
      language,
      durationSeconds:
        mode === "speed-test" ? speed.duration : Math.round(m.elapsedSeconds),
      typedChars: m.typedChars,
      correctChars: m.correctChars,
      incorrectChars: m.incorrectChars,
      uncorrectedErrors: m.incorrectChars,
      rawCpm: m.rawCpm,
      cpm: m.cpm,
      wpm: m.wpm,
      accuracy: m.accuracy,
      finishedAt: fin,
      lessonId: mode === "keyboard-zone" ? zone.lessonId : "default",
    };
    // Merge per-key stats.
    const perKeyArr = Object.values(perKeyAccum);
    if (perKeyArr.length > 0) {
      mergeKeyStats(perKeyArr);
      setStoredKeyStats(loadKeyStats());
    }
    if (m.elapsedSeconds > 0) {
      recordPracticeSeconds(m.elapsedSeconds);
    }
    const { isNewBest, previous } = saveBestIfBetter(result);
    if (isNewBest) {
      setBestNote(
        lang === "ko"
          ? `🎉 새 최고 기록! 이전: ${previous ? Math.round(previous.cpm) + " CPM" : "없음"}`
          : `🎉 New personal best! Previous: ${previous ? Math.round(previous.cpm) + " CPM" : "none"}`,
      );
    } else if (previous) {
      setBestNote(
        lang === "ko"
          ? `현재 최고: ${Math.round(previous.cpm)} CPM · ${(previous.accuracy * 100).toFixed(0)}%`
          : `Current best: ${Math.round(previous.cpm)} CPM · ${(previous.accuracy * 100).toFixed(0)}%`,
      );
    }
  }, [target, typed, startedAt, mode, language, speed.duration, zone.lessonId, perKeyAccum, lang]);

  const handleValueChange = useCallback(
    (next: string) => {
      // Don't allow typing past target length.
      const clipped = next.slice(0, target.length);
      if (startedAt === null && clipped.length > 0) {
        setStartedAt(Date.now());
      }
      setTyped(clipped);
      // Auto-finish for non-speed modes when target is fully matched.
      if (
        mode !== "speed-test" &&
        clipped.length >= target.length &&
        finishedAt === null
      ) {
        // Defer one tick so state settles before finish.
        setTimeout(() => finish(), 0);
      }
    },
    [target, startedAt, finishedAt, mode, finish],
  );

  // Track physical keystrokes for per-key stats.
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (finishedAt !== null) return;
      const code = e.code;
      // Skip modifiers / non-printable.
      if (
        e.metaKey ||
        e.ctrlKey ||
        e.altKey ||
        ["Shift", "Alt", "Control", "Meta", "CapsLock", "Tab", "Escape", "Backspace", "Enter", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)
      ) {
        return;
      }
      const def = getKeyByCode(code);
      if (!def) return;
      const expected = pendingExpected;
      const correct = expected ? expected.code === code : false;
      const labelKey = def.hangul ?? def.base;
      setPerKeyAccum((prev) => {
        const cur = prev[labelKey] ?? { key: labelKey, attempts: 0, correct: 0 };
        return {
          ...prev,
          [labelKey]: {
            key: labelKey,
            attempts: cur.attempts + 1,
            correct: cur.correct + (correct ? 1 : 0),
          },
        };
      });
    },
    [pendingExpected, finishedAt],
  );

  const elapsedDisplay = useMemo(() => {
    if (mode === "speed-test") {
      const remainingMs =
        startedAt === null ? speed.duration * 1000 : speed.duration * 1000 - (Date.now() - startedAt);
      const remaining = Math.max(0, Math.ceil(remainingMs / 1000));
      return `${remaining}s`;
    }
    return `${Math.floor(liveMetrics.elapsedSeconds)}s`;
    // tick re-renders this
  }, [mode, startedAt, speed.duration, liveMetrics.elapsedSeconds]);

  const modeOptions = lang === "ko" ? MODE_OPTIONS_KO : MODE_OPTIONS_EN;

  const labels = useMemo(() => {
    if (lang === "ko") {
      return {
        languageLabel: "언어",
        ko: "한국어",
        en: "영어",
        zoneLabel: "자리",
        durationLabel: "시간",
        restart: "다시 시작 (Tab+Enter)",
        nextLesson: "다음 지문",
        wpm: "WPM",
        cpm: "CPM",
        rawCpm: "Raw CPM",
        accuracy: "정확도",
        time: "시간",
        result: "결과",
        bestForConfig: "이 설정의 최고 기록",
        completed: "완료!",
        startHint: "아래 입력창을 클릭하고 타자를 시작하세요.",
        ime: "한글 IME 사용 중에는 조합 중인 글자가 노란색으로 표시됩니다.",
        weakKeysTitle: "내 약점 키",
      };
    }
    return {
      languageLabel: "Language",
      ko: "Korean",
      en: "English",
      zoneLabel: "Zone",
      durationLabel: "Duration",
      restart: "Restart (Tab+Enter)",
      nextLesson: "Next prompt",
      wpm: "WPM",
      cpm: "CPM",
      rawCpm: "Raw CPM",
      accuracy: "Accuracy",
      time: "Time",
      result: "Result",
      bestForConfig: "Personal best for this setup",
      completed: "Done!",
      startHint: "Click the input below and start typing to begin.",
      ime: "While the Korean IME is composing, the current syllable is shown in yellow rather than red.",
      weakKeysTitle: "Your problem keys",
    };
  }, [lang]);

  // Tab+Enter restart shortcut.
  const handleKeyShortcut = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        reset();
      }
      handleKeyDown(e);
    },
    [reset, handleKeyDown],
  );

  // Mode/locale-aware best-score display for the active configuration.
  useEffect(() => {
    if (bestNote) return;
    const all = loadBestScores();
    const key = bestKey({
      mode,
      language,
      durationSeconds: mode === "speed-test" ? speed.duration : 0,
      lessonId: mode === "keyboard-zone" ? zone.lessonId : "default",
    });
    const prev = all[key];
    if (prev) {
      setBestNote(
        lang === "ko"
          ? `${labels.bestForConfig}: ${Math.round(prev.cpm)} CPM · ${(prev.accuracy * 100).toFixed(0)}%`
          : `${labels.bestForConfig}: ${Math.round(prev.cpm)} CPM · ${(prev.accuracy * 100).toFixed(0)}%`,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, language, speed.duration, zone.lessonId]);

  return (
    <div className="space-y-5">
      {/* Mode switcher */}
      <SegmentedTabs<TypingMode>
        ariaLabel={lang === "ko" ? "연습 모드" : "Practice mode"}
        value={mode}
        onChange={(next) => setMode(next)}
        options={modeOptions}
      />

      {/* Mode-specific config */}
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted">
            {labels.languageLabel}
          </p>
          <SegmentedTabs<TypingLanguage>
            ariaLabel={labels.languageLabel}
            value={language}
            onChange={setLanguage}
            options={[
              { value: "ko", label: labels.ko },
              { value: "en", label: labels.en },
            ]}
            size="sm"
          />
        </div>
        {mode === "keyboard-zone" && (
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted">
              {labels.zoneLabel}
            </p>
            <select
              value={zone.lessonId}
              onChange={(e) => setZone({ lessonId: e.target.value as ZoneLessonId })}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              {zoneLessons.map((l) => (
                <option key={l.id} value={l.id}>
                  {lang === "ko" ? l.titleKo : l.titleEn}
                </option>
              ))}
            </select>
          </div>
        )}
        {mode === "speed-test" && (
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted">
              {labels.durationLabel}
            </p>
            <SegmentedTabs<string>
              ariaLabel={labels.durationLabel}
              value={String(speed.duration)}
              onChange={(v) => setSpeed({ duration: Number(v) as SpeedDuration })}
              options={[
                { value: "15", label: "15s" },
                { value: "30", label: "30s" },
                { value: "60", label: "60s" },
                { value: "120", label: "120s" },
              ]}
              size="sm"
            />
          </div>
        )}
        <button
          type="button"
          onClick={() => reset()}
          className="ml-auto rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-card"
        >
          {labels.restart}
        </button>
      </div>

      {/* Live metrics bar */}
      <div className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-card p-3 text-center sm:grid-cols-4">
        <Stat label={labels.wpm} value={Math.round(liveMetrics.wpm).toString()} />
        <Stat label={labels.cpm} value={Math.round(liveMetrics.cpm).toString()} />
        <Stat
          label={labels.accuracy}
          value={`${Math.round((liveMetrics.accuracy || 0) * 100)}%`}
        />
        <Stat label={labels.time} value={elapsedDisplay} />
      </div>

      {/* Target text */}
      <TargetText target={target} typed={typed} isComposing={isComposing} />

      {/* Input */}
      <TypingInput
        ref={inputRef}
        value={typed}
        onValueChange={handleValueChange}
        onCompositionChange={setIsComposing}
        onKeyDownCapture={handleKeyShortcut}
        disabled={finishedAt !== null}
        ariaLabel={lang === "ko" ? "타자 입력" : "Typing input"}
        placeholder={isRunning ? "" : labels.startHint}
      />

      <p className="text-xs text-muted">{labels.ime}</p>

      {/* On-screen keyboard */}
      <KoreanKeyboard
        expectedKey={pendingExpected}
        highlightZone={mode === "keyboard-zone" ? mapLessonToZone(zone.lessonId) : undefined}
        showHangul={language === "ko"}
      />

      {/* Result */}
      {finishedAt !== null && (
        <div
          aria-live="polite"
          className="rounded-lg border border-border bg-accent p-5"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            {labels.result}
          </p>
          <h3 className="mt-1 text-2xl font-bold">{labels.completed}</h3>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <Stat label={labels.wpm} value={Math.round(liveMetrics.wpm).toString()} />
            <Stat label={labels.cpm} value={Math.round(liveMetrics.cpm).toString()} />
            <Stat
              label={labels.rawCpm}
              value={Math.round(liveMetrics.rawCpm).toString()}
            />
            <Stat
              label={labels.accuracy}
              value={`${Math.round((liveMetrics.accuracy || 0) * 100)}%`}
            />
          </div>
          {bestNote && <p className="mt-3 text-sm">{bestNote}</p>}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => reset()}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
            >
              {labels.nextLesson}
            </button>
          </div>
        </div>
      )}

      {/* Problem keys */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
          {labels.weakKeysTitle}
        </p>
        <ProblemKeys stats={storedKeyStats} language={lang} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-0.5 text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function mapLessonToZone(id: ZoneLessonId): ZoneId | undefined {
  if (id === "all") return undefined;
  return id;
}
