import type { Metadata } from "next";
import { ToolCard } from "@/components/tool-card";
import { getAllTools, getToolsByTier } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Practical Tools",
  description:
    "Practical calculators, converters, validators, and automation utilities. Korea-friendly everyday tools and developer utilities from Oh My ZHS.",
  alternates: {
    canonical: "/tools",
  },
};

export default function ToolsPage() {
  const tierOneTools = getToolsByTier(1);
  const allTools = getAllTools();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <section className="max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          Practical tools studio
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          Useful calculators and utilities for everyday work.
        </h1>
        <p className="mt-3 text-lg text-muted">
          Start with tools that solve small real problems: Korean area units, time zones,
          currency estimates, config validation, cron schedules, and automation ROI math.
        </p>
        <div className="mt-4 flex gap-4 text-sm text-muted">
          <span>{tierOneTools.length} Tier 1 tools for immediate everyday utility</span>
          <span>{allTools.length} total tools in the launch registry</span>
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium">Tier 1</span>
          <h2 className="text-xl font-semibold">Korea-friendly practical tools</h2>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tierOneTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {([2, 3] as const).map((tier) => (
        <section key={tier} className="mt-12">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium">Tier {tier}</span>
            <h2 className="text-xl font-semibold">
              {tier === 2 ? "Automation and AI utilities" : "Micro utilities"}
            </h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getToolsByTier(tier).map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
