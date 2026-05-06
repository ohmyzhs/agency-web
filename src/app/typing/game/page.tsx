import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: '타자 게임 — 워드 디펜스 | oh-my-zhs',
  description:
    '떨어지는 한국어 단어를 자모 단위로 입력해 격파하는 워드 디펜스입니다. 연습이 지루해질 때 반응 속도와 조합 감각을 게임처럼 훈련합니다.',
  path: '/typing/game',
});

export default function GameHubPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-8">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          타자연습 · 게임
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">타자 게임</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          연습이 지루해지는 순간을 위해 만든 게임형 훈련입니다. 정확한 자모 입력이 곧 공격이 됩니다.
        </p>
      </header>

      <ul className="space-y-3">
        <li>
          <Link
            href="/typing/game/word-defense"
            className="group block rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/60"
          >
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-xl font-semibold">워드 디펜스</h2>
              <span className="text-xs text-muted group-hover:text-primary">시작 →</span>
            </div>
            <p className="mt-1 text-sm text-muted">
              떨어지는 단어를 끝까지 읽고 자모 단위로 입력해 격파합니다. 순발력과 정확도를 함께 쓰는 7 웨이브 타자 게임입니다.
            </p>
          </Link>
        </li>
      </ul>

      <p className="mt-8 text-sm text-muted">
        <Link href="/typing" className="underline hover:text-foreground">← 모든 모드</Link>
      </p>
    </div>
  );
}
