import Link from "next/link";
import type { ReactNode } from "react";
import { getRelatedTools, type Tool } from "@/lib/tools";

const categoryLabels: Record<string, string> = {
  "korea-living": "Korea Living",
  "time-money": "Time & Money",
  "developer-automation": "Developer",
  "business-automation": "Business",
  "micro-utility": "Utility",
};

type ToolPageShellProps = {
  tool: Tool;
  children?: ReactNode;
};

export function ToolPageShell({ tool, children }: ToolPageShellProps) {
  const relatedTools = getRelatedTools(tool);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <Link
        href="/tools"
        className="inline-block text-sm text-muted hover:text-foreground transition-colors"
      >
        &larr; All tools
      </Link>

      <article className="mt-6">
        <header>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="rounded-full bg-accent px-2 py-0.5">Tier {tool.tier}</span>
            <span>{categoryLabels[tool.category] ?? tool.category}</span>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            {tool.title}
          </h1>
          <p className="mt-2 text-lg text-muted">{tool.description}</p>
        </header>

        <section
          className="mt-8 rounded-xl border border-border bg-card p-6"
          aria-label={`${tool.title} workspace`}
        >
          {children ?? (
            <div className="text-center py-8">
              <p className="text-xs font-medium uppercase tracking-wider text-muted">
                Tool workspace
              </p>
              <h2 className="mt-2 text-xl font-semibold">
                {tool.shortTitle} interactive tool
              </h2>
              <p className="mt-1 text-sm text-muted">
                The calculation model and page context are in place.
              </p>
            </div>
          )}
        </section>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted">Inputs</p>
            <ul className="mt-3 space-y-2">
              {tool.inputs.map((input) => (
                <li key={input.label} className="text-sm">
                  <strong>{input.label}:</strong>{" "}
                  <span className="text-muted">{input.description}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted">Outputs</p>
            <ul className="mt-3 space-y-2">
              {tool.outputs.map((output) => (
                <li key={output.label} className="text-sm">
                  <strong>{output.label}:</strong>{" "}
                  <span className="text-muted">{output.description}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Examples</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {tool.examples.map((example) => (
              <div
                key={example.label}
                className="rounded-lg border border-border p-4"
              >
                <p className="text-xs font-medium uppercase tracking-wider text-muted">
                  {example.label}
                </p>
                <p className="mt-2 text-sm">
                  <strong>Input:</strong> {example.input}
                </p>
                <p className="mt-1 text-sm">
                  <strong>Output:</strong> {example.output}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">How to use this result</h2>
          {tool.explanation.map((paragraph) => (
            <p key={paragraph} className="mt-3 text-sm text-muted leading-relaxed">
              {paragraph}
            </p>
          ))}
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Common questions</h2>
          <div className="mt-4 space-y-4">
            {tool.faqs.map((faq) => (
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
              Related tools
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {relatedTools.map((related) => (
                <Link
                  key={related.slug}
                  href={`/tools/${related.slug}`}
                  className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium transition-colors hover:bg-primary hover:text-white"
                >
                  {related.shortTitle}
                </Link>
              ))}
            </div>
          </aside>
        )}
      </article>
    </div>
  );
}
