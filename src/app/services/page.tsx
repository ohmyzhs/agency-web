"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers";

const serviceIcons = ["🌐", "📱", "🤖", "⚡"] as const;
const serviceKeys = ["web", "mobile", "ai", "consulting"] as const;

export default function ServicesPage() {
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="text-4xl font-bold tracking-tight">
        {t.servicesPage.title}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        {t.servicesPage.subtitle}
      </p>

      <div className="mt-16 space-y-16">
        {serviceKeys.map((key, i) => {
          const service = t.servicesPage[key];
          return (
            <section
              key={key}
              className="rounded-2xl border border-border p-8 transition-all hover:border-primary/20 md:p-12"
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{serviceIcons[i]}</span>
                <div>
                  <h2 className="text-2xl font-bold">{service.title}</h2>
                  <p className="mt-2 text-muted">{service.description}</p>
                </div>
              </div>
              <ul className="mt-8 grid gap-3 md:grid-cols-2">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="text-primary">&#10003;</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <section className="mt-24 rounded-2xl bg-card p-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          {t.servicesPage.custom.title}
        </h2>
        <p className="mt-4 text-muted">{t.servicesPage.custom.description}</p>
        <Link
          href="/contact"
          className="mt-8 inline-block rounded-lg bg-primary px-8 py-3 font-medium text-white transition-colors hover:bg-primary-dark"
        >
          {t.servicesPage.custom.button}
        </Link>
      </section>
    </div>
  );
}
