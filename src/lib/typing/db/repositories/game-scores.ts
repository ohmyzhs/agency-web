import type { TypingDB } from '../client';

export type GameScoreRow = {
  id: number;
  game: string;
  stage: number;
  score: number;
  wave: number;
  combo_max: number;
  finished_at: number;
};

export async function insertGameScore(
  db: TypingDB,
  row: Omit<GameScoreRow, 'id'>,
): Promise<number> {
  return db.insertGameScore(row);
}

export async function getTopGameScores(
  db: TypingDB,
  game: string,
  stage: number,
  limit = 10,
): Promise<GameScoreRow[]> {
  return (await db.getTopGameScores(game, stage, limit)) as GameScoreRow[];
}
