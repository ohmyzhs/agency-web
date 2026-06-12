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

type ToolEditorialContext = {
  useCase: string;
  workflow: string;
  limitation: string;
};

function getToolEditorialContext(tool: Tool, locale: "ko" | "en"): ToolEditorialContext {
  const content = getToolContent(tool, locale);
  const firstInput = content.inputs[0]?.label ?? (locale === "ko" ? "입력값" : "input");
  const secondInput = content.inputs[1]?.label ?? (locale === "ko" ? "옵션" : "options");
  const firstOutput = content.outputs[0]?.label ?? (locale === "ko" ? "결과" : "result");
  const example = content.examples[0];

  if (locale === "ko") {
    const categoryUseCases: Record<string, string> = {
      "korea-living": "한국 생활에서 자주 마주치는 단위, 면적, 사이즈, 행정·생활 기준을 빠르게 비교해야 할 때 유용합니다.",
      "time-money": "날짜, 시간, 금액, 이자, 세금처럼 의사결정 전에 먼저 대략적인 수치를 확인해야 할 때 유용합니다.",
      "file-media": "이미지, PDF, 파일처럼 외부 서비스에 올리기 전 용량, 형식, 개인정보 노출 가능성을 점검해야 할 때 유용합니다.",
      "network-diagnostics": "IP, HTTP, DNS, webhook처럼 네트워크 동작을 확인하고 요청·응답 흐름을 빠르게 재현해야 할 때 유용합니다.",
      "developer-automation": "개발, 문서화, 자동화 작업 중 반복되는 변환·검증·디버깅 절차를 한 화면에서 끝내야 할 때 유용합니다.",
      "business-automation": "운영, 마케팅, 보고, 협업 자동화에서 작은 입력을 구조화된 결과로 바꿔야 할 때 유용합니다.",
      "micro-utility": "작지만 자주 필요한 계산이나 변환을 검색 없이 즉시 처리하고 싶을 때 유용합니다.",
    };

    return {
      useCase: `${content.shortTitle}는 ${categoryUseCases[tool.category] ?? "반복되는 실무 확인을 빠르게 처리해야 할 때 유용합니다."} 특히 ${example ? `${example.input}을 ${example.output}로 확인하는 상황처럼` : "작은 입력을 바로 검토해야 하는 상황에서"} 브라우저 안에서 즉시 결과를 확인하도록 설계했습니다.`,
      workflow: `기본 흐름은 간단합니다. 먼저 ${firstInput}을 입력하고, 필요한 경우 ${secondInput}을 조정한 뒤 ${firstOutput}을 확인합니다. 결과를 그대로 믿기보다 입력 단위, 기준일, 파일 형식, 반올림 기준처럼 결과에 영향을 주는 조건을 한 번 더 확인하면 실무에서 재작업을 줄일 수 있습니다.`,
      limitation: `${content.shortTitle}는 빠른 판단을 돕는 보조 도구입니다. 결과가 계약, 신고, 결제, 보안, 고객 데이터 처리처럼 중요한 결정에 연결된다면 공식 문서, 원본 시스템, 내부 정책, 전문가 검토를 함께 확인해야 합니다.`,
    };
  }

  const categoryUseCases: Record<string, string> = {
    "korea-living": "Korea-specific living tasks such as units, area, sizing, and everyday local standards need quick comparison.",
    "time-money": "dates, time, money, interest, tax, and planning numbers need a quick first-pass estimate.",
    "file-media": "files, images, and PDFs need format, size, privacy, or sharing checks before they are uploaded elsewhere.",
    "network-diagnostics": "IP, HTTP, DNS, and webhook behavior needs to be inspected or reproduced quickly.",
    "developer-automation": "development, documentation, and automation workflows need repeated conversion, validation, and debugging steps in one place.",
    "business-automation": "operations, marketing, reporting, or collaboration workflows need small inputs turned into structured outputs.",
    "micro-utility": "small but frequent calculations or transformations need to be handled without opening a heavy application.",
  };

  return {
    useCase: `${content.shortTitle} is useful when ${categoryUseCases[tool.category] ?? "a recurring practical check needs a fast result."} It is designed for situations like ${example ? `turning ${example.input} into ${example.output}` : "checking a small input immediately"} without leaving the browser workflow.`,
    workflow: `The basic workflow is simple: enter ${firstInput}, adjust ${secondInput} when needed, and review ${firstOutput}. Before relying on the result, check the units, date, file type, rounding basis, or other assumptions that may change the outcome.`,
    limitation: `${content.shortTitle} is a supporting utility for quick judgment. If the result affects contracts, filings, payments, security, customer data, or other important decisions, verify it against official sources, source systems, internal policy, or qualified review.`,
  };
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
  const editorialContext = getToolEditorialContext(tool, locale);

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

            <section className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-lg font-black tracking-tight text-foreground mb-4">
                {locale === "ko" ? `${content.shortTitle} 사용 전 알아두면 좋은 점` : `Before using ${content.shortTitle}`}
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                <article className="rounded-xl border border-border/80 bg-background/80 p-4">
                  <h3 className="text-sm font-black text-foreground">
                    {locale === "ko" ? "언제 쓰면 좋은가" : "When it helps"}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{editorialContext.useCase}</p>
                </article>
                <article className="rounded-xl border border-border/80 bg-background/80 p-4">
                  <h3 className="text-sm font-black text-foreground">
                    {locale === "ko" ? "권장 사용 흐름" : "Suggested workflow"}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{editorialContext.workflow}</p>
                </article>
                <article className="rounded-xl border border-border/80 bg-background/80 p-4">
                  <h3 className="text-sm font-black text-foreground">
                    {locale === "ko" ? "결과 확인 기준" : "How to verify results"}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{editorialContext.limitation}</p>
                </article>
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
