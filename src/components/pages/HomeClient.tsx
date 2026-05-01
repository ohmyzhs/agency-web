"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers";
import { getAllTools, getToolContent, getToolsByTier, type Tool } from "@/lib/tools";
import type { Locale } from "@/lib/i18n";

const tierConfig = [
  { tier: 1 as const, key: "tier1" as const },
  { tier: 2 as const, key: "tier2" as const },
  { tier: 3 as const, key: "tier3" as const },
];

function ToolPreviewList({
  tools,
  moreLabel,
  locale,
}: {
  tools: Tool[];
  moreLabel: string;
  locale: Locale;
}) {
  return (
    <ul className="mt-4 space-y-1.5 font-mono text-[13px]">
      {tools.slice(0, 4).map((tool) => (
        <li key={tool.slug} className="text-muted">
          <Link href={`/tools/${tool.slug}`} className="hover:text-foreground">
            {getToolContent(tool, locale).shortTitle}
          </Link>
        </li>
      ))}
      {tools.length > 4 && (
        <li className="text-fg-3">{moreLabel.replace("{count}", String(tools.length - 4))}</li>
      )}
    </ul>
  );
}

export function HomeClient() {
  const { t, locale } = useLocale();
  const allTools = getAllTools();
  const home = t.home;
  const moreLabel = t.tools.moreSuffix;

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="max-w-3xl">
          <p className="zhs-eyebrow">{home.eyebrow}</p>
          <h1 className="animate-fade-in-up mt-4 font-mono text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            {home.headline}
          </h1>
          <p className="animate-fade-in-up animate-delay-100 mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            {home.lead}
          </p>
          <div className="animate-fade-in-up animate-delay-200 mt-8 flex flex-wrap gap-3">
            <Link
              href="/tools"
              className="rounded-sm border border-foreground bg-foreground px-5 py-2.5 font-mono text-sm text-background transition-colors hover:bg-primary hover:border-primary"
            >
              {home.ctaPrimary}
            </Link>
            <Link
              href="/about"
              className="rounded-sm border border-border px-5 py-2.5 font-mono text-sm text-foreground transition-colors hover:border-foreground"
            >
              {home.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-card py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-mono text-2xl font-bold tracking-tight md:text-3xl">
            {home.catalog.title}
          </h2>
          <p className="mt-2 max-w-2xl text-muted">
            {home.catalog.subtitleTemplate.replace("{count}", String(allTools.length))}
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {tierConfig.map(({ tier, key }) => {
              const tools = getToolsByTier(tier);
              return (
                <div
                  key={tier}
                  className="rounded-md border border-border bg-background p-6 transition-colors hover:border-foreground"
                >
                  <p className="zhs-eyebrow">tier {tier}</p>
                  <h3 className="mt-2 font-mono text-lg font-semibold">
                    {home.catalog[key]}
                  </h3>
                  <ToolPreviewList tools={tools} moreLabel={moreLabel} locale={locale} />
                  <Link
                    href="/tools"
                    className="mt-5 inline-block font-mono text-[12px] uppercase tracking-wider text-primary hover:text-primary-dark"
                  >
                    {t.tools.openTool}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-mono text-2xl font-bold tracking-tight md:text-3xl">
          {home.trust.title}
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {home.trust.items.map((item) => (
            <div
              key={item.title}
              className="rounded-md border border-border bg-background p-6"
            >
              <h3 className="font-mono text-base font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="font-mono text-2xl font-bold tracking-tight md:text-3xl">
            {home.finalCta.title}
          </h2>
          <Link
            href="/tools"
            className="mt-6 inline-block rounded-sm border border-foreground bg-foreground px-6 py-2.5 font-mono text-sm text-background transition-colors hover:bg-primary hover:border-primary"
          >
            {home.finalCta.button}
          </Link>
        </div>
      </section>
    </>
  );
}
