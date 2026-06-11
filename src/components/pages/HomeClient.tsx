"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers";
import { type Tool } from "@/lib/tools";
import { filterPostsForLocale, getPostContent, type Post } from "@/lib/post-types";
import { PostThumbnail } from "@/components/ui/post-thumbnail";
import { UnifiedSearch } from "@/components/home/UnifiedSearch";

type HomeClientProps = {
  allPosts: Post[];
  featuredTools: Tool[];
  allTools: Tool[];
  totalToolCount: number;
};

export function HomeClient({ allPosts, featuredTools, allTools, totalToolCount }: HomeClientProps) {
  const { t, locale } = useLocale();
  const home = t.home;
  const localizedAllPosts = filterPostsForLocale(allPosts, locale);
  const localizedLatestPosts = localizedAllPosts.slice(0, 6);

  return (
    <div className="flex flex-col gap-14 pb-24 overflow-hidden md:gap-18">
      {/* 1. Impact Hero Section — The Studio Vibe */}
      <section className="relative border-b border-border bg-background py-10 md:py-14">
        {/* Background Visual: Studio Grid */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <svg className="absolute top-0 right-0 h-full w-1/2 opacity-[0.03] text-primary" viewBox="0 0 100 100" fill="none">
            <defs>
              <pattern id="studio-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#studio-grid)" />
          </svg>
          <div className="absolute top-1/4 right-0 h-[420px] w-[420px] bg-primary/10 rounded-full blur-[120px] -mr-48 -mt-48 animate-pulse" />
        </div>

        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-md animate-fade-in-up">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              {home.eyebrow}
            </div>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground md:text-6xl lg:leading-[1.06] animate-fade-in-up animate-delay-100">
              <span className="text-gradient">{home.headline.split('.')[0]}.</span>
              <br />
              <span className="text-muted">{home.headline.split('.')[1] || ''}</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted md:text-xl animate-fade-in-up animate-delay-200">
              {home.lead}
            </p>
            <div className="mt-8 flex flex-wrap gap-3 animate-fade-in-up animate-delay-300">
              <Link
                href="/tools"
                className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/15 transition-all hover:bg-primary-dark hover:scale-[1.02] active:scale-95"
              >
                {home.ctaPrimary}
              </Link>
              <Link
                href="/typing"
                className="rounded-xl border border-border bg-card px-6 py-3 text-sm font-bold text-foreground transition-all hover:border-foreground hover:bg-accent"
              >
                {t.nav.typing}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 1.5. Unified Search */}
      <UnifiedSearch tools={allTools} posts={localizedAllPosts} />

      {/* 2. Bento Grid: Practical Intelligence */}
      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl text-gradient">
              {home.sections?.featuredTools || "Essential Tools"}
            </h2>
            <p className="mt-4 text-lg text-muted">
              {home.catalog.subtitleTemplate.replace("{count}", String(totalToolCount))}
            </p>
          </div>
          <Link href="/tools" className="group text-sm font-bold text-primary flex items-center gap-1">
            Browse all collection <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div className="mt-8 grid gap-4 grid-cols-1 md:grid-cols-4 md:grid-rows-2">
          {/* Main Feature: Pyeong Converter */}
          {featuredTools.find(t => t.slug === "pyeong-converter") && (
            <Link
              href="/tools/pyeong-converter"
              className="zhs-card zhs-card-hover md:col-span-2 md:row-span-2 p-6 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="zhs-eyebrow group-hover:text-primary">KOREA LIVING</span>
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </div>
                </div>
                <h3 className="mt-5 text-2xl font-extrabold tracking-tight">Pyeong Converter</h3>
                <p className="mt-4 text-muted leading-relaxed">
                  The standard for Korean real estate. Convert apartment sizes between Pyeong and Square Meters accurately.
                </p>
              </div>
              <div className="mt-7 p-4 rounded-2xl bg-accent/30 flex items-center justify-between font-mono text-sm">
                <span className="text-muted">Input: 84㎡</span>
                <span className="text-primary font-bold">Output: 25.4평</span>
              </div>
            </Link>
          )}

          {/* Secondary 1: ASCII */}
          {featuredTools.find(t => t.slug === "image-to-ascii-art") && (
            <Link
              href="/tools/image-to-ascii-art"
              className="zhs-card zhs-card-hover md:col-span-2 p-5 flex items-center gap-5 group"
            >
              <div className="h-20 w-20 shrink-0 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-mono text-xs">
                #@%*
              </div>
              <div>
                <span className="zhs-eyebrow group-hover:text-indigo-500 text-[10px]">FILE MEDIA</span>
                <h3 className="mt-1 text-xl font-bold">Image to ASCII</h3>
                <p className="mt-1 text-sm text-muted line-clamp-1">Transform pixels into characters.</p>
              </div>
            </Link>
          )}

          {/* Secondary 2: QR */}
          {featuredTools.find(t => t.slug === "qr-barcode-generator") && (
            <Link
              href="/tools/qr-barcode-generator"
              className="zhs-card zhs-card-hover p-6 flex flex-col justify-between group"
            >
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
              </div>
              <h3 className="mt-4 font-bold">QR Gen</h3>
            </Link>
          )}

          {/* Secondary 3: JSON */}
          {featuredTools.find(t => t.slug === "json-yaml-validator") && (
            <Link
              href="/tools/json-yaml-validator"
              className="zhs-card zhs-card-hover p-6 flex flex-col justify-between group"
            >
              <div className="h-10 w-10 rounded-xl bg-zinc-500/10 flex items-center justify-center text-muted">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              </div>
              <h3 className="mt-4 font-bold">Validator</h3>
            </Link>
          )}
        </div>
      </section>

      {/* 3. High-Fidelity Typing Spotlight */}
      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="relative rounded-[2rem] bg-zinc-950 p-1 shadow-xl shadow-zinc-950/25">
          <div className="rounded-[1.8rem] bg-[#0c0c0e] p-6 md:p-10 overflow-hidden relative">
            {/* Visual Flare */}
            <div className="absolute top-0 right-0 h-96 w-96 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32 opacity-50" />
            
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center relative z-10">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl leading-[1.1]">
                  {home.sections?.typingSpotlight?.title || "Master the Rhythm."}
                </h2>
                <p className="mt-5 text-lg text-zinc-300 leading-relaxed">
                  {home.sections?.typingSpotlight?.description || "A professional practice environment for Hangul and English, optimized for focus."}
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="/typing"
                    className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-black transition-all hover:bg-zinc-200"
                  >
                    {home.sections?.typingSpotlight?.button || "Get Started"}
                  </Link>
                  <Link
                    href="/typing/game/word-defense"
                    className="rounded-xl border border-zinc-700 bg-zinc-900/50 px-6 py-3 text-sm font-bold text-zinc-200 hover:text-white hover:border-zinc-500 transition-all"
                  >
                    Word Defense Game
                  </Link>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative aspect-video rounded-3xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-xl p-6 flex flex-col shadow-2xl">
                   <div className="flex items-center gap-2 mb-8">
                     <div className="h-3 w-3 rounded-full bg-red-500/40" />
                     <div className="h-3 w-3 rounded-full bg-yellow-500/40" />
                     <div className="h-3 w-3 rounded-full bg-green-500/40" />
                   </div>
                   <div className="flex-1 flex flex-col justify-center items-center text-center font-mono space-y-4">
                     <p className="text-zinc-600 text-sm tracking-widest uppercase">Practice Mode</p>
                     <p className="text-zinc-300 text-2xl font-bold">한글 단문 연습</p>
                     <div className="h-1 w-32 bg-primary rounded-full" />
                   </div>
                   <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">Current Speed</p>
                        <p className="text-3xl font-black text-white italic">540 <span className="text-sm font-normal not-italic text-zinc-500">타</span></p>
                      </div>
                      <div className="h-12 w-12 rounded-full border-2 border-primary/30 flex items-center justify-center text-primary font-bold">
                        99%
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Latest Knowledge Hub — Bento Layout */}
      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl text-gradient">
              {home.sections?.latestPosts || "Latest Insights"}
            </h2>
            <p className="mt-4 text-lg text-muted">Technical build logs and practical guides from the studio.</p>
          </div>
          <Link href="/posts" className="group text-sm font-bold text-primary flex items-center gap-1">
            Explore Archive <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {localizedLatestPosts.map((post) => {
            const content = getPostContent(post, locale);
            return (
              <article key={post.slug} className="group relative flex flex-col h-full">
                <Link href={`/posts/${post.slug}`} className="absolute inset-0 z-20" />
                <PostThumbnail 
                  title={content.title} 
                  category={post.category} 
                  className="aspect-[16/10] rounded-3xl z-10 transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="mt-4 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-xs font-bold text-muted uppercase tracking-widest">
                    <span>{post.category}</span>
                    <span className="h-1 w-1 rounded-full bg-border" />
                    <span>{post.readingMinutes} min</span>
                  </div>
                  <h3 className="mt-3 text-xl font-extrabold group-hover:text-primary transition-colors leading-tight">
                    {content.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
                    {content.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 5. Trust & Architecture */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="rounded-[2rem] border border-border bg-card p-6 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <h2 className="text-center text-3xl font-extrabold tracking-tight md:text-5xl">
            {home.trust.title}
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {home.trust.items.map((item) => (
              <div key={item.title} className="relative">
                <div className="absolute -top-10 left-0 text-6xl font-black text-primary/5 select-none italic tracking-tighter">
                  {item.title.split(' ')[0]}
                </div>
                <h3 className="text-xl font-extrabold relative z-10">{item.title}</h3>
                <p className="mt-4 text-muted leading-relaxed relative z-10">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. High-Impact Final CTA */}
      <section className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl leading-tight">
          {home.finalCta.title}
        </h2>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/tools"
            className="rounded-xl bg-foreground px-7 py-3 text-base font-black text-background transition-all hover:bg-primary hover:text-white hover:scale-[1.02] active:scale-95 shadow-lg"
          >
            {home.finalCta.button}
          </Link>
          <Link
            href="/contact"
            className="rounded-xl border border-border px-7 py-3 text-base font-bold text-foreground hover:border-foreground transition-all flex items-center justify-center gap-2"
          >
            Studio Contact
          </Link>
        </div>
      </section>
    </div>
  );
}
