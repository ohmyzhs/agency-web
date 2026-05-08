"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers";

const aboutCopy = {
  ko: {
    eyebrow: "ABOUT / DIRECTION",
    title: "AI와 사람이 협업하여 매일 조금씩 정교해지는 웹 스튜디오.",
    lead:
      "Zero Human Studio(ZHS)는 단순한 도구 모음을 넘어, 데이터의 가치와 기술의 실용성을 탐구하는 빌드 랩입니다. 우리는 화려한 마케팅 뒤에 숨지 않고, 매일 업데이트되는 도구와 정직한 기술 회고를 통해 사용자에게 직접적인 유용함을 제공합니다.",
    heroNotes: ["Intelligence", "Automation", "Craftsmanship", "Studio", "Labs"],
    current: {
      label: "CURRENT FOCUS",
      title: "기능적 완결성과 맥락이 있는 사용자 경험",
      body:
        "우리는 결과값만 던져주는 '블랙박스' 도구를 거부합니다. 모든 변환기와 계산기는 그 근거와 한계를 명확히 설명하며, 사용자가 스스로 판단할 수 있는 지능을 보충합니다.",
    },
    vision: {
      label: "VISION",
      title: "생성된 웹이 아닌, 지속적으로 관리되는 지능형 시스템",
      body: [
        "많은 AI 사이트들이 한 번의 생성 후 방치됩니다. ZHS는 다릅니다. 우리는 사이트의 결함을 스스로 발견하고, 더 나은 해결책을 제안하며, 사람의 최종 검토를 거쳐 배포되는 '살아있는 시스템'을 구축하고 있습니다.",
        "운영자는 단순 작업자가 아니라 시스템의 방향을 조율하는 오케스트레이터가 됩니다. 에이전트들은 품질, 데이터 정합성, 사용성 피드백을 실시간으로 반영하며 사이트의 밀도를 조용히 높여갑니다.",
      ],
    },
    pillarsTitle: "Studio Value",
    pillars: [
      {
        title: "작지만 끝까지 해결하는 도구",
        body: "사소해 보이지만 작업의 흐름을 끊는 평수 계산, 시간대 환산 등의 문제를 정교하게 해결합니다.",
      },
      {
        title: "도구를 이해시키는 고품질 기록",
        body: "글은 단순한 텍스트가 아닙니다. 사용자가 도구의 결과값을 신뢰하고 활용하는 데 필요한 전문적 맥락을 제공합니다.",
      },
      {
        title: "인간의 감각을 담은 자동화",
        body: "AI의 속도에 인간의 품질 기준을 결합합니다. 무엇을 자동화할지, 어떤 표현이 부적절한지 사람이 결정하고 AI가 반복합니다.",
      },
      {
        title: "조용한 품질의 누적",
        body: "우리는 거창한 로드맵보다 오늘 발견한 작은 오차를 수정하는 일을 더 가치 있게 여깁니다. 모든 수정은 기록되고 다음 품질 규칙이 됩니다.",
      },
    ],
    systemTitle: "Studio Model",
    systemLead:
      "우리의 핵심 제품은 페이지가 아니라, 페이지를 개선하는 '시스템' 그 자체입니다.",
    loops: [
      { name: "Scout", body: "흐름의 결함과 사용자 니즈를 탐색합니다." },
      { name: "Builder", body: "검증된 아이디어를 도구와 코드로 구현합니다." },
      { name: "Reviewer", body: "수치와 접근성, 보안을 엄격히 검토합니다." },
      { name: "Editor", body: "AI의 흔적을 지우고 스튜디오의 목소리를 입힙니다." },
      { name: "Archivist", body: "모든 지식과 결정을 기록하여 맥락을 보존합니다." },
    ],
    roadmapTitle: "Challenge",
    roadmap: [
      {
        title: "신뢰 가능한 데이터 인프라",
        body: "모든 연산의 근거를 공개하고, 데이터 주권을 사용자에게 돌려주기 위해 브라우저 로컬 처리를 원칙으로 합니다.",
      },
      {
        title: "유기적 콘텐츠 통합",
        body: "도구와 가이드, 회고록이 서로 연결되어 하나의 거대한 지식 지도를 형성하는 사용자 환경을 구축합니다.",
      },
      {
        title: "경험 중심의 제품 레이어",
        body: "단순 유틸리티를 넘어 타자연습과 같은 복합적인 인터랙션 제품의 품질을 프로페셔널 수준으로 끌어올립니다.",
      },
      {
        title: "자기 자율적 웹 운영",
        body: "에이전트가 스스로 문제를 보고하고 해결책을 배포하는, 운영 리소스 제로에 수렴하는 미래형 웹을 실험합니다.",
      },
    ],
    principlesTitle: "Principles",
    principles: [
      "실제 근거가 없는 숫자는 절대 기록하지 않습니다.",
      "도구의 한계를 숨기지 않고 명확히 공지합니다.",
      "사용자 프라이버시를 위해 데이터 전송을 최소화합니다.",
      "AI의 도움을 받되, 최종 책임은 항상 스튜디오에 있습니다.",
    ],
    finalCta: {
      title: "결과보다 발전하는 과정을 공유합니다.",
      body:
        "우리는 완성된 조각상이 아닌, 매일 깎여 나가는 돌을 보여드리고자 합니다. ZHS가 쌓아가는 기술의 밀도를 함께 지켜봐 주세요.",
      primary: "라이브러리",
      secondary: "아카이브",
    },
  },
  en: {
    eyebrow: "ABOUT / DIRECTION",
    title: "A Technical Studio Evolving Daily through AI-Human Collaboration.",
    lead:
      "Zero Human Studio (ZHS) is more than a utility collection; it's a build lab exploring the intersection of data value and practical engineering. We skip the marketing fluff and deliver direct utility through daily updated tools and honest technical retrospectives.",
    heroNotes: ["Intelligence", "Automation", "Craftsmanship", "Studio", "Labs"],
    current: {
      label: "CURRENT FOCUS",
      title: "Functional Integrity and Contextual UX",
      body:
        "We reject 'black-box' tools that only spit out results. Every converter and calculator clearly explains its basis and limits, supplementing the user's own intelligence to make informed decisions.",
    },
    vision: {
      label: "VISION",
      title: "A Living System, Not a Static Website",
      body: [
        "Most AI-built sites are abandoned after generation. ZHS is different. We are building a 'living system' that detects its own flaws, proposes solutions, and deploys changes after human review.",
        "The operator becomes an orchestrator of the system's direction. Agents reflect quality, data integrity, and usability feedback in real-time, quietly increasing the site's density and value.",
      ],
    },
    pillarsTitle: "Studio Value",
    pillars: [
      {
        title: "Small but Decisive Tools",
        body: "We solve seemingly trivial but workflow-breaking problems like Pyeong conversion and timezone shifts with precision.",
      },
      {
        title: "High-Fidelity Documentation",
        body: "Our content isn't just text; it provides the professional context users need to trust and utilize tool outputs.",
      },
      {
        title: "Human-Centered Automation",
        body: "We combine human quality standards with AI speed. Humans decide the boundaries; AI executes the repetition.",
      },
      {
        title: "Accumulation of Quiet Fixes",
        body: "We value fixing a small error discovered today more than a grand roadmap. Every fix becomes the next quality rule.",
      },
    ],
    systemTitle: "Studio Model",
    systemLead:
      "Our core product is not the pages, but the 'system' that improves them.",
    loops: [
      { name: "Scout", body: "Explores workflow flaws and user needs." },
      { name: "Builder", body: "Implements validated ideas into tools and code." },
      { name: "Reviewer", body: "Strictly audits logic, accessibility, and security." },
      { name: "Editor", body: "Refines the studio's voice and removes AI artifacts." },
      { name: "Archivist", body: "Records decisions to preserve technical context." },
    ],
    roadmapTitle: "Challenge",
    roadmap: [
      {
        title: "Reliable Data Infrastructure",
        body: "We disclose all calculation logic and prioritize browser-local processing to return data sovereignty to users.",
      },
      {
        title: "Organic Content Integration",
        body: "We build an environment where tools, guides, and logs interconnect to form a vast technical knowledge map.",
      },
      {
        title: "Experience-Driven Products",
        body: "We elevate complex interaction layers like typing practice to professional-grade product quality.",
      },
      {
        title: "Autonomous Web Operations",
        body: "We experiment with a future where agents report issues and deploy solutions with zero human overhead.",
      },
    ],
    principlesTitle: "Principles",
    principles: [
      "Never display numbers without verifiable evidence.",
      "Clearly state tool limitations without hiding them.",
      "Minimize data transmission for user privacy.",
      "Final responsibility always lies with the studio.",
    ],
    finalCta: {
      title: "Sharing the Process of Evolution.",
      body:
        "We are not showing a finished statue, but the stone being carved every day. Watch the density of technology ZHS builds over time.",
      primary: "Library",
      secondary: "Archive",
    },
  },
} as const;

export function AboutClient() {
  const { locale } = useLocale();
  const about = aboutCopy[locale];

  return (
    <div className="flex flex-col gap-24 pb-32">
      {/* 1. Impact Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-24 md:pt-32">
        <div className="grid gap-16 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <span className="zhs-eyebrow text-primary/60">{about.eyebrow}</span>
            <h1 className="mt-8 text-4xl font-black tracking-tight text-foreground md:text-7xl lg:leading-[1.1] animate-fade-in-up">
              {about.title}
            </h1>
            <p className="mt-10 max-w-3xl text-xl leading-relaxed text-muted/80 md:text-2xl animate-fade-in-up animate-delay-100">
              {about.lead}
            </p>
          </div>

          <aside className="zhs-card p-8 bg-card shadow-2xl shadow-primary/5 animate-fade-in-up animate-delay-200">
            <div className="flex flex-wrap gap-2 mb-8">
              {about.heroNotes.map((note) => (
                <span key={note} className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md bg-accent/50 text-primary border border-primary/10">
                  {note}
                </span>
              ))}
            </div>
            <div className="pt-8 border-t border-border">
              <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest">{about.current.label}</span>
              <h2 className="mt-3 text-xl font-extrabold tracking-tight">{about.current.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted/80">{about.current.body}</p>
            </div>
          </aside>
        </div>
      </section>

      {/* 2. Vision & Philosophy — High Contrast Bento */}
      <section className="bg-zinc-950 py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
             <div>
                <span className="zhs-eyebrow text-zinc-600">{about.vision.label}</span>
                <h2 className="mt-6 text-3xl font-black text-white md:text-5xl leading-tight">
                  {about.vision.title}
                </h2>
                <div className="mt-10 space-y-6 text-lg text-zinc-400 leading-relaxed">
                  {about.vision.body.map((p) => <p key={p}>{p}</p>)}
                </div>
             </div>

             <div className="grid gap-4 grid-cols-2">
                <div className="zhs-card bg-zinc-900 border-zinc-800 p-6 flex flex-col justify-between aspect-square">
                   <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-black italic">S</div>
                   <p className="text-zinc-300 font-bold leading-tight">Self-Correction System</p>
                </div>
                <div className="zhs-card bg-zinc-900 border-zinc-800 p-6 flex flex-col justify-between aspect-square translate-y-8">
                   <div className="h-8 w-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500 font-black italic">O</div>
                   <p className="text-zinc-300 font-bold leading-tight">Orchestrated Intelligence</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 3. Studio Values */}
      <section className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl font-black uppercase tracking-tight md:text-4xl text-gradient">{about.pillarsTitle}</h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {about.pillars.map((pillar) => (
            <article key={pillar.title} className="zhs-card p-8 group">
              <h3 className="text-lg font-black leading-tight group-hover:text-primary transition-colors">{pillar.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted/80">{pillar.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 4. Operating Model — Horizontal Flow */}
      <section className="bg-accent/20 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <span className="zhs-eyebrow text-primary/40">OPERATING MODEL</span>
            <h2 className="mt-6 text-3xl font-black tracking-tight md:text-5xl">{about.systemTitle}</h2>
            <p className="mt-6 text-lg text-muted leading-relaxed">{about.systemLead}</p>
          </div>

          <div className="mt-16 grid gap-4 md:grid-cols-5">
            {about.loops.map((loop, idx) => (
              <div key={loop.name} className="relative">
                <article className="zhs-card p-6 bg-card h-full">
                  <span className="text-[10px] font-black text-primary/30 uppercase mb-3 block">Step 0{idx+1}</span>
                  <p className="text-base font-black text-foreground mb-3">{loop.name}</p>
                  <p className="text-xs leading-relaxed text-muted">{loop.body}</p>
                </article>
                {idx < 4 && (
                  <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-border">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Roadmap & Challenge */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="grid gap-16 lg:grid-cols-[400px_1fr]">
          <div>
            <span className="zhs-eyebrow text-primary/60">ROADMAP</span>
            <h2 className="mt-6 text-3xl font-black tracking-tight md:text-5xl leading-tight">{about.roadmapTitle}</h2>
            <div className="mt-10 p-6 rounded-2xl bg-zinc-950 text-zinc-500 font-mono text-[10px] leading-relaxed uppercase tracking-widest">
               Status: Actively Building<br/>
               Current Tier: 1 (Foundation)<br/>
               Agents Active: 3 (Dev, Content, QA)
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {about.roadmap.map((item) => (
              <article key={item.title} className="zhs-card p-8 bg-card flex flex-col justify-between">
                <h3 className="text-xl font-extrabold tracking-tight">{item.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted/80">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Principles */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="rounded-[3rem] bg-zinc-950 p-12 md:p-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 h-64 w-64 bg-primary/10 rounded-full blur-[80px]" />

          <h2 className="text-3xl font-black md:text-5xl">{about.principlesTitle}</h2>
          <ul className="mt-12 grid gap-10 md:grid-cols-2">
            {about.principles.map((principle) => (
              <li key={principle} className="flex gap-6 items-start group">
                <div className="h-6 w-6 shrink-0 rounded-full border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-500 group-hover:border-primary group-hover:text-primary transition-all">
                  ✓
                </div>
                <p className="text-lg font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">{principle}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7. Final CTA */}
      <section className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-4xl font-black tracking-tight md:text-7xl leading-tight">{about.finalCta.title}</h2>
        <p className="mt-10 text-xl text-muted leading-relaxed max-w-2xl mx-auto">{about.finalCta.body}</p>
        <div className="mt-16 flex flex-col sm:flex-row justify-center gap-6">
          <Link
            href="/tools"
            className="rounded-[2rem] bg-primary px-12 py-5 text-lg font-black text-white transition-all hover:bg-primary-dark hover:scale-110 active:scale-95 shadow-2xl"
          >
            {about.finalCta.primary}
          </Link>
          <Link
            href="/posts"
            className="rounded-[2rem] border-2 border-border px-12 py-5 text-lg font-bold text-foreground hover:border-foreground transition-all"
          >
            {about.finalCta.secondary}
          </Link>
        </div>
      </section>
    </div>
  );
}
