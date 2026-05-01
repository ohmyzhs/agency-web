"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers";

export function GuidesPage() {
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
        {"// guides"}
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight">{t.guidesPage.title}</h1>
      <p className="mt-4 max-w-3xl text-lg text-muted">{t.guidesPage.lead}</p>

      <div className="mt-14 space-y-8">
        {t.guidesPage.sections.map((section) => (
          <section key={section.title} className="border-t border-border pt-8">
            <h2 className="text-2xl font-bold">{section.title}</h2>
            <div className="mt-4 space-y-3 text-muted">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {section.links.map((link) => (
                <Link
                  key={link.slug}
                  href={link.slug === "_disclaimer" ? "/disclaimer" : `/tools/${link.slug}`}
                  className="rounded border border-border px-3 py-2 font-mono text-sm text-foreground transition-colors hover:bg-card"
                >
                  {link.label} →
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
