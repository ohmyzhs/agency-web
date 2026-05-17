import { pickWordWithoutRecent } from './word-defense-words';

export const BOSS_WORD_COUNT = 5;

export function buildBossMeteorWord(args: {
  pool: string[];
  recentWords: string[];
  wordCount?: number;
  random?: () => number;
}): string {
  const { pool, recentWords, wordCount = BOSS_WORD_COUNT, random = Math.random } = args;
  const selected: string[] = [];
  const localRecent = [...recentWords];

  while (selected.length < wordCount && pool.length > 0) {
    const next = pickWordWithoutRecent(pool, [...localRecent, ...selected], random);
    if (!next) break;
    selected.push(next);
    localRecent.push(next);
  }

  return selected.join(' ');
}

export function shouldSpawnBossAfterWaveTimer(args: {
  waveIdx: number;
  wavesToClear: number;
  bossActive: boolean;
}): boolean {
  return !args.bossActive && args.waveIdx <= args.wavesToClear;
}

export function resolveWaveAfterBossClear(args: { waveIdx: number; wavesToClear: number }): {
  nextWaveIdx: number;
  cleared: boolean;
} {
  const nextWaveIdx = args.waveIdx + 1;
  return {
    nextWaveIdx,
    cleared: args.waveIdx >= args.wavesToClear,
  };
}
