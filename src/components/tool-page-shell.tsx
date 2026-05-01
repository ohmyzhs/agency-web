"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useLocale } from "@/components/providers";
import { getRelatedTools, getToolContent, type Tool } from "@/lib/tools";

const localOnlyCategories = new Set(["developer-automation", "micro-utility"]);

type ToolPageShellProps = {
  tool: Tool;
  children?: ReactNode;
};

export function ToolPageShell({ tool, children }: ToolPageShellProps) {
  const { locale, t } = useLocale();
  const content = getToolContent(tool, locale);
  const relatedTools = getRelatedTools(tool);
  const tierLabel = t.tools.tierLabel.replace("{tier}", String(tool.tier));
  const categoryLabel = t.categories[tool.category] ?? tool.category;
  const showPrivacyNote = localOnlyCategories.has(tool.category);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <Link
        href="/tools"
        className="inline-block text-sm text-muted hover:text-foreground transition-colors"
      >
        {t.tools.backToTools}
      </Link>

      <article className="mt-6">
        <header>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="rounded-full bg-accent px-2 py-0.5">{tierLabel}</span>
            <span>{categoryLabel}</span>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            {content.title}
          </h1>
          <p className="mt-2 text-lg text-muted">{content.description}</p>
        </header>

        <section
          className="mt-8 rounded-xl border border-border bg-card p-6"
          aria-label={`${content.title} ${t.tools.workspaceLabel}`}
        >
          {children ?? (
            <div className="text-center py-8">
              <p className="text-xs font-medium uppercase tracking-wider text-muted">
                {t.tools.placeholderTitle}
              </p>
              <h2 className="mt-2 text-xl font-semibold">
                {t.tools.placeholderHeading.replace("{tool}", content.shortTitle)}
              </h2>
              <p className="mt-1 text-sm text-muted">{t.tools.placeholderBody}</p>
            </div>
          )}
        </section>

        {showPrivacyNote && (
          <p className="mt-4 text-xs text-fg-3 leading-relaxed">{t.tools.privacyNote}</p>
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted">
              {t.tools.inputs}
            </p>
            <ul className="mt-3 space-y-2">
              {content.inputs.map((input) => (
                <li key={input.label} className="text-sm">
                  <strong>{input.label}:</strong>{" "}
                  <span className="text-muted">{input.description}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted">
              {t.tools.outputs}
            </p>
            <ul className="mt-3 space-y-2">
              {content.outputs.map((output) => (
                <li key={output.label} className="text-sm">
                  <strong>{output.label}:</strong>{" "}
                  <span className="text-muted">{output.description}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">{t.tools.examples}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {content.examples.map((example) => (
              <div
                key={example.label}
                className="rounded-lg border border-border p-4"
              >
                <p className="text-xs font-medium uppercase tracking-wider text-muted">
                  {example.label}
                </p>
                <p className="mt-2 text-sm">
                  <strong>{t.tools.inputs}:</strong> {example.input}
                </p>
                <p className="mt-1 text-sm">
                  <strong>{t.tools.outputs}:</strong> {example.output}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">{t.tools.howToRead}</h2>
          {content.explanation.map((paragraph) => (
            <p key={paragraph} className="mt-3 text-sm text-muted leading-relaxed">
              {paragraph}
            </p>
          ))}
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">{t.tools.faqs}</h2>
          <div className="mt-4 space-y-4">
            {content.faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="font-medium">{faq.question}</h3>
                <p className="mt-1 text-sm text-muted">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {relatedTools.length > 0 && (
          <aside className="mt-8 rounded-xl border border-border p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted">
              {t.tools.relatedTools}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {relatedTools.map((related) => {
                const relatedContent = getToolContent(related, locale);
                return (
                  <Link
                    key={related.slug}
                    href={`/tools/${related.slug}`}
                    className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium transition-colors hover:bg-primary hover:text-white"
                  >
                    {relatedContent.shortTitle}
                  </Link>
                );
              })}
            </div>
          </aside>
        )}
      </article>
    </div>
  );
}
