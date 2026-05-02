import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import type { ZoneLessonId } from '@/lib/typing/packs';

const ZONE_LIST: ZoneLessonId[] = [
  'home', 'middle', 'left-top', 'right-top',
  'left-bottom', 'right-bottom', 'number', 'all',
];

export const metadata: Metadata = createPageMetadata({
  title: '자리연습 — 8단계 손가락 자리 익히기 | oh-my-zhs 타자',
  description:
    'A-S-D-F / J-K-L-; 기본 자리부터 위/아래 단·이중자음·숫자열까지 단계별 자리연습. 다음 키 펄스와 손가락 가이드로 정확한 위치를 익힙니다.',
  path: '/typing/zone',
});

const ZONE_LABELS: Record<ZoneLessonId, { ko: string; desc: string }> = {
  home:         { ko: '기본 자리',  desc: 'A S D F · J K L ;' },
  middle:       { ko: '중앙',       desc: 'G · H' },
  'left-top':   { ko: '왼손 윗줄',  desc: 'Q W E R T' },
  'right-top':  { ko: '오른손 윗줄', desc: 'Y U I O P' },
  'left-bottom':{ ko: '왼손 아랫줄', desc: 'Z X C V B' },
  'right-bottom':{ ko: '오른손 아랫줄', desc: 'N M , . /' },
  number:       { ko: '숫자열',     desc: '1 2 3 · 7 8 9 0' },
  all:          { ko: '종합 연습',  desc: '전 자모 통합 드릴' },
};

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
        {ZONE_LIST.map((zoneId, idx) => {
          const meta = ZONE_LABELS[zoneId];
          return (
            <li key={zoneId}>
              <Link
                href={`/typing/zone/${zoneId}`}
                className="group block rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/60"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="text-lg font-semibold">
                    <span className="mr-2 text-muted">{idx + 1}.</span>
                    {meta.ko}
                  </h2>
                  <span className="text-xs text-muted group-hover:text-primary">시작 →</span>
                </div>
                <p className="mt-1 font-mono text-sm text-muted">{meta.desc}</p>
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
