import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { LONGFORM_CATEGORIES, getPassagesForCategory } from '@/lib/typing/packs-staged';

export const metadata: Metadata = createPageMetadata({
  title: '장문연습 / 필사 — 긴 글을 고르고 끝까지 입력하기 | oh-my-zhs 타자',
  description:
    '1000자 안팎의 한국어 긴 글을 카테고리와 제목으로 고른 뒤 문단형 입력면에서 필사하는 장문 타자연습입니다. 집중력, 호흡, 정확도를 함께 훈련합니다.',
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
          필사할 글을 직접 고르세요
        </h1>
        <p className="mt-2 text-base text-muted">
          짧은 예문만 반복하지 않도록 1000자 안팎의 글만 남겼습니다. 주제와 제목을 보고 오늘 끝까지 입력할 글을 고르세요.
        </p>
        <p className="mt-3 text-sm text-muted">
          영어도 됩니다. 카테고리 진입 후 언어를 English로 바꾸거나
          <Link href="/typing/longform/AI%EB%8B%A8%ED%8E%B8?lang=en" className="ml-1 font-medium text-primary underline">
            English long-form 바로 시작
          </Link>
        </p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2">
        {LONGFORM_CATEGORIES.map(cat => {
          const passages = getPassagesForCategory(cat, 'ko');
          const count = passages.length;
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
                <p className="mt-2 text-xs text-muted">{passages.slice(0, 3).map(p => p.title).join(' · ')}</p>
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
