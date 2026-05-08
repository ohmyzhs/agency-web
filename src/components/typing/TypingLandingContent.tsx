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
    primary: "라이브러리 시작",
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
    primary: "Start Library",
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
    <div className="flex flex-col gap-24 pb-32">
      {/* 1. Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-40 bg-zinc-950 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 -z-10">
           <div className="absolute top-0 right-0 h-[500px] w-[500px] bg-primary/20 rounded-full blur-[120px] -mr-32 -mt-32" />
           <div className="absolute bottom-0 left-0 h-[400px] w-[400px] bg-indigo-500/10 rounded-full blur-[100px] -ml-20 -mb-20" />
        </div>

        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-16 lg:grid-cols-[1fr_400px] lg:items-center">
            <div>
              <span className="zhs-eyebrow text-primary">{copy.eyebrow}</span>
              <h1 className="mt-8 text-5xl font-black tracking-tight text-white md:text-8xl leading-[1.05] animate-fade-in-up">
                {copy.title}
              </h1>
              <p className="mt-10 max-w-2xl text-xl leading-relaxed text-zinc-400 md:text-2xl animate-fade-in-up animate-delay-100">
                {copy.lead}
              </p>

              <div className="mt-12 flex flex-wrap gap-3 animate-fade-in-up animate-delay-200">
                {copy.points.map((p) => (
                  <span key={p} className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                    {p}
                  </span>
                ))}
              </div>

              <div className="mt-12 flex flex-wrap gap-5 animate-fade-in-up animate-delay-300">
                <Link href="/typing/word" className="rounded-2xl bg-primary px-10 py-4 text-base font-bold text-white shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                  {copy.primary}
                </Link>
                <Link href="/typing/zone" className="rounded-2xl border border-zinc-800 bg-zinc-900/50 px-10 py-4 text-base font-bold text-zinc-300 hover:text-white hover:border-zinc-600 transition-all">
                  {copy.secondary}
                </Link>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="zhs-card bg-[#0c0c0e] border-white/5 p-8 shadow-2xl relative">
                <div className="flex items-center justify-between mb-12">
                   <div className="h-3 w-3 rounded-full bg-red-500/20" />
                   <div className="h-1 w-20 bg-zinc-800 rounded-full" />
                   <div className="flex gap-2">
                     <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                     <div className="h-1.5 w-1.5 rounded-full bg-zinc-800" />
                   </div>
                </div>
                <div className="space-y-6">
                   <div className="h-2 w-3/4 bg-zinc-800 rounded" />
                   <div className="h-2 w-full bg-zinc-900 rounded" />
                   <div className="h-2 w-5/6 bg-zinc-900 rounded" />
                </div>
                <div className="mt-16 flex justify-between items-end">
                   <div className="text-4xl font-black text-white italic">540</div>
                   <div className="text-[10px] font-bold text-primary uppercase tracking-widest">Speed Core</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Tracks Selection */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="zhs-eyebrow text-primary/40">{copy.tracks}</span>
            <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl text-gradient">
              {copy.choose}
            </h2>
          </div>
          <p className="max-w-md text-muted font-medium italic">{copy.chooseLead}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map((card, idx) => (
            <Link
              key={card.href}
              href={card.href}
              className="zhs-card zhs-card-hover group p-8 flex flex-col justify-between h-full bg-card"
            >
              <div>
                <div className="text-3xl mb-8 group-hover:scale-125 transition-transform origin-left">{card.icon}</div>
                <h3 className="text-xl font-extrabold mb-3 group-hover:text-primary transition-colors">{card.label}</h3>
                <p className="text-xs leading-relaxed text-muted/80">{card.desc}</p>
              </div>
              <div className="mt-12 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary/40 group-hover:text-primary">Step 0{idx+1}</span>
                <svg className="h-4 w-4 text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Dashboard Integration */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="zhs-card bg-accent/10 border-transparent p-1">
          <div className="bg-background rounded-[1.4rem] p-8 md:p-12 border border-white/5 shadow-inner">
            <TypingLobbyDashboard />
          </div>
        </div>
      </section>

      {/* 4. Knowledge Support */}
      <section className="mx-auto max-w-6xl px-6 pt-12">
        <div className="h-px w-full bg-border mb-20" />
        <TypingContent />
      </section>
    </div>
  );
}
