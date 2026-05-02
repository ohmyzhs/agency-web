import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { ModeShell } from '@/components/typing/organisms/ModeShell';

export const metadata: Metadata = createPageMetadata({
  title: '낱말연습 — 단계별 한국어 단어 연속 입력 | oh-my-zhs 타자',
  description:
    '도전단계 100~1200타에 맞춘 단어 풀로 카루셀 연습. 직전 / 다음 단어를 미리 보며 손가락 자리와 리듬을 동시에 잡습니다.',
  path: '/typing/word',
});

export default function WordPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          타자연습 · 낱말연습
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">낱말연습</h1>
        <p className="mt-2 text-sm text-muted">
          <Link href="/typing" className="underline hover:text-foreground">← 모든 모드</Link>
        </p>
      </header>

      <ModeShell lockedMode="word" />
    </div>
  );
}
