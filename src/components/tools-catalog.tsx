"use client";

import { ToolCard } from "@/components/tool-card";
import { useLocale } from "@/components/providers";
import { getAllTools, getToolsByTier } from "@/lib/tools";

export function ToolsCatalog() {
  const { t } = useLocale();
  const allTools = getAllTools();
  const tier1 = getToolsByTier(1);
  const tier2 = getToolsByTier(2);
  const tier3 = getToolsByTier(3);
  const countSummary = t.tools.countSummary.replace("{count}", String(allTools.length));

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <section className="max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          {t.tools.indexEyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          {t.tools.indexTitle}
        </h1>
        <p className="mt-3 text-lg text-muted">{t.tools.indexLead}</p>
        <p className="mt-4 text-sm text-muted">{countSummary}</p>
      </section>

      <Tier tier={1} tools={tier1} heading={t.tools.tier1Heading} />
      <Tier tier={2} tools={tier2} heading={t.tools.tier2Heading} />
      <Tier tier={3} tools={tier3} heading={t.tools.tier3Heading} />
    </div>
  );
}

type TierProps = {
  tier: 1 | 2 | 3;
  tools: ReturnType<typeof getAllTools>;
  heading: string;
};

function Tier({ tier, tools, heading }: TierProps) {
  const { t } = useLocale();
  const tierLabel = t.tools.tierLabel.replace("{tier}", String(tier));
  return (
    <section className="mt-12">
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium">
          {tierLabel}
        </span>
        <h2 className="text-xl font-semibold">{heading}</h2>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  );
}
