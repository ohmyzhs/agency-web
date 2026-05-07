"use client";

import { useMemo, useState } from "react";

function appendUtm(baseUrl: string, params: Record<string, string>) {
  try {
    const url = new URL(baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      if (value.trim()) url.searchParams.set(key, value.trim());
    });
    return { ok: true as const, value: url.toString() };
  } catch {
    return { ok: false as const, value: "Enter a full URL including https://" };
  }
}

const inputClass = "mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none";

export default function UtmBuilder() {
  const [baseUrl, setBaseUrl] = useState("https://oh-my-zhs.com/tools");
  const [source, setSource] = useState("newsletter");
  const [medium, setMedium] = useState("email");
  const [campaign, setCampaign] = useState("launch-tools");
  const [term, setTerm] = useState("");
  const [content, setContent] = useState("hero-cta");

  const result = useMemo(
    () =>
      appendUtm(baseUrl, {
        utm_source: source.toLocaleLowerCase(),
        utm_medium: medium.toLocaleLowerCase(),
        utm_campaign: campaign.toLocaleLowerCase(),
        utm_term: term.toLocaleLowerCase(),
        utm_content: content.toLocaleLowerCase(),
      }),
    [baseUrl, campaign, content, medium, source, term],
  );

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium">Base URL</span>
        <input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} className={inputClass} />
      </label>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <label className="block">
          <span className="text-sm font-medium">utm_source</span>
          <input value={source} onChange={(e) => setSource(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">utm_medium</span>
          <input value={medium} onChange={(e) => setMedium(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">utm_campaign</span>
          <input value={campaign} onChange={(e) => setCampaign(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">utm_term <span className="text-muted">optional</span></span>
          <input value={term} onChange={(e) => setTerm(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">utm_content <span className="text-muted">optional</span></span>
          <input value={content} onChange={(e) => setContent(e.target.value)} className={inputClass} />
        </label>
      </div>

      <div className={`rounded-lg p-4 ${result.ok ? "bg-accent" : "bg-yellow-50 dark:bg-yellow-950/30"}`}>
        <p className="text-xs font-medium uppercase tracking-wider text-muted">campaign url</p>
        <code className="mt-1 block break-all text-sm">{result.value}</code>
      </div>

      <p className="text-xs text-muted">Lowercase naming keeps analytics cleaner. Avoid changing campaign names mid-flight unless you intentionally want separate reports.</p>
    </div>
  );
}
