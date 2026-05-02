import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createPageMetadata } from '@/lib/seo';
import { ModeShell } from '@/components/typing/organisms/ModeShell';
import type { ZoneLessonId } from '@/lib/typing/packs';

const VALID_ZONES: ZoneLessonId[] = [
  'home', 'middle', 'left-top', 'right-top',
  'left-bottom', 'right-bottom', 'number', 'all',
];

const ZONE_LABELS: Record<ZoneLessonId, string> = {
  home: '기본 자리',
  middle: '중앙',
  'left-top': '왼손 윗줄',
  'right-top': '오른손 윗줄',
  'left-bottom': '왼손 아랫줄',
  'right-bottom': '오른손 아랫줄',
  number: '숫자열',
  all: '종합 연습',
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
