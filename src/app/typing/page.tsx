import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import TypingContent from "@/components/typing/TypingContent";
import { TypingLobbyDashboard } from "@/components/typing/organisms/TypingLobbyDashboard";

const STAGE_CARDS = [
  {
    href: "/typing/zone",
    label: "자리연습",
    desc: "손가락 위치부터 잡는 8단계 기본기",
    src: "/typing/illustrations/stage-zone.png",
    cta: "단계 선택",
  },
  {
    href: "/typing/word",
    label: "낱말연습",
    desc: "짧은 단어로 속도와 리듬 만들기",
    src: "/typing/illustrations/stage-word.png",
    cta: "바로 연습",
  },
  {
    href: "/typing/sentence",
    label: "단문연습",
    desc: "한 문장씩 정확도와 흐름 다듬기",
    src: "/typing/illustrations/stage-sentence.png",
    cta: "바로 연습",
  },
  {
    href: "/typing/longform",
    label: "장문 / 필사",
    desc: "긴 글 필사로 집중력과 호흡 훈련",
    src: "/typing/illustrations/stage-longform.png",
    cta: "카테고리 선택",
  },
  {
    href: "/typing/game/word-defense",
    label: "워드 디펜스",
    desc: "한국어 자모로 즐기는 타자 게임",
    src: "/typing/illustrations/stage-game.png",
    cta: "게임 시작",
  },
];

const SEO_LINKS = [
  { href: "/typing#guide", label: "타자연습 가이드" },
  { href: "/typing#metrics", label: "타수 계산법" },
  { href: "/typing/result", label: "기록·랭킹 대시보드" },
  { href: "/typing/zone", label: "두벌식 자리연습" },
];

export const metadata: Metadata = createPageMetadata({
  title: "무료 한글 타자연습 — 자리·낱말·단문·장문·타자게임 | oh-my-zhs",
  description:
    "무료 한글 타자연습 로비. 두벌식 자리연습, 낱말·단문·장문 필사, 타자 게임, 개인 기록 대시보드와 약점 키 분석을 제공하고 실제 연습 화면은 입력에만 집중하도록 분리했습니다.",
  path: "/typing",
});

export default function TypingPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-center">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            oh-my-zhs · 무료 타자연습 로비
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            한글 타자연습은 로비에서 고르고, 연습 화면에서는 입력만 집중하세요
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted md:text-lg">
            메뉴, 통계, 가이드를 한 화면에 몰아넣지 않았습니다. 이 페이지는 무료 한글 타자연습을
            소개하고 내 기록을 확인하는 로비이며, 각 모드를 누르면 전용 연습 화면으로 이동합니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/typing/word"
              className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            >
              낱말연습 바로 시작
            </Link>
            <Link
              href="/typing/zone"
              className="rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold transition-colors hover:border-primary/60 hover:text-primary"
            >
              자리연습부터 시작
            </Link>
          </div>
          <nav aria-label="타자연습 주요 정보" className="mt-5 flex flex-wrap gap-2 text-xs text-muted">
            {SEO_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-border bg-background px-3 py-1.5 hover:border-primary/60 hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="rounded-3xl border border-border bg-card p-4 shadow-sm">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-background">
            <Image
              src="/typing/illustrations/stage-word.png"
              alt="무료 한글 타자연습 로비 일러스트"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 22rem"
              className="object-cover"
            />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            통계·랭킹·가이드는 로비와 대시보드에, 실제 타자 입력은 전용 화면에 배치했습니다.
          </p>
        </div>
      </header>

      <section aria-label="타자연습 모드 선택" className="mt-10">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted">Practice modes</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">연습 메뉴</h2>
          </div>
          <p className="max-w-xl text-sm text-muted">
            클릭하면 각 모드의 집중 연습 화면 또는 세부 선택 화면으로 이동합니다.
          </p>
        </div>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {STAGE_CARDS.map((card) => (
            <li key={card.href}>
              <Link
                href={card.href}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/60"
              >
                <div className="relative aspect-[4/3] w-full bg-background">
                  <Image
                    src={card.src}
                    alt={card.label}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    className="object-cover transition-transform group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col px-4 py-3">
                  <h3 className="font-semibold">{card.label}</h3>
                  <p className="mt-1 flex-1 text-sm leading-relaxed text-muted">{card.desc}</p>
                  <span className="mt-3 text-xs font-medium text-muted group-hover:text-primary">{card.cta} →</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10">
        <TypingLobbyDashboard />
      </div>

      <hr className="my-12 border-border" />

      <TypingContent />
    </div>
  );
}
