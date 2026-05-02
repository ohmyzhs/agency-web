'use client';
/**
 * ModeShell — 타자연습 4+1 모드 공통 무대.
 * 카운트다운, 입력, 메트릭 바, 결과 패널을 통합한다.
 * 구 TypingApp을 대체한다.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTypingSession } from '@/stores/useTypingSession';
import { useTypingProgress } from '@/stores/useTypingProgress';
import { useTypingSettings } from '@/stores/useTypingSettings';
import { useDB } from '@/lib/typing/db/provider';
import {
  computeLiveMetricsJamo,
  sessionConfigKey,
  STAGE_TARGET_TPM,
  type LiveMetricsJamo,
} from '@/lib/typing/metrics-jamo';
import { upsertBestScoreIfBetter, configKeyFor } from '@/lib/typing/db/repositories/best-scores';
import { recordKeyHit } from '@/lib/typing/db/repositories/key-stats';
import { recordToday } from '@/lib/typing/db/repositories/streak';
import { useStageContent } from '@/hooks/useStageContent';
import { useNextExpectedKey } from '@/hooks/useNextExpectedKey';
import { useSoundFx } from '@/hooks/useSoundFx';
import { ChallengeBar } from '../atoms/ChallengeBar';
import { StatChip } from '../atoms/StatChip';
import { CountdownGate } from '../atoms/CountdownGate';
import { Confetti } from '../atoms/Confetti';
import { LiveBestComparator } from '../atoms/LiveBestComparator';
import { HandOverlay } from '../atoms/HandOverlay';
import { ResultPanel } from './ResultPanel';
import { LeftStatsRail } from './LeftStatsRail';
import { RightSettingsRail } from './RightSettingsRail';
import TargetText from '../TargetText';
import TypingInput from '../TypingInput';
import KoreanKeyboard from '../KoreanKeyboard';
import SegmentedTabs from '@/components/tools/shared/SegmentedTabs';
import type { TypingMode, TypingLanguage, StageLevel } from '@/lib/typing/types';

const MODE_OPTIONS: { value: TypingMode; label: string }[] = [
  { value: 'keyboard-zone', label: '자리연습' },
  { value: 'word',          label: '낱말연습' },
  { value: 'sentence',      label: '단문연습' },
  { value: 'longform',      label: '장문/필사' },
  { value: 'speed-test',    label: '속도측정' },
];

type SpeedDuration = 15 | 30 | 60 | 120;

type ModeShellProps = {
  /** Lock to a specific mode and hide mode tabs. Used by route-level pages. */
  lockedMode?: TypingMode;
  /** Lock the lesson id (e.g. zone lessonId or longform category). */
  lockedLessonId?: string;
};

export function ModeShell({ lockedMode, lockedLessonId }: ModeShellProps = {}) {
  const db = useDB();
  const { playKey, play } = useSoundFx();

  // ── session store ──
  const {
    phase, mode, language, stage, lessonId, typed, isComposing,
    target, startedAt, finishedAt, pendingKey,
    setMode, setLanguage, setStage, setLessonId,
    setTarget, setTyped, setIsComposing, setPendingKey,
    startCountdown, startSession, finishSession, reset: resetSession,
  } = useTypingSession();

  // ── settings ──
  const { showKeyboard, showHands, countdownEnabled, autoNextContent } = useTypingSettings();

  // ── progress ──
  const { bestScores, recentTpm, upsertBestScore, setRecentTpm } = useTypingProgress();

  // ── local ui state ──
  const [speedDuration, setSpeedDuration] = useState<SpeedDuration>(60);
  const [isNewBest, setIsNewBest] = useState(false);
  const [tick, setTick] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // ── content ──
  const { next: nextContent } = useStageContent({
    mode, stage: stage as StageLevel, language: language as TypingLanguage, lessonId,
  });

  const initTarget = useCallback(() => {
    const t = nextContent();
    setTarget(t, String(Date.now()));
  }, [nextContent, setTarget]);

  // first load & mode/stage/language change
  useEffect(() => {
    initTarget();
    setIsNewBest(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, language, stage, lessonId, speedDuration]);

  // honor route-locked mode / lessonId
  useEffect(() => {
    if (lockedMode && lockedMode !== mode) setMode(lockedMode);
  }, [lockedMode, mode, setMode]);
  useEffect(() => {
    if (lockedLessonId !== undefined && lockedLessonId !== lessonId) setLessonId(lockedLessonId);
  }, [lockedLessonId, lessonId, setLessonId]);

  // live tick
  useEffect(() => {
    if (phase !== 'running') return;
    const id = window.setInterval(() => setTick(n => n + 1), 200);
    return () => clearInterval(id);
  }, [phase]);

  // speed-test auto-finish
  useEffect(() => {
    if (mode !== 'speed-test' || phase !== 'running' || !startedAt) return;
    const rem = speedDuration * 1000 - (Date.now() - startedAt);
    if (rem <= 0) { doFinish(); return; }
    const id = window.setTimeout(() => doFinish(), rem);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, phase, startedAt, speedDuration, tick]);

  // ── metrics ──
  const metrics: LiveMetricsJamo = useMemo(
    () => computeLiveMetricsJamo({ target, typed, startedAt, finishedAt }),
    // tick keeps elapsed live
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [target, typed, startedAt, finishedAt, tick],
  );

  // ── keyboard hint ──
  const pendingKeyDef = useNextExpectedKey({ target, typed, mode });
  useEffect(() => {
    setPendingKey(pendingKeyDef);
  }, [pendingKeyDef, setPendingKey]);

  // ── finish logic ──
  const doFinish = useCallback(async () => {
    finishSession();
    play('complete').catch(() => {});

    if (!db) return;
    const fin = Date.now();
    const m = computeLiveMetricsJamo({ target, typed, startedAt, finishedAt: fin });
    const dur = m.elapsedSeconds;

    const sessionId = await db.insertSession({
      started_at: startedAt ?? fin,
      finished_at: fin,
      mode, language, stage,
      lesson_id: lessonId || null,
      content_seed: String(startedAt ?? fin),
      jamo_typed: m.jamoTyped,
      jamo_correct: m.jamoCorrect,
      tpm: m.타분당,
      tpm_raw: m.타분당Raw,
      accuracy: m.정확도,
      duration_seconds: dur,
    });

    const cfg = { mode, language, stage, lessonId };
    const { isNewBest: newBest, previous } = await upsertBestScoreIfBetter(
      db, cfg, sessionId, m.타분당, m.정확도, fin,
    );

    if (newBest) {
      setIsNewBest(true);
      play('best').catch(() => {});
      const key = configKeyFor(cfg);
      upsertBestScore(key, {
        config_key: key, session_id: sessionId,
        tpm: m.타분당, accuracy: m.정확도, finished_at: fin,
      });
    }

    setRecentTpm(m.타분당);
    await recordToday(db, dur).catch(() => {});

    if (dur > 0) {
      await recordKeyHit(db, '__session__', true, 0).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, target, typed, startedAt, mode, language, stage, lessonId]);

  // ── input handling ──
  const handleValueChange = useCallback((val: string) => {
    if (phase === 'finished') return;
    const clipped = mode === 'speed-test' ? val : val.slice(0, target.length);

    if (phase === 'idle' && clipped.length > 0) {
      startCountdown(); // phase → 'countdown' (or immediately 'running' via CountdownGate)
      setTyped(clipped);
      return;
    }

    if (phase === 'countdown') {
      // buffer typing during countdown
      setTyped(clipped);
      return;
    }

    if (phase !== 'running') return;
    if (clipped.length > typed.length) playKey().catch(() => {});
    setTyped(clipped);

    if (mode !== 'speed-test' && clipped.length >= target.length) {
      setTimeout(() => doFinish(), 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, mode, target.length, typed, setTyped, doFinish, startCountdown]);

  const handleCompositionChange = useCallback((c: boolean) => {
    setIsComposing(c);
  }, [setIsComposing]);

  const handleCountdownDone = useCallback(() => {
    startSession();
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [startSession]);

  const handleNext = useCallback(() => {
    resetSession();
    initTarget();
    setIsNewBest(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [resetSession, initTarget]);

  // ── config key for best score lookup ──
  const configKey = sessionConfigKey({ mode, language, stage, lessonId });
  const bestRow = bestScores[configKey];
  const bestTpm = bestRow?.tpm ?? null;

  // ── elapsed display ──
  const elapsedDisplay = useMemo(() => {
    if (mode === 'speed-test') {
      const rem = startedAt
        ? Math.max(0, Math.ceil((speedDuration * 1000 - (Date.now() - startedAt)) / 1000))
        : speedDuration;
      return `${rem}s`;
    }
    return `${Math.floor(metrics.elapsedSeconds)}s`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, startedAt, speedDuration, metrics.elapsedSeconds, tick]);

  const isRunning = phase === 'running';
  const isFinished = phase === 'finished';

  // Auto-advance to next content after a finished session (if enabled).
  // Skipped for speed-test (which doesn't have "next" the same way).
  useEffect(() => {
    if (!isFinished) return;
    if (!autoNextContent) return;
    if (mode === 'speed-test') return;
    const id = window.setTimeout(() => handleNext(), 1500);
    return () => window.clearTimeout(id);
  }, [isFinished, autoNextContent, mode, handleNext]);

  const stageTargetTpm = STAGE_TARGET_TPM[stage]?.tpm ?? stage;

  return (
    <div className="flex gap-6">
      <LeftStatsRail />

      <div className="min-w-0 flex-1 space-y-4">
      {/* Mode tabs — hidden when route locks the mode */}
      {!lockedMode && (
        <SegmentedTabs<TypingMode>
          ariaLabel="연습 모드"
          value={mode}
          onChange={m => { setMode(m); }}
          options={MODE_OPTIONS}
        />
      )}

      {/* Config row */}
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted">언어</p>
          <SegmentedTabs<TypingLanguage>
            ariaLabel="언어"
            value={language as TypingLanguage}
            onChange={l => setLanguage(l)}
            options={[{ value: 'ko', label: '한국어' }, { value: 'en', label: '영어' }]}
            size="sm"
          />
        </div>
        {mode === 'speed-test' && (
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted">시간</p>
            <SegmentedTabs<string>
              ariaLabel="시간"
              value={String(speedDuration)}
              onChange={v => setSpeedDuration(Number(v) as SpeedDuration)}
              options={[
                { value: '15', label: '15s' }, { value: '30', label: '30s' },
                { value: '60', label: '60s' }, { value: '120', label: '120s' },
              ]}
              size="sm"
            />
          </div>
        )}
        <button
          type="button"
          onClick={handleNext}
          className="ml-auto rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-card"
        >
          다시 시작 (Ctrl+Enter)
        </button>
      </div>

      {/* Challenge bar */}
      {language === 'ko' && (
        <ChallengeBar
          stage={stage}
          currentTpm={isFinished ? metrics.타분당 : undefined}
          onStageChange={s => setStage(s as StageLevel)}
          disabled={isRunning}
        />
      )}

      {/* Live metrics */}
      <div className="grid grid-cols-3 gap-2 rounded-lg border border-border bg-card p-3 text-center sm:grid-cols-4">
        <StatChip label="타/분" value={Math.round(metrics.타분당)} />
        <StatChip label="정확도" value={`${Math.round(metrics.정확도 * 100)}%`} />
        <StatChip
          label="최고"
          value={bestTpm !== null ? `${Math.round(bestTpm)}` : '—'}
        />
        <StatChip label="시간" value={elapsedDisplay} />
      </div>

      {/* Live best comparator — visible while running */}
      {isRunning && language === 'ko' && (
        <LiveBestComparator
          currentTpm={metrics.타분당}
          bestTpm={bestTpm}
          targetTpm={stageTargetTpm}
        />
      )}

      {/* Target text */}
      <TargetText target={target} typed={typed} isComposing={isComposing} />

      {/* Input */}
      <TypingInput
        ref={inputRef}
        value={typed}
        onValueChange={handleValueChange}
        onCompositionChange={handleCompositionChange}
        onKeyDownCapture={e => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            handleNext();
          }
        }}
        disabled={isFinished || phase === 'countdown'}
        ariaLabel="타자 입력"
        placeholder={
          phase === 'idle'
            ? '입력창을 클릭하고 타자를 시작하세요.'
            : phase === 'countdown'
            ? '잠시 대기...'
            : ''
        }
      />

      {/* On-screen keyboard */}
      {showKeyboard && (
        <KoreanKeyboard
          expectedKey={pendingKey}
          highlightZone={mode === 'keyboard-zone' ? (lessonId as import('@/lib/typing/korean-keyboard').ZoneId) : undefined}
          showHangul={language === 'ko'}
        />
      )}

      {/* Hand overlay — placeholder fingertip ring */}
      {showHands && (
        <HandOverlay expectedFinger={pendingKey?.finger} />
      )}

      {/* Countdown overlay */}
      <CountdownGate
        enabled={countdownEnabled}
        phase={phase}
        onStart={handleCountdownDone}
      />

      {/* Result */}
      {isFinished && (
        <ResultPanel
          metrics={metrics}
          stage={stage}
          previousTpm={recentTpm}
          bestTpm={bestTpm}
          isNewBest={isNewBest}
          onNext={handleNext}
          onRetry={() => {
            resetSession();
            setTyped('');
            setIsNewBest(false);
            setTimeout(() => inputRef.current?.focus(), 0);
          }}
        />
      )}

      {/* Confetti on new best */}
      <Confetti active={isNewBest && isFinished} />
      </div>

      <RightSettingsRail />
    </div>
  );
}
