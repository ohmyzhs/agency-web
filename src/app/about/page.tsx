"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers";

const valueKeys = ["speed", "quality", "communication", "innovation"] as const;
const valueIcons = ["⚡", "💎", "🤝", "🔬"] as const;

const stats = [
  { value: "50+", key: "projects" as const },
  { value: "99%", key: "satisfaction" as const },
  { value: "< 4w", key: "avgDelivery" as const },
  { value: "24h", key: "responseTime" as const },
];

export default function AboutPage() {
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      {/* Hero */}
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight">
          {t.aboutPage.title}
        </h1>
        <p className="mt-6 text-lg text-muted leading-relaxed">
          {t.aboutPage.description}
        </p>
      </div>

      {/* Stats */}
      <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">
        {stats.map(({ value, key }) => (
          <div
            key={key}
            className="rounded-xl border border-border bg-card p-6 text-center"
          >
            <div className="text-3xl font-bold text-primary">{value}</div>
            <div className="mt-1 text-sm text-muted">
              {t.aboutPage.stats[key]}
            </div>
          </div>
        ))}
      </div>

      {/* Story */}
      <section className="mt-24">
        <h2 className="text-2xl font-bold tracking-tight">
          {t.aboutPage.story.title}
        </h2>
        <div className="mt-6 space-y-4 text-muted leading-relaxed">
          <p>{t.aboutPage.story.p1}</p>
          <p>{t.aboutPage.story.p2}</p>
        </div>
      </section>

      {/* Values */}
      <section className="mt-24">
        <h2 className="text-2xl font-bold tracking-tight">
          {t.aboutPage.values.title}
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {valueKeys.map((key, i) => (
            <div
              key={key}
              className="rounded-xl border border-border bg-background p-6 transition-all hover:border-primary/30"
            >
              <span className="text-2xl">{valueIcons[i]}</span>
              <h3 className="mt-3 text-lg font-semibold">
                {t.aboutPage.values[key].title}
              </h3>
              <p className="mt-2 text-sm text-muted">
                {t.aboutPage.values[key].description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-24 rounded-2xl border border-border bg-card p-12 text-center">
        <h2 className="text-2xl font-bold tracking-tight">
          {t.aboutPage.cta.title}
        </h2>
        <p className="mt-2 text-muted">{t.aboutPage.cta.description}</p>
        <Link
          href="/contact"
          className="mt-6 inline-block rounded-lg bg-primary px-8 py-3 font-medium text-white transition-colors hover:bg-primary-dark"
        >
          {t.aboutPage.cta.button}
        </Link>
      </section>
    </div>
  );
}
