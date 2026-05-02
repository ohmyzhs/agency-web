/**
 * One-time migration from localStorage v1 keys to wa-sqlite DB.
 * Runs once per browser; writes settings.migrated_v1=true on completion.
 */
import type { TypingDB } from '../client';
import type { TypingResult, PerKeyStat } from '../../types';

const BEST_KEY = 'ohmyzhs:typing:best:v1';
const KEYSTAT_KEY = 'ohmyzhs:typing:keystats:v1';
const STREAK_KEY = 'ohmyzhs:typing:streak:v1';
const MIGRATED_MARKER = 'migrated_v1';

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

export async function migrateFromLocalStorageV1(db: TypingDB): Promise<void> {
  if (typeof window === 'undefined') return;

  const already = await db.getSetting(MIGRATED_MARKER);
  if (already === 'true') return;

  let ls: Storage;
  try { ls = window.localStorage; } catch { return; }

  const now = Date.now();

  // Migrate best scores ─────────────────────────────────────────────────────
  const bestScores = safeParse<Record<string, TypingResult>>(ls.getItem(BEST_KEY), {});
  for (const [configKey, result] of Object.entries(bestScores)) {
    if (result.accuracy < 0.8) continue;
    // Insert a synthetic session row for each best score.
    const sessionId = await db.insertSession({
      started_at: result.finishedAt - result.durationSeconds * 1000,
      finished_at: result.finishedAt,
      mode: result.mode,
      language: result.language,
      stage: 0,
      lesson_id: result.lessonId ?? null,
      content_seed: 'v1-migration',
      jamo_typed: result.typedChars,
      jamo_correct: result.correctChars,
      tpm: result.cpm,
      tpm_raw: result.rawCpm,
      accuracy: result.accuracy,
      duration_seconds: result.durationSeconds,
    });
    await db.upsertBestScore(configKey, sessionId, result.cpm, result.accuracy, result.finishedAt);
  }

  // Migrate key stats ────────────────────────────────────────────────────────
  const keyStats = safeParse<Record<string, PerKeyStat>>(ls.getItem(KEYSTAT_KEY), {});
  for (const stat of Object.values(keyStats)) {
    await db.upsertKeyStats(stat.key, stat.attempts, stat.correct, 0);
  }

  // Migrate streak ───────────────────────────────────────────────────────────
  type StreakState = { lastDate: string; count: number; todaySeconds: number };
  const streak = safeParse<StreakState>(ls.getItem(STREAK_KEY), { lastDate: '', count: 0, todaySeconds: 0 });
  if (streak.lastDate) {
    await db.recordStreak(streak.lastDate, streak.todaySeconds);
  }

  await db.setSetting(MIGRATED_MARKER, 'true');
  console.info('[typing] localStorage v1 → wa-sqlite migration complete', now);
}
