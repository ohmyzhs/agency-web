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
  100:  { spawnIntervalMs: 1800, fallSpeed: 48,  maxConcurrent: 3, bonusEveryWave: 4, hpPenalty: 10 },
  200:  { spawnIntervalMs: 1600, fallSpeed: 58,  maxConcurrent: 3, bonusEveryWave: 4, hpPenalty: 12 },
  400:  { spawnIntervalMs: 1350, fallSpeed: 74,  maxConcurrent: 4, bonusEveryWave: 3, hpPenalty: 14 },
  600:  { spawnIntervalMs: 1150, fallSpeed: 90,  maxConcurrent: 5, bonusEveryWave: 3, hpPenalty: 16 },
  800:  { spawnIntervalMs: 980,  fallSpeed: 108, maxConcurrent: 5, bonusEveryWave: 3, hpPenalty: 18 },
  1000: { spawnIntervalMs: 850,  fallSpeed: 126, maxConcurrent: 6, bonusEveryWave: 2, hpPenalty: 21 },
  1100: { spawnIntervalMs: 760,  fallSpeed: 140, maxConcurrent: 7, bonusEveryWave: 2, hpPenalty: 24 },
  1200: { spawnIntervalMs: 680,  fallSpeed: 158, maxConcurrent: 8, bonusEveryWave: 2, hpPenalty: 28 },
};

export const WAVES_TO_CLEAR = 9;
export const WAVE_DURATION_MS = 22_000;

export const START_WAVES = [1, 3, 5, 7] as const;
export type StartWave = (typeof START_WAVES)[number];

export const SPECIAL_PROBABILITY = {
  red:    0.11,  // hp damage
  purple: 0.08,  // slow-mo 3s
  gold:   0.07,  // 2x score
};
