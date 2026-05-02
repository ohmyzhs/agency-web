import type { TypingDB } from '../client';

export type SessionRow = {
  id: number;
  started_at: number;
  finished_at: number;
  mode: string;
  language: string;
  stage: number;
  lesson_id: string | null;
  content_seed: string;
  jamo_typed: number;
  jamo_correct: number;
  tpm: number;
  tpm_raw: number;
  accuracy: number;
  duration_seconds: number;
};

export async function insertSession(db: TypingDB, row: Omit<SessionRow, 'id'>): Promise<number> {
  return db.insertSession(row);
}

export async function getRecentSessions(db: TypingDB, limit = 20): Promise<SessionRow[]> {
  return (await db.getRecentSessions(limit)) as SessionRow[];
}
