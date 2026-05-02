import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createPageMetadata } from '@/lib/seo';
import { ModeShell } from '@/components/typing/organisms/ModeShell';
import { LONGFORM_CATEGORIES } from '@/lib/typing/packs-staged';
import type { LongformCategory } from '@/lib/typing/types';

type Params = Promise<{ category: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  return createPageMetadata({
    title: `${decoded} 필사 — 장문 타자연습 | oh-my-zhs`,
    description: `${decoded} 카테고리의 한국어 단락을 직접 필사하며 호흡과 정확도를 다듬는 장문 타자연습.`,
    path: `/typing/longform/${category}`,
  });
}

export default async function LongformCategoryPage({ params }: { params: Params }) {
  const { category } = await params;
  const decoded = decodeURIComponent(category) as LongformCategory;
  if (!LONGFORM_CATEGORIES.includes(decoded)) notFound();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          타자연습 · 장문 · {decoded}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{decoded}</h1>
        <p className="mt-2 text-sm text-muted">
          <Link href="/typing/longform" className="underline hover:text-foreground">
            ← 카테고리 허브
          </Link>
        </p>
      </header>

      <ModeShell lockedMode="longform" lockedLessonId={decoded} />
    </div>
  );
}
