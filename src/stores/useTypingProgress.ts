/**
 * 타이핑 진행 통계 캐시 — wa-sqlite에서 hydrate.
 * 컴포넌트가 DB를 직접 쿼리하지 않고 이 스토어를 구독한다.
 */
import { create } from 'zustand';
import type { BestScoreRow } from '@/lib/typing/db/repositories/best-scores';
import type { KeyStatRow } from '@/lib/typing/db/repositories/key-stats';

type TypingProgressState = {
  bestScores: Record<string, BestScoreRow>;
  recentTpm: number | null;     // 직전 세션 타분당
  streakCount: number;
  weakestKeys: (KeyStatRow & { accuracy: number })[];
  isLoaded: boolean;
};

type TypingProgressActions = {
  setBestScores: (scores: Record<string, BestScoreRow>) => void;
  upsertBestScore: (configKey: string, score: BestScoreRow) => void;
  setRecentTpm: (tpm: number | null) => void;
  setStreakCount: (count: number) => void;
  setWeakestKeys: (keys: (KeyStatRow & { accuracy: number })[]) => void;
  setLoaded: () => void;
};

export const useTypingProgress = create<TypingProgressState & TypingProgressActions>((set) => ({
  bestScores: {},
  recentTpm: null,
  streakCount: 0,
  weakestKeys: [],
  isLoaded: false,

  setBestScores: (bestScores) => set({ bestScores }),
  upsertBestScore: (configKey, score) =>
    set((s) => ({ bestScores: { ...s.bestScores, [configKey]: score } })),
  setRecentTpm: (recentTpm) => set({ recentTpm }),
  setStreakCount: (streakCount) => set({ streakCount }),
  setWeakestKeys: (weakestKeys) => set({ weakestKeys }),
  setLoaded: () => set({ isLoaded: true }),
}));
