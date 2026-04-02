"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers";

const serviceIcons = ["🌐", "📱", "🤖", "⚡"] as const;
const serviceKeys = ["web", "mobile", "ai", "consulting"] as const;

export default function Home() {
  const { t } = useLocale();

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="max-w-3xl">
          <h1 className="animate-fade-in-up text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            {t.hero.title1}
            <br />
            <span className="text-gradient">{t.hero.title2}</span>
          </h1>
          <p className="animate-fade-in-up animate-delay-100 mt-6 text-lg text-muted md:text-xl">
            {t.hero.description}
          </p>
          <div className="animate-fade-in-up animate-delay-200 mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="rounded-lg bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary-dark"
            >
              {t.hero.cta}
            </Link>
            <Link
              href="/services"
              className="rounded-lg border border-border px-6 py-3 font-medium transition-colors hover:bg-card"
            >
              {t.hero.services}
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="border-t border-border bg-card py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold tracking-tight">
            {t.servicesSection.title}
          </h2>
          <p className="mt-2 text-muted">{t.servicesSection.subtitle}</p>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {serviceKeys.map((key, i) => (
              <div
                key={key}
                className="hover-lift group rounded-xl border border-border bg-background p-8 transition-all hover:border-primary/30 hover:shadow-lg"
              >
                <span className="text-3xl">{serviceIcons[i]}</span>
                <h3 className="mt-4 text-xl font-semibold group-hover:text-primary transition-colors">
                  {t.servicesSection[key].title}
                </h3>
                <p className="mt-2 text-muted">
                  {t.servicesSection[key].description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h2 className="text-3xl font-bold tracking-tight">{t.cta.title}</h2>
        <p className="mt-4 text-lg text-muted">{t.cta.description}</p>
        <Link
          href="/contact"
          className="mt-8 inline-block rounded-lg bg-primary px-8 py-3 font-medium text-white transition-colors hover:bg-primary-dark"
        >
          {t.cta.button}
        </Link>
      </section>
    </>
  );
}
