import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { ModeShell } from '@/components/typing/organisms/ModeShell';

export const metadata: Metadata = createPageMetadata({
  title: '단문연습 — 한 문장씩 정확하게 | oh-my-zhs 타자',
  description:
    '도전단계별 한국어 단문(20~40자)을 한 줄씩 입력하며 속도와 정확도를 다듬습니다. 자동 다음 지문 옵션으로 끊김 없이 연습.',
  path: '/typing/sentence',
});

export default function SentencePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          타자연습 · 단문연습
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">단문연습</h1>
        <p className="mt-2 text-sm text-muted">
          <Link href="/typing" className="underline hover:text-foreground">← 모든 모드</Link>
        </p>
      </header>

      <ModeShell lockedMode="sentence" />
    </div>
  );
}
