'use client';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { StatChip } from '../atoms/StatChip';
import { BestRibbon } from '../atoms/BestRibbon';
import { StageBadge } from '../atoms/StageBadge';
import type { LiveMetricsJamo } from '@/lib/typing/metrics-jamo';
import { STAGE_TARGET_TPM, evaluateStage } from '@/lib/typing/metrics-jamo';

type Props = {
  metrics: LiveMetricsJamo;
  stage: number;
  previousTpm: number | null;
  bestTpm: number | null;
  isNewBest: boolean;
  onNext: () => void;
  onRetry: () => void;
};

export function ResultPanel({
  metrics,
  stage,
  previousTpm,
  bestTpm,
  isNewBest,
  onNext,
  onRetry,
}: Props) {
  const reduced = useReducedMotion();
  const target = STAGE_TARGET_TPM[stage];
  const result = evaluateStage(metrics, stage);
  const tpm = Math.round(metrics.타분당);
  const accuracy = Math.round(metrics.정확도 * 100);

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
      className="rounded-xl border border-border bg-card p-6 space-y-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted">결과</p>
          <h3 className="mt-0.5 text-2xl font-bold">
            {result === 'pass' ? '통과! 🎉' : '완료'}
          </h3>
        </div>
        <StageBadge stage={stage} passed={result === 'pass'} />
      </div>

      <BestRibbon show={isNewBest} previousTpm={previousTpm ?? undefined} />

      {/* 4지표 비교 표 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatChip
          label="이번"
          value={`${tpm} 타/분`}
          highlight={isNewBest}
          size="md"
        />
        <StatChip
          label="직전"
          value={previousTpm !== null ? `${Math.round(previousTpm)} 타/분` : '—'}
          size="md"
        />
        <StatChip
          label="최고"
          value={bestTpm !== null ? `${Math.round(bestTpm)} 타/분` : '—'}
          size="md"
        />
        <StatChip
          label="목표"
          value={target ? `${target.tpm} 타/분` : '—'}
          size="md"
        />
      </div>

      {/* 정확도 */}
      <div className="flex items-center gap-4 rounded-lg border border-border bg-background px-4 py-3">
        <span className="text-sm text-muted">정확도</span>
        <span className="text-xl font-semibold tabular-nums">{accuracy}%</span>
        {target && (
          <span className="ml-auto text-xs text-muted">
            목표 {(target.accuracy * 100).toFixed(0)}%
            {metrics.정확도 >= target.accuracy
              ? ' ✓'
              : ` — ${(target.accuracy * 100 - accuracy).toFixed(0)}% 부족`}
          </span>
        )}
      </div>

      {/* 버튼 */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onNext}
          className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          다음 지문
        </button>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-card"
        >
          다시 시도
        </button>
      </div>
    </motion.div>
  );
}
