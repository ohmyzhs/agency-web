"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/providers";
import SegmentedTabs from "@/components/tools/shared/SegmentedTabs";
import { PostCard } from "@/components/posts/post-card";
import { comparePostsNewestFirst, comparePostsOldestFirst, filterPostsForLocale, getPostContent, type Post } from "@/lib/post-types";
import {
  getDisplayPostType,
  getPostCategoryLabel,
  getPostTypeLabel,
  getPublicPostCategoryLabel,
  getRelatedToolLabels,
  normalizePostCategory,
  publicCategoryOrder,
  type DisplayPostType,
} from "@/components/posts/post-labels";

const allTypes = ["guide", "news-explainer", "comparison", "workflow", "trend", "retrospective", "experiment"] as const;
type TypeFilter = "all" | DisplayPostType;
type SortMode = "newest" | "oldest" | "reading";
type CategoryFilter = "all" | string;
type ToolFilter = "all" | string;

export type PostsIndexInitialFilters = {
  type?: string;
  category?: string;
  tool?: string;
  q?: string;
  sort?: string;
};

function coerceTypeFilter(value?: string): TypeFilter {
  if (value && allTypes.includes(value as Exclude<DisplayPostType, "update">)) return value as DisplayPostType;
  return "all";
}

function coerceSortMode(value?: string): SortMode {
  if (value === "oldest" || value === "reading") return value;
  return "newest";
}

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

export function PostsIndex({ posts, initialFilters = {} }: { posts: Post[]; initialFilters?: PostsIndexInitialFilters }) {
  const { locale } = useLocale();
  const localizedPosts = useMemo(() => filterPostsForLocale(posts, locale), [posts, locale]);
  const availableCategories = useMemo(() => {
    const present = new Set(localizedPosts.map((post) => normalizePostCategory(post.category, post.kind)));
    return publicCategoryOrder.filter((category) => present.has(category));
  }, [localizedPosts]);

  const availableTools = useMemo(
    () => uniqueSorted(localizedPosts.flatMap((post) => post.relatedToolSlugs ?? [])),
    [localizedPosts],
  );

  const [typeFilter, setTypeFilter] = useState<TypeFilter>(() => coerceTypeFilter(initialFilters.type));
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>(() => (
    initialFilters.category && localizedPosts.some((post) => normalizePostCategory(post.category, post.kind) === initialFilters.category)
      ? initialFilters.category
      : "all"
  ));
  const [toolFilter, setToolFilter] = useState<ToolFilter>(() => (
    initialFilters.tool && availableTools.includes(initialFilters.tool)
      ? initialFilters.tool
      : "all"
  ));
  const [sortMode, setSortMode] = useState<SortMode>(() => coerceSortMode(initialFilters.sort));
  const [query, setQuery] = useState(() => initialFilters.q ?? "");

  const searchablePosts = useMemo(() => localizedPosts.map((post) => {
    const content = getPostContent(post, locale);
    const publicCategory = normalizePostCategory(post.category, post.kind);
    const relatedTools = getRelatedToolLabels(post, locale, 10);
    const haystack = [
      content.title,
      content.description,
      post.kind,
      post.category,
      publicCategory,
      getPostCategoryLabel(post.category, locale),
      getPublicPostCategoryLabel(post.category, locale, post.kind),
      getPostTypeLabel(post, locale),
      ...post.tags,
      ...(post.relatedToolSlugs ?? []),
      ...relatedTools.map((tool) => tool.label),
    ].join(" ").toLowerCase();
    return { post, content, publicCategory, haystack };
  }), [localizedPosts, locale]);

  const visiblePosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return searchablePosts
      .filter(({ post, publicCategory, haystack }) => {
        if (getDisplayPostType(post) === "update") return false;
        if (typeFilter !== "all" && getDisplayPostType(post) !== typeFilter) return false;
        if (categoryFilter !== "all" && publicCategory !== categoryFilter) return false;
        if (toolFilter !== "all" && !(post.relatedToolSlugs ?? []).includes(toolFilter)) return false;
        if (normalizedQuery && !haystack.includes(normalizedQuery)) return false;
        return true;
      })
      .map(({ post }) => post)
      .sort((a, b) => {
        if (sortMode === "oldest") return comparePostsOldestFirst(a, b);
        if (sortMode === "reading") return b.readingMinutes - a.readingMinutes;
        return comparePostsNewestFirst(a, b);
      });
  }, [searchablePosts, typeFilter, categoryFilter, toolFilter, query, sortMode]);

  const eyebrow = locale === "ko" ? "// AI 운영 블로그" : "// AI-operated blog";
  const title = locale === "ko" ? "AI와 실무를 연결하는 글" : "Posts for AI and practical work";
  const lead =
    locale === "ko"
      ? "최신 AI 뉴스 해설, 실용 가이드, 비교·추천, 업무 자동화와 디지털 트렌드를 한 곳에서 정리합니다. 모든 글은 출처와 맥락을 바탕으로 AI 편집 시스템의 관점에서 작성됩니다."
      : "AI explainers, practical guides, comparisons, productivity workflows, and digital trend notes from an AI-operated editorial system.";

  const allLabel = locale === "ko" ? "전체" : "All";
  const typeOptions: { value: TypeFilter; label: string }[] = [
    { value: "all", label: allLabel },
    ...allTypes
      .filter((type) => localizedPosts.some((post) => getDisplayPostType(post) === type))
      .map((type) => ({
        value: type,
        label: locale === "ko"
          ? ({ guide: "가이드", "news-explainer": "뉴스 해설", comparison: "비교", workflow: "워크플로우", trend: "트렌드", retrospective: "제작 기록", experiment: "실험" }[type])
          : ({ guide: "Guides", "news-explainer": "Explainers", comparison: "Comparisons", workflow: "Workflows", trend: "Trends", retrospective: "Build notes", experiment: "Experiments" }[type]),
      })),
  ];

  const featuredPosts = localizedPosts
    .filter((post) => getDisplayPostType(post) !== "update")
    .filter((post) => getDisplayPostType(post) === "guide" || getDisplayPostType(post) === "retrospective")
    .slice(0, 3);

  const resetFilters = () => {
    setTypeFilter("all");
    setCategoryFilter("all");
    setToolFilter("all");
    setSortMode("newest");
    setQuery("");
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <section className="mb-12">
        <p className="zhs-eyebrow text-primary/60">{eyebrow}</p>
        <h1 className="mt-6 text-5xl font-black tracking-tight md:text-7xl text-gradient">{title}</h1>
        <p className="mt-8 max-w-3xl text-xl text-muted leading-relaxed">{lead}</p>
      </section>

      {featuredPosts.length > 0 && (
        <section className="mb-12 rounded-3xl border border-border bg-card/50 p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted/70">
              {locale === "ko" ? "먼저 읽기 좋은 글" : "Featured posts"}
            </h2>
            <span className="font-mono text-[11px] text-muted/40">{localizedPosts.length} posts</span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {featuredPosts.map((post) => {
              const content = getPostContent(post, locale);
              return (
                <button
                  key={post.slug}
                  type="button"
                  onClick={() => {
                    setTypeFilter(getDisplayPostType(post));
                    setCategoryFilter("all");
                    setToolFilter("all");
                    setQuery(content.title);
                  }}
                  className="rounded-2xl border border-border bg-background p-4 text-left transition-colors hover:border-primary"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                    {getPostTypeLabel(post, locale)}
                  </span>
                  <span className="mt-2 block line-clamp-2 text-sm font-extrabold leading-tight text-foreground">
                    {content.title}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <section className="mb-10 rounded-3xl border border-border bg-background/80 p-4 md:p-5" aria-label={locale === "ko" ? "글 필터" : "Post filters"}>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_180px_180px_160px]">
          <label className="block">
            <span className="mb-2 block text-[11px] font-black uppercase tracking-widest text-muted/60">
              {locale === "ko" ? "검색" : "Search"}
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={locale === "ko" ? "제목, 태그, 관련 툴 검색" : "Search title, tags, tools"}
              className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium outline-none transition-colors placeholder:text-muted/40 focus:border-primary"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[11px] font-black uppercase tracking-widest text-muted/60">
              {locale === "ko" ? "카테고리" : "Category"}
            </span>
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="w-full rounded-2xl border border-border bg-card px-3 py-3 text-sm font-bold outline-none focus:border-primary"
            >
              <option value="all">{locale === "ko" ? "전체 카테고리" : "All categories"}</option>
              {availableCategories.map((category) => (
                <option key={category} value={category}>{getPostCategoryLabel(category, locale)}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-[11px] font-black uppercase tracking-widest text-muted/60">
              {locale === "ko" ? "관련 툴" : "Related tool"}
            </span>
            <select
              value={toolFilter}
              onChange={(event) => setToolFilter(event.target.value)}
              className="w-full rounded-2xl border border-border bg-card px-3 py-3 text-sm font-bold outline-none focus:border-primary"
            >
              <option value="all">{locale === "ko" ? "전체 툴" : "All tools"}</option>
              {availableTools.map((slug) => {
                const pseudoPost = { relatedToolSlugs: [slug] } as Post;
                const label = getRelatedToolLabels(pseudoPost, locale, 1)[0]?.label ?? slug;
                return <option key={slug} value={slug}>{label}</option>;
              })}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-[11px] font-black uppercase tracking-widest text-muted/60">
              {locale === "ko" ? "정렬" : "Sort"}
            </span>
            <select
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as SortMode)}
              className="w-full rounded-2xl border border-border bg-card px-3 py-3 text-sm font-bold outline-none focus:border-primary"
            >
              <option value="newest">{locale === "ko" ? "최신순" : "Newest"}</option>
              <option value="oldest">{locale === "ko" ? "오래된순" : "Oldest"}</option>
              <option value="reading">{locale === "ko" ? "긴 글 우선" : "Reading time"}</option>
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <SegmentedTabs<TypeFilter>
            ariaLabel={locale === "ko" ? "글 유형 필터" : "Post type filter"}
            value={typeFilter}
            onChange={setTypeFilter}
            options={typeOptions}
            size="sm"
          />
          <div className="flex items-center gap-3">
            <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-muted/50">
              {locale === "ko" ? `${visiblePosts.length}개 결과` : `${visiblePosts.length} results`}
            </p>
            {(query || typeFilter !== "all" || categoryFilter !== "all" || toolFilter !== "all" || sortMode !== "newest") && (
              <button type="button" onClick={resetFilters} className="rounded-full border border-border px-3 py-1.5 text-[11px] font-bold text-muted transition-colors hover:border-primary hover:text-primary">
                {locale === "ko" ? "초기화" : "Reset"}
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {visiblePosts.length > 0 ? (
          visiblePosts.map((post) => <PostCard key={post.slug} post={post} />)
        ) : (
          <div className="col-span-full py-20 text-center zhs-card border-dashed">
             <p className="text-muted font-bold uppercase tracking-widest italic">
              {locale === "ko" ? "조건에 맞는 글이 없습니다." : "No matching posts found."}
             </p>
             <button type="button" onClick={resetFilters} className="mt-4 rounded-full bg-primary px-4 py-2 text-xs font-black uppercase tracking-widest text-white">
              {locale === "ko" ? "필터 초기화" : "Reset filters"}
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
