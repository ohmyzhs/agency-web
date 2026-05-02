import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import WordDefenseGameClient from '@/components/typing/game/word-defense/WordDefenseGameClient';

export const metadata: Metadata = createPageMetadata({
  title: '워드 디펜스 — 떨어지는 단어 운석을 자모로 부수기 | oh-my-zhs',
  description:
    '한국어 자모 단위 매칭으로 떨어지는 단어 운석을 격파하는 Phaser 3 기반 타자 게임. 콤보 ×3.0까지, 도전단계 100~1200타.',
  path: '/typing/game/word-defense',
});

export default function WordDefensePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          타자연습 · 게임 · 워드 디펜스
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">워드 디펜스</h1>
        <p className="mt-2 text-sm text-muted">
          <Link href="/typing/game" className="underline hover:text-foreground">← 게임 허브</Link>
        </p>
      </header>

      <WordDefenseGameClient />
    </div>
  );
}
