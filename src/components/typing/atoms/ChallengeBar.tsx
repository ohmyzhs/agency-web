'use client';
import { STAGE_TARGET_TPM, STAGE_LIST } from '@/lib/typing/metrics-jamo';

type Props = {
  stage: number;
  currentTpm?: number;
  onStageChange?: (stage: number) => void;
  disabled?: boolean;
};

export function ChallengeBar({ stage, currentTpm, onStageChange, disabled }: Props) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      <span className="shrink-0 text-xs font-medium uppercase tracking-wider text-muted">도전단계</span>
      <div className="flex gap-1">
        {STAGE_LIST.map(s => {
          const target = STAGE_TARGET_TPM[s];
          const isActive = s === stage;
          const passed = currentTpm !== undefined && currentTpm >= target.tpm;

          return (
            <button
              key={s}
              type="button"
              disabled={disabled}
              onClick={() => onStageChange?.(s)}
              className={`rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors
                ${isActive
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-background text-muted hover:border-primary/50 hover:text-foreground'
                }
                disabled:cursor-default`}
              title={`${s}타/분 (정확도 ${(target.accuracy * 100).toFixed(0)}% 이상)`}
            >
              {s}
              {passed && !isActive && (
                <span className="ml-0.5 text-green-500">✓</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
