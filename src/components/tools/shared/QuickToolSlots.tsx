"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers";
import {
  getAllTools,
  getToolContent,
  type Tool,
  type ToolCategory,
} from "@/lib/tools";

type QuickToolSlotsProps = {
  currentSlug: string;
  currentCategory: ToolCategory;
};

const CROSS_PICKS: string[] = [
  "icon-favicon-generator",
  "kst-timezone-converter",
  "krw-currency-calculator",
  "json-yaml-validator",
  "cron-explainer",
];

function dedupeBySlug(items: Tool[]): Tool[] {
  const seen = new Set<string>();
  const out: Tool[] = [];
  for (const item of items) {
    if (seen.has(item.slug)) continue;
    seen.add(item.slug);
    out.push(item);
  }
  return out;
}

export default function QuickToolSlots({
  currentSlug,
  currentCategory,
}: QuickToolSlotsProps) {
  const { locale, t } = useLocale();
  const allTools = getAllTools();

  const sameCategory = allTools.filter((tool) => tool.category === currentCategory);
  const crossPicks = CROSS_PICKS
    .map((slug) => allTools.find((tool) => tool.slug === slug))
    .filter((tool): tool is Tool => Boolean(tool))
    .filter((tool) => tool.category !== currentCategory);

  const ordered = dedupeBySlug([...sameCategory, ...crossPicks]).slice(0, 8);
  if (!ordered.some((tool) => tool.slug === currentSlug)) {
    const current = allTools.find((tool) => tool.slug === currentSlug);
    if (current) ordered.unshift(current);
  }

  if (ordered.length <= 1) return null;

  const navLabel = locale === "ko" ? "다른 도구 바로가기" : "Jump to another tool";

  return (
    <nav
      aria-label={navLabel}
      className="-mx-6 mt-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      <p className="zhs-eyebrow mb-2">{navLabel}</p>
      <ul className="flex w-max items-center gap-2">
        {ordered.map((tool) => {
          const isActive = tool.slug === currentSlug;
          const label = getToolContent(tool, locale).shortTitle;
          if (isActive) {
            return (
              <li key={tool.slug}>
                <span
                  aria-current="page"
                  className="inline-flex shrink-0 items-center rounded-full border border-foreground bg-foreground px-3 py-1.5 font-mono text-[12px] text-background"
                >
                  {label}
                </span>
              </li>
            );
          }
          return (
            <li key={tool.slug}>
              <Link
                href={`/tools/${tool.slug}`}
                className="inline-flex shrink-0 items-center rounded-full border border-border px-3 py-1.5 font-mono text-[12px] text-muted transition-colors hover:border-foreground hover:text-foreground"
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
      <span className="sr-only">{t.tools.relatedTools}</span>
    </nav>
  );
}
