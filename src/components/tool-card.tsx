import Link from "next/link";
import type { Tool } from "@/lib/tools";

const categoryLabels: Record<string, string> = {
  "korea-living": "Korea Living",
  "time-money": "Time & Money",
  "developer-automation": "Developer",
  "business-automation": "Business",
  "micro-utility": "Utility",
};

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="hover-lift group rounded-xl border border-border bg-background p-6 transition-all hover:border-primary/30 hover:shadow-lg"
    >
      <div className="flex items-center gap-2 text-xs text-muted">
        <span className="rounded-full bg-accent px-2 py-0.5">Tier {tool.tier}</span>
        <span>{categoryLabels[tool.category] ?? tool.category}</span>
      </div>
      <h3 className="mt-3 text-lg font-semibold group-hover:text-primary transition-colors">
        {tool.title}
      </h3>
      <p className="mt-1 text-sm text-muted line-clamp-2">{tool.description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {tool.examples.slice(0, 2).map((example) => (
          <span
            key={example.label}
            className="rounded-md bg-card px-2 py-0.5 text-xs text-muted"
          >
            {example.label}
          </span>
        ))}
      </div>
      <span className="mt-3 inline-block text-sm font-medium text-primary">
        Open tool &rarr;
      </span>
    </Link>
  );
}
