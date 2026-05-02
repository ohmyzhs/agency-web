import type { TypingDB } from '../client';
import type { TypingMode, TypingLanguage } from '../../types';

export type BestScoreRow = {
  config_key: string;
  session_id: number;
  tpm: number;
  accuracy: number;
  finished_at: number;
};

export type BestScoreConfig = {
  mode: TypingMode;
  language: TypingLanguage;
  stage: number;
  lessonId?: string;
};

export function configKeyFor(cfg: BestScoreConfig): string {
  return `${cfg.mode}:${cfg.language}:${cfg.stage}:${cfg.lessonId ?? 'default'}`;
}

export async function getBestScore(
  db: TypingDB,
  cfg: BestScoreConfig,
): Promise<BestScoreRow | null> {
  return (await db.getBestScore(configKeyFor(cfg))) as BestScoreRow | null;
}

export async function getAllBestScores(
  db: TypingDB,
): Promise<Record<string, BestScoreRow>> {
  const rows = (await db.getAllBestScores()) as BestScoreRow[];
  return Object.fromEntries(rows.map(r => [r.config_key, r]));
}

export async function upsertBestScoreIfBetter(
  db: TypingDB,
  cfg: BestScoreConfig,
  sessionId: number,
  tpm: number,
  accuracy: number,
  finishedAt: number,
): Promise<{ isNewBest: boolean; previous: BestScoreRow | null }> {
  const key = configKeyFor(cfg);
  const previous = (await db.getBestScore(key)) as BestScoreRow | null;
  if (!previous || tpm > previous.tpm) {
    await db.upsertBestScore(key, sessionId, tpm, accuracy, finishedAt);
    return { isNewBest: true, previous };
  }
  return { isNewBest: false, previous };
}
