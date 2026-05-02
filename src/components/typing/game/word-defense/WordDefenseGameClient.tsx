'use client';
import dynamic from 'next/dynamic';

const WordDefenseGame = dynamic(
  () => import('./WordDefenseGame').then(m => m.WordDefenseGame),
  {
    ssr: false,
    loading: () => (
      <div className="flex aspect-[4/3] items-center justify-center rounded-lg border border-border bg-card">
        <p className="text-sm text-muted">게임 로드 중…</p>
      </div>
    ),
  },
);

export default function WordDefenseGameClient() {
  return <WordDefenseGame />;
}
