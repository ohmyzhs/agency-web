"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLocale } from "@/components/providers";
import { getPostContent, type Post } from "@/lib/post-types";
import { getToolContent, type Tool } from "@/lib/tools";

type UnifiedSearchProps = {
  tools: Tool[];
  posts: Post[];
};

type SearchResult = {
  type: "tool" | "post";
  title: string;
  description: string;
  href: string;
  meta: string;
  haystack: string;
};

const copy = {
  ko: {
    eyebrow: "UNIFIED SEARCH",
    title: "필요한 도구와 글을 한 번에 찾기",
    lead: "도구 페이지와 글 아카이브를 따로 열지 않아도, 홈페이지에서 바로 검색할 수 있습니다.",
    placeholder: "예: 평수, PDF, JSON, 타자연습, 회고",
    badgeTool: "도구",
    badgePost: "글",
    empty: "검색 결과가 없습니다. 다른 키워드로 시도해 보세요.",
    suggested: "추천 탐색",
    allTools: "전체 도구 보기",
    allPosts: "글 아카이브",
  },
  en: {
    eyebrow: "UNIFIED SEARCH",
    title: "Find tools and posts from one place",
    lead: "Search the public tool library and writing archive directly from the homepage.",
    placeholder: "Try: PDF, JSON, pyeong, typing, retrospective",
    badgeTool: "Tool",
    badgePost: "Post",
    empty: "No results found. Try a different keyword.",
    suggested: "Suggested",
    allTools: "Browse all tools",
    allPosts: "Explore archive",
  },
};

export function UnifiedSearch({ tools, posts }: UnifiedSearchProps) {
  const { locale } = useLocale();
  const c = copy[locale];
  const [query, setQuery] = useState("");

  const searchItems = useMemo<SearchResult[]>(() => {
    const items: SearchResult[] = [];

    for (const tool of tools) {
      const content = getToolContent(tool, locale);
      const koContent = tool.ko;
      const haystack = [
        content.title,
        content.shortTitle,
        content.description,
        tool.slug,
        tool.category,
        ...content.examples.map((e) => e.label),
        ...(koContent ? [koContent.title, koContent.shortTitle, koContent.description] : []),
        ...(koContent?.examples ?? []).map((e) => e.label),
      ]
        .join(" ")
        .toLowerCase();

      items.push({
        type: "tool",
        title: content.title,
        description: content.description,
        href: `/tools/${tool.slug}`,
        meta: tool.category.replace(/-/g, " "),
        haystack,
      });
    }

    for (const post of posts) {
      const content = getPostContent(post, locale);
      const haystack = [
        content.title,
        content.description,
        post.slug,
        post.category,
        post.kind,
        ...(post.tags ?? []),
        ...(post.relatedToolSlugs ?? []),
        post.en.title,
        post.en.description,
        ...(post.ko ? [post.ko.title, post.ko.description] : []),
      ]
        .join(" ")
        .toLowerCase();

      items.push({
        type: "post",
        title: content.title,
        description: content.description,
        href: `/posts/${post.slug}`,
        meta: post.category.replace(/-/g, " "),
        haystack,
      });
    }

    return items;
  }, [tools, posts, locale]);

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return searchItems.filter((item) => item.haystack.includes(q)).slice(0, 10);
  }, [query, searchItems]);

  const suggestedTools = tools.slice(0, 4);
  const suggestedPosts = posts.slice(0, 3);

  const showSuggested = query.trim() === "";
  const showEmpty = query.trim() !== "" && results.length === 0;

  return (
    <section className="mx-auto w-full max-w-6xl px-6">
      <div className="rounded-[2rem] border border-border bg-card p-6 md:p-10">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-6">
          <span className="zhs-eyebrow text-primary/60">{c.eyebrow}</span>
          <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">{c.title}</h2>
          <p className="text-sm text-muted leading-relaxed">{c.lead}</p>
        </div>

        {/* Search input */}
        <div className="relative mb-6">
          <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-muted">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={c.placeholder}
            className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm placeholder:text-muted/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Results */}
        {!showSuggested && !showEmpty && (
          <ul className="space-y-2">
            {results.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="flex items-start gap-4 rounded-xl border border-border bg-background p-4 transition-all hover:border-primary/40 hover:bg-accent/30 group"
                >
                  <span
                    className={`shrink-0 mt-0.5 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${
                      r.type === "tool"
                        ? "bg-primary/10 text-primary"
                        : "bg-zinc-500/10 text-zinc-500"
                    }`}
                  >
                    {r.type === "tool" ? c.badgeTool : c.badgePost}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold group-hover:text-primary transition-colors line-clamp-1">{r.title}</p>
                    <p className="mt-1 text-xs text-muted line-clamp-1">{r.description}</p>
                    <p className="mt-1 text-[10px] font-semibold text-muted/50 uppercase tracking-wider">{r.meta}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Suggested (empty query) */}
        {showSuggested && (
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-muted/50">{c.suggested}</p>
            <ul className="space-y-2">
              {suggestedTools.map((tool) => {
                const content = getToolContent(tool, locale);
                return (
                  <li key={tool.slug}>
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="flex items-start gap-4 rounded-xl border border-border bg-background p-3.5 transition-all hover:border-primary/40 hover:bg-accent/30 group"
                    >
                      <span className="shrink-0 mt-0.5 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary">
                        {c.badgeTool}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold group-hover:text-primary transition-colors line-clamp-1">{content.title}</p>
                        <p className="mt-1 text-xs text-muted line-clamp-1">{content.description}</p>
                      </div>
                    </Link>
                  </li>
                );
              })}
              {suggestedPosts.map((post) => {
                const content = getPostContent(post, locale);
                return (
                  <li key={post.slug}>
                    <Link
                      href={`/posts/${post.slug}`}
                      className="flex items-start gap-4 rounded-xl border border-border bg-background p-3.5 transition-all hover:border-primary/40 hover:bg-accent/30 group"
                    >
                      <span className="shrink-0 mt-0.5 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest bg-zinc-500/10 text-zinc-500">
                        {c.badgePost}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold group-hover:text-primary transition-colors line-clamp-1">{content.title}</p>
                        <p className="mt-1 text-xs text-muted line-clamp-1">{content.description}</p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Empty state */}
        {showEmpty && (
          <p className="text-center text-sm text-muted py-6">{c.empty}</p>
        )}

        {/* Footer links */}
        <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-4">
          <Link
            href="/tools"
            className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
          >
            {c.allTools} <span>→</span>
          </Link>
          <Link
            href="/posts"
            className="text-xs font-bold text-muted flex items-center gap-1 hover:text-primary hover:underline"
          >
            {c.allPosts} <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
