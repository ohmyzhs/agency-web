"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useLocale } from "@/components/providers";
import QuickToolSlots from "@/components/tools/shared/QuickToolSlots";
import { getRelatedTools, getToolContent, type Tool, type ToolDataNotice } from "@/lib/tools";
import { filterPostsForLocale, getPostContent, type Post } from "@/lib/post-types";

const localOnlyCategories = new Set(["developer-automation", "micro-utility", "file-media"]);

const defaultDataNotices: Record<"ko" | "en", Record<string, ToolDataNotice>> = {
  ko: {
    local: {
      processing: "브라우저 로컬 처리: 이 도구의 주요 계산·변환은 사용자의 브라우저에서 실행됩니다.",
      storage: "서버 저장 없음: 즐겨찾기 같은 UI 설정을 제외하고 입력 파일이나 텍스트를 ZHS 서버에 저장하지 않습니다.",
      caution: "민감정보 주의: 로컬 처리라도 운영 비밀키, 주민등록번호, 금융정보, 고객 원본 데이터는 공개 웹 도구에 입력하지 않는 것을 권장합니다.",
    },
    network: {
      processing: "네트워크 요청 사용: 이 도구는 IP 확인, DNS/HTTP 진단, webhook 테스트처럼 외부 URL 또는 ZHS API를 호출할 수 있습니다.",
      storage: "저장 최소화: 화면에 결과를 표시하기 위한 요청이며, 공개 페이지는 입력값을 영구 저장하는 기능을 제공하지 않습니다. 다만 대상 서버·중간 네트워크·호스팅 로그에는 요청 흔적이 남을 수 있습니다.",
      caution: "합법적 사용: 본인 소유 또는 테스트 허가를 받은 대상만 진단하세요. 인증 토큰, 내부망 주소, 운영 webhook secret은 입력하지 마세요.",
    },
    estimate: {
      processing: "참고용 계산: 이 도구는 입력값과 공개된 일반 공식을 바탕으로 빠른 추정값을 제공합니다.",
      storage: "서버 저장 없음: 계산 입력값은 결과 표시용으로만 사용되며 ZHS 서버에 저장하지 않습니다.",
      caution: "검증 필요: 법률·세무·급여·부동산·재정 판단에는 최신 공식 기준과 전문가 확인이 필요합니다.",
    },
  },
  en: {
    local: {
      processing: "Browser-local processing: the main calculation or conversion runs in your browser.",
      storage: "No server storage: except for UI preferences such as favorites, ZHS does not store your input files or text on the server.",
      caution: "Sensitive-data caution: even with local processing, avoid entering production secrets, national IDs, financial data, or raw customer data into public web tools.",
    },
    network: {
      processing: "Network requests: this tool may call external URLs or ZHS APIs for IP checks, DNS/HTTP diagnostics, or webhook tests.",
      storage: "Minimal retention: the public page displays results and does not provide permanent input storage, but target servers, intermediaries, or hosting logs may record request traces.",
      caution: "Authorized use only: test only targets you own or have permission to inspect. Do not enter auth tokens, internal addresses, or production webhook secrets.",
    },
    estimate: {
      processing: "Reference calculation: this tool provides quick estimates from your inputs and common public formulas.",
      storage: "No server storage: calculation inputs are only used to display the result and are not stored by ZHS.",
      caution: "Verification required: legal, tax, payroll, real-estate, or financial decisions require current official sources and expert review.",
    },
  },
};

function getDefaultDataNotice(tool: Tool, locale: "ko" | "en"): ToolDataNotice {
  if (tool.category === "network-diagnostics" || tool.slug === "webhook-request-simulator") {
    return defaultDataNotices[locale].network;
  }
  if (tool.category === "time-money" || tool.category === "korea-living") {
    return defaultDataNotices[locale].estimate;
  }
  return defaultDataNotices[locale].local;
}

type ToolPageShellProps = {
  tool: Tool;
  guidePosts?: Post[];
  children?: ReactNode;
};

export function ToolPageShell({ tool, guidePosts = [], children }: ToolPageShellProps) {
  const { locale, t } = useLocale();
  const content = getToolContent(tool, locale);
  const localizedGuidePosts = filterPostsForLocale(guidePosts, locale);
  const relatedTools = getRelatedTools(tool);
  const categoryLabel = t.categories[tool.category] ?? tool.category;
  const showPrivacyNote = localOnlyCategories.has(tool.category);
  const dataNotice = content.dataNotice ?? getDefaultDataNotice(tool, locale);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
      <Link
        href="/tools"
        className="group inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-primary transition-colors"
      >
        <svg className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        {t.tools.backToTools}
      </Link>

      <div className="mt-5">
        <QuickToolSlots currentSlug={tool.slug} currentCategory={tool.category} />
      </div>

      <article className="mt-8 animate-fade-in-up">
        <header className="mb-7">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
              {categoryLabel}
            </span>
            <div className="h-px w-8 bg-border" />
            <span className="text-[10px] font-bold text-muted/40 uppercase tracking-widest">
              Verified Tool
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground md:text-5xl">
            {content.title}
          </h1>
          <p className="mt-4 text-lg text-muted leading-relaxed max-w-3xl">
            {content.description}
          </p>
        </header>

        <section
          className="zhs-card p-1 shadow-lg shadow-primary/5 bg-accent/20"
          aria-label={`${content.title} ${t.tools.workspaceLabel}`}
        >
          <div className="bg-card rounded-[1.1rem] p-4 md:p-6 border border-white/10">
            {children ?? (
              <div className="text-center py-20">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-muted/40">
                  {t.tools.placeholderTitle}
                </p>
                <h2 className="mt-4 text-2xl font-extrabold text-foreground/20 italic">
                  {t.tools.placeholderHeading.replace("{tool}", content.shortTitle)}
                </h2>
              </div>
            )}
          </div>
        </section>

        {showPrivacyNote && (
          <div className="mt-6 flex items-center gap-3 px-6 py-3 rounded-2xl bg-primary/5 border border-primary/10">
            <svg className="h-4 w-4 text-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            <p className="text-xs font-bold text-primary/60 uppercase tracking-tighter">{t.tools.privacyNote}</p>
          </div>
        )}

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-6">
            {/* Logic & Methodology */}
            <section>
              <h2 className="text-lg font-black tracking-tight text-foreground mb-4">
                {t.tools.howToRead}
              </h2>
              <div className="grid gap-3 md:grid-cols-3">
                {content.explanation.map((paragraph) => (
                  <p key={paragraph} className="rounded-2xl border border-border bg-card p-4 text-sm text-muted leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            {/* Examples */}
            <section>
              <h2 className="text-lg font-black tracking-tight text-foreground mb-4">
                {t.tools.examples}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {content.examples.map((example) => (
                  <div
                    key={example.label}
                    className="zhs-card p-4 bg-accent/10 border-transparent hover:border-border transition-all"
                  >
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted/60 mb-4">
                      {example.label}
                    </p>
                    <div className="space-y-3 font-mono text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted/40">In</span>
                        <span className="text-foreground">{example.input}</span>
                      </div>
                      <div className="h-px bg-border/40" />
                      <div className="flex justify-between">
                        <span className="text-primary/60 font-bold">Out</span>
                        <span className="text-primary font-black">{example.output}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQs */}
            <section>
              <h2 className="text-lg font-black tracking-tight text-foreground mb-4">
                {t.tools.faqs}
              </h2>
              <div className="space-y-4">
                {content.faqs.map((faq) => (
                  <div key={faq.question} className="group">
                    <h3 className="text-base font-extrabold text-foreground group-hover:text-primary transition-colors flex gap-3">
                      <span className="text-primary/40 italic font-black">Q.</span>
                      {faq.question}
                    </h3>
                    <p className="mt-2 text-sm text-muted leading-relaxed pl-8">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-primary/10 bg-primary/5 p-5">
              <h2 className="text-lg font-black tracking-tight text-foreground mb-4">
                {locale === "ko" ? "데이터 처리 안내" : "Data handling notice"}
              </h2>
              <div className="grid gap-3 md:grid-cols-3">
                <p className="rounded-xl bg-background/80 p-4 text-sm leading-relaxed text-muted">{dataNotice.processing}</p>
                <p className="rounded-xl bg-background/80 p-4 text-sm leading-relaxed text-muted">{dataNotice.storage}</p>
                <p className="rounded-xl bg-background/80 p-4 text-sm leading-relaxed text-muted">{dataNotice.caution}</p>
              </div>
            </section>
          </div>

          <aside className="space-y-5">
             {/* Tech Specs */}
             <div className="zhs-card p-5 bg-card lg:sticky lg:top-24">
                <h3 className="text-xs font-black uppercase tracking-[0.16em] text-muted mb-4">Tool Specifications</h3>
                <div className="space-y-5">
                  <div>
                    <p className="text-[10px] font-bold text-muted/40 uppercase mb-2">Inputs</p>
                    <ul className="space-y-3">
                      {content.inputs.map((input) => (
                        <li key={input.label} className="text-sm font-medium leading-tight">
                          <span className="text-foreground block">{input.label}</span>
                          <span className="text-muted text-[12px]">{input.description}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="h-px bg-border" />
                  <div>
                    <p className="text-[10px] font-bold text-muted/40 uppercase mb-2">Outputs</p>
                    <ul className="space-y-3">
                      {content.outputs.map((output) => (
                        <li key={output.label} className="text-sm font-medium leading-tight">
                          <span className="text-foreground block">{output.label}</span>
                          <span className="text-muted text-[12px]">{output.description}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
             </div>

             {/* Detailed guides */}
             {localizedGuidePosts.length > 0 && (
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.16em] text-muted mb-3 px-2">
                    {locale === "ko" ? "상세 가이드" : "Detailed guides"}
                  </h3>
                  <div className="space-y-3">
                    {localizedGuidePosts.map((post) => {
                      const postContent = getPostContent(post, locale);
                      return (
                        <Link
                          key={post.slug}
                          href={`/posts/${post.slug}`}
                          className="zhs-card p-3 block text-sm font-bold text-muted hover:text-primary hover:border-primary/30 transition-all"
                        >
                          <span className="line-clamp-2">{postContent.title}</span>
                          <span className="mt-1 block font-mono text-[10px] font-medium uppercase tracking-widest text-muted/40">
                            {post.readingMinutes}m · {post.publishedAt}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
             )}

             {/* Related */}
             {relatedTools.length > 0 && (
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.16em] text-muted mb-3 px-2">Related Intelligence</h3>
                  <div className="space-y-3">
                    {relatedTools.map((related) => {
                      const relatedContent = getToolContent(related, locale);
                      return (
                        <Link
                          key={related.slug}
                          href={`/tools/${related.slug}`}
                          className="zhs-card p-3 block text-sm font-bold text-muted hover:text-primary hover:border-primary/30 transition-all"
                        >
                          {relatedContent.shortTitle}
                        </Link>
                      );
                    })}
                  </div>
                </div>
             )}
          </aside>
        </div>
      </article>
    </div>
  );
}
