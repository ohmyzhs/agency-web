/**
 * Stage-tuned parameters for WordDefense.
 * Tuned to match the StageLevel curve (100 = forgiving, 1200 = brutal).
 */
import type { StageLevel } from '@/lib/typing/types';

export type StageConfig = {
  spawnIntervalMs: number;
  fallSpeed: number;       // px / sec
  maxConcurrent: number;
  bonusEveryWave: number;  // bonus round every N waves
  hpPenalty: number;
};

export const STAGE_CONFIG: Record<StageLevel, StageConfig> = {
  100:  { spawnIntervalMs: 2400, fallSpeed: 30,  maxConcurrent: 2, bonusEveryWave: 4, hpPenalty: 8  },
  200:  { spawnIntervalMs: 2200, fallSpeed: 38,  maxConcurrent: 3, bonusEveryWave: 4, hpPenalty: 10 },
  400:  { spawnIntervalMs: 1900, fallSpeed: 50,  maxConcurrent: 3, bonusEveryWave: 3, hpPenalty: 12 },
  600:  { spawnIntervalMs: 1700, fallSpeed: 62,  maxConcurrent: 4, bonusEveryWave: 3, hpPenalty: 14 },
  800:  { spawnIntervalMs: 1500, fallSpeed: 75,  maxConcurrent: 4, bonusEveryWave: 3, hpPenalty: 16 },
  1000: { spawnIntervalMs: 1300, fallSpeed: 88,  maxConcurrent: 5, bonusEveryWave: 2, hpPenalty: 18 },
  1100: { spawnIntervalMs: 1200, fallSpeed: 96,  maxConcurrent: 5, bonusEveryWave: 2, hpPenalty: 20 },
  1200: { spawnIntervalMs: 1100, fallSpeed: 105, maxConcurrent: 6, bonusEveryWave: 2, hpPenalty: 22 },
};

export const WAVES_TO_CLEAR = 7;
export const WAVE_DURATION_MS = 30_000;

export const SPECIAL_PROBABILITY = {
  red:    0.07,  // hp damage
  purple: 0.05,  // slow-mo 3s
  gold:   0.04,  // 2x score
};
