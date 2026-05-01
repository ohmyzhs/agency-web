"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers";
import { getToolContent, type Tool } from "@/lib/tools";

export function ToolCard({ tool }: { tool: Tool }) {
  const { locale, t } = useLocale();
  const content = getToolContent(tool, locale);
  const tierLabel = t.tools.tierLabel.replace("{tier}", String(tool.tier));
  const categoryLabel = t.categories[tool.category] ?? tool.category;

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="hover-lift group rounded-xl border border-border bg-background p-6 transition-all hover:border-primary/30 hover:shadow-lg"
    >
      <div className="flex items-center gap-2 text-xs text-muted">
        <span className="rounded-full bg-accent px-2 py-0.5">{tierLabel}</span>
        <span>{categoryLabel}</span>
      </div>
      <h3 className="mt-3 text-lg font-semibold group-hover:text-primary transition-colors">
        {content.title}
      </h3>
      <p className="mt-1 text-sm text-muted line-clamp-2">{content.description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {content.examples.slice(0, 2).map((example) => (
          <span
            key={example.label}
            className="rounded-md bg-card px-2 py-0.5 text-xs text-muted"
          >
            {example.label}
          </span>
        ))}
      </div>
      <span className="mt-3 inline-block text-sm font-medium text-primary">
        {t.tools.openTool}
      </span>
    </Link>
  );
}
