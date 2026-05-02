import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createPageMetadata } from '@/lib/seo';
import { ModeShell } from '@/components/typing/organisms/ModeShell';
import type { ZoneLessonId } from '@/lib/typing/packs';

const VALID_ZONES: ZoneLessonId[] = [
  'home', 'right-top', 'left-top', 'right-bottom',
  'left-bottom', 'middle', 'number', 'all',
];

const ZONE_LABELS: Record<ZoneLessonId, string> = {
  home: '기본자리',
  'right-top': '오른손윗자리',
  'left-top': '왼손윗자리',
  'right-bottom': '오른손아랫자리',
  'left-bottom': '왼손아랫자리',
  middle: '가운뎃자리',
  number: '숫자자리',
  all: '전체자리',
};

type Params = Promise<{ lessonId: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lessonId } = await params;
  const label = ZONE_LABELS[lessonId as ZoneLessonId] ?? '자리연습';
  return createPageMetadata({
    title: `${label} 자리연습 | oh-my-zhs 타자`,
    description: `${label} 자리를 단계별로 익힙니다. 손가락 가이드와 다음 키 펄스로 정확한 위치를 익히는 두벌식 자리연습.`,
    path: `/typing/zone/${lessonId}`,
  });
}

export default async function ZoneLessonPage({ params }: { params: Params }) {
  const { lessonId } = await params;
  if (!VALID_ZONES.includes(lessonId as ZoneLessonId)) notFound();

  const label = ZONE_LABELS[lessonId as ZoneLessonId];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          타자연습 · 자리연습 · {label}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          {label}
        </h1>
        <p className="mt-2 text-sm text-muted">
          <Link href="/typing/zone" className="underline hover:text-foreground">
            ← 자리연습 8단계
          </Link>
        </p>
      </header>

      <ModeShell lockedMode="keyboard-zone" lockedLessonId={lessonId} />
    </div>
  );
}
