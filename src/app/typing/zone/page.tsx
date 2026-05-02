import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { zoneLessons } from '@/lib/typing/packs';


export const metadata: Metadata = createPageMetadata({
  title: '자리연습 — 8단계 손가락 자리 익히기 | oh-my-zhs 타자',
  description:
    'A-S-D-F / J-K-L-; 기본 자리부터 위/아래 단·이중자음·숫자열까지 단계별 자리연습. 다음 키 펄스와 손가락 가이드로 정확한 위치를 익힙니다.',
  path: '/typing/zone',
});


export default function ZoneHubPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          타자연습 · 자리연습
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          자리연습 8단계
        </h1>
        <p className="mt-2 text-base text-muted">
          손가락 자리를 단계별로 익힙니다. 각 단계는 30~60초 분량의 자모 드릴입니다.
        </p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2">
        {zoneLessons.map((lesson, idx) => {
          return (
            <li key={lesson.id}>
              <Link
                href={`/typing/zone/${lesson.id}`}
                className="group block rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/60"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="text-lg font-semibold">
                    <span className="mr-2 text-muted">{idx + 1}.</span>
                    {lesson.titleKo}
                  </h2>
                  <span className="text-xs text-muted group-hover:text-primary">시작 →</span>
                </div>
                <p className="mt-1 font-mono text-sm text-muted">{lesson.subtitleKo}</p>
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
