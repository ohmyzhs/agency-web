import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ModeShell } from "@/components/typing/organisms/ModeShell";
import TypingContent from "@/components/typing/TypingContent";

export const metadata: Metadata = createPageMetadata({
  title: "한국어 타자연습 — 도전단계 100~1200타 | oh-my-zhs",
  description:
    "두벌식 자리연습, 낱말·단문·장문 연습, 속도 측정을 한 페이지에서. 분당 타수(자모 기준) 자동 계산, 도전단계 100~1200, 약점 키 추적, 한글 IME 안전 처리.",
  path: "/typing",
});

export default function TypingPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          oh-my-zhs · 타자연습
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          한국어 타자연습
        </h1>
        <p className="mt-2 text-base text-muted">
          자리연습부터 장문까지. 도전단계 100~1200타. 모든 기록은 브라우저에만 저장됩니다.
        </p>
      </header>

      <ModeShell />

      <nav aria-label="모드별 전용 페이지" className="mt-8 flex flex-wrap gap-2 text-sm">
        <span className="text-xs font-medium uppercase tracking-wider text-muted">전용 페이지</span>
        {[
          { href: '/typing/zone',     label: '자리연습 8단계' },
          { href: '/typing/word',     label: '낱말연습' },
          { href: '/typing/sentence', label: '단문연습' },
          { href: '/typing/longform', label: '장문 / 필사' },
          { href: '/typing/game/word-defense', label: '워드 디펜스 🎮' },
          { href: '/typing/result',   label: '기록 보기' },
        ].map(it => (
          <Link
            key={it.href}
            href={it.href}
            className="rounded-full border border-border bg-card px-3 py-1 transition-colors hover:border-primary/60 hover:text-primary"
          >
            {it.label}
          </Link>
        ))}
      </nav>

      <hr className="my-12 border-border" />

      <TypingContent />
    </div>
  );
}
