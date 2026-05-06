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
    desc: "두벌식 기본 자리부터 Shift 조합까지 손이 외우게 만듭니다.",
    src: "/typing/illustrations/stage-zone.png",
    cta: "기본기 잡기",
  },
  {
    href: "/typing/word",
    label: "낱말연습",
    desc: "짧은 단어를 끊기지 않게 넘기며 속도감을 끌어올립니다.",
    src: "/typing/illustrations/stage-word.png",
    cta: "리듬 만들기",
  },
  {
    href: "/typing/sentence",
    label: "단문연습",
    desc: "생활 문장으로 오타 습관을 줄이고 문장 끝까지 흐름을 지킵니다.",
    src: "/typing/illustrations/stage-sentence.png",
    cta: "문장 입력",
  },
  {
    href: "/typing/longform",
    label: "장문 / 필사",
    desc: "긴 글을 직접 고르고 끝까지 입력하며 집중력과 호흡을 훈련합니다.",
    src: "/typing/illustrations/stage-longform.png",
    cta: "글 고르기",
  },
  {
    href: "/typing/game/word-defense",
    label: "워드 디펜스",
    desc: "떨어지는 단어를 자모 단위로 격파하는 한글 타자 게임입니다.",
    src: "/typing/illustrations/stage-game.png",
    cta: "게임 시작",
  },
];

const SEO_LINKS = [
  { href: "/typing#guide", label: "추천 연습 루틴" },
  { href: "/typing#metrics", label: "타수 계산법" },
  { href: "/typing/result", label: "내 기록 보기" },
  { href: "/typing/game/word-defense", label: "워드 디펜스" },
];

const HERO_POINTS = ["두벌식 자모 기준 타수", "문단형 입력면", "로컬 기록 저장", "자리·낱말·문장·필사·게임"];

export const metadata: Metadata = createPageMetadata({
  title: "한글 타자연습 — 두벌식 기본기부터 장문 필사와 타자게임까지 | oh-my-zhs",
  description:
    "oh-my-zhs 한글 타자연습은 두벌식 자리연습, 낱말·단문·장문 필사, 워드 디펜스 게임, 로컬 기록 대시보드를 한 흐름으로 묶은 무료 타자 연습 서비스입니다.",
  path: "/typing",
});

export default function TypingPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-center">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            oh-my-zhs typing lab
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            한글 타자가 빨라지는 순서를 다시 설계했습니다
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted md:text-lg">
            무작정 60초 기록만 반복하면 손은 빨라지기보다 급해집니다. oh-my-zhs 타자연습은
            두벌식 자리, 낱말 리듬, 문장 정확도, 장문 호흡, 게임형 순발력을 단계별로 나눠
            매일 조금씩 실력이 쌓이도록 만든 한글 타자 연습 서비스입니다.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs text-muted">
            {HERO_POINTS.map((point) => (
              <span key={point} className="rounded-full border border-border bg-background px-3 py-1.5">
                {point}
              </span>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/typing/word"
              className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            >
              낱말부터 바로 시작
            </Link>
            <Link
              href="/typing/zone"
              className="rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold transition-colors hover:border-primary/60 hover:text-primary"
            >
              기본 자리부터 잡기
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
              alt="한글 타자연습 낱말 입력 화면 일러스트"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 22rem"
              className="object-cover"
            />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            연습 화면은 입력에만 집중하고, 기록·약점 키·모드 선택은 로비에서 확인합니다.
            훈련과 대시보드를 분리해 짧게 들어와도 바로 시작할 수 있습니다.
          </p>
        </div>
      </header>

      <section aria-label="타자연습 모드 선택" className="mt-10">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted">Training tracks</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">오늘 필요한 연습을 고르세요</h2>
          </div>
          <p className="max-w-xl text-sm text-muted">
            기본기, 속도, 정확도, 긴 글 집중, 게임형 순발력을 각각 다른 화면에서 훈련합니다.
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
