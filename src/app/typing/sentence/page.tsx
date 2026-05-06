import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { ModeShell } from '@/components/typing/organisms/ModeShell';

export const metadata: Metadata = createPageMetadata({
  title: '단문연습 — 생활 문장으로 정확도 다듬기 | oh-my-zhs 타자',
  description:
    '짧은 한국어 문장을 문단형 입력면에서 연습하며 오타 습관, 문장 끝 처리, 타수와 정확도를 함께 확인하는 단문 타자연습입니다.',
  path: '/typing/sentence',
});

export default function SentencePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          타자연습 · 단문연습
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">문장 끝까지 흔들리지 않게</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          실제 글을 쓰듯 한 문장씩 입력합니다. 속도만 재는 화면이 아니라, 조합 중인 한글과 오타 위치를 자연스럽게 보여줘 문장 입력 감각을 다듬을 수 있습니다.
        </p>
        <p className="mt-2 text-sm text-muted">
          <Link href="/typing" className="underline hover:text-foreground">← 모든 모드</Link>
        </p>
      </header>

      <ModeShell lockedMode="sentence" />
    </div>
  );
}
