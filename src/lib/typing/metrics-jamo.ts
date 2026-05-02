/**
 * "타" 단위 메트릭 — 한컴타자 표준 기반.
 * WPM/CPM은 이 파일에 없다.
 *
 * 기존 metrics.ts (CPM/WPM)는 레거시 TypingApp 호환용으로 유지.
 * 새 컴포넌트는 이 파일을 사용한다.
 */

import { countCorrectJamo, jamoCountOfText } from './jamo-count';

// ─── Stage targets (플랜 §B.3) ───────────────────────────────────────────────

export type StageDef = { tpm: number; accuracy: number };

export const STAGE_TARGET_TPM: Record<number, StageDef> = {
  100:  { tpm: 100,  accuracy: 0.85 },
  200:  { tpm: 200,  accuracy: 0.88 },
  400:  { tpm: 400,  accuracy: 0.90 },
  600:  { tpm: 600,  accuracy: 0.92 },
  800:  { tpm: 800,  accuracy: 0.94 },
  1000: { tpm: 1000, accuracy: 0.95 },
  1100: { tpm: 1100, accuracy: 0.96 },
  1200: { tpm: 1200, accuracy: 0.97 },
} as const;

export const STAGE_LIST = Object.keys(STAGE_TARGET_TPM).map(Number).sort((a, b) => a - b);

export const DEFAULT_STAGE = 400;

// ─── Live metrics type ───────────────────────────────────────────────────────

export type LiveMetricsJamo = {
  jamoTyped: number;
  jamoCorrect: number;
  jamoIncorrect: number;
  /** 정타 자모 기반 분당 타수 (한컴타자 표준 "타/분") */
  타분당: number;
  /** 전체 입력 자모 기반 Raw 분당 타수 */
  타분당Raw: number;
  /** 정확도 0~1 */
  정확도: number;
  elapsedSeconds: number;
};

export type MetricsInputJamo = {
  target: string;
  typed: string;
  startedAt: number | null;
  finishedAt: number | null;
};

// ─── Core computation ─────────────────────────────────────────────────────────

export function computeLiveMetricsJamo({
  target,
  typed,
  startedAt,
  finishedAt,
}: MetricsInputJamo): LiveMetricsJamo {
  const elapsedMs =
    startedAt === null ? 0 : (finishedAt ?? Date.now()) - startedAt;
  const elapsedSeconds = Math.max(elapsedMs / 1000, 0);
  const minutes = elapsedSeconds / 60;

  const { jamoCorrect, jamoIncorrect, jamoTyped } = countCorrectJamo(target, typed);

  const 타분당   = minutes > 0 ? jamoCorrect / minutes : 0;
  const 타분당Raw = minutes > 0 ? jamoTyped   / minutes : 0;
  const 정확도   = jamoTyped > 0 ? jamoCorrect / jamoTyped : 0;

  return {
    jamoTyped,
    jamoCorrect,
    jamoIncorrect,
    타분당,
    타분당Raw,
    정확도,
    elapsedSeconds,
  };
}

// ─── Stage evaluation ────────────────────────────────────────────────────────

export type StageResult = 'pass' | 'fail' | 'pending';

export function evaluateStage(
  metrics: LiveMetricsJamo,
  stage: number,
): StageResult {
  const target = STAGE_TARGET_TPM[stage];
  if (!target) return 'pending';
  if (metrics.타분당 >= target.tpm && metrics.정확도 >= target.accuracy) return 'pass';
  return 'fail';
}

// ─── Config key (for best score lookup) ──────────────────────────────────────

export type SessionConfig = {
  mode: string;
  language: string;
  stage: number;
  lessonId?: string;
};

export function sessionConfigKey(cfg: SessionConfig): string {
  return `${cfg.mode}:${cfg.language}:${cfg.stage}:${cfg.lessonId ?? 'default'}`;
}

// ─── Char-status for renderer (same semantics as metrics.ts statusFor) ────────

export type CharStatus = 'correct' | 'incorrect' | 'pending' | 'untyped';

export function statusForJamo(
  target: string,
  typed: string,
  isComposing: boolean,
): CharStatus[] {
  const out: CharStatus[] = [];
  const composingIndex = isComposing ? typed.length - 1 : -1;
  for (let i = 0; i < target.length; i++) {
    if (i >= typed.length) {
      out.push('untyped');
    } else if (i === composingIndex) {
      out.push('pending');
    } else if (typed[i] === target[i]) {
      out.push('correct');
    } else {
      out.push('incorrect');
    }
  }
  return out;
}

// ─── Text helpers ─────────────────────────────────────────────────────────────

export { jamoCountOfText };

/** "안녕하세요" → 11 검증용 */
export function verifyJamoCount(text: string): number {
  return jamoCountOfText(text);
}
