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
    startCountdown, startSession, finishSession,
  } = useTypingSession();

  // ── settings ──
  const { showKeyboard, showHands, countdownEnabled, autoNextContent } = useTypingSettings();

  // ── progress ──
  const { bestScores, recentTpm, upsertBestScore, setRecentTpm } = useTypingProgress();

  // ── local ui state ──
  const [speedDuration, setSpeedDuration] = useState<SpeedDuration>(60);
  const [isNewBest, setIsNewBest] = useState(false);
  const [tick, setTick] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [showInlineResult, setShowInlineResult] = useState(false);
  const [lastResult, setLastResult] = useState<{ tpm: number; accuracy: number; passed: boolean } | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const finishingRef = useRef(false);

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
    setShowInlineResult(false);
    setLastResult(null);
    setCompletedCount(0);
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
  const doFinish = useCallback(async (completedTyped = typed) => {
    if (finishingRef.current) return;
    finishingRef.current = true;
    const fin = Date.now();
    const m = computeLiveMetricsJamo({ target, typed: completedTyped, startedAt, finishedAt: fin });
    const dur = m.elapsedSeconds;
    const stageGoal = STAGE_TARGET_TPM[stage];
    const passed = stageGoal ? m.타분당 >= stageGoal.tpm && m.정확도 >= stageGoal.accuracy : true;
    const continueInPlace = autoNextContent && mode !== 'speed-test';

    setLastResult({ tpm: m.타분당, accuracy: m.정확도, passed });
    setShowInlineResult(true);
    setCompletedCount(count => count + 1);
    play('complete').catch(() => {});

    if (continueInPlace) {
      // 연속 연습은 결과 화면/disabled 상태를 거치지 않는다. 현재 textarea
      // 포커스를 유지한 채 같은 자리에서 다음 지문만 교체한다.
      initTarget();
      setTimeout(() => {
        finishingRef.current = false;
        inputRef.current?.focus();
      }, 0);
    } else {
      finishSession();
      finishingRef.current = false;
    }

    if (!db) return;

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
    const { isNewBest: newBest } = await upsertBestScoreIfBetter(
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
  }, [db, target, typed, startedAt, mode, language, stage, lessonId, autoNextContent, initTarget]);

  // ── input handling ──
  const handleValueChange = useCallback((val: string) => {
    if (phase === 'finished') return;
    const clipped = mode === 'speed-test' ? val : val.slice(0, target.length);

    if (phase === 'idle' && clipped.length > 0) {
      if (countdownEnabled) {
        // Optional benchmark-style pre-start countdown. Do not trap a user who
        // already started typing unless they explicitly enabled it.
        startCountdown();
        return;
      }
      startSession();
      playKey().catch(() => {});
      setTyped(clipped);
      if (mode !== 'speed-test' && clipped.length >= target.length) {
        setTimeout(() => doFinish(clipped), 0);
      }
      return;
    }

    if (phase === 'countdown') {
      // Countdown is a pre-start gate, not an input buffer.
      return;
    }

    if (phase !== 'running') return;
    if (clipped.length > typed.length) playKey().catch(() => {});
    setTyped(clipped);

    if (mode !== 'speed-test' && clipped.length >= target.length) {
      setTimeout(() => doFinish(clipped), 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, mode, target.length, typed, setTyped, doFinish, startCountdown, startSession, countdownEnabled]);

  const handleCompositionChange = useCallback((c: boolean) => {
    setIsComposing(c);
  }, [setIsComposing]);

  const handleCountdownDone = useCallback(() => {
    startSession();
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [startSession]);

  const handleNext = useCallback(() => {
    initTarget();
    setIsNewBest(false);
    setShowInlineResult(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [initTarget]);

  const handleRetry = useCallback(() => {
    const sameTarget = target;
    setTarget(sameTarget, String(Date.now()));
    setIsNewBest(false);
    setShowInlineResult(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [target, setTarget]);

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
  const shouldAutoAdvance = autoNextContent && mode !== 'speed-test';
  const progressLabel = shouldAutoAdvance
    ? `연속 연습 중 · ${completedCount}개 완료`
    : `${completedCount}개 완료`;

  // 연속 연습은 doFinish()에서 즉시 같은 자리의 다음 지문으로 교체한다.
  // 여기서 별도 타이머를 두면 textarea가 disabled 되는 finished 화면을 거쳐
  // 사용자가 말한 "화면이동"처럼 느껴진다.

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
          다음 지문 (Ctrl+Enter)
        </button>
      </div>

      {/* Challenge bar */}
      {language === 'ko' && (
        <ChallengeBar
          stage={stage}
          currentTpm={metrics.타분당}
          achievedTpm={lastResult?.tpm ?? bestTpm}
          onStageChange={s => setStage(s as StageLevel)}
          disabled={isRunning}
        />
      )}

      {/* Live metrics */}
      <div className="grid grid-cols-3 gap-2 rounded-lg border border-border bg-card p-3 text-center sm:grid-cols-5">
        <StatChip label="타/분" value={Math.round(metrics.타분당)} />
        <StatChip label="정확도" value={`${Math.round(metrics.정확도 * 100)}%`} />
        <StatChip
          label="최고"
          value={bestTpm !== null ? `${Math.round(bestTpm)}` : '—'}
        />
        <StatChip label="시간" value={elapsedDisplay} />
        <StatChip label="흐름" value={progressLabel} />
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
      <TargetText target={target} typed={typed} isComposing={isComposing} mode={mode} />

      {showInlineResult && lastResult && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 text-sm">
          <span className="font-semibold text-foreground">
            {lastResult.passed ? '목표 통과' : '완료'} · {Math.round(lastResult.tpm)}타/분
          </span>
          <span className="text-muted">정확도 {Math.round(lastResult.accuracy * 100)}%</span>
          {shouldAutoAdvance && (
            <span className="ml-auto text-xs text-muted">포커스를 유지한 채 다음 지문으로 이어졌습니다.</span>
          )}
        </div>
      )}

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
            ? countdownEnabled
              ? '준비되면 첫 글자를 누르세요. 카운트다운 후 시작합니다.'
              : '바로 입력하세요. 첫 타부터 기록합니다.'
            : phase === 'countdown'
            ? '카운트다운 중입니다. 잠시 후 입력하세요.'
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
      {isFinished && !shouldAutoAdvance && (
        <ResultPanel
          metrics={metrics}
          stage={stage}
          previousTpm={recentTpm}
          bestTpm={bestTpm}
          isNewBest={isNewBest}
          onNext={handleNext}
          onRetry={handleRetry}
        />
      )}

      {/* Confetti on new best */}
      <Confetti active={isNewBest && isFinished} />
      </div>

      <RightSettingsRail />
    </div>
  );
}
