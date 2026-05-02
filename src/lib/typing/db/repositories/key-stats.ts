import type { TypingDB } from '../client';

export type KeyStatRow = {
  jamo: string;
  attempts: number;
  correct: number;
  total_latency_ms: number;
};

export type WeakKey = KeyStatRow & { accuracy: number; avg_latency_ms: number };

export async function getAllKeyStats(db: TypingDB): Promise<KeyStatRow[]> {
  return (await db.getAllKeyStats()) as KeyStatRow[];
}

export async function getWeakestKeys(db: TypingDB, limit = 5): Promise<WeakKey[]> {
  const rows = await getAllKeyStats(db);
  return rows
    .filter(r => r.attempts >= 5)
    .map(r => ({
      ...r,
      accuracy: r.attempts > 0 ? r.correct / r.attempts : 0,
      avg_latency_ms: r.attempts > 0 ? r.total_latency_ms / r.attempts : 0,
    }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, limit);
}

export async function recordKeyHit(
  db: TypingDB,
  jamo: string,
  correct: boolean,
  latencyMs: number,
): Promise<void> {
  await db.upsertKeyStats(jamo, 1, correct ? 1 : 0, latencyMs);
}
