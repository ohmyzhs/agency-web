'use client';
/**
 * Intercepted route — when the user navigates to /typing/result FROM /typing,
 * show the history as a modal overlay over the typing UI instead of replacing it.
 * Direct navigation falls through to /typing/result/page.tsx (full page).
 */
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { HistoryView } from '@/components/typing/organisms/HistoryView';

export default function InterceptedResultModal() {
  const router = useRouter();

  // Esc to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') router.back();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [router]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="연습 기록"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8"
      onClick={() => router.back()}
    >
      <div
        className="w-full max-w-3xl overflow-hidden rounded-xl border border-border bg-background shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="text-lg font-semibold">연습 기록</h2>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md px-2 py-1 text-sm text-muted hover:bg-card hover:text-foreground"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-5">
          <HistoryView limit={30} />
        </div>
      </div>
    </div>
  );
}
