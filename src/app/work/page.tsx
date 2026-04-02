"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers";

const projectKeys = ["ecommerce", "healthApp", "aiChat", "dashboard"] as const;

const techStacks: Record<string, string[]> = {
  ecommerce: ["Next.js", "Stripe", "PostgreSQL", "Tailwind CSS"],
  healthApp: ["React Native", "Firebase", "HealthKit", "Google Fit"],
  aiChat: ["Python", "LangChain", "Claude API", "React"],
  dashboard: ["Next.js", "D3.js", "WebSocket", "Redis"],
};

const categories: Record<string, string> = {
  ecommerce: "web",
  healthApp: "mobile",
  aiChat: "ai",
  dashboard: "web",
};

const categoryColors: Record<string, string> = {
  web: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  mobile: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  ai: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

export default function WorkPage() {
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight">
          {t.workPage.title}
        </h1>
        <p className="mt-4 text-lg text-muted">{t.workPage.subtitle}</p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-2">
        {projectKeys.map((key) => {
          const project = t.workPage.projects[key];
          const cat = categories[key];
          return (
            <article
              key={key}
              className="group flex flex-col rounded-2xl border border-border bg-background p-8 transition-all hover:border-primary/30 hover:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${categoryColors[cat]}`}
                >
                  {t.workPage.categories[cat as keyof typeof t.workPage.categories]}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-semibold group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <p className="mt-2 flex-1 text-muted">{project.description}</p>

              <div className="mt-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
                  {t.workPage.techStack}
                </h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {techStacks[key].map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-border px-2 py-1 text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-border pt-4">
                <ul className="space-y-1">
                  {project.results.map((result: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted">
                      <span className="mt-0.5 text-primary">+</span>
                      {result}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>

      {/* CTA */}
      <section className="mt-24 rounded-2xl border border-border bg-card p-12 text-center">
        <h2 className="text-2xl font-bold tracking-tight">
          {t.workPage.cta.title}
        </h2>
        <p className="mt-2 text-muted">{t.workPage.cta.description}</p>
        <Link
          href="/contact"
          className="mt-6 inline-block rounded-lg bg-primary px-8 py-3 font-medium text-white transition-colors hover:bg-primary-dark"
        >
          {t.workPage.cta.button}
        </Link>
      </section>
    </div>
  );
}
