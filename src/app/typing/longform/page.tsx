import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { LONGFORM_CATEGORIES, koreanPassagesByCategory } from '@/lib/typing/packs-staged';

export const metadata: Metadata = createPageMetadata({
  title: '장문연습 / 필사 — 8개 카테고리 한국어 글 | oh-my-zhs 타자',
  description:
    '애국가·고전·속담·명언·에세이·한국사·과학·CS 등 8개 카테고리의 단락을 직접 필사하며 호흡과 리듬을 가다듬는 장문 타자연습.',
  path: '/typing/longform',
});

const CATEGORY_DESC: Record<string, string> = {
  AI단편: 'AI 창작 단편소설 · 한/영 30세트',
  애국가: '국가 / 시 / 국문학 PD',
  고전: '훈민정음 · 옛 시조 · 고전 산문',
  속담: '한국 속담 · 사자성어',
  명언: '동·서양 명언 · 격언',
  에세이: '현대 에세이 / 칼럼',
  한국사: '주요 사건·인물 단락',
  과학: '과학 개념 · 자연 현상',
  CS: '컴퓨터과학 · 소프트웨어 개념',
};

export default function LongformHubPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          타자연습 · 장문 / 필사
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          장문 / 필사 9 카테고리
        </h1>
        <p className="mt-2 text-base text-muted">
          단락 단위로 흐름을 따라 입력하는 필사 모드. 출처와 저작권은 각 단락에 표기됩니다.
        </p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2">
        {LONGFORM_CATEGORIES.map(cat => {
          const count = koreanPassagesByCategory[cat]?.length ?? 0;
          return (
            <li key={cat}>
              <Link
                href={`/typing/longform/${encodeURIComponent(cat)}`}
                className="group block rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/60"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="text-lg font-semibold">{cat}</h2>
                  <span className="text-xs tabular-nums text-muted">{count}편</span>
                </div>
                <p className="mt-1 text-sm text-muted">{CATEGORY_DESC[cat] ?? ''}</p>
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="mt-8 text-sm text-muted">
        <Link href="/typing" className="underline hover:text-foreground">
          ← 모든 모드로 돌아가기
        </Link>
      </p>
    </div>
  );
}
