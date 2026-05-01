"use client";

import { useLocale } from "@/components/providers";

export default function DisclaimerPage() {
  const { t } = useLocale();
  const page = t.disclaimerPage;

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <p className="zhs-eyebrow">disclaimer</p>
      <h1 className="mt-3 font-mono text-3xl font-bold tracking-tight md:text-4xl">
        {page.title}
      </h1>
      <p className="mt-3 text-sm text-muted">{page.updated}</p>

      <div className="mt-12 space-y-10">
        {page.sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-mono text-lg font-semibold">{section.title}</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
