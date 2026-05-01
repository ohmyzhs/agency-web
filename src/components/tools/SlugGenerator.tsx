"use client";

import { useMemo, useState } from "react";

function slugify(value: string, separator: string) {
  const normalized = value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLocaleLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^\p{L}\p{N}]+/gu, separator);

  if (!separator) return normalized;

  const escaped = separator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return normalized.replace(new RegExp(`${escaped}+`, "g"), separator).replace(new RegExp(`^${escaped}|${escaped}$`, "g"), "");
}

const inputClass = "mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none";

export default function SlugGenerator() {
  const [title, setTitle] = useState("KST Timezone Guide for Remote Teams");
  const [separator, setSeparator] = useState("-");

  const variants = useMemo(() => {
    const primary = slugify(title, separator);
    return [
      { label: "Primary slug", value: primary },
      { label: "Path", value: primary ? `/tools/${primary}` : "—" },
      { label: "Underscore", value: slugify(title, "_") },
      { label: "Compact", value: slugify(title, "") },
    ];
  }, [separator, title]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Title or phrase</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Separator</span>
          <select value={separator} onChange={(e) => setSeparator(e.target.value)} className={inputClass}>
            <option value="-">hyphen -</option>
            <option value="_">underscore _</option>
          </select>
        </label>
      </div>

      <div className="space-y-1.5">
        {variants.map((variant) => (
          <div key={variant.label} className="flex flex-col gap-0.5 rounded-lg border border-border px-4 py-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-muted">{variant.label}</span>
            <code className="text-sm break-all">{variant.value || "—"}</code>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted">After publishing a page, keep the slug stable or add redirects before changing it.</p>
    </div>
  );
}
