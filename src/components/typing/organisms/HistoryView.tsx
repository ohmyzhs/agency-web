'use client';
/**
 * Recent session history — used by /typing/result and the intercepted modal.
 */
import { useEffect, useState } from 'react';
import { useDB } from '@/lib/typing/db/provider';

type SessionRow = {
  id: number;
  finished_at: number;
  mode: string;
  language: string;
  stage: number;
  tpm: number;
  accuracy: number;
  duration_seconds: number;
};

const MODE_LABEL: Record<string, string> = {
  'keyboard-zone': '자리',
  word: '낱말',
  sentence: '단문',
  longform: '장문',
  'speed-test': '속도',
};

export function HistoryView({ limit = 30 }: { limit?: number }) {
  const db = useDB();
  const [rows, setRows] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;
    let cancelled = false;
    (async () => {
      try {
        const r = (await db.getRecentSessions(limit)) as SessionRow[];
        if (!cancelled) setRows(r);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [db, limit]);

  if (loading) {
    return <p className="text-sm text-muted">불러오는 중…</p>;
  }
  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted">
        아직 완료된 세션이 없습니다. <a href="/typing" className="underline">연습하러 가기</a>.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-background text-xs uppercase tracking-wider text-muted">
          <tr>
            <th className="px-3 py-2 text-left">날짜</th>
            <th className="px-3 py-2 text-left">모드</th>
            <th className="px-3 py-2 text-right">단계</th>
            <th className="px-3 py-2 text-right">타/분</th>
            <th className="px-3 py-2 text-right">정확도</th>
            <th className="px-3 py-2 text-right">시간</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="border-t border-border">
              <td className="px-3 py-2 text-muted">{formatDate(r.finished_at)}</td>
              <td className="px-3 py-2">{MODE_LABEL[r.mode] ?? r.mode}</td>
              <td className="px-3 py-2 text-right tabular-nums">{r.stage}</td>
              <td className="px-3 py-2 text-right tabular-nums font-semibold">
                {Math.round(r.tpm)}
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {Math.round(r.accuracy * 100)}%
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {Math.round(r.duration_seconds)}초
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
