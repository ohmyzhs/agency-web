import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import WordDefenseGameClient from '@/components/typing/game/word-defense/WordDefenseGameClient';

export const metadata: Metadata = createPageMetadata({
  title: '워드 디펜스 — 자모 입력으로 단어 운석 격파 | oh-my-zhs',
  description:
    '떨어지는 한국어 단어 운석을 자모 단위로 입력해 부수는 Phaser 기반 타자 게임입니다. 우주선이 목표 단어를 따라가며 콤보와 웨이브를 제공합니다.',
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
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          단어를 보고, 자모를 입력하고, 운석을 부숩니다. 우주선은 입력 중인 단어 아래로 이동하고 작은 입력 박스가 따라붙어 게임 화면 안에서 흐름이 끊기지 않습니다.
        </p>
        <p className="mt-2 text-sm text-muted">
          <Link href="/typing/game" className="underline hover:text-foreground">← 게임 허브</Link>
        </p>
      </header>

      <WordDefenseGameClient />
    </div>
  );
}
