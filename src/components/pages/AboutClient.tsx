"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers";

const aboutCopy = {
  ko: {
    eyebrow: "about / direction",
    title: "사람이 모든 페이지를 직접 붙들고 있지 않아도, 매일 조금씩 나아지는 웹을 실험합니다.",
    lead:
      "Zero Human Studio는 단순한 도구 모음이 아니라, 작게 공개하고 실제 사용에서 배운 것을 다시 제품과 글로 되돌리는 웹 실험입니다. 지금은 생활 도구, 개발자 유틸리티, 타자 연습, 기록형 콘텐츠가 함께 자라고 있습니다. 목표는 더 많은 페이지를 찍어내는 것이 아니라, 시간이 지날수록 사이트 안의 판단·도구·설명이 서로를 보강하는 구조를 만드는 것입니다.",
    heroNotes: ["도구", "글", "연습 제품", "운영 자동화", "검증 루프"],
    current: {
      label: "현재의 초점",
      title: "바로 쓸 수 있는 기능과 읽을 이유가 함께 있는 사이트",
      body:
        "계산기 하나, 변환기 하나만 놓고 끝내지 않습니다. 왜 그런 결과가 나오는지, 어떤 가정이 들어갔는지, 언제 공식 자료를 우선해야 하는지를 같은 흐름 안에서 설명합니다. 사용자는 결과만 가져가도 되고, 필요하면 배경까지 확인할 수 있어야 합니다.",
    },
    vision: {
      label: "비전",
      title: "AI가 만든 페이지가 아니라, AI가 계속 돌보는 웹",
      body: [
        "많은 AI 웹사이트는 한 번 생성된 뒤 멈춥니다. ZHS가 가고 싶은 방향은 다릅니다. 사이트의 각 영역을 관찰하고, 고장 난 부분을 찾고, 더 나은 설명과 도구 후보를 제안하고, 검증을 통과한 변화만 배포하는 반복 시스템을 만들고 있습니다.",
        "이 구조가 충분히 성숙하면 운영자는 매 순간 지시자가 아니라 방향을 정하는 편집자에 가까워집니다. 정기적으로 돌아오는 역할별 에이전트들이 품질, 콘텐츠, 도구, 접근성, 오류 제보를 점검하고 서로의 결과를 교차 검토합니다. 사이트는 방치되지 않고, 과장 없이, 조금씩 밀도를 높입니다.",
      ],
    },
    pillarsTitle: "ZHS가 제공하려는 가치",
    pillars: [
      {
        title: "작지만 끝까지 닿는 도구",
        body:
          "평수, 시간, 파일, 텍스트, 인증 코드처럼 작아 보이는 문제도 실제 상황에서는 시간을 빼앗습니다. ZHS의 도구는 빠른 결과와 함께 한계, 근거, 다음 행동을 보여주는 쪽으로 설계합니다.",
      },
      {
        title: "검색을 위한 글이 아니라 도구를 이해시키는 글",
        body:
          "콘텐츠는 빈 페이지를 채우기 위한 장식이 아닙니다. 사용자가 결과를 해석하거나 더 나은 작업 방식을 선택하는 데 필요한 맥락을 쌓습니다. 도구와 글이 서로 이어져야 합니다.",
      },
      {
        title: "사람의 기준을 남기는 자동화",
        body:
          "AI가 만든 결과를 그대로 믿지 않습니다. 무엇을 공개할지, 어디까지 자동화할지, 어떤 표현을 피할지에 대한 기준을 명시하고 그 기준을 에이전트의 반복 작업에 심습니다.",
      },
      {
        title: "조용한 개선의 누적",
        body:
          "큰 출시보다 중요한 것은 작은 결함을 계속 줄이는 일입니다. 틀린 IP 결과를 고친 것처럼, 사용자가 발견한 불일치는 다음 품질 규칙이 됩니다.",
      },
    ],
    systemTitle: "앞으로의 운영 설계",
    systemLead:
      "ZHS의 다음 단계는 페이지를 더 만드는 것만이 아닙니다. 사이트를 관찰하고 개선하는 고정 루프를 제품의 일부로 만드는 것입니다.",
    loops: [
      {
        name: "Scout",
        body: "사용자 흐름, 검색 수요, 반복 문의, 깨진 링크, 얇은 설명을 찾아 다음 작업 후보로 정리합니다.",
      },
      {
        name: "Builder",
        body: "후보 중 실용성이 검증된 항목을 도구, 글, UI 개선, 데이터 보강으로 구체화합니다.",
      },
      {
        name: "Reviewer",
        body: "수치 계산, 개인정보 안내, 브라우저 로컬 처리, 접근성, 모바일 레이아웃, 빌드 결과를 점검합니다.",
      },
      {
        name: "Editor",
        body: "AI 문체를 걷어내고 ZHS다운 설명으로 다듬습니다. 기능 설명보다 사용자가 얻는 판단과 행동을 우선합니다.",
      },
      {
        name: "Archivist",
        body: "변경 이유, 한계, 앞으로의 개선점을 기록해 다음 에이전트와 독자가 같은 맥락에서 이어갈 수 있게 합니다.",
      },
    ],
    roadmapTitle: "도전 방향",
    roadmap: [
      {
        title: "1. 신뢰 가능한 작은 도구의 기반",
        body:
          "브라우저 안에서 처리되는 도구는 최대한 로컬로 유지하고, 서버 호출이 필요한 기능은 이유와 처리 방식을 명확히 밝힙니다. 계산 결과에는 가정과 기준을 함께 둡니다.",
      },
      {
        title: "2. 콘텐츠와 도구의 연결",
        body:
          "가이드, 회고, 사용 노트가 도구 페이지와 연결되어 사용자가 결과의 의미를 이해하도록 돕습니다. 글은 독립된 읽을거리이면서 도구 사용의 맥락이 됩니다.",
      },
      {
        title: "3. 실험 제품의 품질 상승",
        body:
          "타자 연습처럼 단순 유틸리티보다 큰 제품은 실제 사용 흐름을 기준으로 다듬습니다. 기록, 약점 피드백, 콘텐츠 선택, 모바일 사용성을 단계적으로 개선합니다.",
      },
      {
        title: "4. 자기 점검하는 웹 운영",
        body:
          "정기 에이전트가 사이트 상태를 확인하고, 문제를 발견하고, 수정안을 만들고, 검증 결과를 남기는 운영 방식을 실험합니다. 자동화는 속도를 위한 장치가 아니라 품질 기준을 반복하기 위한 장치입니다.",
      },
    ],
    principlesTitle: "지키려는 기준",
    principles: [
      "없는 숫자를 만들지 않습니다. 사용량, 순위, 성과는 실제 근거가 있을 때만 표시합니다.",
      "도구가 참고용이면 참고용이라고 말합니다. 법률·의료·금융 판단을 대신하는 것처럼 보이게 만들지 않습니다.",
      "사용자 입력은 가능한 한 브라우저 안에서 처리합니다. 서버 처리가 필요하면 페이지에서 분명히 알립니다.",
      "AI가 만든 흔적을 숨기기보다, 사람이 세운 기준과 검증 루프가 어떻게 작동하는지 드러냅니다.",
    ],
    finalCta: {
      title: "완성된 사이트보다, 발전하는 방식을 지켜봐 주세요.",
      body:
        "ZHS는 한 번에 거대한 서비스를 약속하지 않습니다. 대신 실제로 쓸 수 있는 작은 기능을 공개하고, 잘못된 부분을 고치고, 다음 가치로 이어지는 구조를 계속 쌓겠습니다.",
      primary: "도구 둘러보기",
      secondary: "글 읽기",
    },
  },
  en: {
    eyebrow: "about / direction",
    title: "An experiment in a web that keeps improving without every page being hand-held.",
    lead:
      "Zero Human Studio is not only a directory of small tools. It is an experiment in publishing useful pieces early, learning from real use, and feeding that learning back into products and writing. Utilities, developer helpers, typing practice, and editorial notes are growing together. The goal is not to mass-produce pages, but to build a site where tools, explanations, and operating judgment reinforce each other over time.",
    heroNotes: ["tools", "posts", "practice products", "automation", "review loops"],
    current: {
      label: "Current focus",
      title: "A site with working functions and reasons to read",
      body:
        "A calculator or converter should not end at the output box. It should explain why the result appears, what assumptions it uses, and when official sources should take priority. Visitors should be able to grab the result quickly, but also inspect the context when it matters.",
    },
    vision: {
      label: "Vision",
      title: "Not pages generated by AI, but a web maintained by AI systems",
      body: [
        "Many AI-built websites are generated once and then left alone. ZHS is aiming elsewhere: a recurring system that observes each area of the site, finds broken or thin spots, proposes better explanations and tool candidates, and ships only changes that pass review.",
        "As that structure matures, the operator becomes less of a constant task dispatcher and more of an editor who sets direction. Role-specific recurring agents can inspect quality, content, tools, accessibility, and user reports, then cross-check each other. The site should not be abandoned; it should quietly become denser and more useful.",
      ],
    },
    pillarsTitle: "The value ZHS wants to provide",
    pillars: [
      {
        title: "Small tools that reach the end of the task",
        body:
          "Pyeong conversion, time, files, text, and authentication codes look small until they interrupt real work. ZHS tools are designed to provide a fast answer plus the limits, basis, and next action around it.",
      },
      {
        title: "Writing that helps tools make sense",
        body:
          "Content is not filler for search pages. It should help users interpret results or choose a better workflow. Tools and posts should point into each other.",
      },
      {
        title: "Automation that preserves human standards",
        body:
          "AI output is not accepted blindly. Standards for what gets published, how far automation should go, and which claims to avoid are made explicit and fed back into recurring agent work.",
      },
      {
        title: "Quiet accumulation of fixes",
        body:
          "Large launches matter less than steadily removing small defects. A wrong IP result, a confusing label, or a weak explanation becomes the next quality rule.",
      },
    ],
    systemTitle: "The operating design ahead",
    systemLead:
      "The next step for ZHS is not just adding more pages. It is making the improvement loop part of the product itself.",
    loops: [
      { name: "Scout", body: "Find weak flows, search demand, recurring questions, broken links, and thin explanations." },
      { name: "Builder", body: "Turn validated candidates into tools, posts, UI improvements, or supporting data." },
      { name: "Reviewer", body: "Check calculations, privacy copy, browser-local behavior, accessibility, mobile layout, and build output." },
      { name: "Editor", body: "Remove generic AI phrasing and rewrite around user judgment and action, not feature lists." },
      { name: "Archivist", body: "Record why changes were made, what limits remain, and what the next agent should know." },
    ],
    roadmapTitle: "Challenge directions",
    roadmap: [
      {
        title: "1. A trustworthy base of small tools",
        body:
          "Keep browser-local tools local where possible. When server processing is necessary, explain why and how. Pair calculation output with assumptions and limits.",
      },
      {
        title: "2. Connect content and utilities",
        body:
          "Guides, retrospectives, and notes should connect back to tools so users understand what a result means. Writing should be worth reading on its own while improving tool use.",
      },
      {
        title: "3. Raise the quality of product experiments",
        body:
          "Larger layers such as typing practice should be improved through real interaction quality: records, weak-point feedback, content choice, and mobile usability.",
      },
      {
        title: "4. Operate as a self-checking website",
        body:
          "Recurring agents should inspect the site, detect problems, propose fixes, and leave verification evidence. Automation is not only for speed; it is for repeating standards.",
      },
    ],
    principlesTitle: "Standards we intend to keep",
    principles: [
      "Do not invent numbers. Usage, ranking, and performance claims appear only with real evidence.",
      "Say when a tool is only a reference point. Do not make legal, medical, or financial decisions look delegated to a widget.",
      "Process user input in the browser whenever possible. If server processing is needed, say so on the page.",
      "Do not hide that AI is involved; show the standards and review loops that keep it accountable.",
    ],
    finalCta: {
      title: "Watch the way this site evolves, not just what it is today.",
      body:
        "ZHS is not promising a giant service all at once. It will publish useful small pieces, fix what proves wrong, and keep building the structure that turns each correction into the next layer of value.",
      primary: "Browse tools",
      secondary: "Read posts",
    },
  },
} as const;

export function AboutClient() {
  const { locale } = useLocale();
  const about = aboutCopy[locale];

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div>
            <p className="zhs-eyebrow">{about.eyebrow}</p>
            <h1 className="mt-4 font-mono text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              {about.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted">
              {about.lead}
            </p>
          </div>
          <aside className="rounded-md border border-border bg-card p-6">
            <p className="zhs-eyebrow">studio map</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {about.heroNotes.map((note) => (
                <span key={note} className="rounded-full border border-border bg-background px-3 py-1 font-mono text-xs text-muted">
                  {note}
                </span>
              ))}
            </div>
            <div className="mt-6 border-t border-border pt-6">
              <p className="font-mono text-xs uppercase tracking-wider text-primary">{about.current.label}</p>
              <h2 className="mt-2 font-mono text-lg font-semibold tracking-tight">{about.current.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{about.current.body}</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="zhs-eyebrow">{about.vision.label}</p>
            <h2 className="mt-3 font-mono text-2xl font-bold tracking-tight md:text-3xl">
              {about.vision.title}
            </h2>
          </div>
          <div className="space-y-4 text-base leading-relaxed text-muted">
            {about.vision.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-mono text-2xl font-bold tracking-tight md:text-3xl">{about.pillarsTitle}</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {about.pillars.map((pillar) => (
            <article key={pillar.title} className="rounded-md border border-border bg-background p-6">
              <h3 className="font-mono text-lg font-semibold tracking-tight">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{pillar.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-3xl">
            <p className="zhs-eyebrow">operating model</p>
            <h2 className="mt-3 font-mono text-2xl font-bold tracking-tight md:text-3xl">{about.systemTitle}</h2>
            <p className="mt-4 text-muted">{about.systemLead}</p>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-5">
            {about.loops.map((loop) => (
              <article key={loop.name} className="rounded-md border border-border bg-background p-5">
                <p className="font-mono text-sm font-semibold text-primary">{loop.name}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{loop.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="zhs-eyebrow">roadmap</p>
          <h2 className="mt-3 font-mono text-2xl font-bold tracking-tight md:text-3xl">{about.roadmapTitle}</h2>
        </div>
        <div className="space-y-5">
          {about.roadmap.map((item) => (
            <article key={item.title} className="rounded-md border border-border bg-background p-6">
              <h3 className="font-mono text-base font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-md border border-border bg-card p-8 md:p-10">
          <h2 className="font-mono text-2xl font-bold tracking-tight">{about.principlesTitle}</h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {about.principles.map((principle) => (
              <li key={principle} className="rounded-md border border-border bg-background p-4 text-sm leading-relaxed text-muted">
                {principle}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="font-mono text-2xl font-bold tracking-tight md:text-3xl">{about.finalCta.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">{about.finalCta.body}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/tools"
              className="rounded-sm border border-foreground bg-foreground px-5 py-2.5 font-mono text-sm text-background transition-colors hover:border-primary hover:bg-primary"
            >
              {about.finalCta.primary}
            </Link>
            <Link
              href="/posts"
              className="rounded-sm border border-border px-5 py-2.5 font-mono text-sm text-foreground transition-colors hover:border-foreground"
            >
              {about.finalCta.secondary}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
