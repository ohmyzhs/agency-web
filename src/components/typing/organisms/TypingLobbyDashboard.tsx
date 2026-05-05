'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useDB } from '@/lib/typing/db/provider';
import { useTypingProgress } from '@/stores/useTypingProgress';

type RecentSession = {
  id: number;
  finished_at: number;
  mode: string;
  stage: number;
  tpm: number;
  accuracy: number;
  duration_seconds: number;
};

type WeakKey = { jamo: string; attempts: number; correct: number };

type DashboardState = {
  todaySeconds: number;
  bestTpm: number | null;
  totalSessions: number;
  recent: RecentSession[];
  weakKeys: WeakKey[];
};

const MODE_LABEL: Record<string, string> = {
  'keyboard-zone': '자리',
  word: '낱말',
  sentence: '단문',
  longform: '장문',
  'speed-test': '속도',
};

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function TypingLobbyDashboard() {
  const db = useDB();
  const { recentTpm } = useTypingProgress();
  const [state, setState] = useState<DashboardState>({
    todaySeconds: 0,
    bestTpm: null,
    totalSessions: 0,
    recent: [],
    weakKeys: [],
  });

  useEffect(() => {
    if (!db) return;
    let cancelled = false;
    (async () => {
      try {
        const today = todayKey();
        const [days, sessions, keyStats] = await Promise.all([
          db.getStreakDays(today, today) as Promise<Array<{ practice_seconds: number }>>,
          db.getRecentSessions(8) as Promise<RecentSession[]>,
          db.getAllKeyStats() as Promise<Array<{ jamo: string; attempts: number; correct: number }>>,
        ]);

        const weakKeys = keyStats
          .filter((row) => row.jamo !== '__session__' && row.attempts > 0)
          .map((row) => ({ ...row, missRate: 1 - row.correct / Math.max(1, row.attempts) }))
          .sort((a, b) => b.missRate - a.missRate)
          .slice(0, 4)
          .map(({ jamo, attempts, correct }) => ({ jamo, attempts, correct }));

        if (!cancelled) {
          setState({
            todaySeconds: days[0]?.practice_seconds ?? 0,
            bestTpm: sessions.length > 0 ? Math.max(...sessions.map((row) => row.tpm)) : null,
            totalSessions: sessions.length,
            recent: sessions.slice(0, 5),
            weakKeys,
          });
        }
      } catch {
        // DB may still be warming up; the lobby remains useful without local stats.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [db, recentTpm]);

  const todayMinutes = Math.floor(state.todaySeconds / 60);
  const todaySeconds = Math.floor(state.todaySeconds % 60);
  const avgAccuracy = useMemo(() => {
    if (state.recent.length === 0) return null;
    const sum = state.recent.reduce((acc, row) => acc + row.accuracy, 0);
    return Math.round((sum / state.recent.length) * 100);
  }, [state.recent]);

  return (
    <section aria-labelledby="typing-dashboard-title" className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted">내 연습 대시보드</p>
          <h2 id="typing-dashboard-title" className="mt-1 text-2xl font-semibold tracking-tight">
            오늘은 어디서 시작할까요?
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            실제 연습 화면은 입력에만 집중하도록 분리했습니다. 이 로비에서 기록을 보고 모드를 고른 뒤,
            각 전용 화면에서 바로 타이핑을 시작하세요.
          </p>
        </div>
        <Link
          href="/typing/result"
          className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:border-primary/60 hover:text-primary"
        >
          기록·랭킹 보기
        </Link>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="오늘 연습" value={`${todayMinutes}분 ${todaySeconds}초`} hint="이 브라우저 기준" />
        <MetricCard label="최근 최고" value={state.bestTpm ? `${Math.round(state.bestTpm)}타/분` : '—'} hint="최근 세션 기준" />
        <MetricCard label="평균 정확도" value={avgAccuracy ? `${avgAccuracy}%` : '—'} hint="최근 5회 평균" />
        <MetricCard label="완료 세션" value={`${state.totalSessions}회`} hint="최근 기록 표시" />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl border border-border bg-background p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold">최근 기록</h3>
            <Link href="/typing/result" className="text-xs text-muted underline-offset-4 hover:text-foreground hover:underline">
              전체 보기
            </Link>
          </div>
          {state.recent.length === 0 ? (
            <p className="mt-3 text-sm text-muted">아직 기록이 없습니다. 낱말연습이나 단문연습부터 시작해보세요.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border text-sm">
              {state.recent.map((row) => (
                <li key={row.id} className="flex items-center justify-between gap-3 py-2">
                  <span className="text-muted">{MODE_LABEL[row.mode] ?? row.mode} · {row.stage}단계</span>
                  <span className="tabular-nums">
                    <strong>{Math.round(row.tpm)}</strong>타 · {Math.round(row.accuracy * 100)}%
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-background p-4">
          <h3 className="font-semibold">약점 키 힌트</h3>
          {state.weakKeys.length === 0 ? (
            <p className="mt-3 text-sm text-muted">데이터가 쌓이면 자주 틀리는 자모를 보여줍니다.</p>
          ) : (
            <ul className="mt-3 flex flex-wrap gap-2">
              {state.weakKeys.map((key) => {
                const accuracy = Math.round((key.correct / Math.max(1, key.attempts)) * 100);
                return (
                  <li key={key.jamo} className="rounded-xl border border-border bg-card px-3 py-2 text-sm">
                    <span className="font-mono text-lg">{key.jamo}</span>
                    <span className="ml-2 text-xs text-muted">{accuracy}% · {key.attempts}회</span>
                  </li>
                );
              })}
            </ul>
          )}
          <p className="mt-3 text-xs leading-relaxed text-muted">
            공개 랭킹은 준비 중이며, 현재는 브라우저 안에 저장된 개인 기록을 기준으로 표시합니다.
          </p>
        </div>
      </div>
    </section>
  );
}

function MetricCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </div>
  );
}
