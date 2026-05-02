'use client';
/**
 * Left rail — streak / weak-keys / recent sessions snapshot.
 * Pulls from useTypingProgress (DB-cached) + on-demand DB queries.
 */
import { useEffect, useState } from 'react';
import { useTypingProgress } from '@/stores/useTypingProgress';
import { useDB } from '@/lib/typing/db/provider';

type WeakKey = { jamo: string; attempts: number; correct: number };
type RecentSession = {
  id: number;
  finished_at: number;
  mode: string;
  stage: number;
  tpm: number;
  accuracy: number;
};

function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function LeftStatsRail() {
  const db = useDB();
  const { recentTpm } = useTypingProgress();
  const [todaySeconds, setTodaySeconds] = useState<number>(0);
  const [weakKeys, setWeakKeys] = useState<WeakKey[]>([]);
  const [recent, setRecent] = useState<RecentSession[]>([]);
  const [tick, setTick] = useState(0);

  // Refresh on mount and every time recentTpm changes (= just finished a session)
  useEffect(() => {
    if (!db) return;
    let cancelled = false;
    (async () => {
      try {
        const today = todayKey();
        const days = (await db.getStreakDays(today, today)) as Array<{ practice_seconds: number }>;
        if (!cancelled) setTodaySeconds(days[0]?.practice_seconds ?? 0);

        const stats = (await db.getAllKeyStats()) as Array<{ jamo: string; attempts: number; correct: number }>;
        const weak = stats
          .filter(s => s.jamo !== '__session__' && s.attempts > 0)
          .map(s => ({ ...s, miss: 1 - s.correct / Math.max(1, s.attempts) }))
          .sort((a, b) => b.miss - a.miss)
          .slice(0, 3)
          .map(({ jamo, attempts, correct }) => ({ jamo, attempts, correct }));
        if (!cancelled) setWeakKeys(weak);

        const sessions = (await db.getRecentSessions(5)) as RecentSession[];
        if (!cancelled) setRecent(sessions);
      } catch {
        // silent — DB may still be initializing
      }
    })();
    return () => { cancelled = true; };
  }, [db, recentTpm, tick]);

  const minutes = Math.floor(todaySeconds / 60);
  const seconds = Math.floor(todaySeconds % 60);

  return (
    <aside className="hidden w-56 shrink-0 space-y-4 lg:block">
      <Section title="오늘의 연습">
        <p className="text-2xl font-semibold tabular-nums">
          {minutes}<span className="text-base font-normal text-muted">분 </span>
          {seconds}<span className="text-base font-normal text-muted">초</span>
        </p>
        <button
          type="button"
          onClick={() => setTick(n => n + 1)}
          className="mt-1 text-[10px] uppercase tracking-wider text-muted hover:text-foreground"
        >
          새로고침
        </button>
      </Section>

      <Section title="약점 자모 Top 3">
        {weakKeys.length === 0 ? (
          <p className="text-sm text-muted">아직 데이터가 부족합니다.</p>
        ) : (
          <ul className="space-y-1.5">
            {weakKeys.map(k => {
              const acc = Math.round((k.correct / k.attempts) * 100);
              return (
                <li key={k.jamo} className="flex items-center justify-between text-sm">
                  <span className="font-mono text-base">{k.jamo}</span>
                  <span className="tabular-nums text-muted">{acc}% · {k.attempts}회</span>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      <Section title="최근 세션">
        {recent.length === 0 ? (
          <p className="text-sm text-muted">기록 없음</p>
        ) : (
          <ul className="space-y-1.5">
            {recent.map(r => (
              <li key={r.id} className="flex items-center justify-between text-xs">
                <span className="text-muted">{shortMode(r.mode)} · {r.stage}</span>
                <span className="tabular-nums">{Math.round(r.tpm)}타 · {Math.round(r.accuracy * 100)}%</span>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted">{title}</p>
      {children}
    </div>
  );
}

function shortMode(mode: string): string {
  switch (mode) {
    case 'keyboard-zone': return '자리';
    case 'word':          return '낱말';
    case 'sentence':      return '단문';
    case 'longform':      return '장문';
    case 'speed-test':    return '속도';
    default: return mode;
  }
}
