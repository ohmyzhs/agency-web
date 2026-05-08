"use client";

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
      initial={reduced ? false : { opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
      className="zhs-card p-1 bg-primary/5 shadow-2xl shadow-primary/10 overflow-hidden"
    >
      <div className="bg-card rounded-[1.4rem] p-6 md:p-8 space-y-8 border border-white/10 relative overflow-hidden">
        {/* Abstract Flare */}
        <div className="absolute top-0 right-0 h-40 w-40 bg-primary/10 rounded-full blur-[60px] -mr-20 -mt-20" />

        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted/60">Practice Complete</p>
            <h3 className="mt-2 text-3xl font-black text-foreground italic">
              {result === 'pass' ? 'TARGET PASSED! 🎉' : 'MISSION COMPLETE'}
            </h3>
          </div>
          <StageBadge stage={stage} passed={result === 'pass'} />
        </div>

        <BestRibbon show={isNewBest} previousTpm={previousTpm ?? undefined} />

        {/* High Impact Metrics */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 relative z-10">
          <StatChip
            label="Current"
            value={`${tpm}`}
            highlight={isNewBest}
            size="md"
          />
          <StatChip
            label="Previous"
            value={previousTpm !== null ? `${Math.round(previousTpm)}` : '—'}
            size="md"
          />
          <StatChip
            label="Personal Best"
            value={bestTpm !== null ? `${Math.round(bestTpm)}` : '—'}
            size="md"
          />
          <StatChip
            label="Target Goal"
            value={target ? `${target.tpm}` : '—'}
            size="md"
          />
        </div>

        {/* Accuracy Bar */}
        <div className="relative z-10">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] font-black text-muted/60 uppercase tracking-widest">Precision Level</span>
            <span className="text-2xl font-black text-foreground italic">{accuracy}%</span>
          </div>
          <div className="h-2 w-full bg-accent/30 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${accuracy}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full ${accuracy >= (target?.accuracy ?? 0.9) * 100 ? 'bg-primary' : 'bg-orange-500'}`}
            />
          </div>
          {target && (
            <p className="mt-3 text-[10px] font-bold text-muted/40 uppercase tracking-tighter">
              Minimum Requirement: {(target.accuracy * 100).toFixed(0)}%
              {metrics.정확도 < target.accuracy && ` — Needs ${(target.accuracy * 100 - accuracy).toFixed(0)}% improvement`}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 relative z-10">
          <button
            type="button"
            onClick={onNext}
            className="flex-1 rounded-2xl bg-foreground py-4 text-sm font-black uppercase tracking-widest text-background transition-all hover:bg-primary hover:text-white hover:scale-[1.02] active:scale-95 shadow-lg"
          >
            Advance to Next
          </button>
          <button
            type="button"
            onClick={onRetry}
            className="rounded-2xl border-2 border-border bg-card px-8 py-4 text-sm font-bold text-foreground transition-all hover:border-foreground hover:bg-accent active:scale-95"
          >
            Retry Track
          </button>
        </div>
      </div>
    </motion.div>
  );
}
