"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers";
import { getToolsByTier } from "@/lib/tools";

const tierLabels = [
  { tier: 1 as const, icon: "🇰🇷", label: "Korea-friendly tools", labelKo: "한국 생활 도구" },
  { tier: 2 as const, icon: "🤖", label: "AI & automation utilities", labelKo: "AI & 자동화 유틸리티" },
  { tier: 3 as const, icon: "⚡", label: "Micro utilities", labelKo: "마이크로 유틸리티" },
];

export default function Home() {
  const { t, locale } = useLocale();
  const tierOneTools = getToolsByTier(1);

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            {locale === "ko" ? "AI가 만든 실용 도구 스튜디오" : "AI-built practical tools studio"}
          </p>
          <h1 className="animate-fade-in-up mt-3 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            {locale === "ko" ? (
              <>실용적인 도구,<br /><span className="text-gradient">즉시 사용 가능.</span></>
            ) : (
              <>Practical tools,<br /><span className="text-gradient">ready to use.</span></>
            )}
          </h1>
          <p className="animate-fade-in-up animate-delay-100 mt-6 text-lg text-muted md:text-xl">
            {locale === "ko"
              ? "한국 생활 변환기, AI 비용 계산기, 개발자 유틸리티까지. 설명과 예시가 포함된 실용적인 웹 도구."
              : "Korean living converters, AI cost calculators, and developer utilities. Practical web tools with explanations and examples."}
          </p>
          <div className="animate-fade-in-up animate-delay-200 mt-8 flex flex-wrap gap-4">
            <Link
              href="/tools"
              className="rounded-lg bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary-dark"
            >
              {locale === "ko" ? "도구 보기" : "Browse Tools"}
            </Link>
            <Link
              href="/about"
              className="rounded-lg border border-border px-6 py-3 font-medium transition-colors hover:bg-card"
            >
              {locale === "ko" ? "스튜디오 소개" : "About Us"}
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-card py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold tracking-tight">
            {locale === "ko" ? "만들고 있는 도구들" : "What we build"}
          </h2>
          <p className="mt-2 text-muted">
            {locale === "ko"
              ? `${tierOneTools.length}개의 한국 친화 도구와 실용 유틸리티를 AI 에이전트 팀이 만듭니다.`
              : `${tierOneTools.length} Korea-friendly tools and practical utilities, built by our AI agent team.`}
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {tierLabels.map(({ tier, icon, label, labelKo }) => {
              const tools = getToolsByTier(tier);
              return (
                <div
                  key={tier}
                  className="hover-lift rounded-xl border border-border bg-background p-8 transition-all hover:border-primary/30 hover:shadow-lg"
                >
                  <span className="text-3xl">{icon}</span>
                  <h3 className="mt-4 text-xl font-semibold">
                    {locale === "ko" ? labelKo : label}
                  </h3>
                  <ul className="mt-3 space-y-1">
                    {tools.slice(0, 4).map((tool) => (
                      <li key={tool.slug} className="text-sm text-muted">
                        {tool.shortTitle}
                      </li>
                    ))}
                    {tools.length > 4 && (
                      <li className="text-sm text-muted">
                        +{tools.length - 4} more
                      </li>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          {t.cta.title}
        </h2>
        <p className="mt-4 text-lg text-muted">{t.cta.description}</p>
        <Link
          href="/tools"
          className="mt-8 inline-block rounded-lg bg-primary px-8 py-3 font-medium text-white transition-colors hover:bg-primary-dark"
        >
          {locale === "ko" ? "도구 둘러보기" : "Explore Tools"}
        </Link>
      </section>
    </>
  );
}
