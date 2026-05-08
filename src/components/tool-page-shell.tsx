"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useLocale } from "@/components/providers";
import QuickToolSlots from "@/components/tools/shared/QuickToolSlots";
import { getRelatedTools, getToolContent, type Tool } from "@/lib/tools";

const localOnlyCategories = new Set(["developer-automation", "micro-utility", "file-media"]);

type ToolPageShellProps = {
  tool: Tool;
  children?: ReactNode;
};

export function ToolPageShell({ tool, children }: ToolPageShellProps) {
  const { locale, t } = useLocale();
  const content = getToolContent(tool, locale);
  const relatedTools = getRelatedTools(tool);
  const categoryLabel = t.categories[tool.category] ?? tool.category;
  const showPrivacyNote = localOnlyCategories.has(tool.category);

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
