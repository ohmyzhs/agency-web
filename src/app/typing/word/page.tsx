import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { ModeShell } from '@/components/typing/organisms/ModeShell';

export const metadata: Metadata = createPageMetadata({
  title: '낱말연습 — 한글 단어로 속도와 리듬 만들기 | oh-my-zhs 타자',
  description:
    '짧은 한국어 단어를 연속으로 입력하며 손가락 반응 속도와 두벌식 리듬을 만드는 낱말 타자연습입니다. 현재 단어와 다음 단어를 보며 끊김 없이 연습합니다.',
  path: '/typing/word',
});

export default function WordPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          타자연습 · 낱말연습
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">짧은 단어로 손의 리듬을 만듭니다</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          한 단어씩 빠르게 넘기며 초성, 중성, 종성 조합을 몸에 익히는 모드입니다. 속도를 올리고 싶지만 장문은 아직 부담스러울 때 가장 좋은 출발점입니다.
        </p>
        <p className="mt-2 text-sm text-muted">
          <Link href="/typing" className="underline hover:text-foreground">← 모든 모드</Link>
        </p>
      </header>

      <ModeShell lockedMode="word" />
    </div>
  );
}
