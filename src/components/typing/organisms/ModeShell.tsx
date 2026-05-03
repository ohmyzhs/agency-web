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
import { ZoneLessonSelector } from '../atoms/ZoneLessonSelector';
import { zoneLessons, type ZoneLessonId } from '@/lib/typing/packs';
import type { TypingMode, TypingLanguage, StageLevel, LongformCategory } from '@/lib/typing/types';
import { strokeForCode, type ZoneId } from '@/lib/typing/korean-keyboard';

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
  const finishScheduledRef = useRef(false);
  const intentionalFocusExitRef = useRef(false);

  const focusTypingInput = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    try {
      el.focus({ preventScroll: true });
    } catch {
      el.focus();
    }
    if (window.scrollX !== scrollX || window.scrollY !== scrollY) {
      window.scrollTo(scrollX, scrollY);
    }
  }, []);

  const focusTypingInputSoon = useCallback(() => {
    window.requestAnimationFrame(() => focusTypingInput());
  }, [focusTypingInput]);

  // ── content ──
  const { next: nextContent } = useStageContent({
    mode, stage: stage as StageLevel, language: language as TypingLanguage, lessonId,
    category: mode === 'longform' ? (lessonId as LongformCategory) : undefined,
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
    focusTypingInputSoon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, language, stage, lessonId, speedDuration]);

  // Keep the practice textarea as the active element during typing flow. Users
  // habitually press Space/Enter after a prompt; no implicit focus escape should
  // turn that into page scroll or button activation.
  useEffect(() => {
    if (phase === 'countdown') return;
    focusTypingInputSoon();
  }, [phase, target, focusTypingInputSoon]);

  // If focus drifts to page chrome while the user is still practicing, pull it
  // back without scrolling. Clicking explicit controls below temporarily opts out.
  useEffect(() => {
    const handleFocusIn = () => {
      if (intentionalFocusExitRef.current) return;
      const el = inputRef.current;
      if (!el || el.disabled) return;
      window.requestAnimationFrame(() => {
        const active = document.activeElement;
        if (active !== el && active instanceof HTMLElement) {
          const tag = active.tagName;
          if (tag === 'BUTTON' || tag === 'A' || tag === 'INPUT' || tag === 'SELECT') {
            focusTypingInput();
          }
        }
      });
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (intentionalFocusExitRef.current || event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key !== ' ' && event.key !== 'Enter') return;
      const el = inputRef.current;
      if (!el || el.disabled) return;
      const active = document.activeElement;
      if (active === el) return;
      if (active instanceof HTMLElement && active.isContentEditable) return;
      event.preventDefault();
      focusTypingInput();
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [focusTypingInput]);

  // honor route-locked mode / lessonId
  useEffect(() => {
    if (lockedMode && lockedMode !== mode) setMode(lockedMode);
  }, [lockedMode, mode, setMode]);

  // Sync lockedLessonId only when the prop itself changes (route navigation),
  // not whenever the in-memory lessonId drifts via the in-page selector.
  // Otherwise the selector would be reverted on every click.
  const lastLockedLessonRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (lockedLessonId === undefined) return;
    if (lockedLessonId === lastLockedLessonRef.current) return;
    lastLockedLessonRef.current = lockedLessonId;
    setLessonId(lockedLessonId);
  }, [lockedLessonId, setLessonId]);

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
  const doFinish = useCallback((completedTyped?: string) => {
    const fin = Date.now();
    const finalTyped = completedTyped ?? typed;
    const m = computeLiveMetricsJamo({ target, typed: finalTyped, startedAt, finishedAt: fin });
    const dur = m.elapsedSeconds;
    const stageGoal = STAGE_TARGET_TPM[stage];
    const passed = stageGoal ? m.타분당 >= stageGoal.tpm && m.정확도 >= stageGoal.accuracy : true;

    setLastResult({ tpm: m.타분당, accuracy: m.정확도, passed });
    setShowInlineResult(true);
    setCompletedCount(count => count + 1);
    play('complete').catch(() => {});

    if (mode === 'speed-test') {
      finishSession();
    } else {
      // Continuous flow: keep textarea enabled & focused, advance to a fresh target.
      const nextT = nextContent();
      setTarget(nextT, String(Date.now()));
      setIsNewBest(false);
      focusTypingInputSoon();
    }

    // Persist results without blocking UI continuity.
    if (!db) return;
    void (async () => {
      try {
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
      } catch {
        // swallow — UI continuity over diagnostics
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, target, typed, startedAt, mode, language, stage, lessonId, nextContent, focusTypingInputSoon]);

  // ── input handling ──
  const applyZoneStroke = useCallback((stroke: string) => {
    const state = useTypingSession.getState();
    const currentPhase = state.phase;
    const currentTyped = state.typed;
    const currentTarget = state.target;

    if (currentPhase === 'finished' || currentPhase === 'countdown') return;
    if (!stroke || stroke.length !== 1) return;

    const next = (currentPhase === 'idle' ? stroke : `${currentTyped}${stroke}`).slice(0, currentTarget.length);

    if (currentPhase === 'idle') {
      if (countdownEnabled) {
        startCountdown();
        return;
      }
      startSession();
      playKey().catch(() => {});
      setTyped(next);
      return;
    }

    if (currentPhase !== 'running') return;
    playKey().catch(() => {});
    setTyped(next);

    if (next.length >= currentTarget.length && !finishScheduledRef.current) {
      finishScheduledRef.current = true;
      setTimeout(() => {
        finishScheduledRef.current = false;
        doFinish(next);
      }, 0);
    }
  }, [
    countdownEnabled,
    startCountdown,
    startSession,
    playKey,
    setTyped,
    doFinish,
  ]);

  const handleValueChange = useCallback((val: string) => {
    if (phase === 'finished') return;
    if (mode === 'keyboard-zone') return;

    let nextVal = val;
    if (mode === 'sentence') {
      const latestTyped = useTypingSession.getState().typed;
      if (latestTyped.length === 0 || /^[ \r\n]+$/.test(latestTyped)) {
        nextVal = nextVal.replace(/^[ \r\n]+/, '');
        if (nextVal.length === 0) {
          setTyped('');
          focusTypingInput();
          return;
        }
      }
    }

    const clipped = mode === 'speed-test' ? nextVal : nextVal.slice(0, target.length);

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
      return;
    }

    if (phase === 'countdown') {
      // Countdown is a pre-start gate, not an input buffer.
      return;
    }

    if (phase !== 'running') return;
    if (clipped.length > typed.length) playKey().catch(() => {});
    setTyped(clipped);

    if (mode !== 'speed-test' && clipped.length >= target.length && !finishScheduledRef.current) {
      finishScheduledRef.current = true;
      setTimeout(() => {
        finishScheduledRef.current = false;
        doFinish(clipped);
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, mode, target.length, typed, setTyped, doFinish, startCountdown, startSession, countdownEnabled, focusTypingInput]);

  const handleCompositionChange = useCallback((c: boolean) => {
    setIsComposing(c);
  }, [setIsComposing]);

  const handleCountdownDone = useCallback(() => {
    startSession();
    focusTypingInputSoon();
  }, [startSession, focusTypingInputSoon]);

  const handleNext = useCallback(() => {
    intentionalFocusExitRef.current = true;
    initTarget();
    setIsNewBest(false);
    setShowInlineResult(false);
    window.setTimeout(() => {
      intentionalFocusExitRef.current = false;
      focusTypingInput();
    }, 0);
  }, [initTarget, focusTypingInput]);

  const handleRetry = useCallback(() => {
    intentionalFocusExitRef.current = true;
    const sameTarget = target;
    setTarget(sameTarget, String(Date.now()));
    setIsNewBest(false);
    setShowInlineResult(false);
    window.setTimeout(() => {
      intentionalFocusExitRef.current = false;
      focusTypingInput();
    }, 0);
  }, [target, setTarget, focusTypingInput]);

  const handleLessonSelect = useCallback((id: ZoneLessonId) => {
    intentionalFocusExitRef.current = true;
    setLessonId(id);
    window.setTimeout(() => {
      intentionalFocusExitRef.current = false;
      focusTypingInput();
    }, 0);
  }, [setLessonId, focusTypingInput]);

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

  // Auto-advance to next content after a finished session (if enabled).
  // Skipped for speed-test (which doesn't have "next" the same way).
  useEffect(() => {
    if (!isFinished) return;
    if (!autoNextContent) return;
    if (mode === 'speed-test') return;
    const id = window.setTimeout(() => handleNext(), 900);
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
          onMouseDown={() => { intentionalFocusExitRef.current = true; }}
          onBlur={() => { intentionalFocusExitRef.current = false; }}
          onClick={handleNext}
          className="ml-auto rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-card"
        >
          다음 지문 (Ctrl+Enter)
        </button>
      </div>

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

      {/* Zone lesson selector — only in keyboard-zone mode */}
      {mode === 'keyboard-zone' && (
        <ZoneLessonSelector
          value={(lessonId as ZoneLessonId) || zoneLessons[0].id}
          onSelect={handleLessonSelect}
          onInteractionStart={() => { intentionalFocusExitRef.current = true; }}
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
          {shouldAutoAdvance && !isFinished && (
            <span className="ml-auto text-xs text-muted">다음 지문으로 이어갑니다.</span>
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
          if (mode === 'keyboard-zone') {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
              e.preventDefault();
              handleNext();
              return;
            }
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            if (e.key === 'Backspace') {
              e.preventDefault();
              if (phase !== 'finished' && phase !== 'countdown') {
                setTyped(typed.slice(0, -1));
              }
              return;
            }
            const stroke = strokeForCode(e.code, e.shiftKey);
            if (stroke) {
              e.preventDefault();
              applyZoneStroke(stroke);
            }
            return;
          }

          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            handleNext();
            return;
          }
          // Once a non-speed-test session is captured as finished (rare —
          // we now stay in the running flow), or while idle waiting for the
          // next target, swallow Space/Enter so they cannot scroll the page
          // or activate buttons that may have stolen focus.
          if (isFinished && (e.key === ' ' || e.key === 'Enter')) {
            e.preventDefault();
          }
        }}
        disabled={phase === 'countdown'}
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
          highlightZone={
            mode === 'keyboard-zone' && lessonId && lessonId !== 'all'
              ? (lessonId as ZoneId)
              : undefined
          }
          showHangul={language === 'ko'}
        />
      )}

      {/* Hand overlay — placeholder fingertip ring */}
      {showHands && (
        <HandOverlay
          expectedFinger={pendingKey?.finger}
          shiftSide={pendingKey?.shiftSide}
          extraFingers={pendingKey?.extraFingers}
        />
      )}

      {/* Challenge bar — compact, below practice surface */}
      {language === 'ko' && (
        <ChallengeBar
          variant="compact"
          stage={stage}
          currentTpm={metrics.타분당}
          achievedTpm={lastResult?.tpm ?? bestTpm}
          onStageChange={s => setStage(s as StageLevel)}
          disabled={isRunning}
        />
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
