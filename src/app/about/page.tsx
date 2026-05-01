"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers";

export default function AboutPage() {
  const { t } = useLocale();
  const about = t.aboutPage;

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <p className="zhs-eyebrow">about</p>
      <h1 className="mt-3 font-mono text-3xl font-bold tracking-tight md:text-4xl">
        {about.title}
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-muted">{about.lead}</p>

      <div className="mt-12 space-y-12">
        {about.sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-mono text-xl font-semibold tracking-tight">{section.title}</h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-16 rounded-md border border-border bg-card p-8">
        <h2 className="font-mono text-lg font-semibold tracking-tight">
          {about.contactBlurb.title}
        </h2>
        <p className="mt-2 text-sm text-muted">{about.contactBlurb.body}</p>
        <Link
          href="/contact"
          className="mt-5 inline-block rounded-sm border border-foreground bg-foreground px-5 py-2.5 font-mono text-sm text-background transition-colors hover:bg-primary hover:border-primary"
        >
          {about.contactBlurb.button}
        </Link>
      </section>
    </div>
  );
}
