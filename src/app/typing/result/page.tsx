import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { HistoryView } from '@/components/typing/organisms/HistoryView';

export const metadata: Metadata = createPageMetadata({
  title: '연습 기록 — 최근 세션 히스토리 | oh-my-zhs 타자',
  description: '최근 30개의 타자 세션 기록을 모드·단계·타분당·정확도 기준으로 조회합니다. 모든 기록은 브라우저에만 저장됩니다.',
  path: '/typing/result',
});

export default function ResultPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          타자연습 · 기록
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">연습 기록</h1>
        <p className="mt-2 text-sm text-muted">
          <Link href="/typing" className="underline hover:text-foreground">← 모든 모드</Link>
        </p>
      </header>

      <HistoryView limit={50} />
    </div>
  );
}
