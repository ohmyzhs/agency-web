'use client';
/**
 * DB ↔ Zustand 동기화 훅.
 * TypingDBProvider 하위에서 사용. DB가 준비되면 설정과 진행 통계를 로드한다.
 */
import { useEffect } from 'react';
import { useDB } from '@/lib/typing/db/provider';
import { useTypingSettings, SETTINGS_DB_KEYS } from '@/stores/useTypingSettings';
import { useTypingProgress } from '@/stores/useTypingProgress';
import { getAllBestScores } from '@/lib/typing/db/repositories/best-scores';
import { getWeakestKeys } from '@/lib/typing/db/repositories/key-stats';
import { getStreakCount } from '@/lib/typing/db/repositories/streak';
import type { TypingDB } from '@/lib/typing/db/client';

// 설정 키를 숫자/불리언으로 파싱
function parseSettingValue(key: string, raw: string): unknown {
  const numKeys = ['vol_key', 'vol_effect', 'vol_bgm'];
  const boolKeys = ['show_keyboard', 'show_hands', 'countdown', 'auto_next'];
  if (numKeys.includes(key)) return parseFloat(raw);
  if (boolKeys.includes(key)) return raw === 'true';
  return raw;
}

async function loadSettings(db: TypingDB) {
  const hydrate = useTypingSettings.getState().hydrate;
  const setSynced = useTypingSettings.getState().setSynced;

  const partial: Record<string, unknown> = {};
  const storeKey = Object.entries(SETTINGS_DB_KEYS) as [string, string][];

  for (const [storeField, dbKey] of storeKey) {
    const raw = await db.getSetting(dbKey);
    if (raw !== null) {
      partial[storeField] = parseSettingValue(dbKey, raw);
    }
  }
  hydrate(partial);
  setSynced();
}

async function loadProgress(db: TypingDB) {
  const { setBestScores, setWeakestKeys, setStreakCount, setLoaded } =
    useTypingProgress.getState();

  const [bestScores, weakestKeys, streakCount] = await Promise.all([
    getAllBestScores(db),
    getWeakestKeys(db, 5),
    getStreakCount(db),
  ]);

  setBestScores(bestScores);
  setWeakestKeys(weakestKeys);
  setStreakCount(streakCount);
  setLoaded();
}

export function useTypingDBSync() {
  const db = useDB();

  useEffect(() => {
    if (!db) return;
    loadSettings(db).catch(console.error);
    loadProgress(db).catch(console.error);
  }, [db]);
}

// 설정 변경 시 DB에 저장하는 훅
export function usePersistSetting(
  dbKey: string,
  value: string | number | boolean,
) {
  const db = useDB();
  const isSynced = useTypingSettings((s) => s.isSynced);

  useEffect(() => {
    if (!db || !isSynced) return;
    db.setSetting(dbKey, String(value)).catch(console.error);
  }, [db, dbKey, value, isSynced]);
}
