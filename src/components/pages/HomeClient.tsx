"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers";
import { getToolContent, type Tool } from "@/lib/tools";
import type { Post } from "@/lib/posts";
import { getPostContent } from "@/lib/post-types";
import { BrandLockup } from "@/components/zhs/brand-lockup";

type HomeClientProps = {
  latestPosts: Post[];
  featuredTools: Tool[];
  totalToolCount: number;
};

export function HomeClient({ latestPosts, featuredTools, totalToolCount }: HomeClientProps) {
  const { t, locale } = useLocale();
  const home = t.home;

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* 1. Impact Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-background pt-20 pb-24 md:pt-32 md:pb-40">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                </span>
                {home.eyebrow}
              </div>
              <h1 className="mt-8 text-4xl font-bold tracking-tight text-foreground md:text-7xl lg:leading-[1.1]">
                {home.headline}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted md:text-xl">
                {home.lead}
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/tools"
                  className="rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  {home.ctaPrimary}
                </Link>
                <Link
                  href="/typing"
                  className="rounded-lg border border-border bg-background px-8 py-3.5 text-sm font-semibold text-foreground transition-all hover:border-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-border focus:ring-offset-2"
                >
                  {t.nav.typing}
                </Link>
              </div>
            </div>
            
            {/* Right: Visual Mockup / Feature Card */}
            <div className="hidden lg:block">
              <div className="relative rounded-2xl border border-line-soft bg-card p-2 shadow-2xl shadow-primary/5">
                <div className="rounded-xl border border-line-soft bg-background p-6">
                  <div className="flex items-center justify-between border-b border-line-soft pb-4">
                    <BrandLockup size="sm" />
                    <div className="flex gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-500/20" />
                      <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/20" />
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500/20" />
                    </div>
                  </div>
                  <div className="mt-6 space-y-4">
                    <div className="h-4 w-3/4 rounded bg-accent/50" />
                    <div className="h-32 w-full rounded-lg bg-accent/20" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-20 rounded-lg bg-primary/5" />
                      <div className="h-20 rounded-lg bg-accent/30" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Essential Tools Spotlight */}
      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              {home.sections?.featuredTools || "Essential Tools"}
            </h2>
            <p className="mt-2 text-muted">
              {home.catalog.subtitleTemplate.replace("{count}", String(totalToolCount))}
            </p>
          </div>
          <Link href="/tools" className="text-sm font-medium text-primary hover:underline">
            View all tools →
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredTools.map((tool) => {
            const content = getToolContent(tool, locale);
            return (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted group-hover:text-primary">
                      {tool.category}
                    </span>
                    <svg className="h-5 w-5 text-muted transition-transform group-hover:translate-x-1 group-hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-xl font-bold">{content.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                    {content.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Typing Practice Spotlight */}
      <section className="bg-card py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-3xl border border-primary/10 bg-background p-8 md:p-12">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  {home.sections?.typingSpotlight?.title || "Typing Practice"}
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-muted">
                  {home.sections?.typingSpotlight?.description || "Master the rhythm of Hangul and English."}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/typing"
                    className="rounded-lg bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all hover:bg-primary"
                  >
                    {home.sections?.typingSpotlight?.button || "Start Practice"}
                  </Link>
                  <Link
                    href="/typing/game/word-defense"
                    className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-accent"
                  >
                    Play Word Defense
                  </Link>
                </div>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-line-soft bg-card shadow-inner">
                {/* Visual representation of typing app */}
                <div className="absolute inset-0 flex items-center justify-center font-mono opacity-20">
                   <div className="text-center">
                     <p className="text-4xl">Zero Human Studio</p>
                     <div className="mt-4 h-1 w-full bg-primary" />
                   </div>
                </div>
                <div className="absolute bottom-6 right-8 flex gap-8">
                  <div className="text-center">
                    <p className="text-xs uppercase text-muted">WPM</p>
                    <p className="text-2xl font-bold text-primary">540</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs uppercase text-muted">Accuracy</p>
                    <p className="text-2xl font-bold text-primary">99%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Latest Insights (Posts) */}
      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              {home.sections?.latestPosts || "Latest Insights"}
            </h2>
            <p className="mt-2 text-muted">Professional build logs, guides, and trends.</p>
          </div>
          <Link href="/posts" className="text-sm font-medium text-primary hover:underline">
            Read all posts →
          </Link>
        </div>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {latestPosts.map((post) => (
            <article key={post.slug} className="group relative flex flex-col">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-accent/30 transition-all group-hover:shadow-md">
                {/* Fallback pattern if no thumbnail */}
                <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                   <span className="text-xs font-mono font-medium text-muted uppercase tracking-widest">{post.category}</span>
                </div>
              </div>
              <div className="mt-6 flex-1">
                <div className="flex items-center gap-3 text-xs text-muted">
                  <time dateTime={post.publishedAt}>{post.publishedAt}</time>
                  <span>•</span>
                  <span>{post.readingMinutes} min read</span>
                </div>
                <h3 className="mt-3 text-xl font-bold group-hover:text-primary">
                  <Link href={`/posts/${post.slug}`}>
                    <span className="absolute inset-0" />
                    {getPostContent(post, locale).title}
                  </Link>
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
                  {getPostContent(post, locale).description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5. Trust & Promise */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="rounded-3xl bg-accent/30 px-8 py-12 md:px-16">
          <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">
            {home.trust.title}
          </h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {home.trust.items.map((item) => (
              <div key={item.title} className="text-center md:text-left">
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Final CTA */}
      <section className="mx-auto max-w-6xl px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          {home.finalCta.title}
        </h2>
        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/tools"
            className="rounded-lg bg-primary px-10 py-4 text-sm font-semibold text-white transition-all hover:bg-primary-dark"
          >
            {home.finalCta.button}
          </Link>
        </div>
      </section>
    </div>
  );
}
