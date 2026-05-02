'use client';
import { STAGE_TARGET_TPM, STAGE_LIST } from '@/lib/typing/metrics-jamo';

type Props = {
  stage: number;
  currentTpm?: number;
  achievedTpm?: number | null;
  onStageChange?: (stage: number) => void;
  disabled?: boolean;
};

const MIN_STAGE = 200;
const MAX_STAGE = 1200;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function pctForTpm(value: number) {
  return clamp(((value - MIN_STAGE) / (MAX_STAGE - MIN_STAGE)) * 100, 0, 100);
}

function tierLabel(stage: number) {
  if (stage >= 1100) return '마스터';
  if (stage >= 800) return '고급';
  if (stage >= 600) return '상승';
  if (stage >= 400) return '중급';
  return '입문';
}

export function ChallengeBar({ stage, currentTpm = 0, achievedTpm, onStageChange, disabled }: Props) {
  const activeTarget = STAGE_TARGET_TPM[stage];
  const targetTpm = activeTarget?.tpm ?? stage;
  const displayAchieved = Math.max(currentTpm, achievedTpm ?? 0);
  const targetPct = pctForTpm(targetTpm);
  const achievedPct = pctForTpm(displayAchieved);
  const gap = Math.max(0, targetTpm - displayAchieved);
  const reached = displayAchieved >= targetTpm;
  const targetAccuracy = activeTarget ? Math.round(activeTarget.accuracy * 100) : 0;

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="relative p-4 sm:p-5">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_30%)]" />
        <div className="relative flex flex-col gap-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">도전단계 · 200~1200타</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400 px-3 py-1 text-sm font-bold text-white shadow-sm">
                  목표 {targetTpm}타
                </span>
                <span className={`rounded-full px-3 py-1 text-sm font-semibold ${reached ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300' : 'bg-amber-500/15 text-amber-600 dark:text-amber-300'}`}>
                  달성 {Math.round(displayAchieved)}타
                </span>
                <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted">
                  {tierLabel(stage)} · 정확도 {targetAccuracy}%+
                </span>
              </div>
            </div>
            <div className="text-right text-xs text-muted">
              {reached ? (
                <p className="font-semibold text-emerald-600 dark:text-emerald-300">목표 초과 +{Math.round(displayAchieved - targetTpm)}타</p>
              ) : (
                <p>목표까지 <span className="font-semibold text-foreground">{Math.round(gap)}타</span></p>
              )}
              <p className="mt-1">막대에서 목표선과 현재 달성치를 바로 비교합니다.</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative h-7 overflow-hidden rounded-full border border-white/20 bg-background/80 shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-300/25 via-sky-400/25 to-emerald-400/25 dark:from-slate-700/50 dark:via-sky-500/20 dark:to-emerald-500/20" />
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400 shadow-[0_0_18px_rgba(56,189,248,0.45)] transition-[width] duration-300 ease-out"
                style={{ width: `${achievedPct}%` }}
              />
              <div
                className="absolute inset-y-[-3px] w-1 rounded-full bg-white shadow-[0_0_0_2px_rgba(15,23,42,0.18),0_0_18px_rgba(255,255,255,0.9)] transition-[left] duration-300"
                style={{ left: `calc(${targetPct}% - 2px)` }}
                title={`목표 ${targetTpm}타`}
              />
              <div className="absolute inset-0 flex items-center justify-between px-3 text-[10px] font-semibold text-white drop-shadow-sm">
                <span>200</span>
                <span>목표 {targetTpm}</span>
                <span>1200</span>
              </div>
            </div>
            <div className="relative h-4 text-[10px] text-muted">
              {STAGE_LIST.filter(s => s >= MIN_STAGE).map(s => (
                <span
                  key={s}
                  className="absolute -translate-x-1/2 tabular-nums"
                  style={{ left: `${pctForTpm(s)}%` }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {STAGE_LIST.filter(s => s >= MIN_STAGE).map(s => {
              const target = STAGE_TARGET_TPM[s];
              const isActive = s === stage;
              const passed = displayAchieved >= target.tpm;

              return (
                <button
                  key={s}
                  type="button"
                  disabled={disabled}
                  onClick={() => onStageChange?.(s)}
                  className={`group relative shrink-0 overflow-hidden rounded-full border px-3 py-1 text-xs font-semibold transition-all
                    ${isActive
                      ? 'border-transparent bg-foreground text-background shadow-sm'
                      : passed
                      ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-700 hover:border-emerald-500 dark:text-emerald-300'
                      : 'border-border bg-background/80 text-muted hover:border-primary/50 hover:text-foreground'
                    }
                    disabled:cursor-default disabled:opacity-70`}
                  title={`${s}타/분 (정확도 ${(target.accuracy * 100).toFixed(0)}% 이상)`}
                >
                  <span className="relative z-10 inline-flex items-center gap-1">
                    {s}타
                    {passed && <span aria-hidden="true">✓</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
