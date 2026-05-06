import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { HistoryView } from '@/components/typing/organisms/HistoryView';

export const metadata: Metadata = createPageMetadata({
  title: '연습 기록 — 타수, 정확도, 약점 키 확인 | oh-my-zhs 타자',
  description: '브라우저에 저장된 최근 타자연습 기록을 모드, 단계, 타/분, 정확도 기준으로 확인합니다. 약점 키와 연습 흐름을 보고 다음 훈련을 고를 수 있습니다.',
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
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          최근 기록을 보고 다음 연습을 고르세요. 최고 타수만 보는 화면이 아니라, 정확도와 모드별 흐름을 함께 확인하는 복습용 대시보드입니다.
        </p>
        <p className="mt-2 text-sm text-muted">
          <Link href="/typing" className="underline hover:text-foreground">← 모든 모드</Link>
        </p>
      </header>

      <HistoryView limit={50} />
    </div>
  );
}
