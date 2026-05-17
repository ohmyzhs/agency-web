"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers";
import TypingContent from "@/components/typing/TypingContent";
import { TypingLobbyDashboard } from "@/components/typing/organisms/TypingLobbyDashboard";

const STAGE_CARDS = {
  ko: [
    { href: "/typing/zone", label: "자리연습", desc: "기본 자리부터 시작하는 정밀한 기초 훈련.", icon: "⌨️", cta: "기본기 잡기" },
    { href: "/typing/word", label: "낱말연습", desc: "단어 단위의 리듬과 반응 속도 향상.", icon: "🔤", cta: "리듬 만들기" },
    { href: "/typing/sentence", label: "단문연습", desc: "실전 문장을 통한 정확도와 집중력 강화.", icon: "📝", cta: "문장 입력" },
    { href: "/typing/longform", label: "장문 / 필사", desc: "긴 글을 통한 지구력과 호흡 조절.", icon: "📖", cta: "글 고르기" },
    { href: "/typing/game/word-defense", label: "워드 디펜스", desc: "긴박한 상황에서의 순발력 테스트.", icon: "🎯", cta: "게임 시작" },
  ],
  en: [
    { href: "/typing/zone", label: "Key zones", desc: "Precision drills for fundamental positioning.", icon: "⌨️", cta: "Start basics" },
    { href: "/typing/word", label: "Word practice", desc: "Build rhythm and speed with short words.", icon: "🔤", cta: "Build rhythm" },
    { href: "/typing/sentence", label: "Sentence practice", desc: "Focus on accuracy with practical sentences.", icon: "📝", cta: "Type sentences" },
    { href: "/typing/longform", label: "Long-form copy", desc: "Train focus and pacing with longer passages.", icon: "📖", cta: "Pick a passage" },
    { href: "/typing/game/word-defense", label: "Word Defense", desc: "Test your reflexes under pressure.", icon: "🎯", cta: "Start game" },
  ],
};

const COPY = {
  ko: {
    eyebrow: "OH-MY-ZHS TYPING LAB",
    title: "본능적인 입력, 그 이상의 정교함.",
    lead: "단순히 빠른 타자를 넘어, 정확한 리듬과 IME 최적화 경험을 제공합니다. 자리연습부터 고난도 필사까지, 지능적인 훈련 코스를 경험하세요.",
    points: ["자모 단위 정밀 측정", "프로페셔널 대시보드", "로컬 데이터 보안", "5가지 훈련 모드"],
    primary: "단문연습 바로 시작",
    secondary: "기초부터 다지기",
    imageAlt: "Typing Lab Visual",
    tracks: "Training Tracks",
    choose: "성장을 위한 오늘의 트랙",
    chooseLead: "당신의 현재 상태에 최적화된 연습 모드를 선택하세요.",
    sectionAria: "타자연습 모드 선택",
  },
  en: {
    eyebrow: "OH-MY-ZHS TYPING LAB",
    title: "Beyond Speed. Precision in Every Stroke.",
    lead: "Master the rhythm of Hangul and English with precision-engineered drills. From home-row basics to professional long-form transcription.",
    points: ["Character-level Metrics", "Professional Dashboard", "Local Data Sovereignty", "5 Specialized Modes"],
    primary: "Start sentence practice",
    secondary: "Base Training",
    imageAlt: "Typing Lab Visual",
    tracks: "Training Tracks",
    choose: "Select Your Track",
    chooseLead: "Choose the mode that matches your current training goal.",
    sectionAria: "Typing mode selection",
  },
};

export default function TypingLandingContent() {
  const { locale } = useLocale();
  const lang = locale === "ko" ? "ko" : "en";
  const copy = COPY[lang];
  const cards = STAGE_CARDS[lang];

  return (
    <div className="flex flex-col gap-12 pb-24 md:gap-16">
      {/* 1. Compact Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-background py-7 md:py-10">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.10),transparent_32%)]" />

        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <span className="zhs-eyebrow text-primary">{copy.eyebrow}</span>
            <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-foreground md:text-4xl">
              {copy.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
              {copy.lead}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {copy.points.map((p) => (
                <span key={p} className="rounded-full border border-border bg-card px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-foreground/80">
                  {p}
                </span>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/typing/sentence" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/15 transition-all hover:-translate-y-0.5 hover:bg-primary-dark active:translate-y-0">
                {copy.primary}
              </Link>
              <Link href="/typing/zone" className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-bold text-foreground transition-all hover:border-primary/60 hover:text-primary">
                {copy.secondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Tracks Selection */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="zhs-eyebrow text-primary/70">{copy.tracks}</span>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground md:text-4xl">
              {copy.choose}
            </h2>
          </div>
          <p className="max-w-md text-sm font-medium text-muted">{copy.chooseLead}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map((card, idx) => (
            <Link
              key={card.href}
              href={card.href}
              className="zhs-card zhs-card-hover group flex h-full flex-col justify-between bg-card p-5"
            >
              <div>
                <div className="mb-4 text-2xl transition-transform origin-left group-hover:scale-110">{card.icon}</div>
                <h3 className="mb-2 text-lg font-extrabold transition-colors group-hover:text-primary">{card.label}</h3>
                <p className="text-xs leading-relaxed text-muted">{card.desc}</p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary/70 group-hover:text-primary">Step 0{idx+1}</span>
                <svg className="h-4 w-4 text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Dashboard Integration */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="zhs-card border-border bg-card p-1">
          <div className="rounded-[1.4rem] border border-border bg-background p-4 shadow-inner md:p-6">
            <TypingLobbyDashboard />
          </div>
        </div>
      </section>

      {/* 4. Knowledge Support */}
      <section className="mx-auto max-w-6xl px-6 pt-4">
        <div className="mb-12 h-px w-full bg-border" />
        <TypingContent />
      </section>
    </div>
  );
}
