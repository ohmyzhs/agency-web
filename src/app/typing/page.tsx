import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { ModeShell } from "@/components/typing/organisms/ModeShell";
import TypingContent from "@/components/typing/TypingContent";

const STAGE_CARDS = [
  { href: '/typing/zone',     label: '자리연습',   desc: '8단계 두벌식 포지션',  src: '/typing/illustrations/stage-zone.png' },
  { href: '/typing/word',     label: '낱말연습',   desc: '3~5자 단어 반복',       src: '/typing/illustrations/stage-word.png' },
  { href: '/typing/sentence', label: '단문연습',   desc: '한 문장 정확도 훈련',   src: '/typing/illustrations/stage-sentence.png' },
  { href: '/typing/longform', label: '장문 / 필사', desc: '긴 글 필사 흐름',       src: '/typing/illustrations/stage-longform.png' },
  { href: '/typing/game/word-defense', label: '워드 디펜스', desc: '자모 게임 🎮', src: '/typing/illustrations/stage-game.png' },
];

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

      <section aria-label="모드별 둘러보기" className="mt-10">
        <h2 className="mb-3 text-lg font-semibold tracking-tight">모드별 둘러보기</h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {STAGE_CARDS.map(card => (
            <li key={card.href}>
              <Link
                href={card.href}
                className="group block overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/60"
              >
                <div className="relative aspect-[4/3] w-full bg-background">
                  <Image
                    src={card.src}
                    alt={card.label}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition-transform group-hover:scale-[1.03]"
                  />
                </div>
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{card.label}</p>
                  <p className="text-xs text-muted">{card.desc}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

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
