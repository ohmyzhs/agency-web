'use client';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type Props = {
  currentTpm: number;
  bestTpm: number | null;
  targetTpm: number;
};

export function LiveBestComparator({ currentTpm, bestTpm, targetTpm }: Props) {
  const reduced = useReducedMotion();
  const cur = Math.round(currentTpm);
  const best = bestTpm !== null ? Math.round(bestTpm) : null;
  const target = Math.round(targetTpm);

  const beatingBest = best !== null && cur > best;
  const beatingTarget = cur >= target;

  const max = Math.max(target, best ?? 0, cur, 1);
  const curPct = Math.min(100, (cur / max) * 100);
  const bestPct = best !== null ? Math.min(100, (best / max) * 100) : null;
  const targetPct = Math.min(100, (target / max) * 100);

  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-medium uppercase tracking-wider text-muted">실시간 비교</span>
        <span className={beatingBest ? 'font-semibold text-primary' : 'text-muted'}>
          {best !== null
            ? beatingBest
              ? `최고 +${cur - best}타`
              : `최고 −${best - cur}타`
            : '최고 기록 없음'}
        </span>
      </div>

      <div className="relative h-2 overflow-hidden rounded-full bg-background">
        <motion.div
          initial={reduced ? false : { width: 0 }}
          animate={{ width: `${curPct}%` }}
          transition={{ duration: 0.18 }}
          className={`absolute inset-y-0 left-0 rounded-full ${
            beatingTarget ? 'bg-primary' : 'bg-foreground/40'
          }`}
        />
        {bestPct !== null && (
          <div
            className="absolute inset-y-0 w-px bg-amber-400"
            style={{ left: `${bestPct}%` }}
            title={`최고 ${best}타`}
          />
        )}
        <div
          className="absolute inset-y-0 w-px bg-emerald-500"
          style={{ left: `${targetPct}%` }}
          title={`목표 ${target}타`}
        />
      </div>

      <div className="mt-1.5 flex justify-between text-[10px] tabular-nums text-muted">
        <span>0</span>
        <span className="font-semibold text-foreground">현재 {cur}타</span>
        <span>{Math.round(max)}</span>
      </div>
    </div>
  );
}
